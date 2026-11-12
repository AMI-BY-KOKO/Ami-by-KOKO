/**
 * Champions Podium Component
 * Display top 3 referrers with podium styling
 */

'use client';

import { Trophy, Medal } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/referral/leaderboard';

interface ChampionsPodiumProps {
  champions: LeaderboardEntry[];
  isLoading?: boolean;
}

export function ChampionsPodium({ champions, isLoading = false }: ChampionsPodiumProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!champions || champions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-cream-bg to-amber-50 rounded-2xl p-8 border-2 border-dashed border-accent-yellow text-center">
        <Trophy className="mx-auto text-accent-yellow opacity-30 mb-4" size={48} />
        <p className="text-navy-muted font-semibold">
          No champions yet. Start referring to get on the podium!
        </p>
      </div>
    );
  }

  // Ensure we have at least the ranks we're displaying
  const first = champions[0];
  const second = champions[1];
  const third = champions[2];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Trophy className="text-accent-yellow" size={32} />
        <h2 className="text-2xl font-bold text-navy font-display">Top Referrers</h2>
      </div>

      {/* Podium Layout */}
      <div className="flex items-flex-end justify-center gap-4 h-80 relative">
        {/* Silver (2nd) - Left */}
        {second && (
          <div className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="w-full bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 rounded-t-3xl rounded-b-xl p-6 shadow-lg border-4 border-slate-400 flex flex-col items-center justify-between h-56">
              <div className="text-5xl">🥈</div>
              <div className="text-center">
                <p className="font-bold text-navy truncate px-2 max-w-[150px]">
                  {second.publicDisplayName || second.fullName}
                </p>
                <p className="text-3xl font-bold text-slate-700 mt-2">
                  {second.activeReferrals}
                </p>
                <p className="text-xs text-slate-600">referrals</p>
              </div>
              <div className="text-2xl font-bold text-slate-700">#2</div>
            </div>
          </div>
        )}

        {/* Gold (1st) - Center */}
        {first && (
          <div className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="w-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 rounded-t-3xl rounded-b-xl p-6 shadow-2xl border-4 border-yellow-500 flex flex-col items-center justify-between h-80 ring-4 ring-accent-yellow/20">
              <div className="text-6xl animate-bounce">🥇</div>
              <div className="text-center">
                <p className="font-bold text-navy truncate px-2 max-w-[150px] text-lg">
                  {first.publicDisplayName || first.fullName}
                </p>
                <p className="text-4xl font-bold text-yellow-800 mt-2">
                  {first.activeReferrals}
                </p>
                <p className="text-sm text-yellow-800 font-semibold">referrals</p>
              </div>
              <div className="text-3xl font-bold text-yellow-800">#1</div>
            </div>
          </div>
        )}

        {/* Bronze (3rd) - Right */}
        {third && (
          <div className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="w-full bg-gradient-to-br from-orange-300 via-orange-200 to-orange-400 rounded-t-3xl rounded-b-xl p-6 shadow-lg border-4 border-orange-500 flex flex-col items-center justify-between h-48">
              <div className="text-5xl">🥉</div>
              <div className="text-center">
                <p className="font-bold text-navy truncate px-2 max-w-[150px]">
                  {third.publicDisplayName || third.fullName}
                </p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {third.activeReferrals}
                </p>
                <p className="text-xs text-orange-700">referrals</p>
              </div>
              <div className="text-2xl font-bold text-orange-700">#3</div>
            </div>
          </div>
        )}
      </div>

      {/* Celebration message */}
      <div className="text-center mt-12">
        <p className="text-sm text-navy-muted font-semibold">
          ✨ Celebrating our top referrers making Àmì by Kòkò accessible to more families!
        </p>
      </div>
    </div>
  );
}
