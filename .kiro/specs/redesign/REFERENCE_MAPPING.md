# Visual Reference Design Mapping

This document maps each reference design screenshot to existing routes and pages in the codebase.

---

## Reference Images Overview

### 1. Mobile School Admin Suite (Top Row, 13 screens)
School admin workflow for managing students, classes, and progress.

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Splash/Branding | — | N/A | App splash screen (logo + "Àmì & Kòkò") |
| 2 | Welcome/Login | `/auth/login` or `/student-login` | ✅ Exists | Parent/school admin login; also school student login |
| 3 | Classes | `/dashboard/school` | ✅ Exists | Classes tab in school dashboard |
| 4 | Students | `/dashboard/school` | ✅ Exists | Students list in school dashboard |
| 5 | Student Profile | `/dashboard/school` → student detail | ✅ Partial | Student view modal/detail page |
| 6 | Learning Progress | `/dashboard/school` | ✅ Exists | Progress tab with progress bars, subjects |
| 7 | Reports & Analytics | `/dashboard/school` | ✅ Exists | Reports tab with charts and activity |
| 8 | Assignments | `/dashboard/school` | ✅ Exists | Assignments tab |
| 9 | School Calendar | `/dashboard/school` | ✅ Partial | Calendar view (partial implementation) |
| 10 | Content Management | `/super-admin/content` | ✅ Exists | Super-admin only; content management |
| 11 | Settings | `/dashboard/school` | ✅ Exists | Settings for school admin |
| 12 | Export Reports | `/dashboard/school` | ✅ Exists | CSV export functionality |
| 13 | Report Generated | — | ✅ Exists | Success confirmation with Kòkò mascot |

---

### 2. Desktop School Admin Dashboard (Wide)
School admin overview with hero banner, quick actions, class progress, reports.

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Main Dashboard | `/dashboard/school` | ✅ Exists | Overview with stats, hero, quick actions |
| 2 | Hero Banner | — | Component | "Welcome to your school dashboard" with Àmì & Kòkò |
| 3 | Quick Actions | — | Component | 4 buttons: Add Pupil, Create Class, Export CSV, View Reports |
| 4 | Class Progress Table | — | Component | Table showing class, pupils, progress %, status |
| 5 | Phonics Skills | — | Component | Skill breakdown (Letter Sounds, Recognition, etc.) |
| 6 | Weekly Learning Activity | — | Component | Bar chart with category breakdown |
| 7 | Recent Learning Activity | — | Component | Activity log with pupil avatars, actions, times |
| 8 | Upcoming Activities | — | Component | Calendar/schedule of upcoming events |
| 9 | Featured Learning Cards | — | Component | Content cards with images (apple, corn, etc.) |

---

### 3. Mobile Child Dashboard Suite (15 screens)
Child learning experience with onboarding, home hub, learning content, progress.

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Splash | — | N/A | App splash with Àmì & Kòkò |
| 2 | Sign Up / Onboarding | `/auth/signup` or `/onboarding` | ✅ Exists | Create account / child profile setup |
| 3 | Login | `/auth/login` or `/student-login` | ✅ Exists | Parent or student login |
| 4 | Child Profile Selection | — | ✅ Exists | "Who's learning?" profile picker |
| 5 | Parent Dashboard (Mobile) | `/dashboard/parent` | ✅ Exists | Parent overview of children, recent activity, quick access |
| 6 | Home / Learning Hub | `/home` | ✅ Exists | Child learning hub with mode cards (6+) |
| 7 | Video Player (Story) | `/story` | ✅ Exists | Story/video playback interface |
| 8 | Games & Quiz | `/games/*` | ✅ Exists | Game/quiz interface |
| 9 | Progress & Reports | `/dashboard/parent` | ✅ Exists | Progress view with charts, subject performance |
| 10 | Rewards & Achievements | `/home` (badges section) | ✅ Exists | Achievements display, badges |
| 11 | Parent Dashboard (Desktop) | `/dashboard/parent` | ✅ Exists | Wider parent overview |
| 12 | Screen Time Control | `/settings` | ✅ Exists | Parent controls for screen time limits |
| 13 | Content Filters | `/settings` | ✅ Exists | Parent controls for age-appropriate content |
| 14 | Multiple Children | `/dashboard/parent` | ✅ Exists | Parent managing multiple child profiles |
| 15 | Settings | `/settings` | ✅ Exists | Account settings, profile, notifications |

---

### 4. Marketing / Landing Page Suite (Desktop + Mobile)
Public-facing marketing pages with hero, features, testimonials, pricing.

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Landing Hero | `/` | ✅ Exists | Hero with Àmì & Kòkò, headline, CTAs |
| 2 | Features Grid | `/` | ✅ Exists | 4–5 feature cards (Phonics, Languages, DJ, Story, etc.) |
| 3 | How It Works | `/` | ✅ Exists | 3-step process (Create account, Pick language, Learn) |
| 4 | Testimonials | `/` | ✅ Exists | Social proof with parent/teacher quotes |
| 5 | Pricing Section | `/` | ✅ Exists | Pricing tiers (Free, Paid with unlock) |
| 6 | School CTA | `/` | ✅ Exists | "Bring Àmì by Kòkò to your school" section |
| 7 | Final CTA | `/` | ✅ Exists | Bottom CTA "Ready to start the adventure?" |
| 8 | Footer | `/` | ✅ Exists | Footer with links, social proof message |
| 9 | Mobile Layout | `/` | ✅ Exists | Responsive version (stacked, optimized for mobile) |

---

### 5. Child Learning Content Pages (Mobile)
Detailed learning activity layouts (categories, lessons, games, videos).

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Explore Learning Categories | `/home` | ✅ Exists | Grid of category tiles (8+ topics) |
| 2 | The Magic Umbrella (Video) | `/story` | ✅ Exists | Story video player with episode info |
| 3 | Recommended for You | `/home` | ✅ Exists | Personalized content recommendations |
| 4 | Games & Quizzes | `/home` | ✅ Exists | Games section with tiles (Math, Memory, Word, etc.) |
| 5 | Learning Progress | `/dashboard/parent` | ✅ Exists | Subject progress view |
| 6 | Recent Achievements | `/home` | ✅ Exists | Badges and achievements display |
| 7 | My Progress | `/dashboard/parent` | ✅ Exists | Child progress overview |
| 8 | Learning Reports | `/dashboard/parent` | ✅ Exists | Detailed activity/subject reports |
| 9 | Screen Time Control | `/settings` | ✅ Exists | Screen time limit display |
| 10 | Content Filters | `/settings` | ✅ Exists | Parental content controls |
| 11 | Rewards | `/home` | ✅ Exists | Achievements/badges gallery |
| 12 | Notifications | `/settings` | ✅ Partial | Notification settings |

---

### 6. Desktop Child Dashboard Layout
Wide-screen child learning experience with sidebar navigation.

| Screen | Title | Route | Status | Notes |
|--------|-------|-------|--------|-------|
| 1 | Sidebar Nav | `/home` | ✅ Exists | Left sidebar with Home, Learn, Wishlist, Games, etc. |
| 2 | Main Content Area | `/home` | ✅ Exists | Welcome banner, challenges, progress, activities |
| 3 | Category Tiles | `/home` | ✅ Exists | Pastel-coloured tiles for each learning category |
| 4 | Progress Widget | — | Component | Quick progress display (% complete, streak) |
| 5 | Recent Activity | — | Component | Activity timeline/log |
| 6 | Recommended Content | — | Component | Content cards with images and CTAs |

---

## Visual Design Key Changes (Reference → Current Implementation)

### Colour Palette Shift

**Current (Inconsistent):**
- Primary: Amber/orange (`#F59E0B` — Kòkò energy)
- Secondary: Deep green (`#166534` — Àmì's world)
- Accent: Pink (`#F43F5E` — celebration)
- Background: Cream (`#FEFCE8`, but often hardcoded `#FFFBF0`)
- Gradients: Scattered, inconsistent

**Target (Reference Design):**
- Primary: Bright green (`#1FA463` — new primary action)
- Accent: Warm yellow (`#FFC93C` — main CTAs, highlights)
- Coral: `#F25C54` (Àmì wordmark, secondary accent)
- Category colours: Sky blue, purple, orange, pink (each subject gets own colour)
- Background: Warm cream (`#FFFBEF`)
- Navy text: `#1B2A5B` (headings)
- Consistent pastels for category tiles

### Component Styling Updates

| Component | Current | Target |
|-----------|---------|--------|
| Card | White, various shadows | White, rounded-20px, soft shadow, warm border |
| Button | Amber/green variants | Green primary, yellow accent, pill-shaped |
| Category Tile | Gradient bg, emoji | Pastel bg, solid icon, matching text colour |
| Progress Bar | Various styles | Rounded 8px, category colour, smooth animation |
| Progress Ring | Circular, amber | Circular, category colour, 78% style |
| Tab Navigation | Underline or pills | Pill-style, green when active |
| Status Badge | Various | Pill with icon, status-specific colour (green, yellow, etc.) |
| Avatar | Circle | Soft-rounded circle (border-radius ~50%) |
| Input Fields | Rounded edges | rounded-14px, soft border |
| Focus Ring | Amber | Green (primary) |
| Modal | Standard | Rounded-20px, cream bg, green close button |
| Empty State | Text only | Kòkò/Àmì illustration + message |

### Typography Updates

| Element | Current | Target |
|---------|---------|--------|
| Display/Heading Font | Geist Sans | Baloo 2 or Fredoka (friendly, rounded) |
| Body Font | Geist Sans | Nunito |
| Heading Size (Desktop) | Variable | 24px–36px+ |
| Heading Size (Mobile) | Variable | 18px–28px |
| Body Size | Variable | 16px+ (children friendly) |
| Font Weight | Various | Bold for headings, regular for body |

### Spacing & Layout

| Aspect | Current | Target |
|--------|---------|--------|
| Card padding | Variable | Consistent 20–24px |
| Button height | Variable | 44–48px (pill height) |
| Gap between cards | Variable | Consistent 16px, 20px, or 24px |
| Border radius (cards) | Variable | 20px (Tailwind: `rounded-2xl`) |
| Border radius (buttons) | Variable | 9999px (pill) |
| Tap target size | Target 48px | Min 48×48px verified |

---

## Implementation Checklist by Page

### Marketing Pages (`/` + legal pages)
- [ ] Update hero background (cream, not white)
- [ ] Update feature cards styling (white bg, rounded-20px, soft shadows)
- [ ] Update button styles (green primary, yellow accent)
- [ ] Update heading fonts (Baloo 2 / Fredoka)
- [ ] Place Àmì & Kòkò SVG assets in hero
- [ ] Update navigation bar (cream bg, green text, yellow CTA)
- [ ] Update testimonial cards (white bg, rounded-20px)
- [ ] Update footer (dark background, cream text)

### Auth Pages (`/auth/*`, `/onboarding`)
- [ ] Update form styling (rounded-14px inputs, green buttons)
- [ ] Add Kòkò mascot to welcome screen
- [ ] Update text styling (Nunito body, Baloo 2 headings)
- [ ] Update error messages (consistent styling)
- [ ] Update social auth buttons (green/yellow)

### Child Home (`/home`)
- [ ] Update background (cream)
- [ ] Update mode cards to CategoryTiles (pastel bg + icon, rounded-20px)
- [ ] Update navigation bar/bottom nav (green, yellow CTA)
- [ ] Update header text (navy, Baloo 2)
- [ ] Add Àmì greeting text
- [ ] Update streak/progress display (green when active)
- [ ] Update achievement badges (pill-style, category colours)

### Learning Pages (`/phonics`, `/literacy`, `/numeracy`, etc.)
- [ ] Update content backgrounds (cream)
- [ ] Update tiles/cards (rounded-20px, white bg)
- [ ] Update activity cards (pastel tinted, category colour border)
- [ ] Update buttons (green/yellow, pill-shaped)
- [ ] Update progress bars (rounded 8px, category colour)
- [ ] Ensure Kòkò appears in success states

### DJ Booth (`/dj-booth`)
- [ ] Update mixer background (cream)
- [ ] Update sound pads (pastel colours: yellow, blue, purple, pink, orange, etc.)
- [ ] Update control buttons (green primary)
- [ ] Update text styling

### Story Mode (`/story`, `/stories`)
- [ ] Update player UI (green controls, rounded-20px)
- [ ] Update story library tiles (white bg, rounded-20px)
- [ ] Add Kòkò/Àmì illustrations in appropriate places

### Parent Dashboard (`/dashboard/parent`)
- [ ] Update background (cream)
- [ ] Update stat tiles (white bg, rounded-20px, category colour text)
- [ ] Update progress rings (category colour, rounded)
- [ ] Update charts (multicoloured bars: orange, blue, purple, green, yellow, pink)
- [ ] Update buttons (green/yellow)
- [ ] Update text styling (navy headings, Baloo 2)

### School Admin Dashboard (`/dashboard/school`)
- [ ] Update hero banner (green bg with Àmì & Kòkò, or similar)
- [ ] Update stat boxes (white bg, rounded-20px)
- [ ] Update class progress table (white bg, green active state)
- [ ] Update buttons (green primary, yellow secondary)
- [ ] Update navigation (sidebar or top nav with green accents)
- [ ] Update charts (multicoloured bars)

### Settings (`/settings`)
- [ ] Update background (cream)
- [ ] Update toggle switches (green when active)
- [ ] Update sections (white bg, rounded-20px)
- [ ] Update text styling

---

## Font & Diacritic Verification Needed

**Before Phase 1 launch, verify these fonts render Yoruba diacritics correctly:**

```
Baloo 2 (or Fredoka):
  À à Ì ì Ò ò Ṣ ṣ Ẹ ẹ Ọ ọ Àgbàdo Kòkò

Nunito:
  À à Ì ì Ò ò Ṣ ṣ Ẹ ẹ Ọ ọ Àgbàdo Kòkò
```

If any glyphs fall back (show as □ or similar), find alternative fonts or system fonts that support Yoruba Latin Extended characters (Unicode blocks: Latin Extended-A, Latin Extended-B).

---

## Responsive Breakpoints

| Device | Width | Breakpoint | Notes |
|--------|-------|-----------|-------|
| Mobile | 320–767px | < 768px | Primary target (iPhone SE to SE 3) |
| Tablet | 768–1199px | md | iPad, Galaxy Tab |
| Desktop | 1200px+ | lg | Laptop, desktop monitor |

All designs should be **mobile-first**, then enhance with tablet/desktop layouts.

---

## Success Criteria Checklist

Before marking redesign complete:

### Visual Fidelity
- [ ] All pages match reference design colours and layout
- [ ] All text uses correct fonts (Baloo 2/Fredoka for headings, Nunito for body)
- [ ] Yoruba diacritics render correctly (À, ì, ò, ṣ, etc.)
- [ ] Mascots (Àmì & Kòkò) appear in hero/empty states/celebrations
- [ ] Wordmark "Àmì by Kòkò" renders with tone marks

### Component Consistency
- [ ] All cards have rounded-20px borders
- [ ] All buttons are pill-shaped (rounded-9999px) or rounded-14px
- [ ] All focus rings are green (primary colour)
- [ ] All category tiles have matching pastel bg + solid icon colour
- [ ] All progress bars are rounded 8px
- [ ] All tap targets ≥ 48×48px

### Responsive & Accessibility
- [ ] Mobile layouts (< 768px) render correctly
- [ ] Tablet layouts (768–1199px) render correctly
- [ ] Desktop layouts (≥ 1200px) render correctly
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Screen reader test (spot-check key pages)
- [ ] Colour contrast meets AA standard
- [ ] `prefers-reduced-motion` respected

### Functionality
- [ ] No logic changes — all features work as before
- [ ] Auth flows work end-to-end
- [ ] Learning activities functional
- [ ] DJ Booth functional
- [ ] Progress tracking functional
- [ ] Parent dashboard functional
- [ ] School admin dashboard functional
- [ ] Audio playback functional

---

## Notes for Development

1. **Use Tailwind classes exclusively** — avoid inline styles or CSS-in-JS beyond Framer Motion
2. **Leverage the new tokens** — replace hardcoded hex values with `bg-green-ami`, `text-cream-bg`, etc.
3. **Mobile-first CSS** — write base styles for mobile, then add `md:` and `lg:` variants
4. **Emoji vs SVG** — use emoji for quick prototyping; swap to SVG assets once ready
5. **Accessibility first** — add `aria-label` as you build, don't bolt it on at the end
6. **Performance** — test on low-end devices; use `will-change` sparingly
7. **Branch strategy** — work in `feat/visual-redesign-v2`; PR per phase for review

---

**Last updated:** October 12, 2026  
**Status:** Draft — ready for review
