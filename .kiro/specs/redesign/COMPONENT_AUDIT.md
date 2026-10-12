# Current Component Audit & Redesign Checklist

Comprehensive inventory of existing components, their current styling, and what needs to be refactored.

---

## UI Primitives (Foundation Components)

### Existing Components in `src/components/ui/`

| Component | File | Current Style | Status | Redesign Action |
|-----------|------|----------------|--------|-----------------|
| AppNav | `AppNav.tsx` | Hardcoded navbar | ⚠️ | Refactor: cream bg, green text, yellow CTA, rounded-20px |
| BottomNav | `BottomNav.tsx` | Bottom tab bar | ⚠️ | Refactor: green active state, update colours |
| ProgressBar | `ProgressBar.tsx` | Basic linear progress | ⚠️ | Refactor: rounded-8px, use category colour tokens |
| StreakBadge | `StreakBadge.tsx` | Amber/custom style | ⚠️ | Refactor: green background, white text |
| StreakDisplay | `StreakDisplay.tsx` | Custom styling | ⚠️ | Refactor: use ProgressRing component, new colours |
| StreakMilestoneCelebration | `StreakMilestoneCelebration.tsx` | Animation + confetti | ✅ | Keep animation, update colours (green theme) |
| ChallengeCard | `ChallengeCard.tsx` | Gradient background | ⚠️ | Refactor: white bg, rounded-20px, category colour accent |
| DailyChallengeCard | `DailyChallengeCard.tsx` | Custom gradient | ⚠️ | Refactor: use CategoryTile pattern + styling |
| CreateChildModal | `CreateChildModal.tsx` | Modal overlay | ⚠️ | Refactor: rounded-20px, green buttons, Nunito typography |
| EditChildModal | `EditChildModal.tsx` | Modal overlay | ⚠️ | Refactor: same as CreateChildModal |
| Certificate | `Certificate.tsx` | PDF certificate style | ⚠️ | Refactor: update colours to new palette, add Kòkò illustration |
| OnboardingFlow | `OnboardingFlow.tsx` | Multi-step flow | ⚠️ | Refactor: new button/card styles, green CTA |
| OnboardingTour | `OnboardingTour.tsx` | Tour overlay | ⚠️ | Keep logic, update colours/typography |
| LanguagePicker | `LanguagePicker.tsx` | Dropdown/selector | ⚠️ | Refactor: updated button styles, green active |
| ComingSoonOverlay | `ComingSoonOverlay.tsx` | Overlay + message | ⚠️ | Refactor: add Kòkò mascot, new colours |
| SongButton | `SongButton.tsx` | Play button | ⚠️ | Refactor: green background, rounded-2xl |
| ErrorBoundary | `ErrorBoundary.tsx` | Error wrapper | ⚠️ | Refactor: error UI with new colours, add mascot |
| ErrorBoundaryWrapper | `ErrorBoundaryWrapper.tsx` | Wrapper component | ✅ | Keep logic, no styling changes |
| PWAManager | `PWAManager.tsx` | PWA prompt | ⚠️ | Refactor: green button, updated messaging |

**Primitives to CREATE (NEW):**
| Component | Purpose | Design |
|-----------|---------|--------|
| Button | Primary, yellow, outline, soft variants | Pill (rounded-9999px), multiple variants |
| Card | Base card component | White bg, rounded-20px, soft shadow |
| StatTile | Small stat display (number + label) | White bg, rounded-20px, category-colour number text |
| CategoryTile | Learning category card | Pastel tint bg, icon, title, description, rounded-20px |
| ProgressRing | Circular progress (78% style) | Category-colour ring, percentage text center |
| StatusPill | Status badge (Active/Completed/etc.) | Pill-shaped, status-specific colour |
| Avatar | User profile picture | Soft-rounded circle, border |
| Badge | Generic badge (achievement, etc.) | Pill-shaped, various colours |
| Toggle | On/off switch | Green when active, grey when inactive |
| Tabs | Tab navigation | Pill-style tabs, green underline or bg when active |
| SidebarNav | Left sidebar navigation | Green text, highlight active, rounded items |
| TopBar | Header with logo, menu, notifications | Cream bg, green text, yellow CTA |
| EmptyState | No content placeholder | Kòkò/Àmì illustration, message, CTA |
| Modal | Modal dialog base | Rounded-20px, white bg, green close button |

---

## Page-Level Components by Audience

### Public/Marketing Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Landing Page hero | `src/app/(public)/page.tsx` | Hardcoded gradients, white bg | Full redesign: cream bg, green/yellow, Àmì & Kòkò SVG |
| Feature cards | Landing page | Gradient backgrounds | Refactor: white bg, rounded-20px, icon squares |
| Testimonial cards | Landing page | White with borders | Update: consistent styling, add star ratings |
| Pricing section | Landing page | Gradient backgrounds | Update: use new card styles |
| About page | `src/app/(public)/about/page.tsx` | Current styling | Update: cream bg, typography, new colours |
| Terms page | `src/app/(public)/terms/page.tsx` | Current styling | Update: consistent with brand |
| Privacy page | `src/app/(public)/privacy/page.tsx` | Current styling | Update: consistent with brand |

### Auth/Onboarding Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Sign-up form | `src/app/(public)/auth/signup/page.tsx` | Current styling | Refactor: rounded-14px inputs, green button, new typography |
| Login form | `src/app/(public)/auth/login/page.tsx` | Current styling | Same as sign-up |
| Password reset | `src/app/(public)/auth/reset-password/page.tsx` | Current styling | Same pattern |
| Google sign-in | `src/components/auth/GoogleSignInButton.tsx` | Current button | Update: new button styling |
| Apple sign-in | (in auth pages) | Current styling | Update: new button styling |
| Select role | `src/app/(public)/auth/select-role/page.tsx` | Current styling | Refactor: card-based role picker |
| Student login PIN | `src/app/(public)/student-login/page.tsx` | Current styling | Refactor: large PIN input, green CTA |

### Child-Facing Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Home/Learning Hub | `src/app/(app)/home/page.tsx` | Gradient mode cards | **Major redesign:** CategoryTiles with pastels (orange, blue, purple, pink, green, yellow) |
| Phonics page | `src/app/(app)/phonics/page.tsx` | Current styling | Update: cream bg, green buttons, category tile styling |
| Literacy page | `src/app/(app)/literacy/page.tsx` | Current styling | Same pattern as phonics |
| Numeracy page | `src/app/(app)/numeracy/page.tsx` | Current styling | Same pattern |
| World page | `src/app/(app)/world/page.tsx` | Current styling | Same pattern |
| Word Builder | `src/app/(app)/word-builder/page.tsx` | Current styling | Same pattern |
| DJ Booth | `src/app/(app)/dj-booth/page.tsx` | Current styling | **Special:** pads in pastel colours (yellow, blue, purple, pink, orange, green) |
| Story Mode | `src/app/(app)/story/page.tsx` | Current styling | Update: player UI with green controls |
| Stories library | `src/app/(app)/stories/page.tsx` | Current styling | Update: white cards, rounded-20px, story thumbnails |
| Games | `src/app/(app)/games/*/page.tsx` | Current styling | Update: consistent game UI, green buttons |
| Assignments | `src/app/(app)/assignment/page.tsx` | Current styling | Update: card-based layout |

### Parent Dashboard Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Parent Dashboard | `src/app/(app)/dashboard/parent/page.tsx` | Current layout | **Major redesign:** stat tiles, progress rings, activity log, charts |
| Child Profile Card | Dashboard component | Current styling | Refactor: white bg, rounded-20px, category-colour progress |
| Progress chart | Dashboard component | Current styling | Update: multicoloured bars (orange, blue, purple, yellow, green, pink) |
| Activity log | Dashboard component | Current styling | Refactor: white cards, green completed checkmarks |
| Streak display | Dashboard component | Current styling | Refactor: use ProgressRing component + new colours |
| Achievement display | Dashboard component | Current styling | Refactor: badge gallery with updated badge styling |
| Settings page | `src/app/(app)/settings/page.tsx` | Current styling | Refactor: toggle switches (green when active), updated cards |
| Screen time control | Settings page | Current styling | Update: ProgressRing for time limit visualization |
| Content filters | Settings page | Current styling | Update: checkbox/toggle styling |

### School Admin Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| School dashboard | `src/app/(app)/dashboard/school/page.tsx` | Current layout | **Major redesign:** hero banner (green + Àmì & Kòkò), stat tiles, class table, reports |
| Hero banner | Dashboard component | Current gradient | Refactor: green bg, white text, Àmì & Kòkò SVG, rounded-20px |
| Class overview card | Dashboard component | Current styling | Refactor: white bg, rounded-20px, progress bar |
| Student list | Dashboard component | Current styling | Refactor: table/card list, white bg, green highlight |
| Student modal | `src/components/school/StudentModal.tsx` | Current styling | Refactor: rounded-20px modal, green buttons |
| Reports section | Dashboard component | Current styling | Update: charts in multicolours, tables with new styling |
| Assignment modal | `src/components/school/AssignmentModal.tsx` | Current styling | Refactor: same as student modal |
| Export button | Dashboard component | Current styling | Update: green/yellow button styling |
| Statistics boxes | Dashboard component | Current styling | Refactor: use StatTile component |

### Character Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Àmì character | `src/components/characters/Ami.tsx` | Emoji (👧🏾) | **INTEGRATE ASSET:** Replace with SVG/PNG from `/public/assets/characters/ami/` |
| Kòkò character | `src/components/characters/Koko.tsx` | Emoji (🦜) | **INTEGRATE ASSET:** Replace with SVG/PNG from `/public/assets/characters/koko/` |
| Kòkò in celebrations | Various pages | Emoji + animation | Update: use Koko component with new asset |
| Àmì in onboarding | Various pages | Emoji + text | Update: use Ami component with new asset |

### Achievement/Reward Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| Achievement badge | `src/components/AchievementDisplay.tsx` | Current styling | Refactor: updated badge design, new colours |
| Achievement celebration | `src/components/AchievementCelebration.tsx` | Confetti + animation | Keep animation, update colours, add Kòkò |
| Streak milestone | `src/components/StreakMilestoneCelebration.tsx` | Animation + confetti | Keep animation, update to new theme |
| XP display | `src/components/XPDisplay.tsx` | Current styling | Update: typography, new colours |

### Specialized Components
| Component | File | Current Style | Redesign Action |
|-----------|------|----------------|-----------------|
| DJ Sound Pad | `src/components/dj/SoundPad.tsx` | Current styling | **Redesign:** pastel background (matching colour palette), pill-shaped, active state = darker colour |
| DJ Mixing Board | `src/components/dj/MixingBoard.tsx` | Current layout | Refactor: background, pad styling, control buttons |
| Counting Activity | `src/components/numeracy/CountingActivity.tsx` | Current styling | Update: consistent with learning activity styling |
| Try a Letter | `src/components/landing/TryALetter.tsx` | Interactive demo | Update: new colours, green button, Kòkò head animation |
| YouTube Banner | `src/components/YouTubeBanner/YouTubeBanner.tsx` | Current styling | Update: rounded corners, consistent with brand |
| WhatsApp Button | `src/components/WhatsAppGroupButton.tsx` | Custom styling | Update: green background (WhatsApp brand), consistent positioning |

---

## Hardcoded Colour Replacements

### Search & Replace Reference

**Current hardcodes to replace:**

| Current (Hex) | Current (Tailwind) | Replace With | Usage |
|---------------|--------------------|--------------|-------|
| `#F59E0B` | `amber-500`, `amber-600` | `green-ami` / `#1FA463` | Primary buttons, active states |
| `#166534` | `green-800`, `green-900` | Depends on context | Keep for secondary, or use `amber-koko` |
| `#F43F5E` | `rose-500`, `rose-400` | `coral-celebrate` or category colour | Celebrations, accents |
| `#FEFCE8` | `cream-bg` | Always use token | Background |
| `#FFFBF0` | (inline style) | `bg-cream-bg` | Background |
| Various gradients | `from-amber-`, `from-green-`, `from-rose-` | Category-specific + pastel tints | Cards, hero sections |

### New Tailwind Color Additions

Add to `tailwind.config.ts`:

```typescript
colors: {
  // Existing
  "cream-bg": "#FEFCE8",
  "amber-koko": "#F59E0B",
  "green-ami": "#166534",
  "coral-celebrate": "#F43F5E",

  // NEW for redesign
  "primary-green": "#1FA463",      // Primary action
  "accent-yellow": "#FFC93C",      // Main CTAs
  "coral": "#F25C54",              // Àmì wordmark
  "navy": "#1B2A5B",               // Headings, text
  "navy-light": "#475074",         // Body text
  "navy-lighter": "#8A90AD",       // Muted text
  "border-warm": "#EFE8D8",        // Borders

  // Category colours
  "cat-sky": "#3B82F6",            // Learn/Watch
  "cat-purple": "#8B5CF6",         // Stories
  "cat-orange": "#FF8A3D",         // Games/Create
  "cat-pink": "#EC4899",           // Music/Rewards
  "cat-green": "#1FA463",          // Nature/World
  "cat-yellow": "#FFC93C",         // African/Culture

  // Pastel tints (backgrounds for category tiles)
  "cat-sky-light": "#E6F0FF",
  "cat-purple-light": "#F0E9FF",
  "cat-orange-light": "#FFEEDD",
  "cat-pink-light": "#FFE6F1",
  "cat-green-light": "#E6F7EE",
  "cat-yellow-light": "#FFF9E6",
}
```

---

## Button Style Variants

### Primary Button (Green)
```
bg-primary-green hover:bg-[#178A52] text-white font-bold
rounded-full (pill) or rounded-2xl (slightly rounded)
min-height: 48px, min-width: 48px
```

### Accent Button (Yellow)
```
bg-accent-yellow hover:bg-[#F5B800] text-navy font-bold
rounded-full or rounded-2xl
```

### Secondary Button (Outline Green)
```
border-2 border-primary-green text-primary-green
hover:bg-[#E6F7EE] font-bold
rounded-full or rounded-2xl
```

### Soft Button (Tinted Green)
```
bg-[#E6F7EE] text-primary-green hover:bg-[#D0EFE0]
font-bold rounded-full or rounded-2xl
```

---

## Card & Tile Styles

### Standard Card
```
bg-white rounded-20px (rounded-2xl)
border border-warm (border-[#EFE8D8])
shadow-0-6px-24px-rgba-27-42-91-06
padding: 20px–24px
```

### Category Tile
```
bg-[pastel-tint] rounded-20px
border-0 or border border-category-colour-light
flex gap-12px items-center
icon: 48×48px bg-[category-colour] text-white rounded-12px
title: navy text, bold, Baloo 2/Fredoka
description: navy-light text, regular, Nunito
```

### Stat Tile
```
bg-white rounded-20px
border border-warm
text-center or left-aligned
number: large, category-colour text, font-bold
label: navy-lighter text, small
```

---

## Responsive Grid Patterns

### Mobile (< 768px)
- Single column layout
- Full-width cards with 16px margin
- Stack all modals/overlays
- Bottom nav for main navigation

### Tablet (768–1199px)
- Two-column layout for some cards
- Sidebar may appear (optional)
- Grid cards 2–3 across

### Desktop (≥ 1200px)
- Multi-column layouts
- Sidebar navigation standard
- Cards in flexible grid (3–4 across)

---

## Font Implementation Checklist

### Baloo 2 (Display/Headings)
- [ ] Import from Google Fonts in `layout.tsx` or `globals.css`
- [ ] Assign to `--font-display` CSS variable
- [ ] Test rendering: À à Ì ì Ò ò Ṣ ṣ Ẹ ẹ Ọ ọ
- [ ] If glyphs fall back, switch to Fredoka or alternative
- [ ] Use for h1–h3, button labels, feature titles

### Nunito (Body/UI)
- [ ] Import from Google Fonts
- [ ] Assign to `--font-body` CSS variable
- [ ] Test rendering: À à Ì ì Ò ò Ṣ ṣ Ẹ ẹ Ọ ọ
- [ ] Use for paragraph text, descriptions, form labels

---

## A11y Checkpoints per Component

### All Interactive Elements
- [ ] Min 48×48px tap target
- [ ] Visible focus ring (green outline, 3px)
- [ ] `aria-label` on icon-only buttons
- [ ] Keyboard accessible (Tab, Enter, Esc)

### Colour Usage
- [ ] No colour-only information (e.g., "click the green button")
- [ ] Text contrast ≥ 4.5:1 for body, ≥ 3:1 for large text (AA)
- [ ] Form error text red + icon, not colour alone

### Motion
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No auto-playing videos
- [ ] Flashing/strobing avoided (no > 3 flashes/sec)

### Images
- [ ] All images have `alt` text
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] SVG icons have `aria-label` or `title` if meaningful

---

## Implementation Order (by priority)

### Must-Do First (Unblock others)
1. [ ] Create new Tailwind tokens + fonts
2. [ ] Create Button primitive + variants
3. [ ] Create Card primitive

### High Priority (Core UX)
4. [ ] Create CategoryTile component
5. [ ] Redesign `/home` (learning hub)
6. [ ] Redesign `/` (landing)
7. [ ] Redesign `/auth/signup` + `/auth/login`

### Medium Priority (Parent/School)
8. [ ] Redesign `/dashboard/parent`
9. [ ] Redesign `/dashboard/school`
10. [ ] Redesign `/settings`

### Lower Priority (Detailed Screens)
11. [ ] Redesign all learning activity pages
12. [ ] Redesign DJ Booth
13. [ ] Refactor all secondary components
14. [ ] Super-admin pages

### Final Pass
15. [ ] Responsive testing across breakpoints
16. [ ] A11y audit (Lighthouse, screen reader, keyboard)
17. [ ] Performance audit (Lighthouse)
18. [ ] Brand consistency check
19. [ ] Asset integration (Àmì & Kòkò SVGs)

---

## Testing Matrix

| Page | Mobile | Tablet | Desktop | Touch | Keyboard | A11y |
|------|--------|--------|---------|-------|----------|------|
| `/` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/auth/signup` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/home` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/phonics` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/dj-booth` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/dashboard/parent` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/dashboard/school` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `/settings` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

## Notes & Warnings

⚠️ **DO NOT:**
- Change Supabase schema
- Modify RLS policies
- Alter auth flows
- Touch payment/Paystack integration
- Change API routes
- Remove any features

✅ **DO:**
- Use Tailwind classes consistently
- Test on real mobile device before finalizing
- Verify Yoruba diacritics early (Phase 1)
- Respect `prefers-reduced-motion` across all animations
- Keep component prop interfaces stable (don't break existing calls)
- Document any new component prop requirements

---

**Last updated:** October 12, 2026  
**Version:** 1.0 — Draft
