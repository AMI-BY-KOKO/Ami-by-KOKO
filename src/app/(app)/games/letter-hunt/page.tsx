'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LetterHuntWrapper from './LetterHuntWrapper';

export default function LetterHuntPage() {
  const supabase = createClient();
  const [childId, setChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getChild() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Try to get child_id from user metadata or fetch from children table
        let cid = user.user_metadata?.child_id;

        if (!cid) {
          // Fetch first child for this user
          const { data: children, error } = await supabase
            .from('children')
            .select('id')
            .eq('parent_id', user.id)
            .limit(1);

          if (!error && children && children.length > 0) {
            cid = (children[0] as any).id;
          }
        }

        setChildId(cid || null);
      } catch (error) {
        console.error('Error fetching child ID:', error);
      } finally {
        setLoading(false);
      }
    }

    getChild();
  }, [supabase]);

  if (loading) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-[#fffdf5]">
        <div className="text-center">
          <div className="text-6xl mb-4">🦜</div>
          <p className="text-lg font-semibold text-[#173f46]">Kòkò is loading the adventure...</p>
        </div>
      </main>
    );
  }

  if (!childId) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-[#fffdf5]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🦜</div>
          <h1 className="text-2xl font-bold text-[#173f46] mb-2">No child profile found</h1>
          <p className="text-[#507277] mb-6">Please set up a child profile first to play the game.</p>
          <a
            href="/home"
            className="inline-block bg-[#188878] hover:bg-[#0f6259] text-white font-bold py-3 px-6 rounded-2xl transition"
          >
            ← Back to Home
          </a>
        </div>
      </main>
    );
  }

  return <LetterHuntWrapper childId={childId} />;
}
