# MASTER ACHIEVEMENTS SYSTEM GUIDE

## Quick Links
- **Setup SQL:** `MASTER_ACHIEVEMENTS_SETUP.sql` — Run this in Supabase to set up or fix achievements
- **Status:** All components ready (schema, RPC, RLS, seed data)
- **Current Issue:** Achievements showing in DB but not in UI (RLS policy fix pending)

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [System Overview](#system-overview)
3. [Database Schema](#database-schema)
4. [How Achievements Work](#how-achievements-work)
5. [RPC Functions](#rpc-functions)
6. [Troubleshooting](#troubleshooting)
7. [Deployment Checklist](#deployment-checklist)

---

## Quick Start

### For Immediate Fix
1. Open https://supabase.com → Your Project → SQL Editor
2. Click "+ New Query"
3. **Copy entire contents of `MASTER_ACHIEVEMENTS_SETUP.sql`**
4. Paste into SQL Editor
5. Click blue "Run" button
6. Hard refresh browser: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
7. Go to home page → scroll to "🏆 Achievements"

### Expected Result
- Earned achievements display in colored boxes
- Unearned achievements display grayed out
- New activities auto-award achievements when criteria met

---

## System Overview

### Goals
- Award badges when children complete learning activities
- Show earned vs locked achievements in UI
- Track progress per child

### Architecture

```
Child completes activity
    ↓
recordCorrect() or recordTraced() hook
    ↓
POST /api/progress persists to child_progress table
    ↓
checkAndAwardAchievements() RPC called
    → Checks if criteria met
    → If yes, inserts into child_achievements table
    ↓
Browser calls getChildAllAchievements() RPC
    → Reads achievements table (catalog)
    → LEFT JOIN with child_achievements (earned status)
    → Returns 8 achievements (1+ earned, rest locked)
    ↓
AchievementDisplay component renders
    → Earned badges in color
    → Unearned badges grayed out
```

---

## Database Schema

### Table 1: `achievements` (Global Catalog)

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT,
  icon TEXT,
  description TEXT,
  criteria_type TEXT CHECK (IN 'first_activity', 'activity_prefix_count', 'streak_length'),
  criteria_value TEXT,
  created_at TIMESTAMP
);
```

**Seeded with 8 achievements:**
1. **First Letter** (🏆) — Complete first letter activity
2. **Alphabet Explorer** (🔤) — Complete 10 letter activities
3. **Number Champion** (🔢) — Complete 10 number activities
4. **Story Explorer** (📚) — Complete 5 story activities
5. **Vocabulary Builder** (📖) — Complete 5 vocabulary activities
6. **World Explorer** (🌍) — Complete 3 world activities
7. **Consistent Learner** (🔥) — Maintain 7-day streak
8. **Streak Master** (🔥🔥) — Maintain 30-day streak

### Table 2: `child_achievements` (Per-Child Earned Badges)

```sql
CREATE TABLE child_achievements (
  id UUID PRIMARY KEY,
  child_id UUID REFERENCES children(id),  -- ← Points to children table (authoritative)
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMP,
  UNIQUE(child_id, achievement_id)
);
```

**Example row:**
```
child_id: <otuekah-cherish-uuid>
achievement_id: <first-letter-achievement-uuid>
earned_at: 2026-09-18 08:30:15
```

---

## How Achievements Work

### Criteria Types

#### 1. `first_activity` — First Time Completing Activity Type
- **Example:** First Letter achievement
- **Check:** `SELECT * FROM child_progress WHERE activity_ref LIKE 'letter_%' AND status IN ('completed', 'mastered')`
- **Award:** When first match found

#### 2. `activity_prefix_count` — N Activities of Type
- **Example:** Alphabet Explorer (10 letters), Number Champion (10 numbers)
- **Format:** `"prefix|threshold"` (e.g., `"letter_|10"`)
- **Check:** `COUNT(*) WHERE activity_ref LIKE 'letter_%' AND status IN ('completed', 'mastered')`
- **Award:** When count >= threshold

#### 3. `streak_length` — N-Day Streak
- **Example:** Consistent Learner (7 days), Streak Master (30 days)
- **Check:** `children.current_streak >= criteria_value`
- **Award:** When streak meets/exceeds value

### Status Field Values

In `child_progress` table:
- `locked` — Activity available but not started
- `available` — Activity can be interacted with
- `completed` — Activity marked complete
- `mastered` — Activity fully mastered (for first_activity checks)

---

## RPC Functions

### 1. `check_and_award_achievements(p_child_id UUID)`

**Purpose:** Check all unearned achievements and award newly met ones

**Called by:** `src/hooks/useProgress.ts` after `recordCorrect()` or `recordTraced()`

**Returns:**
```typescript
{
  success: BOOLEAN,
  achievements_awarded: INTEGER,  // Number of new achievements
  new_achievement_ids: UUID[],    // Array of achievement IDs
  error: TEXT
}
```

**Example call:**
```typescript
const result = await checkAndAwardAchievements(childId);
if (result.success && result.newAchievementIds.length > 0) {
  console.log("🏆 New achievements:", result.newAchievementIds);
}
```

### 2. `get_child_achievements(p_child_id UUID)`

**Purpose:** Get only EARNED achievements for a child

**Called by:** Dashboards, profile pages

**Returns:**
```typescript
[
  {
    id: UUID,
    code: "first_letter",
    name: "🏆 First Letter",
    icon: "🏆",
    description: "Completed your first letter activity",
    earned_at: "2026-09-18T08:30:15Z"
  },
  ...
]
```

### 3. `get_child_all_achievements(p_child_id UUID)` ⭐ **Used by UI**

**Purpose:** Get ALL achievements (earned + unearned) with earned status

**Called by:** `src/lib/achievements/actions.ts` → `src/components/AchievementDisplay.tsx`

**Returns:**
```typescript
[
  {
    id: UUID,
    code: "first_letter",
    name: "🏆 First Letter",
    icon: "🏆",
    description: "Completed your first letter activity",
    earned: true,         // ← Earned flag
    earned_at: "2026-09-18T08:30:15Z"
  },
  {
    id: UUID,
    code: "alphabet_explorer",
    name: "🔤 Alphabet Explorer",
    icon: "🔤",
    description: "Completed 10 letter activities",
    earned: false,        // ← Not earned yet
    earned_at: null
  },
  ...
]
```

---

## Code Flow

### When User Completes Activity

```
LetterDetail.tsx
  → onTraced() or onCorrect()
    → useProgress.recordTraced() or recordCorrect()
      → upsertProgress() — updates child_progress table
        → POST /api/progress
          → child_progress upserted with activity_ref + status
      → checkAndAwardAchievements(childId) RPC called
        → check_and_award_achievements() PL/pgSQL function
          → Loops through unearned achievements
          → Checks criteria against child_progress
          → If met: inserts into child_achievements
          → Returns newAchievementIds
      → If newAchievementIds > 0
        → Show celebration modal
```

### When UI Loads

```
AchievementDisplay.tsx
  → useEffect calls getChildAllAchievements(childId)
    → Client RPC call
      → get_child_all_achievements() function
        → SELECT achievements LEFT JOIN child_achievements
        → Returns 8 achievements (1+ earned, rest locked)
  → Component renders
    → earnedAchievements.filter(a => a.earned)
    → unearnedAchievements.filter(a => !a.earned)
    → Render in two sections
```

---

## RLS Policies

### Table: `achievements`

| Policy | Type | Condition | Purpose |
|--------|------|-----------|---------|
| "Authenticated users can view achievements catalog" | SELECT | `USING (true)` | Allow any authenticated user to read achievement catalog |

**Why important:** RPC functions need to read achievement names/icons when joining with child_achievements.

### Table: `child_achievements`

| Policy | Type | Condition | Purpose |
|--------|------|-----------|---------|
| "Parents can view child achievements" | SELECT | Parent owns the child | Parents see achievements of their children |
| "Students can view own achievements" | SELECT | Student owns own profile | Students see own achievements |
| "System can manage achievements" | ALL | `true` | RPC functions can insert new achievements |

---

## Troubleshooting

### Issue: Achievements show in DB but not in UI

**Symptom:**
- Supabase shows: `SELECT * FROM child_achievements` returns 1 row
- UI shows: All badges grayed out

**Root Cause:**
- `achievements` table has no RLS policy
- RPC can't read achievement catalog
- Returns empty array to browser

**Fix:**
```sql
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view achievements catalog"
  ON public.achievements
  FOR SELECT
  USING (true);
```

### Issue: RPC function returns empty array

**Debug steps:**
1. Open browser console (F12)
2. Look for `[AchievementDisplay]` logs
3. Check what `getChildAllAchievements()` returned

If empty array:
- Check RLS policies on achievements table
- Verify RPC function GRANT statements
- Run diagnostics queries from `MASTER_ACHIEVEMENTS_SETUP.sql`

### Issue: Achievements not awarded after completing activity

**Symptom:** Complete letter, but achievement doesn't appear

**Check:**
1. Did `checkAndAwardAchievements` get called?
   - Check `src/hooks/useProgress.ts` logs
2. Is child_progress table updated?
   - Query: `SELECT * FROM child_progress WHERE child_id = ? AND activity_ref = 'letter_a'`
3. Do criteria match?
   - For "First Letter": Should have 1 row with `activity_ref LIKE 'letter_%'`

---

## Deployment Checklist

### Before Running SQL
- [ ] Backup Supabase database (optional but recommended)
- [ ] Verify you're in correct Supabase project
- [ ] No other users running migrations simultaneously

### Running SQL
- [ ] Go to Supabase SQL Editor
- [ ] Copy entire `MASTER_ACHIEVEMENTS_SETUP.sql`
- [ ] Paste into query window
- [ ] Click "Run"
- [ ] Check for errors (should see none)

### Verification
- [ ] Run diagnostics queries (bottom of SQL file)
- [ ] Verify achievements table has 8 rows
- [ ] Verify RLS policies are created
- [ ] Verify RPC functions exist

### Testing
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Navigate to home page
- [ ] Scroll to "🏆 Achievements" section
- [ ] Check earned achievements display

### If Still Not Working
- [ ] Clear browser cache completely
- [ ] Try in incognito/private mode
- [ ] Check browser console for errors
- [ ] Run SQL diagnostics again
- [ ] Contact support with console logs

---

## Files Structure

### Production (In `supabase/migrations/`)
- `20240014_achievements_system.sql` — Core schema + RPC + policies
- `20240015_fix_achievements_grants.sql` — GRANT statements + RLS fix

### Documentation (Root)
- `MASTER_ACHIEVEMENTS_SETUP.sql` — Single consolidated SQL file
- `MASTER_ACHIEVEMENTS_GUIDE.md` — This file

### UI Components
- `src/components/AchievementDisplay.tsx` — Renders achievements
- `src/lib/achievements/actions.ts` — RPC client functions
- `src/hooks/useProgress.ts` — Calls checkAndAwardAchievements

### API
- `src/app/api/progress/route.ts` — Persists progress to child_progress table

---

## Related Systems

### Depends On
- `children` table (authoritative for all gamification)
- `child_progress` table (tracks activities, used for achievement criteria)
- `streaks` system (tracks daily streak for streak achievements)
- `xp_events` table (used for level calculation in RPC)

### Used By
- Home page (displays achievement badges)
- Parent dashboard (shows child progress)
- School dashboard (shows class achievements)

---

## Appendix: SQL Diagnostic Queries

Run in Supabase SQL Editor to verify deployment:

### Check 1: Achievements Seeded
```sql
SELECT code, name, criteria_type FROM public.achievements ORDER BY code;
```
Expected: 8 rows

### Check 2: Child Achievements
```sql
SELECT c.name, a.name, ca.earned_at
FROM child_achievements ca
JOIN children c ON c.id = ca.child_id
JOIN achievements a ON a.id = ca.achievement_id
ORDER BY ca.earned_at DESC;
```
Expected: 0+ rows (depending on what's been awarded)

### Check 3: RLS Policies
```sql
SELECT tablename, policyname, permissive, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('achievements', 'child_achievements')
ORDER BY tablename;
```
Expected: 4 policies total (1 achievements + 3 child_achievements)

### Check 4: RPC Function Permissions
```sql
SELECT routine_name, routine_schema
FROM information_schema.routine_table 
WHERE routine_schema = 'public' 
  AND routine_name IN ('check_and_award_achievements', 'get_child_achievements', 'get_child_all_achievements');
```
Expected: 3 rows

---

## Contact & Support
For issues or questions, refer to:
- Browser console logs: `[AchievementDisplay]` prefix
- Supabase diagnostics queries above
- Check database state in Supabase dashboard

