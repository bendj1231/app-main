/**
 * Framework Admin API
 * Functions for managing Universal Commercial Framework content
 * Use these for programmatic updates or build an admin UI
 */

import { supabase } from '@/shared/lib/supabase';
import type {
  FrameworkPillar,
  FrameworkContentSection,
  FrameworkTable,
  FrameworkTableRow,
  FrameworkStakeholder
} from '@/types/framework-db';

// ==================== PILLAR MANAGEMENT ====================

/**
 * Create a new pillar
 */
export async function createPillar(pillar: Omit<FrameworkPillar, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('framework_pillars')
    .insert(pillar)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update a pillar
 */
export async function updatePillar(pillarNumber: number, updates: Partial<FrameworkPillar>) {
  const { data, error } = await supabase
    .from('framework_pillars')
    .update(updates)
    .eq('pillar_number', pillarNumber)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update pillar icon
 */
export async function updatePillarIcon(pillarNumber: number, icon: string) {
  return updatePillar(pillarNumber, { icon });
}

/**
 * Update pillar description
 */
export async function updatePillarDescription(pillarNumber: number, description: string) {
  return updatePillar(pillarNumber, { description });
}

// ==================== CONTENT SECTION MANAGEMENT ====================

/**
 * Add content section to a pillar
 */
export async function addContentSection(
  pillarNumber: number,
  section: Omit<FrameworkContentSection, 'id' | 'pillar_id' | 'created_at' | 'updated_at'>
) {
  // Get pillar ID
  const { data: pillar } = await supabase
    .from('framework_pillars')
    .select('id')
    .eq('pillar_number', pillarNumber)
    .single();
  
  if (!pillar) throw new Error(`Pillar ${pillarNumber} not found`);
  
  const { data, error } = await supabase
    .from('framework_content_sections')
    .insert({ ...section, pillar_id: pillar.id })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update content section
 */
export async function updateContentSection(sectionId: string, updates: Partial<FrameworkContentSection>) {
  const { data, error } = await supabase
    .from('framework_content_sections')
    .update(updates)
    .eq('id', sectionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Delete content section
 */
export async function deleteContentSection(sectionId: string) {
  const { error } = await supabase
    .from('framework_content_sections')
    .delete()
    .eq('id', sectionId);
  
  if (error) throw error;
}

/**
 * Reorder content sections
 */
export async function reorderContentSections(pillarNumber: number, sectionIds: string[]) {
  const updates = sectionIds.map((id, index) => 
    supabase
      .from('framework_content_sections')
      .update({ order_index: index })
      .eq('id', id)
  );
  
  await Promise.all(updates);
}

// ==================== TABLE MANAGEMENT ====================

/**
 * Add table to a pillar
 */
export async function addTable(
  pillarNumber: number,
  table: Omit<FrameworkTable, 'id' | 'pillar_id' | 'created_at' | 'updated_at'>
) {
  const { data: pillar } = await supabase
    .from('framework_pillars')
    .select('id')
    .eq('pillar_number', pillarNumber)
    .single();
  
  if (!pillar) throw new Error(`Pillar ${pillarNumber} not found`);
  
  const { data, error } = await supabase
    .from('framework_tables')
    .insert({ ...table, pillar_id: pillar.id })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Add row to a table
 */
export async function addTableRow(
  tableId: string,
  row: Omit<FrameworkTableRow, 'id' | 'table_id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('framework_table_rows')
    .insert({ ...row, table_id: tableId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update table row
 */
export async function updateTableRow(rowId: string, updates: Partial<FrameworkTableRow>) {
  const { data, error } = await supabase
    .from('framework_table_rows')
    .update(updates)
    .eq('id', rowId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Delete table row
 */
export async function deleteTableRow(rowId: string) {
  const { error } = await supabase
    .from('framework_table_rows')
    .delete()
    .eq('id', rowId);
  
  if (error) throw error;
}

/**
 * Delete entire table (and all its rows)
 */
export async function deleteTable(tableId: string) {
  // Rows will be deleted via CASCADE
  const { error } = await supabase
    .from('framework_tables')
    .delete()
    .eq('id', tableId);
  
  if (error) throw error;
}

// ==================== STAKEHOLDER MANAGEMENT ====================

/**
 * Create stakeholder
 */
export async function createStakeholder(
  stakeholder: Omit<FrameworkStakeholder, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('framework_stakeholders')
    .insert(stakeholder)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Link stakeholder to pillar
 */
export async function linkStakeholderToPillar(
  pillarNumber: number,
  stakeholderSlug: string,
  relationshipType: string,
  specificRequirements?: Record<string, any>
) {
  const { data: pillar } = await supabase
    .from('framework_pillars')
    .select('id')
    .eq('pillar_number', pillarNumber)
    .single();
  
  const { data: stakeholder } = await supabase
    .from('framework_stakeholders')
    .select('id')
    .eq('slug', stakeholderSlug)
    .single();
  
  if (!pillar || !stakeholder) {
    throw new Error('Pillar or stakeholder not found');
  }
  
  const { data, error } = await supabase
    .from('framework_pillar_stakeholders')
    .insert({
      pillar_id: pillar.id,
      stakeholder_id: stakeholder.id,
      relationship_type: relationshipType,
      specific_requirements: specificRequirements
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== BULK OPERATIONS ====================

/**
 * Clone a pillar's structure to create a new one
 */
export async function clonePillar(
  sourcePillarNumber: number,
  newPillarNumber: number,
  newName: string,
  newSlug: string
) {
  // Get source pillar
  const { data: source } = await supabase
    .from('framework_pillars')
    .select('*, content_sections:framework_content_sections(*), tables:framework_tables(*, rows:framework_table_rows(*))')
    .eq('pillar_number', sourcePillarNumber)
    .single();
  
  if (!source) throw new Error('Source pillar not found');
  
  // Create new pillar
  const { data: newPillar } = await supabase
    .from('framework_pillars')
    .insert({
      pillar_number: newPillarNumber,
      name: newName,
      slug: newSlug,
      hub_name: source.hub_name,
      hub_order: source.hub_order,
      description: source.description,
      icon: source.icon,
      color_code: source.color_code
    })
    .select()
    .single();
  
  // Clone content sections
  if (source.content_sections?.length > 0) {
    const sections = source.content_sections.map((s: any) => ({
      pillar_id: newPillar.id,
      section_type: s.section_type,
      title: s.title,
      content: s.content,
      order_index: s.order_index
    }));
    
    await supabase.from('framework_content_sections').insert(sections);
  }
  
  // Clone tables and rows
  if (source.tables?.length > 0) {
    for (const table of source.tables) {
      const { data: newTable } = await supabase
        .from('framework_tables')
        .insert({
          pillar_id: newPillar.id,
          table_type: table.table_type,
          title: table.title,
          description: table.description,
          headers: table.headers,
          order_index: table.order_index
        })
        .select()
        .single();
      
      if (table.rows?.length > 0) {
        const rows = table.rows.map((r: any) => ({
          table_id: newTable.id,
          row_type: r.row_type,
          cells: r.cells,
          order_index: r.order_index,
          is_clickable: r.is_clickable,
          link_target: r.link_target
        }));
        
        await supabase.from('framework_table_rows').insert(rows);
      }
    }
  }
  
  return newPillar;
}

/**
 * Export pillar data to JSON (for backup)
 */
export async function exportPillar(pillarNumber: number) {
  const { data } = await supabase
    .from('framework_pillars')
    .select(`
      *,
      content_sections:framework_content_sections(*),
      tables:framework_tables(*, rows:framework_table_rows(*))
    `)
    .eq('pillar_number', pillarNumber)
    .single();
  
  return data;
}

/**
 * Import pillar data from JSON
 */
export async function importPillar(pillarData: any, newPillarNumber?: number) {
  const { id, created_at, updated_at, ...pillarFields } = pillarData;
  
  const { data: newPillar } = await supabase
    .from('framework_pillars')
    .insert({
      ...pillarFields,
      pillar_number: newPillarNumber || pillarFields.pillar_number
    })
    .select()
    .single();
  
  // Import content sections
  if (pillarData.content_sections?.length > 0) {
    const sections = pillarData.content_sections.map((s: any) => {
      const { id, pillar_id, created_at, updated_at, ...sectionFields } = s;
      return {
        ...sectionFields,
        pillar_id: newPillar.id
      };
    });
    
    await supabase.from('framework_content_sections').insert(sections);
  }
  
  // Import tables
  if (pillarData.tables?.length > 0) {
    for (const table of pillarData.tables) {
      const { id, pillar_id, created_at, updated_at, rows, ...tableFields } = table;
      
      const { data: newTable } = await supabase
        .from('framework_tables')
        .insert({ ...tableFields, pillar_id: newPillar.id })
        .select()
        .single();
      
      if (rows?.length > 0) {
        const tableRows = rows.map((r: any) => {
          const { id, table_id, created_at, ...rowFields } = r;
          return { ...rowFields, table_id: newTable.id };
        });
        
        await supabase.from('framework_table_rows').insert(tableRows);
      }
    }
  }
  
  return newPillar;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Search framework content
 */
export async function searchFramework(query: string) {
  const [pillars, sections, tables] = await Promise.all([
    supabase
      .from('framework_pillars')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`),
    
    supabase
      .from('framework_content_sections')
      .select('*, pillar:framework_pillars(pillar_number, name)')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`),
    
    supabase
      .from('framework_tables')
      .select('*, pillar:framework_pillars(pillar_number, name)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  ]);
  
  return {
    pillars: pillars.data || [],
    sections: sections.data || [],
    tables: tables.data || []
  };
}

/**
 * Get framework statistics
 */
export async function getFrameworkStats() {
  const { data: counts, error } = await supabase.rpc('get_framework_stats');
  
  if (error) {
    // Fallback if RPC doesn't exist
    const [
      { count: pillars },
      { count: sections },
      { count: tables },
      { count: rows },
      { count: stakeholders }
    ] = await Promise.all([
      supabase.from('framework_pillars').select('*', { count: 'exact', head: true }),
      supabase.from('framework_content_sections').select('*', { count: 'exact', head: true }),
      supabase.from('framework_tables').select('*', { count: 'exact', head: true }),
      supabase.from('framework_table_rows').select('*', { count: 'exact', head: true }),
      supabase.from('framework_stakeholders').select('*', { count: 'exact', head: true })
    ]);
    
    return { pillars, sections, tables, rows, stakeholders };
  }
  
  return counts;
}
