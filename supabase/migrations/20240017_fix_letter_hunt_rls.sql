-- ============================================================================
-- FIX: LETTER HUNT PROGRESS RLS POLICIES
-- Status: Fixes the "Failed to complete level" error
-- Root cause: RLS policies not allowing authenticated writes
-- Created: September 26, 2026
-- ============================================================================

-- STEP 1: Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Parents can manage child game progress" ON public.letter_hunt_progress;
DROP POLICY IF EXISTS "Children can manage own game progress" ON public.letter_hunt_progress;
DROP POLICY IF EXISTS "School admins can view school game scores" ON public.letter_hunt_progress;

-- STEP 2: Drop existing policies on scores table
DROP POLICY IF EXISTS "Parents can view child game scores" ON public.letter_hunt_scores;
DROP POLICY IF EXISTS "Children can view own game scores" ON public.letter_hunt_scores;

-- STEP 3: Ensure RLS is enabled
ALTER TABLE public.letter_hunt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_hunt_scores ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- REVISED RLS POLICIES FOR letter_hunt_progress
-- ============================================================================

-- Policy 1: Parents can read their child's progress
CREATE POLICY "letter_hunt_progress: parents can read"
  ON public.letter_hunt_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- Policy 2: Parents can insert/update their child's progress
CREATE POLICY "letter_hunt_progress: parents can write"
  ON public.letter_hunt_progress
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.parent_id = auth.uid()
    )
  );

CREATE POLICY "letter_hunt_progress: parents can update"
  ON public.letter_hunt_progress
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- Policy 3: Children can read their own progress
CREATE POLICY "letter_hunt_progress: children can read own"
  ON public.letter_hunt_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- Policy 4: Children can insert/update their own progress
CREATE POLICY "letter_hunt_progress: children can write own"
  ON public.letter_hunt_progress
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "letter_hunt_progress: children can update own"
  ON public.letter_hunt_progress
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_progress.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- Policy 5: School admins can read their school's progress
CREATE POLICY "letter_hunt_progress: school admins can read"
  ON public.letter_hunt_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE c.id = letter_hunt_progress.child_id
        AND p.role = 'school_admin'
        AND p.school_id = c.school_id
    )
  );

-- ============================================================================
-- REVISED RLS POLICIES FOR letter_hunt_scores
-- ============================================================================

-- Policy 1: Parents can read their child's scores
CREATE POLICY "letter_hunt_scores: parents can read"
  ON public.letter_hunt_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- Policy 2: Parents can insert scores for their child
CREATE POLICY "letter_hunt_scores: parents can insert"
  ON public.letter_hunt_scores
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- Policy 3: Children can read their own scores
CREATE POLICY "letter_hunt_scores: children can read own"
  ON public.letter_hunt_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- Policy 4: Children can insert their own scores
CREATE POLICY "letter_hunt_scores: children can insert own"
  ON public.letter_hunt_scores
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- Policy 5: School admins can read their school's scores
CREATE POLICY "letter_hunt_scores: school admins can read"
  ON public.letter_hunt_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE c.id = letter_hunt_scores.child_id
        AND p.role = 'school_admin'
        AND p.school_id = c.school_id
    )
  );

-- ============================================================================
-- GRANT PERMISSIONS TO AUTHENTICATED ROLE
-- ============================================================================

-- Allow authenticated users to execute the RPC functions
GRANT EXECUTE ON FUNCTION update_level_progress(UUID, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION award_letter_hunt_xp(UUID, INT, INT) TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify RLS is enabled and policies exist
-- Run these in Supabase SQL Editor to confirm:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename IN ('letter_hunt_progress', 'letter_hunt_scores')
--   AND schemaname = 'public';
--
-- Expected output: Both tables should show rowsecurity = true
--
-- SELECT tablename, policyname, permissive, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('letter_hunt_progress', 'letter_hunt_scores')
--   AND schemaname = 'public'
-- ORDER BY tablename, policyname;
--
-- Expected: 10 policies total (5 per table)
