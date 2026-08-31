# Responsive Design Checklist - Kòkò's Word Adventure

## Mobile-First Optimization (320px–430px)

### Touch Targets
- [x] All buttons: minimum 48×48px (preferably 56×64px on mobile)
- [x] Letter tiles: 80×96px (mobile) → 96×112px (tablet)
- [x] Word slots: 72×88px (mobile) → 88×104px (tablet)
- [x] Game buttons: 48px minimum height
- [x] Tap targets have 8px spacing minimum between them

### Typography
- [x] Base text: 14–16px (mobile), 16–18px (tablet)
- [x] Headings scale: small (18px) → h1 (32px on mobile, 48px on desktop)
- [x] Line height: 1.5–1.75 for readability on small screens
- [ ] Test on actual devices (not just browser DevTools)

### Layout & Spacing
- [x] Portrait-first layout (vertical stacking)
- [x] No horizontal scrolling
- [x] Padding: 12–16px on mobile, 24–32px on tablet/desktop
- [x] Gap between sections: 16–24px mobile, 32–48px desktop
- [x] Safe area padding for notches (iOS 11+)

### Word Builder Game (Mobile)
- [x] Letter tiles: single row or 2-row layout on 320px screens
- [x] Word slots: centered, stackable
- [x] Action buttons: full-width or 2-column on mobile
- [x] Hint button: prominent but not oversized
- [x] Removed unnecessary UI elements on mobile

### Modals & Overlays
- [x] Full-screen or near-full on mobile (inset-4 not inset-20)
- [x] Modal header sticky (does not scroll away)
- [x] Close button: 44×44px minimum (thumb-friendly)
- [x] Scrollable content area with visible scroll

### Navigation & Buttons
- [x] Primary CTA: full-width on mobile
- [x] Secondary actions: 2-up or stacked
- [x] No hover states only (add active/tap states)
- [x] Disabled states: clear visual indication

### Images & Media
- [x] Responsive images: srcset or Next.js Image optimization
- [x] SVG icons: scale with parent container
- [x] Emojis: adjust size based on breakpoint
- [ ] Compress assets (target < 50KB per asset)

### Performance (Mobile-Specific)
- [ ] Lazy load non-critical images/modals
- [ ] Debounce window resize listeners
- [ ] Optimize animations for mobile (reduce particle counts)
- [ ] Preload critical fonts

### Tested Breakpoints
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X)
- [ ] 430px (iPhone 12/13)
- [ ] 768px (iPad)
- [ ] 1024px+ (Desktop)

### Landscape Mode
- [ ] Test landscape orientation on mobile
- [ ] Adjust layout for wide-but-short screens
- [ ] Ensure readability in landscape

### Accessibility on Mobile
- [x] ARIA labels on all interactive elements
- [x] Focus states visible on tap
- [x] Focus ring: 2–3px, high contrast
- [x] Keyboard navigation: Tab through all interactive elements
- [x] Touch-friendly focus indicators (not just hover)

### Content Overflow
- [x] Long text wraps properly (no text overflow)
- [x] Numbers/IDs don't break layout
- [x] Modal content scrollable on mobile
- [x] No text truncation without overflow:hidden

### Orientation Changes
- [x] Layout adapts smoothly on rotate
- [x] No loss of state on orientation change
- [ ] Persistent scroll position or return to top

## Testing Tools
- Chrome DevTools (mobile emulation)
- iPhone 12/13 simulator (Xcode)
- Android emulator (Android Studio)
- Real device testing (recommended)

## Components Needing Review
1. WordBuilderGame - Letter tile layout on small screens
2. WordBuilderHome - Stacked sections, button sizing
3. Modals (WordCollection, Achievements) - Full-screen on mobile
4. AdventureMap - Single-column on mobile
5. GameModeSelector - Vertical card stack on mobile
6. LanguageSelector - Large touch targets maintained

## Critical Fixes Applied (PHASE 14)
- Mobile-first breakpoints library created
- Touch target constants defined (48px minimum)
- Responsive spacing/gap helpers added
- Responsive text size mapper created
- Safe area constants for notches

## Next Phases
- PHASE 15: Accessibility audit (keyboard nav, focus states)
- PHASE 16: Performance optimization (lazy load, asset compression)
- PHASE 17: Full regression testing (all devices, all languages)
