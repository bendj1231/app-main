-- ============================================================================
-- Recognition Fee Infrastructure
-- Success-based escrow model: both parties must mutually agree before fee
-- Static invoice records survive pilot account deletion for tax/audit compliance
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table 1: match_agreements
-- Records the mutual handshake between pilot and airline/operator.
-- Both parties must explicitly consent before a Recognition Fee is triggered.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Pilot side (no FK to profiles — prevents cascade delete wiping agreements)
  pilot_id uuid NOT NULL,
  pilot_reference_code text NOT NULL,
  pilot_name_at_time text,
  pilot_consent_at timestamptz,

  -- Airline / operator side (FK OK — enterprises don't get deleted)
  enterprise_account_id uuid NOT NULL REFERENCES enterprise_accounts(id) ON DELETE CASCADE,
  airline_name_at_time text,
  airline_consent_at timestamptz,

  -- Link to the original interest submission
  pathway_card_interest_id uuid,

  -- Status lifecycle
  status text NOT NULL DEFAULT 'pending_pilot_consent'
    CHECK (status IN (
      'pending_pilot_consent',
      'pending_airline_consent',
      'both_agreed',
      'connection_made',
      'fee_invoiced',
      'fee_paid',
      'cancelled',
      'expired'
    )),

  -- Agreement expiry (pilots/airlines have 14 days to respond)
  expires_at timestamptz NOT NULL DEFAULT (now() + '14 days'::interval),

  -- Metadata
  notes text,
  metadata jsonb DEFAULT '{}',

  -- Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_match_agreements_pilot_id ON match_agreements(pilot_id);
CREATE INDEX IF NOT EXISTS idx_match_agreements_enterprise_account_id ON match_agreements(enterprise_account_id);
CREATE INDEX IF NOT EXISTS idx_match_agreements_status ON match_agreements(status);
CREATE INDEX IF NOT EXISTS idx_match_agreements_pilot_reference_code ON match_agreements(pilot_reference_code);
CREATE INDEX IF NOT EXISTS idx_match_agreements_created_at ON match_agreements(created_at);

-- Enable RLS
ALTER TABLE match_agreements ENABLE ROW LEVEL SECURITY;

-- Pilots can view their own agreements
CREATE POLICY "Pilots can view own match agreements"
  ON match_agreements
  FOR SELECT
  TO authenticated
  USING (pilot_id = auth.uid());

-- Enterprise members can view their own agreements
CREATE POLICY "Enterprises can view own match agreements"
  ON match_agreements
  FOR SELECT
  TO authenticated
  USING (enterprise_account_id IN (
    SELECT enterprise_account_id FROM enterprise_account_members WHERE user_id = auth.uid()
  ));

-- System can manage all agreements
CREATE POLICY "System can manage match agreements"
  ON match_agreements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Table 2: recognition_fee_invoices
-- PERMANENT static invoice records.
-- NO foreign key to profiles — survives pilot deletion completely intact.
-- Required for corporate tax, billing audits, and airline receipt history.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recognition_fee_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Static invoice identity
  invoice_number text NOT NULL UNIQUE,

  -- Link to the agreement that triggered this fee (optional for audit trail)
  match_agreement_id uuid REFERENCES match_agreements(id) ON DELETE SET NULL,

  -- Static pilot data (snapshot at time of match — never changes)
  pilot_reference_code text NOT NULL,
  pilot_name_at_time text,
  pilot_license_country text,
  pilot_license_type text,

  -- Static airline data
  airline_name text NOT NULL,
  airline_billing_email text,
  enterprise_account_id uuid REFERENCES enterprise_accounts(id) ON DELETE SET NULL,

  -- Financial details
  fee_amount numeric(10, 2) NOT NULL DEFAULT 500.00,
  currency text NOT NULL DEFAULT 'USD',
  description text NOT NULL DEFAULT 'Recognition Fee — Successful pilot connection via PilotRecognition platform',

  -- Stripe integration
  stripe_invoice_id text,
  stripe_customer_id text,
  stripe_payment_intent_id text,

  -- Status
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'finalized', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),

  -- Dates
  due_date timestamptz,
  sent_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,

  -- Static receipt data (what the airline sees on their bill)
  service_description text NOT NULL DEFAULT 'Service: Successful Connection & Recognition Fee. Status: Completed (Both parties consented).',

  -- Metadata
  metadata jsonb DEFAULT '{}',

  -- Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_recognition_fee_invoices_pilot_ref ON recognition_fee_invoices(pilot_reference_code);
CREATE INDEX IF NOT EXISTS idx_recognition_fee_invoices_enterprise ON recognition_fee_invoices(enterprise_account_id);
CREATE INDEX IF NOT EXISTS idx_recognition_fee_invoices_status ON recognition_fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_recognition_fee_invoices_stripe ON recognition_fee_invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_recognition_fee_invoices_created_at ON recognition_fee_invoices(created_at);

-- Enable RLS
ALTER TABLE recognition_fee_invoices ENABLE ROW LEVEL SECURITY;

-- Enterprise members can view invoices billed to their account
CREATE POLICY "Enterprises can view own recognition fee invoices"
  ON recognition_fee_invoices
  FOR SELECT
  TO authenticated
  USING (enterprise_account_id IN (
    SELECT enterprise_account_id FROM enterprise_account_members WHERE user_id = auth.uid()
  ));

-- System can manage all invoices
CREATE POLICY "System can manage recognition fee invoices"
  ON recognition_fee_invoices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_match_agreements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_match_agreements_updated_at
  BEFORE UPDATE ON match_agreements
  FOR EACH ROW
  EXECUTE FUNCTION update_match_agreements_updated_at();

CREATE OR REPLACE FUNCTION update_recognition_fee_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_recognition_fee_invoices_updated_at
  BEFORE UPDATE ON recognition_fee_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_recognition_fee_invoices_updated_at();

-- ----------------------------------------------------------------------------
-- Comments for documentation
-- ----------------------------------------------------------------------------
COMMENT ON TABLE match_agreements IS
'Mutual consent handshake between pilot and airline. Both parties must explicitly agree before a Recognition Fee is triggered. pilot_id is stored as raw UUID (no FK) to prevent cascade delete from wiping agreement history.';

COMMENT ON TABLE recognition_fee_invoices IS
'PERMANENT static invoice records for the $500 Recognition Fee. No foreign key to profiles table — survives pilot account deletion completely intact for tax and audit compliance. pilot_reference_code is a static string (e.g., PILOT-PH-8932) generated at match time.';
