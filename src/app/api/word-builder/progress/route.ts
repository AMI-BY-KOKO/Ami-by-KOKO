/**
 * Word Builder Progress API
 * Handles saving word builder progress to Supabase.
 * Uses service role to bypass RLS for server-side operations.
 */

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const {
      childId,
      language,
      currentLevel,
      currentWordIndex,
      wordsCompleted,
      starsEarned,
      wordGardenSeeds,
      dailyWordCompleted,
      masteredWords,
    } = await request.json();

    if (!childId || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if progress record exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing, error: fetchErr } = await (supabase as any)
      .from("word_builder_progress")
      .select("id")
      .eq("child_id", childId)
      .eq("language", language)
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      // PGRST116 = no rows (first time)
      throw fetchErr;
    }

    const progressData = {
      child_id: childId,
      language,
      current_level: currentLevel ?? 1,
      current_word_index: currentWordIndex ?? 0,
      words_completed: wordsCompleted ?? 0,
      stars_earned: starsEarned ?? 0,
      word_garden_seeds: wordGardenSeeds ?? 0,
      daily_word_completed_today: dailyWordCompleted ?? false,
      mastered_words: masteredWords ?? [],
      last_activity: new Date().toISOString(),
    };

    let result;

    if (existing) {
      // Update existing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("word_builder_progress")
        .update(progressData)
        .eq("child_id", childId)
        .eq("language", language)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("word_builder_progress")
        .insert([progressData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Word Builder Progress API] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
