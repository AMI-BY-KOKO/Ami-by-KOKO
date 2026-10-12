"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { initializeChildProgress, getChildAllProgress } from "@/lib/learning-paths/actions";
import Image from "next/image";
import { Star, BookOpen, Calculator, Globe, Puzzle, Music, BookHeart } from "lucide-react";
import CreateChildModal from "@/components/ui/CreateChildModal";
import OnboardingFlow from "@/components/ui/OnboardingFlow";
import SongButton from "@/components/ui/SongButton";
import ChallengeCard from "@/components/ui/ChallengeCard";
import TodaysAdventure from "@/components/TodaysAdventure";
import DailyChallengeCard from "@/components/DailyChallengeCard";
import { StreakDisplay } from "@/components/StreakDisplay";
import { StreakMilestoneCelebration, NewStreakStarted } from "@/components/StreakMilestoneCelebration";
import { AchievementDisplay, AchievementCounter } from "@/components/AchievementDisplay";
import { AchievementCelebration } from "@/components/AchievementCelebration";
import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import { useChild } from "@/hooks/useChild";
import { useAssignments } from "@/hooks/useAssignments";
import { useChallenges } from "@/hooks/useChallenges";
import { getSongOfTheDay, getLetterSong } from "@/lib/audio/songs";
import { isStudentAccount } from "@/lib/access";
import { getLevelInfo } from "@/lib/xp/xp";
import { SUBJECT_EMOJIS, CLASS_LABELS, type ChildWithClass } from "@/types";

const MODES = [
  { href: "/literacy",  icon: "BookOpen", title: "Literacy", color: "purple", bg: "bg-purple-50", tint: "#F0E9FF", colorHex: "#8B5CF6" },
  { href: "/numeracy",  icon: "Calculator", title: "Numeracy", color: "orange", bg: "bg-orange-50", tint: "#FFEEDD", colorHex: "#FF8A3D" },
  { href: "/world",     icon: "Globe", title: "My World", color: "blue", bg: "bg-blue-50", tint: "#E6F0FF", colorHex: "#3B82F6" },
  { href: "/word-builder", icon: "Puzzle", title: "Word Adventure", color: "green", bg: "bg-green-50", tint: "#E6F7EE", colorHex: "#1FA463" },
  { href: "/dj-booth",  icon: "Music", title: "DJ Booth", color: "pink", bg: "bg-pink-50", tint: "#FFE6F1", colorHex: "#EC4899" },
  { href: "/story",     icon: "BookHeart", title: "Story Mode", color: "yellow", bg: "bg-yellow-50", tint: "#FFFBEF", colorHex: "#FFC93C" },
];

const STORY_LETTERS = ["A","B","C","D","E","F","G","H","I","J"];
const SOTD_LETTER = getSongOfTheDay();
const SOTD_SONG = getLetterSong(SOTD_LETTER);

// ─── School Admin Home ────────────────────────────────────────────────────────

function SchoolAdminHome({ schoolName, subscriptionActive }: { schoolName: string; subscriptionActive: boolean }) {
  const SHORTCUTS = [
    { href: "/dashboard/school", emoji: "👥", title: "Students",    description: "Add, edit and manage students",  gradient: "from-green-500 to-emerald-400", shadow: "shadow-green-200", ring: "ring-green-200" },
    { href: "/dashboard/school", emoji: "📝", title: "Assignments", description: "Create and assign activities",   gradient: "from-amber-400 to-orange-400",  shadow: "shadow-amber-200", ring: "ring-amber-200"  },
    { href: "/dashboard/school", emoji: "📊", title: "Reports",     description: "View class progress",            gradient: "from-violet-500 to-purple-400", shadow: "shadow-violet-200",ring: "ring-violet-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 pb-24">
      <div className="relative overflow-hidden rounded-3xl mx-2 mt-2 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 shadow-xl shadow-green-200 min-h-[200px]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-10" />
        <div className="relative z-10 pt-8 pl-6 pr-4 pb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 mb-3">
              <span className="text-xs font-bold text-white">🏫 School Admin</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white leading-tight drop-shadow-sm">{schoolName}</h1>
            <p className="text-green-100 text-sm mt-1">Manage your students and assignments</p>
          </motion.div>
        </div>
      </div>

      {!subscriptionActive && (
        <div className="mx-2 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔒</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-800 text-sm">Students can only access A–F</p>
            <p className="text-amber-700 text-xs mt-0.5">Upgrade your school plan to unlock everything for all students.</p>
            <a
              href="https://wa.me/2349037789995?text=Hi%2C%20I%27d%20like%20to%20upgrade%20my%20school%20plan%20on%20%C3%80m%C3%AC%20by%20K%C3%B2k%C3%B2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
            >
              💬 Contact us to upgrade
            </a>
          </div>
        </div>
      )}

      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-stone-700 mb-3">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          {SHORTCUTS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}>
              <Link href={s.href}
                className={`flex items-center gap-4 p-4 rounded-3xl bg-white shadow-md ${s.shadow} ring-1 ${s.ring} transition hover:scale-[1.02] active:scale-[0.98]`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-stone-800 text-sm">{s.title}</p>
                  <p className="text-stone-500 text-xs">{s.description}</p>
                </div>
                <div className="text-stone-300">›</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <Link href="/dashboard/school"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition shadow-md shadow-green-200">
          Open School Dashboard →
        </Link>
      </div>
    </div>
  );
}

// ─── Student Home ─────────────────────────────────────────────────────────────

function StudentHome({
  child,
  schoolName,
}: {
  child: ChildWithClass;
  schoolName: string;
}) {
  const { masteredCount, masteredLetters } = useProgress(child.id, "english");
  const { streak } = useStreak(child.id);
  const { assignments, isCompleted } = useAssignments(child);
  const { challenge, myProgress, leaderboard, loading: challengeLoading } = useChallenges(child);
  const shardsFound = STORY_LETTERS.filter(l => masteredLetters.includes(l)).length;

  return (
    <div className="min-h-screen bg-cream-bg pb-32">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mx-3 mt-3 bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 shadow-xl shadow-amber-200 min-h-[240px]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-10" />

        <div className="relative z-10 pt-8 pl-6 pr-4 pb-4 max-w-[58%]">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* School + class badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/25 rounded-full px-2.5 py-1 mb-2">
              <span className="text-xs font-bold text-white">
                🏫 {schoolName}{child.class ? ` · ${CLASS_LABELS[child.class]}` : ""}
              </span>
            </div>

            <h1 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm">
              Welcome back, {child.name}! 🦜
            </h1>
            <p className="text-orange-100 text-sm mt-1 leading-relaxed">
              Kòkò is waiting for you.<br />Let&apos;s learn together!
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4">
            <Link href="/literacy"
              className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold text-sm px-5 py-2.5 rounded-2xl shadow-md hover:bg-amber-50 transition active:scale-95">
              Start learning →
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute right-0 bottom-0 w-40 h-52 sm:w-48 sm:h-60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ami-koko.svg" alt="Àmì and Kòkò" className="w-full h-full object-contain object-bottom" />
        </motion.div>
      </div>

      {/* Assignments */}
      {assignments.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-base font-bold text-stone-700 mb-3">📝 This Week&apos;s Assignments</h2>
          <div className="flex flex-col gap-2">
            {assignments.map(a => {
              const done = isCompleted(a.id);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white shadow-sm ring-1 ${done ? "ring-green-200" : "ring-amber-100"}`}>
                  <span className="text-2xl">{SUBJECT_EMOJIS[a.subject]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${done ? "text-stone-400 line-through" : "text-stone-800"}`}>{a.title}</p>
                    <p className="text-xs text-stone-400">
                      {a.content_keys.join(", ")}
                      {a.due_date ? ` · Due ${new Date(a.due_date).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  {done ? (
                    <span className="text-green-500 font-bold text-sm flex-shrink-0">✅ Done</span>
                  ) : (
                    <Link href={`/assignment/${a.id}`}
                      className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition">
                      Start →
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Challenge */}
      {(challenge || challengeLoading) && (
        <div className="px-4 mt-6">
          <h2 className="text-base font-bold text-stone-700 mb-3">🎯 This Week&apos;s Challenge</h2>
          <ChallengeCard
            challenge={challenge}
            myProgress={myProgress}
            leaderboard={leaderboard}
            childId={child.id}
            loading={challengeLoading}
          />
        </div>
      )}

      {/* Learning Mode Tiles */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-stone-700 mb-3">Explore & Learn</h2>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {MODES.map((mode, i) => {
            const iconMap: Record<string, React.ReactNode> = {
              BookOpen: <BookOpen size={20} />,
              Calculator: <Calculator size={20} />,
              Globe: <Globe size={20} />,
              Puzzle: <Puzzle size={20} />,
              Music: <Music size={20} />,
              BookHeart: <BookHeart size={20} />,
            };

            return (
              <motion.div key={mode.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Link href={mode.href}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${mode.bg} ring-1 ring-[#EFE8D8] hover:shadow-md transition active:scale-95 h-full`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold`}
                    style={{ backgroundColor: mode.colorHex }}>
                    {iconMap[mode.icon]}
                  </div>
                  <p className="text-[11px] font-bold text-stone-800 text-center leading-tight">{mode.title}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="px-4 mt-6">
        <DailyChallengeCard childId={child.id} />
      </div>

      {/* Today's Adventure */}
      <div className="px-4 mt-6">
        <TodaysAdventure childId={child.id} />
      </div>

      {/* Song of the Day */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-stone-700 mb-3">🎵 Song of the Day</h2>
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-violet-100 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-sm flex-shrink-0">
              {SOTD_LETTER}
            </div>
            <div className="flex-1">
              <p className="font-bold text-stone-800 text-sm">Letter {SOTD_LETTER} Song</p>
              <p className="text-stone-500 text-xs">Free every day — sing along with Kòkò!</p>
            </div>
          </div>
          <SongButton song={SOTD_SONG} label={`🎵 Sing the ${SOTD_LETTER} song`} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl p-4 shadow-sm ring-1 ring-stone-100 flex items-center justify-around">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-amber-500">{masteredCount}</span>
            <span className="text-xs text-stone-500">Learnt</span>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-green-500">{streak > 0 ? `${streak}🔥` : "0"}</span>
            <span className="text-xs text-stone-500">Streak</span>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-rose-400">{shardsFound}/10</span>
            <span className="text-xs text-stone-500">Shards</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Parent Home ──────────────────────────────────────────────────────────────

function ParentHome() {
  const supabase = createClient();
  const { children, activeChild, selectChild, refresh, loading: childrenLoading } = useChild();
  const activeChildWithClass = activeChild as ChildWithClass | null;
  const { masteredCount, masteredLetters } = useProgress(activeChild?.id ?? null, "english");
  const { streak } = useStreak(activeChild?.id);
  const { assignments, isCompleted } = useAssignments(activeChildWithClass);
  const { challenge, myProgress, leaderboard, loading: challengeLoading } = useChallenges(activeChildWithClass);

  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [streakMilestoneDay, setStreakMilestoneDay] = useState<number | null>(null);
  const [showNewStreakStarted, setShowNewStreakStarted] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);

  const shardsFound = STORY_LETTERS.filter(l => masteredLetters.includes(l)).length;
  const isSchoolChild = !!activeChildWithClass?.school_id;

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      if (!localStorage.getItem("onboarding_done")) setShowOnboarding(true);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize learning paths progress for active child if not already done
  useEffect(() => {
    async function ensureProgressInitialized() {
      if (!activeChild?.id) return;

      try {
        const existingProgress = await getChildAllProgress(activeChild.id);
        if (!existingProgress || existingProgress.length === 0) {
          const result = await initializeChildProgress(activeChild.id);
          if (!result.success) {
            console.warn("Failed to initialize progress:", result.error);
          }
        }
      } catch (err) {
        console.error("Error ensuring progress initialized:", err);
      }
    }

    ensureProgressInitialized();
  }, [activeChild?.id]);

  return (
    <>
      <div className="min-h-screen bg-cream-bg pb-32">
        
        {/* ─── HERO BANNER (Scene Image + Text Panel) ─────────────────────────────────── */}
        <div className="mx-3 mt-3 rounded-3xl overflow-hidden shadow-lg">
          {/* Desktop/Tablet: Side-by-side layout (TEXT LEFT 45%, IMAGE RIGHT 55%) */}
          <div className="hidden md:flex h-[300px] lg:h-[340px]">
            {/* Left: Text Panel (45%) */}
            <div className="w-[45%] bg-gradient-to-br from-cream-bg to-yellow-100 p-8 flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Greeting */}
                <p className="text-navy font-semibold text-sm mb-2">
                  {childrenLoading ? "Loading…" : activeChild ? `Hi, ${activeChild.name}! 👋` : "Welcome! 👋"}
                </p>

                {/* Main heading */}
                <h1 className="text-2xl font-extrabold text-navy leading-tight mb-2">
                  Ready to learn with Kòkò?
                </h1>

                {/* Subheading */}
                <p className="text-navy-body text-sm leading-relaxed mb-6">
                  Explore new letters, sounds,<br />and unlock story shards together!
                </p>

                {/* Child switcher button */}
                {children.length > 1 && (
                  <motion.button onClick={() => setShowSwitcher(v => !v)}
                    className="text-navy bg-white/60 hover:bg-white/80 rounded-full px-3 py-1 text-xs font-bold transition mb-4 w-fit"
                    aria-label="Switch child">
                    switch ↕
                  </motion.button>
                )}

                {/* Child switcher dropdown */}
                <AnimatePresence>
                  {showSwitcher && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute top-40 left-12 z-20 bg-white rounded-2xl shadow-xl ring-1 ring-[#EFE8D8] py-2 min-w-[160px]">
                      {children.map(c => (
                        <button key={c.id} onClick={() => { selectChild(c); setShowSwitcher(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition ${
                            activeChild?.id === c.id ? "bg-yellow/20 font-bold text-navy" : "text-stone-700 hover:bg-yellow/10"
                          }`}>
                          <span>{c.avatar_url ?? "🧒🏾"}</span>
                          {c.name}
                          {activeChild?.id === c.id && <span className="ml-auto text-yellow">✓</span>}
                        </button>
                      ))}
                      <div className="border-t border-[#EFE8D8] mt-1 pt-1">
                        <button onClick={() => { setShowModal(true); setShowSwitcher(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-stone-500 hover:bg-stone-50 transition">
                          ➕ Add child
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA Button */}
                <Link href="/literacy"
                  className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md transition active:scale-95">
                  Start learning →
                </Link>
              </motion.div>
            </div>

            {/* Right: Scene Image (55%) */}
            <div className="w-[55%] relative">
              <Image
                src="/brand/hero-scene.jfif"
                alt="Àmì and Kòkò in village"
                fill
                priority
                sizes="(min-width:1024px) 55vw, 55vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              {/* Gradient overlay on LEFT edge to blend into text panel */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cream-bg via-cream-bg/50 to-transparent" />
            </div>
          </div>

          {/* Mobile: Stacked layout (image top, text bottom) */}
          <div className="md:hidden flex flex-col">
            {/* Top: Scene Image (aspect-[16/10]) */}
            <div className="relative w-full aspect-[16/10]">
              <Image
                src="/brand/hero-scene.jfif"
                alt="Àmì and Kòkò in village"
                fill
                priority
                sizes="100vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>

            {/* Bottom: Text Panel */}
            <div className="bg-gradient-to-br from-cream-bg to-yellow-100 p-4 flex flex-col gap-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Greeting */}
                <p className="text-navy font-semibold text-sm">
                  {childrenLoading ? "Loading…" : activeChild ? `Hi, ${activeChild.name}! 👋` : "Welcome! 👋"}
                </p>

                {/* Main heading */}
                <h1 className="text-xl font-extrabold text-navy leading-tight">
                  Ready to learn with Kòkò?
                </h1>

                {/* Subheading */}
                <p className="text-navy-body text-xs leading-relaxed">
                  Explore new letters, sounds,<br />and unlock story shards together!
                </p>

                {/* Child switcher */}
                {children.length > 1 && (
                  <button onClick={() => setShowSwitcher(v => !v)}
                    className="text-navy bg-white/60 hover:bg-white/80 rounded-full px-3 py-1 text-xs font-bold transition w-fit"
                    aria-label="Switch child">
                    switch ↕
                  </button>
                )}

                {/* Child switcher dropdown */}
                <AnimatePresence>
                  {showSwitcher && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute top-80 left-4 right-4 z-20 bg-white rounded-2xl shadow-xl ring-1 ring-[#EFE8D8] py-2">
                      {children.map(c => (
                        <button key={c.id} onClick={() => { selectChild(c); setShowSwitcher(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition ${
                            activeChild?.id === c.id ? "bg-yellow/20 font-bold text-navy" : "text-stone-700 hover:bg-yellow/10"
                          }`}>
                          <span>{c.avatar_url ?? "🧒🏾"}</span>
                          {c.name}
                          {activeChild?.id === c.id && <span className="ml-auto text-yellow">✓</span>}
                        </button>
                      ))}
                      <div className="border-t border-[#EFE8D8] mt-1 pt-1">
                        <button onClick={() => { setShowModal(true); setShowSwitcher(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-stone-500 hover:bg-stone-50 transition">
                          ➕ Add child
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA Button */}
                <Link href="/literacy"
                  className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95 w-fit">
                  Start learning →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── LEARNING JOURNEY CARD ─────────────────────────── */}
        {activeChild && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-3 mt-6">
            <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-[#EFE8D8]">
              <div className="flex items-center gap-4">
                {/* Level badge with image */}
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image
                    src="/brand/level-star.jfif"
                    alt=""
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* Level info + progress bar */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy text-sm mb-0.5">Level 1: Sprout</p>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-1">
                    <div className="h-full bg-gradient-to-r from-yellow to-orange" style={{ width: "45%" }} />
                  </div>
                  <p className="text-xs text-stone-500">45% to Level 2</p>
                </div>

                {/* Streak badge */}
                {streak > 0 && (
                  <div className="flex-shrink-0 flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 ring-1 ring-orange-200">
                    <span>🔥</span>
                    <span className="text-xs font-bold text-orange-700">{streak}</span>
                  </div>
                )}
              </div>

              {/* Stats line */}
              <p className="text-xs text-stone-500 mt-3 pt-3 border-t border-[#EFE8D8]">
                <span className="font-semibold text-navy">{masteredCount}</span> letters mastered • 
                <span className="font-semibold text-navy ml-1">{shardsFound}/10</span> story shards
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── LEARNING MODE TILES (3×2 grid on mobile, responsive) ───────────────────────── */}
        <div className="px-3 mt-6">
          <h2 className="text-base font-bold text-navy mb-3">Explore & Learn</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {MODES.map((mode, i) => {
              const iconMap: Record<string, React.ReactNode> = {
                BookOpen: <BookOpen size={24} />,
                Calculator: <Calculator size={24} />,
                Globe: <Globe size={24} />,
                Puzzle: <Puzzle size={24} />,
                Music: <Music size={24} />,
                BookHeart: <BookHeart size={24} />,
              };

              return (
                <motion.div key={mode.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <Link href={mode.href}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl ${mode.bg} ring-1 ring-[#EFE8D8] hover:shadow-md transition active:scale-95 h-full`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg`}
                      style={{ backgroundColor: mode.colorHex }}>
                      {iconMap[mode.icon]}
                    </div>
                    <p className="text-xs font-bold text-navy text-center leading-tight">{mode.title}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── DAILY CHALLENGE ─────────────────────────── */}
        {activeChild && (
          <div className="px-3 mt-6">
            <DailyChallengeCard childId={activeChild.id} />
          </div>
        )}

        {/* ─── TODAY'S ADVENTURE / CONTINUE LEARNING ─────────────────────────── */}
        {activeChild && (
          <div className="px-3 mt-6">
            <h2 className="text-base font-bold text-navy mb-3">Continue Learning</h2>
            <TodaysAdventure childId={activeChild.id} />
          </div>
        )}

        {/* ─── SONG OF THE DAY ─────────────────────────── */}
        <div className="px-3 mt-6">
          <h2 className="text-base font-bold text-navy mb-3">🎵 Song of the Day</h2>
          <div className="bg-white rounded-3xl shadow-sm ring-1 ring-[#EFE8D8] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-lg font-extrabold text-white shadow-sm flex-shrink-0">
                {SOTD_LETTER}
              </div>
              <div className="flex-1">
                <p className="font-bold text-navy text-sm">Letter {SOTD_LETTER} Song</p>
                <p className="text-stone-500 text-xs">Free every day — sing along with Kòkò!</p>
              </div>
            </div>
            <SongButton song={SOTD_SONG} label={`🎵 Sing the ${SOTD_LETTER} song`} />
          </div>
        </div>

        {/* ─── NO CHILD BANNER ─────────────────────────── */}
        {!childrenLoading && children.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-3 mt-6">
            <div className="bg-white rounded-3xl p-4 shadow-sm ring-1 ring-[#EFE8D8] flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-yellow/30 flex items-center justify-center text-xl flex-shrink-0">👶</span>
              <div className="flex-1">
                <p className="font-bold text-navy text-sm">Add a child profile</p>
                <p className="text-stone-500 text-xs">Track letters, streaks and story progress</p>
              </div>
              <button onClick={() => userId && setShowModal(true)}
                className="flex-shrink-0 bg-yellow hover:bg-yellow/90 text-navy text-xs font-bold px-3 py-2 rounded-xl transition">
                Add
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {showSwitcher && <div className="fixed inset-0 z-10" onClick={() => setShowSwitcher(false)} />}

      {/* Modals & Celebrations */}
      <StreakMilestoneCelebration
        milestoneDay={streakMilestoneDay}
        onClose={() => setStreakMilestoneDay(null)}
      />

      <NewStreakStarted
        show={showNewStreakStarted}
        onClose={() => setShowNewStreakStarted(false)}
      />

      <AchievementCelebration
        achievements={newAchievements}
        onClose={() => setNewAchievements([])}
      />

      <AnimatePresence>
        {showModal && userId && (
          <CreateChildModal parentId={userId}
            onCreated={() => { setShowModal(false); refresh(); }}
            onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={() => {
            localStorage.setItem("onboarding_done", "1");
            setShowOnboarding(false);
          }} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Root page — detects account type and renders correct home ────────────────

export default function HomePage() {
  const supabase = createClient();
  const [accountType, setAccountType] = useState<"loading" | "student" | "school_admin" | "parent">("loading");
  const [studentChild, setStudentChild] = useState<ChildWithClass | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isStudentAccount(user.email)) {
        // Student — load child from localStorage activeChildId
        const childId = localStorage.getItem("activeChildId");
        if (!childId) { setAccountType("parent"); return; }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: child } = await (supabase as any)
          .from("children")
          .select("*")
          .eq("id", childId)
          .single();

        if (child) {
          setStudentChild(child as ChildWithClass);

          if (child.school_id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: school } = await (supabase as any)
              .from("schools")
              .select("name, subscription_active")
              .eq("id", child.school_id)
              .single();
            if (school) {
              setSchoolName(school.name);
              setSubscriptionActive(school.subscription_active ?? false);
            }
          }
        }
        setAccountType("student");
        return;
      }

      // Non-student — check profile role
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("role, school_id")
        .eq("id", user.id)
        .single();

      if (profile?.role === "school_admin" && profile.school_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: school } = await (supabase as any)
          .from("schools")
          .select("name, subscription_active")
          .eq("id", profile.school_id)
          .single();
        if (school) {
          setSchoolName(school.name);
          setSubscriptionActive(school.subscription_active ?? false);
        }
        setAccountType("school_admin");
      } else {
        setAccountType("parent");
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (accountType === "loading") {
    return (
      <div className="flex flex-col gap-3 pb-10">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse ring-1 ring-stone-100"/>)}
      </div>
    );
  }

  if (accountType === "school_admin") {
    return <SchoolAdminHome schoolName={schoolName || "Your School"} subscriptionActive={subscriptionActive} />;
  }

  if (accountType === "student" && studentChild) {
    return <StudentHome child={studentChild} schoolName={schoolName} />;
  }

  return (
    <>
      <ParentHome />
    </>
  );
}
