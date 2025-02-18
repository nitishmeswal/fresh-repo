import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!supabase) {
    supabase = createClientComponentClient({
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
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
      skipBrowserRedirect: false,
      preferredBrowser: 'external', // Force external browser for all auth attempts
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline'
      }
    },
  });
};

// Email sign in helper
export const signInWithEmail = async (email: string) => {
  const client = getSupabaseClient();
  try {
    // Use signInWithOtp with shouldCreateUser=true
    // This will handle both new and existing users
    const { data, error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true, // This will create the user if they don't exist
      }
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  const client = getSupabaseClient();
  return client.auth.signOut();
};
