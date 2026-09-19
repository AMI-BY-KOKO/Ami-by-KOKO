/**
 * useXP Hook
 * Reads child's current XP and level from child_profiles (real-time via Supabase)
 * Updates whenever the active child changes or when XP is awarded.
 *
 * Usage:
 *   const { level, xpTotal, loading } = useXP();
 */

"use client";

import { useEffect, useState } from "react";
import { useChild } from "@/hooks/useChild";
import { createClient } from "@/lib/supabase/client";

interface XPData {
  level: number;
  xpTotal: number;
  loading: boolean;
  error: string | null;
  activeChildId: string | null;
}

export function useXP(): XPData {
  const supabase = createClient();
  const { activeChild } = useChild();
  const [xpData, setXpData] = useState<XPData>({
    level: 1,
    xpTotal: 0,
    loading: true,
    error: null,
    activeChildId: null,
  });

  useEffect(() => {
    if (!activeChild) {
      setXpData(prev => ({ ...prev, loading: false }));
      return;
    }

    setXpData(prev => ({ ...prev, loading: true }));

    // Subscribe to real-time updates on child_profiles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = (supabase as any)
      .from("child_profiles")
      .on(
        "UPDATE",
        { new_row: { id: activeChild.id } },
        (payload: any) => {
          setXpData({
            level: payload.new.current_level,
            xpTotal: payload.new.xp_total,
            loading: false,
            error: null,
            activeChildId: activeChild.id,
          });
        }
      )
      .subscribe();

    // Initial fetch
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("child_profiles")
          .select("current_level, xp_total")
          .eq("id", activeChild.id)
          .single();

        if (error) throw error;

        setXpData({
          level: data?.current_level ?? 1,
          xpTotal: data?.xp_total ?? 0,
          loading: false,
          error: null,
          activeChildId: activeChild.id,
        });
      } catch (err) {
        console.error("[useXP] Failed to fetch XP data:", err);
        setXpData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    })();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChild, supabase]);

  return xpData;
}
