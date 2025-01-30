'use client';

import { useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '../supabase';

// Create a singleton supabase instance outside the hook
const supabaseClient = createBrowserClient();

// Debounce function
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// Global state to prevent multiple subscriptions
let globalUser: User | null = null;
let subscribers = new Set<(user: User | null) => void>();
let isAuthStateChanging = false;

// Initialize the global auth state
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  globalUser = session?.user ?? null;
  subscribers.forEach(callback => callback(globalUser));
});

// Setup global auth state change listener with reduced debounce time
const authStateHandler = debounce(async (_event: any, session: any) => {
  if (isAuthStateChanging) return;
  isAuthStateChanging = true;
  
  try {
    globalUser = session?.user ?? null;
    
    // Wait for all subscribers to be notified
    await Promise.all(
      Array.from(subscribers).map(callback => 
        Promise.resolve(callback(globalUser)).catch(console.error)
      )
    );
  } catch (error) {
    console.error('Auth state change error:', error);
  } finally {
    isAuthStateChanging = false;
  }
}, 50); // Reduced from 100ms to 50ms for faster response

// Setup single subscription
supabaseClient.auth.onAuthStateChange(authStateHandler);

export function useUser() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(!globalUser);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    // Add subscriber
    const callback = async (newUser: User | null) => {
      try {
        if (!mounted) return;
        setLoading(true);
        setUser(newUser);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err as Error);
        console.error('User state update error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    subscribers.add(callback);

    // Set initial state
    if (globalUser !== user) {
      callback(globalUser);
    } else {
      setLoading(false);
    }

    // Cleanup
    return () => {
      mounted = false;
      subscribers.delete(callback);
    };
  }, [user]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    user,
    loading,
    error,
    supabase: supabaseClient,
  }), [user, loading, error]);
}
