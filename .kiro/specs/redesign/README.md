# Visual Redesign Specification — Àmì by Kòkò

## 📋 Overview

This folder contains the complete specification for redesigning Àmì by Kòkò to match the provided reference designs. The redesign focuses on **visual polish only** — no business logic, data structure, or authentication changes.

**Status:** 🔴 **PENDING APPROVAL** — No files have been modified. Awaiting user sign-off before implementation begins.

---

## 📁 Documents in This Spec

### 1. **REDESIGN_SPEC.md** (Main Planning Document)
**What it contains:**
- Complete codebase scan (all routes, pages, components)
- 10-phase implementation plan with timeline
- Phased rollout strategy
- Success criteria
- Timeline estimate: **12–18 working days**

**Key sections:**
- Section 1: All routes by audience (public, auth, child, parent, school, super-admin)
- Section 4: Current design tokens vs. target tokens
- Section 5: Phased redesign plan (phases 1–10)
- Section 7: Reference design specifications (colours, typography, spacing)

**Start here** → Review the implementation phases and timeline.

---

### 2. **REFERENCE_MAPPING.md** (Design-to-Code Alignment)
**What it contains:**
- Reference image breakdown (13 school admin screens, child learning pages, etc.)
- Page-by-page mapping of reference designs to existing routes
- Implementation checklist per page
- Component styling updates needed
- Responsive breakpoint specifications

**Key sections:**
- Section 1–6: Reference images mapped to routes (marked ✅ if exists, ⚠️ if partial)
- Font & diacritic verification checklist
- Success criteria checklist

**Use this** → To understand which reference design each page should match.

---

### 3. **COMPONENT_AUDIT.md** (Component Inventory & Refactoring Guide)
**What it contains:**
- Current component list (existing in `src/components/ui/`)
- Components to create (new primitives: Button, Card, CategoryTile, etc.)
- Hardcoded colour replacements
- Button & card style variants
- New Tailwind token additions
- A11y checkpoints
- Implementation order by priority
- Testing matrix

**Key sections:**
- Existing components table (current style → redesign action)
- Primitives to create (13 new components)
- Hardcoded colour search-and-replace reference
- Testing matrix for responsive, touch, keyboard, a11y

**Use this** → To track which components exist vs. need creation, and see current styling vs. target.

---

## 🎨 Quick Reference: Design Changes

### Colour Palette Shift

| Aspect | Current | → Target |
|--------|---------|----------|
| Primary | Amber `#F59E0B` | Green `#1FA463` |
| Accent | Pink `#F43F5E` | Yellow `#FFC93C` |
| Background | Cream (inconsistent) | Warm cream `#FFFBEF` |
| Text | Various | Navy `#1B2A5B` (headings), `#475074` (body) |
| Categories | Scattered gradients | Pastel tints + solid colour icons (sky, purple, orange, pink, green, yellow) |

### Typography Changes

| Element | Current | → Target |
|---------|---------|----------|
| Display/Headings | Geist Sans | Baloo 2 or Fredoka (friendly, rounded) |
| Body/UI | Geist Sans | Nunito |
| Tap targets | ~48px | Min 48×48px (verified) |
| Focus rings | Amber | Green (primary) |

### Component Updates (Examples)

| Component | Current | → Target |
|-----------|---------|----------|
| Card | Various styles | White bg, `rounded-20px`, soft shadow |
| Button | Amber/green variants | Green pill-shaped or rounded-14px, yellow accent variant |
| Category Tile | Gradient backgrounds | Pastel bg + solid icon colour + rounded-20px |
| Modal | Standard | `rounded-20px`, cream background, green close button |
| Progress Bar | Various | `rounded-8px`, category colour, smooth animation |
| Badges | Various | Pill-shaped, status-specific or category colour |

---

## 🚀 Phased Plan Summary

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| 1 | Design tokens, typography, Tailwind config | 1–2 days | ⏳ Not started |
| 2 | Shared UI primitives (Button, Card, CategoryTile, etc.) | 2–3 days | ⏳ Not started |
| 3 | Marketing pages (`/`, legal pages) | 1–2 days | ⏳ Not started |
| 4 | Auth & onboarding pages | 1–2 days | ⏳ Not started |
| 5 | Child-facing learning pages (home, phonics, games, story, etc.) | 3–4 days | ⏳ Not started |
| 6 | Parent dashboard & settings | 2–3 days | ⏳ Not started |
| 7 | School admin dashboard | 2–3 days | ⏳ Not started |
| 8 | Super-admin pages | 1–2 days | ⏳ Not started |
| 9 | Responsive & a11y polish | 1–2 days | ⏳ Not started |
| 10 | Asset integration & final QA | 1–2 days | ⏳ Not started |

**Total: 12–18 working days**

---

## ✅ Success Criteria

Before declaring the redesign complete:

- [ ] All pages match reference design visually
- [ ] Tailwind builds with no errors (`npm run build`)
- [ ] TypeScript compiles cleanly (`npm run type-check`)
- [ ] All tap targets ≥ 48×48px
- [ ] Focus rings visible (green outline)
- [ ] Responsive on mobile Chrome (primary target)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Yoruba diacritics (À, ì, ò, ṣ, ẹ, ọ) render correctly in chosen fonts
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No breaking changes to props/APIs
- [ ] All existing features work (audio, DJ, stories, games, progress)

---

## ❌ Out of Scope

**This redesign does NOT include:**
- ❌ Changes to Supabase schema
- ❌ Modifications to RLS policies
- ❌ Auth flow changes
- ❌ Payment/Paystack changes
- ❌ API route changes
- ❌ Feature removals or additions
- ❌ Offline/PWA mode
- ❌ Push notifications
- ❌ Any backend changes

**This is purely a visual/styling redesign.**

---

## 📊 Codebase Scan Summary

### Routes by Audience
- **Public/Marketing:** 4 pages (`/`, `/about`, `/terms`, `/privacy`)
- **Auth/Onboarding:** 9 pages (signup, login, reset, OTP, etc.)
- **Child Learning:** 23+ pages (home, phonics, games, stories, world, etc.)
- **Parent Dashboard:** 2 main pages (dashboard, settings)
- **School Admin:** 8+ pages (dashboard, class management, reports, etc.)
- **Super-Admin:** 7+ pages (schools, users, content, revenue, etc.)

**Total: 50+ routes**

### Existing Components
- **UI Primitives:** 18 components (ProgressBar, StreakBadge, Modals, etc.)
- **Feature-Specific:** 40+ components (DJ, phonics, stories, numeracy, school, etc.)
- **Characters:** 2 components (Ami, Koko — currently emoji, need SVG assets)

**Total: 60+ components**

### Current Styling Approach
- ✅ Tailwind CSS with custom tokens (amber-koko, green-ami, coral-celebrate, cream-bg)
- ⚠️ Hardcoded colours in pages (scattered hex values, inconsistent use of tokens)
- ⚠️ No centralized component library (each page reinvents styling)
- ⚠️ Emoji placeholders for mascots (waiting for SVG/PNG assets)

---

## 🔧 Implementation Checklist

Before starting Phase 1, verify:

- [ ] User has reviewed and approved this spec
- [ ] Reference design images are accessible in `/public` or linked
- [ ] Àmì & Kòkò SVG/PNG character assets are ready (check `/public/assets/characters/`)
- [ ] Font rendering tested: Baloo 2/Fredoka + Nunito with Yoruba diacritics
- [ ] Git branch `feat/visual-redesign-v2` is created
- [ ] `.kiro/steering/design-system.md` has been reviewed (contains reference design specs)

---

## 🎯 Next Steps

### 1. Review & Approval ✋
- Read through this README and the main REDESIGN_SPEC.md
- Review the reference design images (attached to original request)
- Review COMPONENT_AUDIT.md for component-level changes
- **Approve or request changes** before proceeding

### 2. Setup ✅
- Create Git branch `feat/visual-redesign-v2`
- Verify font files (Baloo 2, Fredoka, Nunito) can be imported
- Check Yoruba diacritics render correctly
- Confirm Àmì & Kòkò character assets location

### 3. Execution 🚀
- Start Phase 1: Design tokens & theme
- Follow the phased plan in REDESIGN_SPEC.md Section 5
- Commit per phase (or per page) for review
- Run tests after each phase

### 4. Verification 🧪
- Run `npm run type-check` regularly (no `any` types)
- Use Lighthouse for a11y audit
- Test responsive design on mobile Chrome
- Verify keyboard navigation & screen reader compatibility
- Check all brand colours in use

---

## 📞 Questions?

Refer to the detailed spec documents:
- **"What pages need redesigning?"** → REFERENCE_MAPPING.md
- **"What components need to change?"** → COMPONENT_AUDIT.md
- **"What's the implementation plan?"** → REDESIGN_SPEC.md Section 5
- **"What colours should I use?"** → REDESIGN_SPEC.md Section 7 + COMPONENT_AUDIT.md
- **"How long will this take?"** → REDESIGN_SPEC.md Section 9 (Timeline)

---

## 📝 Metadata

| Field | Value |
|-------|-------|
| **Project** | Àmì by Kòkò app redesign |
| **Objective** | Visual redesign to match reference designs (warm cream, green + yellow palette, pastel tiles, Àmì & Kòkò mascots) |
| **Scope** | Styling only — no business logic, schema, auth, or feature changes |
| **Tech Stack** | Next.js 15, TypeScript, Tailwind v4, Framer Motion, Supabase |
| **Primary Target** | Mobile Chrome (375px+) |
| **Estimated Duration** | 12–18 working days |
| **Status** | 🔴 Planning — awaiting approval |
| **Created** | October 12, 2026 |
| **Version** | 1.0 — Draft |

---

## 🙏 Ready to Redesign!

This specification is **comprehensive, detailed, and ready to execute**. Once approved, implementation can begin immediately with Phase 1.

**Awaiting your approval to proceed.** ✋

---

*For detailed breakdowns, see REDESIGN_SPEC.md, REFERENCE_MAPPING.md, and COMPONENT_AUDIT.md.*
