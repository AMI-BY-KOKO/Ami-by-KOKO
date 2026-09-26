-- ============================================================================
-- FIX: Ambiguous column reference in update_level_progress function
-- Error: column reference "is_complete" is ambiguous
-- Root cause: CASE WHEN is_complete = false needs table qualification
-- Created: September 26, 2026
-- ============================================================================

-- Drop the broken function
DROP FUNCTION IF EXISTS update_level_progress(UUID, INT, INT);

-- Recreate with fixed SQL
CREATE OR REPLACE FUNCTION update_level_progress(
  p_child_id UUID,
  p_level INT,
  p_final_score INT
)
RETURNS TABLE(
  progress_id UUID,
  is_complete BOOLEAN,
  was_already_complete BOOLEAN
) AS $$
DECLARE
  v_progress_id UUID;
  v_was_complete BOOLEAN;
  v_is_now_complete BOOLEAN;
  v_old_is_complete BOOLEAN;
BEGIN
  -- Get or create progress record
  v_progress_id := get_or_create_level_progress(p_child_id, p_level);

  -- Check if already complete BEFORE the update
  SELECT letter_hunt_progress.is_complete INTO v_old_is_complete
  FROM public.letter_hunt_progress
  WHERE id = v_progress_id;

  -- Update progress
  UPDATE public.letter_hunt_progress
  SET is_complete = true,
      current_score = GREATEST(current_score, p_final_score),
      current_round = 8,
      completed_at = CASE WHEN v_old_is_complete = false THEN now() ELSE completed_at END,
      updated_at = now()
  WHERE id = v_progress_id;

  -- Log the score
  INSERT INTO public.letter_hunt_scores (child_id, level, final_score)
  VALUES (p_child_id, p_level, p_final_score);

  v_is_now_complete := true;

  RETURN QUERY SELECT v_progress_id, v_is_now_complete, v_old_is_complete;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_level_progress(UUID, INT, INT) TO authenticated;
