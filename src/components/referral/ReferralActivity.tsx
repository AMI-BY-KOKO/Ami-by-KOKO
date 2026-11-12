/**
 * Referral Activity List
 * Shows successful registrations with privacy-safe information
 */

'use client';

import { formatDistanceToNow } from 'date-fns';
import type { ReferralListItem } from '@/lib/referral/stats';

interface ReferralActivityProps {
  referrals: ReferralListItem[];
  isLoading?: boolean;
}

export function ReferralActivity({ referrals, isLoading }: ReferralActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy font-display">Referral Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl h-16"
            />
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            ✓ Confirmed
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-semibold">
            ✓ Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
            ⏳ Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-navy font-display">Referral Activity</h2>

      {referrals.length === 0 ? (
        <div className="text-center py-12 bg-cream-bg rounded-2xl border-2 border-dashed border-border-warm">
          <p className="text-navy-muted text-lg">
            No referrals yet. Share your link to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {referrals.map((referral) => (
            <div
              key={referral.referralEventId}
              className="bg-white rounded-xl border border-border-warm p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👤</span>
                    <span className="font-semibold text-navy">
                      Family Member
                    </span>
                  </div>
                  <p className="text-sm text-navy-muted">
                    Joined{' '}
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(referral.referredAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(referral.status)}
                </div>
              </div>

              {/* Fraud score indicator (if high) */}
              {referral.fraudScore > 50 && (
                <div className="mt-3 pt-3 border-t border-border-warm">
                  <p className="text-xs text-amber-700">
                    ⚠️ This referral is pending verification
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Privacy notice */}
      <div className="text-xs text-navy-muted bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p>
          🔒 <span className="font-semibold">Privacy:</span> We only show anonymized registration information. Email addresses and personal details are never shared.
        </p>
      </div>
    </div>
  );
}
