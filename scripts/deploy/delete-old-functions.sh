#!/bin/bash

# Functions to delete (removed from codebase)
MANUFACTURER_FUNCTIONS=(
  "getManufacturerAircraftSpecs"
  "getManufacturerTrainingData"
  "getManufacturerCertificationData"
  "getManufacturerMarketDemand"
  "getManufacturerSalaryExpectations"
  "getManufacturerCareerProgression"
  "getManufacturerTrainingCenters"
  "getManufacturerNewsUpdates"
  "getManufacturerUserReviews"
  "getManufacturerSuccessStories"
  "getManufacturerTimeline"
  "getManufacturerPartners"
  "getManufacturerRequirements"
  "getManufacturerSuccessRate"
  "getManufacturerTargetPilots"
  "getManufacturerSupport"
  "getManufacturerFAQ"
  "getManufacturerSkills"
  "getManufacturerTestimonials"
  "getManufacturerTrainingCost"
  "getManufacturerTrainingDuration"
  "getManufacturerTypeRatingValue"
  "getManufacturerFinancialAid"
  "getManufacturerCareerServices"
  "getManufacturerAlumniNetwork"
  "getManufacturerIndustryPartnerships"
  "getManufacturerGlobalPresence"
  "getManufacturerTechnology"
  "getManufacturerSustainability"
  "getManufacturerSafetyRecord"
  "getManufacturerInnovation"
  "getManufacturerCustomization"
  "getManufacturerFlexibleScheduling"
  "getManufacturerCareerSupport"
  "getManufacturerMentorship"
  "getManufacturerJobPlacement"
  "getManufacturerInternships"
  "getManufacturerNetworking"
  "getManufacturerCertificationAssistance"
  "getManufacturerExamPrep"
  "getManufacturerSimulatorAccess"
  "getManufacturerFleetAccess"
  "getManufacturerInstructorTraining"
  "getManufacturerAdvancedTraining"
  "getManufacturerSpecializedTraining"
  "getManufacturerTypeRating"
  "getManufacturerRecruitment"
  "getManufacturerHiring"
  "getManufacturerCareerAdvancement"
  "getManufacturerProfessionalDevelopment"
  "getManufacturerIndustryRecognition"
  "getManufacturerGlobalReach"
  "getManufacturerQualityStandards"
  "getManufacturerRegulatoryCompliance"
  "getManufacturerSafetyTraining"
  "getManufacturerEmergencyProcedures"
  "getManufacturerCRMTraining"
  "getManufacturerHumanFactors"
  "getManufacturerThreatErrorManagement"
  "getManufacturerCrewResourceManagement"
  "getManufacturerAviationEnglish"
  "getManufacturerCrossCulturalCommunication"
  "getManufacturerLeadership"
  "getManufacturerTeamwork"
)

TYPE_RATING_FUNCTIONS=(
  "getAllManufacturers"
  "getManufacturerById"
  "getAllAircraftTypeRatings"
  "getAircraftByManufacturer"
  "getAircraftByCategory"
  "getAircraftBySubcategory"
  "getAircraftById"
  "searchAircraft"
  "getAircraftWithManufacturer"
)

AIRLINES_FUNCTIONS=(
  "getAirlines"
  "getAirlineById"
  "getAirlinesByAircraft"
  "updateAirline"
  "addAircraftToFleet"
  "removeAircraftFromFleet"
  "getAirlineRecruitment"
  "getAircraftMetrics"
  "updateAircraftMetrics"
  "getAllAircraftMetrics"
  "getPilotCountForAircraft"
  "updatePilotCountForAircraft"
)

PATHWAY_FUNCTIONS=(
  "getCareerHierarchyGeneralCategories"
  "getCareerHierarchyPathwaysByCategory"
  "getCareerHierarchySubPathwaysByPathway"
  "getCareerHierarchyFull"
)

# Delete functions in batches of 5 to avoid quota limits
delete_batch() {
  local batch=("$@")
  for func in "${batch[@]}"; do
    echo "Deleting $func..."
    firebase functions:delete "$func" --region us-central1 --force
    sleep 2  # Wait to avoid quota limits
  done
}

# Delete manufacturer functions in batches
echo "Deleting manufacturer functions..."
for i in $(seq 0 5 ${#MANUFACTURER_FUNCTIONS[@]}); do
  batch=("${MANUFACTURER_FUNCTIONS[@]:i:5}")
  delete_batch "${batch[@]}"
done

# Delete type rating functions
echo "Deleting type rating functions..."
delete_batch "${TYPE_RATING_FUNCTIONS[@]}"

# Delete airlines functions
echo "Deleting airlines functions..."
delete_batch "${AIRLINES_FUNCTIONS[@]}"

# Delete pathway functions
echo "Deleting pathway functions..."
delete_batch "${PATHWAY_FUNCTIONS[@]}"

echo "Function deletion complete!"
