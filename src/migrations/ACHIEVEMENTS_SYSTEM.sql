/**
 * ACHIEVEMENTS_SYSTEM.sql
 *
 * Adds gamification via achievements/badges system.
 *
 * Tables:
 *   - achievements: Catalog of all possible badges (not per-child)
 *   - child_achievements: Per-child earned badges
 *
 * Functions:
 *   - check_and_award_achievements(childId): Evaluates all unearned achievements
 *     and inserts newly met ones into child_achievements
 *
 * After running:
 *   1. Run backfill script to catch existing children who've earned badges
 *   2. npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
 */

-- ============================================================================
-- 1. ACHIEVEMENTS TABLE (Catalog)
-- ============================================================================
--
-- Global catalog of all possible achievements.
-- Not per-child; one row per unique badge type.
--

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- 'first_letter', 'alphabet_explorer', etc.
  name TEXT NOT NULL,        -- "First Letter", "Alphabet Explorer"
  icon TEXT NOT NULL,        -- 🏆, 🔤, 🎵, etc.
  description TEXT NOT NULL, -- How to earn it
  criteria_type TEXT NOT NULL, -- 'activity_prefix_count', 'streak_length', 'first_activity'
  criteria_value TEXT,       -- JSON or structured value (e.g., "letter_|10" means count letter_* activities >= 10)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_achievements_code ON public.achievements(code);

-- ============================================================================
-- 2. CHILD_ACHIEVEMENTS TABLE (Per-Child Earned Badges)
-- ============================================================================
--
-- Which achievements each child has earned.
-- Unique on (child_id, achievement_id) to prevent duplicates.
--

CREATE TABLE IF NOT EXISTS public.child_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_child_achievements_child_id ON public.child_achievements(child_id);
CREATE INDEX IF NOT EXISTS idx_child_achievements_achievement_id ON public.child_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_child_achievements_earned_at ON public.child_achievements(earned_at DESC);

-- ============================================================================
-- 3. SEED ACHIEVEMENTS CATALOG
-- ============================================================================
--
-- Insert default achievements. Uses ON CONFLICT to make this idempotent.
--

INSERT INTO public.achievements (code, name, icon, description, criteria_type, criteria_value)
VALUES
  -- Activity Completion Badges
  (
    'first_letter',
    'First Letter',
    '🏆',
    'Completed your first letter activity',
    'first_activity',
    'letter_'
  ),
  (
    'alphabet_explorer',
    'Alphabet Explorer',
    '🔤',
    'Completed 10 letter activities',
    'activity_prefix_count',
    'letter_|10'
  ),
  (
    'number_champion',
    'Number Champion',
    '🔢',
    'Completed 10 number activities',
    'activity_prefix_count',
    'number_|10'
  ),
  (
    'story_explorer',
    'Story Explorer',
    '📚',
    'Completed 5 story activities',
    'activity_prefix_count',
    'story_|5'
  ),
  (
    'vocabulary_builder',
    'Vocabulary Builder',
    '📖',
    'Completed 5 vocabulary activities',
    'activity_prefix_count',
    'vocab_|5'
  ),
  -- Streak Badges
  (
    'consistent_learner',
    'Consistent Learner',
    '🔥',
    'Reached a 7-day learning streak',
    'streak_length',
    '7'
  ),
  (
    'streak_master',
    'Streak Master',
    '🔥🔥',
    'Reached a 30-day learning streak',
    'streak_length',
    '30'
  ),
  -- Additional badges (expandable)
  (
    'world_explorer',
    'World Explorer',
    '🌍',
    'Completed 3 world activities',
    'activity_prefix_count',
    'world_|3'
  )
ON CONFLICT(code) DO NOTHING;

-- ============================================================================
-- 4. FUNCTION: check_and_award_achievements()
-- ============================================================================
--
-- Evaluates all unearned achievements for a child.
-- Checks against child_progress, child_profiles (streaks), and child_daily_challenge_attempts.
-- Inserts newly met achievements into child_achievements.
--
-- Returns: Number of achievements newly awarded
--

CREATE OR REPLACE FUNCTION check_and_award_achievements(p_child_id UUID)
RETURNS TABLE(
  achievements_awarded INTEGER,
  new_achievement_ids UUID[]
) AS $$
DECLARE
  v_achievements_awarded INTEGER := 0;
  v_new_achievement_ids UUID[] := ARRAY[]::UUID[];
  v_achievement_row achievements;
  v_should_award BOOLEAN;
  v_prefix TEXT;
  v_count INTEGER;
  v_threshold INTEGER;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Get current child streak values
  SELECT current_streak, longest_streak
  INTO v_current_streak, v_longest_streak
  FROM child_profiles
  WHERE id = p_child_id;
  
  IF v_current_streak IS NULL THEN
    v_current_streak := 0;
    v_longest_streak := 0;
  END IF;

  -- Loop through all achievements not yet earned by this child
  FOR v_achievement_row IN
    SELECT a.*
    FROM achievements a
    LEFT JOIN child_achievements ca ON ca.achievement_id = a.id AND ca.child_id = p_child_id
    WHERE ca.id IS NULL -- Not yet earned
  LOOP
    v_should_award := FALSE;

    -- ────────────────────────────────────────────────────────────────────
    -- CRITERIA TYPE: first_activity
    -- Check if child completed any activity with this prefix
    -- ────────────────────────────────────────────────────────────────────
    IF v_achievement_row.criteria_type = 'first_activity' THEN
      v_prefix := v_achievement_row.criteria_value;
      
      SELECT EXISTS(
        SELECT 1 FROM child_progress
        WHERE child_id = p_child_id
          AND status = 'completed'
          AND activity_ref LIKE v_prefix || '%'
        LIMIT 1
      ) INTO v_should_award;
    END IF;

    -- ────────────────────────────────────────────────────────────────────
    -- CRITERIA TYPE: activity_prefix_count
    -- Check if child completed N activities with this prefix
    -- Format: "prefix_|count" e.g., "letter_|10"
    -- ────────────────────────────────────────────────────────────────────
    IF v_achievement_row.criteria_type = 'activity_prefix_count' THEN
      -- Parse criteria_value: "letter_|10" → prefix="letter_", threshold=10
      v_prefix := SPLIT_PART(v_achievement_row.criteria_value, '|', 1);
      v_threshold := SPLIT_PART(v_achievement_row.criteria_value, '|', 2)::INTEGER;
      
      SELECT COUNT(*)
      INTO v_count
      FROM child_progress
      WHERE child_id = p_child_id
        AND status = 'completed'
        AND activity_ref LIKE v_prefix || '%';
      
      v_should_award := v_count >= v_threshold;
    END IF;

    -- ────────────────────────────────────────────────────────────────────
    -- CRITERIA TYPE: streak_length
    -- Check if child's longest streak >= threshold
    -- ────────────────────────────────────────────────────────────────────
    IF v_achievement_row.criteria_type = 'streak_length' THEN
      v_threshold := v_achievement_row.criteria_value::INTEGER;
      v_should_award := v_longest_streak >= v_threshold;
    END IF;

    -- ────────────────────────────────────────────────────────────────────
    -- If criteria met, insert into child_achievements
    -- ────────────────────────────────────────────────────────────────────
    IF v_should_award THEN
      INSERT INTO child_achievements (child_id, achievement_id)
      VALUES (p_child_id, v_achievement_row.id)
      ON CONFLICT DO NOTHING;
      
      v_achievements_awarded := v_achievements_awarded + 1;
      v_new_achievement_ids := array_append(v_new_achievement_ids, v_achievement_row.id);
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_achievements_awarded, v_new_achievement_ids;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_and_award_achievements(UUID) TO authenticated;

-- ============================================================================
-- 5. HELPER FUNCTION: get_child_achievements()
-- ============================================================================
--
-- Get all earned achievements for a child with details.
--

CREATE OR REPLACE FUNCTION get_child_achievements(p_child_id UUID)
RETURNS TABLE(
  achievement_id UUID,
  code TEXT,
  name TEXT,
  icon TEXT,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
  a.id,
  a.code,
  a.name,
  a.icon,
  a.description,
  ca.earned_at
FROM achievements a
INNER JOIN child_achievements ca ON ca.achievement_id = a.id
WHERE ca.child_id = p_child_id
ORDER BY ca.earned_at DESC;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_child_achievements(UUID) TO authenticated;

-- ============================================================================
-- 6. HELPER FUNCTION: get_child_all_achievements()
-- ============================================================================
--
-- Get all achievements (earned + unearned) for progress display.
--

CREATE OR REPLACE FUNCTION get_child_all_achievements(p_child_id UUID)
RETURNS TABLE(
  achievement_id UUID,
  code TEXT,
  name TEXT,
  icon TEXT,
  description TEXT,
  earned BOOLEAN,
  earned_at TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
  a.id,
  a.code,
  a.name,
  a.icon,
  a.description,
  ca.id IS NOT NULL as earned,
  ca.earned_at
FROM achievements a
LEFT JOIN child_achievements ca ON ca.achievement_id = a.id AND ca.child_id = p_child_id
ORDER BY COALESCE(ca.earned_at, CURRENT_TIMESTAMP) DESC;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_child_all_achievements(UUID) TO authenticated;
