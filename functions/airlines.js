const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

// Helper function to get Supabase client
const getSupabase = () => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
};

/**
 * Get all airlines with their aircraft fleets
 */
exports.getAirlines = onRequest(async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ airlines: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get airline by ID with their aircraft fleet
 */
exports.getAirlineById = onRequest(async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Airline ID is required' });
    }

    const supabase = getSupabase();
    const { data: airline, error: airlineError } = await supabase
      .from('airlines')
      .select('*')
      .eq('id', id)
      .single();

    if (airlineError) {
      return res.status(500).json({ error: airlineError.message });
    }

    if (!airline) {
      return res.status(404).json({ error: 'Airline not found' });
    }

    const airlineId = airline.id;
    const { data: aircraft, error: aircraftError } = await supabase
      .from('airline_aircraft')
      .select('*')
      .eq('airline_id', airlineId);

    if (aircraftError) {
      return res.status(500).json({ error: aircraftError.message });
    }

    return res.status(200).json({
      airline,
      fleet: aircraft || []
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get airlines operating a specific aircraft type
 */
exports.getAirlinesByAircraft = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airline_aircraft')
      .select('airlines(*), aircraft_type')
      .eq('aircraft_id', aircraftId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const airlines = data.map(item => item.airlines).filter(Boolean);

    return res.status(200).json({ airlines });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Update airline information
 */
exports.updateAirline = onRequest(async (req, res) => {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Airline ID is required' });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('airlines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ airline: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Add aircraft to airline fleet
 */
exports.addAircraftToFleet = onRequest(async (req, res) => {
  try {
    const { airlineId, aircraftId } = req.body;

    if (!airlineId || !aircraftId) {
      return res.status(400).json({ error: 'airlineId and aircraftId are required' });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airline_aircraft')
      .insert({
        airline_id: airlineId,
        aircraft_id: aircraftId,
        quantity,
        added_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ fleetEntry: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Remove aircraft from airline fleet
 */
exports.removeAircraftFromFleet = onRequest(async (req, res) => {
  try {
    const { airlineId, aircraftId } = req.query;

    if (!airlineId || !aircraftId) {
      return res.status(400).json({ error: 'airlineId and aircraftId are required' });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('airline_aircraft')
      .delete()
      .eq('airline_id', airlineId)
      .eq('aircraft_id', aircraftId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get airline recruitment information
 */
exports.getAirlineRecruitment = onRequest(async (req, res) => {
  try {
    const { airlineId } = req.query;

    if (!airlineId) {
      return res.status(400).json({ error: 'airlineId is required' });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airline_recruitment')
      .select('*')
      .eq('airline_id', airlineId)
      .order('posted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ recruitment: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get aircraft metrics for pilot information
 */
exports.getAircraftMetrics = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('aircraft_metrics')
      .select('*')
      .eq('aircraft_id', aircraftId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Aircraft metrics not found' });
    }

    return res.status(200).json({ metrics: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Update aircraft metrics (orders, operators, etc.)
 */
exports.updateAircraftMetrics = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;
    const { orders, delivered, operatorCount, lifecycleStage, demandLevel } = req.body;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const updateData = {};
    if (orders !== undefined) updateData.orders = orders;
    if (delivered !== undefined) updateData.delivered = delivered;
    if (operatorCount !== undefined) updateData.operator_count = operatorCount;
    if (lifecycleStage !== undefined) updateData.lifecycle_stage = lifecycleStage;
    if (demandLevel !== undefined) updateData.demand_level = demandLevel;
    updateData.updated_at = new Date().toISOString();

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('aircraft_metrics')
      .update(updateData)
      .eq('aircraft_id', aircraftId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ metrics: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get all aircraft metrics for dashboard
 */
exports.getAllAircraftMetrics = onRequest(async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('aircraft_metrics')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ metrics: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get pilot count for a specific aircraft type rating
 */
exports.getPilotCountForAircraft = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('pilot_type_ratings')
      .select('id')
      .eq('aircraft_id', aircraftId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ count: data?.length || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Update pilot count for an aircraft type rating
 */
exports.updatePilotCountForAircraft = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;
    const { increment } = req.body;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const supabase = getSupabase();
    // Get current count
    const { data: currentData, error: fetchError } = await supabase
      .from('aircraft_metrics')
      .select('pilot_count')
      .eq('aircraft_id', aircraftId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ error: fetchError.message });
    }

    const currentCount = currentData?.pilot_count || 0;
    const newCount = increment ? currentCount + 1 : currentCount - 1;

    // Update or insert
    const { data, error } = await supabase
      .from('aircraft_metrics')
      .upsert({
        aircraft_id: aircraftId,
        pilot_count: newCount,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ pilotCount: newCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Recalculate career score for an aircraft
 */
exports.recalculateCareerScore = onRequest(async (req, res) => {
  try {
    const { aircraftId } = req.query;
    const { pilotProfile } = req.body;

    if (!aircraftId) {
      return res.status(400).json({ error: 'aircraftId is required' });
    }

    const supabase = getSupabase();
    // Get all metrics for the aircraft
    const { data: metrics, error: metricsError } = await supabase
      .from('aircraft_metrics')
      .select('*')
      .eq('aircraft_id', aircraftId)
      .single();

    if (metricsError) {
      return res.status(500).json({ error: metricsError.message });
    }

    // Calculate score (same logic as frontend)
    let score = 0;
    const maxScore = 100;

    // === Aircraft-Based Scoring (60 points) ===

    // Demand Level (15 points)
    if (metrics.demand_level === 'high') score += 15;
    else if (metrics.demand_level === 'low') score += 6;

    // Lifecycle Stage (12 points)
    if (metrics.lifecycle_stage === 'early-career') score += 12;
    else if (metrics.lifecycle_stage === 'mid-career') score += 6;

    // Order Backlog Ratio (12 points)
    if (metrics.orders && metrics.delivered) {
      const ratio = metrics.orders / metrics.delivered;
      if (ratio >= 2) score += 12;
      else if (ratio >= 1.5) score += 9;
      else if (ratio >= 1) score += 6;
      else score += 3;
    }

    // Operator Count (9 points)
    if (metrics.operator_count) {
      if (metrics.operator_count >= 30) score += 9;
      else if (metrics.operator_count >= 20) score += 7;
      else if (metrics.operator_count >= 10) score += 5;
      else score += 2;
    }

    // Pilot Count vs Demand (12 points)
    if (metrics.pilot_count && metrics.operator_count) {
      const pilotsPerOperator = metrics.pilot_count / metrics.operator_count;
      if (pilotsPerOperator <= 100) score += 12;
      else if (pilotsPerOperator <= 200) score += 9;
      else if (pilotsPerOperator <= 300) score += 6;
      else score += 3;
    }

    // === Pilot Profile-Based Scoring (40 points) ===

    if (pilotProfile) {
      // Total Flight Hours (12 points)
      if (pilotProfile.totalFlightHours) {
        if (pilotProfile.totalFlightHours >= 5000) score += 12;
        else if (pilotProfile.totalFlightHours >= 3000) score += 9;
        else if (pilotProfile.totalFlightHours >= 1500) score += 6;
        else if (pilotProfile.totalFlightHours >= 500) score += 3;
        else score += 1;
      }

      // Number of Licenses (8 points)
      if (pilotProfile.licenses) {
        if (pilotProfile.licenses.length >= 5) score += 8;
        else if (pilotProfile.licenses.length >= 3) score += 6;
        else if (pilotProfile.licenses.length >= 2) score += 4;
        else if (pilotProfile.licenses.length >= 1) score += 2;
      }

      // Recognition Score (10 points)
      if (pilotProfile.recognitionScore) {
        if (pilotProfile.recognitionScore >= 80) score += 10;
        else if (pilotProfile.recognitionScore >= 60) score += 8;
        else if (pilotProfile.recognitionScore >= 40) score += 5;
        else if (pilotProfile.recognitionScore >= 20) score += 3;
        else score += 1;
      }

      // Experience Level (5 points)
      if (pilotProfile.experienceLevel) {
        if (pilotProfile.experienceLevel === 'senior' || pilotProfile.experienceLevel === 'captain') score += 5;
        else if (pilotProfile.experienceLevel === 'mid-level' || pilotProfile.experienceLevel === 'first-officer') score += 3;
        else if (pilotProfile.experienceLevel === 'junior') score += 1;
      }

      // Technical Skills Score (5 points)
      if (pilotProfile.technicalSkillsScore) {
        if (pilotProfile.technicalSkillsScore >= 80) score += 5;
        else if (pilotProfile.technicalSkillsScore >= 60) score += 3;
        else if (pilotProfile.technicalSkillsScore >= 40) score += 1;
      }
    }

    const finalScore = Math.min(score, maxScore);

    // Update the score
    const { data, error } = await supabase
      .from('aircraft_metrics')
      .update({ career_score: finalScore, updated_at: new Date().toISOString() })
      .eq('aircraft_id', aircraftId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ careerScore: finalScore });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
