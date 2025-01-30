import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!supabase) {
    supabase = createClientComponentClient({
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: false,
          detectSessionInUrl: true
        }
      }
    });
  }
  return supabase;
};

// Simple auth helpers
export const signInWithProvider = async (provider: 'google' | 'github') => {
  const client = getSupabaseClient();
  return client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      skipBrowserRedirect: false
    },
  });
};

export const signOut = async () => {
  const client = getSupabaseClient();
  try {
    // Clear all storage first
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out and redirect
    await client.auth.signOut({ scope: 'local' });
    window.location.href = '/';
  } catch (error) {
    console.error('Error during sign out:', error);
    window.location.href = '/';
  }
};
