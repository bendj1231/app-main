-- ============================================================
-- PILOTRECOGNITION.COM — PRODUCTION RLS POLICIES
-- Run this in Supabase SQL Editor to verify/reset all policies
-- ============================================================

-- ============================================
-- PROFILES TABLE (Auth0 User ID matching)
-- ============================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id::text = (auth.jwt() ->> 'sub'));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id::text = (auth.jwt() ->> 'sub'))
    WITH CHECK (id::text = (auth.jwt() ->> 'sub'));

-- Service role can insert profiles (signup flow)
CREATE POLICY "Service role can insert profiles"
    ON public.profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ============================================
-- PILOT DOCUMENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own documents" ON public.pilot_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.pilot_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.pilot_documents;
DROP POLICY IF EXISTS "Admins can read all documents for verification" ON public.pilot_documents;

CREATE POLICY "Users can read own documents"
    ON public.pilot_documents
    FOR SELECT
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own documents"
    ON public.pilot_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (pilot_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own documents"
    ON public.pilot_documents
    FOR DELETE
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

-- Admins can read all documents for verification queue
CREATE POLICY "Admins can read all documents for verification"
    ON public.pilot_documents
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id::text = (auth.jwt() ->> 'sub')
            AND role = 'admin'
        )
    );

-- ============================================
-- USER ACTIVITY LOG TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Service role can insert activity" ON public.user_activity_log;

CREATE POLICY "Users can read own activity"
    ON public.user_activity_log
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Service role can insert activity"
    ON public.user_activity_log
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ============================================
-- PATHWAY CARD INTERESTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own pathway interests" ON public.pathway_card_interests;
DROP POLICY IF EXISTS "Users can insert own pathway interests" ON public.pathway_card_interests;
DROP POLICY IF EXISTS "Users can delete own pathway interests" ON public.pathway_card_interests;

CREATE POLICY "Users can read own pathway interests"
    ON public.pathway_card_interests
    FOR SELECT
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own pathway interests"
    ON public.pathway_card_interests
    FOR INSERT
    TO authenticated
    WITH CHECK (pilot_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own pathway interests"
    ON public.pathway_card_interests
    FOR DELETE
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own enrollments" ON public.enrollments;

CREATE POLICY "Users can read own enrollments"
    ON public.enrollments
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- USER APP ACCESS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own app access" ON public.user_app_access;

CREATE POLICY "Users can read own app access"
    ON public.user_app_access
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- PILOT LICENSURE EXPERIENCE TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own pilot data" ON public.pilot_licensure_experience;
DROP POLICY IF EXISTS "Users can update own pilot data" ON public.pilot_licensure_experience;

CREATE POLICY "Users can read own pilot data"
    ON public.pilot_licensure_experience
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own pilot data"
    ON public.pilot_licensure_experience
    FOR UPDATE
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can read own notifications"
    ON public.notifications
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own notifications"
    ON public.notifications
    FOR UPDATE
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can read own subscriptions"
    ON public.subscriptions
    FOR SELECT
    TO authenticated
    USING (user_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- VERIFICATION WALLET TABLES
-- ============================================

DROP POLICY IF EXISTS "Users can read own verification wallet" ON public.pilot_verification_wallet;
DROP POLICY IF EXISTS "Users can read own verification checks" ON public.verification_checks;

CREATE POLICY "Users can read own verification wallet"
    ON public.pilot_verification_wallet
    FOR SELECT
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can read own verification checks"
    ON public.verification_checks
    FOR SELECT
    TO authenticated
    USING (pilot_id::text = (auth.jwt() ->> 'sub'));

-- ============================================
-- PENDING PROFILES (AI STAGING TABLE)
-- ============================================

DROP POLICY IF EXISTS "Allow anonymous inserts for AI staging" ON public.pending_profiles;
DROP POLICY IF EXISTS "Allow users to read own pending data" ON public.pending_profiles;

CREATE POLICY "Allow anonymous inserts for AI staging"
    ON public.pending_profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow users to read own pending data"
    ON public.pending_profiles
    FOR SELECT
    TO authenticated
    USING (session_id = current_setting('app.session_id', true));

-- ============================================
-- ENTERPRISE ACCOUNTS (Service role only)
-- ============================================

DROP POLICY IF EXISTS "Admins can manage enterprise data" ON public.enterprise_accounts;

CREATE POLICY "Admins can manage enterprise data"
    ON public.enterprise_accounts
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- SECURITY DEFINER VIEWS FIX
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'matching_statistics' AND schemaname = 'public') THEN
        ALTER VIEW public.matching_statistics SET (security_invoker = true);
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'user_manufacturer_access' AND schemaname = 'public') THEN
        ALTER VIEW public.user_manufacturer_access SET (security_invoker = true);
    END IF;
END $$;

-- ============================================
-- VERIFY ALL TABLES HAVE RLS ENABLED
-- ============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
AND tablename NOT IN ('spatial_ref_sys');

-- This should return 0 rows. If it returns any, enable RLS on those tables:
-- ALTER TABLE public.tablename ENABLE ROW LEVEL SECURITY;
