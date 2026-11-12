/**
 * LeaderboardClient Component
 * Interactive leaderboard display with data fetching via Server Actions
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getCurrentMonth,
  type LeaderboardEntry,
  type UserLeaderboardPosition,
} from '@/lib/referral/leaderboard';
import {
  getLeaderboardDataAction,
  getUserLeaderboardDataAction,
} from '@/lib/referral/leaderboard.actions';
import { ChampionsPodium } from './ChampionsPodium';
import { LeaderboardTable } from './LeaderboardTable';
import { MonthSelector } from './MonthSelector';
import { PrivacyToggle } from './PrivacyToggle';

export default function LeaderboardClient() {
  const supabase = createClient();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userFullName, setUserFullName] = useState<string>('');
  const [userShowOnLeaderboard, setUserShowOnLeaderboard] = useState(true);
  const [userPublicDisplayName, setUserPublicDisplayName] = useState<
    string | null
  >(null);

  // Leaderboard data
  const [champions, setChampions] = useState<LeaderboardEntry[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<
    LeaderboardEntry[]
  >([]);
  const [userPosition, setUserPosition] = useState<UserLeaderboardPosition | null>(
    null
  );

  // Filters
  const [period, setPeriod] = useState<'all_time' | 'monthly'>('all_time');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  // Refresh flag for privacy toggle
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [period, selectedYear, selectedMonth, refreshKey]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // Fetch user profile info
      const { data: profile } = await (supabase
        .from('profiles')
        .select('full_name, show_on_leaderboard, public_display_name')
        .eq('id', user.id)
        .single() as any);

      if (profile) {
        setUserFullName(profile.full_name || 'Family');
        setUserShowOnLeaderboard(profile.show_on_leaderboard ?? true);
        setUserPublicDisplayName(profile.public_display_name);
      }

      // Load leaderboard data via Server Action
      if (period === 'all_time') {
        const data = await getLeaderboardDataAction('all_time');
        if (data.error) {
          setError(data.error);
        } else {
          setChampions(data.champions || []);
          setLeaderboardEntries(data.entries || []);
        }
      } else {
        const year = selectedYear || getCurrentMonth().year;
        const month = selectedMonth || getCurrentMonth().month;
        const data = await getLeaderboardDataAction('monthly', year, month);
        if (data.error) {
          setError(data.error);
        } else {
          setChampions(data.champions || []);
          setLeaderboardEntries(data.entries || []);
        }
      }

      // Get user's position via Server Action
      const userPos = await getUserLeaderboardDataAction(
        user.id,
        period,
        selectedYear || getCurrentMonth().year,
        selectedMonth || getCurrentMonth().month
      );
      if (userPos.data) {
        setUserPosition(userPos.data);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleMonthChange = (year: number, month: number, label: string) => {
    if (year === 0 && month === 0) {
      setPeriod('all_time');
      setSelectedYear(0);
      setSelectedMonth(0);
    } else {
      setPeriod('monthly');
      setSelectedYear(year);
      setSelectedMonth(month);
    }
  };

  const handlePrivacyUpdate = (success: boolean) => {
    if (success) {
      // Refresh data to show updated privacy settings
      setRefreshKey((k) => k + 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-40" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <h2 className="text-lg font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Two-column layout: Podium + Filters / Full table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Podium & Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Champions Podium */}
          <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm">
            <ChampionsPodium champions={champions} isLoading={loading} />
          </div>

          {/* Month/Period Selector */}
          <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm">
            <MonthSelector
              onMonthChange={handleMonthChange}
              defaultPeriod={period}
            />
          </div>
        </div>

        {/* Right column: Full Leaderboard Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm">
            <LeaderboardTable
              entries={leaderboardEntries}
              currentUserId={currentUserId}
              isLoading={loading}
              itemsPerPage={10}
              title={
                period === 'all_time'
                  ? '🏆 All-Time Rankings'
                  : '📅 Monthly Rankings'
              }
            />
          </div>
        </div>
      </div>

      {/* Your Position Banner */}
      {userPosition && (
        <div className="bg-gradient-to-r from-primary-green/10 to-emerald-50 rounded-2xl border-2 border-primary-green/30 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-primary-green font-semibold uppercase tracking-wide">
                Your Current Rank
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-primary-green">
                  #{userPosition.rank}
                </p>
                <p className="text-lg text-primary-green">
                  {userPosition.activeReferrals} active referrals
                </p>
              </div>
            </div>
            <div className="text-4xl">
              {userPosition.rank === 1
                ? '🥇'
                : userPosition.rank === 2
                  ? '🥈'
                  : userPosition.rank === 3
                    ? '🥉'
                    : '⭐'}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-navy font-display">
          Your Privacy
        </h2>
        <PrivacyToggle
          profileId={currentUserId}
          initialShowOnLeaderboard={userShowOnLeaderboard}
          initialDisplayName={userPublicDisplayName}
          fullName={userFullName}
          onUpdate={handlePrivacyUpdate}
        />
      </div>
    </div>
  );
}
