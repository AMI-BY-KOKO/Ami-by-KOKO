"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useChild } from "@/hooks/useChild";
import type { Profile, ClassLevel } from "@/types";

interface AppNavProps {
  profile: Profile;
}

const MODE_LABELS: Record<string, string> = {
  "/phonics":      "Phonics",
  "/numeracy":     "Numbers",
  "/world":        "My World",
  "/dj-booth":     "DJ Booth",
  "/story":        "Story Mode",
  "/dashboard":    "Dashboard",
  "/settings":     "Settings",
  "/live-class":   "Live Class",
  "/assignment":   "Assignment",
  "/literacy":     "Literacy",
};

// Core subjects shown in bottom nav
const CORE_SUBJECTS = ["/literacy", "/numeracy", "/world"];

// Main nav items (visible as pills on desktop/tablet)
const MAIN_NAV_ITEMS = [
  { href: "/home", label: "Home" },
  { href: "/literacy", label: "Literacy" },
  { href: "/numeracy", label: "Numeracy" },
  { href: "/world", label: "My World" },
  { href: "/dj-booth", label: "DJ Booth" },
  { href: "/story", label: "Story Mode" },
];

// Extended subjects (Sprout 2 & 3 only)
const EXTENDED_SUBJECTS: Array<{ href: string; emoji: string; label: string }> = [
  { href: "/science", emoji: "🔬", label: "Science" },
  { href: "/zoology", emoji: "🦁", label: "Zoology" },
  { href: "/health", emoji: "💪", label: "Health" },
  { href: "/social", emoji: "👫", label: "Social" },
  { href: "/colours-shapes", emoji: "🎨", label: "Colours" },
  { href: "/seasonal", emoji: "✨", label: "Creative" },
  { href: "/music-arts", emoji: "🎭", label: "Music" },
  { href: "/practical-life", emoji: "🏠", label: "Life" },
  { href: "/letter-name", emoji: "📝", label: "Spelling" },
];

export default function AppNav({ profile }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { activeChild } = useChild();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [childName, setChildName] = useState<string | null>(null);
  const [childAvatar, setChildAvatar] = useState<string | null>(null);
  const [studentContext, setStudentContext] = useState<string | null>(null); // "SOW · Sprout 1"

  const isHome = pathname === "/home";
  const currentLabel = Object.entries(MODE_LABELS).find(([key]) => pathname.startsWith(key))?.[1];
  const isSchoolAdmin = profile.role === "school_admin";
  const [isStudent, setIsStudent] = useState(false);
  
  // Show subject dropdown only for Sprout 2/3
  const showSubjectsMenu = (activeChild as any)?.class && ['sprout_2', 'sprout_3'].includes((activeChild as any).class);

  // Check if current route is active
  function isNavActive(href: string): boolean {
    if (href === "/home") return pathname === "/home";
    if (href === "/literacy") return pathname.startsWith("/literacy") || pathname.startsWith("/phonics");
    return pathname.startsWith(href);
  }

  // Detect student account and load school context
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const student = user.email?.endsWith("@amibykoko.app") ?? false;
      setIsStudent(student);

      if (student) {
        // Query child + school in one go
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("children")
          .select("name, avatar_url, class, schools(name)")
          .eq("auth_user_id", user.id)
          .limit(1)
          .single();

        if (data) {
          setChildName(data.name);
          setChildAvatar(data.avatar_url ?? null);
          const schoolName = data.schools?.name ?? null;
          const classLabel = data.class
            ? data.class.replace("sprout_", "Sprout ").replace("stepping_stone", "Stepping Stone")
            : null;
          if (schoolName || classLabel) {
            setStudentContext([schoolName, classLabel].filter(Boolean).join(" · "));
          }
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load active child for parent personalisation
  useEffect(() => {
    if (isSchoolAdmin || isStudent) return;
    const savedId = typeof window !== "undefined" ? localStorage.getItem("activeChildId") : null;
    if (!savedId) return;
    
    const loadChild = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("children")
          .select("name, avatar_url")
          .eq("id", savedId)
          .single();
        
        if (error) {
          // Log only relevant error info, not the full error object
          console.warn('[AppNav] Could not load active child — clearing cache', {
            message: error?.message,
            code: error?.code,
          });
          // Clear the invalid child ID from cache
          localStorage.removeItem("activeChildId");
          return;
        }
        
        if (data) { 
          setChildName(data.name); 
          setChildAvatar(data.avatar_url); 
        }
      } catch (err) {
        console.warn('[AppNav] Exception loading active child:', err instanceof Error ? err.message : 'Unknown error');
        // Clear potentially corrupt cache on error
        localStorage.removeItem("activeChildId");
      }
    };
    
    loadChild();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSchoolAdmin, isStudent]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    if (isStudent) {
      localStorage.removeItem("activeChildId");
      router.push("/student-login");
    } else {
      router.push("/auth/login");
    }
    router.refresh();
  }

  return (
    <>
      {/* Top Navigation — Cream background with navy text and pill nav links */}
      <nav className="sticky top-0 z-50 shadow-sm bg-cream-bg border-b border-[#EFE8D8]">
        <div className="px-4 py-3 max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Left — Wordmark */}
          <Link href="/home" className="flex-shrink-0 font-display text-lg font-bold flex items-center gap-1 hover:opacity-80 transition" aria-label="Home">
            <span className="text-xl">🦜</span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-coral">Àmì</span>
              <span className="text-xs text-navy-muted">by Kòkò</span>
            </div>
          </Link>

          {/* Center — Pill Nav Links (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {MAIN_NAV_ITEMS.map(item => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-yellow text-navy"
                      : "text-navy-body hover:bg-yellow/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right — Subjects Dropdown (Sprout 2/3) + Avatar Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Subjects dropdown for Sprout 2/3 */}
            {showSubjectsMenu && (
              <div className="relative">
                <button
                  onClick={() => setSubjectsMenuOpen(v => !v)}
                  className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-3 py-1.5 transition text-xs sm:text-sm font-bold whitespace-nowrap ring-1 ring-green-200"
                  aria-label="More subjects"
                  aria-expanded={subjectsMenuOpen}
                >
                  <span className="text-base">📚</span>
                  <span className="hidden sm:inline">More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Subjects dropdown menu with overlay */}
                <AnimatePresence>
                  {subjectsMenuOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" 
                        onClick={() => setSubjectsMenuOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl ring-1 ring-green-200 py-2 w-48"
                      >
                        <div className="px-4 py-2.5 border-b border-green-100">
                          <p className="font-bold text-green-800 text-sm">Other Subjects</p>
                          <p className="text-xs text-stone-500">Explore more topics</p>
                        </div>
                        <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
                          {EXTENDED_SUBJECTS.map(subject => (
                            <Link
                              key={subject.href}
                              href={subject.href}
                              onClick={() => setSubjectsMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50 transition"
                            >
                              <span className="text-lg">{subject.emoji}</span>
                              <span className="font-medium">{subject.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Avatar + Name Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 bg-yellow/20 hover:bg-yellow/30 text-navy rounded-full px-2 sm:px-3 py-1.5 transition ring-1 ring-yellow/40"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                {/* Child avatar or role icon */}
                <span className="text-base leading-none flex-shrink-0">
                  {isSchoolAdmin ? "🏫" : (childAvatar ?? "👩‍👦")}
                </span>
                <span className="text-xs font-bold text-navy hidden sm:block max-w-[100px] truncate">
                  {isSchoolAdmin
                    ? (profile.full_name.split(" ")[0] || "Admin")
                    : isStudent
                    ? (studentContext ?? childName ?? "Student")
                    : (childName ?? profile.full_name.split(" ")[0])}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-navy flex-shrink-0">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl ring-1 ring-[#EFE8D8] py-2 min-w-[200px]"
                    >
                      <div className="px-4 py-2.5 border-b border-[#EFE8D8]">
                        <p className="font-bold text-navy text-sm">
                          {isStudent ? (childName ?? "Student") : (profile.full_name || "Account")}
                        </p>
                        {isStudent ? (
                          studentContext && <p className="text-xs text-stone-500 mt-0.5">🏫 {studentContext}</p>
                        ) : (
                          <>
                            <p className="text-xs text-stone-500 capitalize">{profile.role.replace("_", " ")}</p>
                            {childName && !isSchoolAdmin && (
                              <p className="text-xs text-coral font-semibold mt-0.5">👶 {childName}</p>
                            )}
                          </>
                        )}
                      </div>

                      {isSchoolAdmin ? (
                        <Link href="/dashboard/school" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-[#FFFBEF] transition">
                          <span>🏫</span> School Dashboard
                        </Link>
                      ) : (
                        <Link href="/dashboard/parent" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-[#FFFBEF] transition">
                          <span>📊</span> Dashboard
                        </Link>
                      )}

                      <Link href="/settings" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-[#FFFBEF] transition">
                        <span>⚙️</span> Settings
                      </Link>

                      <div className="border-t border-[#EFE8D8] mt-1 pt-1">
                        {confirmSignOut ? (
                          <div className="px-4 py-2">
                            <p className="text-xs text-stone-600 mb-2 font-medium">Sign out?</p>
                            <div className="flex gap-2">
                              <button onClick={() => setConfirmSignOut(false)}
                                className="flex-1 text-xs py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition">
                                Cancel
                              </button>
                              <button onClick={handleSignOut} disabled={signingOut}
                                className="flex-1 text-xs py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60">
                                {signingOut ? "…" : "Sign out"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmSignOut(true)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                            <span>🚪</span> {isStudent ? "Switch student" : "Sign out"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}
