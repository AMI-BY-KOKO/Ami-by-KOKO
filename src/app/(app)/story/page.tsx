"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useChild } from "@/hooks/useChild";
import { useProgress } from "@/hooks/useProgress";
import { useAccess } from "@/hooks/useAccess";
import { useCertificates } from "@/hooks/useCertificates";
import { isShardFree } from "@/lib/access";
import { getAllStories } from "@/lib/content/stories";
import Certificate from "@/components/ui/Certificate";
import SongButton from "@/components/ui/SongButton";
import { CERTIFICATE_CONFIGS } from "@/types";
import type { SongData } from "@/lib/audio/songs";
import type { Story } from "@/types/stories";

const STORY_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const TOTAL = STORY_LETTERS.length;

// Narrative scenes — one per shard milestone
const SCENES = [
  { shards: 0,  title: "Kòkò has lost his voice!",         body: "One morning, Àmì woke up to find Kòkò completely silent. His voice had scattered into 10 sound shards, hidden inside the letters of the alphabet.",  bg: "from-stone-100 to-stone-200",   koko: "😢" },
  { shards: 2,  title: "The first shards glow!",            body: "Àmì found the first two shards! Kòkò can whisper now. \"A… B…\" he breathes softly. Keep going!",                                                       bg: "from-amber-50 to-yellow-100",   koko: "😮" },
  { shards: 4,  title: "Kòkò is getting stronger!",         body: "Four shards collected! Kòkò's beak is moving more. He can say \"C, D\" now. Àmì cheers him on!",                                                         bg: "from-amber-100 to-orange-100",  koko: "😊" },
  { shards: 6,  title: "Halfway there!",                    body: "Six shards! Kòkò can sing a little tune now. The forest animals are gathering to listen. Don't stop!",                                                    bg: "from-orange-100 to-amber-200",  koko: "😄" },
  { shards: 8,  title: "Almost there — Kòkò can sing!",     body: "Eight shards! Kòkò is dancing on Àmì's arm. His feathers are glowing bright green. Just two more shards to go!",                                        bg: "from-green-100 to-emerald-100", koko: "🥳" },
  { shards: 10, title: "Kòkò has his voice back!",          body: "All 10 shards collected! Kòkò bursts into song — the most beautiful sound in the whole forest. Àmì and Kòkò dance together. You did it!",               bg: "from-amber-300 to-orange-300",  koko: "🎉" },
];

// Celebration song — always free, plays when story is complete
const CELEBRATION_SONG: SongData = {
  key: "koko-restored",
  lyrics: "Kòkò has his voice back! Kòkò has his voice back! Sing and dance and shout hooray — Kòkò sings again today! A, B, C, D, E, F, G — Kòkò sings for you and me! Thank you for restoring Kòkò's voice — you made the very best choice!",
  audioPath: "/audio/songs/koko-restored.mp3",
};

function getCurrentScene(shards: number) {
  return [...SCENES].reverse().find(s => shards >= s.shards) ?? SCENES[0];
}

// Story Card Component
function StoryCard({ story, index }: { story: Story | Omit<Story, "pages">; index: number }) {
  const isAvailable = story.status === "available";
  const pageCount = "pages" in story ? story.pages?.length ?? 0 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={isAvailable ? `/stories/nigerias-independence` : "#"}
        className={isAvailable ? "block" : "pointer-events-none"}
      >
        <div
          className={`relative overflow-hidden rounded-3xl shadow-md transition ${
            isAvailable
              ? "bg-white ring-1 ring-amber-100 cursor-pointer hover:shadow-lg hover:shadow-amber-100 active:scale-95"
              : "bg-stone-50 opacity-75 ring-1 ring-stone-200"
          }`}
        >
          {/* Cover image or placeholder */}
          <div
            className={`w-full aspect-video bg-gradient-to-br ${
              isAvailable
                ? "from-amber-200 to-orange-200"
                : "from-stone-200 to-stone-300"
            } flex items-center justify-center relative overflow-hidden`}
          >
            {story.coverImageUrl ? (
              <img
                src={story.coverImageUrl}
                alt={`${story.title} — ${story.description}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="text-6xl">{isAvailable ? "📖" : "🔒"}</div>
            )}

            {/* Status badge */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-stone-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Coming Soon
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-stone-800 text-base leading-tight">
                {story.title}
              </h3>
              {isAvailable && <span className="text-xl flex-shrink-0">⭐</span>}
            </div>

            <p className="text-stone-600 text-xs mb-3 line-clamp-2">
              {story.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-600 font-semibold">
                  {story.category}
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600">{story.ageRange}</span>
              </div>

              {isAvailable && pageCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>📄</span>
                  <span>
                    {pageCount} page{pageCount !== 1 ? "s" : ""}
                  </span>
                  {story.estimatedMinutes && (
                    <>
                      <span>•</span>
                      <span>≈ {story.estimatedMinutes} min</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {isAvailable && (
              <button className="w-full mt-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-2 px-4 rounded-2xl transition text-sm shadow-sm">
                Start Story
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function StoryPage() {
  const { activeChild } = useChild();
  const { masteredLetters } = useProgress(activeChild?.id ?? null, "english");
  const { hasPaid, isStudent } = useAccess(activeChild);
  const { awardCertificate, hasCertificate } = useCertificates(activeChild?.id ?? null);

  const shardsCollected = STORY_LETTERS.filter(l => masteredLetters.includes(l)).length;
  const effectiveShards = shardsCollected;
  const completed = shardsCollected >= TOTAL;
  const pct = Math.round((effectiveShards / TOTAL) * 100);
  const scene = getCurrentScene(effectiveShards);
  const [showCert, setShowCert] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"voice-shards" | "stories">("voice-shards");

  const allStories = getAllStories();

  // Award story_hero certificate when story is completed
  useEffect(() => {
    if (completed && !hasCertificate("story_hero")) {
      awardCertificate("story_hero");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  return (
    <div className="flex flex-col items-center gap-6 pb-10 max-w-2xl mx-auto w-full">

      {/* ── Tabs ── */}
      <div className="w-full flex gap-2 px-4 mt-2">
        <button
          onClick={() => setSelectedTab("voice-shards")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition ${
            selectedTab === "voice-shards"
              ? "bg-amber-500 text-white shadow-md shadow-amber-200"
              : "bg-white text-stone-600 ring-1 ring-stone-100 hover:bg-stone-50"
          }`}
        >
          🎤 Voice Shards
        </button>
        <button
          onClick={() => setSelectedTab("stories")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition ${
            selectedTab === "stories"
              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
              : "bg-white text-stone-600 ring-1 ring-stone-100 hover:bg-stone-50"
          }`}
        >
          📚 Stories
        </button>
      </div>

      {/* ── VOICE SHARDS TAB ── */}
      <AnimatePresence mode="wait">
        {selectedTab === "voice-shards" && (
          <motion.div
            key="voice-shards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-5 px-4"
          >
            {/* Scene card */}
            <motion.div
              key={scene.shards}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full rounded-3xl bg-gradient-to-br ${scene.bg} p-6 text-center shadow-md`}
            >
              <motion.div
                animate={completed ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : { scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: completed ? 1.5 : 3 }}
                className="text-6xl mb-3"
              >
                {scene.koko}
              </motion.div>
              <h2 className="font-extrabold text-stone-800 text-lg mb-2">{scene.title}</h2>
              <p className="text-stone-600 text-sm leading-relaxed">{scene.body}</p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs font-semibold text-stone-500 mb-1.5">
                <span>{shardsCollected}/{TOTAL} shards found</span>
                <span>{pct}%</span>
              </div>
              <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Shard grid */}
            <div className="w-full">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 text-center">
                Voice Shards
              </p>
              <div role="list" aria-label="Voice shards" className="grid grid-cols-5 gap-2">
                {STORY_LETTERS.map((letter, idx) => {
                  const collected = masteredLetters.includes(letter);
                  return (
                    <motion.div
                      key={letter}
                      role="listitem"
                      aria-label={`Shard ${letter}${collected ? ", collected" : ", not yet found"}`}
                      animate={collected ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.4 }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 text-sm font-extrabold shadow-sm transition
                        ${collected
                          ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-amber-200"
                          : "bg-stone-100 text-stone-400"
                        }`}
                    >
                      <span className="text-base">{collected ? letter : "?"}</span>
                      {collected && <span className="text-xs opacity-80">{letter.toLowerCase()}</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Milestone badges */}
            <div className="w-full bg-white rounded-3xl p-4 shadow-sm ring-1 ring-stone-100">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Story milestones</p>
              <div className="flex flex-col gap-2">
                {SCENES.slice(1).map(s => {
                  const reached = shardsCollected >= s.shards;
                  return (
                    <div key={s.shards} className={`flex items-center gap-3 p-2 rounded-xl transition ${reached ? "bg-amber-50" : "opacity-40"}`}>
                      <span className="text-xl">{reached ? s.koko : "🔒"}</span>
                      <div>
                        <p className={`text-xs font-bold ${reached ? "text-stone-800" : "text-stone-400"}`}>
                          {s.shards} shards — {s.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {!completed && (
              <div className="w-full bg-white rounded-3xl shadow-md ring-1 ring-amber-100 p-5 text-center">
                <p className="text-stone-700 font-semibold mb-3 text-sm">
                  {shardsCollected === 0
                    ? "Start learning letters to collect shards!"
                    : `${TOTAL - shardsCollected} more letter${TOTAL - shardsCollected > 1 ? "s" : ""} to go!`}
                </p>
                <Link href="/phonics/english"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md shadow-amber-200">
                  Go to Phonics
                </Link>
              </div>
            )}

            {/* Completed — certificate */}
            {completed && (
              <div className="w-full bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl shadow-xl p-6 text-center flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-6xl"
                >
                  🏆
                </motion.div>
                <div>
                  <p className="font-extrabold text-white text-xl">Story Complete!</p>
                  <p className="text-orange-100 text-sm mt-1">
                    {activeChild?.name ?? "You"} restored Kòkò&apos;s voice!
                  </p>
                </div>
                <SongButton song={CELEBRATION_SONG} label="🎵 Hear Kòkò sing!" />
                <button
                  onClick={() => setShowCert(true)}
                  className="bg-white text-amber-600 font-extrabold px-8 py-3 rounded-2xl transition hover:bg-amber-50 shadow-md active:scale-95"
                >
                  🎓 Get Certificate
                </button>
              </div>
            )}

            {showCert && (
              <Certificate
                childName={activeChild?.name ?? "Champion"}
                achievement={CERTIFICATE_CONFIGS.story_hero.achievement}
                subject={CERTIFICATE_CONFIGS.story_hero.subject}
                onClose={() => setShowCert(false)}
              />
            )}
          </motion.div>
        )}

        {/* ── STORIES TAB ── */}
        {selectedTab === "stories" && (
          <motion.div
            key="stories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-4 px-4"
          >
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-stone-800 mb-1">📚 Story Library</h2>
              <p className="text-stone-600 text-sm">Read, listen, and explore with Àmì and Kòkò</p>
            </div>

            {/* Available Stories */}
            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">Available Stories</h3>
              <div className="flex flex-col gap-4">
                {allStories
                  .filter((s) => s.status === "available")
                  .map((story, idx) => (
                    <StoryCard key={story.id} story={story} index={idx} />
                  ))}
              </div>
            </div>

            {/* Coming Soon Stories */}
            {allStories.filter((s) => s.status === "coming-soon").length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3">Coming Soon</h3>
                <div className="flex flex-col gap-4">
                  {allStories
                    .filter((s) => s.status === "coming-soon")
                    .map((story, idx) => (
                      <StoryCard key={story.id} story={story} index={idx} />
                    ))}
                </div>
              </div>
            )}

            {allStories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🌟</div>
                <p className="text-stone-600 font-semibold">No stories yet!</p>
                <p className="text-stone-500 text-sm">Check back soon.</p>
              </div>
            )}

            {/* Fun fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-4 text-center ring-1 ring-amber-100"
            >
              <p className="text-stone-600 text-xs">
                <span className="font-bold text-amber-700">Did you know?</span>
                {" "}
                Stories help us learn about the world and about ourselves. Each story is a journey!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
