-- ============================================================================
-- MASTER ACHIEVEMENTS SYSTEM SETUP
-- ============================================================================
-- Complete consolidation of all SQL needed for achievements system
-- Run in Supabase SQL Editor in the order shown below
-- 
-- Includes:
--   1. Core schema (achievements, child_achievements tables)
--   2. RPC functions (check_and_award_achievements, get_child_achievements, get_child_all_achievements)
--   3. RLS policies (for both tables)
--   4. GRANT statements (permissions for authenticated role)
--   5. Seed data (8 achievements)
--   6. Diagnostics queries (verify deployment)
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE achievements TABLE (global catalog)
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

-- Enable RLS on achievements table and allow all authenticated users to read
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view achievements catalog" ON public.achievements;
CREATE POLICY "Authenticated users can view achievements catalog"
  ON public.achievements
  FOR SELECT
  USING (true);

-- ============================================================================
-- STEP 2: CREATE child_achievements TABLE (per-child earned badges)
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
-- STEP 3: check_and_award_achievements FUNCTION
-- ============================================================================
-- Checks all unearned achievements for a child and awards newly met ones
-- Called after user completes/masters an activity

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

-- ============================================================================
-- STEP 4: get_child_achievements FUNCTION
-- ============================================================================
-- Returns only earned achievements for a child

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

-- ============================================================================
-- STEP 5: get_child_all_achievements FUNCTION
-- ============================================================================
-- Returns all achievements (earned + unearned) for a child with earned status

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

-- ============================================================================
-- STEP 6: GRANT EXECUTE PERMISSIONS
-- ============================================================================
-- Allow authenticated users to call these RPC functions

GRANT EXECUTE ON FUNCTION check_and_award_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_child_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_child_all_achievements(UUID) TO authenticated;

-- ============================================================================
-- STEP 7: SEED ACHIEVEMENTS CATALOG
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

-- ============================================================================
-- STEP 8: DIAGNOSTICS & VERIFICATION
-- ============================================================================
-- Run these queries to verify deployment was successful

-- Check 1: Verify achievements table exists and has data
-- Expected: 8 rows
SELECT 'achievements_count' as check_name, COUNT(*) as result FROM public.achievements;

-- Check 2: Verify child_achievements table exists
-- Expected: Should return at least 0 rows (more if achievements were already awarded)
SELECT 'child_achievements_count' as check_name, COUNT(*) as result FROM public.child_achievements;

-- Check 3: Verify RLS policies on achievements
-- Expected: 1 policy with "Authenticated users can view achievements catalog"
SELECT 'achievements_rls_policies' as check_name, COUNT(*) as result 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'achievements';

-- Check 4: Verify RLS policies on child_achievements
-- Expected: 3 policies (Parents, Students, System)
SELECT 'child_achievements_rls_policies' as check_name, COUNT(*) as result 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'child_achievements';

-- Check 5: Verify RPC functions exist
-- Expected: 3 functions
SELECT 'rpc_functions_count' as check_name, COUNT(*) as result 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('check_and_award_achievements', 'get_child_achievements', 'get_child_all_achievements');

-- Check 6: List all earned achievements (if any)
-- Expected: Shows any achievements awarded so far
SELECT 'earned_achievements' as check_name, 
       c.name as child_name,
       a.name as achievement_name,
       ca.earned_at
FROM public.child_achievements ca
JOIN public.children c ON c.id = ca.child_id
JOIN public.achievements a ON a.id = ca.achievement_id
ORDER BY ca.earned_at DESC;

-- ============================================================================
-- DEPLOYMENT CHECKLIST
-- ============================================================================
-- After running this script:
--
-- [ ] 1. Run entire script in Supabase SQL Editor
-- [ ] 2. Check: No error messages appear
-- [ ] 3. Run diagnostics queries above
-- [ ] 4. Verify all 6 checks return expected results
-- [ ] 5. Hard refresh browser: Ctrl+Shift+R
-- [ ] 6. Navigate to home page
-- [ ] 7. Scroll to "🏆 Achievements" section
-- [ ] 8. Any earned achievements should show as colored badges
-- [ ] 9. Unearned achievements should show as grayed out
--
-- If achievements still don't show:
-- - Open browser console (F12)
-- - Look for "[AchievementDisplay]" logs
-- - Check what data is returned from get_child_all_achievements
--
-- ============================================================================
