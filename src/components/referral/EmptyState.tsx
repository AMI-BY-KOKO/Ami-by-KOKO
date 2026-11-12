/**
 * Empty State for Referral Dashboard
 * Encouraging message for users with no referrals yet
 */

'use client';

interface EmptyStateProps {
  onShareClick: () => void;
}

export function EmptyState({ onShareClick }: EmptyStateProps) {
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <div className="w-full max-w-sm text-center space-y-6 py-12">
        {/* Illustration */}
        <div className="text-7xl animate-bounce">
          🌱
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-navy font-display">
            Your Àmì Journey Starts Here!
          </h2>
          <p className="text-lg text-navy-body">
            Share your special link and invite more families to discover the joy of learning with Àmì by Kòkò.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-cream-bg rounded-2xl p-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📱</span>
            <div className="text-left">
              <p className="font-semibold text-navy">Share Easily</p>
              <p className="text-sm text-navy-muted">
                WhatsApp, email, or copy your link
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <div className="text-left">
              <p className="font-semibold text-navy">Invite Families</p>
              <p className="text-sm text-navy-muted">
                Help others discover learning
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <p className="font-semibold text-navy">Climb the Leaderboard</p>
              <p className="text-sm text-navy-muted">
                Track your progress and earn recognition
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onShareClick}
          className="w-full bg-gradient-to-r from-accent-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 text-navy font-bold py-4 px-6 rounded-full transition active:scale-95 text-lg"
        >
          Share My Link Now
        </button>

        {/* Secondary message */}
        <p className="text-sm text-navy-muted">
          💡 Families who sign up through your link will automatically be added to your referrals!
        </p>
      </div>
    </div>
  );
}
