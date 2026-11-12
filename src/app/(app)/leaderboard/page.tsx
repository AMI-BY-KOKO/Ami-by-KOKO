/**
 * Global Leaderboard Page
 * Display all-time and monthly referral leaderboards
 */

import { Trophy } from 'lucide-react';
import LeaderboardClient from '@/components/referral/LeaderboardClient';

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-cream-bg px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-accent-yellow" size={36} />
            <h1 className="text-3xl md:text-4xl font-bold text-navy font-display">
              Referral Leaderboard
            </h1>
          </div>
          <p className="text-navy-body text-lg">
            Celebrate our top referrers bringing Àmì by Kòkò to families
          </p>
        </div>

        {/* Client Component for interactive leaderboard */}
        <LeaderboardClient />

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How it works */}
          <div className="bg-blue-50 rounded-2xl border-l-4 border-blue-400 p-6">
            <h3 className="font-bold text-blue-900 mb-3">📊 How Rankings Work</h3>
            <ul className="space-y-2 text-sm text-blue-900">
              <li>✓ Rankings based on active referral subscriptions</li>
              <li>✓ Tie-breaker: earliest referral first</li>
              <li>✓ All-Time: cumulative from account creation</li>
              <li>✓ Monthly: referrals started in selected month</li>
            </ul>
          </div>

          {/* Privacy info */}
          <div className="bg-purple-50 rounded-2xl border-l-4 border-cat-purple p-6">
            <h3 className="font-bold text-purple-900 mb-3">🔒 Privacy Info</h3>
            <ul className="space-y-2 text-sm text-purple-900">
              <li>✓ Opt-out anytime—referrals still count</li>
              <li>✓ Custom name or use your full name</li>
              <li>✓ Your choice doesn't affect rewards</li>
              <li>✓ All data encrypted and secure</li>
            </ul>
          </div>
        </div>

        {/* Footer message */}
        <div className="text-center py-8 text-navy-muted border-t border-border-warm">
          <p className="text-sm">
            💚 Every referral helps families discover the joy of learning with Àmì by Kòkò!
          </p>
          <p className="text-xs mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
