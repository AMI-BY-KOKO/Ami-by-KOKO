-- ============================================================================
-- STREAKS SYSTEM (CORRECTED: references children.id)
-- Run this after 20240012_daily_challenges_system.sql
-- ============================================================================

-- ============================================================================
-- PART 1: Add streak columns to children table
-- ============================================================================

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- ============================================================================
-- PART 2: Create streak_milestones table (for tracking achievements)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  milestone_day INTEGER NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, milestone_day)
);

CREATE INDEX IF NOT EXISTS idx_streak_milestones_child_id 
  ON public.streak_milestones(child_id);

-- ============================================================================
-- PART 3: record_activity FUNCTION (handles streak logic)
-- ============================================================================

DROP FUNCTION IF EXISTS record_activity(UUID);

CREATE OR REPLACE FUNCTION record_activity(p_child_id UUID)
RETURNS TABLE(
  current_streak INTEGER,
  longest_streak INTEGER,
  last_active_date DATE,
  streak_increased BOOLEAN,
  is_milestone BOOLEAN,
  milestone_day INTEGER
) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := v_today - INTERVAL '1 day';
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_last_active_date DATE;
  v_streak_increased BOOLEAN := false;
  v_is_milestone BOOLEAN := false;
  v_milestone_day INTEGER := 0;
  v_milestone_list INTEGER[] := ARRAY[3, 7, 14, 30, 100];
  v_existing_milestone BOOLEAN;
BEGIN
  -- Get current child streak state
  SELECT current_streak, longest_streak, last_active_date
  INTO v_current_streak, v_longest_streak, v_last_active_date
  FROM public.children
  WHERE id = p_child_id;

  v_current_streak := COALESCE(v_current_streak, 0);
  v_longest_streak := COALESCE(v_longest_streak, 0);

  -- Update streak based on last activity date
  IF v_last_active_date IS NULL THEN
    -- First activity ever
    v_current_streak := 1;
    v_longest_streak := 1;
    v_streak_increased := true;
  ELSIF v_last_active_date = v_today THEN
    -- Already active today, no streak change
    v_streak_increased := false;
  ELSIF v_last_active_date = v_yesterday THEN
    -- Active yesterday, increment streak
    v_current_streak := v_current_streak + 1;
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
    v_streak_increased := true;
  ELSE
    -- Gap > 1 day, reset streak
    v_current_streak := 1;
    v_streak_increased := true;
  END IF;

  -- Update last active date
  v_last_active_date := v_today;

  -- Update children table
  UPDATE public.children
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_active_date = v_last_active_date
  WHERE id = p_child_id;

  -- Check for milestone achievements
  FOREACH v_milestone_day IN ARRAY v_milestone_list LOOP
    IF v_current_streak >= v_milestone_day THEN
      -- Check if this milestone has already been recorded
      SELECT EXISTS(
        SELECT 1 FROM public.streak_milestones
        WHERE child_id = p_child_id AND milestone_day = v_milestone_day
      ) INTO v_existing_milestone;

      IF NOT v_existing_milestone THEN
        -- Record this milestone
        INSERT INTO public.streak_milestones (child_id, milestone_day)
        VALUES (p_child_id, v_milestone_day);

        v_is_milestone := true;
        EXIT; -- Return the first newly-achieved milestone
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT
    v_current_streak,
    v_longest_streak,
    v_last_active_date,
    v_streak_increased,
    v_is_milestone,
    v_milestone_day;
END;
$$ LANGUAGE plpgsql;
