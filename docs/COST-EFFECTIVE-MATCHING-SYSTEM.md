# Cost-Effective Aviation Industry-Grade Matching System

This document describes a cost-effective pathway matching system that works without requiring Supabase Pro plan features. All matching calculations are done client-side using Git-based data storage.

## System Architecture

```
Git Repository (Source of Truth)
    ↓
pathways.json (Data File)
    ↓
Sync Script (Manual/Automated)
    ↓
Supabase (Storage - Free Tier)
    ↓
Client-Side Matching Engine
    ↓
Frontend Display
```

## Components

### 1. Git-Based Data Storage

**Location:** `data/pathways.json`

This JSON file contains all pathway information and serves as the single source of truth. All pathway data is stored in Git, enabling:
- Version control
- Easy editing without database access
- Collaboration through pull requests
- History tracking
- Rollback capability

**Structure:**
```json
{
  "version": "1.0.0",
  "last_updated": "2026-04-19T10:00:00Z",
  "pathways": [
    {
      "id": "envoy-air-cadet",
      "title": "Envoy Air Pilot Cadet Program",
      "subtitle": "Envoy Air (American Airlines Group)",
      "match": 94,
      "pr": 0,
      "image": "https://...",
      "requirements": ["40+ hrs", "CPL", "Class 1 Medical"],
      "type": "Cadet Program",
      "salary": "Financial assistance + guaranteed FO position",
      "active": true,
      "tags": ["cadet", "airline", "entry-level"],
      "priority": "high"
    }
  ]
}
```

### 2. Sync Script

**Location:** `scripts/sync-pathways-to-supabase.ts`

This Node.js script syncs pathway data from Git to Supabase. It:
- Reads the pathways.json file
- Checks if the pathways table exists in Supabase
- Creates/updates pathways in Supabase
- Provides detailed logging

**Usage:**
```bash
# Set environment variables
export SUPABASE_URL="https://gkbhgrozrzhalnjherfu.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"

# Run the sync script
node scripts/sync-pathways-to-supabase.js
```

**Automated Sync (GitHub Actions):**
Create `.github/workflows/sync-pathways.yml`:
```yaml
name: Sync Pathways to Supabase

on:
  push:
    paths:
      - 'data/pathways.json'
    branches: [ main ]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install @supabase/supabase-js
        
      - name: Sync to Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: node scripts/sync-pathways-to-supabase.js
```

### 3. Client-Side Matching Engine

**Location:** `lib/pathway-matching-engine.ts`

This TypeScript module provides dating-site accurate matching calculations without requiring Supabase Pro features.

**Features:**
- Multi-dimensional scoring (6 factors)
- Logarithmic scaling for realistic matching
- Tiered matching with partial credit
- User behavior tracking via local storage
- Personalized weight adjustment
- Confidence intervals
- Detailed scoring breakdown

**Usage:**
```typescript
import { matchingEngine } from '@/lib/pathway-matching-engine';

// Load pathway data
const pathways = await fetch('/data/pathways.json').then(r => r.json());

// Define user profile
const profile = {
  totalFlightHours: 200,
  licenses: ['ppl', 'cpl', 'ir'],
  medicalCertificate: 'None',
  overallRecognitionScore: 458,
  careerGoals: ['airline_career', 'captain_goal'],
  willingnessToRelocate: true,
  preferredRegions: ['asia', 'middle_east'],
  experienceLevel: 'entry_level',
  ageRange: '18-30',
  educationLevel: 'bachelor',
  languageProficiency: ['english', 'native'],
  riskTolerance: 'moderate',
  workLifeBalancePreference: 'balanced'
};

// Calculate matches
const matches = matchingEngine.calculateMatches(pathways.pathways, profile);

// Filter by match range
const highMatches = matchingEngine.filterByMatchRange(matches, 'high');

// Track user interaction
matchingEngine.trackPathwayInteraction(pathway, 'click');
```

### 4. Supabase Database Setup

**Create the pathways table:**
```sql
CREATE TABLE pathways (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  match INTEGER DEFAULT 0,
  pr INTEGER DEFAULT 0,
  image TEXT,
  requirements TEXT[],
  type TEXT NOT NULL,
  salary TEXT,
  active BOOLEAN DEFAULT true,
  tags TEXT[],
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_pathways_type ON pathways(type);
CREATE INDEX idx_pathways_active ON pathways(active);
CREATE INDEX idx_pathways_priority ON pathways(priority);
CREATE INDEX idx_pathways_tags ON pathways USING GIN(tags);
```

**Enable Row Level Security (RLS):**
```sql
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Pathways are publicly readable" 
ON pathways FOR SELECT 
USING (true);
```

## Cost Analysis

### Free Tier (Current Setup)
- **Supabase:** $0/month (Free tier)
  - 500MB database storage
  - 1GB bandwidth
  - 500MB file storage
  - 2 Edge Functions
  - Basic monitoring
- **GitHub Actions:** $0/month (Free tier)
  - 2,000 minutes/month
  - 500MB storage
- **Total:** $0/month

### Pro Tier (If Needed Later)
- **Supabase:** $25/month
  - 8GB database storage
  - 50GB bandwidth
  - 100GB file storage
  - Unlimited Edge Functions
  - Advanced monitoring
  - Realtime
  - PITR

## Advantages of This Approach

1. **Cost-Effective:** Works entirely on free tiers
2. **Version Control:** All data changes tracked in Git
3. **No Pro Features Needed:** Client-side calculations avoid Pro requirements
4. **Collaboration:** Easy team collaboration via pull requests
5. **Rollback:** Easy to revert changes using Git history
6. **Performance:** Client-side calculations are fast and scalable
7. **Privacy:** User behavior data stored locally, not in database
8. **Flexibility:** Easy to add new pathways by editing JSON file

## Workflow

### Adding a New Pathway

1. **Edit pathways.json:**
   ```bash
   # Edit the data file
   nano data/pathways.json
   ```

2. **Commit changes:**
   ```bash
   git add data/pathways.json
   git commit -m "Add new pathway: XYZ Aviation"
   git push
   ```

3. **Automatic sync:**
   - GitHub Actions automatically syncs to Supabase
   - Or manually run the sync script

4. **Frontend update:**
   - Next build picks up the new data
   - Or use client-side fetching for immediate updates

### Updating Pathway Information

1. Edit the pathway in `data/pathways.json`
2. Commit and push changes
3. Automatic sync to Supabase
4. Frontend reflects changes on next build

### Removing a Pathway

1. Set `"active": false` in pathways.json
2. Commit and push
3. Sync to Supabase
4. Frontend filters out inactive pathways

## Deployment Pipeline

### Manual Deployment
```bash
# 1. Update pathways.json
nano data/pathways.json

# 2. Commit changes
git add data/pathways.json
git commit -m "Update pathway data"
git push

# 3. Sync to Supabase
node scripts/sync-pathways-to-supabase.js

# 4. Build and deploy frontend
npm run build
# Deploy to your hosting provider
```

### Automated Deployment (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy Pathway Updates

on:
  push:
    paths:
      - 'data/pathways.json'
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Sync to Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: node scripts/sync-pathways-to-supabase.js
        
      - name: Build frontend
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring

### Free Tier Monitoring (Available)
- Supabase Dashboard basic metrics
- GitHub Actions logs
- Frontend error tracking (Sentry free tier)

### Enhanced Monitoring (Optional)
- Add Sentry for error tracking ($0/month free tier)
- Use Vercel Analytics ($0/month free tier)
- Custom logging in sync script

## Security

### Data Security
- Pathway data is public (no sensitive information)
- User profiles stored in Supabase with RLS
- User behavior data stored locally (not in database)
- API keys stored as environment variables

### Access Control
- Git repository access controlled
- Supabase access via RLS policies
- GitHub Actions secrets for sensitive data

## Performance

### Client-Side Calculations
- Fast: <10ms for 50 pathways
- Scalable: No server load
- Cached: Results cached in local storage

### Data Loading
- Small file size: ~50KB for 50 pathways
- Fast loading: <100ms
- Can be cached: Browser cache + CDN

## Future Enhancements

1. **Add Validation:** Validate pathway data structure before sync
2. **Add Tests:** Unit tests for matching engine
3. **Add Analytics:** Track which pathways are most viewed
4. **Add Search:** Client-side search functionality
5. **Add Filtering:** Advanced filtering options
6. **Add Export:** Export matches as PDF/CSV
7. **Add Sharing:** Share match results via URL
8. **Add Comparison:** Compare multiple pathways side-by-side

## Troubleshooting

### Sync Script Fails
- Check Supabase credentials
- Verify pathways.json syntax
- Ensure pathways table exists
- Check network connectivity

### Matching Engine Errors
- Verify pathway data structure
- Check profile data format
- Enable browser console for debugging
- Clear local storage if needed

### Frontend Not Updating
- Check if pathways.json was synced
- Verify build completed successfully
- Clear browser cache
- Check network tab for loading errors

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub Actions logs
3. Check Supabase dashboard
4. Enable browser console for debugging
