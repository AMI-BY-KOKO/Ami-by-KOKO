/**
 * Leaderboard Table Component
 * Paginated table of leaderboard entries with current user always visible
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LeaderboardEntryRow } from './LeaderboardEntry';
import type { LeaderboardEntry } from '@/lib/referral/leaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
  itemsPerPage?: number;
  title?: string;
}

export function LeaderboardTable({
  entries,
  currentUserId,
  isLoading = false,
  itemsPerPage = 10,
  title = 'Full Leaderboard',
}: LeaderboardTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayEntries, setDisplayEntries] = useState<LeaderboardEntry[]>([]);

  // Recalculate displayed entries when entries or page changes
  useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    // Get current page entries
    const pageEntries = entries.slice(startIdx, endIdx);

    // Check if current user is in the visible list
    const userInList = pageEntries.some((e) => e.profileId === currentUserId);

    if (userInList || !currentUserId) {
      setDisplayEntries(pageEntries);
    } else {
      // If user not in current page, show current page but add user at bottom
      const userEntry = entries.find((e) => e.profileId === currentUserId);
      if (userEntry) {
        // Remove the last item to make room for user
        setDisplayEntries([...pageEntries.slice(0, -1), userEntry]);
      } else {
        setDisplayEntries(pageEntries);
      }
    }
  }, [entries, currentPage, itemsPerPage, currentUserId]);

  const totalPages = Math.ceil(entries.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 bg-cream-bg rounded-2xl border-2 border-dashed border-navy-muted/20">
        <p className="text-navy-muted font-semibold">
          No referrals yet. Start inviting families to appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-navy font-display">
        {title}
      </h2>

      {/* Entries */}
      <div className="space-y-3">
        {displayEntries.map((entry) => (
          <LeaderboardEntryRow
            key={entry.profileId}
            entry={entry}
            isCurrentUser={entry.profileId === currentUserId}
            showRank
          />
        ))}
      </div>

      {/* Info about user position */}
      {currentUserId && !displayEntries.some((e) => e.profileId === currentUserId) && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Your Position:</span> Your rank appears below the current page to always keep you visible.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border-warm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy/5 hover:bg-navy/10 disabled:opacity-50 disabled:cursor-not-allowed text-navy font-semibold transition"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Page indicators */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    w-10 h-10 rounded-lg font-bold transition
                    ${
                      currentPage === pageNum
                        ? 'bg-primary-green text-white'
                        : 'bg-gray-100 text-navy hover:bg-gray-200'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy/5 hover:bg-navy/10 disabled:opacity-50 disabled:cursor-not-allowed text-navy font-semibold transition"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Page info */}
      <div className="text-center text-sm text-navy-muted">
        <p>
          Page {currentPage} of {totalPages}
          {currentUserId && ` • ${entries.length} total referrers`}
        </p>
      </div>
    </div>
  );
}
