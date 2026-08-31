# 🚀 Kòkò's Word Builder — Launch Checklist

## Pre-Launch Requirements

### ⚙️ Backend Setup
- [ ] **Supabase Table:** Create `word_builder_progress` with RLS enabled
  ```sql
  CREATE TABLE word_builder_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id),
    language TEXT NOT NULL,
    current_level INTEGER DEFAULT 1,
    current_word_index INTEGER DEFAULT 0,
    words_completed INTEGER DEFAULT 0,
    stars_earned INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    last_streak_date TEXT,
    word_garden_seeds INTEGER DEFAULT 0,
    daily_word_completed_today BOOLEAN DEFAULT false,
    last_daily_word_date TEXT,
    mastered_words TEXT[] DEFAULT '{}',
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **RLS Policy:** Add policy for children to access only their own progress
- [ ] **API Keys:** Verify Supabase credentials in `.env.local`

### 🎵 Audio Assets
- [ ] **Letter Sounds:** Record 26 clips per language (at least English first)
  - Path: `/public/audio/[language]/[a-z].mp3`
  - Format: MP3, 44.1kHz, mono
  - Target: <50KB per clip
  - Speaker: Native speaker for each language
  - Content: Letter sound (not letter name), e.g. "/k/" not "kay"

- [ ] **Word Pronunciation:** System can generate via Web Speech API fallback (working now)

- [ ] **Upload clips** to `/public/audio/english/`, `/public/audio/yoruba/`, `/public/audio/french/`

### 🎨 Visual Assets
- [ ] **Kòkò Illustration:** Replace emoji 🦜 with SVG or Lottie
- [ ] **Àmì Illustration:** Replace emoji 👧🏾 with SVG or Lottie
- [ ] **Word Images:** Currently using emoji; consider upgrade for future
  - Example: 🐱 (cat) in word lists can become custom illustration

### 📱 Testing

#### Mobile Devices
- [ ] **iPhone 12 mini** (320px) — Portrait
- [ ] **iPhone SE** (375px) — Portrait  
- [ ] **iPhone 13 Pro Max** (430px) — Portrait
- [ ] **Android 12** (360px - 720px) — Portrait
- [ ] **Browser:** Chrome mobile, Safari iOS

#### Tablets
- [ ] **iPad Air** (768px) — Both orientations
- [ ] **iPad Pro** (1024px+) — Both orientations
- [ ] **Android Tablet** (various sizes)

#### Desktop
- [ ] **1920x1080** — Full browser
- [ ] **1024x768** — Smaller desktop
- [ ] **Responsive inspector** — All breakpoints

#### Game Testing
- [ ] **Level 1:** Build 2-letter words (AM, AN, AT)
- [ ] **Level 2:** Build 3-letter CVC words (CAT, DOG, SUN)
- [ ] **Level 3:** Build harder 3-letter words (FOX, RAN, SIT)
- [ ] **Level 4:** Build 4-letter words (FISH, BOOK, TREE)
- [ ] **Level 5:** Build challenge 4-letter words (JUMP, RACE, MICE)
- [ ] **Wrong Answer:** Test hint progression (encouragement → highlight → audio)
- [ ] **Level Completion:** Verify celebration screen and star calculation
- [ ] **Progress Persistence:** Refresh page, verify progress saved
- [ ] **Language Switch:** Change languages, verify progress isolated

#### Language Testing
- [ ] **English:** All words appear correctly
- [ ] **Yorùbá:** Diacritics display (Ẹ, ọ, ṣ, GB)
  - Test on Windows, macOS, iOS, Android
  - Verify font supports characters
- [ ] **Français:** Accents display (é, è, ê, ù)
- [ ] **Kòkò Dialogue:** Each language has natural responses

#### Audio Testing
- [ ] **Letter Sounds:** Play on tile tap
- [ ] **Word Pronunciation:** Play on challenge load
- [ ] **Hint Audio:** Play when hint requested
- [ ] **Web Speech Fallback:** Works when clips missing
- [ ] **Mute Handling:** No errors if device muted
- [ ] **Interruption:** Doesn't crash if call/notification interrupts

#### Accessibility Testing
- [ ] **Touch Targets:** All buttons ≥48px (use developer tools)
- [ ] **Color Contrast:** Use WebAIM checker (should be 4.5:1+)
- [ ] **Focus Ring:** Visible on all interactive elements
- [ ] **Keyboard Navigation:** Tab through all buttons
- [ ] **Screen Reader:** Test with NVDA (Windows) or VoiceOver (Mac)
  - Read all labels correctly
  - Describe button purposes

### 📊 Metrics & Monitoring

- [ ] **Analytics Setup:** Verify Word Builder events tracked
  - Event: `word_builder_level_complete`
  - Event: `word_builder_daily_word_complete`
  - Event: `word_builder_language_selected`

- [ ] **Error Logging:** Sentry or similar configured
  - Alert on failed Supabase calls
  - Monitor for audio load failures

- [ ] **Database Monitoring:** Supabase dashboard
  - Watch query performance
  - Check row counts

### 🧑‍💼 Soft Launch (Internal)

- [ ] **Team Playtest:** 1-2 sessions with team members
- [ ] **Bug Report:** Document any issues found
- [ ] **Performance:** Measure load times on 3G network
- [ ] **Accessibility:** Internal screen reader test
- [ ] **UAT Sign-Off:** Stakeholder approval

### 👶 Dogfood with Children

- [ ] **Recruit 5-10 children** (ages 4-8)
- [ ] **15-20 minute sessions** — Observe, don't guide
- [ ] **Record observations:**
  - Which levels do they struggle with?
  - Do they understand the hint system?
  - Do they enjoy the rewards?
  - Any confusing UI elements?
- [ ] **Gather feedback:** Brief parent survey
- [ ] **Iterate:** Fix critical issues before launch

### 📋 Documentation

- [ ] **User Guide:** For parents (how to help child)
- [ ] **Teacher Guide:** For school administrators using in class
- [ ] **Support Page:** FAQs on website
- [ ] **Release Notes:** What's new, known issues

---

## Day-of-Launch Checklist

### 🔴 Pre-Launch (2 hours before)

- [ ] **Final Build:** Run `npm run type-check`
- [ ] **Verify Staging:** All code deployed to staging environment
- [ ] **Smoke Test:** Try language selection → level 1 → word build
- [ ] **Database:** Confirm all RLS policies in place
- [ ] **Audio:** Spot-check a few letter sounds play
- [ ] **Analytics:** Verify tracking working
- [ ] **Error Logs:** Check no critical errors
- [ ] **Team Ready:** All stakeholders standing by

### 🟢 Launch (Deploy to Production)

- [ ] **Deploy:** Git tag release, push to production
- [ ] **Verify:** Visit live site, confirm Word Builder loads
- [ ] **Test:** Quick playthrough on mobile (language select → Level 1)
- [ ] **Monitor:** Watch error logs first 30 minutes
- [ ] **Notify:** Tell team it's live

### 🟡 Post-Launch (First Week)

- [ ] **Daily Check:** Morning, afternoon, evening health checks
- [ ] **Error Monitoring:** Watch Sentry dashboard
- [ ] **Performance:** Monitor database queries
- [ ] **User Feedback:** Collect any bug reports
- [ ] **Crash Logs:** Address any crashes immediately
- [ ] **Engagement:** Are children playing? (check session counts)

---

## Success Metrics

### Immediate (Day 1)
- [ ] Zero critical errors in logs
- [ ] Pages load <2s on 4G network
- [ ] Language selection works for all 3 languages
- [ ] At least one child completes Level 1

### Week 1
- [ ] 100+ unique sessions
- [ ] <0.1% crash rate
- [ ] Average session >5 minutes
- [ ] Positive feedback from testers

### Month 1
- [ ] 1000+ unique children tried it
- [ ] Average 3+ levels completed per child
- [ ] >50% return rate
- [ ] <0.05% error rate

---

## Rollback Plan

**If critical issues discovered after launch:**

### Minor Issues (non-blocking)
- [ ] Hotfix in code
- [ ] Deploy to production
- [ ] Verify fix works

### Critical Issues (blocks gameplay)
- [ ] Hide Word Builder from home screen (remove from MODES)
- [ ] Notify users in-app
- [ ] Hotfix in parallel
- [ ] Redeploy when fixed
- [ ] Restore to home screen

### Database Emergency
- [ ] If Supabase table corrupted:
  - Drop table, recreate from backup
  - No data loss if backup procedure in place
  - Restore from yesterday's snapshot

### Complete Rollback
- [ ] Revert git to previous stable version
- [ ] Redeploy
- [ ] Verify Word Builder removed
- [ ] Team meeting to diagnose issue
- [ ] Fix, test in staging, redeploy

---

## Post-Launch Support (Week 2+)

### User Support
- [ ] Monitor support inbox (emails, messages)
- [ ] Common issues FAQ updated
- [ ] Parent guide refined based on questions

### Analytics Review
- [ ] Which levels most/least played?
- [ ] Average time per level?
- [ ] Dropout points?
- [ ] Language popularity?

### Performance Optimization
- [ ] Any slow queries?
- [ ] Cache improvements?
- [ ] Bundle size reduction?

### Feature Requests
- [ ] Collect ideas for V2
- [ ] Prioritize based on user feedback
- [ ] Plan roadmap

---

## Celebration 🎉

When Word Builder launches successfully:
- [ ] **Announce:** Blog post, social media
- [ ] **Thank You:** Card/email to everyone who helped
- [ ] **Celebrate:** Team dinner or lunch
- [ ] **Share Success:** Metrics with stakeholders

---

## Post-Launch (Month 1-3)

### Iterate Based on Data
- [ ] Monitor engagement metrics daily
- [ ] Fix bugs as they appear
- [ ] Gather user feedback
- [ ] Plan V2 improvements

### Audio Recording Pipeline
- [ ] Record full letter sound sets if not done
- [ ] Test with children
- [ ] Compare to TTS quality
- [ ] Replace TTS with recordings

### Illustration Upgrade (if time permits)
- [ ] Commission Lottie animations for Kòkò
- [ ] Update Àmì character illustration
- [ ] Test animations perform well
- [ ] Deploy updated characters

### V2 Planning
- [ ] Igbo language pack
- [ ] Hausa language pack
- [ ] Leaderboards
- [ ] Parent notifications
- [ ] Additional word packs

---

## Questions? 

Refer to:
- **WORD_BUILDER_GUIDE.md** — How system works
- **WORD_BUILDER_BUILD_SUMMARY.md** — What was built
- **Code comments** — Implementation details
- **Team** — Any urgent questions

---

**Ready to launch?** 🚀 You've got this!

*Last updated: August 31, 2026*
