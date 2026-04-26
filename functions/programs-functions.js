const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');
const { config } = require('firebase-functions');

const supabaseUrl = config().supabase.url || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = config().supabase.anon_key;

const supabase = createClient(supabaseUrl, supabaseKey);

// General Plus Functions (23)

exports.getProgramAnalytics = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('program_analytics')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramBenchmarking = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('program_benchmarking')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramPersonalizedInsights = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('program_insights')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramPredictiveScores = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('program_predictions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramSkillGapAnalysis = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('skill_gap_analysis')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramLearningPath = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramMentorMatching = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('mentor_matching')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramPeerMatching = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('peer_matching')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramCareerImpact = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('career_impact')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramNetworking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('networking_opportunities')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramAlumniNetwork = onRequest(async (req, res) => {
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

exports.getProgramRecommendations = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('program_recommendations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramDataExport = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('program_data')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramAdvancedMetrics = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('advanced_metrics')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramSuccessStories = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramIndustryConnections = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('industry_connections')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramJobPlacement = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('job_placement')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramCertificationValue = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certification_value')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramSkillValidation = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('skill_validation')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getProgramGamification = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Foundation Program Specific Functions (57)

exports.getFoundationProgramCurriculum = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_curriculum')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramMentorship = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_mentorship')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAssessment = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_assessment')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramProgress = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCertification = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_certification')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCareerPath = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_career_path')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramMentors = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_mentors')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAlumni = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_alumni')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSuccessMetrics = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_success_metrics')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramModules = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_modules')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSchedule = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_schedule')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramResources = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_resources')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramRequirements = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_requirements')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramEligibility = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_eligibility')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramTimeline = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_timeline')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCost = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_cost')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramScholarships = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_scholarships')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramPaymentPlans = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_payment_plans')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramEnrollment = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_enrollment')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramOnboarding = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_onboarding')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSupport = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_support')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramFAQ = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_faq')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramTestimonials = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_testimonials')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramComparison = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_comparison')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramOutcomes = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_outcomes')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSkills = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_skills')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramNextSteps = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_next_steps')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCommunity = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_community')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramNetworking = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_networking')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramEvents = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_events')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAssessments = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_assessments')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramGrading = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_grading')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramFeedback = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_feedback')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSatisfaction = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_satisfaction')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramRetention = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_retention')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramEngagement = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_engagement')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramImpact = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_impact')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramDemographics = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_demographics')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramGeographicReach = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_geographic_reach')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramIndustryBreakdown = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_industry_breakdown')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCareerAdvancement = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_career_advancement')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramJobPlacement = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_job_placement')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramPartners = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_partners')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSponsors = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_sponsors')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAccreditations = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_accreditations')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramRecognition = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_recognition')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramMediaCoverage = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_media_coverage')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCaseStudies = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_case_studies')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramResearchData = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_research_data')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAnalytics = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_analytics')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramReports = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_reports')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramAPIAccess = onRequest(async (req, res) => {
  try {
    const { userId } = req.body;
    const { data, error } = await supabase
      .from('foundation_api_access')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramIntegrations = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_integrations')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramWhiteLabeling = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_white_labeling')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramBranding = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_branding')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramScalability = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_scalability')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSecurity = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_security')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramCompliance = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_compliance')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramDocumentation = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_documentation')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramSupportPortal = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_support_portal')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getFoundationProgramTraining = onRequest(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foundation_training')
      .select('*');
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
