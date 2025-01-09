'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase-client';
import { useUser } from './useUser';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  created_at: string;
}

export function useWallet() {
  // Return mock wallet data for testing
  return {
    balance: 1000,
    transactions: [
      {
        id: 'tx-1',
        user_id: 'mock-user-id',
        amount: 500,
        type: 'credit',
        status: 'completed',
        description: 'Added credits',
        created_at: new Date().toISOString(),
      },
      {
        id: 'tx-2',
        user_id: 'mock-user-id',
        amount: -50,
        type: 'debit',
        status: 'completed',
        description: 'GPU Rental: RTX 4090',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'tx-3',
        user_id: 'mock-user-id',
        amount: -25,
        type: 'debit',
        status: 'completed',
        description: 'GPU Rental: RTX 3080',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      }
    ],
    loading: false,
    addCredits: async (amount: number) => {
      return { success: true };
    },
    refreshBalance: () => {}
  };
}
