const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');
const { config } = require('firebase-functions');

const supabaseUrl = config().supabase.url || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = config().supabase.anon_key;

const supabase = createClient(supabaseUrl, supabaseKey);

// General Functions (46)

exports.getManufacturerAircraftSpecs = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_aircraft_specs')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTrainingData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_training_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerCertificationData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_certification_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAircraftList = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_aircraft_list')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerEngineData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_engine_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAvionicsData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_avionics_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSystemsData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_systems_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerProceduresData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_procedures_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerDocumentation = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_documentation')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerEmergencyProcedures = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_emergency_procedures')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerNormalProcedures = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_normal_procedures')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTypeRatingValue = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_type_rating_value')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAircraftStatus = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_aircraft_status')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTargetPilots = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_target_pilots')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerCareerPath = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_career_path')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSalaryExpectations = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_salary_expectations')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerJobMarket = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_job_market')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAirlinesUsing = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_airlines_using')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTrainingProviders = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_training_providers')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTrainingCost = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_training_cost')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTrainingDuration = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_training_duration')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerPrerequisites = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_prerequisites')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSuccessRate = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_success_rate')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerROI = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_roi')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerComparison = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_comparison')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerReviews = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_reviews')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTestimonials = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_testimonials')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSuccessStories = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_success_stories')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerCareerOutcomes = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_career_outcomes')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerIndustryTrends = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_industry_trends')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerFutureOutlook = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_future_outlook')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerMarketShare = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_market_share')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerCompetitorAnalysis = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_competitor_analysis')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAdvantages = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_advantages')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerDisadvantages = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_disadvantages')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerRequirements = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_requirements')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerEligibility = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_eligibility')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerApplicationProcess = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_application_process')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTimeline = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_timeline')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAssessment = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_assessment')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerCertification = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_certification')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerLicense = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_license')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerMedical = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_medical')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAge = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_age')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerExperience = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_experience')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSkills = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_skills')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerKnowledge = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_knowledge')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerTraining = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_training')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerSupport = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_support')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerResources = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_resources')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerFAQ = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_faq')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerLocation = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_location')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerPricing = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_pricing')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerRecommendation = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_recommendation')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerDataExport = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_data_export')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAPI = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_api')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerIntegration = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_integration')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerAnalytics = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_analytics')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerReports = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('manufacturer_reports')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerDashboard = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_dashboard')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// For Plus Only (3)

exports.getManufacturerContact = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_contact')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerComparisonWithOthers = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_comparison_with_others')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getManufacturerMatching = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('manufacturer_matching')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
