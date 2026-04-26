const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Career Hierarchy System Functions

exports.getCareerHierarchyGeneralCategories = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_career_hierarchy_general_categories');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerHierarchyPathwaysByCategory = onRequest(async (req, res) => {
  try {
    const { categoryId } = req.body;
    const { data, error } = await supabase.rpc('get_career_hierarchy_pathways_by_category', { p_category_id: categoryId });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerHierarchySubPathwaysByPathway = onRequest(async (req, res) => {
  try {
    const { pathwayId } = req.body;
    const { data, error } = await supabase.rpc('get_career_hierarchy_sub_pathways_by_pathway', { p_pathway_id: pathwayId });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerHierarchyFull = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_career_hierarchy_full');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
