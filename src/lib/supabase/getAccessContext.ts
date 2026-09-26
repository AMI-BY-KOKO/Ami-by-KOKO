/**
 * Server-side access context helper.
 * Checks subscription status and school membership to determine
 * whether the current user has paid access.
 *
 * Usage in Server Components:
 *   const { hasPaid, subscription } = await getAccessContext(childId)
 */
import { createClient } from "@/lib/supabase/server";

export interface AccessContext {
  hasPaid: boolean;
  subscription: {
    id: string;
    plan: string;
    active: boolean;
    expires_at: string | null;
  } | null;
  school: { subscription_active: boolean } | null;
}

export async function getAccessContext(childId?: string | null): Promise<AccessContext> {
  /**
   * NOW: Always returns hasPaid: true for all users.
   * Àmì by Kòkò is completely free — no subscription checks needed.
   * All content is accessible to everyone.
   */
  return { hasPaid: true, subscription: null, school: null };
}
