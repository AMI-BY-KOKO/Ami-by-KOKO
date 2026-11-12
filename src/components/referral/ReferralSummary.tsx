/**
 * Referral Summary Card
 * Shows key metrics: total referrals, leaderboard position, code, and link
 */

'use client';

import { Copy, Share2, Trophy } from 'lucide-react';
import type { ReferralStats } from '@/lib/referral/stats';

interface ReferralSummaryProps {
  stats: ReferralStats | null;
  code: string;
  leaderboardRank: number | null;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onShare: () => void;
}

export function ReferralSummary({
  stats,
  code,
  leaderboardRank,
  onCopyCode,
  onCopyLink,
  onShare,
}: ReferralSummaryProps) {
  const activeSubscriptions = stats?.activeSubscriptions || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-navy font-display mb-2">
          Your Referral Dashboard
        </h1>
        <p className="text-navy-body text-lg">
          Invite families and earn rewards together
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Referrals Card */}
        <div className="bg-gradient-to-br from-accent-yellow via-amber-50 to-cream-bg rounded-2xl p-6 border-2 border-accent-yellow/30 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-navy-muted font-semibold text-sm uppercase tracking-wide">
                Active Referrals
              </p>
              <p className="text-4xl font-bold text-navy mt-2">{activeSubscriptions}</p>
              <p className="text-navy-muted text-sm mt-1">
                Families joined through you
              </p>
            </div>
            <div className="text-accent-yellow text-3xl">
              🎉
            </div>
          </div>
        </div>

        {/* Leaderboard Rank Card */}
        <div className="bg-gradient-to-br from-primary-green via-emerald-50 to-cream-bg rounded-2xl p-6 border-2 border-primary-green/30 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-navy-muted font-semibold text-sm uppercase tracking-wide">
                Leaderboard Rank
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                {leaderboardRank ? (
                  <>
                    <p className="text-4xl font-bold text-primary-green">#{leaderboardRank}</p>
                    {leaderboardRank <= 3 && (
                      <span className="text-2xl">
                        {leaderboardRank === 1 ? '🥇' : leaderboardRank === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-2xl font-semibold text-navy-muted">Soon!</p>
                )}
              </div>
              <p className="text-navy-muted text-sm mt-1">
                {leaderboardRank ? 'Keep going to climb higher!' : 'Invite someone to get ranked'}
              </p>
            </div>
            <Trophy className="text-primary-green text-3xl opacity-20" />
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-br from-cat-purple via-purple-50 to-cream-bg rounded-2xl p-6 border-2 border-cat-purple/30 shadow-sm">
          <p className="text-navy-muted font-semibold text-sm uppercase tracking-wide">
            Your Referral Code
          </p>
          <div className="mt-4">
            <div className="bg-white rounded-xl p-4 border-2 border-cat-purple/20 flex items-center justify-between gap-3">
              <code className="font-mono font-bold text-2xl text-cat-purple tracking-widest">
                {code}
              </code>
              <button
                onClick={onCopyCode}
                className="p-2 hover:bg-purple-100 rounded-lg transition text-cat-purple"
                aria-label="Copy code"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="text-navy-muted text-xs mt-2">
              Share this code with families
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onCopyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-accent-yellow hover:bg-[#F5B800] text-navy font-bold py-3 px-4 rounded-full transition active:scale-95 min-h-[48px]"
        >
          <Copy size={20} />
          Copy Link
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 bg-primary-green hover:bg-green-hover text-white font-bold py-3 px-4 rounded-full transition active:scale-95 min-h-[48px]"
        >
          <Share2 size={20} />
          Share
        </button>
      </div>
    </div>
  );
}
