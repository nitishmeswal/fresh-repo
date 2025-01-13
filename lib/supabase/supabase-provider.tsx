'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getProfile } from './client';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SupabaseContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    refreshUser: async () => {} // Keeping empty function to maintain interface
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
