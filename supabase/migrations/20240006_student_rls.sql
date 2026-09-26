-- Migration: allow students to query their own child record via auth_user_id
-- Run this in Supabase SQL editor before deploying the student auth fix.

-- Students can read their own child record (matched by auth_user_id = auth.uid())
DROP POLICY IF EXISTS "Students can view their own child record" ON public.children;
CREATE POLICY "Students can view their own child record"
  ON public.children FOR SELECT
  USING (auth_user_id = auth.uid());

-- Students can update their own child record (e.g. progress, session data)
-- Scope is intentionally narrow — only the row they own.
DROP POLICY IF EXISTS "Students can update their own child record" ON public.children;
CREATE POLICY "Students can update their own child record"
  ON public.children FOR UPDATE
  USING (auth_user_id = auth.uid());

