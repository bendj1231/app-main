/**
 * Migration Script: Supabase → D1
 * Run: node worker/migrate.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
const WORKER_URL = process.env.VITE_WORKER_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';

async function migrateProfiles() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('📡 Fetching profiles from Supabase...');

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Supabase error:', error);
    process.exit(1);
  }

  console.log(`📋 Found ${profiles?.length || 0} profiles to migrate`);

  if (!profiles || profiles.length === 0) {
    console.log('✅ No profiles to migrate');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const profile of profiles) {
    try {
      // Map Supabase profile to D1 format
      const payload = {
        auth0_id: profile.auth0_id || profile.uid || '',
        email: profile.email || '',
        name: profile.display_name || profile.full_name || '',
        display_name: profile.display_name || profile.full_name || null,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        role: profile.role || 'pilot',
        status: profile.status || 'active',
        avatar_url: profile.avatar_url || null,
        phone: profile.phone || null,
        address: profile.address || null,
        date_of_birth: profile.date_of_birth || null,
        nationality: profile.nationality || null,
        current_flight_hours: profile.current_flight_hours || 0,
        total_flight_hours: profile.total_flight_hours || 0,
        mentorship_hours: profile.mentorship_hours || 0,
        foundation_progress: profile.foundation_progress || 0,
        overall_recognition_score: profile.overall_recognition_score || 0,
        current_level: profile.current_level || 'Foundation',
        current_occupation: profile.current_occupation || null,
        license_id: profile.license_id || null,
        country_of_license: profile.country_of_license || null,
        ratings: profile.ratings || null,
        pilot_id: profile.pilot_id || null,
        enrolled_programs: profile.enrolled_programs || null,
        app_access: profile.app_access || null,
        is_enrolled_in_foundational: profile.is_enrolled_in_foundational || false,
        recognition_tier: profile.recognition_tier || 'Bronze',
        subscription_tier: profile.subscription_tier || 'free',
      };

      const res = await fetch(`${WORKER_URL}/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createProfile', params: payload }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      success++;
      process.stdout.write(`\r✅ ${success}/${profiles.length} migrated`);
    } catch (err) {
      failed++;
      console.error(`\n❌ Failed to migrate profile ${profile.id}:`, err.message);
    }
  }

  console.log(`\n\n🎉 Migration complete: ${success} success, ${failed} failed`);
}

migrateProfiles().catch(console.error);
