# Àmì by Kòkò Visual Redesign Specification

**Status:** Planning phase — awaiting approval before implementation

**Objective:** Align the entire app's visual identity with reference designs (warm cream backgrounds, green + yellow + coral palette, pastel category tiles, rounded cards, featuring Àmì & Kòkò mascots).

---

## 1. CODEBASE SCAN: Routes & Pages by Audience

### Public / Marketing Pages
| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/(public)/page.tsx` | Landing page — hero, features, testimonials, CTA |
| `/about` | `src/app/(public)/about/page.tsx` | About the app and mission |
| `/terms` | `src/app/(public)/terms/page.tsx` | Terms of Service |
| `/privacy` | `src/app/(public)/privacy/page.tsx` | Privacy Policy |

### Auth & Onboarding Pages
| Route | File | Purpose |
|-------|------|---------|
| `/auth/signup` | `src/app/(public)/auth/signup/page.tsx` | Parent sign-up form |
| `/auth/login` | `src/app/(public)/auth/login/page.tsx` | Parent login |
| `/auth/select-role` | `src/app/(public)/auth/select-role/page.tsx` | Role selection (Parent/School) |
| `/auth/reset-password` | `src/app/(public)/auth/reset-password/page.tsx` | Password reset |
| `/auth/update-password` | `src/app/(public)/auth/update-password/page.tsx` | Update password after reset |
| `/auth/verify-otp` | `src/app/(public)/auth/verify-otp/page.tsx` | OTP verification |
| `/auth/confirm` | `src/app/(public)/auth/confirm/page.tsx` | Email confirmation |
| `/student-login` | `src/app/(public)/student-login/page.tsx` | School student login (quick PIN entry) |
| `/onboarding` | `src/app/(public)/onboarding/page.tsx` | Parent onboarding flow |

### Child-Facing Pages (Learning & Content)
| Route | File | Purpose |
|-------|------|---------|
| `/home` | `src/app/(app)/home/page.tsx` | Child home/learning hub — mode selection |
| `/phonics` | `src/app/(app)/phonics/page.tsx` | Phonics Mode — letter selection & tracing |
| `/literacy` | `src/app/(app)/literacy/page.tsx` | Literacy/language learning activities |
| `/numeracy` | `src/app/(app)/numeracy/page.tsx` | Numbers & counting |
| `/world` | `src/app/(app)/world/page.tsx` | World/animals/colours exploration |
| `/word-builder` | `src/app/(app)/word-builder/page.tsx` | Word-building game (Kòkò's adventure) |
| `/dj-booth` | `src/app/(app)/dj-booth/page.tsx` | DJ mixing board — Web Audio API |
| `/story` | `src/app/(app)/story/page.tsx` | Story Mode — "Kòkò Lost His Voice" narrative |
| `/stories` | `src/app/(app)/stories/page.tsx` | Story library/selection page |
| `/games/*` | `src/app/(app)/games/*/page.tsx` | Various games (letter-hunt, etc.) |
| `/assignment` | `src/app/(app)/assignment/page.tsx` | Assigned activities |
| `/colours-shapes`, `/letter-name`, `/music-arts`, `/practical-life`, `/science`, `/seasonal`, `/social`, `/vocabulary`, `/zoology` | Various | Subject-specific learning areas |

### Parent Dashboard Pages
| Route | File | Purpose |
|-------|------|---------|
| `/dashboard/parent` | `src/app/(app)/dashboard/parent/page.tsx` | Parent progress dashboard — children overview, activity logs, streak |
| `/settings` | `src/app/(app)/settings/page.tsx` | Parent account & content settings |
| `/live-class` | `src/app/(app)/live-class/page.tsx` | Live class feature (if applicable) |
| `/health` | `src/app/(app)/health/page.tsx` | Child wellness tracking |

### School Admin Pages
| Route | File | Purpose |
|-------|------|---------|
| `/school-setup` | `src/app/(app)/school-setup/page.tsx` | Initial school setup/onboarding |
| `/dashboard/school` | `src/app/(app)/dashboard/school/page.tsx` | School admin dashboard — students, classes, reports, exports |
| `/super-admin` | `src/app/super-admin/page.tsx` | **Platform super-admin** (system-level) |
| `/super-admin/schools` | `src/app/super-admin/schools/page.tsx` | Manage schools (super-admin only) |
| `/super-admin/users` | `src/app/super-admin/users/page.tsx` | Manage users (super-admin only) |
| `/super-admin/content` | `src/app/super-admin/content/page.tsx` | Content management (super-admin only) |
| `/super-admin/revenue` | `src/app/super-admin/revenue/page.tsx` | Revenue tracking (super-admin only) |
| `/super-admin/broadcast` | `src/app/super-admin/broadcast/page.tsx` | System broadcasts (super-admin only) |
| `/super-admin/system` | `src/app/super-admin/system/page.tsx` | System administration (super-admin only) |

---

## 2. ROUTE-TO-REFERENCE MAPPING

### Reference Images Map
From the provided designs, the following screens are identified:

**MAPPED ROUTES:**
1. ✅ **Landing/Homepage** → `/` (Public landing page)
2. ✅ **Sign Up / Onboarding** → `/auth/signup` + `/onboarding` (Parent/child setup)
3. ✅ **Child Login** → `/student-login` (School students)
4. ✅ **Child Dashboard/Home** → `/home` (Learning hub with 6+ mode cards)
5. ✅ **Learning Content** → `/literacy`, `/numeracy`, `/world`, `/word-builder`, `/dj-booth`, `/story` (Category tiles)
6. ✅ **Progress & Reports** → `/dashboard/parent` (Parent progress view)
7. ✅ **Parent Dashboard** → `/dashboard/parent` (Parent overview, children, activities, reports)
8. ✅ **Settings & Controls** → `/settings` (Parent content filters, screen time, parental controls)
9. ✅ **School Admin Dashboard** → `/dashboard/school` (Classes, students, reports, analytics)
10. ✅ **School Student Management** → `/dashboard/school` (Add/edit students, view progress)
11. ✅ **Rewards & Achievements** → Components integrated in `/home`, `/dashboard/parent` (Badges, streaks)

**REFERENCE SCREENS WITHOUT EXISTING PAGES (Future):**
- Video player gallery (fullscreen video browsing) — currently story player only
- Advanced analytics dashboard (for schools) — basic reports exist
- Content library/browse all lessons (centralized learning discovery) — currently scattered in subjects
- Classroom calendar/scheduling — placeholder structure exists

---

## 3. CURRENT COMPONENT ARCHITECTURE & STYLING

### Shared UI Components
Located in `src/components/ui/`:
- `AppNav.tsx` — Main app navigation
- `BottomNav.tsx` — Bottom navigation bar
- `ProgressBar.tsx` — Progress visualization (linear)
- `StreakBadge.tsx` — Streak display badge
- `StreakDisplay.tsx` — Full streak component
- `StreakMilestoneCelebration.tsx` — Celebration animation
- `ChallengeCard.tsx` — Daily challenge card
- `DailyChallengeCard.tsx` — Enhanced challenge display
- `CreateChildModal.tsx` — Add child modal
- `EditChildModal.tsx` — Edit child modal
- `Certificate.tsx` — Certificate display/printing
- `OnboardingFlow.tsx` — Onboarding wizard
- `OnboardingTour.tsx` — Guided tour
- `LanguagePicker.tsx` — Language selection
- `ComingSoonOverlay.tsx` — Coming soon placeholder
- `SongButton.tsx` — Audio playback button
- `ErrorBoundary.tsx` / `ErrorBoundaryWrapper.tsx` — Error handling
- `PWAManager.tsx` — PWA installation management

### Category-Specific Components (Subdirectories)
- `auth/` — Authentication UI (Google, Apple sign-in buttons)
- `characters/` — `Ami.tsx`, `Koko.tsx` (mascot components)
- `dj/` — DJ Booth UI (`MixingBoard.tsx`, `SoundPad.tsx`)
- `landing/` — `TryALetter.tsx` (interactive demo)
- `numeracy/` — `CountingActivity.tsx`
- `phonics/` — Phonics-specific components
- `school/` — School admin components (`StudentModal.tsx`, `AssignmentModal.tsx`)
- `stories/` — Story components
- `subjects/` — Subject-specific components
- `wordBuilder/` — Word builder game components
- `YouTubeBanner/` — YouTube video embeds
- `achievement*` — Achievement displays
- Other standalone: `AchievementCelebration.tsx`, `AchievementDisplay.tsx`, `DailyChallengeCard.tsx`, `TodaysAdventure.tsx`, `XPDisplay.tsx`, `WhatsAppGroupButton.tsx`

### Current Styling Approach
**Current State:**
- **Tailwind CSS** with custom brand color tokens (amber-koko, green-ami, coral-celebrate, cream-bg)
- **Hardcoded colors** in pages: `#FFFBF0`, `from-amber-400`, `from-green-500`, `from-rose-400` gradients (inconsistent)
- **Emoji placeholders** for characters (👧🏾, 🦜) — awaiting SVG/PNG assets
- **Framer Motion** for animations (bouncing, transitions)
- **No centralized spacing/sizing system** — values scattered across components
- **No shared button/card/badge primitives** — each page reinvents styling

### Hardcoded Colours/Patterns Found
| Pattern | Current | Target |
|---------|---------|--------|
| Primary button | `bg-amber-500 hover:bg-amber-600` | Consolidate → yellow/accent yellow |
| Secondary button | `border-green-700 text-green-800` | Consolidate → green |
| Background | `#FFFBF0` (sometimes), cream-bg token inconsistently used | Always `bg-cream-bg` (warm cream #FEFCE8) |
| Gradients | `from-amber-400`, `from-green-500`, `from-rose-400` | Use design tokens + pastel tints |
| Tap targets | Mostly 48px via globals.css | ✅ Already compliant |
| Focus rings | `outline: 3px solid var(--color-amber-koko)` | ✅ Update to green (primary) |

### Font/Typography
- **Display font:** `var(--font-geist-sans)` — needs update to Baloo 2 or Fredoka (verify Yoruba diacritics)
- **Body font:** `var(--font-geist-sans)` — needs update to Nunito

---

## 4. EXISTING DESIGN TOKENS

**In `globals.css` & `tailwind.config.ts`:**
```
--color-amber-koko:      #F59E0B  (warm amber)
--color-green-ami:       #166534  (deep forest green)
--color-coral-celebrate: #F43F5E  (celebration pink)
--color-cream-bg:        #FEFCE8  (soft cream)
```

**Missing tokens from reference design:**
- Primary green: `#1FA463` (new primary)
- Accent yellow: `#FFC93C` (main CTA)
- Sky blue: `#3B82F6` (content category)
- Purple: `#8B5CF6` (content category)
- Orange: `#FF8A3D` (content category)
- Pink/Magenta: `#EC4899` (content category)
- Navy: `#1B2A5B` (headings/text)
- Body text: `#475074`
- Muted text: `#8A90AD`
- Border: `#EFE8D8` (warm border)
- Pastel tints for each category

---

## 5. PHASED REDESIGN PLAN

### Phase 1: Design Tokens & Theme Foundation (1–2 days)
**Objective:** Establish the new colour palette, typography, and spacing system.

**Tasks:**
- [ ] Update `tailwind.config.ts` with new colour tokens (primary green, yellow, blues, purples, pastels)
- [ ] Update `globals.css` with new typography fonts (Baloo 2 / Fredoka + Nunito)
- [ ] Add Tailwind v4 `@theme` overrides for new palette
- [ ] Create colour/token reference document for designers
- [ ] Verify Yoruba diacritics render in chosen fonts

**Files to modify:**
- `src/app/globals.css`
- `tailwind.config.ts`

**Verification:**
- Tailwind build succeeds with no errors
- All brand tokens accessible in components

---

### Phase 2: Shared UI Component Primitives (2–3 days)
**Objective:** Build reusable component library matching reference design language.

**Tasks:**
- [ ] Create/refactor shared Button primitive (variants: primary green, yellow, outline, soft)
- [ ] Create/refactor shared Card primitive (rounded-20px, white bg, soft shadows)
- [ ] Create/refactor shared StatTile (small stats displays)
- [ ] Create/refactor shared CategoryTile (pastel background + icon + title)
- [ ] Create/refactor shared ProgressBar (rounded 8px, category-colour variants)
- [ ] Create/refactor shared ProgressRing (circular progress for 78% style displays)
- [ ] Create/refactor shared StatusPill (Active/Completed/In Progress badges)
- [ ] Create/refactor shared Avatar component
- [ ] Create/refactor shared Badge component
- [ ] Create/refactor shared Toggle switches (green when active)
- [ ] Create/refactor shared Tabs (pill-style navigation)
- [ ] Create/refactor shared SidebarNav (left sidebar for school admin)
- [ ] Create/refactor shared TopBar (header with logo, user menu, notifications)
- [ ] Create/refactor shared EmptyState (placeholder with Kòkò/Àmì)
- [ ] Create/refactor shared Modal (rounded, cream bg, consistent styling)

**New files to create:**
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/StatTile.tsx`
- `src/components/ui/CategoryTile.tsx`
- `src/components/ui/ProgressRing.tsx`
- `src/components/ui/StatusPill.tsx`
- `src/components/ui/Avatar.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Toggle.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/SidebarNav.tsx`
- `src/components/ui/TopBar.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/Modal.tsx`

**Files to refactor:**
- `src/components/ui/ProgressBar.tsx`
- `src/components/ui/Certificate.tsx`
- Icon system (use lucide-react with soft tinted squares)

**Verification:**
- Component story/showcase page (optional: Storybook or similar)
- TypeScript compiles with no errors
- All components use new tokens, no hardcoded hex values

---

### Phase 3: Marketing / Landing Pages (1–2 days)
**Objective:** Redesign public-facing pages with warm cream background, green/yellow palette, mascots.

**Tasks:**
- [ ] Redesign `/` (landing) — update hero, features grid, testimonials, CTAs with new palette
- [ ] Redesign `/about` — align styling
- [ ] Redesign `/terms` — align styling
- [ ] Redesign `/privacy` — align styling
- [ ] Add Àmì & Kòkò mascot illustrations (SVG/PNG assets) in appropriate hero sections
- [ ] Update navigation bar styling (cream bg, green text, yellow CTA)
- [ ] Update footer styling

**Files to modify:**
- `src/app/(public)/page.tsx`
- `src/app/(public)/about/page.tsx`
- `src/app/(public)/terms/page.tsx`
- `src/app/(public)/privacy/page.tsx`
- `src/components/landing/TryALetter.tsx` (landing demo)
- `src/components/YouTubeBanner/YouTubeBanner.tsx`

**Verification:**
- Pages render correctly on mobile Chrome (primary target)
- Images load properly
- All interactive elements ≥ 48×48px
- Text contrast meets AA standard

---

### Phase 4: Auth & Onboarding Pages (1–2 days)
**Objective:** Redesign parent/child onboarding flow with warm, welcoming aesthetic.

**Tasks:**
- [ ] Redesign `/auth/signup` — parent sign-up form with Kòkò mascot, new button styles
- [ ] Redesign `/auth/login` — login form with new styling
- [ ] Redesign `/auth/select-role` — role picker (Parent / School) with new cards
- [ ] Redesign `/onboarding` — parent onboarding flow (child profile creation, etc.)
- [ ] Redesign `/student-login` — school student quick login PIN entry
- [ ] Redesign password reset / update flows
- [ ] Redesign OTP / email confirmation pages

**Files to modify:**
- `src/app/(public)/auth/*.tsx` (all auth pages)
- `src/app/(public)/onboarding/page.tsx`
- `src/app/(public)/student-login/page.tsx`
- `src/components/auth/*.tsx`

**Verification:**
- Sign-up flow works end-to-end
- Login flows work
- Error messages styled consistently

---

### Phase 5: Child-Facing Pages (3–4 days)
**Objective:** Redesign learning experiences with vibrant pastels, big tap targets, Kòkò presence.

**Tasks:**
- [ ] Redesign `/home` — learning hub with 6+ mode cards (pastel CategoryTiles)
- [ ] Redesign `/phonics` — letter selection + tracing screen
- [ ] Redesign `/literacy`, `/numeracy`, `/world`, `/word-builder` — learning screens
- [ ] Redesign `/dj-booth` — mixing board UI (pads with pastel colours)
- [ ] Redesign `/story` — story mode screens + player UI
- [ ] Redesign `/stories` — story library/gallery
- [ ] Redesign game screens (`/games/letter-hunt`, etc.)
- [ ] Redesign assignment screens
- [ ] Update all learning activity pages to use new CategoryTile + pastel aesthetic
- [ ] Ensure Kòkò/Àmì appear in celebration screens, empty states, success moments

**Files to modify:**
- `src/app/(app)/home/page.tsx`
- `src/app/(app)/phonics/page.tsx`
- `src/app/(app)/literacy/page.tsx` (and other subject pages)
- `src/app/(app)/dj-booth/page.tsx`
- `src/app/(app)/story/page.tsx`
- `src/app/(app)/stories/page.tsx`
- All game page components
- `src/components/ui/DailyChallengeCard.tsx`
- `src/components/ui/ChallengeCard.tsx`
- `src/components/dj/MixingBoard.tsx`
- `src/components/dj/SoundPad.tsx`
- Achievement celebration components

**Verification:**
- All pages render on mobile Chrome
- All tap targets ≥ 48×48px
- Animations smooth (prefers-reduced-motion respected)
- Progress bars/indicators use correct category colours
- Sound/audio still functional (no styling-only changes)

---

### Phase 6: Parent Dashboard Pages (2–3 days)
**Objective:** Redesign parent progress tracking, reports, and controls.

**Tasks:**
- [ ] Redesign `/dashboard/parent` — children overview, activity log, streak, reports
- [ ] Redesign progress cards (StatTile, ProgressRing for % displays)
- [ ] Redesign activity log layout
- [ ] Redesign `/settings` — parent settings, content filters, screen time, parental controls
- [ ] Update charts/analytics styling (colourful bars matching category colours)
- [ ] Add mascot/celebratory elements in success moments

**Files to modify:**
- `src/app/(app)/dashboard/parent/page.tsx`
- `src/app/(app)/settings/page.tsx`
- `src/components/school/` (if parent uses same components as school admin)
- `src/components/ui/StreakDisplay.tsx`
- `src/components/ui/StreakMilestoneCelebration.tsx`
- `src/components/AchievementDisplay.tsx`

**Verification:**
- Parent can see children's progress clearly
- Charts render correctly
- Toggle switches work for content filters

---

### Phase 7: School Admin Pages (2–3 days)
**Objective:** Redesign school admin dashboard with green secondary palette, class management.

**Tasks:**
- [ ] Redesign `/school-setup` — initial school onboarding
- [ ] Redesign `/dashboard/school` — main school dashboard (hero banner, stats, class list, reports)
- [ ] Redesign student/class management modals
- [ ] Redesign reports/analytics section (charts, tables, export UI)
- [ ] Add school-specific branding area
- [ ] Redesign teacher/admin account management

**Files to modify:**
- `src/app/(app)/school-setup/page.tsx`
- `src/app/(app)/dashboard/school/page.tsx`
- `src/components/school/StudentModal.tsx`
- `src/components/school/AssignmentModal.tsx`
- Any school-specific UI components

**Verification:**
- School admin can add/edit students
- Reports export to CSV
- Charts display correctly

---

### Phase 8: Super-Admin Pages (1–2 days)
**Objective:** Redesign platform super-admin interface (system management only).

**Tasks:**
- [ ] Redesign `/super-admin` — super-admin dashboard
- [ ] Redesign `/super-admin/schools` — school management
- [ ] Redesign `/super-admin/users` — user management
- [ ] Redesign `/super-admin/content` — content management
- [ ] Redesign `/super-admin/revenue` — revenue tracking
- [ ] Ensure consistent with admin palette (mostly grey/neutral with green accents)

**Files to modify:**
- `src/app/super-admin/*.tsx`

**Verification:**
- Super-admin can manage schools/users/content
- Tables render correctly
- All functionality preserved

---

### Phase 9: Responsive & Accessibility Polish (1–2 days)
**Objective:** Ensure mobile-first design, responsive breakpoints, WCAG compliance.

**Tasks:**
- [ ] Audit responsive breakpoints (mobile <768px, tablet 768–1199px, desktop ≥1200px)
- [ ] Ensure all pages stack correctly on mobile
- [ ] Test touch interactions on real device (mobile Chrome)
- [ ] Verify focus ring visibility (green outline per design)
- [ ] Ensure all interactive elements ≥ 48×48px
- [ ] Check colour contrast (AA minimum)
- [ ] Verify prefers-reduced-motion respected
- [ ] Add `aria-label` to all buttons/icons without visible text
- [ ] Test keyboard navigation
- [ ] Test with screen readers (spot-check key pages)

**Verification:**
- Responsive audit passes
- Mobile Chrome responsive mode shows no layout issues
- Lighthouse accessibility score ≥ 90

---

### Phase 10: Asset Integration & Final Review (1–2 days)
**Objective:** Integrate final mascot illustrations, verify brand consistency.

**Tasks:**
- [ ] Place Àmì & Kòkò SVG/PNG assets in appropriate hero/empty states
- [ ] Verify wordmark "Àmì by Kòkò" rendering with tone marks (✓ in Baloo 2 / Fredoka + Nunito)
- [ ] Brand consistency audit across all pages
- [ ] Screenshot gallery of redesigned pages
- [ ] Final QA testing in production environment

**Verification:**
- Brand consistency checklist complete
- No broken images/assets
- All pages match reference designs visually

---

## 6. IMPLEMENTATION NOTES

### Technology Stack (Unchanged)
- Next.js 15 (App Router) — no changes
- TypeScript strict mode — no changes
- Tailwind CSS v4 — extend with new tokens
- Framer Motion — use existing, respect `prefers-reduced-motion`
- Supabase — no changes to auth/database
- Web Audio API (DJ Booth) — styling only
- Web Speech API (fallback TTS) — no changes

### Design System Principles
1. **Brand First:** Every design decision references the green/yellow/coral palette
2. **Mobile-First:** Design for 375px width, scale up responsively
3. **Child-Centric:** Large tap targets, big type, minimal text, playful illustrations
4. **African-Rooted:** Use Yoruba characters correctly (à, ì, ò, ṣ, ẹ, ọ), Nigerian illustrations
5. **Accessible:** WCAG AA compliance, focus rings, keyboard nav, screen reader support

### No Business Logic Changes
- All API routes remain unchanged
- Supabase schema untouched
- RLS policies untouched
- Auth flows unchanged
- Payment flows unchanged (Paystack)
- All data flows preserved

### Rollout Strategy
- **Git branch:** `feat/visual-redesign-v2`
- **Phases 1–2 (foundation):** Merge early to unblock later phases
- **Phases 3–7 (page redesigns):** Merge per audience group (marketing → auth → child → parent → school → admin)
- **Phases 8–10 (polish):** Final review before release

---

## 7. REFERENCE DESIGN SPECIFICATIONS

### Colour Palette (from reference images)
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#1FA463` | Primary buttons, active states, navigation |
| Accent Yellow | `#FFC93C` | Main CTAs, highlights |
| Coral | `#F25C54` | Wordmark "Àmì", secondary accent |
| Sky Blue | `#3B82F6` | Category tile (Learn/Watch) |
| Purple | `#8B5CF6` | Category tile (Stories) |
| Orange | `#FF8A3D` | Category tile (Games/Create) |
| Pink | `#EC4899` | Category tile (Music/Rewards) |
| Cream (bg) | `#FFFBEF` | Main background (warm cream) |
| Navy (text) | `#1B2A5B` | Headings, body text |
| Body text | `#475074` | Body copy |
| Muted text | `#8A90AD` | Secondary text, placeholders |
| Borders | `#EFE8D8` | Card borders, dividers |

### Typography
- **Display/Headings:** Baloo 2 (friendly, rounded) ← verify Yoruba diacritics
- **Body/UI:** Nunito ← verify Yoruba diacritics
- **Font sizes (children):** 16px+, 18px for body; 24px+, 28px for headings (large for 3–8 years)

### Component Sizing
- **Cards:** `rounded-20px` (Tailwind: `rounded-2xl`)
- **Buttons:** `rounded-9999px` (pill-shaped)
- **Input fields:** `rounded-14px`
- **Icon tiles:** `rounded-16px` in soft-tinted square backgrounds
- **Tap targets:** Min `48×48px`
- **Shadows:** Soft, warm — `0 6px 24px rgba(27,42,91,0.06)`

### Category Tile Colour Scheme
Each learning category gets:
1. Pastel tint background (e.g., `#E6F7EE` for green)
2. Icon in matching solid colour (e.g., `#1FA463`)
3. Consistent emoji or custom SVG icon

| Category | Bg Tint | Icon Colour | Emoji |
|----------|---------|-------------|-------|
| Letters & Phonics | Light green | #1FA463 | 🔤 |
| Numbers & Maths | Light purple | #8B5CF6 | 🔢 |
| Science & Nature | Light blue | #3B82F6 | 🌿 |
| Stories & Reading | Light purple | #8B5CF6 | 📖 |
| Creative Arts | Light pink | #EC4899 | 🎨 |
| Music & Rhythms | Light orange | #FF8A3D | 🎵 |
| Life Skills | Light pink | #EC4899 | ❤️ |
| African Culture | Light yellow | #FFC93C | 🌍 |

---

## 8. SUCCESS CRITERIA

- [ ] All pages visually match reference designs
- [ ] Tailwind builds with no errors
- [ ] TypeScript strict mode compiles cleanly
- [ ] All tap targets ≥ 48×48px
- [ ] Focus rings visible (green outline)
- [ ] Responsive on mobile Chrome (primary target)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No broken images/assets
- [ ] Yoruba diacritics render correctly in chosen fonts
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Parent auth flow works
- [ ] Child learning pages work (no logic changes)
- [ ] School admin dashboard functional
- [ ] All existing features preserved (audio, DJ, stories, games, progress tracking)

---

## 9. TIMELINE ESTIMATE

**Total: 12–18 working days** (assuming 1 developer, full-time, no blockers)

| Phase | Estimate | Notes |
|-------|----------|-------|
| 1. Tokens & theme | 1–2 days | Foundation — unblock other phases |
| 2. UI primitives | 2–3 days | Reusable components — unblock page redesigns |
| 3. Marketing pages | 1–2 days | Public-facing, good for quick wins |
| 4. Auth/onboarding | 1–2 days | User entry point |
| 5. Child pages | 3–4 days | Core learning experience — largest surface |
| 6. Parent dashboard | 2–3 days | Progress tracking |
| 7. School admin | 2–3 days | School-specific UI |
| 8. Super-admin | 1–2 days | Platform management (low priority) |
| 9. Responsive/a11y | 1–2 days | Polish & testing |
| 10. Assets & final QA | 1–2 days | Final integration |

**Parallel work possible:** Phases 3–8 can overlap after Phase 2 is complete.

---

## 10. KNOWN RISKS & MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| Yoruba diacritics don't render in chosen font | Test fonts early (Phase 1); fallback to Google Fonts variants |
| Responsive breakpoints cause layout issues on specific devices | Test on real devices (not just Chrome DevTools); use mobile-first approach |
| Animations cause performance issues on low-end phones | Use `will-change` sparingly; test on Pixel 3a or equivalent |
| Schema changes needed for new data structures | Not needed — styling only; no business logic changes |
| Supabase RLS conflicts during styling changes | No RLS changes planned; audit if new components touch data |
| Previous designs hardcoded in too many places | Use Tailwind tokens consistently; code review for hex values |

---

## Next Steps

1. **User Review & Approval:** Review this spec and approve or request changes.
2. **Asset Delivery:** Confirm Àmì & Kòkò SVG/PNG files are ready for integration.
3. **Font Verification:** Test Baloo 2 and Nunito with Yoruba diacritics before Phase 1.
4. **Branch Setup:** Create `feat/visual-redesign-v2` branch.
5. **Phase 1 Kickoff:** Start with design tokens and theme setup.

---

**Prepared by:** Kiro AI  
**Date:** October 12, 2026  
**Status:** 🔴 Awaiting approval
