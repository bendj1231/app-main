import { NextRequest, NextResponse } from 'next/server';

// Reddit API proxy endpoint
// Fetches posts from specified subreddits

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subreddits = searchParams.get('subreddits')?.split(',') || ['flying', 'aviation', 'pilots'];
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'hot';

    const posts = [];

    // Fetch from each subreddit
    for (const subreddit of subreddits) {
      try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`, {
          headers: {
            'User-Agent': 'PilotTerminal/1.0 (Web App)',
          }
        });

        if (!response.ok) {
          console.warn(`Failed to fetch r/${subreddit}: ${response.status}`);
          continue;
        }

        const data = await response.json();

        const subPosts = data.data.children.map((child: any) => ({
          id: `reddit-${child.data.id}`,
          source: 'reddit',
          author: {
            name: child.data.author,
            verified: false
          },
          title: child.data.title,
          content: child.data.selftext || '',
          media: child.data.thumbnail && child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' && child.data.thumbnail !== 'nsfw'
            ? [{ type: 'image', url: child.data.url, thumbnail: child.data.thumbnail }]
            : undefined,
          engagement: {
            upvotes: child.data.ups,
            downvotes: child.data.downs,
            comments: child.data.num_comments,
            ratio: child.data.upvote_ratio
          },
          timestamp: new Date(child.data.created_utc * 1000).toISOString(),
          permalink: `https://reddit.com${child.data.permalink}`,
          tags: [subreddit, 'aviation'],
          flair: child.data.link_flair_text,
          subreddit: child.data.subreddit,
          is_video: child.data.is_video,
          url: child.data.url
        }));

        posts.push(...subPosts);
      } catch (error) {
        console.error(`Error fetching r/${subreddit}:`, error);
      }
    }

    // Sort by engagement (upvotes + comments weighted)
    posts.sort((a, b) => {
      const scoreA = (a.engagement.upvotes || 0) + (a.engagement.comments * 2);
      const scoreB = (b.engagement.upvotes || 0) + (b.engagement.comments * 2);
      return scoreB - scoreA;
    });

    // Limit total results
    const limitedPosts = posts.slice(0, limit * subreddits.length);

    return NextResponse.json({
      success: true,
      posts: limitedPosts,
      meta: {
        total: limitedPosts.length,
        subreddits: subreddits,
        sort: sort,
        fetchedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Social feed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social feed' },
      { status: 500 }
    );
  }
}

// POST endpoint for curated feed configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sources, filters } = body;

    // Validate sources
    const validSources = ['reddit', 'facebook', 'linkedin', 'twitter'];
    const requestedSources = sources?.filter((s: string) => validSources.includes(s)) || ['reddit'];

    // In production, this would fetch from multiple APIs
    // For now, return curated mock data
    const curatedPosts = [
      {
        id: 'reddit-curated-1',
        source: 'reddit',
        author: { name: 'ATP_Pilot_2024', verified: false },
        title: 'Day in the life: Long haul international pilot',
        content: 'Just finished a 4-day trip to Tokyo. Here is what my schedule looked like...',
        engagement: { upvotes: 1250, comments: 89 },
        timestamp: new Date().toISOString(),
        permalink: 'https://reddit.com/r/flying/comments/example',
        tags: ['flying', 'lifestyle', 'international'],
        subreddit: 'flying'
      },
      {
        id: 'linkedin-curated-1',
        source: 'linkedin',
        author: { name: 'Sarah Johnson', verified: true },
        title: 'How I transitioned from flight instructor to airline pilot',
        content: 'The journey took 3 years, but here are the steps that worked for me...',
        engagement: { likes: 3400, comments: 156 },
        timestamp: new Date().toISOString(),
        permalink: 'https://linkedin.com/posts/example',
        tags: ['career', 'transition', 'airlines']
      }
    ];

    return NextResponse.json({
      success: true,
      posts: curatedPosts,
      meta: {
        sources: requestedSources,
        filters: filters || {},
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Curated feed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate curated feed' },
      { status: 500 }
    );
  }
}
