#!/bin/bash
# Re-apply Wingmentor Program schema and deploy Worker
# Database already created: wingmentor-program (5ef76bc5-9783-4ad5-8751-05b21d70e135)

set -e

echo "☁️  Wingmentor Program D1 Database Setup"
echo "=========================================="
echo ""

# Step 1: Apply the schema
echo "Step 1: Applying schema to wingmentor-program..."
cd worker
npx wrangler d1 execute wingmentor-program --file ./migrations/0005_wingmentor_program.sql --remote

echo ""
echo "Step 2: Deploying Worker with wingmentor binding..."
npx wrangler deploy --name pilotrecognition-api

cd ..

echo ""
echo "=========================================="
echo "✅ Wingmentor Program D1 Database Ready!"
echo "=========================================="
echo ""
echo "New tables created:"
echo "  - enrollments"
echo "  - program_progress"
echo "  - program_modules"
echo "  - logbook_hour_tokens"
echo "  - interview_assessments"
echo "  - atlas_resumes"
echo "  - mentor_profiles"
echo "  - meetings"
echo "  - events"
echo "  - event_registrations"
echo "  - daily_quotes"
echo "  - mentorship_assignments"
echo ""
echo "Next: Update frontend code to query these tables via Worker API"
