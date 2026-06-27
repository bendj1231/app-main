/**
 * Data Migration Script - After schema is created in new project
 * Usage: node scripts/data-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';

const OLD_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const NEW_URL = 'https://upaainmhcqlghtsfmtrc.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWFpbm1oY3FsZ2h0c2ZtdHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU1MjM0OSwiZXhwIjoyMDk3MTI4MzQ5fQ.5Lx_zSbmllRIV7QseEplPjL2-EOWtcfNDLh-0vrUkkU';

const oldSb = createClient(OLD_URL, OLD_KEY);
const newSb = createClient(NEW_URL, NEW_KEY);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const TABLES = [
  "achievements","ai_usage_log","aircraft_categories","aircraft_metrics","aircraft_type_ratings",
  "airline_aircraft","airline_expectations","airline_passport_connections","airline_recruitment",
  "airline_type_ratings","airlines","alumni_network","ame_practitioners","api_metrics",
  "api_metrics_daily","api_rate_limits","atlas_resumes","ato_activation_credits",
  "ato_applications","ato_attestation_requests","ato_campuses","ato_institutions",
  "ato_issued_tokens","ato_platform_invoices","ato_verification_requests","aviation_index_cache",
  "aviation_operators","aviation_standards","bot_allowed_domains","cache_invalidation_log",
  "cache_statistics","career_hierarchy_general_categories","career_hierarchy_pathways",
  "career_hierarchy_sub_pathways","career_pathways","completion_tracking","credential_requests",
  "ebt_cbta_competencies","efb_complexity_tokens","enrollments","enterprise_access_requests",
  "enterprise_account_members","enterprise_accounts","enterprise_pathway_cards","enterprise_users",
  "event_attendance","event_marketing_materials","event_notifications","event_registrations",
  "event_session_attendees","event_sessions","event_sponsors","events","external_jobs",
  "fleet_age_data","flight_instrument_metrics","flight_school_admins","flight_school_cards",
  "flight_schools","forum_participation","framework_content_sections","framework_document",
  "framework_pillar_stakeholders","framework_pillars","framework_stakeholders","framework_table_rows",
  "framework_tables","goal_tracking","held_commissions","industry_expectations",
  "interview_assessments","interview_feedback","interview_schedule_availability","interviews",
  "issuance_fee_transactions","job_opportunities","learning_hours","learning_metrics",
  "logbook_hour_tokens","logbook_provider_sync","manufacturer_users","manufacturers",
  "market_demand","match_agreements","match_calculation_logs","medical_certificate_records",
  "mentee_progress","mentor_competency_evaluations","mentor_logs","mentor_profiles",
  "mentor_sessions","mentorship_badges","mentorship_forum_categories","mentorship_forum_likes",
  "mentorship_forum_posts","mentorship_forum_replies","mentorship_messages","mentorship_requests",
  "mentorship_sessions","mfa_backup_codes","mfa_secrets","mfa_settings","military_service_records",
  "notifications","oem_market_forecasts","oem_partners","organization_members","organizations",
  "p12_verification_disputes","p12_verification_events","pathway_applications",
  "pathway_card_engagement","pathway_card_engagement_totals","pathway_card_interests",
  "pathway_match_history","pathway_matches","pathway_roadmap_cache","pathway_weights",
  "pathways","payment_splits","payouts","peer_endorsements","peer_validation",
  "pending_profiles","pilot_applications","pilot_audit_locker","pilot_career_intelligence",
  "pilot_credentials","pilot_dids","pilot_documents","pilot_exams","pilot_flight_logs",
  "pilot_licensure_experience","pilot_notifications","pilot_passkey_challenges",
  "pilot_passkeys","pilot_pay_projections","pilot_platform_connections","pilot_portfolio",
  "pilot_portfolio_data","pilot_profiles","pilot_recognition_match","pilot_recognition_matches",
  "pilot_recognition_scores","pilot_seniority_risk","pilot_spotlights","pilot_type_ratings",
  "pilot_verification_requests","pilot_verification_wallet","profiles","program_progress",
  "program_quality_factors","public_ipfs_pins","rate_limit_buckets","rate_limits",
  "recency_decay_config","recognition_fee_invoices","recognition_scores","referral_analytics",
  "referral_conversions","referral_dividend_ledger","referral_partners","referrals",
  "reset_codes","resume_airline_applications","resume_analytics","resume_shares",
  "score_calculation_history","score_history","security_events","sim_centers",
  "sim_session_tokens","simulator_proficiency_records","study_sessions","subscriptions",
  "support_enquiries","team_commission_config","team_members","team_monthly_performance",
  "team_referral_events","team_volume_tiers","type_rating_center_admins","type_rating_centers",
  "type_rating_listings","type_ratings","user_activity_log","user_app_access","user_bookmarks",
  "user_projects","users","vc_revocation_registry","veremark_webhook_logs","verification_checks",
  "verification_conflicts","verification_consent_log"
];

async function migrateData(table) {
  try {
    const { count } = await oldSb.from(table).select('*', { count: 'exact', head: true });
    if (!count || count === 0) return { table, rows: 0 };

    console.log(`📦 ${table}: ${count} rows`);

    const { data: rows, error } = await oldSb.from(table).select('*').limit(10000);
    if (error || !rows || rows.length === 0) {
      return { table, rows: 0, error: error?.message };
    }

    const BATCH = 500;
    let inserted = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += BATCH) {
      const chunk = rows.slice(i, i + BATCH);
      const { error: insertErr } = await newSb.from(table).insert(chunk);
      if (insertErr) {
        for (const row of chunk) {
          const { error: e2 } = await newSb.from(table).insert(row);
          if (e2) failed++;
          else inserted++;
        }
      } else {
        inserted += chunk.length;
      }
    }

    const status = failed > 0 ? `⚠️ ${inserted}/${rows.length} (${failed} failed)` : `✅ ${inserted}/${rows.length}`;
    console.log(`   ${status}`);
    return { table, rows: inserted, failed };
  } catch (e) {
    console.log(`   ❌ ${table}: ${e.message}`);
    return { table, rows: 0, error: e.message };
  }
}

async function main() {
  console.log('🚀 Data Migration');
  console.log('Old: gkbhgrozrzhalnjherfu');
  console.log('New: upaainmhcqlghtsfmtrc\n');

  console.log(`Processing ${TABLES.length} tables...\n`);
  let totalRows = 0;
  let tablesWithData = 0;

  for (const table of TABLES) {
    const result = await migrateData(table);
    if (result.rows > 0) tablesWithData++;
    totalRows += result.rows || 0;
    await sleep(100);
  }

  console.log(`\n📋 Done: ${tablesWithData} tables with data, ${totalRows} rows migrated`);
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
