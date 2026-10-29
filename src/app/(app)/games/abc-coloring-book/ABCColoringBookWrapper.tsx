'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the coloring book component to avoid SSR issues
const ABCColoringBookGame = dynamic(() => import('./ABCColoringBookGame').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <main className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-cream-bg via-yellow-50 to-cream-bg">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🎨</div>
        <p className="text-lg font-semibold text-navy-body">Preparing your coloring adventure...</p>
      </div>
    </main>
  ),
});

interface ABCColoringBookWrapperProps {
  childId: string;
}

export default function ABCColoringBookWrapper({ childId }: ABCColoringBookWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ABCColoringBookGame childId={childId} />;
}
