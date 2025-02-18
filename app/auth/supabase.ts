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
  try {
    // Check if we're in Instagram's in-app browser
    const isInstagramBrowser = /Instagram/.test(window.navigator.userAgent);
    
    if (isInstagramBrowser) {
      // Get the current URL
      const currentUrl = window.location.href;
      
      // Create a deep link to open in external browser
      // For iOS
      if (/iPhone|iPad|iPod/.test(window.navigator.userAgent)) {
        window.location.href = `googlechromes://${currentUrl}`;
        // Fallback for Safari if Chrome isn't installed
        setTimeout(() => {
          window.location.href = `safari-https://${currentUrl.replace('https://', '')}`;
        }, 2000);
      } 
      // For Android
      else {
        window.location.href = `intent://${currentUrl.replace('https://', '')}#Intent;scheme=https;package=com.android.chrome;end`;
      }
      
      return { error: null };
    }

    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
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

    return { data, error };
  } catch (error) {
    console.error('Auth error:', error);
    return { error };
  }
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
