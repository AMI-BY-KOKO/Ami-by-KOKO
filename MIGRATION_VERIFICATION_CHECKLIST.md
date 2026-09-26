# Supabase Migration Verification Checklist

This document guides you through verifying that your live Supabase database matches our local migrations before deploying the Letter Hunt game.

## Quick Start

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/cghbfovahfajmcpcrzeu
2. Navigate to the **SQL Editor** tab
3. Copy & paste the contents of `SUPABASE_VERIFICATION.sql` from this project
4. Run the queries and compare results below

---

## Critical Tables (Must Exist)

### 1. Letter Hunt Game Tables

- [ ] **letter_hunt_progress** — Per-child, per-level game state
  - Columns: `id`, `child_id`, `level`, `is_complete`, `current_round`, `current_score`, `completed_at`, `created_at`, `updated_at`
  - Indexes: `idx_letter_hunt_progress_child_id`, `idx_letter_hunt_progress_level`

- [ ] **letter_hunt_scores** — Append-only log of completed levels
  - Columns: `id`, `child_id`, `level`, `final_score`, `completed_at`
  - Indexes: `idx_letter_hunt_scores_child_id`, `idx_letter_hunt_scores_level`

### 2. XP & Achievement System

- [ ] **children** — Must have these NEW columns:
  - `xp_total` (INTEGER)
  - `current_level` (INTEGER)
  - `updated_at` (TIMESTAMP)

- [ ] **xp_events** — XP transaction log
  - Columns: `id`, `child_id`, `source`, `xp_amount`, `created_at`
  - CHECK: source must be one of: 'correct_answer', 'quiz_pass', 'assignment_complete', 'challenge_solve', 'streak_bonus'

- [ ] **achievements** — Global catalog
  - Columns: `id`, `code`, `name`, `icon`, `description`, `criteria_type`, `criteria_value`, `created_at`

- [ ] **child_achievements** — Per-child earned badges
  - Columns: `id`, `child_id`, `achievement_id`, `earned_at`

### 3. Learning Paths & Progress

- [ ] **learning_paths** — Guided curriculum
  - Columns: `id`, `subject`, `sequence_order`, `activity_ref`, `activity_name`, `unlock_requirement`, `difficulty_level`, `created_at`

- [ ] **child_progress** — Per-child activity status
  - Columns: `id`, `child_id`, `learning_path_id`, `subject`, `activity_ref`, `status`, `completed_at`, `first_attempt_at`, `attempts_count`, `created_at`

### 4. Daily Challenges & Streaks

- [ ] **daily_challenges** — Daily problem catalog
  - Columns: `id`, `date`, `question_type`, `question_data`, `correct_answer`, `activity_ref`, `created_at`

- [ ] **child_daily_challenge_attempts** — Per-child daily attempts
  - Columns: `id`, `child_id`, `challenge_date`, `completed`, `xp_awarded`, `attempted_at`

- [ ] **streaks** — Active streak tracking
  - Columns: `id`, `child_id`, `current_streak`, `best_streak`, `last_activity_date`, `updated_at`

- [ ] **streak_milestones** — Milestone rewards
  - Columns: `id`, `child_id`, `milestone_days`, `earned_at`

---

## Critical Functions (Must Exist)

Run this query in Supabase to check:

```sql
SELECT proname, pg_get_functiondef(oid) FROM pg_proc 
WHERE proname IN (
  'award_letter_hunt_xp',
  'calculate_level',
  'check_and_award_achievements',
  'initialize_child_progress',
  'update_level_progress',
  'complete_activity'
) AND prokind = 'f';
```

### Required Functions

- [ ] **award_letter_hunt_xp** `(p_child_id UUID, p_level INT, p_final_score INT)`
  - Returns: `success BOOLEAN, xp_awarded INT, new_xp_total INT, new_level INT, error TEXT`
  - Source: Migration 20240016

- [ ] **calculate_level** `(p_xp_total INT)`
  - Returns: `INT` (level 1-10 based on XP)
  - Source: Migration 20240010

- [ ] **check_and_award_achievements** `(p_child_id UUID)`
  - Returns: `success BOOLEAN, achievements_awarded INTEGER, new_achievement_ids UUID[], error TEXT`
  - Source: Migration 20240014

- [ ] **initialize_child_progress** `(p_child_id UUID)`
  - Returns: `initialized_count INTEGER`
  - Source: Migration 20240011

- [ ] **update_level_progress** `(p_child_id UUID, p_level INT, p_final_score INT)`
  - Returns: `progress_id UUID, is_complete BOOLEAN, was_already_complete BOOLEAN`
  - Source: Migration 20240016

- [ ] **complete_activity** `(p_child_id UUID, p_activity_ref TEXT)`
  - Returns: `activity_completed BOOLEAN, next_activity_ref TEXT, next_activity_name TEXT, all_completed_in_subject BOOLEAN`
  - Source: Migration 20240011

---

## RLS Policies (Must Exist)

### letter_hunt_progress

- [ ] "Parents can manage child game progress" (ALL)
- [ ] "Children can manage own game progress" (ALL)
- [ ] "School admins can view school game scores" (SELECT)

### letter_hunt_scores

- [ ] "Parents can view child game scores" (SELECT)
- [ ] "Children can view own game scores" (SELECT)

### child_achievements

- [ ] "Parents can view child achievements" (SELECT)
- [ ] "Students can view own achievements" (SELECT)
- [ ] "System can manage achievements" (ALL)

### child_progress

- [ ] "Parents can view child progress" (SELECT)
- [ ] "Students can view own progress" (SELECT)
- [ ] "System can manage progress" (ALL)

### achievements

- [ ] "Authenticated users can view achievements catalog" (SELECT, public: true)

---

## Data Validation Checks

### 1. XP Events CHECK Constraint

```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public' AND table_name = 'xp_events';
```

Expected constraint on `source` column:
```
(source = ANY (ARRAY['correct_answer'::text, 'quiz_pass'::text, 'assignment_complete'::text, 'challenge_solve'::text, 'streak_bonus'::text]))
```

### 2. Letter Hunt Scores CHECK Constraints

```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public' AND table_name = 'letter_hunt_scores';
```

Expected:
- `level` check: `(level >= 1 AND level <= 5)`
- `final_score` check: `(final_score >= 0 AND final_score <= 8)`

### 3. Achievement Seed Data

```sql
SELECT code, name, criteria_type FROM public.achievements ORDER BY code;
```

Expected 8 achievements:
- [ ] `first_letter` — First Letter
- [ ] `alphabet_explorer` — Alphabet Explorer (10 letters)
- [ ] `number_champion` — Number Champion (10 numbers)
- [ ] `story_explorer` — Story Explorer (5 stories)
- [ ] `vocabulary_builder` — Vocabulary Builder (5 vocab)
- [ ] `world_explorer` — World Explorer (3 world)
- [ ] `consistent_learner` — Consistent Learner (7-day streak)
- [ ] `streak_master` — Streak Master (30-day streak)

### 4. Learning Paths Seed Data

```sql
SELECT subject, sequence_order, activity_ref, activity_name FROM public.learning_paths ORDER BY subject, sequence_order;
```

Expected minimum paths:
- [ ] literacy: letter_a through letter_f (6 items)
- [ ] numbers: number_1 through number_3 (3 items)
- [ ] vocabulary: vocab_colours, vocab_animals (2 items)
- [ ] world: world_market, world_seasons (2 items)
- [ ] stories: story_koko_voice (1 item)

---

## Migration Fixes Applied

These are the 13 critical issues we fixed locally:

1. ✅ **20240005_challenges.sql:11** — Removed CONTINUE keyword syntax error
2. ✅ **20240010_xp_leveling_system.sql** — Replaced child_profiles with children, added xp_total/current_level/updated_at
3. ✅ **20240014_achievements_system.sql:144-149** — Fixed LIKE pattern vulnerability with proper escaping
4. ✅ **20240014_achievements_system.sql:158-160** — Added null validation for split_part() results
5. ✅ **20240016_letter_hunt_game.sql:318-328** — Fixed idempotency check (removed ineffective JOIN ON true)
6. ✅ **20240015_fix_achievements_grants.sql** — GRANTs verified in 20240014 (redundant but safe)
7. ✅ **20240009_activate_sprout_2_3.sql** — Added data validation before constraint changes
8. ✅ **20240011_learning_paths_system.sql** — Added auto-init trigger for new children
9. ✅ **20240012_daily_challenges_system.sql** — Updated dependency annotation (requires 20240010)
10. ✅ **20240006_student_rls.sql** — Added schema prefixes (public.), DROP POLICY IF EXISTS
11. ✅ **20240013_streaks_system_fix_rls.sql** — Already uses DROP POLICY IF EXISTS (safe)
12. ✅ **20240002/20240003** — No circular dependencies found (both are safe)

---

## Deployment Steps

Once you verify everything matches:

1. **In Supabase SQL Editor:**
   - Run all migrations in order: `20240001` → `20240016`
   - Check for any errors and fix before proceeding

2. **Regenerate TypeScript types:**
   ```bash
   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
   ```

3. **Run build to verify:**
   ```bash
   npm run build
   npm run type-check
   ```

4. **Test Letter Hunt game:**
   - Play a level and complete it
   - Check database: `SELECT * FROM letter_hunt_scores WHERE child_id = <your_child_id>;`
   - Verify XP was awarded: `SELECT * FROM xp_events WHERE child_id = <your_child_id>;`

5. **Verify achievements:**
   ```sql
   SELECT ca.*, a.name FROM child_achievements ca
   JOIN achievements a ON a.id = ca.achievement_id
   WHERE ca.child_id = <your_child_id>
   ORDER BY ca.earned_at DESC;
   ```

---

## Troubleshooting

### If tables are missing:

1. Check migration order in Supabase (should be 20240001 through 20240016)
2. Look for error messages in the SQL Editor output
3. Common issues:
   - Foreign key violations: ensure parent tables exist first
   - Missing functions: run migrations before dependent migrations
   - RLS policy errors: ensure table RLS is enabled before creating policies

### If functions don't exist:

1. Verify migration 20240010 (calculate_level) ran before 20240014 (achievements)
2. Verify migration 20240011 ran before 20240012 (depends on initialize_child_progress)
3. Re-run the migration containing the function

### If RLS policies fail:

1. Check that the table has RLS enabled: `ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;`
2. Run the migration that creates the policy again
3. Drop and recreate if needed: `DROP POLICY IF EXISTS "name" ON public.table;`

---

## What to Report Back

Once you've verified, reply with:

```
Schema Verification Complete:
- Tables: __ / 12 found
- Functions: __ / 6 found
- RLS Policies: __ / 15+ found
- Data validation: All checks passed? YES / NO
- Any errors? (paste here if yes)
```

Then we'll deploy the fixed migrations to your Supabase and test the Letter Hunt game end-to-end!
