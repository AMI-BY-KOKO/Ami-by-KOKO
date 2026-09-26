-- ============================================================================
-- LETTER HUNT GAME TABLES & RLS POLICIES
-- Run this after other migrations
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE letter_hunt_progress TABLE (per-child, per-level)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.letter_hunt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  level INT NOT NULL CHECK (level >= 1 AND level <= 5),
  is_complete BOOLEAN NOT NULL DEFAULT false,
  current_round INT NOT NULL DEFAULT 0,
  current_score INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, level)
);

CREATE INDEX IF NOT EXISTS idx_letter_hunt_progress_child_id 
  ON public.letter_hunt_progress(child_id);

CREATE INDEX IF NOT EXISTS idx_letter_hunt_progress_level 
  ON public.letter_hunt_progress(level);

-- ============================================================================
-- PART 2: CREATE letter_hunt_scores TABLE (append-only log for analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.letter_hunt_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  level INT NOT NULL CHECK (level >= 1 AND level <= 5),
  final_score INT NOT NULL CHECK (final_score >= 0 AND final_score <= 8),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_letter_hunt_scores_child_id 
  ON public.letter_hunt_scores(child_id);

CREATE INDEX IF NOT EXISTS idx_letter_hunt_scores_level 
  ON public.letter_hunt_scores(level);

-- ============================================================================
-- PART 3: ENABLE RLS
-- ============================================================================

ALTER TABLE public.letter_hunt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_hunt_scores ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can manage their child's progress
DROP POLICY IF EXISTS "Parents can manage child game progress" ON public.letter_hunt_progress;
CREATE POLICY "Parents can manage child game progress"
  ON public.letter_hunt_progress
  FOR ALL
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

-- RLS: Children can manage their own progress
DROP POLICY IF EXISTS "Children can manage own game progress" ON public.letter_hunt_progress;
CREATE POLICY "Children can manage own game progress"
  ON public.letter_hunt_progress
  FOR ALL
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

-- RLS: School admins can read their school's game scores
DROP POLICY IF EXISTS "School admins can view school game scores" ON public.letter_hunt_progress;
CREATE POLICY "School admins can view school game scores"
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

-- Same RLS for scores table
DROP POLICY IF EXISTS "Parents can view child game scores" ON public.letter_hunt_scores;
CREATE POLICY "Parents can view child game scores"
  ON public.letter_hunt_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.parent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Children can view own game scores" ON public.letter_hunt_scores;
CREATE POLICY "Children can view own game scores"
  ON public.letter_hunt_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = letter_hunt_scores.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

-- ============================================================================
-- PART 4: HELPER FUNCTIONS
-- ============================================================================

-- Get child's all-time best score for a level
DROP FUNCTION IF EXISTS get_best_score_for_level(UUID, INT);
CREATE OR REPLACE FUNCTION get_best_score_for_level(
  p_child_id UUID,
  p_level INT
)
RETURNS INT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(final_score) 
     FROM public.letter_hunt_scores 
     WHERE child_id = p_child_id AND level = p_level),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Get total sessions completed for a level
DROP FUNCTION IF EXISTS get_level_completion_count(UUID, INT);
CREATE OR REPLACE FUNCTION get_level_completion_count(
  p_child_id UUID,
  p_level INT
)
RETURNS INT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT COUNT(*) 
     FROM public.letter_hunt_scores 
     WHERE child_id = p_child_id AND level = p_level),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Get or create progress record
DROP FUNCTION IF EXISTS get_or_create_level_progress(UUID, INT);
CREATE OR REPLACE FUNCTION get_or_create_level_progress(
  p_child_id UUID,
  p_level INT
)
RETURNS UUID AS $$
DECLARE
  v_progress_id UUID;
BEGIN
  -- Try to get existing progress
  SELECT id INTO v_progress_id
  FROM public.letter_hunt_progress
  WHERE child_id = p_child_id AND level = p_level;

  -- If not found, create new
  IF v_progress_id IS NULL THEN
    INSERT INTO public.letter_hunt_progress (child_id, level)
    VALUES (p_child_id, p_level)
    RETURNING id INTO v_progress_id;
  END IF;

  RETURN v_progress_id;
END;
$$ LANGUAGE plpgsql;

-- Update progress when level completes
DROP FUNCTION IF EXISTS update_level_progress(UUID, INT, INT);
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
BEGIN
  -- Get or create progress record
  v_progress_id := get_or_create_level_progress(p_child_id, p_level);

  -- Check if already complete
  SELECT is_complete INTO v_was_complete
  FROM public.letter_hunt_progress
  WHERE id = v_progress_id;

  -- Update progress
  UPDATE public.letter_hunt_progress
  SET is_complete = true,
      current_score = GREATEST(current_score, p_final_score),
      current_round = 8,
      completed_at = CASE WHEN is_complete = false THEN now() ELSE completed_at END,
      updated_at = now()
  WHERE id = v_progress_id;

  -- Log the score
  INSERT INTO public.letter_hunt_scores (child_id, level, final_score)
  VALUES (p_child_id, p_level, p_final_score);

  v_is_now_complete := true;

  RETURN QUERY SELECT v_progress_id, v_is_now_complete, v_was_complete;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_best_score_for_level(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_level_completion_count(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_level_progress(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_level_progress(UUID, INT, INT) TO authenticated;

-- ============================================================================
-- PART 5: AWARD XP FOR LETTER HUNT (integrate with existing XP system)
-- ============================================================================

-- Award XP when level completes (50 XP base + 5 XP per point scored)
-- Directly inserts into xp_events with source='correct_answer' to comply with CHECK constraint
DROP FUNCTION IF EXISTS award_letter_hunt_xp(UUID, INT, INT);
CREATE OR REPLACE FUNCTION award_letter_hunt_xp(
  p_child_id UUID,
  p_level INT,
  p_final_score INT
)
RETURNS TABLE(
  success BOOLEAN,
  xp_awarded INT,
  new_xp_total INT,
  new_level INT,
  error TEXT
) AS $$
DECLARE
  v_xp_to_award INT;
  v_existing_count INTEGER;
  v_new_xp_total INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Award 50 XP base + 5 XP per point scored
  v_xp_to_award := 50 + (p_final_score * 5);

  -- Idempotency check: same level completion in same hour = dedupe
  SELECT COUNT(*)
  INTO v_existing_count
  FROM public.letter_hunt_scores lhs
  WHERE lhs.child_id = p_child_id
    AND lhs.level = p_level
    AND lhs.completed_at >= date_trunc('hour', now());

  IF v_existing_count > 0 THEN
    -- Already awarded in this hour for this level, return current totals without inserting
    SELECT COALESCE(SUM(xp_amount), 0)
    INTO v_new_xp_total
    FROM public.xp_events
    WHERE child_id = p_child_id;

    v_new_level := calculate_level(v_new_xp_total);

    RETURN QUERY SELECT true, 0, v_new_xp_total, v_new_level, NULL::TEXT;
    RETURN;
  END IF;

  -- Insert new XP event with source='correct_answer' (complies with CHECK constraint)
  INSERT INTO public.xp_events (child_id, source, xp_amount)
  VALUES (p_child_id, 'correct_answer', v_xp_to_award);

  -- Calculate new totals
  SELECT COALESCE(SUM(xp_amount), 0)
  INTO v_new_xp_total
  FROM public.xp_events
  WHERE child_id = p_child_id;

  v_new_level := calculate_level(v_new_xp_total);

  RETURN QUERY SELECT true, v_xp_to_award, v_new_xp_total, v_new_level, NULL::TEXT;

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 0, 0, 0, SQLERRM;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION award_letter_hunt_xp(UUID, INT, INT) TO authenticated;
