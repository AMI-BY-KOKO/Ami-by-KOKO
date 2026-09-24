/**
 * Learning Paths Backfill Script
 *
 * One-time operation to initialize learning progress for any existing children
 * who don't have child_progress records yet. This handles children created
 * before the initialization flow was added to CreateChildModal.
 *
 * Usage:
 *   From a Server Component or during manual admin operations:
 *   import { backfillMissingChildProgress } from "@/lib/learning-paths/backfill";
 *   const result = await backfillMissingChildProgress();
 *   console.log(result);
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { initializeChildProgress } from "@/lib/learning-paths/actions";

export interface BackfillResult {
  success: boolean;
  childrenWithoutProgress: string[];
  initializedCount: number;
  failedCount: number;
  errors: Record<string, string>;
}

/**
 * Find all children with empty child_progress and initialize them.
 * Idempotent — safe to run multiple times.
 * Returns detailed results for verification.
 */
export async function backfillMissingChildProgress(): Promise<BackfillResult> {
  try {
    const supabase = await createClient();

    // Step 1: Find all children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allChildren, error: childrenError } = await (supabase as any)
      .from("children")
      .select("id")
      .order("created_at", { ascending: true });

    if (childrenError) {
      throw new Error(`Failed to fetch children: ${childrenError.message}`);
    }

    const childIds = (allChildren || []).map((c: any) => c.id);
    console.log(`[Backfill] Found ${childIds.length} children total`);

    // Step 2: For each child, check if they have progress
    const childrenWithoutProgress: string[] = [];
    const errors: Record<string, string> = {};

    for (const childId of childIds) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: progress, error: progressError } = await (supabase as any)
          .from("child_progress")
          .select("id", { count: "exact", head: true })
          .eq("child_id", childId)
          .limit(1);

        if (progressError) {
          errors[childId] = `Failed to check progress: ${progressError.message}`;
          continue;
        }

        // If no progress exists, mark for initialization
        if (!progress || progress.length === 0) {
          childrenWithoutProgress.push(childId);
        }
      } catch (err) {
        errors[childId] = err instanceof Error ? err.message : "Unknown error";
      }
    }

    console.log(
      `[Backfill] Found ${childrenWithoutProgress.length} children without progress`
    );

    // Step 3: Initialize progress for children without it
    let initializedCount = 0;
    for (const childId of childrenWithoutProgress) {
      try {
        const result = await initializeChildProgress(childId);
        if (result.success) {
          initializedCount++;
          console.log(`[Backfill] ✓ Initialized progress for child ${childId}`);
        } else {
          errors[childId] = result.error || "Unknown initialization error";
          console.warn(`[Backfill] ✗ Failed to initialize child ${childId}`);
        }
      } catch (err) {
        errors[childId] = err instanceof Error ? err.message : "Unknown error";
        console.error(
          `[Backfill] ✗ Exception initializing child ${childId}:`,
          err
        );
      }
    }

    const failedCount = childrenWithoutProgress.length - initializedCount;

    console.log(
      `[Backfill] Complete: ${initializedCount} initialized, ${failedCount} failed`
    );

    return {
      success: failedCount === 0,
      childrenWithoutProgress,
      initializedCount,
      failedCount,
      errors: Object.keys(errors).length > 0 ? errors : {},
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Backfill] Fatal error:", message);
    return {
      success: false,
      childrenWithoutProgress: [],
      initializedCount: 0,
      failedCount: 0,
      errors: { _fatal: message },
    };
  }
}

/**
 * Preview which children would be initialized without actually doing it.
 * Use this to verify before running the full backfill.
 */
export async function previewMissingChildProgress(): Promise<{
  success: boolean;
  childrenWithoutProgress: string[];
  totalChildren: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get all children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allChildren, error: childrenError } = await (supabase as any)
      .from("children")
      .select("id");

    if (childrenError) {
      throw new Error(`Failed to fetch children: ${childrenError.message}`);
    }

    const totalChildren = (allChildren || []).length;
    const childrenWithoutProgress: string[] = [];

    // Check each child
    for (const child of allChildren || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: progress, error: progressError } = await (supabase as any)
        .from("child_progress")
        .select("id", { count: "exact", head: true })
        .eq("child_id", child.id)
        .limit(1);

      if (!progressError && (!progress || progress.length === 0)) {
        childrenWithoutProgress.push(child.id);
      }
    }

    return {
      success: true,
      totalChildren,
      childrenWithoutProgress,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      totalChildren: 0,
      childrenWithoutProgress: [],
      error: message,
    };
  }
}
