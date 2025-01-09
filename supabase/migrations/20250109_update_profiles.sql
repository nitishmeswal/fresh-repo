-- Update profiles table with new fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS custom_name TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS billing_plan TEXT NOT NULL DEFAULT 'free'
CHECK (billing_plan IN ('free', 'pro', 'ultimate'));

-- Create billing_history table
CREATE TABLE IF NOT EXISTS billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    credits_added INTEGER NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'completed',
    payment_method TEXT,
    description TEXT
);

-- Create plan_changes table
CREATE TABLE IF NOT EXISTS plan_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    old_plan TEXT NOT NULL,
    new_plan TEXT NOT NULL,
    change_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Add RLS policies
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing history"
    ON billing_history
    FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can view their own plan changes"
    ON plan_changes
    FOR SELECT
    USING (auth.uid() = profile_id);

-- Function to handle plan upgrades
CREATE OR REPLACE FUNCTION handle_plan_upgrade(
    user_id UUID,
    new_plan TEXT,
    payment_amount DECIMAL
) RETURNS void AS $$
DECLARE
    old_plan TEXT;
BEGIN
    -- Get current plan
    SELECT billing_plan INTO old_plan
    FROM profiles
    WHERE id = user_id;

    -- Update profile
    UPDATE profiles
    SET billing_plan = new_plan
    WHERE id = user_id;

    -- Record plan change
    INSERT INTO plan_changes (
        profile_id,
        old_plan,
        new_plan,
        next_billing_date
    ) VALUES (
        user_id,
        old_plan,
        new_plan,
        NOW() + INTERVAL '1 month'
    );

    -- Record payment
    INSERT INTO billing_history (
        profile_id,
        amount,
        credits_added,
        description
    ) VALUES (
        user_id,
        payment_amount,
        CASE 
            WHEN new_plan = 'pro' THEN 500
            WHEN new_plan = 'ultimate' THEN 2000
            ELSE 0
        END,
        'Plan upgrade to ' || new_plan
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
