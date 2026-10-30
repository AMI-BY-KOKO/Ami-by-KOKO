'use client';

import { useEffect, useState } from 'react';

interface ABCColoringBookGameProps {
  childId: string;
}

export default function ABCColoringBookGame({ childId }: ABCColoringBookGameProps) {
  const [iframeReady, setIframeReady] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  // Inject enhanced mobile CSS and swipe gesture support
  useEffect(() => {
    const handleIframeLoad = () => {
      try {
        const iframe = document.querySelector('iframe') as HTMLIFrameElement;
        if (!iframe?.contentDocument) return;

        const doc = iframe.contentDocument;
        
        // Create a style element for mobile enhancements
        const style = doc.createElement('style');
        style.textContent = `
          /* Enhanced mobile navigation */
          @media (max-width: 640px) {
            .topbar {
              min-height: 56px;
              padding: 6px;
              gap: 8px;
            }
            
            .round {
              width: 48px;
              height: 48px;
              min-width: 48px;
            }
            
            .chip {
              min-height: 48px;
              min-width: 48px;
              padding: 0 8px;
            }
            
            .chip .lbl {
              display: inline;
              font-size: 0.75rem;
            }
            
            #pagesBtn2 .lbl {
              display: inline;
              font-weight: 800;
              font-size: 0.85rem;
            }
            
            #prev, #next {
              min-width: 48px;
            }
            
            .app[data-mode="book"] .topbar {
              min-height: 52px;
              padding: 4px;
              gap: 4px;
            }
            
            .app[data-mode="book"] .round {
              width: 44px;
              height: 44px;
              min-width: 44px;
            }
            
            /* Make page selector more prominent */
            #pagesBtn2 {
              background: var(--accent);
              border-color: var(--accent);
              color: var(--accent-fg);
              font-weight: 900;
            }
            
            #pagesBtn2 svg {
              width: 24px;
              height: 24px;
            }
          }
          
          /* Ultra-small screens need extra help */
          @media (max-width: 480px) {
            .topbar {
              min-height: 60px;
              flex-wrap: wrap;
            }
            
            .ttl {
              width: 100%;
              order: -1;
              margin-bottom: 4px;
            }
            
            #pageTitle {
              font-size: 1rem;
            }
            
            #pageNum {
              display: none;
            }
            
            .chip, .round {
              min-height: 44px;
              min-width: 44px;
            }
            
            #menuBtn .lbl,
            #soundBtn .lbl {
              display: none;
            }
            
            #pagesBtn2 {
              flex: 1;
              min-width: 80px;
              background: var(--accent);
              border-color: var(--accent);
              color: var(--accent-fg);
            }
            
            #pagesBtn2 .lbl {
              display: inline;
              font-weight: 900;
              font-size: 0.9rem;
            }
          }
          
          /* Swipe hint for users */
          .bookwrap::after {
            content: "← Swipe to turn pages →";
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75rem;
            color: var(--muted);
            opacity: 0.6;
            pointer-events: none;
            font-family: var(--font-body);
            white-space: nowrap;
            z-index: 15;
          }
          
          @media (min-width: 900px) {
            .bookwrap::after {
              display: none;
            }
          }
        `;
        
        doc.head.appendChild(style);

        // Add swipe gesture detection
        let touchStartX = 0;
        let touchStartY = 0;
        const minSwipeDistance = 50; // pixels

        const bookwrap = doc.getElementById('bookwrap');
        if (bookwrap) {
          bookwrap.addEventListener('touchstart', (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
          }, { passive: true });

          bookwrap.addEventListener('touchend', (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const distanceX = touchStartX - touchEndX;
            const distanceY = touchStartY - touchEndY;
            
            // Only register if horizontal swipe is more significant than vertical
            if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
              // Swipe left - go to next page
              if (distanceX > 0) {
                const nextBtn = doc.getElementById('next') as HTMLButtonElement;
                if (nextBtn && !nextBtn.disabled) {
                  nextBtn.click();
                }
              }
              // Swipe right - go to previous page
              else {
                const prevBtn = doc.getElementById('prev') as HTMLButtonElement;
                if (prevBtn && !prevBtn.disabled) {
                  prevBtn.click();
                }
              }
            }
          }, { passive: true });
        }

        setIframeReady(true);
      } catch (e) {
        // Cross-origin or other errors - that's ok, game still works
      }
    };

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      
      // Try to apply immediately if already loaded
      if (iframe.contentDocument?.readyState === 'complete') {
        handleIframeLoad();
      }
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  return (
    <iframe
      ref={(el) => {
        if (el) {
          el.addEventListener('touchstart', (e) => {
            setTouchStart(e.touches[0].clientX);
          }, { passive: true });
        }
      }}
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
