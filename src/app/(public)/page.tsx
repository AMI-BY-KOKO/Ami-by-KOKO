"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Rocket, Play} from "lucide-react";
import TryALetter from "@/components/landing/TryALetter";
import YouTubeBanner from "@/components/YouTubeBanner/YouTubeBanner";
import WhatsAppGroupButton from "@/components/WhatsAppGroupButton";
import styles from "./landing.module.css";
import AmiKokoLogo from "@/components/AmiKokoLogo";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#features", label: "Learn" },
  { href: "#try", label: "Try it" },
  { href: "#testimonials", label: "Parents" },
  { href: "#pricing", label: "Pricing" },
];

const TILES = [
  { emoji: "📚", title: "Learn & Explore", bg: styles.tileBlue, icon: styles.tileIconBlue },
  { emoji: "📺", title: "Watch & Learn", bg: styles.tileOrange, icon: styles.tileIconOrange },
  { emoji: "🎮", title: "Games & Quizzes", bg: styles.tileAmber, icon: styles.tileIconAmber },
  { emoji: "🎨", title: "Create & Play", bg: styles.tileGreen, icon: styles.tileIconGreen },
  { emoji: "📊", title: "Track Progress", bg: styles.tileSky, icon: styles.tileIconSky },
];

const FEATURES = [
  {
    emoji: "🔤",
    title: "Phonics A–Z",
    description: "Every letter comes alive with Kòkò's voice and African word associations children recognise.",
    iconClass: styles.iconAmber,
  },
  {
    emoji: "🌍",
    title: "African Languages",
    description: "\"A is for Apple\" and \"A is for Àgbàdo\" — English alongside mother-tongue languages.",
    iconClass: styles.iconGreen,
  },
  {
    emoji: "🎵",
    title: "DJ Booth",
    description: "Mix letter sounds into music. Learning through creativity and play.",
    iconClass: styles.iconViolet,
  },
  {
    emoji: "📖",
    title: "Story Mode",
    description: "Kòkò lost his voice! Help him find it by mastering the alphabet.",
    iconClass: styles.iconRose,
  },
];

const STEPS = [
  { icon: "👩‍👦", step: "1", title: "Create a free account", desc: "Sign up as a parent in under a minute. Add your child's name and age." },
  { icon: "🌍", step: "2", title: "Pick a language", desc: "Start with English (free forever). Unlock African mother-tongue languages with a simple subscription." },
  { icon: "🦜", step: "3", title: "Learn with Kòkò", desc: "Tap letters, hear sounds, trace shapes, and help Kòkò find his voice." },
];

const TESTIMONIALS = [
  { quote: "My daughter asks to use it every morning before school.", name: "Ngozi A.", location: "Lagos, Nigeria", avatar: "👩🏾" },
  { quote: "Finally an app that teaches our language the right way.", name: "Amara K.", location: "Accra, Ghana", avatar: "👨🏾" },
  { quote: "Our pupils love Kòkò. It's the first thing they ask for.", name: "Mrs. Osei", location: "Nairobi, Kenya — Primary School Teacher", avatar: "👩🏾‍🏫" },
];

const PARENT_FEATURES = [
  "Phonics A–Z with Kòkò's voice",
  "Story Mode: help Kòkò find his voice",
  "DJ Booth and Song of the Day",
  "Games and quizzes",
  "Track your child's progress",
];

const SCHOOL_FEATURES = [
  "Class-level progress reports",
  "Pupil management",
  "CSV exports",
  "Your school's branding on the welcome screen",
];

const FAQS = [
  {
    q: "Is Àmì by Kòkò really free?",
    a: "Yes. Core learning is free for parents and schools. African mother-tongue languages are coming soon.",
  },
  {
    q: "Are there ads?",
    a: "No. There are no ads in the app.",
  },
  {
    q: "Does it work on any phone?",
    a: "Yes. It works on most phones and browsers. Open it in your browser to start.",
  },
  {
    q: "Can my child use it without me?",
    a: "Yes. Children can explore on their own, and you can check their progress from your account.",
  },
  {
    q: "How do schools sign up?",
    a: "Email schools@amibykoko.com and we'll set up your school account.",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.page}>

        {/* ── Sticky Nav ─────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.navBar}>
            <div>
              <Link href="/" className={styles.brand}>
                  <AmiKokoLogo height={30} />
              </Link>
            </div>

            <nav className={styles.navLinks}>
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className={styles.navLink}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div className={styles.navActions}>
              <Link href="/student-login" className={styles.studentLogin}>Student login</Link>
              <Link href="/auth/login" className={styles.signIn}>Sign in</Link>
              <Link href="/auth/signup" className={styles.ctaButton}>Start free →</Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={styles.menuButton}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className={styles.mobileMenu}>
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className={styles.mobileLink}>
                  {l.label}
                </a>
              ))}
              <Link href="/student-login" className={styles.mobileStudentLogin}>Student login</Link>
              <Link href="/auth/login" className={styles.mobileSignIn}>Sign in</Link>
            </nav>
          )}
        </header>

        {/* ── Hero ───────────────────────────────────────── */}
        <section id="home" className={styles.hero}>
          <Image
            src="/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.bgMobile}
          />
          <Image
            src="/bbg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.bgDesktop}
          />

          <div className={styles.heroGrid}>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className={styles.heroText}
            >
              <span className={styles.badge}>🌍 Built for African children</span>

              <h1 className={styles.heroTitle}>
                Big Dreams
                <br />
                Start with
                <br />
                <span className={styles.heroAccent}>Little</span> Learners!
              </h1>

              <p className={styles.heroSub}>
                Join Àmì and her talking parrot Kòkò on exciting learning adventures
                filled with <strong>phonics, stories, games</strong> and
                mother-tongue languages from across Africa.
              </p>

              <div className={styles.heroButtons}>
                <Link href="/auth/signup" className={styles.primaryButton}>
                <Rocket size={22} strokeWidth={2.2} aria-hidden="true" />
                  Get Started
                </Link>
                <a href="#watch" className={styles.secondaryButton}>
                  <Play size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  Watch Video
                </a>
              </div>

              <div className={styles.perks}>
                {["✓ Free to start", "✓ No ads ever", "✓ Works on any phone"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={styles.heroVisual}
            >
              <div className={styles.visualBox}>
                <div className={styles.blob} />
                <motion.div animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3 }}
                  className={`${styles.dot} ${styles.dotAmber}`} />
                <motion.div animate={{ y: [6, -6, 6] }} transition={{ repeat: Infinity, duration: 2.5 }}
                  className={`${styles.dot} ${styles.dotGreen}`} />
                <motion.div animate={{ y: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 3.5 }}
                  className={`${styles.dot} ${styles.dotRose}`} />
                <motion.div
                  animate={{ y: [-8, 0, -8] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className={styles.character}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {<img
                    src="/hero-ami-koko.PNG"
                    alt="Àmì, an African girl, holding Kòkò her talking parrot"
                    className={styles.characterImg}
                  />}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Feature tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.tilesCard}
          >
            <div className={styles.tilesGrid}>
              {TILES.map((t) => (
                <div key={t.title} className={`${styles.tile} ${t.bg}`}>
                  <div className={`${styles.tileIcon} ${t.icon}`}>{t.emoji}</div>
                  <p className={styles.tileTitle}>{t.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Marquee strip ──────────────────────────────── */}
        <div className={styles.marquee}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className={styles.marqueeTrack}
          >
            {[...Array(2)].map((_, i) => (
              <span key={i} className={styles.marqueeGroup}>
                <span>🌟 English Phonics — Free</span>
                <span>·</span>
                <span>🌍 African Languages Coming</span>
                <span>·</span>
                <span>🦜 Learn with Kòkò</span>
                <span>·</span>
                <span>📱 Works on any phone</span>
                <span>·</span>
                <span>🏫 School plans available</span>
                <span>·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Interactive demo ───────────────────────────── */}
        <div id="try" className={styles.anchor}>
          <TryALetter />
        </div>

        {/* ── Features ───────────────────────────────────── */}
        <section id="features" className={`${styles.section} ${styles.anchor}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.heading}>Everything a child needs to love reading</h2>
            <p className={styles.subheading}>
              Built around how African children actually learn — through sound, story, and play.
            </p>
          </motion.div>

          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={styles.card}
              >
                <div className={`${styles.cardIcon} ${f.iconClass}`}>{f.emoji}</div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardText}>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How it works ───────────────────────────────── */}
        <section id="how" className={styles.howSection}>
          <div className={styles.howInner}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.howHeading}
            >
              Up and learning in 3 steps
            </motion.h2>

            <div className={styles.stepsGrid}>
              {STEPS.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={styles.step}
                >
                  {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
                  <div className={styles.stepCircleWrap}>
                    <div className={styles.stepCircle}>{item.icon}</div>
                    <div className={styles.stepBadge}>{item.step}</div>
                  </div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepText}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────── */}
        <section id="testimonials" className={`${styles.section} ${styles.anchor}`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.testimonialHeading}
          >
            What parents are saying
          </motion.h2>

          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={styles.testimonial}
              >
                <div className={styles.stars}>
                  {"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.author}>
                  <span className={styles.avatar}>{t.avatar}</span>
                  <div>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorLocation}>{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.notice}
          >
            <div className={styles.noticeBox}>
              <span className={styles.noticeIcon}>🦜</span>
              <div className={styles.noticeText}>
                <p className={styles.noticeTitle}>Be among the first to try it</p>
                <p className={styles.noticeSub}>
                  Join early and help shape the future of African children&apos;s learning.
                </p>
              </div>
              <Link href="/auth/signup" className={styles.noticeButton}>
                Join now →
              </Link>
            </div>
          </motion.div>
        </section>

        <div id="watch" className={styles.anchor}>
          <YouTubeBanner />
        </div>

               {/* ── Pricing ────────────────────────────────────── */}
        <section id="pricing" className={`${styles.section} ${styles.anchor}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.heading}>Free for Parents and Schools</h2>
            <p className={styles.subheading}>No credit card, no hidden fees. Start learning today.</p>
          </motion.div>

          <div className={styles.pricingGrid}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${styles.priceCard} ${styles.priceCardHighlight}`}
            >
              <span className={styles.priceBadge}>For Parents</span>
              <p className={styles.priceAmount}>Free</p>
              <p className={styles.priceNote}>Free forever for English phonics</p>
              <ul className={styles.priceList}>
                {PARENT_FEATURES.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/auth/signup" className={styles.priceCta}>
                Start free
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.priceCard}
            >
              <span className={styles.priceBadge}>For Schools</span>
              <p className={styles.priceAmount}>Free</p>
              <p className={styles.priceNote}>Free for every school that signs up</p>
              <ul className={styles.priceList}>
                {SCHOOL_FEATURES.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <a href="mailto:schools@amibykoko.com" className={`${styles.priceCta} ${styles.priceCtaOutline}`}>
                Register your school
              </a>
            </motion.div>
          </div>
        </section>

                {/* ── FAQ ────────────────────────────────────────── */}
        <section id="faq" className={`${styles.faqSection} ${styles.anchor}`}>
          <div className={styles.faqCard}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.faqTitle}
            >
              FAQ
            </motion.h2>

            <div className={styles.faqList}>
              {FAQS.map((f) => (
                <details key={f.q} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{f.q}</summary>
                  <p className={styles.faqAnswer}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        {/* ── School CTA ─────────────────────────────────── */}
        <section className={styles.schoolWrap}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.schoolCard}
          >
            <span className={styles.schoolIcon}>🏫</span>
            <h2 className={styles.schoolTitle}>Bring Àmì by Kòkò to your school</h2>
            <p className={styles.schoolText}>
              School plan includes class-level progress reports, pupil management,
              CSV exports, and your school&apos;s branding on the welcome screen.
            </p>
            <a href="mailto:schools@amibykoko.com" className={styles.schoolButton}>
              Contact us for school pricing →
            </a>
          </motion.div>
        </section>

        {/* ── Final CTA ──────────────────────────────────── */}
        <section className={styles.finalSection}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.finalInner}
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className={styles.finalIcon}
            >
              🦜
            </motion.div>
            <h2 className={styles.finalTitle}>Ready to start the adventure?</h2>
            <p className={styles.finalText}>All features are completely free. No credit card needed.</p>
            <Link href="/auth/signup" className={styles.finalButton}>
              Create Free Account 🎉
            </Link>
            <Link href="/auth/login" className={styles.finalLink}>
              Already have an account? Sign in →
            </Link>
          </motion.div>
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <span className={styles.footerBrandIcon}>🦜</span>
                <span className={styles.footerBrandText}>Àmì by Kòkò</span>
              </div>
              <p className={styles.footerTagline}>Made with ❤️ for African children everywhere.</p>
              <div className={styles.footerLinks}>
                <a href="mailto:hello@amibykoko.com" className={styles.footerLink}>Contact</a>
                <a href="/auth/signup" className={styles.footerLink}>Sign up</a>
                <a href="mailto:schools@amibykoko.com" className={styles.footerLink}>Schools</a>
              </div>
            </div>

            <div className={styles.footerLegal}>
              <a href="https://amibykoko.app" target="_blank" rel="noopener noreferrer">amibykoko.app</a>
              <span className={styles.footerDot}>•</span>
              <Link href="/privacy">Privacy Policy</Link>
              <span className={styles.footerDot}>•</span>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </div>
      <WhatsAppGroupButton groupLink="https://chat.whatsapp.com/GvLjEf5AhNU4tjXYTMwm0s?s=cl&p=a&mlu=4&ilr=4" />
    </>
  );
}