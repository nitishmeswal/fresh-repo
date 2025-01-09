export type BillingPlan = 'free' | 'pro' | 'ultimate';
export type TransactionType = 'credit' | 'debit';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';
export type PaymentStatus = 'succeeded' | 'failed' | 'pending';

export interface CreditTransaction {
  id: string;
  profile_id: string;
  amount: number;
  transaction_type: TransactionType;
  description?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  profile_id: string;
  plan: BillingPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  cancelled_at?: string;
  metadata?: Record<string, any>;
}

export interface PaymentHistory {
  id: string;
  profile_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export const PLAN_DETAILS = {
  free: {
    name: 'Free Plan',
    price: 0,
    credits: 100,
    features: ['Basic Access', 'Limited Compute Hours', 'Community Support']
  },
  pro: {
    name: 'Pro Plan',
    price: 10,
    credits: 500,
    features: ['Priority Access', 'Extended Compute Hours', 'Email Support', 'Advanced Analytics']
  },
  ultimate: {
    name: 'Ultimate Plan',
    price: 25,
    credits: 2000,
    features: ['Unlimited Access', 'Unlimited Compute Hours', 'Priority Support', 'Custom Analytics', 'API Access']
  }
} as const;
