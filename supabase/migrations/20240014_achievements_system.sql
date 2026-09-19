-- ============================================================================
-- ACHIEVEMENTS/BADGES SYSTEM (CORRECTED: references children.id)
-- Run this after 20240013_streaks_system.sql
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE achievements TABLE (global catalog)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria_type TEXT NOT NULL CHECK (criteria_type IN ('first_activity', 'activity_prefix_count', 'streak_length')),
  criteria_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_achievements_code ON public.achievements(code);

-- Enable RLS on achievements table and allow all authenticated users to read (catalog is public)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view achievements catalog" ON public.achievements;
CREATE POLICY "Authenticated users can view achievements catalog"
  ON public.achievements
  FOR SELECT
  USING (true);

-- ============================================================================
-- PART 2: CREATE child_achievements TABLE (per-child earned badges)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.child_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_child_achievements_child_id 
  ON public.child_achievements(child_id);

ALTER TABLE public.child_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view child achievements" ON public.child_achievements;
CREATE POLICY "Parents can view child achievements"
  ON public.child_achievements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_achievements.child_id
        AND c.parent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view own achievements" ON public.child_achievements;
CREATE POLICY "Students can view own achievements"
  ON public.child_achievements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_achievements.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage achievements" ON public.child_achievements;
CREATE POLICY "System can manage achievements"
  ON public.child_achievements
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 3: check_and_award_achievements FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS check_and_award_achievements(UUID);

CREATE OR REPLACE FUNCTION check_and_award_achievements(p_child_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  achievements_awarded INTEGER,
  new_achievement_ids UUID[],
  error TEXT
) AS $$
DECLARE
  v_achievement RECORD;
  v_count INTEGER;
  v_xp_total INTEGER;
  v_current_level INTEGER;
  v_current_streak INTEGER;
  v_new_achievements UUID[] := ARRAY[]::UUID[];
BEGIN
  -- Get child's current state
  SELECT current_streak INTO v_current_streak FROM public.children WHERE id = p_child_id;

  SELECT COALESCE(SUM(xp_amount), 0), 0
  INTO v_xp_total, v_current_level
  FROM public.xp_events
  WHERE child_id = p_child_id;

  v_current_level := LEAST(FLOOR(SQRT(v_xp_total::FLOAT / 50)) + 1, 10)::INTEGER;

  -- Check each unearned achievement
  FOR v_achievement IN
    SELECT a.* FROM public.achievements a
    WHERE NOT EXISTS (
      SELECT 1 FROM public.child_achievements ca
      WHERE ca.child_id = p_child_id
        AND ca.achievement_id = a.id
    )
  LOOP
    CASE v_achievement.criteria_type
      -- first_activity: first activity with prefix
      WHEN 'first_activity' THEN
        IF EXISTS (
          SELECT 1 FROM public.child_progress cp
          WHERE cp.child_id = p_child_id
            AND cp.activity_ref LIKE (v_achievement.criteria_value || '%')
            AND cp.status IN ('completed', 'mastered')
          LIMIT 1
        ) THEN
          INSERT INTO public.child_achievements (child_id, achievement_id)
          VALUES (p_child_id, v_achievement.id);
          v_new_achievements := array_append(v_new_achievements, v_achievement.id);
        END IF;

      -- activity_prefix_count: N activities with prefix
      WHEN 'activity_prefix_count' THEN
        DECLARE
          v_prefix TEXT;
          v_threshold INTEGER;
        BEGIN
          v_prefix := split_part(v_achievement.criteria_value, '|', 1);
          v_threshold := split_part(v_achievement.criteria_value, '|', 2)::INTEGER;

          SELECT COUNT(*)
          INTO v_count
          FROM public.child_progress cp
          WHERE cp.child_id = p_child_id
            AND cp.activity_ref LIKE (v_prefix || '%')
            AND cp.status IN ('completed', 'mastered');

          IF v_count >= v_threshold THEN
            INSERT INTO public.child_achievements (child_id, achievement_id)
            VALUES (p_child_id, v_achievement.id);
            v_new_achievements := array_append(v_new_achievements, v_achievement.id);
          END IF;
        END;

      -- streak_length: N-day streak
      WHEN 'streak_length' THEN
        IF v_current_streak >= v_achievement.criteria_value::INTEGER THEN
          INSERT INTO public.child_achievements (child_id, achievement_id)
          VALUES (p_child_id, v_achievement.id);
          v_new_achievements := array_append(v_new_achievements, v_achievement.id);
        END IF;
    END CASE;
  END LOOP;

  RETURN QUERY SELECT
    true,
    COALESCE(array_length(v_new_achievements, 1), 0),
    v_new_achievements,
    NULL::TEXT;

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 0, ARRAY[]::UUID[], SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION check_and_award_achievements(UUID) TO authenticated;

-- ============================================================================
-- PART 4: get_child_achievements & get_child_all_achievements FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS get_child_achievements(UUID);

CREATE OR REPLACE FUNCTION get_child_achievements(p_child_id UUID)
RETURNS TABLE(
  id UUID,
  code TEXT,
  name TEXT,
  icon TEXT,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.code,
    a.name,
    a.icon,
    a.description,
    ca.earned_at
  FROM public.achievements a
  INNER JOIN public.child_achievements ca ON ca.achievement_id = a.id
  WHERE ca.child_id = p_child_id
  ORDER BY ca.earned_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION get_child_achievements(UUID) TO authenticated;

DROP FUNCTION IF EXISTS get_child_all_achievements(UUID);

CREATE OR REPLACE FUNCTION get_child_all_achievements(p_child_id UUID)
RETURNS TABLE(
  id UUID,
  code TEXT,
  name TEXT,
  icon TEXT,
  description TEXT,
  earned BOOLEAN,
  earned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.code,
    a.name,
    a.icon,
    a.description,
    (ca.id IS NOT NULL),
    ca.earned_at
  FROM public.achievements a
  LEFT JOIN public.child_achievements ca ON ca.achievement_id = a.id AND ca.child_id = p_child_id
  ORDER BY CASE WHEN ca.id IS NOT NULL THEN 0 ELSE 1 END, a.name;
END;
$$ LANGUAGE plpgsql;

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION get_child_all_achievements(UUID) TO authenticated;

-- ============================================================================
-- PART 5: SEED ACHIEVEMENTS CATALOG
-- ============================================================================

INSERT INTO public.achievements (code, name, icon, description, criteria_type, criteria_value)
VALUES
  ('first_letter', '🏆 First Letter', '🏆', 'Completed your first letter activity', 'first_activity', 'letter_'),
  ('alphabet_explorer', '🔤 Alphabet Explorer', '🔤', 'Completed 10 letter activities', 'activity_prefix_count', 'letter_|10'),
  ('number_champion', '🔢 Number Champion', '🔢', 'Completed 10 number activities', 'activity_prefix_count', 'number_|10'),
  ('story_explorer', '📚 Story Explorer', '📚', 'Completed 5 story activities', 'activity_prefix_count', 'story_|5'),
  ('vocabulary_builder', '📖 Vocabulary Builder', '📖', 'Completed 5 vocabulary activities', 'activity_prefix_count', 'vocab_|5'),
  ('world_explorer', '🌍 World Explorer', '🌍', 'Completed 3 world activities', 'activity_prefix_count', 'world_|3'),
  ('consistent_learner', '🔥 Consistent Learner', '🔥', 'Maintained a 7-day streak', 'streak_length', '7'),
  ('streak_master', '🔥🔥 Streak Master', '🔥🔥', 'Maintained a 30-day streak', 'streak_length', '30')
ON CONFLICT DO NOTHING;
