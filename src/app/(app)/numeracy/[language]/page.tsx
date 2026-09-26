"use client";

import { use, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useChild } from "@/hooks/useChild";
import { useAccess } from "@/hooks/useAccess";
import { isNumberFree } from "@/lib/access";

const NUMBER_ICONS = [
  "1F96D", "1F34A", "1F34C", "1F347", "1F353", "1F360", "1F966", "1F955", "1F336", "1F33D",
  "1F95E", "1F351", "1F352", "1F348", "1F349", "1F34D", "1F34E", "1F350", "1F351", "1F352",
];

const COLOURS = [
  "from-amber-400 to-orange-400",
  "from-green-400 to-emerald-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-amber-400 to-yellow-400",
  "from-teal-400 to-cyan-500",
  "from-orange-400 to-red-400",
  "from-fuchsia-400 to-pink-400",
  "from-green-500 to-emerald-400",
];

function getYorubaNumber(value: number): string {
  const ones: Record<number, string> = {
    1: "Ọkan",
    2: "Èjì",
    3: "Ẹta",
    4: "Ẹrin",
    5: "Àrún",
    6: "Ẹfà",
    7: "Èje",
    8: "Ẹjọ",
    9: "Ẹsàn",
  };

  const teens: Record<number, string> = {
    10: "Ẹwà",
    11: "Mokanlá",
    12: "Mejìlá",
    13: "Mẹ́tàlá",
    14: "Mẹ́rinlá",
    15: "Márùn",
    16: "Mẹ́fàlá",
    17: "Méjè",
    18: "Mẹ́jọ",
    19: "Mẹ́sàn",
  };

  const tens: Record<number, string> = {
    2: "Ogún",
    3: "Ọgbọn",
    4: "Ọgbẹ̀rin",
    5: "Ààdọ́ta",
    6: "Ọgọ́fa",
    7: "Ọgọ́je",
    8: "Ọgọ́jọ",
    9: "Ọgọ́sàn",
  };

  if (value <= 9) return ones[value];
  if (value <= 19) return teens[value];
  if (value % 10 === 0) {
    const tensValue = value / 10;
    return tens[tensValue] ?? `${tens[Math.floor(tensValue / 10)] ?? ""} ${ones[value % 10] ?? ""}`.trim();
  }

  const tensValue = Math.floor(value / 10);
  const remainder = value % 10;
  const tensWord = tens[tensValue] ?? "";
  const unitWord = ones[remainder] ?? "";

  return `${unitWord} l'${tensWord.toLowerCase()}`.trim();
}

const YORUBA_NUMBERS: Record<number, string> = Object.fromEntries(
  Array.from({ length: 100 }, (_, index) => [index + 1, getYorubaNumber(index + 1)])
);

function getEnglishNumber(value: number): string {
  const ones = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (value < 10) return ones[value];
  if (value < 20) return teens[value - 10];
  if (value < 100) {
    const tensValue = Math.floor(value / 10);
    const remainder = value % 10;
    return remainder === 0 ? tens[tensValue] : `${tens[tensValue]} ${ones[remainder]}`;
  }
  if (value === 100) return "One Hundred";

  return "One Hundred";
}

const NUMBER_DATA: Record<string, {
  numeral: string; word: string; yorubaWord: string; imageUrl: string; colour: string;
}> = Object.fromEntries(
  Array.from({ length: 100 }, (_, index) => {
    const numeral = index + 1;
    const colour = COLOURS[(numeral - 1) % COLOURS.length];
    const icon = NUMBER_ICONS[(numeral - 1) % NUMBER_ICONS.length];

    return [String(numeral), {
      numeral: String(numeral),
      word: getEnglishNumber(numeral),
      yorubaWord: YORUBA_NUMBERS[numeral] ?? getEnglishNumber(numeral),
      imageUrl: `https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/${icon}.svg`,
      colour,
    }];
  })
);

interface Props { params: Promise<{ language: string }> }

export default function NumeracyGridPage({ params }: Props) {
  const { language } = use(params);
  if (language !== "english") notFound();

  const searchParams = useSearchParams();
  const rangeStart = Number(searchParams.get("start") ?? "1");
  const rangeEnd = Number(searchParams.get("end") ?? "10");
  const safeRangeStart = Math.min(Math.max(rangeStart, 1), 100);
  const safeRangeEnd = Math.min(Math.max(rangeEnd, safeRangeStart), 100);
  const visibleNumbers = Object.values(NUMBER_DATA).filter((data) => {
    const value = Number(data.numeral);
    return value >= safeRangeStart && value <= safeRangeEnd;
  });

  const { activeChild, loading: childLoading } = useChild();
  const { hasPaid, loading: accessLoading, isStudent } = useAccess(activeChild);

  if (childLoading || accessLoading) {
    return (
      <div className="pb-10">
        <div className="h-7 w-40 bg-stone-200 rounded-full mx-auto animate-pulse mb-5" />
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {Array(10).fill(null).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pb-10">
        <div className="mb-5 text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-800">Numbers {safeRangeStart}–{safeRangeEnd}</h1>
          <p className="text-stone-500 text-sm mt-1">Tap a number — hear Kòkò say it! 🦜</p>
          {!hasPaid && !isStudent && safeRangeStart > 10 && (
            <p className="text-amber-600 text-xs font-semibold mt-1">
              🔒 Numbers {safeRangeStart}–{safeRangeEnd} locked ·{" "}
              <button onClick={() => setUpgradeOpen(true)} className="underline">Unlock Explorer</button>
            </p>
          )}
          {!hasPaid && isStudent && safeRangeStart > 10 && (
            <p className="text-amber-600 text-xs font-semibold mt-1">🔒 Some numbers are locked</p>
          )}
        </div>

        <div role="list" aria-label={`Numbers ${safeRangeStart} to ${safeRangeEnd}`}
          className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {visibleNumbers.map((data, i) => {
            const locked = !hasPaid && !isNumberFree(data.numeral) && Number(data.numeral) > 10;
            return (
              <motion.div key={data.numeral} role="listitem"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                whileTap={{ scale: 0.92 }}>
                <Link href={`/numeracy/${language}/${data.numeral}`}
                  className={`flex flex-col items-center rounded-2xl bg-gradient-to-br ${data.colour} shadow-md text-white overflow-hidden transition hover:scale-105`}
                  aria-label={`Number ${data.numeral}, ${data.word}`}>
                  <div className="w-full bg-white/20 flex items-center justify-center p-1.5 pt-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={data.imageUrl} alt={data.word} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center pb-2 pt-1 px-1">
                    <span className="text-2xl sm:text-3xl font-extrabold drop-shadow leading-none">{data.numeral}</span>
                    <span className="text-[9px] sm:text-[10px] font-medium opacity-90 mt-0.5">{data.word}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <UpgradePrompt isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} feature="numbers 11–100" />
    </>
  );
}

export { NUMBER_DATA };
