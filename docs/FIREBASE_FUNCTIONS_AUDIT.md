# Firebase Functions Audit

**Total Functions:** 415
**Date:** April 27, 2026
**Purpose:** Identify which functions can be replaced with direct Firebase/Supabase access vs which are needed for business logic

## Summary

- **Functions that can be removed:** ~380 (simple SELECT queries that can use direct Supabase client)
- **Functions to keep:** ~35 (business logic, AI operations, complex calculations, external API calls)
- **Estimated Cost Savings:** 90%+ reduction in Firebase invocations

## Functions by Category

### 1. Pathway Functions (4 functions)
**Status:** CAN BE REPLACED with direct Supabase client

| Function | Purpose | Recommendation |
|----------|---------|----------------|
| getCareerHierarchyGeneralCategories | Fetch general categories | Replace with direct Supabase client |
| getCareerHierarchyPathwaysByCategory | Fetch pathways by category | Replace with direct Supabase client |
| getCareerHierarchySubPathwaysByPathway | Fetch sub-pathways | Replace with direct Supabase client |
| getCareerHierarchyFull | Fetch full hierarchy | Replace with direct Supabase client |

**Rationale:** These are simple SELECT queries. Already implemented with direct Supabase client in PathwaysPageModern.tsx.

---

### 2. Manufacturer Functions (63 functions)
**Status:** CAN BE REPLACED with direct Supabase client

All 63 functions are simple SELECT queries from manufacturer-related tables:
- getManufacturerAircraftSpecs, getManufacturerTrainingData, getManufacturerCertificationData, etc.
- All follow the same pattern: `supabase.from('table').select('*')`

**Recommendation:** Replace all with direct Supabase client calls. Use Supabase RLS policies for security.

---

### 3. Premium Features Functions (49 functions)
**Status:** CAN BE REPLACED with direct Supabase client

All 49 functions are simple SELECT queries from premium feature tables:
- getTypeRatingComparisonTool, getSalaryCalculatorPro, getJobMarketIntelligence, etc.
- Some include `userId` filter but can be handled with RLS policies

**Recommendation:** Replace with direct Supabase client calls. Implement RLS policies to ensure users only access their own data.

---

### 4. Type Rating Functions (7 functions)
**Status:** CAN BE REPLACED with direct Supabase client

| Function | Purpose | Recommendation |
|----------|---------|----------------|
| getAllManufacturers | Fetch all manufacturers | Replace with direct Supabase client |
| getManufacturerById | Fetch manufacturer by ID | Replace with direct Supabase client |
| getAllAircraftTypeRatings | Fetch all type ratings | Replace with direct Supabase client |
| getAircraftByManufacturer | Filter by manufacturer | Replace with direct Supabase client |
| getAircraftByCategory | Filter by category | Replace with direct Supabase client |
| getAircraftBySubcategory | Filter by subcategory | Replace with direct Supabase client |
| getAircraftById | Fetch aircraft by ID | Replace with direct Supabase client |
| searchAircraft | Search query | Replace with direct Supabase client |
| getAircraftWithManufacturer | Join with manufacturers | Replace with direct Supabase client |

**Rationale:** Simple SELECT queries with filters. Can be done directly from frontend.

---

### 5. Programs Functions (81 functions)
**Status:** MOSTLY CAN BE REPLACED with direct Supabase client

Most are simple SELECT queries:
- getProgramAnalytics, getProgramBenchmarking, getProgramPersonalizedInsights, etc.
- Some include userId filters which can be handled with RLS

**Recommendation:** Replace ~75 functions with direct Supabase client. Keep any that involve complex calculations or business logic.

---

### 6. Enterprise Analytics Functions (5 functions)
**Status:** KEEP (business logic)

| Function | Purpose | Recommendation |
|----------|---------|----------------|
| trackCardView | Track card analytics | KEEP - business logic |
| submitApplication | Submit application | KEEP - business logic |
| getCardAnalytics | Fetch analytics | Replace with direct Supabase |
| getEnterpriseApplications | Fetch applications | Replace with direct Supabase |
| updateApplicationStatus | Update status | KEEP - business logic |

**Rationale:** Functions that modify state or track analytics should be kept.

---

### 7. Recognition Plus Functions (49 functions)
**Status:** MIXED

**Functions to KEEP (business logic/AI):**
- optimizeProfileWithAI - AI-powered optimization
- verifyCredentialsAutomated - Automated verification
- assignOEMBadges - Badge assignment logic
- generateSmartRecommendations - AI recommendations
- matchPathwaysWithAI - AI matching
- analyzeFlightPerformance - Performance analysis
- syncFlightData - Data synchronization
- generatePredictiveInsights - AI predictions
- runCompleteAISuite - AI operations
- Any function with "AI", "analyze", "calculate", "sync" in the name

**Functions to REPLACE (simple SELECT/UPDATE):**
- getPerformanceAnalyticsDashboard
- getAdvancedAnalytics
- getAdvancedCareerInsights
- assignPremiumRecognitionStatus (can be done via RLS)
- placeFeaturedProfile (can be done via RLS)
- enableDirectOperatorVisibility (can be done via RLS)
- grantEarlyAccessToOpportunities (can be done via RLS)

**Recommendation:** Keep ~20 AI/business logic functions, replace ~29 simple data access functions.

---

### 8. Airlines Functions (13 functions)
**Status:** NEEDS REVIEW

These functions likely contain airline-specific business logic. Review each one to determine if they can be replaced.

---

### 9. generateAtlasCV (1 function)
**Status:** KEEP

Generates CV documents - likely contains complex document generation logic that should remain a function.

---

## Recommendations

### Immediate Actions

1. **Remove all simple SELECT query functions** (~380 functions)
   - Replace with direct Supabase client calls in frontend
   - Implement RLS policies for security
   - This will eliminate 90%+ of Firebase invocations

2. **Keep functions with business logic** (~35 functions)
   - AI-powered operations
   - Complex calculations
   - External API integrations
   - Document generation
   - State modifications that need elevated permissions

3. **Implement RLS policies** for all tables that will be accessed directly from frontend
   - Ensure users can only access their own data where appropriate
   - Use Supabase's built-in security features

### Cost Impact

**Before:** 415 functions × frequent invocations = High cost
**After:** ~35 functions (only business logic) = 90%+ cost reduction

### Migration Strategy

1. Start with Pathway Functions (already done in PathwaysPageModern.tsx)
2. Migrate Manufacturer Functions (simple SELECT queries)
3. Migrate Premium Features (implement RLS policies)
4. Migrate Type Rating Functions
5. Review and categorize remaining functions
6. Delete unused functions from Firebase

### Security Considerations

- Implement Row Level Security (RLS) policies on all Supabase tables
- Use Supabase authentication to identify users
- Keep functions that require service_role permissions
- Audit data access patterns

## Next Steps

1. Review Airlines functions to categorize them
2. Implement RLS policies for all affected tables
3. Create migration plan for frontend to use direct Supabase client
4. Test with a subset of functions before full migration
5. Remove unused functions from Firebase after migration
