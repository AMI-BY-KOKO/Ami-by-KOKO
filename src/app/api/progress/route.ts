/**
 * POST /api/progress
 * Upserts a progress row for a child.
 * Uses service role to bypass RLS for school children
 * (whose parent_id is null, so the browser-client policy blocks writes).
 *
 * Verifies the caller's session before writing.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getClients() {
  const cookieStore = await cookies();
  const anonClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch { /* server component */ }
        },
      },
    }
  );
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
  return { anonClient, serviceClient };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { childId, language, letter, subject, cls, term, patch } = body;

  if (!childId) {
    return NextResponse.json({ error: "childId is required." }, { status: 400 });
  }

  const { anonClient, serviceClient } = await getClients();

  // Verify session
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // NEW SYSTEM: If we have subject and letter, update child_progress
  if (subject && letter) {
    // Convert letter to activity_ref (e.g., 'A' -> 'letter_a')
    const activityRef = `letter_${letter.toLowerCase()}`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (serviceClient as any)
      .from("child_progress")
      .upsert({
        child_id: childId,
        activity_ref: activityRef,
        ...patch,
      }, { onConflict: "child_id,activity_ref" });

    if (error) {
      console.error("[POST /api/progress] Error upserting child_progress:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // LEGACY SYSTEM: Fall back to old progress table if needed
  if (!letter) {
    return NextResponse.json({ error: "letter is required." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (serviceClient as any)
    .from("progress")
    .upsert({
      child_id: childId,
      language,
      letter,
      subject: subject ?? "literacy",
      class: cls ?? null,
      term: term ?? null,
      ...patch,
    }, { onConflict: "child_id,language,letter" });

  if (error) {
    console.error("[POST /api/progress] Error updating progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true });
}
