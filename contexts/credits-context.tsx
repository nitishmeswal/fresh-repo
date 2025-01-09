'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CreditsService } from '@/lib/services/credits';
import { BillingPlan, CreditTransaction, PaymentHistory, Subscription } from '@/types/credits';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface CreditsContextType {
  credits: number;
  plan: BillingPlan;
  transactions: CreditTransaction[];
  subscription: Subscription | null;
  payments: PaymentHistory[];
  loading: boolean;
  error: Error | null;
  refreshCredits: () => Promise<void>;
  changePlan: (plan: BillingPlan) => Promise<void>;
  addCredits: (amount: number, paymentMethod: string, metadata?: Record<string, any>) => Promise<void>;
  useCredits: (amount: number, description: string, metadata?: Record<string, any>) => Promise<void>;
}

export const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCreditsContext = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCreditsContext must be used within a CreditsProvider');
  }
  return context;
};

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState<BillingPlan>('free');
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const creditsService = new CreditsService();
  const supabase = createClientComponentClient();

  const refreshCredits = async () => {
    try {
      setLoading(true);
      const profile = await creditsService.getProfile();
      const transactions = await creditsService.getTransactionHistory();
      const subscription = await creditsService.getSubscription();
      const payments = await creditsService.getPaymentHistory();

      if (profile) {
        setCredits(profile.credits);
        setPlan(profile.billing_plan);
      }
      setTransactions(transactions);
      setSubscription(subscription);
      setPayments(payments);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load credits'));
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (newPlan: BillingPlan) => {
    try {
      await creditsService.changePlan(newPlan);
      await refreshCredits();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to change plan'));
      throw err;
    }
  };

  const addCredits = async (amount: number, paymentMethod: string, metadata?: Record<string, any>) => {
    try {
      await creditsService.addCredits(amount, paymentMethod, metadata);
      await refreshCredits();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add credits'));
      throw err;
    }
  };

  const useCredits = async (amount: number, description: string, metadata?: Record<string, any>) => {
    try {
      await creditsService.useCredits(amount, description, metadata);
      await refreshCredits();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to use credits'));
      throw err;
    }
  };

  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { subscription } } = await supabase.auth.getSession();
      
      if (subscription) {
        await refreshCredits();
      }
    };

    setupSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await refreshCredits();
      } else if (event === 'SIGNED_OUT') {
        setCredits(0);
        setPlan('free');
        setTransactions([]);
        setSubscription(null);
        setPayments([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <CreditsContext.Provider
      value={{
        credits,
        plan,
        transactions,
        subscription,
        payments,
        loading,
        error,
        refreshCredits,
        changePlan,
        addCredits,
        useCredits,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}
