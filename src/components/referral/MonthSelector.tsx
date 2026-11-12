/**
 * Month Selector Component
 * Dropdown to filter leaderboard by month/year
 */

'use client';

import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { getAvailableMonths, getCurrentMonth } from '@/lib/referral/leaderboard';

interface MonthSelectorProps {
  onMonthChange: (year: number, month: number, label: string) => void;
  defaultPeriod?: 'all_time' | 'monthly';
}

export function MonthSelector({
  onMonthChange,
  defaultPeriod = 'monthly',
}: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'all_time' | 'monthly'>(
    defaultPeriod
  );
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const current = getCurrentMonth();
    return `${current.year}-${String(current.month).padStart(2, '0')}`;
  });

  const availableMonths = getAvailableMonths();
  const currentSelected = availableMonths.find(
    (m) => `${m.year}-${String(m.month).padStart(2, '0')}` === selectedMonth
  );

  const handleMonthSelect = (year: number, month: number, label: string) => {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    setSelectedMonth(key);
    setIsOpen(false);
    onMonthChange(year, month, label);
  };

  const handlePeriodChange = (period: 'all_time' | 'monthly') => {
    setSelectedPeriod(period);
    if (period === 'all_time') {
      onMonthChange(0, 0, 'All Time');
    } else {
      const current = getCurrentMonth();
      onMonthChange(current.year, current.month, currentSelected?.label || 'This Month');
    }
  };

  return (
    <div className="space-y-4">
      {/* Period Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handlePeriodChange('all_time')}
          className={`
            flex-1 py-2 px-4 rounded-lg font-bold transition text-sm
            ${
              selectedPeriod === 'all_time'
                ? 'bg-primary-green text-white'
                : 'bg-gray-100 text-navy hover:bg-gray-200'
            }
          `}
        >
          All Time
        </button>
        <button
          onClick={() => handlePeriodChange('monthly')}
          className={`
            flex-1 py-2 px-4 rounded-lg font-bold transition text-sm
            ${
              selectedPeriod === 'monthly'
                ? 'bg-primary-green text-white'
                : 'bg-gray-100 text-navy hover:bg-gray-200'
            }
          `}
        >
          Monthly
        </button>
      </div>

      {/* Month Dropdown (only shown when monthly is selected) */}
      {selectedPeriod === 'monthly' && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-navy-muted/20 rounded-lg hover:border-navy-muted/40 transition font-bold text-navy"
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{currentSelected?.label || 'Select Month'}</span>
            </div>
            <ChevronDown
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown Content */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-navy-muted/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {availableMonths.map((m) => (
                  <button
                    key={`${m.year}-${m.month}`}
                    onClick={() => handleMonthSelect(m.year, m.month, m.label)}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-cream-bg transition font-semibold
                      ${
                        selectedMonth === `${m.year}-${String(m.month).padStart(2, '0')}`
                          ? 'bg-primary-green/10 text-primary-green border-l-4 border-primary-green'
                          : 'text-navy border-l-4 border-transparent'
                      }
                    `}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Info text */}
          <p className="text-xs text-navy-muted mt-2">
            📅 Showing rankings for the selected month. Active referrals = subscriptions that started in this period.
          </p>
        </div>
      )}

      {/* All-time info */}
      {selectedPeriod === 'all_time' && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">📊 All Time:</span> Shows cumulative referrals from all time, ranked by total active subscriptions.
          </p>
        </div>
      )}
    </div>
  );
}
