const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.supabaseUrl || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.supabaseAnonKey || process.env.SUPABASE_KEY || process.env.supabaseKey;

const supabase = createClient(supabaseUrl, supabaseKey);

// Premium Features ($100/year subscription) - 49 functions

exports.getTypeRatingComparisonTool = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('type_rating_comparison')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSalaryCalculatorPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('salary_calculator_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getJobMarketIntelligence = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('job_market_intelligence')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getTrainingProviderReviews = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('training_provider_reviews')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getTypeRatingROICalculator = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('type_rating_roi_calculator')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAircraftComparisonTool = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aircraft_comparison')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerRoadmapPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('career_roadmap_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getInterviewPreparationPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('interview_preparation_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMockInterviews = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerCoaching = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('career_coaching')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCareerPathSimulator = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('career_path_simulator')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAircraftPerformanceDatabase = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aircraft_performance_database')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getIndustryEventsAccess = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('industry_events_access')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getResearchDatabase = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('research_database')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getInternshipOpportunities = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('internship_opportunities')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAlumniNetwork = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('alumni_network')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getIndustryConnections = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('industry_connections')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getJobReferrals = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('job_referrals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCertificationTracking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('certification_tracking')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getTypeRatingTracking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('type_rating_tracking')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFlightHourTracking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('flight_hour_tracking')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAchievementTracking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('achievement_tracking')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getBadgeSystem = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('badge_system')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getLeaderboard = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSocialFeatures = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('social_features')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getEventsMeetups = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events_meetups')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMobileAppPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('mobile_app_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getOfflineAccess = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('offline_access')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCloudStorage = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('cloud_storage')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAIAssistant = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('ai_assistant')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSmartRecommendations = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('smart_recommendations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getPredictiveAnalytics = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('predictive_analytics')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getPersonalizedDashboard = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('personalized_dashboard')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCustomAlerts = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('custom_alerts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAdvancedSearch = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('advanced_search')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getDataVisualization = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('data_visualization')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getWhiteLabeling = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('white_labeling')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCustomBranding = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('custom_branding')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSecurityFeatures = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('security_features')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFlightLogAnalytics = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('flight_log_analytics')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getLicenseTrackingPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('license_tracking_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMedicalTrackerPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('medical_tracker_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getPortfolioBuilderPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('portfolio_builder_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getPersonalBranding = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('personal_branding')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getLinkedInProfileOptimization = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('linkedin_profile_optimization')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getResumeBuilderPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('resume_builder_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSkillAssessmentPro = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('skill_assessment_pro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getIndustryInsights = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('industry_insights')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getNetworkingPlatform = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('networking_platform')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMentorshipAccess = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('mentorship_access')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getCurrencyConverterPro = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('currency_converter_pro')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getRegulationDatabase = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('regulation_database')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMentorshipMatching = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('mentorship_matching')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getAPIAccess = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('api_access')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getPeerNetwork = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('peer_network')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
