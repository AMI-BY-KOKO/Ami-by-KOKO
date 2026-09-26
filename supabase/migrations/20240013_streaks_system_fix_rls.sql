-- ============================================================================
-- FIX: Enable RLS on streak_milestones table (Supabase linter requirement)
-- This migration fixes the security issue detected by Supabase linter
-- ============================================================================

-- Enable RLS on streak_milestones table
ALTER TABLE public.streak_milestones ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can view their child's streak milestones
DROP POLICY IF EXISTS "Parents can view child streak milestones" ON public.streak_milestones;
CREATE POLICY "Parents can view child streak milestones"
  ON public.streak_milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = streak_milestones.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- RLS: Children can view their own streak milestones
DROP POLICY IF EXISTS "Children can view own streak milestones" ON public.streak_milestones;
CREATE POLICY "Children can view own streak milestones"
  ON public.streak_milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = streak_milestones.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- RLS: System can insert streaks via function (SECURITY DEFINER)
DROP POLICY IF EXISTS "System can insert streak milestones" ON public.streak_milestones;
CREATE POLICY "System can insert streak milestones"
  ON public.streak_milestones
  FOR INSERT
  WITH CHECK (true);

-- RLS: School admins can view their school's streak milestones
DROP POLICY IF EXISTS "School admins can view school streak milestones" ON public.streak_milestones;
CREATE POLICY "School admins can view school streak milestones"
  ON public.streak_milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE c.id = streak_milestones.child_id
        AND p.role = 'school_admin'
        AND p.school_id = c.school_id
    )
  );
