/**
 * Leaderboard Entry Component
 * Single row for a leaderboard entry
 */

'use client';

import type { LeaderboardEntry } from '@/lib/referral/leaderboard';

interface LeaderboardEntryRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  showRank?: boolean;
}

export function LeaderboardEntryRow({
  entry,
  isCurrentUser = false,
  showRank = true,
}: LeaderboardEntryRowProps) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-100 to-yellow-50 border-yellow-300';
    if (rank === 2) return 'from-slate-100 to-slate-50 border-slate-300';
    if (rank === 3) return 'from-orange-100 to-orange-50 border-orange-300';
    return 'from-gray-50 to-gray-50 border-gray-200';
  };

  const medal = getMedalEmoji(entry.rank);
  const bgColor = getMedalColor(entry.rank);

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl border-2 transition-all
        ${
          isCurrentUser
            ? 'bg-gradient-to-r from-primary-green/10 to-emerald-50 border-primary-green shadow-md'
            : `bg-gradient-to-r ${bgColor}`
        }
      `}
    >
      {/* Rank and Name */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Rank Display */}
        <div className="flex items-center justify-center w-12 flex-shrink-0">
          {medal ? (
            <span className="text-3xl">{medal}</span>
          ) : (
            <span className="text-lg font-bold text-navy-muted w-full text-center">
              #{entry.rank}
            </span>
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-bold truncate max-w-xs ${
              isCurrentUser ? 'text-primary-green' : 'text-navy'
            }`}
          >
            {entry.publicDisplayName || entry.fullName}
          </p>
          {isCurrentUser && (
            <p className="text-xs text-primary-green font-semibold">You</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* Total Attributed (muted) */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-navy-muted">Total</p>
          <p className="text-lg font-bold text-navy-muted">
            {entry.totalAttributed}
          </p>
        </div>

        {/* Active Referrals (primary) */}
        <div className="text-right">
          <p className={`text-xs font-semibold ${
            isCurrentUser ? 'text-primary-green' : 'text-navy-muted'
          }`}>
            Active
          </p>
          <p className={`text-2xl font-bold ${
            isCurrentUser ? 'text-primary-green' : 'text-navy'
          }`}>
            {entry.activeReferrals}
          </p>
        </div>
      </div>
    </div>
  );
}
