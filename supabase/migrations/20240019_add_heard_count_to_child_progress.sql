-- ============================================================================
-- ADD heard_count COLUMN TO child_progress TABLE
-- ============================================================================
-- This migration adds the heard_count column to track how many times
-- a child has heard each letter or activity, used for progress tracking
-- in the Phonics Mode.
-- ============================================================================

-- Add heard_count column if it doesn't exist
ALTER TABLE public.child_progress
ADD COLUMN IF NOT EXISTS heard_count INTEGER NOT NULL DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.child_progress.heard_count IS
  'Number of times the child has heard this letter/activity sound';
