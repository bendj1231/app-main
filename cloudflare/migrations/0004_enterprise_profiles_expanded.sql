--- Migration number: 0004
--- Expand enterprise_profiles with auth0_id + all enterprise-specific fields
--- Enterprise accounts are STRICTLY SEPARATE from pilot profiles

ALTER TABLE enterprise_profiles ADD COLUMN auth0_id TEXT UNIQUE;
ALTER TABLE enterprise_profiles ADD COLUMN airline_name TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN airline_iata_code TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN airline_logo_url TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN airline_website TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN company_description TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN account_type TEXT DEFAULT 'airline';
ALTER TABLE enterprise_profiles ADD COLUMN billing_email TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN base_locations TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN fleet_information TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN contact_information TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN is_active INTEGER DEFAULT 1;
ALTER TABLE enterprise_profiles ADD COLUMN account_tier TEXT DEFAULT 'free';
ALTER TABLE enterprise_profiles ADD COLUMN can_pull_verified_profiles INTEGER DEFAULT 0;
ALTER TABLE enterprise_profiles ADD COLUMN can_view_pilot_details INTEGER DEFAULT 0;
ALTER TABLE enterprise_profiles ADD COLUMN can_export_data INTEGER DEFAULT 0;
ALTER TABLE enterprise_profiles ADD COLUMN max_pathway_cards INTEGER DEFAULT 3;
ALTER TABLE enterprise_profiles ADD COLUMN max_interest_views_per_month INTEGER DEFAULT 50;
ALTER TABLE enterprise_profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE enterprise_profiles ADD COLUMN tier_expires_at TEXT;

CREATE INDEX IF NOT EXISTS idx_enterprise_auth0_id ON enterprise_profiles(auth0_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_account_type ON enterprise_profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_enterprise_active ON enterprise_profiles(is_active);
