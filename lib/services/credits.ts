import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BillingPlan, CreditTransaction, PaymentHistory, Subscription } from '@/types/credits';

export class CreditsService {
  private supabase = createClientComponentClient();

  async getProfile() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  }

  async getTransactionHistory(): Promise<CreditTransaction[]> {
    const { data: transactions } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    return transactions || [];
  }

  async getCreditCost(actionName: string): Promise<number> {
    const { data: costData } = await this.supabase
      .from('credit_costs')
      .select('credit_cost')
      .eq('action_name', actionName)
      .single();
    
    return costData?.credit_cost || 0;
  }

  async useCredits(amount: number, description: string, metadata?: Record<string, any>) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current credits
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < amount) {
      throw new Error(`Insufficient credits. Required: ${amount}, Available: ${profile?.credits || 0}`);
    }

    // Begin transaction
    const { data: transaction, error: transactionError } = await this.supabase
      .from('credit_transactions')
      .insert({
        profile_id: user.id,
        amount: amount,
        transaction_type: 'debit',
        description: description,
        metadata: metadata
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Update user's credits
    const { error: updateError } = await this.supabase
      .from('profiles')
      .update({ 
        credits: profile.credits - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return transaction;
  }

  async getSubscription(): Promise<Subscription | null> {
    const { data: subscription } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return subscription;
  }

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    const { data: payments } = await this.supabase
      .from('payment_history')
      .select('*')
      .order('created_at', { ascending: false });

    return payments || [];
  }

  async addFreeSignupCredits(userId: string) {
    try {
      // Check if user already received free credits
      const { data: existingCredits } = await this.supabase
        .from('credit_transactions')
        .select('id')
        .eq('profile_id', userId)
        .eq('description', 'Welcome Bonus Credits')
        .single();

      if (!existingCredits) {
        // Add 300 free credits
        await this.supabase.from('credit_transactions').insert({
          profile_id: userId,
          amount: 300,
          transaction_type: 'credit',
          description: 'Welcome Bonus Credits',
          metadata: {
            type: 'signup_bonus',
            timestamp: new Date().toISOString()
          }
        });

        // Update total credits
        await this.supabase.rpc('update_user_credits', {
          p_user_id: userId,
          p_amount: 300
        });
      }
    } catch (error) {
      console.error('Error adding free signup credits:', error);
      throw error;
    }
  }
}
