"use client";

import { use } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { NUMBER_DATA } from "@/lib/numeracy/number-data";
import { useChild } from "@/hooks/useChild";
import { useAccess } from "@/hooks/useAccess";

interface Props { params: Promise<{ language: string }> }

export default function NumeracyGridPage({ params }: Props) {
  const { language } = use(params);
  if (language !== "english") notFound();

  const searchParams = useSearchParams();
  const requestedStart = Number(searchParams.get("start") ?? "1");
  const requestedEnd = Number(searchParams.get("end") ?? "10");
  const rangeStart = Number.isInteger(requestedStart)
    ? Math.min(Math.max(requestedStart, 1), 100)
    : 1;
  const rangeEnd = Number.isInteger(requestedEnd)
    ? Math.min(Math.max(requestedEnd, rangeStart), 100)
    : Math.min(rangeStart + 9, 100);
  const visibleNumbers = Object.values(NUMBER_DATA).filter((data) => {
    const value = Number(data.numeral);
    return value >= rangeStart && value <= rangeEnd;
  });
  const { activeChild, loading: childLoading } = useChild();
  const { loading: accessLoading } = useAccess(activeChild);

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
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-800">Numbers {rangeStart}–{rangeEnd}</h1>
          <p className="text-stone-500 text-sm mt-1">Tap a number — hear Kòkò say it! 🦜</p>
        </div>

        <div role="list" aria-label={`Numbers ${rangeStart} to ${rangeEnd}`}
          className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {visibleNumbers.map((data, i) => (
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
          ))}
        </div>
      </div>
    </>
  );
}