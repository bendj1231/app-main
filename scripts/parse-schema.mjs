import fs from 'fs';

const data = fs.readFileSync('/var/folders/vv/6twj63_n3bl07w6j5wq_6pfw0000gn/T/windsurf/mcp_output_d5b17d9042e27cb2.txt', 'utf8');

const start = data.indexOf('[{');
const end = data.lastIndexOf('}]') + 2;
const jsonStr = data.slice(start, end);
const columns = JSON.parse(jsonStr);

const tables = {};
for (const col of columns) {
  if (!tables[col.table_name]) tables[col.table_name] = [];
  tables[col.table_name].push(col);
}

for (const t of Object.keys(tables)) {
  tables[t].sort((a, b) => a.ordinal_position - b.ordinal_position);
}

function mapType(col) {
  if (col.data_type === 'ARRAY') return col.udt_name.replace(/^_/, '') + '[]';
  if (col.data_type === 'character varying') return `varchar(${col.character_maximum_length || 255})`;
  if (col.data_type === 'timestamp with time zone') return 'timestamptz';
  if (col.data_type === 'double precision') return 'double precision';
  return col.data_type;
}

let sql = '';
for (const [tableName, cols] of Object.entries(tables)) {
  const defs = cols.map(col => {
    let def = `  "${col.column_name}" ${mapType(col)}`;
    if (col.is_nullable === 'NO') def += ' NOT NULL';
    if (col.column_default && !col.column_default.includes('nextval')) {
      let d = col.column_default;
      if (d.includes('gen_random_uuid')) d = 'gen_random_uuid()';
      def += ` DEFAULT ${d}`;
    }
    return def;
  });
  sql += `CREATE TABLE IF NOT EXISTS "public"."${tableName}" (\n${defs.join(',\n')}\n);\n\n`;
}

fs.writeFileSync('/Users/bowler/Documents/apps/app-main/schema_dump.sql', sql);
console.log('Generated schema_dump.sql with ' + Object.keys(tables).length + ' tables');
