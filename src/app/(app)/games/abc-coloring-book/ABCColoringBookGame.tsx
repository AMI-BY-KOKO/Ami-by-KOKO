'use client';

import { useEffect } from 'react';

interface ABCColoringBookGameProps {
  childId: string;
}

export default function ABCColoringBookGame({ childId }: ABCColoringBookGameProps) {
  useEffect(() => {
    // Full screen mode - use dynamic viewport height for mobile
    const html = document.documentElement;
    const body = document.body;
    
    // Store original values
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlHeight = html.style.height;
    
    html.style.overflow = 'hidden';
    html.style.height = '100dvh';
    body.style.overflow = 'hidden';
    
    return () => {
      html.style.overflow = originalHtmlOverflow;
      html.style.height = originalHtmlHeight;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <iframe
      src="/games/abc-coloring-book.html"
      className="fixed inset-0 border-0 w-full h-full"
      title="ABC Coloring Book - Interactive Coloring Game"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      style={{ 
        width: '100%', 
        height: '100dvh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
}
