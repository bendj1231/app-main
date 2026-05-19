-- ATO Activation Credits Table
-- Tracks 5% Member Credits generated for flight schools
-- Credits accumulate indefinitely until ATO subscribes and claims all at once

CREATE TABLE IF NOT EXISTS ato_activation_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ato_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pilot_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_id text NOT NULL,
  
  -- Credit amount (5% of verification fee)
  credit_amount decimal(10, 2) NOT NULL DEFAULT 4.95,
  
  -- Status tracking
  status text NOT NULL DEFAULT 'unclaimed' 
    CHECK (status IN ('unclaimed', 'claimed', 'released')),
  
  -- Timeline (no expiration — accumulates indefinitely)
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz,
  released_at timestamptz, -- When ATO subscribes and all credits are paid out
  
  -- Claim details (when ATO activates Enterprise Seat)
  claimed_by_enterprise_subscription_id text,
  batch_claim_total decimal(10, 2), -- Total amount claimed in this batch
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  -- Audit
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_activation_credits_ato_id 
  ON ato_activation_credits(ato_id) 
  WHERE status = 'unclaimed';

CREATE INDEX IF NOT EXISTS idx_activation_credits_status 
  ON ato_activation_credits(status);

-- View for quick unclaimed balance lookup
CREATE OR REPLACE VIEW ato_unclaimed_balance AS
SELECT 
  ato_id,
  COUNT(*) as pending_credits_count,
  COALESCE(SUM(credit_amount), 0) as total_unclaimed_amount
FROM ato_activation_credits
WHERE status = 'unclaimed'
GROUP BY ato_id;

-- Enable RLS
ALTER TABLE ato_activation_credits ENABLE ROW LEVEL SECURITY;

-- ATOs can see their own credits
CREATE POLICY "ATOs can view own activation credits"
  ON ato_activation_credits
  FOR SELECT
  TO authenticated
  USING (ato_id = auth.uid());

-- System can manage all credits
CREATE POLICY "System can manage activation credits"
  ON ato_activation_credits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_activation_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activation_credits_updated_at
  BEFORE UPDATE ON ato_activation_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_activation_credits_updated_at();

-- Notification queue table (if not exists)
CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type text NOT NULL CHECK (recipient_type IN ('pilot', 'ato', 'admin', 'enterprise')),
  recipient_id uuid NOT NULL,
  notification_type text NOT NULL,
  subject text NOT NULL,
  template_data jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'retrying')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  retry_count int DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status 
  ON notification_queue(status, created_at) 
  WHERE status = 'pending';

-- Add comment for documentation
COMMENT ON TABLE ato_activation_credits IS 
'5% Member Activation Credits for ATOs. Generated on successful verification. 
Credits accumulate indefinitely in unclaimed vault until ATO subscribes to Enterprise tier. 
Upon subscription, ALL accumulated credits are released retroactively. No expiration — creates 
FOMO through growing "money left on table" rather than urgency through deadline.';
