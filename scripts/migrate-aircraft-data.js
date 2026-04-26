/**
 * Migration script to load aircraft manufacturer and type rating data into Supabase
 * Run with: node scripts/migrate-aircraft-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { manufacturers as manufacturersData, aircraftTypeRatings as aircraftData } from '../data/aircraft-manufacturers.ts';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm9zcnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateManufacturers() {
  console.log('Migrating manufacturers...');
  
  for (const manufacturer of manufacturersData) {
    const { error } = await supabase
      .from('manufacturers')
      .upsert({
        id: manufacturer.id,
        name: manufacturer.name,
        logo: manufacturer.logo,
        hero_image: manufacturer.heroImage,
        description: manufacturer.description,
        why_choose_rating: manufacturer.whyChooseRating,
        founded: manufacturer.founded,
        headquarters: manufacturer.headquarters,
        website: manufacturer.website,
        reputation_score: manufacturer.reputationScore,
        total_aircraft_count: manufacturer.totalAircraftCount,
        market_demand_statistics: manufacturer.marketDemandStatistics,
        salary_expectations: manufacturer.salaryExpectations,
        career_progression: manufacturer.careerProgression,
        expectations: manufacturer.expectations,
        training_centers: manufacturer.trainingCenters,
        news_and_updates: manufacturer.newsAndUpdates,
        user_reviews: manufacturer.userReviews,
        retirement_timeline: manufacturer.retirementTimeline,
        airline_recruitment_partnerships: manufacturer.airlineRecruitmentPartnerships,
        internship_opportunities: manufacturer.internshipOpportunities,
        mentorship_opportunities: manufacturer.mentorshipOpportunities,
        scholarships: manufacturer.scholarships,
        insurance_options: manufacturer.insuranceOptions,
        accommodation_costs: manufacturer.accommodationCosts,
        visa_immigration_support: manufacturer.visaImmigrationSupport,
        language_requirements: manufacturer.languageRequirements,
        cultural_adaptation_support: manufacturer.culturalAdaptationSupport,
        networking_events: manufacturer.networkingEvents,
        alumni_network: manufacturer.alumniNetwork,
        job_board_integration: manufacturer.jobBoardIntegration,
        interview_preparation: manufacturer.interviewPreparation,
        technical_assessment: manufacturer.technicalAssessment,
        simulator_practice_sessions: manufacturer.simulatorPracticeSessions,
        ground_school_modules: manufacturer.groundSchoolModules,
        progress_tracking: manufacturer.progressTracking,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error(`Error migrating manufacturer ${manufacturer.id}:`, error);
    } else {
      console.log(`✓ Migrated manufacturer: ${manufacturer.name}`);
    }
  }
}

async function migrateAircraftTypeRatings() {
  console.log('Migrating aircraft type ratings...');
  
  for (const aircraft of aircraftData) {
    const { error } = await supabase
      .from('aircraft_type_ratings')
      .upsert({
        id: aircraft.id,
        manufacturer_id: aircraft.manufacturerId,
        model: aircraft.model,
        category: aircraft.category,
        subcategory: aircraft.subcategory,
        image: aircraft.image,
        sketchfab_id: aircraft.sketchfabId,
        description: aircraft.description,
        why_choose_rating: aircraft.whyChooseRating,
        demand_level: aircraft.demandLevel,
        conditionally_new: aircraft.conditionallyNew,
        lifecycle_stage: aircraft.lifecycleStage,
        order_backlog: aircraft.orderBacklog,
        operator_count: aircraft.operatorCount,
        total_deliveries: aircraft.totalDeliveries,
        steep_approach_certified: aircraft.steepApproachCertified,
        engine_type: aircraft.engineType,
        range_versatility: aircraft.rangeVersatility,
        cabin_features: aircraft.cabinFeatures,
        news: aircraft.news,
        career_score: aircraft.careerScore,
        pilot_count: aircraft.pilotCount,
        first_flight: aircraft.firstFlight,
        specifications: aircraft.specifications,
        training_requirements: aircraft.trainingRequirements,
        training_curriculum: aircraft.trainingCurriculum,
        simulator_details: aircraft.simulatorDetails,
        instructor_qualifications: aircraft.instructorQualifications,
        certification: aircraft.certification,
        success_stories: aircraft.successStories,
        faq: aircraft.faq,
        career_info: aircraft.careerInfo,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error(`Error migrating aircraft ${aircraft.id}:`, error);
    } else {
      console.log(`✓ Migrated aircraft: ${aircraft.model}`);
    }
  }
}

async function main() {
  try {
    console.log('Starting migration...');
    await migrateManufacturers();
    await migrateAircraftTypeRatings();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
