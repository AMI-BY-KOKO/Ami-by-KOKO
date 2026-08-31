# Regression Testing Guide - Kòkò's Word Adventure (PHASE 17)

## Overview
Complete regression testing checklist for Word Adventure MVP. Covers all 5 languages, 5 levels, persistence, home integration, audio, animations, and edge cases.

---

## Test Categories

### 1. Language Support (5 Languages)

#### 1.1 English ✅
- [ ] Home card displays: "Kòkò's Word Adventure"
- [ ] Language selector shows English flag (🇬🇧)
- [ ] All 5 levels available
- [ ] Letter tiles display: A–Z
- [ ] Word data loads (confirm 5–10 words per level)
- [ ] Audio plays (fallback to Web Speech if clips missing)
- [ ] Kòkò dialogue in English
- [ ] Achievements display in English
- [ ] Daily Word challenge available
- [ ] Word Collection shows English words

#### 1.2 Yorùbá ✅
- [ ] Language selector shows Yorùbá flag (🇳🇬)
- [ ] Diacritics display correctly (À, È, É, Ì, Ó, Ú, etc.)
- [ ] All words show proper tone marks
- [ ] Audio pronunciation (yo-NG voice or fallback)
- [ ] Kòkò dialogue in Yorùbá
- [ ] "Locked" label shows (if paid feature)
- [ ] Characters don't truncate or overlap

#### 1.3 Français ✅
- [ ] Language selector shows French flag (🇫🇷)
- [ ] Accents display: é, è, ê, ë, ç, œ, etc.
- [ ] Audio pronunciation (fr-FR voice or fallback)
- [ ] Word collection shows French words
- [ ] Kòkò messages in French

#### 1.4 Igbo ✅
- [ ] Language selector shows Nigeria flag (🇳🇬)
- [ ] Special characters display correctly
- [ ] Audio pronunciation (ig-NG voice or fallback)
- [ ] Kòkò dialogue in Igbo

#### 1.5 Hausa ✅
- [ ] Language selector shows Nigeria flag (🇳🇬)
- [ ] Characters display properly
- [ ] Audio pronunciation (ha-NG voice or fallback)
- [ ] Kòkò dialogue in Hausa

---

### 2. Gameplay Testing (5 Levels)

#### 2.1 Level 1: Letter Garden (3–4 letter words)
- [ ] Select a word (e.g., "CAT")
- [ ] Letter tiles appear (randomized)
- [ ] Tap letter to select (highlight shows)
- [ ] Tap "Remove Last" to undo
- [ ] All letters selected
- [ ] Tap "Check" to submit
- [ ] Correct answer: confetti, Kòkò celebration, 3 stars awarded
- [ ] Stars persist after page refresh
- [ ] Wrong answer: "Almost there!" message appears
- [ ] Hint button works (reveals letter or image)
- [ ] Can retry without penalty
- [ ] Completion persists in progress

#### 2.2 Level 2: Little Word Path (4–5 letter words)
- [ ] Word changes after each completion
- [ ] Difficulty increases (more distractors)
- [ ] Hints available (fewer than Level 1)
- [ ] Stars earned persist
- [ ] Level indicator shows progress (e.g., "2/3 stars")
- [ ] Continue to next word without page reload

#### 2.3 Level 3: Word Forest (5–6 letter words)
- [ ] Harder word selection
- [ ] 3 hint system working
- [ ] Garden visually progresses (more plants/creatures)
- [ ] Word Collection accumulates mastered words
- [ ] Streak tracking active

#### 2.4 Level 4: Kòkò's Village (6–7 letter words)
- [ ] Significant difficulty jump
- [ ] Limited hints (1–2)
- [ ] Confetti celebration works
- [ ] Achievement tracking active
- [ ] Daily Word available at this level

#### 2.5 Level 5: Kòkò Challenge (7+ letter words)
- [ ] Hardest words
- [ ] Minimal hints
- [ ] Championship celebration on completion
- [ ] "Champion" achievement available
- [ ] Bonus stars for first-attempt success

---

### 3. Persistence Testing

#### 3.1 Progress Persistence
- [ ] Start a game in Level 1
- [ ] Select 2 letters
- [ ] Refresh page (Ctrl+F5)
- [ ] Game state preserved (same word, same selections)
- [ ] Close browser, reopen app
- [ ] Progress still there (Supabase sync)

#### 3.2 Language Persistence
- [ ] Select Yorùbá language
- [ ] Close and reopen app
- [ ] Language still Yorùbá (localStorage saved)
- [ ] Progress for Yorùbá persisted

#### 3.3 Achievement Persistence
- [ ] Unlock "First Word" achievement
- [ ] Refresh page
- [ ] Achievement marked "unlocked"
- [ ] Close browser, reopen
- [ ] Achievement still shows as unlocked

#### 3.4 Streak Persistence
- [ ] Complete Daily Word
- [ ] Streak increments
- [ ] Next day, Daily Word available again
- [ ] Streak increments further
- [ ] Milestone badges show cumulative progress

#### 3.5 Word Collection Persistence
- [ ] Master 3 words
- [ ] Close app
- [ ] Reopen, check "My Words"
- [ ] All 3 words still in collection with ⭐ indicators

---

### 4. Home Integration Testing

#### 4.1 Home Screen Card
- [ ] Card displays: "Kòkò's Word Adventure"
- [ ] Tagline: "Mix it. Match it. Make a word!"
- [ ] Gradient: amber/orange (flagship colors)
- [ ] Card positioned as 4th in MODES array
- [ ] Icon visible: 🦜
- [ ] Tap card navigates to language selector

#### 4.2 Home → Game Flow
- [ ] From home, tap Word Adventure card
- [ ] Language selector appears
- [ ] Select language (English)
- [ ] Home screen shows progress (stars, streak)
- [ ] Tap "Start Word Adventure" button
- [ ] Game loads with first word

#### 4.3 Game → Home Flow
- [ ] During game, tap "Back" button
- [ ] Return to home screen
- [ ] Progress still shows
- [ ] Can select different language
- [ ] Can tap "Play" to continue same language

#### 4.4 Home Progress Display
- [ ] Stars earned show for each language
- [ ] Streak count displays correctly
- [ ] Highest level reached indicators work
- [ ] "Coming Soon" for LISTEN/FIND modes

---

### 5. Audio Testing

#### 5.1 Word Audio Playback
- [ ] Tap word (if audio button visible)
- [ ] Audio plays (recorded clip or Web Speech)
- [ ] Volume appropriate (0.8 child-safe)
- [ ] No console errors
- [ ] Multiple plays work without error

#### 5.2 Letter Audio Playback
- [ ] On tile click, letter sound plays
- [ ] Letter audio works for all 26 letters (English)
- [ ] Falls back to Web Speech if clip missing

#### 5.3 Audio Preloading
- [ ] Next 3 words preload silently (no lag)
- [ ] Audio plays smoothly without network delay

#### 5.4 Audio Fallback
- [ ] If recorded clip missing, Web Speech API plays
- [ ] No error messages
- [ ] Child-appropriate voice selected

#### 5.5 Muted Environment
- [ ] Device muted (silent mode)
- [ ] Game plays normally (no error)
- [ ] No audio interruption attempted

---

### 6. Animation Testing

#### 6.1 Letter Tile Animations
- [ ] Hover: tile scales up (1.08)
- [ ] Tap: tile scales down (0.88) then returns
- [ ] Selected: border changes to amber
- [ ] Used: opacity reduced (40%)
- [ ] All animations smooth (60fps)

#### 6.2 Word Slot Animations
- [ ] Empty slot: underscore pulsing
- [ ] Letter placed: flip animation (rotateY 180°)
- [ ] All slots filled: green ring appears
- [ ] Filled slots glow with amber ring

#### 6.3 Confetti Celebration
- [ ] Correct answer: 100 particles
- [ ] Particles fall naturally
- [ ] No stuttering or jank (60fps)
- [ ] Disappears after 2–3 seconds
- [ ] Low-end device: reduced particles (50)

#### 6.4 Kòkò Feedback Animation
- [ ] Success: Kòkò bounces (scale 0.8→1.1→1)
- [ ] Correct: rose/pink gradient
- [ ] Hint: cyan/blue gradient
- [ ] Level complete: golden gradient
- [ ] Animations smooth and timely

#### 6.5 Word Garden Animation
- [ ] Garden grows as words complete
- [ ] New plant appears at milestones (10/25/50 seeds)
- [ ] Creatures appear (butterfly at 25, bee at 40)
- [ ] Floating seed animation when word completed
- [ ] All animations GPU-accelerated (no lag)

#### 6.6 Modal Animations
- [ ] Achievements modal: scale-in (0.95 → 1)
- [ ] Word Collection modal: slide-in from bottom
- [ ] Modals close with fade-out
- [ ] Backdrop appears/disappears smoothly

#### 6.7 Reduced Motion Support
- [ ] Device: Settings → Accessibility → Reduce Motion = ON
- [ ] Confetti disabled (no animation)
- [ ] Pulse animations static (no pulsing)
- [ ] Game plays without motion effects
- [ ] Functionality unchanged

---

### 7. Mobile/Responsive Testing

#### 7.1 Small Phone (320px)
- [ ] Layout stacks vertically
- [ ] Letter tiles fit on screen (2 rows × 13 cols)
- [ ] No horizontal scroll
- [ ] Buttons minimum 48px height
- [ ] Text readable (no truncation)
- [ ] Modals full-screen or near-full
- [ ] Touch targets easy to tap

#### 7.2 Regular Phone (375px)
- [ ] All content visible
- [ ] Layout adapts smoothly
- [ ] Game playable without zooming
- [ ] Spacing proportional

#### 7.3 Large Phone (430px)
- [ ] Extra space used effectively
- [ ] Buttons still appropriately sized
- [ ] No excessive empty space

#### 7.4 Tablet (768px)
- [ ] Grid layout adjusts (more columns)
- [ ] Modals side-by-side possible
- [ ] Comfortable for landscape mode
- [ ] Touch targets still accessible

#### 7.5 Desktop (1024px+)
- [ ] Desktop layout optimized
- [ ] Game remains centered
- [ ] Hover states visible
- [ ] Modals appropriately sized

#### 7.6 Orientation Changes
- [ ] Portrait → Landscape: layout reflows, state preserved
- [ ] Landscape → Portrait: game continues
- [ ] Scroll position remembered
- [ ] No loss of progress

---

### 8. Accessibility Testing

#### 8.1 Keyboard Navigation
- [ ] Tab through buttons (game screen)
- [ ] Letter tiles focusable
- [ ] Focus ring visible (amber)
- [ ] Enter/Space activates button
- [ ] Escape closes modals

#### 8.2 ARIA Labels
- [ ] Letter tiles: "Letter A", "Letter B", etc.
- [ ] Buttons have descriptive labels
- [ ] Modals announced
- [ ] Images have alt text (emojis + text)

#### 8.3 Color Contrast
- [ ] Text on cream-bg: high contrast (18:1)
- [ ] Button text: readable
- [ ] Focus ring: visible on all backgrounds

#### 8.4 Screen Reader Testing (Optional)
- [ ] Use NVDA or VoiceOver
- [ ] Button labels read correctly
- [ ] Game flow understandable
- [ ] No missing context

---

### 9. Performance Testing

#### 9.1 Load Time
- [ ] Initial page load: < 3s (3G throttle)
- [ ] Game start: < 1s
- [ ] Modal open: < 500ms
- [ ] Word submission: < 200ms

#### 9.2 Frame Rate
- [ ] Game: 60fps (smooth)
- [ ] Animations: no jank
- [ ] Confetti: smooth on 60fps device
- [ ] Low-end (30fps): acceptable smoothness

#### 9.3 Memory Usage
- [ ] App start: ~30MB
- [ ] During gameplay: ~40MB
- [ ] After 30 words: ~45MB (stable)
- [ ] No memory leaks

#### 9.4 Network Usage
- [ ] Initial assets: ~86KB (gzipped)
- [ ] Per game session: ~5KB queries
- [ ] Audio preload: ~60KB (3 words)
- [ ] Overall efficient

---

### 10. Edge Cases & Error Handling

#### 10.1 Empty State
- [ ] New user: home screen shows 0 words, 0 stars
- [ ] "My Words" empty: shows encouragement message
- [ ] No achievements yet: shows locked badges

#### 10.2 Network Errors
- [ ] Disconnect network mid-game
- [ ] Game attempts retry (or uses cache)
- [ ] Error message friendly (not technical)
- [ ] Reconnect: game resumes

#### 10.3 Audio Errors
- [ ] Missing audio clip: Web Speech fallback
- [ ] Web Speech unavailable: no error, silent
- [ ] Play during audio: queued or ignored

#### 10.4 Rapid Clicking
- [ ] Click "Check" multiple times
- [ ] Only one submission registered
- [ ] No duplicate submissions to Supabase

#### 10.5 Language Switching Mid-Game
- [ ] Playing English, tap "Change Language"
- [ ] Prompted to confirm (or auto-save)
- [ ] Switch to Yorùbá
- [ ] New language progress loads
- [ ] English progress still intact

---

### 11. Browser Compatibility

#### 11.1 Chrome (Latest)
- [ ] All features work
- [ ] Audio plays
- [ ] Animations smooth
- [ ] Console clean (no errors)

#### 11.2 Safari (iOS/Mac)
- [ ] Layout renders correctly
- [ ] Audio plays (if enabled)
- [ ] Touch interactions work
- [ ] Confetti visible

#### 11.3 Firefox
- [ ] Game functional
- [ ] No browser-specific issues
- [ ] Audio plays

#### 11.4 Android Chrome
- [ ] Mobile layout correct
- [ ] Touch responsive
- [ ] Audio plays

---

### 12. Data Validation

#### 12.1 Progress Integrity
- [ ] Stars awarded correctly (1–3 based on attempts)
- [ ] Mastered words count accurate
- [ ] Streak count matches calendar
- [ ] Level completion tracked

#### 12.2 Achievement Validation
- [ ] "First Word" unlocks after first word
- [ ] "Level Master" after completing Level 1
- [ ] Streak achievements unlock at correct intervals
- [ ] "All Levels" only after all 5 completed

#### 12.3 Word List Integrity
- [ ] All words in level 1 are 3–4 letters
- [ ] All words in level 5 are 7+ letters
- [ ] No duplicate words in same level
- [ ] All words age-appropriate

---

### 13. Pre-Launch Checklist

#### Build & Deployment
- [x] TypeScript strict mode: `npm run type-check` ✅
- [x] No console errors (critical)
- [x] No console warnings (non-critical)
- [ ] Build succeeds: `npm run build`
- [ ] No bundle warnings
- [ ] Bundle size < 200KB (uncompressed)

#### Data Integrity
- [ ] Supabase RLS policies active
- [ ] Database schema correct
- [ ] Seed data populated
- [ ] Admin can reset test data

#### Documentation
- [ ] README updated with Word Adventure info
- [ ] Changelog notes new feature
- [ ] Known issues documented
- [ ] Support contact listed

#### Final Verification
- [ ] All 17 phases complete ✅ (in progress)
- [ ] No regressions from original Word Builder
- [ ] All 5 languages tested
- [ ] All 5 levels tested
- [ ] Persistence verified
- [ ] Audio working
- [ ] Animations smooth
- [ ] Accessibility passing
- [ ] Performance targets met

---

## Test Execution Matrix

### Device Testing Grid
| Device | OS | Browser | Audio | Performance | Status |
|--------|----|---------| ------|-------------|--------|
| iPhone SE | iOS 15+ | Safari | ✅ | ✅ | Pending |
| iPhone 12/13 | iOS 16+ | Safari | ✅ | ✅ | Pending |
| Pixel 4a | Android 11+ | Chrome | ✅ | ✅ | Pending |
| iPad Air | iPadOS 15+ | Safari | ✅ | ✅ | Pending |
| Desktop | Windows/Mac | Chrome | ✅ | ✅ | Pending |
| Desktop | Windows/Mac | Firefox | ✅ | ✅ | Pending |

### Language Testing Grid
| Language | Letter Count | Sample Words | Status |
|----------|-------------|-------------|--------|
| English | A–Z | cat, dog, apple | Pending |
| Yorùbá | A–Z + diacritics | omi, ile, agbado | Pending |
| Français | A–Z + accents | chat, chien, pomme | Pending |
| Igbo | A–Z + special chars | okuko, nri, osisi | Pending |
| Hausa | A–Z + special chars | kifi, nama, kwari | Pending |

### Level Testing Grid
| Level | Difficulty | Word Length | Focus | Status |
|-------|-----------|------------|-------|--------|
| 1 | Easy | 3–4 | Introduction | Pending |
| 2 | Medium | 4–5 | Confidence | Pending |
| 3 | Medium-Hard | 5–6 | Mastery | Pending |
| 4 | Hard | 6–7 | Challenge | Pending |
| 5 | Expert | 7+ | Championship | Pending |

---

## Issue Resolution Process

### If Bug Found
1. Document: device, OS, browser, language, level, steps to reproduce
2. Screenshot: include error message or unexpected state
3. Severity: Critical (blocks gameplay), Major (reduces UX), Minor (cosmetic)
4. Fix: Implement fix, re-test, mark resolved

### Example Format
```
**Bug:** Letter tiles not highlighting on selection
**Device:** iPhone 12, iOS 16
**Language:** Yorùbá, Level 2
**Steps:**
1. Select Yorùbá, start Level 2
2. Tap any letter tile
3. Tile does not highlight (opacity doesn't change)

**Expected:** Tile highlights with amber border
**Actual:** No visual change
**Severity:** Major (affects gameplay clarity)
**Status:** Fixed (PR #123)
```

---

## Sign-Off

**Regression Testing:** PHASE 17
**Status:** Ready for testing ✅
**Target:** Zero regressions, all 5 languages, all 5 levels, full persistence
**Go-Live Criteria:** All critical issues resolved, 90%+ test coverage passing

---

## Test Results Summary

### Date: [Enter Date]
### Tester: [Enter Name]
### Devices Tested: [List]
### Languages Tested: [List]

### Results
- Critical Issues: 0 / [total]
- Major Issues: 0 / [total]
- Minor Issues: 0 / [total]
- **Overall: ✅ PASS / ❌ FAIL**

### Notes
[Document any issues, workarounds, or recommendations]

---

**End of Regression Testing Guide**
