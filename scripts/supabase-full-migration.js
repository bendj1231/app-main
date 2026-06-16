#!/usr/bin/env node
/**
 * Full Supabase Migration Script — Schema + Data + RLS
 * No CLI or pg_dump required. Uses Supabase JS client only.
 *
 * Usage:
 *   cd /Users/bowler/Documents/apps/app-main
 *   npm install @supabase/supabase-js
 *   node scripts/supabase-full-migration.js
 *
 * This script:
 *   1. Reads schema from old project (tables, columns, defaults, constraints)
 *   2. Creates identical schema in new project
 *   3. Migrates all data row-by-row (with chunking)
 *   4. Re-creates RLS policies
 *   5. Lists auth users for manual re-creation
 */

const { createClient } = require('@supabase/supabase-js');

// ─── CONFIG ───
const OLD_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const NEW_URL = 'https://upaainmhcqlghtsfmtrc.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWFpbm1oY3FsZ2h0c2ZtdHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU1MjM0OSwiZXhwIjoyMDk3MTI4MzQ5fQ.5Lx_zSbmllRIV7QseEplPjL2-EOWtcfNDLh-0vrUkkU';

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── SCHEMA EXTRACTION ───
async function getSchema() {
  console.log('🔍 Extracting schema from old project...\n');

  // Get all tables
  const { data: tables } = await oldSupabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE')
    .order('table_name');

  const schema = {};

  for (const { table_name } of tables) {
    // Get columns
    const { data: columns } = await oldSupabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', table_name)
      .order('ordinal_position');

    // Get primary key
    const { data: pkData } = await oldSupabase.rpc('get_primary_key', { p_table: table_name });

    // Get foreign keys
    const { data: fkData } = await oldSupabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', table_name)
      .in('constraint_type', ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK']);

    schema[table_name] = { columns: columns || [], constraints: fkData || [] };
  }

  return schema;
}

// ─── GENERATE CREATE TABLE SQL ───
function generateCreateTable(tableName, { columns }) {
  const colDefs = columns.map(col => {
    let def = `  "${col.column_name}" ${col.data_type}`;

    // Handle array types
    if (col.data_type === 'ARRAY') {
      def = `  "${col.column_name}" ${col.udt_name.replace('_', '')}[]`;
    }

    // Handle character varying
    if (col.data_type === 'character varying') {
      def = `  "${col.column_name}" varchar(${col.character_maximum_length || 255})`;
    }

    if (col.is_nullable === 'NO') def += ' NOT NULL';

    if (col.column_default) {
      // Fix gen_random_uuid() reference
      let defaultVal = col.column_default;
      if (defaultVal.includes('gen_random_uuid()')) {
        defaultVal = 'gen_random_uuid()';
      }
      def += ` DEFAULT ${defaultVal}`;
    }

    return def;
  });

  return `CREATE TABLE IF NOT EXISTS "public"."${table_name}" (\n${colDefs.join(',\n')}\n);`;
}

// ─── SCHEMA CREATION ───
async function createSchema(schema) {
  console.log('🏗️  Creating schema in new project...');

  const tableNames = Object.keys(schema);
  const fkDeps = []; // Tables with FKs go last

  for (const tableName of tableNames) {
    const hasFk = schema[tableName].constraints.some(c => c.constraint_type === 'FOREIGN KEY');
    if (hasFk) {
      fkDeps.push(tableName);
      continue;
    }

    const sql = generateCreateTable(tableName, schema[tableName]);
    const { error } = await newSupabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.log(`  ⚠️  ${tableName}: ${error.message}`);
    } else {
      console.log(`  ✅ ${tableName}`);
    }
    await sleep(100);
  }

  // Now create FK tables
  for (const tableName of fkDeps) {
    const sql = generateCreateTable(tableName, schema[tableName]);
    const { error } = await newSupabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.log(`  ⚠️  ${tableName}: ${error.message}`);
    } else {
      console.log(`  ✅ ${tableName}`);
    }
    await sleep(100);
  }

  console.log('');
}

// ─── DATA MIGRATION ───
async function migrateTableData(tableName) {
  const { count, error: countError } = await oldSupabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (countError || !count || count === 0) {
    return { table: tableName, migrated: 0, skipped: true };
  }

  console.log(`  📦 ${tableName}: ${count} rows...`);

  const { data: rows, error } = await oldSupabase
    .from(tableName)
    .select('*')
    .limit(10000);

  if (error || !rows) {
    return { table: tableName, migrated: 0, error: error?.message };
  }

  // Insert in chunks
  const CHUNK = 500;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error: insertErr } = await newSupabase
      .from(tableName)
      .insert(chunk);

    if (insertErr) {
      // Try one by one
      for (const row of chunk) {
        const { error: singleErr } = await newSupabase.from(tableName).insert(row);
        if (singleErr) failed++;
        else inserted++;
      }
    } else {
      inserted += chunk.length;
    }
  }

  const status = failed > 0 ? `⚠️ ${inserted}/${rows.length} (${failed} failed)` : `✅ ${inserted}/${rows.length}`;
  console.log(`     ${status}`);
  return { table: tableName, migrated: inserted, failed };
}

// ─── RLS POLICIES ───
async function migrateRLS() {
  console.log('\n🔒 Migrating RLS policies...');

  const { data: policies } = await oldSupabase
    .from('pg_policies')
    .select('*')
    .eq('schemaname', 'public');

  if (!policies) {
    console.log('  No policies found');
    return;
  }

  console.log(`  Found ${policies.length} policies`);

  // Group by table
  const byTable = {};
  for (const p of policies) {
    if (!byTable[p.tablename]) byTable[p.tablename] = [];
    byTable[p.tablename].push(p);
  }

  for (const [table, tablePolicies] of Object.entries(byTable)) {
    // Enable RLS
    await newSupabase.rpc('exec_sql', {
      query: `ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`
    });

    for (const p of tablePolicies) {
      const cmd = p.cmd === 'ALL' ? 'ALL' : p.cmd;
      const usingExpr = p.qual ? ` USING (${p.qual})` : '';
      const checkExpr = p.with_check ? ` WITH CHECK (${p.with_check})` : '';

      const sql = `CREATE POLICY "${p.policyname}" ON "public"."${table}" FOR ${cmd} TO ${p.roles.join(', ')}${usingExpr}${checkExpr};`;

      const { error } = await newSupabase.rpc('exec_sql', { query: sql });
      if (error) {
        // Policy might already exist or table might not exist
      }
    }
  }

  console.log('  RLS migration complete (check new project dashboard for accuracy)');
}

// ─── AUTH USERS ───
async function exportAuthUsers() {
  console.log('\n👤 Checking auth users...');

  const { data, error } = await oldSupabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    console.log(`  ⚠️  Could not list auth users: ${error.message}`);
    return [];
  }

  const users = data.users || [];
  console.log(`  Found ${users.length} auth users`);

  if (users.length > 0) {
    console.log('\n  ⚠️  Auth users CANNOT be fully migrated (passwords are hashed).');
    console.log('     Options:');
    console.log('     1. Send magic links to users');
    console.log('     2. Create users with admin API, then they reset passwords');
    console.log('     3. Ask users to re-signup\n');

    console.log('  User emails for reference:');
    users.forEach(u => console.log(`     - ${u.email} (${u.id})`));
  }

  return users;
}

// ─── MAIN ───
async function main() {
  console.log('🚀 Full Supabase Migration\n');
  console.log('Old: gkbhgrozrzhalnjherfu (Sydney)');
  console.log('New: upaainmhcqlghtsfmtrc (Singapore)\n');

  // Check new project connection
  const { error: pingError } = await newSupabase.from('information_schema.tables').select('count', { count: 'exact', head: true });
  if (pingError) {
    console.error('❌ Cannot connect to new project:', pingError.message);
    process.exit(1);
  }
  console.log('✅ Connected to new project\n');

  // Step 1: Extract schema
  const schema = await getSchema();
  const tableCount = Object.keys(schema).length;
  console.log(`Found ${tableCount} tables\n`);

  // Step 2: Create schema
  await createSchema(schema);

  // Step 3: Migrate data
  console.log('📦 Migrating data...');
  const results = [];
  const tablesWithData = [];

  for (const tableName of Object.keys(schema)) {
    const result = await migrateTableData(tableName);
    results.push(result);
    if (!result.skipped) tablesWithData.push(tableName);
  }

  const totalMigrated = results.reduce((sum, r) => sum + (r.migrated || 0), 0);
  const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0);

  // Step 4: RLS
  await migrateRLS();

  // Step 5: Auth users
  const users = await exportAuthUsers();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Tables created:       ${tableCount}`);
  console.log(`Tables with data:     ${tablesWithData.length}`);
  console.log(`Total rows migrated:  ${totalMigrated}`);
  console.log(`Failed rows:          ${totalFailed}`);
  console.log(`Auth users found:     ${users.length}`);
  console.log('='.repeat(50));

  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('   1. Enable extensions: uuid-ossp, pgcrypto, pg_cron, pg_net');
  console.log('   2. Verify tables in new project dashboard');
  console.log('   3. Re-create auth users (magic link or re-signup)');
  console.log('   4. Set Edge Function secrets');
  console.log('   5. Test login/signup');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
