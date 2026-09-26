-- ============================================================================
-- SUPABASE SCHEMA VERIFICATION SCRIPT
-- Run this in your Supabase SQL Editor to verify the current database state
-- ============================================================================

-- 1. List all public tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND tables.table_name = table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Check critical tables for Letter Hunt game
\echo '--- LETTER HUNT TABLES ---'
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'letter_hunt_progress') as "letter_hunt_progress exists";
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'letter_hunt_scores') as "letter_hunt_scores exists";

-- 3. Check children table columns
\echo '--- CHILDREN TABLE COLUMNS ---'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'children'
ORDER BY ordinal_position;

-- 4. Check XP system tables
\echo '--- XP SYSTEM TABLES ---'
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'xp_events') as "xp_events exists";
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'achievements') as "achievements exists";
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'child_achievements') as "child_achievements exists";

-- 5. Check functions
\echo '--- CRITICAL FUNCTIONS ---'
SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'award_letter_hunt_xp') as "award_letter_hunt_xp exists";
SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_level') as "calculate_level exists";
SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_and_award_achievements') as "check_and_award_achievements exists";
SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'initialize_child_progress') as "initialize_child_progress exists";

-- 6. Show all RLS policies
\echo '--- RLS POLICIES ---'
SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. Check constraints on letter_hunt_scores
\echo '--- LETTER_HUNT_SCORES CONSTRAINTS ---'
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'letter_hunt_scores';

-- 8. Check xp_events source constraint
\echo '--- XP_EVENTS CHECK CONSTRAINTS ---'
SELECT check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public' AND constraint_name LIKE '%xp_events%';

