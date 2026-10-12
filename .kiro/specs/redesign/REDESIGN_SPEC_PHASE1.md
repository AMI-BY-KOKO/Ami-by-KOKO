# Phase 1: Design Tokens, Typography & Focus Ring

**Status:** 🔴 In Progress  
**Objective:** Implement Tailwind v4 @theme, import fonts (Baloo 2 + Nunito), define new colour palette, set focus ring colour to green.

---

## 1. Changes from Original Spec (User-Approved)

### Colour Palette Updates
- ✅ Cream background: **#FFFBEF** (not #FEFCE8)
- ✅ Contrast fix: White text on `#1FA463` fails AA
  - Filled green buttons use `#15803D` (hover `#166534` = existing green-ami)
  - Keep `#1FA463` for tints, icons, progress bars, outlines
- ✅ Yellow CTA verified: navy text on `#FFC93C` passes AA

### Tailwind v4 Implementation
- ✅ Tokens in `globals.css` via `@theme` (not `tailwind.config.ts`)
- ✅ Remove duplicate colour token definitions from `tailwind.config.ts`
- ✅ Keep only essential config in `tailwind.config.ts`, verify it's loaded

### Mascot Components
- ✅ Update `characters/Ami.tsx` and `characters/Koko.tsx` to render image assets
- ✅ Render from `/public/brand` with pose props
- ✅ Keep emoji fallback if image fails to load
- ❌ Do NOT create separate Mascot component

### Phase 5 Split (Future)
- ✅ 5a: Restyle shells only (nav, cards, tiles) — **no logic changes**
- ✅ 5b: Game interiors (DJ, phonics tracing, word-builder) — **separate later phase**

### Specification Updates
- ✅ Remove day-based timeline estimates
- ✅ Feature inventory added: `/dashboard/parent` and `/settings` capabilities documented
- ✅ Missing features flagged: content filters, screen time, parental controls (future v2+)

---

## 2. Phase 1 Deliverables

### 2.1 Tailwind v4 @theme in globals.css

```css
@theme {
  /* Brand colours */
  --color-cream-bg: #FFFBEF;           /* Main background — warm, soft */
  --color-primary-green: #1FA463;      /* Primary action, tints, icons, progress */
  --color-green-filled: #15803D;       /* Filled button (contrast safe) */
  --color-green-hover: #166534;        /* Hover state (existing green-ami) */
  --color-accent-yellow: #FFC93C;      /* Main CTA with navy text */
  --color-coral: #F25C54;              /* Àmì wordmark, secondary accent */
  --color-navy: #1B2A5B;               /* Headings, primary text */
  --color-navy-body: #475074;          /* Body text */
  --color-navy-muted: #8A90AD;         /* Muted text, placeholders */
  --color-border-warm: #EFE8D8;        /* Card borders, dividers */
  
  /* Category colours (pastel tints + solid) */
  --color-cat-orange: #FF8A3D;         /* Games, Create */
  --color-cat-orange-light: #FFEEDD;   /* Pastel bg */
  --color-cat-blue: #3B82F6;           /* Learn, Watch */
  --color-cat-blue-light: #E6F0FF;     /* Pastel bg */
  --color-cat-purple: #8B5CF6;         /* Stories, Rewards */
  --color-cat-purple-light: #F0E9FF;   /* Pastel bg */
  --color-cat-pink: #EC4899;           /* Music, Rhythms */
  --color-cat-pink-light: #FFE6F1;     /* Pastel bg */
  --color-cat-green: #1FA463;          /* Nature, World */
  --color-cat-green-light: #E6F7EE;    /* Pastel bg */
  --color-cat-yellow: #FFC93C;         /* African Culture */
  --color-cat-yellow-light: #FFF9E6;   /* Pastel bg */
}
```

### 2.2 Google Fonts in layout.tsx

```typescript
import { Baloo_2, Nunito } from "next/font/google";

const baloo2 = Baloo_2({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
```

### 2.3 Focus Ring Colour

```css
:focus-visible {
  outline: 3px solid var(--color-primary-green);  /* #1FA463 */
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 2.4 Diacritics Test Page

Create `/src/app/(app)/design-tokens/page.tsx` with test string:

```
Àmì by Kòkò — Àgbàdo, ṣẹ̀ṣẹ̀, ọmọ
```

Renders in:
- Baloo 2 (display font)
- Nunito (body font)

If glyphs render correctly (not as □), fonts are safe for use.

---

## 3. Tailwind Config Cleanup

### Before
- `tailwind.config.ts` defines colour tokens (duplicated with globals.css)
- `globals.css` imports tailwindcss but no @theme

### After
- `globals.css` has `@theme` with all colour tokens + font imports
- `tailwind.config.ts` removes colour tokens
- `tailwind.config.ts` kept only for other plugins/extensions if needed
- Verify config is loaded: check `npm run build` output

---

## 4. Files to Modify (Phase 1)

1. ✅ `src/app/globals.css` — Add @theme, import fonts, focus ring
2. ✅ `src/app/layout.tsx` — Configure next/font imports
3. ✅ `tailwind.config.ts` — Remove duplicate tokens, verify load
4. ✅ `src/app/(app)/design-tokens/page.tsx` — **Create** test page
5. ✅ Verify TypeScript compiles, Tailwind builds

---

## 5. Testing Checklist

- [ ] `npm run type-check` passes (no errors)
- [ ] `npm run build` passes (Tailwind builds cleanly)
- [ ] Diacritics test string renders correctly in both fonts
- [ ] Focus ring visible on interactive elements (green outline)
- [ ] No hardcoded hex values in globals.css
- [ ] All colour tokens accessible as CSS variables

---

## 6. Success Criteria

- ✅ All colour tokens defined in @theme
- ✅ Fonts imported (Baloo 2 + Nunito, latin-ext)
- ✅ Focus ring colour set to green (#1FA463)
- ✅ Diacritics test string renders (À, ì, ò, ṣ, ẹ, ọ)
- ✅ TypeScript compiles, builds without errors
- ✅ Git branch `feat/visual-redesign-v2` active
- ✅ Diff + screenshot ready for review before Phase 2

---

## Next: Phase 2 (After User Approval)

Once Phase 1 is verified:
- Create UI primitives (Button, Card, CategoryTile, ProgressRing, etc.)
- Build shared component library
- Begin page redesigns (Phases 3–7)

