'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type LetterHuntProgress = any; // Will be typed once DB is updated

export function useLetterHuntProgress(childId: string) {
  const [progress, setProgress] = useState<Record<number, LetterHuntProgress | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch all progress for this child
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('letter_hunt_progress')
        .select('*')
        .eq('child_id', childId);

      if (err) throw err;

      const progressMap: Record<number, LetterHuntProgress | null> = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
      };

      (data || []).forEach((p: any) => {
        progressMap[p.level] = p;
      });

      setProgress(progressMap);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [childId, supabase]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Update level progress when level completes
  const completeLevel = useCallback(
    async (level: number, finalScore: number) => {
      try {
        // Validate inputs
        if (!childId) {
          throw new Error('No child ID available');
        }

        console.log('[useLetterHuntProgress] Completing level:', { level, finalScore, childId });

        // Call RPC to update progress
        const { data: progressData, error: progressErr } = await (supabase as any).rpc(
          'update_level_progress',
          {
            p_child_id: childId,
            p_level: level,
            p_final_score: finalScore,
          }
        );

        if (progressErr) {
          console.error('[useLetterHuntProgress] update_level_progress failed:', {
            code: progressErr.code,
            message: progressErr.message,
            details: progressErr.details,
            hint: progressErr.hint,
          });
          throw progressErr;
        }

        console.log('[useLetterHuntProgress] Progress updated:', progressData);

        // Award XP
        const { data: xpData, error: xpErr } = await (supabase as any).rpc(
          'award_letter_hunt_xp',
          {
            p_child_id: childId,
            p_level: level,
            p_final_score: finalScore,
          }
        );

        if (xpErr) {
          console.error('[useLetterHuntProgress] award_letter_hunt_xp failed:', {
            code: xpErr.code,
            message: xpErr.message,
            details: xpErr.details,
            hint: xpErr.hint,
          });
          throw xpErr;
        }

        console.log('[useLetterHuntProgress] XP awarded:', xpData);

        // Refresh local progress
        await fetchProgress();

        console.log('[useLetterHuntProgress] Level completed successfully');
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to complete level';
        console.error('[useLetterHuntProgress] completeLevel error:', errorMsg, err);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [childId, supabase, fetchProgress]
  );

  // Check if level is complete
  const isLevelComplete = useCallback((level: number) => {
    return progress[level as keyof typeof progress]?.is_complete ?? false;
  }, [progress]);

  // Check if level is unlocked (previous level complete or is level 1)
  const isLevelUnlocked = useCallback((level: number) => {
    if (level === 1) return true;
    return isLevelComplete(level - 1);
  }, [isLevelComplete]);

  // Get current score for a level
  const getLevelScore = useCallback((level: number) => {
    return progress[level as keyof typeof progress]?.current_score ?? 0;
  }, [progress]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    completeLevel,
    isLevelComplete,
    isLevelUnlocked,
    getLevelScore,
  };
}
