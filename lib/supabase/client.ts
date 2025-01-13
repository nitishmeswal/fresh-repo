import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Single client instance with strict cookie settings
export const supabase = createClientComponentClient<Database>({
  cookieOptions: {
    name: 'sb-session',  // Unique name for your app
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }
});

// Auth functions
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

export async function signInWithGithub() {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'read:user user:email',
    },
  });
}

export async function signOut() {
  try {
    // Sign out globally
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear browser storage
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}

// Profile functions with error handling
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, data: { full_name?: string; avatar_url?: string }) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return profile;
}

// Session management
export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) throw new Error('No session found');
  
  // Refresh the session if it's about to expire
  const expiresAt = session?.expires_at || 0;
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt - now < 60 * 60) { // Less than 1 hour left
    const { data: { session: newSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    return newSession;
  }
  
  return session;
}
