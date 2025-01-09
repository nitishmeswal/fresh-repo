-- Update profiles table with new fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS custom_name TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS billing_plan TEXT NOT NULL DEFAULT 'free'
CHECK (billing_plan IN ('free', 'pro', 'ultimate'));

-- Create transactions table to track credit usage
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'ultimate')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending')),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Add RLS policies
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
    ON credit_transactions
    FOR SELECT
    USING (auth.uid() = profile_id);

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions
    FOR SELECT
    USING (auth.uid() = profile_id);

-- RLS policies for payment_history
CREATE POLICY "Users can view their own payments"
    ON payment_history
    FOR SELECT
    USING (auth.uid() = profile_id);

-- Function to handle credit transactions
CREATE OR REPLACE FUNCTION handle_credit_transaction(
    p_profile_id UUID,
    p_amount INTEGER,
    p_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS void AS $$
BEGIN
    -- Insert transaction record
    INSERT INTO credit_transactions (
        profile_id,
        amount,
        transaction_type,
        description,
        metadata
    ) VALUES (
        p_profile_id,
        p_amount,
        p_type,
        p_description,
        p_metadata
    );

    -- Update profile credits
    IF p_type = 'credit' THEN
        UPDATE profiles
        SET credits = credits + p_amount
        WHERE id = p_profile_id;
    ELSE
        UPDATE profiles
        SET credits = credits - p_amount
        WHERE id = p_profile_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle subscription changes
CREATE OR REPLACE FUNCTION handle_subscription_change(
    p_profile_id UUID,
    p_plan TEXT,
    p_status TEXT DEFAULT 'active',
    p_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month'
) RETURNS void AS $$
DECLARE
    v_old_plan TEXT;
    v_credit_adjustment INTEGER;
BEGIN
    -- Get current plan
    SELECT billing_plan INTO v_old_plan
    FROM profiles
    WHERE id = p_profile_id;

    -- Calculate credit adjustment
    v_credit_adjustment := 
        CASE p_plan
            WHEN 'pro' THEN 500
            WHEN 'ultimate' THEN 2000
            ELSE 100
        END;

    -- Update subscription
    INSERT INTO subscriptions (
        profile_id,
        plan,
        status,
        current_period_start,
        current_period_end
    ) VALUES (
        p_profile_id,
        p_plan,
        p_status,
        p_period_start,
        p_period_end
    );

    -- Update profile
    UPDATE profiles
    SET 
        billing_plan = p_plan,
        credits = v_credit_adjustment
    WHERE id = p_profile_id;

    -- Record the credit adjustment
    PERFORM handle_credit_transaction(
        p_profile_id,
        v_credit_adjustment,
        'credit',
        'Plan upgrade credit adjustment',
        jsonb_build_object('old_plan', v_old_plan, 'new_plan', p_plan)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
