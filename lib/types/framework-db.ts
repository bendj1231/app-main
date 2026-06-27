/**
 * Framework Database Types
 * Generated from Supabase schema for Universal Commercial Framework
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Framework Pillar
export interface FrameworkPillar {
  id: number;
  pillar_number: number;
  name: string;
  slug: string;
  hub_name: string;
  hub_order: number;
  description: string | null;
  current_state_summary: string | null;
  framework_target_summary: string | null;
  icon: string | null;
  color_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Framework Content Section
export interface FrameworkContentSection {
  id: string;
  pillar_id: number;
  section_type: 'what_we_require' | 'preferred_contributions' | 'programs' | 'for_pilots' | 'for_stakeholders' | 'keynote' | 'subsection';
  title: string;
  content: string | null;
  order_index: number;
  parent_section_id: string | null;
  created_at: string;
  updated_at: string;
}

// Framework Table
export interface FrameworkTable {
  id: string;
  pillar_id: number;
  table_type: 'comparison' | 'partnership' | 'programs' | 'pricing' | 'metrics' | 'integration';
  title: string;
  description: string | null;
  headers: Json;
  footer_notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Framework Table Row
export interface FrameworkTableRow {
  id: string;
  table_id: string;
  row_type: 'data' | 'section_header' | 'keynote' | 'pillar_header';
  cells: Json;
  order_index: number;
  link_target: string | null;
  is_clickable: boolean;
  created_at: string;
}

// Framework Stakeholder
export interface FrameworkStakeholder {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  contribution_summary: string | null;
  what_they_receive: string | null;
  partnership_tier: string | null;
  commission_structure: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Framework Pillar Stakeholder Relationship
export interface FrameworkPillarStakeholder {
  pillar_id: number;
  stakeholder_id: string;
  relationship_type: string;
  specific_requirements: Json;
}

// Framework Document Metadata
export interface FrameworkDocument {
  id: string;
  version: string;
  total_pages: number | null;
  stakeholder_hubs: number | null;
  total_pillars: number | null;
  last_updated: string | null;
  document_owner: string | null;
  review_cycle: string | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Commission Structure Types
export interface CommissionTier {
  description: string;
  price_per_graduate?: number;
  revenue_share_percent?: number;
  monthly_fee?: number;
  per_placement?: number;
  volume_based?: boolean;
}

export interface CommissionStructure {
  base?: CommissionTier;
  premium?: CommissionTier;
  enterprise?: CommissionTier;
  success_fee?: CommissionTier;
  revenue_share?: CommissionTier;
}

// Partnership Package Deal
export interface PartnershipComponent {
  provides: string;
  receives: string;
  commission: string;
}

export interface PackageDeal {
  programs: PartnershipComponent;
  pathways: PartnershipComponent;
  recognition_profile: PartnershipComponent;
  verification: PartnershipComponent;
}

// API Response Types
export interface FrameworkDataResponse {
  pillars: FrameworkPillar[];
  document: FrameworkDocument;
  stakeholders: FrameworkStakeholder[];
}

export interface PillarDetailResponse {
  pillar: FrameworkPillar;
  content_sections: FrameworkContentSection[];
  tables: (FrameworkTable & { rows: FrameworkTableRow[] })[];
  stakeholders: FrameworkStakeholder[];
}
