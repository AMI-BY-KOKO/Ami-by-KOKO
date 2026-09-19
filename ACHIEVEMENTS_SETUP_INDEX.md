# Achievements System — Setup & Reference Index

## 🎯 Quick Links

| Purpose | File | Action |
|---------|------|--------|
| **Setup/Fix** | `MASTER_ACHIEVEMENTS_SETUP.sql` | Copy entire file → Supabase SQL Editor → Run |
| **Reference** | `MASTER_ACHIEVEMENTS_GUIDE.md` | Read for architecture, troubleshooting, RPC details |
| **Migrations** | `supabase/migrations/20240014_achievements_system.sql` | Auto-deployed with app (for reference) |
| **Migrations** | `supabase/migrations/20240015_fix_achievements_grants.sql` | Auto-deployed with app (for reference) |
| **UI Component** | `src/components/AchievementDisplay.tsx` | Renders achievements (already implemented) |
| **Hooks** | `src/hooks/useProgress.ts` | Auto-awards achievements on activity completion |
| **API** | `src/app/api/progress/route.ts` | Persists progress to database |

---

## 📋 Setup Instructions (2 minutes)

### Step 1: Run SQL
1. Go to https://supabase.com → Your Project → SQL Editor
2. Click "+ New query"
3. Open `MASTER_ACHIEVEMENTS_SETUP.sql` and copy **entire** contents
4. Paste into SQL Editor
5. Click blue "Run" button
6. Wait for completion (no errors expected)

### Step 2: Verify
1. Run diagnostics queries at bottom of SQL file
2. All checks should return expected results

### Step 3: Test
1. Hard refresh browser: **Ctrl+Shift+R**
2. Go to home page
3. Scroll to "🏆 Achievements"
4. Verify earned achievements show

---

## 📁 File Organization

### Production Code
```
supabase/
  └── migrations/
      ├── 20240014_achievements_system.sql     (schema, RPC, RLS)
      └── 20240015_fix_achievements_grants.sql (grants, RLS policies)

src/
  ├── components/AchievementDisplay.tsx        (UI - renders badges)
  ├── lib/achievements/actions.ts              (RPC client functions)
  ├── hooks/useProgress.ts                     (auto-award logic)
  └── app/api/progress/route.ts                (persist progress)
```

### Master Files (Root)
```
MASTER_ACHIEVEMENTS_SETUP.sql          ← Run this to set up/fix achievements
MASTER_ACHIEVEMENTS_GUIDE.md           ← Read for full reference
ACHIEVEMENTS_SETUP_INDEX.md            ← This file (quick reference)
```

### Archives (Reference Only)
```
OLD_SQL_ARCHIVE/                       (27 old SQL files - can delete)
OLD_DOCS_ARCHIVE/                      (53 old documentation files - can delete)
```

---

## 🔍 Understanding the System

### Achievement Types

| Type | Example | Criteria |
|------|---------|----------|
| **First Activity** | First Letter | Complete 1+ activity with prefix |
| **Activity Count** | Alphabet Explorer | Complete 10+ activities with prefix |
| **Streak** | Consistent Learner | Maintain 7+ day streak |

### The Flow

```
User completes activity → API saves progress → RPC checks criteria 
→ If met: insert into child_achievements → Browser fetches achievements 
→ UI renders earned + locked badges
```

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `achievements` | Achievement catalog | id, code, name, icon, criteria_type |
| `child_achievements` | Per-child earned badges | child_id, achievement_id, earned_at |
| `child_progress` | Activity tracking | child_id, activity_ref, status |

---

## 🛠️ Troubleshooting

### Achievements in DB but not in UI
→ **Fix:** Run `MASTER_ACHIEVEMENTS_SETUP.sql` to enable RLS on achievements table

### Achievements not awarded after completing activity
→ **Check:** Is `child_progress` table being updated? Query: `SELECT * FROM child_progress WHERE child_id = ? AND activity_ref LIKE 'letter_%'`

### Browser shows empty array `[]`
→ **Debug:** Open console (F12), look for `[AchievementDisplay]` logs, check RLS policies

### Still not working after running SQL
→ **Next:** Check `MASTER_ACHIEVEMENTS_GUIDE.md` troubleshooting section for advanced diagnostics

---

## 📊 Achievements List

1. **🏆 First Letter** — Complete first letter activity
2. **🔤 Alphabet Explorer** — Complete 10 letter activities
3. **🔢 Number Champion** — Complete 10 number activities
4. **📚 Story Explorer** — Complete 5 story activities
5. **📖 Vocabulary Builder** — Complete 5 vocabulary activities
6. **🌍 World Explorer** — Complete 3 world activities
7. **🔥 Consistent Learner** — Maintain 7-day streak
8. **🔥🔥 Streak Master** — Maintain 30-day streak

---

## ✅ Verification Checklist

After running SQL, verify:

- [ ] No error messages in SQL Editor
- [ ] `SELECT COUNT(*) FROM achievements` returns 8
- [ ] `SELECT COUNT(*) FROM pg_policies WHERE tablename = 'achievements'` returns 1
- [ ] Browser displays earned achievements as colored badges
- [ ] New activities auto-award achievements
- [ ] Unearned achievements show as grayed out

---

## 🚀 Next Steps

1. **If working:** Monitor achievements being awarded to children during sessions
2. **If still not working:** Follow "Troubleshooting" in `MASTER_ACHIEVEMENTS_GUIDE.md`
3. **For new achievements:** Add to seed data in SQL (lines ~350)
4. **For new criteria:** Modify `check_and_award_achievements()` RPC function

---

## 📞 Support

**All documentation is consolidated in:**
- `MASTER_ACHIEVEMENTS_GUIDE.md` (comprehensive reference)
- `MASTER_ACHIEVEMENTS_SETUP.sql` (includes diagnostics queries)

**Old files moved to archives** (can be deleted):
- `OLD_SQL_ARCHIVE/` — Contains 27 old SQL files
- `OLD_DOCS_ARCHIVE/` — Contains 53 old documentation files

---

**Last Updated:** September 18, 2026  
**Status:** Ready for deployment
