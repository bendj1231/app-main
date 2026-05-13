/**
 * Universal Commercial Framework Migration Script
 * Parses the markdown file and migrates all data to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse markdown file
const markdownPath = path.join(__dirname, '../docs/universal-commercial-framework-expanded.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

// Helper: Generate ID from text
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Helper: Parse table from markdown lines
function parseTable(lines: string[], startIndex: number): { rows: any[], endIndex: number } {
  const rows = [];
  let i = startIndex;
  
  while (i < lines.length && lines[i].startsWith('|')) {
    const line = lines[i];
    const cells = line
      .split('|')
      .slice(1, -1) // Remove first and last empty cells
      .map(cell => cell.trim());
    
    // Skip separator rows (---)
    if (!cells.every(c => c.replace(/[-\s]/g, '').length === 0)) {
      rows.push(cells);
    }
    i++;
  }
  
  return { rows, endIndex: i - 1 };
}

// Extract all pillar sections
function extractPillars(content: string): any[] {
  const pillars = [];
  const lines = content.split('\n');
  let currentPillar = null;
  let currentSection = null;
  let currentTable = null;
  let orderIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect pillar headers (## PILLAR X: ...)
    const pillarMatch = line.match(/^## PILLAR (\d+):\s*(.+)$/);
    if (pillarMatch) {
      if (currentPillar) {
        pillars.push(currentPillar);
      }
      
      const pillarNum = parseInt(pillarMatch[1]);
      const pillarName = pillarMatch[2].trim();
      
      currentPillar = {
        pillar_number: pillarNum,
        name: pillarName,
        slug: generateId(pillarName),
        sections: [],
        tables: []
      };
      
      currentSection = null;
      currentTable = null;
      orderIndex = 0;
      continue;
    }
    
    // Detect subsections (### ...)
    const sectionMatch = line.match(/^###\s*(.+)$/);
    if (sectionMatch && currentPillar) {
      if (currentTable) {
        currentPillar.tables.push(currentTable);
        currentTable = null;
      }
      
      currentSection = {
        type: 'subsection',
        title: sectionMatch[1].trim(),
        content: [],
        order_index: orderIndex++
      };
      currentPillar.sections.push(currentSection);
      continue;
    }
    
    // Detect table start
    if (line.startsWith('|') && currentPillar) {
      if (!currentTable && currentSection) {
        const { rows, endIndex } = parseTable(lines, i);
        
        if (rows.length > 0) {
          currentTable = {
            title: currentSection.title,
            section_type: inferTableType(currentSection.title),
            headers: rows[0] || [],
            rows: rows.slice(1).map((row, idx) => ({
              cells: row,
              order_index: idx,
              row_type: inferRowType(row)
            })),
            order_index: orderIndex++
          };
          
          i = endIndex;
        }
      }
      continue;
    }
    
    // Collect content for current section
    if (currentSection && line.trim() && !line.startsWith('|') && !line.startsWith('#')) {
      currentSection.content.push(line.trim());
    }
  }
  
  // Push last pillar
  if (currentPillar) {
    if (currentTable) {
      currentPillar.tables.push(currentTable);
    }
    pillars.push(currentPillar);
  }
  
  return pillars;
}

// Infer table type from title
function inferTableType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('program')) return 'programs';
  if (lower.includes('partnership') || lower.includes('package')) return 'partnership';
  if (lower.includes('price') || lower.includes('commission') || lower.includes('tier')) return 'pricing';
  if (lower.includes('comparison') || lower.includes('vs') || lower.includes('current') || lower.includes('state')) return 'comparison';
  if (lower.includes('metric') || lower.includes('statistic')) return 'metrics';
  if (lower.includes('integration') || lower.includes('contribution')) return 'integration';
  return 'comparison';
}

// Infer row type from content
function inferRowType(cells: string[]): string {
  if (cells.length === 0) return 'data';
  
  const firstCell = cells[0] || '';
  
  if (firstCell.includes('KEYNOTE') || firstCell.includes('**KEYNOTE')) {
    return 'keynote';
  }
  
  if (firstCell.includes('PILLAR') || firstCell.match(/^PILLAR\s+\d+/)) {
    return 'pillar_header';
  }
  
  if (firstCell.startsWith('—') || firstCell.startsWith('**—') || firstCell.startsWith('* ')) {
    return 'section_header';
  }
  
  return 'data';
}

// Seed all data to Supabase
async function migrateFramework() {
  console.log('🚀 Starting Universal Commercial Framework migration...\n');
  
  // Extract all pillars
  const pillars = extractPillars(markdownContent);
  console.log(`📊 Found ${pillars.length} pillars to migrate`);
  
  // Get existing pillars from database
  const { data: existingPillars, error: fetchError } = await supabase
    .from('framework_pillars')
    .select('id, pillar_number');
  
  if (fetchError) {
    console.error('Error fetching existing pillars:', fetchError);
    return;
  }
  
  const pillarIdMap = new Map();
  existingPillars?.forEach(p => pillarIdMap.set(p.pillar_number, p.id));
  
  // Migrate each pillar's data
  for (const pillar of pillars) {
    const dbPillarId = pillarIdMap.get(pillar.pillar_number);
    
    if (!dbPillarId) {
      console.log(`⚠️  Pillar ${pillar.pillar_number} not found in database, skipping...`);
      continue;
    }
    
    console.log(`\n📝 Migrating Pillar ${pillar.pillar_number}: ${pillar.name}`);
    
    // 1. Migrate content sections
    for (const section of pillar.sections) {
      const { error: sectionError } = await supabase
        .from('framework_content_sections')
        .upsert({
          pillar_id: dbPillarId,
          section_type: section.type,
          title: section.title,
          content: section.content.join('\n\n'),
          order_index: section.order_index
        }, {
          onConflict: 'pillar_id,title'
        });
      
      if (sectionError) {
        console.error(`  ❌ Error saving section "${section.title}":`, sectionError.message);
      } else {
        console.log(`  ✅ Section: ${section.title.substring(0, 50)}...`);
      }
    }
    
    // 2. Migrate tables
    for (const table of pillar.tables) {
      // Insert table
      const { data: tableData, error: tableError } = await supabase
        .from('framework_tables')
        .upsert({
          pillar_id: dbPillarId,
          table_type: table.section_type,
          title: table.title,
          headers: table.headers,
          order_index: table.order_index
        }, {
          onConflict: 'pillar_id,title'
        })
        .select()
        .single();
      
      if (tableError) {
        console.error(`  ❌ Error saving table "${table.title}":`, tableError.message);
        continue;
      }
      
      // Insert table rows
      for (const row of table.rows) {
        const { error: rowError } = await supabase
          .from('framework_table_rows')
          .upsert({
            table_id: tableData.id,
            row_type: row.row_type,
            cells: row.cells,
            order_index: row.order_index
          });
        
        if (rowError) {
          console.error(`    ❌ Error saving row:`, rowError.message);
        }
      }
      
      console.log(`  ✅ Table: ${table.title.substring(0, 50)}... (${table.rows.length} rows)`);
    }
  }
  
  console.log('\n✨ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Verify data in Supabase dashboard');
  console.log('2. Update framework page to use API instead of markdown');
  console.log('3. Test all 25 pillars display correctly');
}

// Run migration
migrateFramework().catch(console.error);
