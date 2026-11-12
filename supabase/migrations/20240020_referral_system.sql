-- ============================================================================
-- REFERRAL & AMBASSADOR TRACKING SYSTEM
-- Run this after 20240019_add_heard_count_to_child_progress.sql
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE REFERRAL CODES TABLE
-- One unique, permanent code per eligible user (parents/school admins)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9]{6,8}$'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_profile ON public.referral_codes(profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_status ON public.referral_codes(status);


-- ============================================================================
-- PART 2: CREATE REFERRAL EVENTS TABLE
-- Record successful referrals with full attribution trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE RESTRICT,
  referred_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referrer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attribution_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (attribution_status IN ('pending', 'confirmed', 'active', 'churned')),
  referred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  subscription_activated_at TIMESTAMP WITH TIME ZONE,
  -- Fraud & audit fields
  referrer_ip_hash TEXT,
  referred_ip_hash TEXT,
  user_agent_hash TEXT,
  fraud_score INT DEFAULT 0,
  fraud_flags TEXT[],
  -- Ensure one referral per referred user (no duplicate attribution)
  CONSTRAINT unique_referred_profile UNIQUE(referred_profile_id),
  -- Prevent self-referral
  CONSTRAINT no_self_referral CHECK(referrer_profile_id != referred_profile_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_events_code ON public.referral_events(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referral_events_referred ON public.referral_events(referred_profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_events_referrer ON public.referral_events(referrer_profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_events_status ON public.referral_events(attribution_status);
CREATE INDEX IF NOT EXISTS idx_referral_events_referred_at ON public.referral_events(referred_at);


-- ============================================================================
-- PART 3: CREATE REFERRAL STATISTICS TABLE (CACHED/MATERIALIZED)
-- Denormalized stats for performance (updated via trigger/function)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.referral_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_codes_generated INT DEFAULT 0,
  total_referrals_attributed INT DEFAULT 0,
  confirmed_referrals INT DEFAULT 0,
  active_subscriptions INT DEFAULT 0,
  churned_referrals INT DEFAULT 0,
  last_referral_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_stats_profile ON public.referral_stats(profile_id);


-- ============================================================================
-- PART 4: CREATE REFERRAL AUDIT TABLE
-- Immutable audit trail for fraud detection and compliance
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.referral_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'code_generated',
    'referral_attributed',
    'status_confirmed',
    'subscription_activated',
    'fraud_flagged',
    'code_revoked',
    'duplicate_attempt',
    'self_referral_attempt',
    'invalid_code_attempt'
  )),
  referral_event_id UUID REFERENCES public.referral_events(id) ON DELETE SET NULL,
  referral_code_id UUID REFERENCES public.referral_codes(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_audit_event_type ON public.referral_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_referral_audit_profile ON public.referral_audit_log(profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_audit_created ON public.referral_audit_log(created_at DESC);


-- ============================================================================
-- PART 5: FUNCTION — generate_referral_code()
-- Atomically generate unique referral code for a profile
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_referral_code(p_profile_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  code TEXT,
  error TEXT
) AS $$
DECLARE
  v_code TEXT;
  v_attempts INT := 0;
  v_max_attempts INT := 100;
  v_base_char TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  -- Check if profile already has a code
  IF EXISTS (SELECT 1 FROM public.referral_codes WHERE profile_id = p_profile_id) THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, 'Profile already has a referral code'::TEXT;
    RETURN;
  END IF;

  -- Generate unique code (max 100 attempts to avoid infinite loop)
  WHILE v_attempts < v_max_attempts LOOP
    v_code := '';
    FOR i IN 1..7 LOOP
      v_code := v_code || substr(v_base_char, floor(random() * 36)::INT + 1, 1);
    END LOOP;

    IF NOT EXISTS (SELECT 1 FROM public.referral_codes rc WHERE rc.code = v_code) THEN
      -- Insert the new code
      INSERT INTO public.referral_codes (profile_id, code)
      VALUES (p_profile_id, v_code)
      ON CONFLICT (profile_id) DO NOTHING;

      -- Log the event
      INSERT INTO public.referral_audit_log (event_type, referral_code_id, profile_id, details)
      SELECT 'code_generated', id, p_profile_id, jsonb_build_object('code', v_code)
      FROM public.referral_codes WHERE profile_id = p_profile_id;

      RETURN QUERY SELECT TRUE, v_code, NULL::TEXT;
      RETURN;
    END IF;

    v_attempts := v_attempts + 1;
  END LOOP;

  RETURN QUERY SELECT FALSE, NULL::TEXT, 'Failed to generate unique code after multiple attempts'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- PART 6: FUNCTION — attribute_referral()
-- Atomically create referral attribution with fraud checks
-- Validates: code exists, status active, not self-referral, not duplicate
-- ============================================================================

CREATE OR REPLACE FUNCTION public.attribute_referral(
  p_referral_code TEXT,
  p_referred_profile_id UUID,
  p_referrer_ip_hash TEXT DEFAULT NULL,
  p_referred_ip_hash TEXT DEFAULT NULL,
  p_user_agent_hash TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  referral_event_id UUID,
  error TEXT,
  fraud_score INT
) AS $$
DECLARE
  v_referral_code_id UUID;
  v_referrer_profile_id UUID;
  v_fraud_score INT := 0;
  v_fraud_flags TEXT[] := ARRAY[]::TEXT[];
  v_event_id UUID;
BEGIN
  -- Step 1: Validate referral code exists and is active
  SELECT rc.id, rc.profile_id INTO v_referral_code_id, v_referrer_profile_id
  FROM public.referral_codes rc
  WHERE rc.code = p_referral_code AND rc.status = 'active'
  LIMIT 1;

  IF v_referral_code_id IS NULL THEN
    INSERT INTO public.referral_audit_log (event_type, profile_id, details)
    VALUES ('invalid_code_attempt', p_referred_profile_id, 
            jsonb_build_object('code', p_referral_code));
    RETURN QUERY SELECT FALSE, NULL::UUID, 'Invalid or inactive referral code'::TEXT, 0;
    RETURN;
  END IF;

  -- Step 2: Prevent self-referral
  IF v_referrer_profile_id = p_referred_profile_id THEN
    v_fraud_score := v_fraud_score + 50;
    v_fraud_flags := array_append(v_fraud_flags, 'self_referral');
    INSERT INTO public.referral_audit_log (event_type, referral_code_id, profile_id, details)
    VALUES ('self_referral_attempt', v_referral_code_id, p_referred_profile_id,
            jsonb_build_object('referrer_id', v_referrer_profile_id));
  END IF;

  -- Step 3: Check for duplicate referral (same referred user already attributed)
  IF EXISTS (
    SELECT 1 FROM public.referral_events
    WHERE referred_profile_id = p_referred_profile_id
  ) THEN
    v_fraud_score := v_fraud_score + 100;
    v_fraud_flags := array_append(v_fraud_flags, 'duplicate_attribution');
    INSERT INTO public.referral_audit_log (event_type, profile_id, details)
    VALUES ('duplicate_attempt', p_referred_profile_id,
            jsonb_build_object('referred_profile_id', p_referred_profile_id));
    RETURN QUERY SELECT FALSE, NULL::UUID, 'This profile already has a referral attribution'::TEXT, v_fraud_score;
    RETURN;
  END IF;

  -- Step 4: Fraud checks (IP matching, user agent, etc.)
  -- If referrer IP == referred IP, increase fraud score (but allow for family/same device)
  IF p_referrer_ip_hash IS NOT NULL AND p_referred_ip_hash IS NOT NULL 
     AND p_referrer_ip_hash = p_referred_ip_hash THEN
    v_fraud_score := v_fraud_score + 20;
    v_fraud_flags := array_append(v_fraud_flags, 'same_ip');
  END IF;

  -- Step 5: Create referral event (atomic transaction)
  BEGIN
    INSERT INTO public.referral_events (
      referral_code_id,
      referred_profile_id,
      referrer_profile_id,
      attribution_status,
      referred_ip_hash,
      referrer_ip_hash,
      user_agent_hash,
      fraud_score,
      fraud_flags
    ) VALUES (
      v_referral_code_id,
      p_referred_profile_id,
      v_referrer_profile_id,
      CASE WHEN v_fraud_score > 50 THEN 'pending' ELSE 'confirmed' END,
      p_referred_ip_hash,
      p_referrer_ip_hash,
      p_user_agent_hash,
      v_fraud_score,
      v_fraud_flags
    )
    RETURNING id INTO v_event_id;

    -- Log successful attribution
    INSERT INTO public.referral_audit_log (event_type, referral_event_id, referral_code_id, profile_id, details)
    VALUES (
      'referral_attributed',
      v_event_id,
      v_referral_code_id,
      p_referred_profile_id,
      jsonb_build_object(
        'referrer_id', v_referrer_profile_id,
        'fraud_score', v_fraud_score,
        'fraud_flags', v_fraud_flags
      )
    );

    -- Update referral stats for referrer
    INSERT INTO public.referral_stats (profile_id, total_referrals_attributed, last_referral_date)
    VALUES (v_referrer_profile_id, 1, now())
    ON CONFLICT (profile_id) DO UPDATE SET
      total_referrals_attributed = referral_stats.total_referrals_attributed + 1,
      last_referral_date = now(),
      updated_at = now();

    RETURN QUERY SELECT TRUE, v_event_id, NULL::TEXT, v_fraud_score;
  EXCEPTION WHEN unique_violation THEN
    INSERT INTO public.referral_audit_log (event_type, profile_id, details)
    VALUES ('duplicate_attempt', p_referred_profile_id,
            jsonb_build_object('error', 'duplicate_key_violation'));
    RETURN QUERY SELECT FALSE, NULL::UUID, 'Referral already exists for this profile'::TEXT, 0;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- PART 7: FUNCTION — confirm_referral_status()
-- Called when referred user confirms email/completes onboarding
-- ============================================================================

CREATE OR REPLACE FUNCTION public.confirm_referral_status(
  p_referred_profile_id UUID,
  p_new_status TEXT DEFAULT 'active'
)
RETURNS TABLE(
  success BOOLEAN,
  error TEXT
) AS $$
DECLARE
  v_referral_event_id UUID;
  v_referrer_profile_id UUID;
BEGIN
  -- Validate status
  IF p_new_status NOT IN ('confirmed', 'active') THEN
    RETURN QUERY SELECT FALSE, 'Invalid status'::TEXT;
    RETURN;
  END IF;

  -- Find referral event for this profile
  SELECT id, referrer_profile_id INTO v_referral_event_id, v_referrer_profile_id
  FROM public.referral_events
  WHERE referred_profile_id = p_referred_profile_id
  LIMIT 1;

  IF v_referral_event_id IS NULL THEN
    -- No referral — this is OK (organic signup)
    RETURN QUERY SELECT TRUE, NULL::TEXT;
    RETURN;
  END IF;

  -- Update referral status
  UPDATE public.referral_events
  SET
    attribution_status = p_new_status,
    confirmed_at = now(),
    updated_at = now()
  WHERE id = v_referral_event_id;

  -- Update stats
  UPDATE public.referral_stats
  SET
    confirmed_referrals = CASE WHEN p_new_status = 'confirmed' THEN confirmed_referrals + 1 ELSE confirmed_referrals END,
    active_subscriptions = CASE WHEN p_new_status = 'active' THEN active_subscriptions + 1 ELSE active_subscriptions END,
    updated_at = now()
  WHERE profile_id = v_referrer_profile_id;

  -- Log the event
  INSERT INTO public.referral_audit_log (event_type, referral_event_id, profile_id, details)
  VALUES ('status_confirmed', v_referral_event_id, p_referred_profile_id,
          jsonb_build_object('new_status', p_new_status));

  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- PART 8: FUNCTION — increment_referral_stats()
-- Called when a referred user activates subscription
-- ============================================================================

CREATE OR REPLACE FUNCTION public.activate_referral_subscription(
  p_referred_profile_id UUID
)
RETURNS TABLE(
  success BOOLEAN,
  error TEXT
) AS $$
DECLARE
  v_referral_event_id UUID;
  v_referrer_profile_id UUID;
BEGIN
  -- Find referral event
  SELECT id, referrer_profile_id INTO v_referral_event_id, v_referrer_profile_id
  FROM public.referral_events
  WHERE referred_profile_id = p_referred_profile_id
  LIMIT 1;

  IF v_referral_event_id IS NULL THEN
    -- No referral — this is OK
    RETURN QUERY SELECT TRUE, NULL::TEXT;
    RETURN;
  END IF;

  -- Update referral event
  UPDATE public.referral_events
  SET
    attribution_status = 'active',
    subscription_activated_at = now(),
    updated_at = now()
  WHERE id = v_referral_event_id;

  -- Update stats
  UPDATE public.referral_stats
  SET
    active_subscriptions = active_subscriptions + 1,
    updated_at = now()
  WHERE profile_id = v_referrer_profile_id;

  -- Log the event
  INSERT INTO public.referral_audit_log (event_type, referral_event_id, profile_id, details)
  VALUES ('subscription_activated', v_referral_event_id, p_referred_profile_id,
          jsonb_build_object('referrer_id', v_referrer_profile_id));

  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- PART 9: FUNCTION — is_super_admin()
-- Helper function for RLS policies (must be created BEFORE policies)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_super_admin(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email = 'akinwoleolaclinton@gmail.com';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ============================================================================
-- PART 10: ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_audit_log ENABLE ROW LEVEL SECURITY;

-- ─── REFERRAL_CODES ──────────────────────────────────────────────
-- Users can view their own code; super admin can view all
DROP POLICY IF EXISTS "users_view_own_referral_code" ON public.referral_codes;
CREATE POLICY "users_view_own_referral_code"
  ON public.referral_codes FOR SELECT
  USING (profile_id = auth.uid() OR is_super_admin(auth.email()));

-- ─── REFERRAL_EVENTS ─────────────────────────────────────────────
-- Referrers can view referrals they created
-- Referred users can view their own referral attribution
DROP POLICY IF EXISTS "referrer_view_own_referrals" ON public.referral_events;
CREATE POLICY "referrer_view_own_referrals"
  ON public.referral_events FOR SELECT
  USING (
    referrer_profile_id = auth.uid()
    OR referred_profile_id = auth.uid()
    OR is_super_admin(auth.email())
  );

-- ─── REFERRAL_STATS ──────────────────────────────────────────────
-- Users can view their own stats
DROP POLICY IF EXISTS "users_view_own_referral_stats" ON public.referral_stats;
CREATE POLICY "users_view_own_referral_stats"
  ON public.referral_stats FOR SELECT
  USING (profile_id = auth.uid() OR is_super_admin(auth.email()));

-- ─── REFERRAL_AUDIT_LOG ──────────────────────────────────────────
-- Super admin only
DROP POLICY IF EXISTS "super_admin_view_audit_log" ON public.referral_audit_log;
CREATE POLICY "super_admin_view_audit_log"
  ON public.referral_audit_log FOR SELECT
  USING (is_super_admin(auth.email()));


-- ============================================================================
-- PART 11: TRIGGER — Auto-create referral code on profile creation
-- Every parent/school_admin gets a referral code automatically
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_referral_code_on_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_code TEXT;
  v_result RECORD;
BEGIN
  -- Only create for parent and school_admin roles
  IF NEW.role IN ('parent', 'school_admin') THEN
    SELECT * INTO v_result FROM public.generate_referral_code(NEW.id);
    
    IF NOT v_result.success THEN
      RAISE WARNING 'Failed to generate referral code for profile %: %', NEW.id, v_result.error;
    END IF;

    -- Initialize referral stats
    INSERT INTO public.referral_stats (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_created_generate_referral_code ON public.profiles;
CREATE TRIGGER on_profile_created_generate_referral_code
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.create_referral_code_on_profile();

