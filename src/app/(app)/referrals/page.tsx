/**
 * Referral Dashboard Page
 * Main page for users to view and share their referral code
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentReferralLink } from '@/lib/referral/client-cookies';
import {
  getReferralsByProfile,
  getTopReferrers,
  type ReferralListItem,
  type LeaderboardEntry,
  type ReferralStats,
} from '@/lib/referral/stats-client';
import { ReferralSummary } from '@/components/referral/ReferralSummary';
import { ShareOptions } from '@/components/referral/ShareOptions';
import { ReferralActivity } from '@/components/referral/ReferralActivity';
import { ProgressVisualization } from '@/components/referral/ProgressVisualization';
import { EmptyState } from '@/components/referral/EmptyState';

export default function ReferralsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [code, setCode] = useState<string>('');
  const [referrals, setReferrals] = useState<ReferralListItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

      // Fetch referral code and stats
      const response = await fetch('/api/referral/get-code');
      if (!response.ok) {
        throw new Error('Failed to fetch referral code');
      }

      const codeData = await response.json();
      if (codeData.success && codeData.code) {
        setCode(codeData.code);
      }
      if (codeData.stats) {
        setStats(codeData.stats);
      }

      // Fetch referrals for this user
      const referralsData = await getReferralsByProfile(50);
      setReferrals(referralsData);

      // Fetch leaderboard and find rank
      const leaderboardData = await getTopReferrers(100);
      setLeaderboard(leaderboardData);

      const userRank = leaderboardData.find((entry) => entry.profileId === user.id)?.rank;
      setLeaderboardRank(userRank || null);
    } catch (err) {
      console.error('Error loading referral data:', err);
      setError('Failed to load referral dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const referralLink = code ? getCurrentReferralLink(code) : '';

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-cream-bg px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {/* Skeleton loaders */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-40" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-cream-bg px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </main>
    );
  }

  // Empty state
  if (!code || referrals.length === 0) {
    return (
      <main className="min-h-screen bg-cream-bg px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <EmptyState onShareClick={() => setShowShareMenu(true)} />

          {/* Share menu below empty state */}
          {showShareMenu && code && (
            <div className="mt-8 max-w-2xl mx-auto">
              <ShareOptions
                referralLink={referralLink}
                onCopied={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              />
            </div>
          )}
        </div>
      </main>
    );
  }

  // Main dashboard layout
  return (
    <main className="min-h-screen bg-cream-bg px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header and Summary */}
        <ReferralSummary
          stats={stats}
          code={code}
          leaderboardRank={leaderboardRank}
          onCopyCode={handleCopyCode}
          onCopyLink={handleCopyLink}
          onShare={handleShare}
        />

        {/* Copied notification */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce">
            ✓ Copied to clipboard!
          </div>
        )}

        {/* Share menu */}
        {showShareMenu && (
          <div className="bg-white rounded-2xl border-2 border-primary-green/20 p-6 shadow-sm">
            <ShareOptions
              referralLink={referralLink}
              onCopied={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>
        )}

        {/* Two-column layout: Progress + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress */}
          <div className="lg:col-span-1">
            <ProgressVisualization current={stats?.activeSubscriptions || 0} />
          </div>

          {/* Activity List */}
          <div className="lg:col-span-2">
            <ReferralActivity referrals={referrals} isLoading={false} />
          </div>
        </div>

        {/* Leaderboard Preview */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm">
            <h2 className="text-xl font-bold text-navy font-display mb-4">
              🏆 Top Referrers This Month
            </h2>

            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={entry.profileId}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    entry.profileId === stats?.profileId
                      ? 'bg-primary-green/10 border-2 border-primary-green'
                      : 'bg-gray-50 border border-border-warm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-navy-muted w-8 text-center">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </span>
                    <span className="font-semibold text-navy">{entry.fullName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-green">
                      {entry.activeSubscriptions}
                    </p>
                    <p className="text-xs text-navy-muted">referrals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer message */}
        <div className="text-center py-8 text-navy-muted">
          <p className="text-sm">
            💚 Thank you for helping families discover the joy of learning with Àmì by Kòkò!
          </p>
        </div>
      </div>
    </main>
  );
}
