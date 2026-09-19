-- ============================================================================
-- LEARNING PATHS & GUIDED JOURNEY SYSTEM (CORRECTED: references children.id)
-- Run this after 20240010_xp_leveling_system.sql
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE learning_paths TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL CHECK (subject IN ('literacy', 'numbers', 'vocabulary', 'world', 'stories')),
  sequence_order INTEGER NOT NULL,
  activity_ref TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  unlock_requirement TEXT,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_subject_order 
  ON public.learning_paths(subject, sequence_order);

CREATE INDEX IF NOT EXISTS idx_learning_paths_activity_ref 
  ON public.learning_paths(activity_ref);

-- ============================================================================
-- PART 2: CREATE child_progress TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.child_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  activity_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  first_attempt_at TIMESTAMP WITH TIME ZONE,
  attempts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, learning_path_id)
);

CREATE INDEX IF NOT EXISTS idx_child_progress_child_id 
  ON public.child_progress(child_id);

CREATE INDEX IF NOT EXISTS idx_child_progress_status 
  ON public.child_progress(child_id, status);

ALTER TABLE public.child_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view child progress" ON public.child_progress;
CREATE POLICY "Parents can view child progress"
  ON public.child_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_progress.child_id
        AND c.parent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view own progress" ON public.child_progress;
CREATE POLICY "Students can view own progress"
  ON public.child_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_progress.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage progress" ON public.child_progress;
CREATE POLICY "System can manage progress"
  ON public.child_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 3: initialize_child_progress FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS initialize_child_progress(UUID);

CREATE OR REPLACE FUNCTION initialize_child_progress(p_child_id UUID)
RETURNS TABLE(initialized_count INTEGER) AS $$
DECLARE
  v_first_item_id UUID;
  v_subject_name TEXT;
BEGIN
  -- For each subject, initialize progress records
  FOR v_subject_name IN (SELECT DISTINCT subject FROM public.learning_paths ORDER BY subject)
  LOOP
    -- Find first item in this subject (lowest sequence_order)
    SELECT id INTO v_first_item_id
    FROM public.learning_paths
    WHERE subject = v_subject_name
    ORDER BY sequence_order ASC
    LIMIT 1;

    -- Insert progress for all items in this subject
    INSERT INTO public.child_progress (
      child_id,
      learning_path_id,
      subject,
      activity_ref,
      status,
      created_at
    )
    SELECT
      p_child_id,
      lp.id,
      lp.subject,
      lp.activity_ref,
      CASE WHEN lp.id = v_first_item_id THEN 'available' ELSE 'locked' END,
      now()
    FROM public.learning_paths lp
    WHERE lp.subject = v_subject_name
    ON CONFLICT (child_id, learning_path_id) DO NOTHING;
  END LOOP;

  -- Return count of initialized items
  SELECT COUNT(*) INTO initialized_count
  FROM public.child_progress
  WHERE child_id = p_child_id;

  RETURN QUERY SELECT initialized_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 4: complete_activity FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS complete_activity(UUID, TEXT);

CREATE OR REPLACE FUNCTION complete_activity(p_child_id UUID, p_activity_ref TEXT)
RETURNS TABLE(
  activity_completed BOOLEAN,
  next_activity_ref TEXT,
  next_activity_name TEXT,
  all_completed_in_subject BOOLEAN
) AS $$
DECLARE
  v_lp_id UUID;
  v_subject TEXT;
  v_next_lp_id UUID;
  v_next_activity_ref TEXT;
  v_next_activity_name TEXT;
  v_all_completed BOOLEAN;
BEGIN
  -- Find the learning path item for this activity
  SELECT lp.id, lp.subject
  INTO v_lp_id, v_subject
  FROM public.learning_paths lp
  WHERE lp.activity_ref = p_activity_ref
  LIMIT 1;

  IF v_lp_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, false;
    RETURN;
  END IF;

  -- Mark this activity as completed
  UPDATE public.child_progress
  SET status = 'completed', completed_at = now()
  WHERE child_id = p_child_id AND learning_path_id = v_lp_id;

  -- Find next available item in this subject
  SELECT lp.id, lp.activity_ref, lp.activity_name
  INTO v_next_lp_id, v_next_activity_ref, v_next_activity_name
  FROM public.learning_paths lp
  WHERE lp.subject = v_subject
    AND lp.sequence_order > (
      SELECT sequence_order FROM public.learning_paths WHERE id = v_lp_id
    )
  ORDER BY lp.sequence_order ASC
  LIMIT 1;

  -- If there's a next item, unlock it
  IF v_next_lp_id IS NOT NULL THEN
    UPDATE public.child_progress
    SET status = 'available'
    WHERE child_id = p_child_id AND learning_path_id = v_next_lp_id;
  END IF;

  -- Check if all items in this subject are completed
  SELECT COUNT(*) = 0
  INTO v_all_completed
  FROM public.child_progress
  WHERE child_id = p_child_id
    AND subject = v_subject
    AND status IN ('locked', 'available');

  RETURN QUERY SELECT true, v_next_activity_ref, v_next_activity_name, v_all_completed;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 5: SEED LEARNING PATHS DATA
-- ============================================================================

INSERT INTO public.learning_paths (subject, sequence_order, activity_ref, activity_name, unlock_requirement, difficulty_level)
VALUES
  -- Literacy: Letters A-F (free)
  ('literacy', 1, 'letter_a', 'Letter A', NULL, 1),
  ('literacy', 2, 'letter_b', 'Letter B', 'letter_a_completed', 1),
  ('literacy', 3, 'letter_c', 'Letter C', 'letter_b_completed', 1),
  ('literacy', 4, 'letter_d', 'Letter D', 'letter_c_completed', 1),
  ('literacy', 5, 'letter_e', 'Letter E', 'letter_d_completed', 1),
  ('literacy', 6, 'letter_f', 'Letter F', 'letter_e_completed', 1),
  
  -- Numbers: 1-3 (free)
  ('numbers', 1, 'number_1', 'Number 1', NULL, 1),
  ('numbers', 2, 'number_2', 'Number 2', 'number_1_completed', 1),
  ('numbers', 3, 'number_3', 'Number 3', 'number_2_completed', 1),
  
  -- Vocabulary (free samples)
  ('vocabulary', 1, 'vocab_colours', 'Colours', NULL, 1),
  ('vocabulary', 2, 'vocab_animals', 'Animals', 'vocab_colours_completed', 1),
  
  -- World (free samples)
  ('world', 1, 'world_market', 'Nigerian Market', NULL, 1),
  ('world', 2, 'world_seasons', 'Seasons', 'world_market_completed', 1),
  
  -- Stories (free story start)
  ('stories', 1, 'story_koko_voice', 'Kòkò Lost His Voice', NULL, 1)
ON CONFLICT DO NOTHING;
