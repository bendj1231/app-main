/**
 * Extract schema from old Supabase project using direct PostgreSQL connection
 * 
 * Usage:
 *   1. Get your old project's connection string:
 *      - Old project Dashboard → Settings → Database → Connection String (Session mode)
 *   2. Run: node scripts/extract-schema.js "postgresql://..."
 *   3. This creates schema_dump.sql
 *   4. Go to new project Dashboard → SQL Editor → paste schema_dump.sql → Run
 */

const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
if (!connectionString) {
  console.error('Usage: node extract-schema.js <connection_string>');
  console.error('Get connection string from: Dashboard → Settings → Database → Connection String');
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to old project');

  const { rows: tables } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  console.log(`Found ${tables.length} tables`);

  let sql = '-- Schema extracted from old project\n\n';

  for (const { table_name } of tables) {
    const { rows: cols } = await client.query(`
      SELECT 
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default,
        character_maximum_length,
        ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [table_name]);

    const defs = cols.map(col => {
      let type = col.data_type;
      if (col.data_type === 'ARRAY') type = col.udt_name.replace(/^_/, '') + '[]';
      else if (col.data_type === 'character varying') type = `varchar(${col.character_maximum_length || 255})`;
      else if (col.data_type === 'timestamp with time zone') type = 'timestamptz';
      else if (col.data_type === 'double precision') type = 'double precision';

      let def = `  "${col.column_name}" ${type}`;
      if (col.is_nullable === 'NO') def += ' NOT NULL';
      if (col.column_default && !col.column_default.includes('nextval')) {
        let d = col.column_default;
        if (d.includes('gen_random_uuid')) d = 'gen_random_uuid()';
        def += ` DEFAULT ${d}`;
      }
      return def;
    });

    sql += `CREATE TABLE IF NOT EXISTS "public"."${table_name}" (\n${defs.join(',\n')}\n);\n\n`;
  }

  fs.writeFileSync('schema_dump.sql', sql);
  console.log(`\n✅ Written schema_dump.sql with ${tables.length} tables`);
  console.log('Next: Paste contents into new project SQL Editor and run');

  await client.end();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
