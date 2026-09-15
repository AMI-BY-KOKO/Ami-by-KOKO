"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const LANGUAGES = [
  { code: "english", label: "English", emoji: "🇬🇧", disabled: false, description: "Full A–Z phonics" },
  { code: "yoruba",  label: "Yorùbá",  emoji: "🇳🇬", disabled: true,  description: "Recordings in progress — launching soon!" },
  { code: "french",  label: "Français", emoji: "🇫🇷", disabled: true,  description: "Recordings in progress — launching soon!" },
  { code: "igbo",    label: "Igbo",     emoji: "🇳🇬", disabled: true,  description: "Recordings in progress — launching soon!" },
  { code: "hausa",   label: "Hausa",    emoji: "🇳🇬", disabled: true,  description: "Recordings in progress — launching soon!" },
];

export default function PhonicsLanguagePage() {
  const supabase = createClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      setChecking(false);
    }
    check();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-stone-800">Pick a Language</h1>
          <p className="text-stone-500 text-sm mt-1">Which language do you want to learn today?</p>
        </div>

        <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
          {LANGUAGES.map(lang => {
            if (!lang.disabled) {
              // English: fully active and tappable
              return (
                <Link key={lang.code} href={`/phonics/${lang.code}`}
                  className="flex items-center justify-between bg-white rounded-3xl p-5 shadow-md ring-1 ring-amber-100 transition hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.emoji}</span>
                    <div>
                      <p className="font-bold text-stone-800">{lang.label}</p>
                      <p className="text-xs text-stone-500">{lang.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Free
                  </span>
                </Link>
              );
            }

            // All other languages: Coming Soon, greyed out, NOT tappable
            return (
              <div key={lang.code}
                className="flex items-center justify-between bg-white rounded-3xl p-5 shadow-md ring-1 ring-stone-100 w-full opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.emoji}</span>
                  <div>
                    <p className="font-bold text-stone-800">{lang.label}</p>
                    <p className="text-xs text-stone-500">{lang.description}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Coming Soon 🔜
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}
