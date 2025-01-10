'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { supabase } from '@/lib/supabase/client';

interface CreditContextType {
  credits: number;
  loading: boolean;
  updateCredits: (newCredits: number) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType>({
  credits: 0,
  loading: true,
  updateCredits: async () => {},
  refreshCredits: async () => {}
});

export function useCredits() {
  return useContext(CreditContext);
}

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const refreshCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const updateCredits = async (newCredits: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (error) throw error;
      setCredits(newCredits);
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  useEffect(() => {
    refreshCredits();
  }, [user]);

  return (
    <CreditContext.Provider value={{ credits, loading, updateCredits, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
}
