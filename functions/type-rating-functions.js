const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm9zcnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all manufacturers
 */
exports.getAllManufacturers = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get manufacturer by ID
 */
exports.getManufacturerById = onRequest(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Manufacturer ID is required' });
    }
    
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Manufacturer not found' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get all aircraft type ratings
 */
exports.getAllAircraftTypeRatings = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get aircraft by manufacturer ID
 */
exports.getAircraftByManufacturer = onRequest(async (req, res) => {
  try {
    const { manufacturerId } = req.query;
    if (!manufacturerId) {
      return res.status(400).json({ success: false, error: 'Manufacturer ID is required' });
    }
    
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .eq('manufacturer_id', manufacturerId)
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get aircraft by category
 */
exports.getAircraftByCategory = onRequest(async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .eq('category', category)
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get aircraft by subcategory
 */
exports.getAircraftBySubcategory = onRequest(async (req, res) => {
  try {
    const { subcategory } = req.query;
    if (!subcategory) {
      return res.status(400).json({ success: false, error: 'Subcategory is required' });
    }
    
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .eq('subcategory', subcategory)
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get aircraft by ID
 */
exports.getAircraftById = onRequest(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Aircraft ID is required' });
    }
    
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Aircraft not found' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Search aircraft by query
 */
exports.searchAircraft = onRequest(async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select('*')
      .or(`model.ilike.%${query}%,manufacturer_id.ilike.%${query}%,description.ilike.%${query}%`)
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get aircraft with manufacturer details
 */
exports.getAircraftWithManufacturer = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aircraft_type_ratings')
      .select(`
        *,
        manufacturers (
          id,
          name,
          logo,
          reputation_score
        )
      `)
      .order('model');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
