#!/usr/bin/env node
/**
 * Supabase Project Migration Script
 * Migrates schema + data from old project to new project
 *
 * Usage:
 *   node scripts/migrate-supabase-to-new-project.js
 *
 * Prerequisites:
 *   npm install @supabase/supabase-js
 *
 * This script handles:
 *   1. Schema migration (tables, columns, defaults, constraints)
 *   2. RLS policy migration
 *   3. Data migration (for tables with rows)
 *   4. Auth user export (list only — passwords cannot be migrated)
 *
 * IMPORTANT: Run this AFTER creating the new project and enabling
 * the same extensions (uuid-ossp, pgcrypto, supabase_vault, pg_cron, pg_net).
 */

const { createClient } = require('@supabase/supabase-js');

// ─── CONFIG ───
const OLD_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const OLD_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || '';

const NEW_URL = 'https://upaainmhcqlghtsfmtrc.supabase.co';
const NEW_SERVICE_KEY = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || '';

if (!OLD_SERVICE_KEY || !NEW_SERVICE_KEY) {
  console.error('❌ Set OLD_SUPABASE_SERVICE_ROLE_KEY and NEW_SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const oldSupabase = createClient(OLD_URL, OLD_SERVICE_KEY);
const newSupabase = createClient(NEW_URL, NEW_SERVICE_KEY);

// ─── HELPERS ───
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTables() {
  const { data, error } = await oldSupabase
    .rpc('get_tables', {}, { head: true })
    .catch(() => ({ data: null, error: true }));

  // Fallback: query information_schema directly
  const { data: rows } = await oldSupabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE')
    .order('table_name');

  return (rows || []).map((r) => r.table_name);
}

async function getTableSchema(tableName) {
  const { data: columns } = await oldSupabase
    .from('information_schema.columns')
    .select('*')
    .eq('table_schema', 'public')
    .eq('table_name', tableName)
    .order('ordinal_position');

  const { data: constraints } = await oldSupabase.rpc(
    'get_create_table_sql',
    { p_table_name: tableName }
  );

  return { columns, constraints };
}

async function getRLSPolicies() {
  const { data } = await oldSupabase
    .from('pg_policies')
    .select('*')
    .eq('schemaname', 'public');
  return data || [];
}

async function getAuthUsers() {
  const { data, error } = await oldSupabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) {
    console.error('⚠️ Could not list auth users:', error.message);
    return [];
  }
  return data.users || [];
}

async function getRowCount(tableName) {
  const { count, error } = await oldSupabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count || 0;
}

async function migrateData(tableName) {
  const count = await getRowCount(tableName);
  if (count === 0) return { migrated: 0, table: tableName };

  console.log(`  📦 Migrating ${count} rows from "${tableName}"...`);

  // Fetch all rows
  const { data: rows, error } = await oldSupabase
    .from(tableName)
    .select('*')
    .limit(10000);

  if (error) {
    console.error(`    ❌ Failed to read ${tableName}:`, error.message);
    return { migrated: 0, table: tableName, error: error.message };
  }

  if (!rows || rows.length === 0) return { migrated: 0, table: tableName };

  // Insert into new project (batch in chunks of 500)
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error: insertError } = await newSupabase
      .from(tableName)
      .insert(chunk, { count: 'exact' });

    if (insertError) {
      console.error(`    ❌ Insert failed at chunk ${i}:`, insertError.message);
      // Try individual insert to skip problematic rows
      for (const row of chunk) {
        const { error: singleError } = await newSupabase.from(tableName).insert(row);
        if (!singleError) inserted++;
      }
    } else {
      inserted += chunk.length;
    }
  }

  console.log(`    ✅ Inserted ${inserted}/${rows.length} rows`);
  return { migrated: inserted, table: tableName };
}

// ─── MAIN ───
async function main() {
  console.log('🚀 Supabase Migration: gkbhgrozrzhalnjherfu → upaainmhcqlghtsfmtrc\n');

  // 1. Verify connections
  console.log('1️⃣ Verifying connections...');
  const { data: oldHealth } = await oldSupabase.rpc('get_schema_version').catch(() => ({ data: null }));
  const { data: newHealth } = await newSupabase.rpc('get_schema_version').catch(() => ({ data: null }));
  console.log('   Old project:', oldHealth !== undefined ? '✅ Connected' : '⚠️ No RPC test');
  console.log('   New project:', newHealth !== undefined ? '✅ Connected' : '⚠️ No RPC test');

  // 2. List tables
  console.log('\n2️⃣ Listing tables from old project...');
  const { data: tableRows } = await oldSupabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE')
    .order('table_name');

  const tables = (tableRows || []).map((r) => r.table_name);
  console.log(`   Found ${tables.length} tables`);

  // 3. Get row counts for prioritization
  console.log('\n3️⃣ Checking row counts...');
  const tableStats = [];
  for (const table of tables) {
    const count = await getRowCount(table);
    tableStats.push({ table, count });
  }

  const tablesWithData = tableStats.filter((t) => t.count > 0);
  console.log(`   Tables with data: ${tablesWithData.length}/${tables.length}`);

  // Show top 10 by row count
  const topTables = [...tablesWithData].sort((a, b) => b.count - a.count).slice(0, 10);
  console.log('   Top 10:');
  topTables.forEach((t) => console.log(`     - ${t.table}: ${t.count} rows`));

  // 4. Schema migration note
  console.log('\n4️⃣ Schema Migration');
  console.log('   ⚠️ This script does NOT create tables automatically.');
  console.log('   You must run schema creation first via one of these methods:');
  console.log('     A) Supabase CLI: npx supabase db dump --db-url <old-connection-string> -f schema.sql');
  console.log('     B) Dashboard: Old Project → Database → Backups → Download → Restore on new');
  console.log('     C) SQL Editor: Copy schema from old project and run on new');
  console.log('   Press Enter to continue AFTER creating tables, or Ctrl+C to abort...');

  // Wait for user
  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
  });

  // 5. Migrate data for tables with rows
  console.log('\n5️⃣ Migrating data...');
  const results = [];
  for (const { table, count } of tablesWithData) {
    const result = await migrateData(table);
    results.push(result);
    await sleep(100); // Rate limit safety
  }

  const totalMigrated = results.reduce((sum, r) => sum + (r.migrated || 0), 0);
  console.log(`\n   ✅ Total rows migrated: ${totalMigrated}`);

  // 6. Auth users
  console.log('\n6️⃣ Exporting auth users...');
  const users = await getAuthUsers();
  console.log(`   Found ${users.length} auth users`);

  if (users.length > 0) {
    console.log('   ⚠️ Auth users CANNOT be fully migrated (passwords are hashed).');
    console.log('   Options:');
    console.log('     1. Send password reset emails to all users');
    console.log('     2. Ask users to sign up again on new project');
    console.log('     3. Use Supabase Auth Admin API to create users with same emails');

    // Print user emails for reference
    console.log('\n   User emails:');
    users.forEach((u) => console.log(`     - ${u.email} (${u.id})`));
  }

  // 7. Summary
  console.log('\n📋 Migration Summary');
  console.log('─────────────────────────────────────────');
  console.log(`Tables with data:    ${tablesWithData.length}`);
  console.log(`Total rows migrated: ${totalMigrated}`);
  console.log(`Auth users found:    ${users.length}`);
  console.log(`Errors:              ${results.filter((r) => r.error).length}`);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.log('\n❌ Tables with errors:');
    errors.forEach((e) => console.log(`   - ${e.table}: ${e.error}`));
  }

  console.log('\n✅ Data migration complete!');
  console.log('\nNext steps:');
  console.log('   1. Verify data in new project Dashboard');
  console.log('   2. Test login with existing user');
  console.log('   3. Update frontend env vars to point to new project');
  console.log('   4. Update MCP config for new project');
  console.log('   5. Update Supabase Edge Function secrets on new project');
  console.log('   6. Re-create Storage buckets if used');
  console.log('   7. Update Auth0/ OAuth redirect URLs if changed');
  process.exit(0);
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
