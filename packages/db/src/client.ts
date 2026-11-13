import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

/**
 * Creates a Supabase client using the Service Role Key.
 * DANGER: This bypasses all Row Level Security (RLS). 
 * NEVER use this on the client-side or pass it to the browser.
 * Only use in secure Server Actions or API Routes where you explicitly control the logic.
 */
export function createServiceRoleClient() {
  // STRICT SECURITY CHECK: Prevent execution in browser environment
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: createServiceRoleClient() called in client environment.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Service Role Key environment variables.');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a standard Supabase client using the Anon/Publishable Key.
 * Safe to use for public data or when relying on RLS.
 */
export function createAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Publishable Key environment variables.');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}
