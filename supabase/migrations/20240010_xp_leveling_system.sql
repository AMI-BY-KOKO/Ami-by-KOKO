-- ============================================================================
-- XP & LEVELING SYSTEM MIGRATION (CORRECTED: references children.id)
-- Run this after the base schema migrations (20240001-20240009)
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE xp_events TABLE (append-only log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('lesson_complete', 'correct_answer', 'daily_challenge', 'weekly_goal')),
  xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast child lookups and reporting
CREATE INDEX IF NOT EXISTS idx_xp_events_child_id 
  ON public.xp_events(child_id);

CREATE INDEX IF NOT EXISTS idx_xp_events_created_at 
  ON public.xp_events(created_at);

-- Enable RLS
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can view XP events for their own children
DROP POLICY IF EXISTS "Parents can view child xp events" ON public.xp_events;
CREATE POLICY "Parents can view child xp events"
  ON public.xp_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = xp_events.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- RLS: Students can view their own XP events
DROP POLICY IF EXISTS "Students can view own xp events" ON public.xp_events;
CREATE POLICY "Students can view own xp events"
  ON public.xp_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = xp_events.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- RLS: Service role can insert (via function with SECURITY DEFINER)
DROP POLICY IF EXISTS "System can insert xp events" ON public.xp_events;
CREATE POLICY "System can insert xp events"
  ON public.xp_events
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- PART 2: LEVELING CURVE FUNCTION
-- ============================================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS calculate_level(INTEGER);

CREATE OR REPLACE FUNCTION calculate_level(xp_total INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level = floor(sqrt(xp_total / 50)) + 1, capped at 10
  RETURN LEAST(FLOOR(SQRT(xp_total::FLOAT / 50)) + 1, 10)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- PART 3: TRIGGER TO AUTO-UPDATE XP TOTAL & LEVEL ON children TABLE
-- ============================================================================

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_child_xp_total_on_insert ON public.xp_events;
DROP FUNCTION IF EXISTS update_child_xp_total();

-- When an xp_event is inserted, update child_profiles with new xp_total and current_level
CREATE OR REPLACE FUNCTION update_child_xp_total()
RETURNS TRIGGER AS $$
DECLARE
  v_new_xp_total INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Sum all XP events for this child
  SELECT COALESCE(SUM(xp_amount), 0)
  INTO v_new_xp_total
  FROM public.xp_events
  WHERE child_id = NEW.child_id;

  v_new_level := calculate_level(v_new_xp_total);

  -- Update child_profiles (if it exists)
  UPDATE public.child_profiles
  SET xp_total = v_new_xp_total,
      current_level = v_new_level,
      updated_at = now()
  WHERE parent_user_id = (
    SELECT parent_id FROM public.children WHERE id = NEW.child_id
  ) AND name = (
    SELECT name FROM public.children WHERE id = NEW.child_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_child_xp_total_on_insert
  AFTER INSERT ON public.xp_events
  FOR EACH ROW
  EXECUTE FUNCTION update_child_xp_total();

-- ============================================================================
-- PART 4: award_xp FUNCTION (idempotent, dedupes by child + source + hour)
-- ============================================================================

-- Drop existing function if it exists (may have conflicting signature)
DROP FUNCTION IF EXISTS award_xp(UUID, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION award_xp(
  p_child_id UUID,
  p_source TEXT,
  p_amount INTEGER
)
RETURNS TABLE(
  success BOOLEAN,
  new_xp_total INTEGER,
  new_level INTEGER,
  error TEXT
) AS $$
DECLARE
  v_existing_count INTEGER;
  v_new_xp_total INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Idempotency check: same source in same hour = dedupe
  SELECT COUNT(*)
  INTO v_existing_count
  FROM public.xp_events
  WHERE child_id = p_child_id
    AND source = p_source
    AND created_at >= date_trunc('hour', now());

  IF v_existing_count > 0 THEN
    -- Already awarded in this hour, return current totals
    SELECT COALESCE(SUM(xp_amount), 0)
    INTO v_new_xp_total
    FROM public.xp_events
    WHERE child_id = p_child_id;

    v_new_level := calculate_level(v_new_xp_total);

    RETURN QUERY SELECT true, v_new_xp_total, v_new_level, NULL::TEXT;
    RETURN;
  END IF;

  -- Insert new XP event
  INSERT INTO public.xp_events (child_id, source, xp_amount)
  VALUES (p_child_id, p_source, p_amount);

  -- Calculate new totals
  SELECT COALESCE(SUM(xp_amount), 0)
  INTO v_new_xp_total
  FROM public.xp_events
  WHERE child_id = p_child_id;

  v_new_level := calculate_level(v_new_xp_total);

  RETURN QUERY SELECT true, v_new_xp_total, v_new_level, NULL::TEXT;

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 0, 0, SQLERRM;
END;
$$ LANGUAGE plpgsql;
