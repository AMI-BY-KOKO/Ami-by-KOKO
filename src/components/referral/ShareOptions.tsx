/**
 * Share Options Component
 * WhatsApp, native share, and copy buttons
 */

'use client';

import { MessageCircle, Share2, Copy, Mail } from 'lucide-react';
import { getShareUrls } from '@/lib/referral/client-cookies';

interface ShareOptionsProps {
  referralLink: string;
  onCopied?: () => void;
}

export function ShareOptions({ referralLink, onCopied }: ShareOptionsProps) {
  const shareMessage = `Hello! I'm inviting you to discover Àmì by Kòkò, a fun African-inspired learning platform where children can Learn, Sing and Grow.\n\nJoin us here:\n${referralLink}\n\nLet's make learning exciting for our children!`;

  const shareUrls = getShareUrls(referralLink, shareMessage);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Àmì by Kòkò',
          text: shareMessage,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      onCopied?.();
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-navy font-display">Share Your Link</h2>

      {/* WhatsApp Share */}
      <button
        onClick={() => openLink(shareUrls.whatsapp)}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-4 px-4 rounded-2xl transition active:scale-95 min-h-[48px]"
      >
        <MessageCircle size={24} />
        <span>Share on WhatsApp</span>
      </button>

      {/* Email Share */}
      <button
        onClick={() => openLink(shareUrls.email)}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-2xl transition active:scale-95 min-h-[48px]"
      >
        <Mail size={24} />
        <span>Share via Email</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-4 rounded-2xl transition active:scale-95 min-h-[48px]"
      >
        <Copy size={24} />
        <span>Copy Link</span>
      </button>

      {/* Native Share (if supported) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-accent-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 text-navy font-bold py-4 px-4 rounded-2xl transition active:scale-95 min-h-[48px]"
        >
          <Share2 size={24} />
          <span>More Options</span>
        </button>
      )}

      {/* Info text */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <span className="font-semibold">Tip:</span> When families sign up using your link, they'll automatically be linked to you. You'll see their registration appear below!
        </p>
      </div>
    </div>
  );
}
