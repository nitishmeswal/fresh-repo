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
  const { origin } = window.location;
  
  try {
    // First clear any existing session
    await client.auth.signOut();
    
    // Then start new sign in
    return client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
        skipBrowserRedirect: false
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const client = getSupabaseClient();
  
  try {
    // First clear all storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Remove any auth cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }

    // Then sign out from Supabase
    await client.auth.signOut();
    
    // Finally redirect
    window.location.href = '/';
  } catch (error) {
    console.error('Error during sign out:', error);
    // Force redirect on error
    window.location.href = '/';
  }
};
