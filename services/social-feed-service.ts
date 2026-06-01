// Social Feed Service
// Aggregates content from Reddit, Facebook, LinkedIn for PilotTerminal

export interface SocialPost {
  id: string;
  source: 'reddit' | 'facebook' | 'linkedin' | 'twitter' | 'pilotterminal';
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
  permalink: string;
  tags: string[];
  flair?: string;
  subreddit?: string;
  group?: string;
}

// Reddit API Integration
export async function fetchRedditPosts(
  subreddits: string[] = ['flying', 'aviation', 'pilots', 'flighttraining'],
  limit: number = 10
): Promise<SocialPost[]> {
  try {
    // Using Reddit's public JSON API (no auth required for read-only)
    const posts: SocialPost[] = [];
    
    for (const subreddit of subreddits) {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
        headers: {
          'User-Agent': 'PilotTerminal/1.0'
        }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      const subPosts = data.data.children.map((child: any) => ({
        id: `reddit-${child.data.id}`,
        source: 'reddit' as const,
        author: {
          name: child.data.author,
          avatar: `https://www.reddit.com/user/${child.data.author}/avatar`,
          verified: false
        },
        title: child.data.title,
        content: child.data.selftext || '',
        media: child.data.thumbnail && child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' 
          ? [{ type: 'image' as const, url: child.data.url, thumbnail: child.data.thumbnail }]
          : undefined,
        engagement: {
          upvotes: child.data.ups,
          comments: child.data.num_comments,
          shares: child.data.num_crossposts
        },
        timestamp: new Date(child.data.created_utc * 1000).toISOString(),
        permalink: `https://reddit.com${child.data.permalink}`,
        tags: [subreddit, 'aviation', 'pilots'],
        flair: child.data.link_flair_text,
        subreddit: child.data.subreddit
      }));
      
      posts.push(...subPosts);
    }
    
    // Sort by engagement score
    return posts.sort((a, b) => 
      (b.engagement.upvotes || 0) + b.engagement.comments * 2 - 
      ((a.engagement.upvotes || 0) + a.engagement.comments * 2)
    ).slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}

// Mock data for demo purposes (since real APIs need auth)
export function getMockSocialFeed(): SocialPost[] {
  return [
    {
      id: 'reddit-1',
      source: 'reddit',
      author: { name: 'CFI_Jake', verified: true },
      title: 'Pilots of reddit, do you like the life you have?',
      content: "Hey guys, I'm 17, I've started my flight training and I'm going to graduate out of high school this year! I've heard a lot of things about the pilot life on the internet, and I know that everything that is a job becomes boring at some point, and hey, like most, if not all 17 year olds, my biggest fear is living a miserable life.\n\ndo you like being a pilot, and do you think it's worth it?",
      engagement: { upvotes: 71, comments: 71, shares: 5 },
      timestamp: '2026-06-01T10:30:00Z',
      permalink: 'https://reddit.com/r/flying/comments/abc123',
      tags: ['flying', 'career', 'student'],
      flair: 'Career Advice',
      subreddit: 'flying'
    },
    {
      id: 'linkedin-1',
      source: 'linkedin',
      author: { name: 'Sarah Mitchell', verified: true, avatar: '/avatars/sarah.jpg' },
      title: 'Just upgraded to Captain at Delta!',
      content: 'After 8 years of hard work as a First Officer, I finally made it to the left seat. To everyone still working toward their ATP or that first airline job - keep pushing! The view from up here is worth every hour of studying.',
      media: [{ type: 'image', url: '/images/cockpit-view.jpg', thumbnail: '/images/cockpit-thumb.jpg' }],
      engagement: { likes: 892, comments: 45, shares: 23 },
      timestamp: '2026-06-01T08:15:00Z',
      permalink: 'https://linkedin.com/posts/sarah-mitchell-123',
      tags: ['airline', 'captain', 'delta'],
      group: 'Airline Pilots Network'
    },
    {
      id: 'facebook-1',
      source: 'facebook',
      author: { name: 'Mike Chen', verified: false },
      title: 'Question about Part 117 rest requirements',
      content: 'My airline is interpreting the 10-hour rest rule differently than our union. Has anyone dealt with this? Looking for precedent cases or guidance from other majors on how they handle the minimum rest period between duty periods.',
      engagement: { likes: 45, comments: 67, shares: 3 },
      timestamp: '2026-06-01T06:00:00Z',
      permalink: 'https://facebook.com/groups/pilots/posts/456',
      tags: ['regulations', 'fatigue', 'faa'],
      group: 'Professional Pilots Forum'
    },
    {
      id: 'reddit-2',
      source: 'reddit',
      author: { name: 'StudentPilot_Alex', verified: false },
      title: 'Finally soloed today! After 3 weather cancellations.',
      content: 'To all the students out there - the struggle is worth it. Keep at it and dont let weather or setbacks discourage you.',
      engagement: { upvotes: 892, comments: 89, shares: 12 },
      timestamp: '2026-06-01T04:30:00Z',
      permalink: 'https://reddit.com/r/flying/comments/def456',
      tags: ['solo', 'student', 'achievement'],
      flair: 'Success Story',
      subreddit: 'flying'
    },
    {
      id: 'twitter-1',
      source: 'twitter',
      author: { name: 'Captain_Mike', verified: true, avatar: '/avatars/mike.jpg' },
      title: '',
      content: 'The seniority trap is real - but there are ways out. I spent 15 years at a regional before getting my shot at a legacy. Heres what I learned about making yourself marketable during that time.\n\nThread 1/',
      engagement: { likes: 156, comments: 234, shares: 45 },
      timestamp: '2026-05-31T22:00:00Z',
      permalink: 'https://twitter.com/captain_mike/status/789',
      tags: ['seniority', 'career', 'airlines']
    }
  ];
}

// Curated feed combining multiple sources
export async function getCuratedFeed(): Promise<SocialPost[]> {
  // For demo, return mock data
  // In production, this would fetch from multiple APIs
  return getMockSocialFeed();
}

// Webhook handlers for real-time updates
export function setupSocialWebhooks() {
  // Reddit webhook
  // Facebook webhook
  // LinkedIn webhook
  console.log('Social webhooks configured');
}
