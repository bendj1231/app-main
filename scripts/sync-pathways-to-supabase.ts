#!/usr/bin/env node

/**
 * Sync Pathways from Git to Supabase
 * 
 * This script reads pathway data from the local Git repository
 * and syncs it to Supabase for matching calculations.
 * 
 * Usage: node scripts/sync-pathways-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  match: number;
  pr: number;
  image: string;
  requirements: string[];
  type: string;
  salary: string;
  active: boolean;
  tags: string[];
  priority: string;
}

interface PathwayData {
  version: string;
  last_updated: string;
  pathways: Pathway[];
}

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const PATHWAYS_FILE = join(__dirname, '../data/pathways.json');

function loadPathwaysFromFile(filePath: string): PathwayData {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: PathwayData = JSON.parse(content);
    console.log(`✓ Loaded ${data.pathways.length} pathways from ${filePath}`);
    return data;
  } catch (error) {
    console.error(`✗ Error loading pathways file: ${error.message}`);
    throw error;
  }
}

async function syncToSupabase(pathways: Pathway[]) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔄 Syncing pathways to Supabase...');

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const pathway of pathways) {
    try {
      // Check if pathway exists
      const { data: existing, error: fetchError } = await supabase
        .from('pathways')
        .select('id')
        .eq('id', pathway.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const pathwayData = {
        id: pathway.id,
        title: pathway.title,
        subtitle: pathway.subtitle,
        match: pathway.match,
        pr: pathway.pr,
        image: pathway.image,
        requirements: pathway.requirements,
        type: pathway.type,
        salary: pathway.salary,
        active: pathway.active,
        tags: pathway.tags,
        priority: pathway.priority,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        // Update existing pathway
        const { error: updateError } = await supabase
          .from('pathways')
          .update(pathwayData)
          .eq('id', pathway.id);

        if (updateError) throw updateError;
        updated++;
        console.log(`  ✓ Updated: ${pathway.title}`);
      } else {
        // Create new pathway
        const { error: insertError } = await supabase
          .from('pathways')
          .insert(pathwayData);

        if (insertError) throw insertError;
        created++;
        console.log(`  ✓ Created: ${pathway.title}`);
      }
    } catch (error) {
      errors++;
      console.error(`  ✗ Error syncing ${pathway.title}: ${error.message}`);
    }
  }

  console.log(`\n📊 Sync Summary:`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total: ${pathways.length}`);

  if (errors > 0) {
    console.log('\n⚠️  Some pathways failed to sync. Check the errors above.');
  } else {
    console.log('\n✅ All pathways synced successfully!');
  }
}

async function createPathwaysTableIfNotExists() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔍 Checking if pathways table exists...');

  // Try to query the table
  const { error } = await supabase.from('pathways').select('id').limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, create it
    console.log('⚠️  Pathways table does not exist.');
    console.log('📝 Please create the table using this SQL:');
    console.log(`
CREATE TABLE pathways (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  match INTEGER DEFAULT 0,
  pr INTEGER DEFAULT 0,
  image TEXT,
  requirements TEXT[],
  type TEXT NOT NULL,
  salary TEXT,
  active BOOLEAN DEFAULT true,
  tags TEXT[],
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_pathways_type ON pathways(type);
CREATE INDEX idx_pathways_active ON pathways(active);
CREATE INDEX idx_pathways_priority ON pathways(priority);
CREATE INDEX idx_pathways_tags ON pathways USING GIN(tags);
    `);
    return false;
  }

  console.log('✓ Pathways table exists');
  return true;
}

async function main() {
  console.log('🚀 Pathway Sync to Supabase');
  console.log('='.repeat(40));

  try {
    // Check if pathways table exists
    const tableExists = await createPathwaysTableIfNotExists();
    if (!tableExists) {
      console.log('\n❌ Cannot proceed without pathways table. Please create it first.');
      process.exit(1);
    }

    // Load pathways from Git
    const pathwayData = loadPathwaysFromFile(PATHWAYS_FILE);

    // Sync to Supabase
    await syncToSupabase(pathwayData.pathways);

    console.log('\n✨ Sync complete!');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
