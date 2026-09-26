'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLetterHuntProgress } from '@/hooks/useLetterHuntProgress';

// Dynamically import GameApp to avoid SSR issues with localStorage
const GameApp = dynamic(() => import('./GameApp').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <main className="min-h-[100dvh] flex items-center justify-center bg-[#fffdf5]">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🦜</div>
        <p className="text-lg font-semibold text-[#173f46]">Loading adventure...</p>
      </div>
    </main>
  ),
});

interface LetterHuntWrapperProps {
  childId: string;
}

export default function LetterHuntWrapper({ childId }: LetterHuntWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const supabaseProgress = useLetterHuntProgress(childId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Callback when a level completes - syncs to Supabase
  const handleLevelComplete = async (level: number, finalScore: number) => {
    try {
      const result = await supabaseProgress.completeLevel(level, finalScore);
      if (!result.success) {
        console.error('Failed to save to Supabase:', result.error);
        // But don't block UI - game continues
      }
    } catch (error) {
      console.error('Error completing level:', error);
    }
  };

  if (!mounted) return null;

  return (
    <GameApp
      childId={childId}
      supabaseProgress={supabaseProgress}
      onLevelComplete={handleLevelComplete}
    />
  );
}
