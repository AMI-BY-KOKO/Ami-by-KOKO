/**
 * Privacy Toggle Component
 * Allow users to opt-out of leaderboard or set custom display name
 */

'use client';

import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { updateLeaderboardPrivacyAction } from '@/lib/referral/leaderboard.actions';

interface PrivacyToggleProps {
  profileId: string;
  initialShowOnLeaderboard?: boolean;
  initialDisplayName?: string | null;
  fullName?: string;
  onUpdate?: (success: boolean) => void;
}

export function PrivacyToggle({
  profileId,
  initialShowOnLeaderboard = true,
  initialDisplayName = null,
  fullName = 'Family',
  onUpdate,
}: PrivacyToggleProps) {
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(
    initialShowOnLeaderboard
  );
  const [displayName, setDisplayName] = useState(initialDisplayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleToggleVisibility = async () => {
    const newVisibility = !showOnLeaderboard;
    setShowOnLeaderboard(newVisibility);
    await saveSettings(newVisibility, displayName);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSave = async () => {
    if (!displayName.trim() && !showOnLeaderboard) {
      setSaveMessage({
        type: 'error',
        text: 'Cannot hide with empty name. Either show on leaderboard or enter a display name.',
      });
      return;
    }
    await saveSettings(showOnLeaderboard, displayName);
  };

  const saveSettings = async (visible: boolean, name: string) => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const result = await updateLeaderboardPrivacyAction(
        profileId,
        visible,
        name.trim() || null
      );

      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Privacy settings saved successfully!',
        });
        setIsEditing(false);
        onUpdate?.(true);

        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      } else {
        setSaveMessage({
          type: 'error',
          text: result.error || 'Failed to save privacy settings',
        });
      }
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: 'An error occurred while saving. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-cat-purple/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cat-purple/10 flex items-center justify-center">
          <Eye className="text-cat-purple" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-navy font-display">Privacy Settings</h3>
          <p className="text-sm text-navy-muted">
            Control how you appear on the leaderboard
          </p>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={showOnLeaderboard}
            onChange={handleToggleVisibility}
            disabled={isSaving}
            className="w-5 h-5 rounded border-2 border-cat-purple mt-1 cursor-pointer accent-cat-purple"
          />
          <div className="flex-1">
            <p className="font-bold text-navy group-hover:text-cat-purple transition">
              {showOnLeaderboard
                ? '✓ Show me on the leaderboard'
                : '✗ Hide me from the leaderboard'}
            </p>
            <p className="text-sm text-navy-muted">
              {showOnLeaderboard
                ? 'Your referral achievements are visible to the community'
                : 'Your referrals still count, but your name is hidden'}
            </p>
          </div>
        </label>
      </div>

      {/* Display Name Section */}
      {!isEditing ? (
        <div
          className="bg-white rounded-xl p-4 border border-cat-purple/20 cursor-pointer hover:border-cat-purple/40 transition"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-sm text-navy-muted font-semibold mb-1">
            Display Name
          </p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-navy">
              {displayName.trim() || fullName}
            </p>
            <span className="text-sm text-cat-purple font-semibold">Edit</span>
          </div>
          <p className="text-xs text-navy-muted mt-2">
            {displayName.trim()
              ? 'Click to change your display name'
              : 'Using full name. Click to set a custom name'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 bg-white rounded-xl p-4 border-2 border-cat-purple/40">
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              How should we display your name?
            </label>
            <input
              type="text"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder={fullName}
              maxLength={50}
              className="w-full px-4 py-2 rounded-lg border-2 border-cat-purple/20 focus:border-cat-purple focus:outline-none font-semibold text-navy"
            />
            <p className="text-xs text-navy-muted mt-2">
              {displayName.length}/50 characters
            </p>
          </div>

          {/* Save/Cancel buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-primary-green hover:bg-green-hover disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setDisplayName(initialDisplayName || '');
              }}
              disabled={isSaving}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-navy font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {saveMessage && (
        <div
          className={`p-3 rounded-lg text-sm font-semibold ${
            saveMessage.type === 'success'
              ? 'bg-green-100 text-green-900 border border-green-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {saveMessage.type === 'success' ? '✓ ' : '✗ '}
          {saveMessage.text}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">💡 Info:</span> Even if hidden, your
          referrals help families discover Àmì by Kòkò. Your privacy choice
          doesn't affect your rewards.
        </p>
      </div>
    </div>
  );
}
