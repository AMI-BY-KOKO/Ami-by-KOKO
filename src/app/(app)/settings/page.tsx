"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChild } from "@/hooks/useChild";
import { useAccess } from "@/hooks/useAccess";
import CreateChildModal from "@/components/ui/CreateChildModal";
import { AnimatePresence } from "framer-motion";
import { CLASS_LABELS, type ClassLevel } from "@/types";
import WhatsAppGroupButton from "@/components/WhatsAppGroupButton";
// ─── Student settings view ────────────────────────────────────────────────────

interface StudentInfo {
  name: string;
  avatarUrl: string | null;
  class: ClassLevel | null;
  schoolName: string | null;
  schoolSubscriptionActive: boolean;
}

function StudentSettings({ student }: { student: StudentInfo }) {
  const router = useRouter();
  const supabase = createClient();
  const [signingOut, setSigningOut] = useState(false);

  const classLabel = student.class ? CLASS_LABELS[student.class] : null;
  const schoolDisplay = [student.schoolName, classLabel].filter(Boolean).join(" · ");

  async function handleSwitchStudent() {
    setSigningOut(true);
    await supabase.auth.signOut();
    if (typeof window !== "undefined") localStorage.removeItem("activeChildId");
    router.push("/student-login");
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      <h1 className="text-2xl font-extrabold text-stone-800">Settings</h1>

      {/* Account — student identity, no system email */}
      <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
        <h2 className="font-bold text-stone-700 mb-3">Account</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{student.avatarUrl ?? "🧒🏾"}</span>
          <div>
            <p className="font-bold text-stone-800">{student.name}</p>
            {schoolDisplay && (
              <p className="text-xs text-stone-500 mt-0.5">🏫 {schoolDisplay}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSwitchStudent}
          disabled={signingOut}
          className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-2xl transition disabled:opacity-60"
        >
          🔄 {signingOut ? "Switching…" : "Switch student"}
        </button>
      </section>

      {/* School account — replaces subscription section */}
      <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
        <h2 className="font-bold text-stone-700 mb-3">🏫 School Account</h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          Your access is managed by{" "}
          <span className="font-semibold text-stone-800">{student.schoolName ?? "your school"}</span>.
        </p>
        <p className="text-sm text-stone-500 mt-2">
          All content is free — enjoy full access to all lessons!
        </p>
      </section>

      {/* Language packs — no pricing text */}
      <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
        <h2 className="font-bold text-stone-700 mb-3">Language Packs</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl ring-1 ring-green-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <p className="font-semibold text-stone-800 text-sm">English</p>
                <p className="text-xs text-stone-500">Full A–Z</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              Free ✓
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl ring-1 ring-green-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇳🇬</span>
              <div>
                <p className="font-semibold text-stone-800 text-sm">Yorùbá</p>
                <p className="text-xs text-stone-500">Full access · Coming soon</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              Coming 🔜
            </span>
          </div>

          {["Igbo", "Hausa"].map(lang => (
            <div key={lang} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl ring-1 ring-stone-100 opacity-60">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇳🇬</span>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{lang}</p>
                  <p className="text-xs text-stone-400">Coming soon</p>
                </div>
              </div>
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">Coming 🔜</span>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
        <h2 className="font-bold text-stone-700 mb-3">About</h2>
        <p className="text-sm text-stone-500">Àmì by Kòkò — v0.1.0 MVP</p>
        <p className="text-xs text-stone-400 mt-1">Made with ❤️ for Nigerian children.</p>
      </section>
    </div>  
  );
}

// ─── Main settings page ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { children, activeChild, selectChild } = useChild();
  const { isStudent } = useAccess(activeChild);
  const [showAddChild, setShowAddChild] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState<"parent" | "school_admin" | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<{ name: string; subscription_active: boolean; student_count: number } | null>(null);
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const studentAccount = user.email?.endsWith("@amibykoko.app") ?? false;

      if (studentAccount) {
        // Load student's child record + school
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("children")
          .select("name, avatar_url, class, school_id, schools(name, subscription_active)")
          .eq("auth_user_id", user.id)
          .limit(1)
          .single();

        if (data) {
          setStudentInfo({
            name: data.name,
            avatarUrl: data.avatar_url ?? null,
            class: data.class ?? null,
            schoolName: data.schools?.name ?? null,
            schoolSubscriptionActive: data.schools?.subscription_active ?? false,
          });
        }
        return; // don't load parent/admin data
      }

      // Parent / school admin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("phone_number, role, school_id")
        .eq("id", user.id)
        .single();
      if (profile?.phone_number) setUserPhone(profile.phone_number);
      if (profile?.role) setUserRole(profile.role);

      if (profile?.role === "school_admin" && profile?.school_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: school } = await (supabase as any)
          .from("schools").select("name, subscription_active").eq("id", profile.school_id).single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any)
          .from("children").select("id", { count: "exact", head: true }).eq("school_id", profile.school_id);
        if (school) setSchoolInfo({ name: school.name, subscription_active: school.subscription_active, student_count: count ?? 0 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render student view as soon as we know it's a student
  if (isStudent && studentInfo) {
    return <StudentSettings student={studentInfo} />;
  }

  // Loading state for student (isStudent true but studentInfo not yet loaded)
  if (isStudent && !studentInfo) {
    return (
      <div className="flex flex-col gap-3 pb-10">
        <div className="h-8 w-32 bg-stone-200 rounded-full animate-pulse" />
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-24 animate-pulse ring-1 ring-stone-100" />)}
      </div>
    );
  }

  async function savePhone() {
    if (!userId) return;
    setSavingPhone(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("profiles").update({ phone_number: userPhone.trim() || null }).eq("id", userId);
    setSavingPhone(false);
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 2000);
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  // ── Parent / school admin view ──────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-5 pb-10">
        <h1 className="text-2xl font-extrabold text-stone-800">Settings</h1>

        {/* Account */}
        <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="font-bold text-stone-700 mb-3">Account</h2>
          {userEmail && (
            <p className="text-sm text-stone-500 mb-4">
              Signed in as <span className="font-medium text-stone-700">{userEmail}</span>
            </p>
          )}

          {/* WhatsApp number — parents only */}
          <div className="mb-4">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1 block">
              WhatsApp number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                className="flex-1 rounded-2xl border border-stone-200 px-4 py-2.5 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button onClick={savePhone} disabled={savingPhone}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl transition disabled:opacity-60">
                {phoneSaved ? "✓ Saved" : savingPhone ? "…" : "Save"}
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-1">Get WhatsApp updates when your child completes activities</p>
          </div>

          <button onClick={handleSignOut} disabled={signingOut}
            className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition disabled:opacity-60">
            🚪 {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </section>

        {/* Child profiles — parents only */}
        {userRole !== "school_admin" && (
          <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
            <h2 className="font-bold text-stone-700 mb-3">Child Profiles</h2>
            <div className="flex flex-col gap-2">
              {children.map(child => (
                <div key={child.id}
                  className={`flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                    activeChild?.id === child.id ? "bg-amber-50 ring-1 ring-amber-200" : "bg-stone-50 hover:bg-amber-50"
                  }`}
                  onClick={() => selectChild(child)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{child.avatar_url ?? "🧒🏾"}</span>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{child.name}</p>
                      {child.age && <p className="text-xs text-stone-400">Age {child.age}</p>}
                    </div>
                  </div>
                  {activeChild?.id === child.id && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
              ))}
            </div>
            {userId && (
              <button onClick={() => setShowAddChild(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 py-3 rounded-2xl transition">
                ➕ Add child profile
              </button>
            )}
          </section>
        )}

        {/* Free Access */}
        <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="font-bold text-stone-700 mb-3">Subscription</h2>

          {userRole === "school_admin" ? (
            <div className="flex flex-col gap-3">
              {schoolInfo ? (
                <>
                  <div className={`rounded-2xl p-4 ring-1 ${schoolInfo.subscription_active ? "bg-green-50 ring-green-200" : "bg-stone-50 ring-stone-200"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-stone-800 text-sm">{schoolInfo.name}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${schoolInfo.subscription_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {schoolInfo.subscription_active ? "Active ✅" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">{schoolInfo.student_count} students enrolled</p>
                    <div className="flex flex-col gap-1 text-xs text-stone-600">
                      {["Student management","Assignment creation","Class progress reports","CSV export","Student login with PIN"].map(f => (
                        <span key={f}>✅ {f}</span>
                      ))}
                    </div>
                  </div>
                  <a href="https://wa.me/2349037789995?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20%C3%80m%C3%AC%20by%20K%C3%B2k%C3%B2%20for%20my%20school"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 py-3 rounded-2xl transition border border-green-200">
                    📱 Contact us for school features
                  </a>
                </>
              ) : (
                <p className="text-stone-400 text-sm">Loading school info…</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-4 ring-1 ring-green-200">
              <p className="font-bold text-green-700 text-sm mb-2">Àmì by Kòkò is completely free!</p>
              <p className="text-xs text-green-600 leading-relaxed">
                All features are accessible to all users — no paywalls, no upgrades needed. Enjoy full access to all letters, numbers, world categories, story shards, and DJ pads. Start learning today! 🎉
              </p>
            </div>
          )}
        </section>

        {/* Language packs */}
        <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="font-bold text-stone-700 mb-3">Language Packs</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">English</p>
                  <p className="text-xs text-stone-500">Full A–Z</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                Free ✓
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇳🇬</span>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">Yorùbá</p>
                  <p className="text-xs text-stone-500">Full access · Coming soon</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                Coming 🔜
              </span>
            </div>

            {["Igbo", "Hausa"].map(lang => (
              <div key={lang} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl ring-1 ring-stone-100 opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇳🇬</span>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{lang}</p>
                    <p className="text-xs text-stone-400">Coming soon</p>
                  </div>
                </div>
                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">Coming 🔜</span>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="font-bold text-stone-700 mb-3">About</h2>
          <p className="text-sm text-stone-500">Àmì by Kòkò — v0.1.0 MVP</p>
          <p className="text-xs text-stone-400 mt-1">Made with ❤️ for Nigerian children.</p>
          
          {/* Legal links */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-2">
            <a href="/privacy" className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              📄 Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              📄 Terms of Service
            </a>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showAddChild && userId && (
          <CreateChildModal
            parentId={userId}
            onCreated={() => { setShowAddChild(false); window.location.reload(); }}
          />
        )}
      </AnimatePresence>

      {/* Payment Status Modal */}
      <AnimatePresence>
        {paymentStatus !== "idle" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-10 max-w-lg mx-auto"
            >
              {paymentStatus === "processing" && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-5xl inline-block mb-4"
                  >
                    ⏳
                  </motion.div>
                  <h2 className="text-xl font-extrabold text-stone-900 mb-2">Processing Payment</h2>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Please wait while we confirm your payment...
                  </p>
                  <p className="text-xs text-stone-400 mt-4">This usually takes a few seconds</p>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-6xl inline-block mb-4"
                  >
                    ✨
                  </motion.div>
                  <h2 className="text-2xl font-extrabold text-green-700 mb-2">Payment Successful!</h2>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    Your subscription is now active. Reloading...
                  </p>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl inline-block"
                  >
                    🎉
                  </motion.div>
                </div>
              )}

              {paymentStatus === "error" && (
                <div className="text-center py-8">
                  <div className="text-5xl inline-block mb-4">⚠️</div>
                  <h2 className="text-xl font-extrabold text-red-700 mb-2">Confirmation Delayed</h2>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {paymentErrorMessage || "Your payment was received but we couldn't confirm it immediately."}
                  </p>
                  <p className="text-xs text-stone-500 mb-6">
                    Try refreshing the page. If it still doesn't work, your payment may have failed.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl transition"
                    >
                      Refresh Page
                    </button>
                    <button
                      onClick={() => setPaymentStatus("idle")}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3 rounded-2xl transition"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <WhatsAppGroupButton groupLink="https://chat.whatsapp.com/GvLjEf5AhNU4tjXYTMwm0s?s=cl&p=a&mlu=4&ilr=4" />
    </>
  );
}
