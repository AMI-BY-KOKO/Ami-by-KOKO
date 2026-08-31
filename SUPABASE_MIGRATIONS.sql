-- MIGRATION 001: Create update_updated_at_column() function
-- RUN THIS FIRST - All tables need this function

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- MIGRATION 002: Create word_builder_progress Table

CREATE TABLE IF NOT EXISTS word_builder_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('english', 'yoruba', 'french', 'igbo', 'hausa')),
  
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
  current_word_index INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER[] NOT NULL DEFAULT ARRAY[0, 0, 0, 0, 0],
  
  words_completed INTEGER NOT NULL DEFAULT 0,
  stars_earned INTEGER NOT NULL DEFAULT 0,
  attempts_total INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  
  streak_count INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  last_streak_date DATE,
  
  word_garden_seeds INTEGER NOT NULL DEFAULT 0,
  mastered_words TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  
  daily_word_completed_today BOOLEAN NOT NULL DEFAULT FALSE,
  last_daily_word_date DATE,
  daily_words_completed INTEGER NOT NULL DEFAULT 0,
  
  current_difficulty TEXT NOT NULL DEFAULT 'normal' CHECK (current_difficulty IN ('easy', 'normal', 'hard', 'very-hard')),
  difficulty_changes INTEGER NOT NULL DEFAULT 0,
  
  achievements TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  achievements_unlocked_count INTEGER NOT NULL DEFAULT 0,
  last_achievement_unlock TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_synced TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, language)
);

CREATE INDEX idx_word_builder_progress_user_id ON word_builder_progress(user_id);
CREATE INDEX idx_word_builder_progress_user_language ON word_builder_progress(user_id, language);
CREATE INDEX idx_word_builder_progress_updated_at ON word_builder_progress(updated_at);
CREATE INDEX idx_word_builder_progress_streak ON word_builder_progress(streak_count DESC);

CREATE TRIGGER update_word_builder_progress_updated_at
  BEFORE UPDATE ON word_builder_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- MIGRATION 003: Create word_builder_achievements Table

CREATE TABLE IF NOT EXISTS word_builder_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('english', 'yoruba', 'french', 'igbo', 'hausa')),
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'first-word',
    'first-level',
    'streak-3',
    'streak-7',
    'streak-14',
    'streak-30',
    'language-explorer',
    'all-levels',
    'word-collector'
  )),
  
  unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  progress_value INTEGER DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, language, achievement_type)
);

CREATE INDEX idx_word_builder_achievements_user_id ON word_builder_achievements(user_id);
CREATE INDEX idx_word_builder_achievements_unlocked ON word_builder_achievements(unlocked);
CREATE INDEX idx_word_builder_achievements_user_language ON word_builder_achievements(user_id, language);

-- MIGRATION 004: Create word_builder_daily_words Table

CREATE TABLE IF NOT EXISTS word_builder_daily_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('english', 'yoruba', 'french', 'igbo', 'hausa')),
  challenge_date DATE NOT NULL,
  
  word_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP,
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  
  stars_earned INTEGER DEFAULT 0,
  bonus_stars INTEGER DEFAULT 10,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, language, challenge_date)
);

CREATE INDEX idx_word_builder_daily_words_user_date ON word_builder_daily_words(user_id, challenge_date);
CREATE INDEX idx_word_builder_daily_words_language ON word_builder_daily_words(language);

-- MIGRATION 005: Create word_builder_sessions Table

CREATE TABLE IF NOT EXISTS word_builder_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  
  words_attempted INTEGER NOT NULL DEFAULT 0,
  words_correct INTEGER NOT NULL DEFAULT 0,
  words_incorrect INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  total_hints_used INTEGER NOT NULL DEFAULT 0,
  session_duration_seconds INTEGER NOT NULL DEFAULT 0,
  
  difficulty_at_start TEXT,
  difficulty_at_end TEXT,
  
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE INDEX idx_word_builder_sessions_user_id ON word_builder_sessions(user_id);
CREATE INDEX idx_word_builder_sessions_language ON word_builder_sessions(language);
CREATE INDEX idx_word_builder_sessions_started_at ON word_builder_sessions(started_at);

-- MIGRATION 006: Enable RLS on All Tables

ALTER TABLE word_builder_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_builder_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_builder_daily_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_builder_sessions ENABLE ROW LEVEL SECURITY;

-- MIGRATION 007: RLS Policies for word_builder_progress

CREATE POLICY "Users can view their own progress"
  ON word_builder_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON word_builder_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON word_builder_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON word_builder_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- MIGRATION 008: RLS Policies for word_builder_achievements

CREATE POLICY "Users can view their own achievements"
  ON word_builder_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON word_builder_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON word_builder_achievements
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON word_builder_achievements
  FOR DELETE
  USING (auth.uid() = user_id);

-- MIGRATION 009: RLS Policies for word_builder_daily_words

CREATE POLICY "Users can view their own daily words"
  ON word_builder_daily_words
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily words"
  ON word_builder_daily_words
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily words"
  ON word_builder_daily_words
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily words"
  ON word_builder_daily_words
  FOR DELETE
  USING (auth.uid() = user_id);

-- MIGRATION 010: RLS Policies for word_builder_sessions

CREATE POLICY "Users can view their own sessions"
  ON word_builder_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON word_builder_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON word_builder_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON word_builder_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- MIGRATION 011: Create Performance Indexes

CREATE INDEX IF NOT EXISTS idx_word_builder_progress_active_streak 
  ON word_builder_progress(user_id, streak_count) 
  WHERE streak_count > 0;

CREATE INDEX IF NOT EXISTS idx_word_builder_achievements_created_at
  ON word_builder_achievements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_word_builder_daily_words_completed
  ON word_builder_daily_words(completed) 
  WHERE completed = TRUE;

CREATE INDEX IF NOT EXISTS idx_word_builder_sessions_user_language
  ON word_builder_sessions(user_id, language);

-- MIGRATION 012: Create Streak Reset Function (Optional)

CREATE OR REPLACE FUNCTION reset_expired_streaks()
RETURNS void AS $$
BEGIN
  UPDATE word_builder_progress
  SET streak_count = 0,
      last_streak_date = NULL
  WHERE last_streak_date < CURRENT_DATE - INTERVAL '1 day'
    AND streak_count > 0;
END;
$$ LANGUAGE plpgsql;

-- MIGRATION 013: Create Achievement Unlock Function (Optional)

CREATE OR REPLACE FUNCTION check_achievement_unlock(
  p_user_id UUID,
  p_language TEXT
)
RETURNS TABLE(achievement_type TEXT, should_unlock BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aa.achievement_type,
    CASE 
      WHEN aa.achievement_type = 'first-word' THEN wp.words_completed >= 1
      WHEN aa.achievement_type = 'first-level' THEN wp.levels_completed[1] > 0
      WHEN aa.achievement_type = 'streak-3' THEN wp.streak_count >= 3
      WHEN aa.achievement_type = 'streak-7' THEN wp.streak_count >= 7
      WHEN aa.achievement_type = 'streak-14' THEN wp.streak_count >= 14
      WHEN aa.achievement_type = 'streak-30' THEN wp.streak_count >= 30
      WHEN aa.achievement_type = 'language-explorer' THEN FALSE
      WHEN aa.achievement_type = 'all-levels' THEN COALESCE(wp.levels_completed[5] > 0, FALSE)
      WHEN aa.achievement_type = 'word-collector' THEN ARRAY_LENGTH(wp.mastered_words, 1) >= 50
      ELSE FALSE
    END as should_unlock
  FROM word_builder_achievements aa
  LEFT JOIN word_builder_progress wp ON wp.user_id = aa.user_id AND wp.language = aa.language
  WHERE aa.user_id = p_user_id AND aa.language = p_language;
END;
$$ LANGUAGE plpgsql;

-- MIGRATION 014: Verify Setup Complete

SELECT 'Tables Created' as status, COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'word_builder_%';

SELECT 'RLS Enabled' as status, COUNT(*) as count 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%' AND rowsecurity;

SELECT 'Indexes Created' as status, COUNT(*) as count 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%';

SELECT 'RLS Policies' as status, COUNT(*) as count 
FROM pg_policies 
WHERE tablename LIKE 'word_builder_%';

SELECT 'Functions Created' as status, COUNT(*) as count 
FROM information_schema.routines 
WHERE routine_name IN ('update_updated_at_column', 'reset_expired_streaks', 'check_achievement_unlock');
