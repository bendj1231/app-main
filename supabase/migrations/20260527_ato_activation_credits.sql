-- Migration: ATO Activation Credits System
-- Date: May 27, 2026
-- Purpose: Track 5% revenue share for ATOs with 5-day expiration

-- ============================================
-- 1. ATO ACTIVATION CREDITS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ato_activation_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ato_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pilot_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verification_id UUID REFERENCES pilot_credentials(id) ON DELETE SET NULL,
    
    -- Financial fields
    credit_amount DECIMAL(10,2) NOT NULL DEFAULT 4.95, -- 5% of $99
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'claimed', 'lapsed')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '5 days'),
    claimed_at TIMESTAMP WITH TIME ZONE,
    lapsed_at TIMESTAMP WITH TIME ZONE,
    
    -- Claim reference (links to subscription payment)
    claimed_via_subscription_id UUID,
    
    -- Metadata
    source VARCHAR(50) NOT NULL DEFAULT 'verification', -- 'verification', 'referral', etc.
    notes TEXT,
    
    -- Constraints
    CONSTRAINT positive_credit CHECK (credit_amount > 0)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ato_credits_ato_id ON ato_activation_credits(ato_id);
CREATE INDEX IF NOT EXISTS idx_ato_credits_status ON ato_activation_credits(status);
CREATE INDEX IF NOT EXISTS idx_ato_credits_expires_at ON ato_activation_credits(expires_at);
CREATE INDEX IF NOT EXISTS idx_ato_credits_created_at ON ato_activation_credits(created_at);

-- Composite index for finding pending credits by ATO
CREATE INDEX IF NOT EXISTS idx_ato_credits_pending_by_ato 
    ON ato_activation_credits(ato_id, status, expires_at) 
    WHERE status = 'pending';

-- ============================================
-- 2. PROFILE EXTENSIONS FOR ATO TRACKING
-- ============================================

-- Add ATO-specific columns to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_ato') THEN
        ALTER TABLE profiles ADD COLUMN is_ato BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'ato_enterprise_status') THEN
        ALTER TABLE profiles ADD COLUMN ato_enterprise_status VARCHAR(20) 
            NOT NULL DEFAULT 'free' 
            CHECK (ato_enterprise_status IN ('free', 'pending', 'active', 'expired'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'total_credits_earned') THEN
        ALTER TABLE profiles ADD COLUMN total_credits_earned DECIMAL(12,2) NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'total_credits_claimed') THEN
        ALTER TABLE profiles ADD COLUMN total_credits_claimed DECIMAL(12,2) NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'ato_referral_code') THEN
        ALTER TABLE profiles ADD COLUMN ato_referral_code VARCHAR(20) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'referred_by_ato_id') THEN
        ALTER TABLE profiles ADD COLUMN referred_by_ato_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Index for referral tracking
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_ato 
    ON profiles(referred_by_ato_id) 
    WHERE referred_by_ato_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_ato_referral_code 
    ON profiles(ato_referral_code) 
    WHERE ato_referral_code IS NOT NULL;

-- ============================================
-- 3. VIEW: ATO CREDIT SUMMARY
-- ============================================

CREATE OR REPLACE VIEW ato_credit_summary AS
SELECT 
    p.id as ato_id,
    p.email as ato_email,
    p.full_name as ato_name,
    p.ato_enterprise_status,
    p.total_credits_earned,
    p.total_credits_claimed,
    
    -- Pending credits
    COALESCE(SUM(CASE WHEN ac.status = 'pending' THEN ac.credit_amount ELSE 0 END), 0) 
        as pending_credits,
    COUNT(CASE WHEN ac.status = 'pending' THEN 1 END) as pending_count,
    
    -- Expiring soon (within 24 hours)
    COUNT(CASE WHEN ac.status = 'pending' 
               AND ac.expires_at <= NOW() + INTERVAL '24 hours' 
               THEN 1 END) as expiring_soon_count,
    
    -- Claimed credits
    COALESCE(SUM(CASE WHEN ac.status = 'claimed' THEN ac.credit_amount ELSE 0 END), 0) 
        as claimed_credits,
    COUNT(CASE WHEN ac.status = 'claimed' THEN 1 END) as claimed_count,
    
    -- Lapsed credits
    COALESCE(SUM(CASE WHEN ac.status = 'lapsed' THEN ac.credit_amount ELSE 0 END), 0) 
        as lapsed_credits,
    COUNT(CASE WHEN ac.status = 'lapsed' THEN 1 END) as lapsed_count,
    
    -- Available for immediate discount (active ATO only)
    CASE 
        WHEN p.ato_enterprise_status = 'active' 
        THEN COALESCE(SUM(CASE WHEN ac.status = 'pending' THEN ac.credit_amount ELSE 0 END), 0)
        ELSE 0 
    END as available_discount

FROM profiles p
LEFT JOIN ato_activation_credits ac ON ac.ato_id = p.id
WHERE p.is_ato = true
GROUP BY p.id, p.email, p.full_name, p.ato_enterprise_status, 
         p.total_credits_earned, p.total_credits_claimed;

-- ============================================
-- 4. FUNCTION: Create Activation Credit
-- ============================================

CREATE OR REPLACE FUNCTION create_activation_credit(
    p_ato_id UUID,
    p_pilot_id UUID,
    p_verification_id UUID,
    p_amount DECIMAL(10,2) DEFAULT 4.95,
    p_source VARCHAR(50) DEFAULT 'verification',
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_credit_id UUID;
BEGIN
    -- Insert the credit record
    INSERT INTO ato_activation_credits (
        ato_id,
        pilot_id,
        verification_id,
        credit_amount,
        status,
        source,
        notes
    ) VALUES (
        p_ato_id,
        p_pilot_id,
        p_verification_id,
        p_amount,
        'pending',
        p_source,
        p_notes
    )
    RETURNING id INTO v_credit_id;
    
    -- Update ATO's total earned
    UPDATE profiles 
    SET total_credits_earned = total_credits_earned + p_amount
    WHERE id = p_ato_id;
    
    RETURN v_credit_id;
END;
$$;

-- ============================================
-- 5. FUNCTION: Claim Credits (Apply to Subscription)
-- ============================================

CREATE OR REPLACE FUNCTION claim_activation_credits(
    p_ato_id UUID,
    p_subscription_id UUID
)
RETURNS TABLE(
    total_claimed DECIMAL(10,2),
    credits_count INTEGER,
    final_subscription_price DECIMAL(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total DECIMAL(10,2);
    v_count INTEGER;
    v_subscription_price DECIMAL(10,2) := 1000.00; -- $1,000/year Enterprise
BEGIN
    -- Calculate total pending credits
    SELECT COALESCE(SUM(credit_amount), 0), COUNT(*)
    INTO v_total, v_count
    FROM ato_activation_credits
    WHERE ato_id = p_ato_id 
    AND status = 'pending'
    AND expires_at > NOW();
    
    -- If no credits, return early
    IF v_total = 0 THEN
        RETURN QUERY SELECT 
            0::DECIMAL(10,2), 
            0::INTEGER, 
            v_subscription_price::DECIMAL(10,2);
        RETURN;
    END IF;
    
    -- Mark credits as claimed
    UPDATE ato_activation_credits
    SET 
        status = 'claimed',
        claimed_at = NOW(),
        claimed_via_subscription_id = p_subscription_id
    WHERE ato_id = p_ato_id 
    AND status = 'pending'
    AND expires_at > NOW();
    
    -- Update ATO's claimed total
    UPDATE profiles 
    SET 
        total_credits_claimed = total_credits_claimed + v_total,
        ato_enterprise_status = 'active'
    WHERE id = p_ato_id;
    
    -- Return summary
    RETURN QUERY SELECT 
        v_total::DECIMAL(10,2),
        v_count::INTEGER,
        GREATEST(0, v_subscription_price - v_total)::DECIMAL(10,2);
END;
$$;

-- ============================================
-- 6. FUNCTION: Expire Old Credits (Called by Cron)
-- ============================================

CREATE OR REPLACE FUNCTION expire_activation_credits()
RETURNS TABLE(
    expired_count INTEGER,
    expired_amount DECIMAL(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
    v_amount DECIMAL(10,2);
BEGIN
    -- Get summary before update
    SELECT COUNT(*), COALESCE(SUM(credit_amount), 0)
    INTO v_count, v_amount
    FROM ato_activation_credits
    WHERE status = 'pending'
    AND expires_at <= NOW();
    
    -- Mark as lapsed
    UPDATE ato_activation_credits
    SET 
        status = 'lapsed',
        lapsed_at = NOW()
    WHERE status = 'pending'
    AND expires_at <= NOW();
    
    RETURN QUERY SELECT 
        COALESCE(v_count, 0)::INTEGER,
        COALESCE(v_amount, 0)::DECIMAL(10,2);
END;
$$;

-- ============================================
-- 7. FUNCTION: Generate ATO Referral Code
-- ============================================

CREATE OR REPLACE FUNCTION generate_ato_referral_code(p_ato_id UUID)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code VARCHAR(20);
    v_exists BOOLEAN;
BEGIN
    -- Generate code from first 4 letters of name + random 4 digits
    SELECT 
        UPPER(LEFT(REGEXP_REPLACE(p.full_name, '[^a-zA-Z]', '', 'g'), 4)) || 
        LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')
    INTO v_code
    FROM profiles p
    WHERE p.id = p_ato_id;
    
    -- Ensure uniqueness
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM profiles WHERE ato_referral_code = v_code AND id != p_ato_id
        ) INTO v_exists;
        
        EXIT WHEN NOT v_exists;
        
        -- Regenerate if collision
        v_code := LEFT(v_code, 4) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    END LOOP;
    
    -- Save to profile
    UPDATE profiles 
    SET ato_referral_code = v_code,
        is_ato = true
    WHERE id = p_ato_id;
    
    RETURN v_code;
END;
$$;

-- ============================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on new table
ALTER TABLE ato_activation_credits ENABLE ROW LEVEL SECURITY;

-- ATOs can see their own credits
CREATE POLICY "ATOs can view own credits"
    ON ato_activation_credits
    FOR SELECT
    TO authenticated
    USING (ato_id = auth.uid());

-- Admins can see all credits
CREATE POLICY "Admins can view all credits"
    ON ato_activation_credits
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'super_admin')
        )
    );

-- System can insert credits (via edge functions)
CREATE POLICY "System can create credits"
    ON ato_activation_credits
    FOR INSERT
    TO authenticated
    WITH CHECK (true); -- Edge function validates

-- ============================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE ato_activation_credits IS 
'Tracks 5% revenue share credits for ATOs when their referred pilots complete verification. Credits expire after 5 days if not claimed via Enterprise subscription.';

COMMENT ON COLUMN ato_activation_credits.status IS 
'pending = waiting for ATO to claim | claimed = applied to subscription | lapsed = expired, platform keeps money';

COMMENT ON COLUMN ato_activation_credits.expires_at IS 
'5 days from creation. After this, credit lapses and ATO cannot claim it.';

-- ============================================
-- 10. SEED DATA (Optional: Create test ATO)
-- ============================================

-- Example: Uncomment to create a test ATO with referral code
-- SELECT generate_ato_referral_code('792250be-00fc-4bbf-b4a5-8673de7484f3');
