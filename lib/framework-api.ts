/**
 * Framework API Service
 * Fetches Universal Commercial Framework data from Supabase
 */

import { supabase } from '@/shared/lib/supabase';
import type {
  FrameworkPillar,
  FrameworkContentSection,
  FrameworkTable,
  FrameworkTableRow,
  FrameworkStakeholder,
  FrameworkDocument,
  PillarDetailResponse,
  FrameworkDataResponse
} from '@/types/framework-db';

/**
 * Get all framework pillars
 */
export async function getFrameworkPillars(): Promise<FrameworkPillar[]> {
  const { data, error } = await supabase
    .from('framework_pillars')
    .select('*')
    .eq('is_active', true)
    .order('pillar_number');

  if (error) {
    console.error('Error fetching framework pillars:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get framework document metadata
 */
export async function getFrameworkDocument(): Promise<FrameworkDocument | null> {
  const { data, error } = await supabase
    .from('framework_document')
    .select('*')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching framework document:', error);
    return null;
  }

  return data;
}

/**
 * Get all stakeholders
 */
export async function getFrameworkStakeholders(): Promise<FrameworkStakeholder[]> {
  const { data, error } = await supabase
    .from('framework_stakeholders')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching stakeholders:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get pillar detail with all content, tables, and rows
 */
export async function getPillarDetail(pillarNumber: number): Promise<PillarDetailResponse | null> {
  // Get pillar
  const { data: pillar, error: pillarError } = await supabase
    .from('framework_pillars')
    .select('*')
    .eq('pillar_number', pillarNumber)
    .single();

  if (pillarError || !pillar) {
    console.error('Error fetching pillar:', pillarError);
    return null;
  }

  // Get content sections
  const { data: contentSections, error: sectionsError } = await supabase
    .from('framework_content_sections')
    .select('*')
    .eq('pillar_id', pillar.id)
    .order('order_index');

  if (sectionsError) {
    console.error('Error fetching content sections:', sectionsError);
  }

  // Get tables with rows
  const { data: tables, error: tablesError } = await supabase
    .from('framework_tables')
    .select(`
      *,
      rows:framework_table_rows(*)
    `)
    .eq('pillar_id', pillar.id)
    .order('order_index');

  if (tablesError) {
    console.error('Error fetching tables:', tablesError);
  }

  // Get related stakeholders
  const { data: stakeholderRelations, error: relationsError } = await supabase
    .from('framework_pillar_stakeholders')
    .select(`
      stakeholder:framework_stakeholders(*)
    `)
    .eq('pillar_id', pillar.id);

  if (relationsError) {
    console.error('Error fetching stakeholder relations:', relationsError);
  }

  const stakeholders = stakeholderRelations?.map(r => r.stakeholder) || [];

  return {
    pillar,
    content_sections: contentSections || [],
    tables: tables || [],
    stakeholders
  };
}

/**
 * Get complete framework data
 */
export async function getCompleteFrameworkData(): Promise<FrameworkDataResponse> {
  const [pillars, document, stakeholders] = await Promise.all([
    getFrameworkPillars(),
    getFrameworkDocument(),
    getFrameworkStakeholders()
  ]);

  return {
    pillars,
    document: document || {
      id: '',
      version: '10.0-Expanded',
      total_pillars: 25,
      stakeholder_hubs: 7,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as FrameworkDocument,
    stakeholders
  };
}

/**
 * Get tables for a specific pillar
 */
export async function getPillarTables(pillarId: number): Promise<(FrameworkTable & { rows: FrameworkTableRow[] })[]> {
  const { data, error } = await supabase
    .from('framework_tables')
    .select(`
      *,
      rows:framework_table_rows(*)
    `)
    .eq('pillar_id', pillarId)
    .order('order_index');

  if (error) {
    console.error('Error fetching pillar tables:', error);
    throw error;
  }

  return data || [];
}

/**
 * Search framework content
 */
export async function searchFrameworkContent(query: string): Promise<{
  pillars: FrameworkPillar[];
  sections: (FrameworkContentSection & { pillar: FrameworkPillar })[];
}> {
  // Search pillars
  const { data: pillars, error: pillarsError } = await supabase
    .from('framework_pillars')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true);

  if (pillarsError) {
    console.error('Error searching pillars:', pillarsError);
  }

  // Search content sections
  const { data: sections, error: sectionsError } = await supabase
    .from('framework_content_sections')
    .select(`
      *,
      pillar:framework_pillars(*)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

  if (sectionsError) {
    console.error('Error searching sections:', sectionsError);
  }

  return {
    pillars: pillars || [],
    sections: sections || []
  };
}
