# PilotTerminal Social Feed Integration

## Overview

PilotTerminal now aggregates content from multiple external social media sources to provide pilots with a comprehensive view of aviation discussions across the web.

## Supported Sources

| Platform | Endpoint | Status | Data Available |
|----------|----------|--------|----------------|
| Reddit | `/r/flying`, `/r/aviation`, `/r/pilots` | ✅ Live | Posts, comments, upvotes |
| LinkedIn | Aviation groups | ✅ Live | Posts, likes, comments |
| Facebook | Pilot groups | ✅ Live | Posts, reactions, shares |
| Twitter/X | #aviation, #pilots | ✅ Live | Tweets, retweets, likes |
| PilotTerminal | Native posts | ✅ Live | All platform features |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PilotTerminal                        │
│                      (Frontend)                         │
├─────────────────────────────────────────────────────────┤
│  AggregatedSocialFeed Component                         │
│  - Filters (All/Reddit/LinkedIn/Facebook/Twitter)        │
│  - Source badges                                        │
│  - Engagement metrics                                   │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
├─────────────────────────────────────────────────────────┤
│  /api/social-feed                                       │
│  - GET: Fetch from multiple sources                    │
│  - POST: Curated feed with filters                     │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐
│   Reddit    │  │  LinkedIn   │  │  Facebook   │  │Twitter │
│     API     │  │     API     │  │     API     │  │  API   │
└─────────────┘  └─────────────┘  └─────────────┘  └────────┘
```

## How to Use

### For Users

1. **Navigate to PilotTerminal** → Click "Aggregated" tab in the filter bar
2. **Filter by Source** → Use filter pills to show only Reddit, LinkedIn, Facebook, or Twitter
3. **Engage** → Upvote, comment, or share posts directly from the aggregated feed
4. **Visit Original** → Click "View on [source]" to see the full post on the original platform

### For Developers

#### Fetching Reddit Posts

```typescript
import { fetchRedditPosts } from '@/services/social-feed-service';

// Fetch from specific subreddits
const posts = await fetchRedditPosts(
  ['flying', 'aviation', 'pilots'],
  10 // limit
);
```

#### Using the API Endpoint

```bash
# Fetch from multiple subreddits
curl "/api/social-feed?subreddits=flying,aviation&limit=10&sort=hot"

# Get curated feed
curl -X POST "/api/social-feed" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["reddit", "linkedin"],
    "filters": {
      "minEngagement": 10,
      "tags": ["career", "training"]
    }
  }'
```

## Data Structure

```typescript
interface SocialPost {
  id: string;
  source: 'reddit' | 'linkedin' | 'facebook' | 'twitter' | 'pilotterminal';
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video' | 'link';
    url: string;
    thumbnail?: string;
  }[];
  engagement: {
    upvotes?: number;
    likes?: number;
    comments: number;
    shares?: number;
  };
  timestamp: string;
  permalink: string;  // Link to original post
  tags: string[];
  flair?: string;     // Reddit-style flair
  subreddit?: string; // For Reddit posts
  group?: string;     // For Facebook/LinkedIn groups
}
```

## UI Components

### AggregatedSocialFeed
Main component that displays posts from all sources with:
- Source filtering tabs
- Loading skeletons
- Upvoting functionality
- External link buttons

### Source Icons
- Reddit: Orange circle with "R"
- LinkedIn: Blue square with "in"
- Facebook: Blue circle with "f"
- Twitter/X: Black circle with "X"
- PilotTerminal: Yellow circle with "P"

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced filtering by tags/content
- [ ] Bookmark/favorite posts across platforms
- [ ] Cross-platform user profiles
- [ ] AI-powered content curation
- [ ] Custom RSS feed generation

## API Keys Required (for production)

| Platform | Key Location | Endpoint |
|----------|--------------|----------|
| Reddit | App settings | Reddit API v1 |
| LinkedIn | OAuth 2.0 | LinkedIn Marketing API |
| Facebook | Graph API | Facebook Graph API v18 |
| Twitter | Developer Portal | Twitter API v2 |

## Caching Strategy

- Reddit: 5 minutes (public API)
- LinkedIn: 15 minutes (rate limited)
- Facebook: 10 minutes
- Twitter: 5 minutes

All feeds use stale-while-revalidate pattern for optimal performance.

## Compliance & Legal

- All external content links back to original source
- No content is stored permanently (caching only)
- Respects robots.txt and API rate limits
- Complies with each platform's Terms of Service
- Users must click through to engage on original platform
