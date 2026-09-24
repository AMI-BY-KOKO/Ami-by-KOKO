-- ============================================================================
-- DAILY CHALLENGES SYSTEM (CORRECTED: references children.id)
-- Run this after 20240011_learning_paths_system.sql
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE daily_challenges TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  question_type TEXT NOT NULL,
  question_data JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  activity_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(date);

-- ============================================================================
-- PART 2: CREATE child_daily_challenge_attempts TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.child_daily_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  xp_awarded INTEGER DEFAULT 0,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, challenge_date)
);

CREATE INDEX IF NOT EXISTS idx_child_daily_challenge_attempts_child_id 
  ON public.child_daily_challenge_attempts(child_id);

CREATE INDEX IF NOT EXISTS idx_child_daily_challenge_attempts_date 
  ON public.child_daily_challenge_attempts(challenge_date);

ALTER TABLE public.child_daily_challenge_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view child attempts" ON public.child_daily_challenge_attempts;
CREATE POLICY "Parents can view child attempts"
  ON public.child_daily_challenge_attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_daily_challenge_attempts.child_id
        AND c.parent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view own attempts" ON public.child_daily_challenge_attempts;
CREATE POLICY "Students can view own attempts"
  ON public.child_daily_challenge_attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_daily_challenge_attempts.child_id
        AND c.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage attempts" ON public.child_daily_challenge_attempts;
CREATE POLICY "System can manage attempts"
  ON public.child_daily_challenge_attempts
  FOR ALL
  USING (true);

-- ============================================================================
-- PART 3: get_or_create_daily_challenge FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS get_or_create_daily_challenge();

CREATE OR REPLACE FUNCTION get_or_create_daily_challenge()
RETURNS TABLE(
  id UUID,
  date DATE,
  question_type TEXT,
  question_data JSONB,
  correct_answer TEXT,
  activity_ref TEXT
) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_weekday INT := EXTRACT(DOW FROM v_today)::INT;
  v_challenge_type TEXT;
BEGIN
  -- Rotate by weekday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
  -- Mon=literacy, Tue=numbers, Wed=vocab, Thu=literacy, Fri=numbers, Sat=stories, Sun=world
  v_challenge_type := CASE v_weekday
    WHEN 0 THEN 'world'
    WHEN 1 THEN 'literacy'
    WHEN 2 THEN 'numbers'
    WHEN 3 THEN 'vocabulary'
    WHEN 4 THEN 'literacy'
    WHEN 5 THEN 'numbers'
    WHEN 6 THEN 'stories'
  END;

  -- Check if challenge exists for today
  IF EXISTS (SELECT 1 FROM public.daily_challenges WHERE date = v_today) THEN
    RETURN QUERY SELECT * FROM public.daily_challenges WHERE date = v_today;
    RETURN;
  END IF;

  -- Create default challenges based on type
  -- In production, these should come from a content service
  CASE v_challenge_type
    WHEN 'literacy' THEN
      INSERT INTO public.daily_challenges (date, question_type, question_data, correct_answer, activity_ref)
      VALUES (
        v_today,
        'letter_sound',
        jsonb_build_object('letter', 'a', 'options', ARRAY['apple', 'ball', 'cat']),
        'apple',
        'letter_a'
      );

    WHEN 'numbers' THEN
      INSERT INTO public.daily_challenges (date, question_type, question_data, correct_answer, activity_ref)
      VALUES (
        v_today,
        'number_count',
        jsonb_build_object('count', 1, 'options', ARRAY[1, 2, 3]),
        '1',
        'number_1'
      );

    WHEN 'vocabulary' THEN
      INSERT INTO public.daily_challenges (date, question_type, question_data, correct_answer, activity_ref)
      VALUES (
        v_today,
        'vocab_match',
        jsonb_build_object('word', 'red', 'options', ARRAY['red', 'blue', 'green']),
        'red',
        'vocab_colours'
      );

    WHEN 'stories' THEN
      INSERT INTO public.daily_challenges (date, question_type, question_data, correct_answer, activity_ref)
      VALUES (
        v_today,
        'story_question',
        jsonb_build_object('story', 'Kòkò Lost His Voice', 'question', 'Who lost his voice?', 'options', ARRAY['Kòkò', 'Àmì', 'Teacher']),
        'Kòkò',
        'story_koko_voice'
      );

    WHEN 'world' THEN
      INSERT INTO public.daily_challenges (date, question_type, question_data, correct_answer, activity_ref)
      VALUES (
        v_today,
        'world_question',
        jsonb_build_object('category', 'market', 'question', 'What do you find at a market?', 'options', ARRAY['food', 'cars', 'sky']),
        'food',
        'world_market'
      );
  END CASE;

  -- Return the newly created challenge
  RETURN QUERY SELECT * FROM public.daily_challenges WHERE date = v_today;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 4: complete_daily_challenge FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS complete_daily_challenge(UUID, DATE, INTEGER);

CREATE OR REPLACE FUNCTION complete_daily_challenge(
  p_child_id UUID,
  p_challenge_date DATE,
  p_xp_amount INTEGER
)
RETURNS TABLE(success BOOLEAN, error TEXT) AS $$
BEGIN
  INSERT INTO public.child_daily_challenge_attempts (child_id, challenge_date, completed, xp_awarded)
  VALUES (p_child_id, p_challenge_date, true, p_xp_amount)
  ON CONFLICT (child_id, challenge_date) DO UPDATE
  SET completed = true, xp_awarded = p_xp_amount;

  RETURN QUERY SELECT true, NULL::TEXT;

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 5: get_child_today_challenge_attempt FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS get_child_today_challenge_attempt(UUID);

CREATE OR REPLACE FUNCTION get_child_today_challenge_attempt(p_child_id UUID)
RETURNS TABLE(
  attempt_id UUID,
  challenge_date DATE,
  completed BOOLEAN,
  xp_awarded INTEGER,
  challenge_id UUID,
  question_type TEXT,
  question_data JSONB,
  correct_answer TEXT,
  activity_ref TEXT
) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
BEGIN
  RETURN QUERY
  SELECT
    cda.id,
    cda.challenge_date,
    cda.completed,
    cda.xp_awarded,
    dc.id,
    dc.question_type,
    dc.question_data,
    dc.correct_answer,
    dc.activity_ref
  FROM public.child_daily_challenge_attempts cda
  LEFT JOIN public.daily_challenges dc ON dc.date = cda.challenge_date
  WHERE cda.child_id = p_child_id
    AND cda.challenge_date = v_today;
END;
$$ LANGUAGE plpgsql;
