'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateUserRole(role: 'parent' | 'school_admin') {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: 'You must be logged in to set a role',
    };
  }

  // Update profile with role
  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({ role })
    .eq('id', user.id);

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}
