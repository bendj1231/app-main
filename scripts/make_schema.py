import json

with open('/var/folders/vv/6twj63_n3bl07w6j5wq_6pfw0000gn/T/windsurf/mcp_output_d5b17d9042e27cb2.txt', 'r') as f:
    data = f.read()

start = data.find('[{')
end = data.rfind('}]') + 2
json_str = data[start:end]
columns = json.loads(json_str)

tables = {}
for col in columns:
    tables.setdefault(col['table_name'], []).append(col)

for t in tables:
    tables[t].sort(key=lambda x: x['ordinal_position'])

def map_type(col):
    if col['data_type'] == 'ARRAY':
        return col['udt_name'].lstrip('_') + '[]'
    if col['data_type'] == 'character varying':
        return f"varchar({col.get('character_maximum_length') or 255})"
    if col['data_type'] == 'timestamp with time zone':
        return 'timestamptz'
    if col['data_type'] == 'double precision':
        return 'double precision'
    return col['data_type']

sql = ""
for table_name, cols in tables.items():
    defs = []
    for col in cols:
        def_str = f"  \"{col['column_name']}\" {map_type(col)}"
        if col['is_nullable'] == 'NO':
            def_str += ' NOT NULL'
        if col['column_default'] and 'nextval' not in col['column_default']:
            d = col['column_default']
            if 'gen_random_uuid' in d:
                d = 'gen_random_uuid()'
            def_str += f' DEFAULT {d}'
        defs.append(def_str)
    sql += f'CREATE TABLE IF NOT EXISTS "public"."{table_name}" (\n{chr(10).join(defs)}\n);\n\n'

with open('/Users/bowler/Documents/apps/app-main/schema_dump.sql', 'w') as f:
    f.write(sql)

print(f"Generated schema_dump.sql with {len(tables)} tables")
