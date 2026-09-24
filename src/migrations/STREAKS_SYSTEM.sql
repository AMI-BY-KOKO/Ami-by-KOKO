/**
 * STREAKS_SYSTEM.sql
 * 
 * Adds streak tracking to child_profiles.
 * 
 * Columns:
 *   - current_streak: integer, default 0 — consecutive days of activity
 *   - longest_streak: integer, default 0 — personal best streak
 *   - last_active_date: date, nullable — last day activity was recorded
 * 
 * All day boundaries use UTC (CURRENT_DATE) for consistency with daily_challenges.
 * 
 * After running this:
 *   1. Run the backfill query at the bottom to calculate existing streaks
 *   2. npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
 */

-- 1. Add streak columns to child_profiles
ALTER TABLE child_profiles
ADD COLUMN current_streak INTEGER DEFAULT 0,
ADD COLUMN longest_streak INTEGER DEFAULT 0,
ADD COLUMN last_active_date DATE;

-- 2. Create the record_activity() function
-- This is called every time an activity completes (learning path or daily challenge)
CREATE OR REPLACE FUNCTION record_activity(p_child_id UUID)
RETURNS TABLE (
  child_id UUID,
  current_streak INTEGER,
  longest_streak INTEGER,
  last_active_date DATE,
  streak_increased BOOLEAN,
  is_milestone BOOLEAN,
  milestone_day INTEGER
) AS $$
DECLARE
  v_last_active_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_today DATE;
  v_streak_increased BOOLEAN := FALSE;
  v_is_milestone BOOLEAN := FALSE;
  v_milestone_day INTEGER := 0;
BEGIN
  v_today := CURRENT_DATE;
  
  -- Get current streak info
  SELECT last_active_date, current_streak, longest_streak
  INTO v_last_active_date, v_current_streak, v_longest_streak
  FROM child_profiles
  WHERE id = p_child_id;
  
  -- If no child found, return early
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Child profile not found: %', p_child_id;
  END IF;
  
  -- Initialize defaults if NULL
  v_current_streak := COALESCE(v_current_streak, 0);
  v_longest_streak := COALESCE(v_longest_streak, 0);
  
  -- Case 1: Already active today (last_active_date = today) — no-op
  IF v_last_active_date = v_today THEN
    RETURN QUERY
    SELECT p_child_id, v_current_streak, v_longest_streak, v_last_active_date, FALSE, FALSE, 0;
    RETURN;
  END IF;
  
  -- Case 2: Streak continues (last_active_date = yesterday)
  IF v_last_active_date = v_today - INTERVAL '1 day'::INTERVAL THEN
    v_current_streak := v_current_streak + 1;
    v_streak_increased := TRUE;
    
    -- Update longest_streak if beaten
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
    
    -- Check for milestone (3, 7, 14, 30, 100)
    IF v_current_streak IN (3, 7, 14, 30, 100) THEN
      v_is_milestone := TRUE;
      v_milestone_day := v_current_streak;
    END IF;
  ELSE
    -- Case 3: Streak broken (last_active_date older or NULL) — reset to 1
    v_current_streak := 1;
    v_streak_increased := TRUE;
    -- Don't update longest_streak on reset
  END IF;
  
  -- Update child_profiles
  UPDATE child_profiles
  SET 
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_active_date = v_today
  WHERE id = p_child_id;
  
  -- Return the updated state
  RETURN QUERY
  SELECT 
    p_child_id,
    v_current_streak,
    v_longest_streak,
    v_today,
    v_streak_increased,
    v_is_milestone,
    v_milestone_day;
END;
$$ LANGUAGE plpgsql;

-- 3. Grant execute permission if using RLS with service role
GRANT EXECUTE ON FUNCTION record_activity(UUID) TO authenticated;

-- ============================================================================
-- BACKFILL QUERY (run after all three statements above)
-- ============================================================================
-- This calculates existing streaks from child_daily_challenge_attempts
-- Copy and run this query separately to see the backfill logic before applying

/*
-- BACKFILL: Calculate current_streak, longest_streak, last_active_date
-- for children with existing daily challenge history

WITH child_dates AS (
  -- Get all completed challenge dates per child, sorted descending
  SELECT 
    child_id,
    challenge_date,
    ROW_NUMBER() OVER (PARTITION BY child_id ORDER BY challenge_date DESC) AS rn
  FROM child_daily_challenge_attempts
  WHERE completed = TRUE
  ORDER BY child_id, challenge_date DESC
),
streak_ends AS (
  -- Find where streaks end (gap between consecutive dates)
  SELECT 
    child_id,
    challenge_date,
    rn,
    (challenge_date - rn * INTERVAL '1 day'::INTERVAL)::DATE AS streak_group
  FROM child_dates
),
streak_groups AS (
  -- Group consecutive dates into streaks
  SELECT 
    child_id,
    streak_group,
    MIN(challenge_date) AS streak_start,
    MAX(challenge_date) AS streak_end,
    COUNT(*) AS streak_length
  FROM streak_ends
  GROUP BY child_id, streak_group
),
current_streaks AS (
  -- For each child, find the current streak (most recent)
  SELECT 
    sg.child_id,
    sg.streak_length AS current_streak,
    sg.streak_end AS last_active_date
  FROM streak_groups sg
  INNER JOIN (
    SELECT child_id, MAX(streak_end) AS max_end
    FROM streak_groups
    GROUP BY child_id
  ) latest ON sg.child_id = latest.child_id AND sg.streak_end = latest.max_end
),
longest_streaks AS (
  -- For each child, find the longest streak ever
  SELECT 
    child_id,
    MAX(streak_length) AS longest_streak
  FROM streak_groups
  GROUP BY child_id
)
SELECT 
  cs.child_id,
  cs.current_streak,
  ls.longest_streak,
  cs.last_active_date,
  'Ready to backfill' AS status
FROM current_streaks cs
LEFT JOIN longest_streaks ls ON cs.child_id = ls.child_id
ORDER BY cs.child_id;

-- Then apply this UPDATE to actually backfill:
UPDATE child_profiles cp
SET 
  current_streak = backfill.current_streak,
  longest_streak = backfill.longest_streak,
  last_active_date = backfill.last_active_date
FROM (
  WITH child_dates AS (
    SELECT 
      child_id,
      challenge_date,
      ROW_NUMBER() OVER (PARTITION BY child_id ORDER BY challenge_date DESC) AS rn
    FROM child_daily_challenge_attempts
    WHERE completed = TRUE
  ),
  streak_ends AS (
    SELECT 
      child_id,
      challenge_date,
      rn,
      (challenge_date - rn * INTERVAL '1 day'::INTERVAL)::DATE AS streak_group
    FROM child_dates
  ),
  streak_groups AS (
    SELECT 
      child_id,
      streak_group,
      COUNT(*) AS streak_length,
      MAX(challenge_date) AS streak_end
    FROM streak_ends
    GROUP BY child_id, streak_group
  ),
  current_streaks AS (
    SELECT 
      sg.child_id,
      sg.streak_length AS current_streak,
      sg.streak_end AS last_active_date
    FROM streak_groups sg
    INNER JOIN (
      SELECT child_id, MAX(streak_end) AS max_end
      FROM streak_groups
      GROUP BY child_id
    ) latest ON sg.child_id = latest.child_id AND sg.streak_end = latest.max_end
  ),
  longest_streaks AS (
    SELECT 
      child_id,
      MAX(streak_length) AS longest_streak
    FROM streak_groups
    GROUP BY child_id
  )
  SELECT 
    cs.child_id,
    cs.current_streak,
    COALESCE(ls.longest_streak, 0) AS longest_streak,
    cs.last_active_date
  FROM current_streaks cs
  LEFT JOIN longest_streaks ls ON cs.child_id = ls.child_id
) backfill
WHERE cp.id = backfill.child_id;
*/
