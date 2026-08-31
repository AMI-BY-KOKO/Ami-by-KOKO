# Supabase Migration Execution Order

**⚠️ CRITICAL: Run migrations in this EXACT order. Function must be created BEFORE tables that use it.**

---

## Migration Execution Checklist

### ✅ STEP 1: Create Function (MUST RUN FIRST)

```sql
-- MIGRATION 001: Create update_updated_at_column() function
-- Status: REQUIRED - RUN THIS BEFORE ANY TABLES

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify:
SELECT * FROM information_schema.routines 
WHERE routine_name = 'update_updated_at_column';
-- Expected: Function should exist
```

**Wait for this to complete before proceeding to Step 2.**

---

### ✅ STEP 2: Create Tables (MIGRATION 002-005)

Now that the function exists, create the 4 tables with their triggers:

```sql
-- MIGRATION 002: Create word_builder_progress (uses trigger → function)
-- MIGRATION 003: Create word_builder_achievements
-- MIGRATION 004: Create word_builder_daily_words
-- MIGRATION 005: Create word_builder_sessions

-- Copy each from SUPABASE_SETUP_GUIDE.md and run in order
-- All tables can now safely reference update_updated_at_column()
```

**Verify all 4 tables created:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'word_builder_%'
ORDER BY table_name;

-- Expected output (4 rows):
-- word_builder_achievements
-- word_builder_daily_words
-- word_builder_progress
-- word_builder_sessions
```

---

### ✅ STEP 3: Enable RLS (MIGRATION 006-010)

```sql
-- MIGRATION 006: Enable RLS on all 4 tables
-- MIGRATION 007: RLS policies for word_builder_progress
-- MIGRATION 008: RLS policies for word_builder_achievements
-- MIGRATION 009: RLS policies for word_builder_daily_words
-- MIGRATION 010: RLS policies for word_builder_sessions
```

**Verify RLS enabled:**
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%';

-- Expected: rowsecurity = true for all 4 tables
```

---

### ✅ STEP 4: Create Indexes (MIGRATION 011)

```sql
-- MIGRATION 011: Add 10+ performance indexes
-- Copy the entire index section from SUPABASE_SETUP_GUIDE.md
```

**Verify indexes created:**
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%'
ORDER BY indexname;

-- Expected: 10+ indexes
```

---

### ✅ STEP 5: Optional Functions & Features (MIGRATION 012-016)

These can be run now or deferred to V2:

```sql
-- MIGRATION 012: Create streak reset function (optional)
-- MIGRATION 013: Create achievement unlock function (optional)
-- MIGRATION 014: Seed achievements (optional)
-- MIGRATION 015: Create storage buckets (optional)
-- MIGRATION 016: Edge functions setup (optional)
```

---

### ✅ STEP 6: Verify Complete Setup (MIGRATION 017)

```sql
-- MIGRATION 017: Run verification queries
-- Confirm all tables, RLS, indexes, policies present
```

**Full verification:**
```sql
-- 1. Check all tables exist
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'word_builder_%';
-- Expected: 4

-- 2. Check RLS enabled
SELECT COUNT(*) as rls_count FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%' AND rowsecurity;
-- Expected: 4

-- 3. Check indexes
SELECT COUNT(*) as index_count FROM pg_indexes 
WHERE schemaname = 'public' AND tablename LIKE 'word_builder_%';
-- Expected: 10+

-- 4. Check RLS policies
SELECT COUNT(*) as policy_count FROM pg_policies
WHERE tablename LIKE 'word_builder_%';
-- Expected: 20+ (4-5 per table)

-- 5. Check function exists
SELECT COUNT(*) as function_count FROM information_schema.routines 
WHERE routine_name IN ('update_updated_at_column', 'reset_expired_streaks', 'check_achievement_unlock');
-- Expected: 1 (others optional)
```

---

## 🚨 Common Errors & Fixes

### Error: "function update_updated_at_column() does not exist"

```
ERROR: 42883: function update_updated_at_column() does not exist
```

**Fix:** You ran tables BEFORE the function.

1. **Rollback:** Delete all tables (START OVER)
2. **Run MIGRATION 001 first** (create function)
3. **Then run MIGRATION 002-005** (create tables)
4. **Then run MIGRATION 006+** (RLS, indexes, etc.)

```sql
-- If you can't rollback, drop the problematic table:
DROP TABLE IF EXISTS word_builder_progress CASCADE;

-- Then run all migrations in correct order from scratch
```

### Error: "table already exists"

```
ERROR: relation "word_builder_progress" already exists
```

**Fix:** Use `IF NOT EXISTS` (already in migrations) or drop first:

```sql
DROP TABLE IF EXISTS word_builder_progress CASCADE;
-- Then re-run MIGRATION 002
```

### Error: "permission denied for schema public"

```
ERROR: permission denied for schema public
```

**Fix:** Check Supabase role. Use authenticated user (not service role) in SQL Editor.

---

## ⏱️ Estimated Time

| Step | Time | Notes |
|------|------|-------|
| MIGRATION 001 (function) | <1 sec | Must run first |
| MIGRATION 002-005 (tables) | <5 sec | All 4 tables created |
| MIGRATION 006-010 (RLS) | <5 sec | Policies applied |
| MIGRATION 011 (indexes) | <10 sec | 10+ indexes created |
| MIGRATION 012-016 (optional) | <10 sec | Deferred to V2 if needed |
| MIGRATION 017 (verification) | <5 sec | Confirm setup |
| **Total** | **~40 sec** | All migrations complete |

---

## 📋 Copy-Paste Checklist

**Follow this checklist exactly:**

```
[ ] 1. Open Supabase SQL Editor
[ ] 2. Copy MIGRATION 001 (create function) → Paste → Run
    ✓ Wait for success: "execute query successfully"
[ ] 3. Copy MIGRATION 002 → Paste → Run ✓
[ ] 4. Copy MIGRATION 003 → Paste → Run ✓
[ ] 5. Copy MIGRATION 004 → Paste → Run ✓
[ ] 6. Copy MIGRATION 005 → Paste → Run ✓
[ ] 7. Copy MIGRATION 006 → Paste → Run ✓
[ ] 8. Copy MIGRATION 007 → Paste → Run ✓
[ ] 9. Copy MIGRATION 008 → Paste → Run ✓
[ ] 10. Copy MIGRATION 009 → Paste → Run ✓
[ ] 11. Copy MIGRATION 010 → Paste → Run ✓
[ ] 12. Copy MIGRATION 011 → Paste → Run ✓
[ ] 13. [OPTIONAL] Copy MIGRATION 012-016 → Run
[ ] 14. Copy MIGRATION 017 (verification) → Run ✓
[ ] 15. Verify all checks pass (see verification section above)
```

---

## Next: Application Integration

After migrations complete:

1. **Generate TypeScript types:**
   ```bash
   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
   ```

2. **Update .env.local** with Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Test RLS isolation:**
   ```sql
   -- As user 1:
   SELECT * FROM word_builder_progress;
   -- Should only show user 1's data
   
   -- As user 2:
   SELECT * FROM word_builder_progress;
   -- Should only show user 2's data (RLS blocks cross-user access)
   ```

4. **Run application tests** to verify database integration

---

**Last Updated:** August 31, 2026
**Status:** ✅ Migration order FIXED
**Critical Lesson:** Function MUST exist before triggers reference it!
