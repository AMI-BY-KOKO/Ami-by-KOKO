/**
 * Progress Visualization
 * Shows referral milestone progress with encouraging visuals
 */

'use client';

interface ProgressVisualizationProps {
  current: number;
  milestone?: number;
}

export function ProgressVisualization({ current, milestone = 10 }: ProgressVisualizationProps) {
  const percentage = Math.min((current / milestone) * 100, 100);
  const nextMilestone = Math.ceil((current + 1) / 5) * 5; // Next multiple of 5

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-navy font-display">Your Progress</h2>

      {/* Main progress bar */}
      <div className="bg-white rounded-2xl p-6 border border-border-warm shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-navy-muted">
            Milestone: {nextMilestone} Referrals
          </span>
          <span className="text-2xl font-bold text-primary-green">
            {current} / {nextMilestone}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary-green via-emerald-400 to-primary-green rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / nextMilestone) * 100}%` }}
          />
        </div>

        {/* Milestone badges */}
        <div className="flex justify-between text-xs">
          {[5, 10, 15, 20].map((milestone, idx) => {
            const isReached = current >= milestone;
            return (
              <div key={milestone} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isReached
                      ? 'bg-primary-green text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {milestone}
                </div>
                {isReached && (
                  <span className="text-primary-green font-bold">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement message */}
      <div className="bg-gradient-to-r from-accent-yellow/20 to-coral/20 rounded-2xl p-4 border border-accent-yellow/30">
        {current === 0 ? (
          <p className="text-sm text-navy">
            🎯 <span className="font-semibold">Ready to start?</span> Share your referral link to invite families and earn rewards together!
          </p>
        ) : current < 5 ? (
          <p className="text-sm text-navy">
            🚀 <span className="font-semibold">Great start!</span> Keep sharing to reach your first milestone of 5 referrals!
          </p>
        ) : current < 10 ? (
          <p className="text-sm text-navy">
            ⭐ <span className="font-semibold">Awesome progress!</span> You're halfway to 10 referrals — keep it up!
          </p>
        ) : current < 20 ? (
          <p className="text-sm text-navy">
            🌟 <span className="font-semibold">Superstar referrer!</span> You're an Àmì ambassador! Share more to reach 20!
          </p>
        ) : (
          <p className="text-sm text-navy">
            👑 <span className="font-semibold">You're a legend!</span> Your dedication is inspiring families everywhere!
          </p>
        )}
      </div>
    </div>
  );
}
