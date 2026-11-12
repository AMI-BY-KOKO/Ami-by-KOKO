-- ============================================================================
-- REFERRAL LEADERBOARD & PRIVACY SETTINGS
-- Run this after 20240020_referral_system.sql
-- ============================================================================

-- ============================================================================
-- PART 1: Add privacy/leaderboard opt-in fields to profiles
-- ============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_on_leaderboard BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS public_display_name TEXT;

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_show_on_leaderboard 
  ON public.profiles(show_on_leaderboard) 
  WHERE show_on_leaderboard = true;


-- ============================================================================
-- PART 2: VIEW — leaderboard_rankings_all_time
-- Materialized view for all-time leaderboard (for performance)
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_rankings_all_time CASCADE;

CREATE MATERIALIZED VIEW public.leaderboard_rankings_all_time AS
SELECT
  ROW_NUMBER() OVER (ORDER BY COUNT(re.id) DESC, MIN(re.referred_at) ASC)::INT as rank,
  rs.profile_id,
  COUNT(re.id) FILTER (WHERE re.attribution_status = 'active')::BIGINT as active_referrals,
  COUNT(re.id)::BIGINT as total_attributed,
  MAX(re.referred_at) as last_referral_date,
  p.full_name,
  p.public_display_name,
  p.show_on_leaderboard
FROM public.referral_stats rs
LEFT JOIN public.referral_events re ON rs.profile_id = re.referrer_profile_id
LEFT JOIN public.profiles p ON rs.profile_id = p.id
WHERE p.show_on_leaderboard = true
GROUP BY rs.profile_id, p.full_name, p.public_display_name, p.show_on_leaderboard
HAVING COUNT(re.id) > 0
ORDER BY rank ASC;

CREATE INDEX IF NOT EXISTS idx_leaderboard_all_time_rank 
  ON public.leaderboard_rankings_all_time(rank);


-- ============================================================================
-- PART 3: FUNCTION — get_monthly_leaderboard()
-- Calculate monthly leaderboard for a given month
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_monthly_leaderboard(
  p_year INT DEFAULT EXTRACT(YEAR FROM now())::INT,
  p_month INT DEFAULT EXTRACT(MONTH FROM now())::INT
)
RETURNS TABLE(
  rank INT,
  profile_id UUID,
  active_referrals BIGINT,
  total_attributed BIGINT,
  last_referral_date TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  public_display_name TEXT,
  show_on_leaderboard BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY COUNT(re.id) DESC, MIN(re.referred_at) ASC)::INT,
    rs.profile_id,
    COUNT(re.id) FILTER (WHERE re.attribution_status = 'active')::BIGINT,
    COUNT(re.id)::BIGINT,
    MAX(re.referred_at),
    p.full_name,
    p.public_display_name,
    p.show_on_leaderboard
  FROM public.referral_stats rs
  LEFT JOIN public.referral_events re ON rs.profile_id = re.referrer_profile_id
  LEFT JOIN public.profiles p ON rs.profile_id = p.id
  WHERE p.show_on_leaderboard = true
    AND EXTRACT(YEAR FROM re.referred_at) = p_year
    AND EXTRACT(MONTH FROM re.referred_at) = p_month
  GROUP BY rs.profile_id, p.full_name, p.public_display_name, p.show_on_leaderboard
  HAVING COUNT(re.id) > 0
  ORDER BY COUNT(re.id) DESC, MIN(re.referred_at) ASC;
END;
$$ LANGUAGE plpgsql STABLE;


-- ============================================================================
-- PART 4: FUNCTION — get_user_leaderboard_position()
-- Get a specific user's rank and details (even if not in top N)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_leaderboard_position(
  p_profile_id UUID,
  p_period TEXT DEFAULT 'all_time',
  p_year INT DEFAULT EXTRACT(YEAR FROM now())::INT,
  p_month INT DEFAULT EXTRACT(MONTH FROM now())::INT
)
RETURNS TABLE(
  rank INT,
  profile_id UUID,
  active_referrals BIGINT,
  total_attributed BIGINT,
  last_referral_date TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  public_display_name TEXT
) AS $$
BEGIN
  IF p_period = 'monthly' THEN
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COUNT(re.id) DESC, MIN(re.referred_at) ASC)::INT,
      rs.profile_id,
      COUNT(re.id) FILTER (WHERE re.attribution_status = 'active')::BIGINT,
      COUNT(re.id)::BIGINT,
      MAX(re.referred_at),
      p.full_name,
      p.public_display_name
    FROM public.referral_stats rs
    LEFT JOIN public.referral_events re ON rs.profile_id = re.referrer_profile_id
    LEFT JOIN public.profiles p ON rs.profile_id = p.id
    WHERE rs.profile_id = p_profile_id
      AND EXTRACT(YEAR FROM re.referred_at) = p_year
      AND EXTRACT(MONTH FROM re.referred_at) = p_month
    GROUP BY rs.profile_id, p.full_name, p.public_display_name
    HAVING COUNT(re.id) > 0;
  ELSE
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COUNT(re.id) DESC, MIN(re.referred_at) ASC)::INT,
      rs.profile_id,
      COUNT(re.id) FILTER (WHERE re.attribution_status = 'active')::BIGINT,
      COUNT(re.id)::BIGINT,
      MAX(re.referred_at),
      p.full_name,
      p.public_display_name
    FROM public.referral_stats rs
    LEFT JOIN public.referral_events re ON rs.profile_id = re.referrer_profile_id
    LEFT JOIN public.profiles p ON rs.profile_id = p.id
    WHERE rs.profile_id = p_profile_id
    GROUP BY rs.profile_id, p.full_name, p.public_display_name
    HAVING COUNT(re.id) > 0;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;


-- ============================================================================
-- PART 5: ROW LEVEL SECURITY
-- Leaderboard is public (read-only), privacy settings are user-controlled
-- Note: RLS cannot be applied to materialized views, so the view is publicly readable
-- ============================================================================

-- Users can update their own privacy settings
DROP POLICY IF EXISTS "users_update_own_privacy_settings" ON public.profiles;
CREATE POLICY "users_update_own_privacy_settings"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ============================================================================
-- PART 6: MATERIALIZED VIEW REFRESH HELPER
-- Refresh all-time leaderboard after referral attribution
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_leaderboard_rankings()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_rankings_all_time;
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  -- Silently fail if view is locked - next refresh will try again
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to refresh leaderboard after new referral
DROP TRIGGER IF EXISTS refresh_leaderboard_on_referral ON public.referral_events;
CREATE TRIGGER refresh_leaderboard_on_referral
  AFTER INSERT ON public.referral_events
  FOR EACH STATEMENT
  EXECUTE PROCEDURE public.refresh_leaderboard_rankings();
