-- ============================================================================
-- FIX: Enable RLS on achievements table and grant RPC execute permissions
-- ============================================================================
-- Issue: 
--   1. achievements table had no RLS — RPC functions couldn't read from it
--   2. RPC functions had no EXECUTE grants to authenticated role
-- 
-- Result: UI fetches achievements but gets empty array (RLS denied access)
-- 
-- Solution: 
--   1. Enable RLS on achievements table with public SELECT policy
--   2. Grant EXECUTE to authenticated role for all three functions

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view achievements catalog" ON public.achievements;
CREATE POLICY "Authenticated users can view achievements catalog"
  ON public.achievements
  FOR SELECT
  USING (true);

GRANT EXECUTE ON FUNCTION check_and_award_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_child_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_child_all_achievements(UUID) TO authenticated;
