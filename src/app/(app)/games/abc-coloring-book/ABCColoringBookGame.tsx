'use client';

import { useEffect } from 'react';

interface ABCColoringBookGameProps {
  childId: string;
}

export default function ABCColoringBookGame({ childId }: ABCColoringBookGameProps) {
  useEffect(() => {
    // Full screen mode
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <iframe
      src="/games/abc-coloring-book.html"
      className="w-screen h-screen fixed top-0 left-0 border-0"
      title="ABC Coloring Book - Interactive Coloring Game"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
