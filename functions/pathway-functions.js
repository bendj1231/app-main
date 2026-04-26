const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');
const { config } = require('firebase-functions');

const supabaseUrl = config().supabase.url || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = config().supabase.anon_key;

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
