'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share, ExternalLink, ThumbsUp, Heart, Repeat2, Filter, RefreshCw } from 'lucide-react';
import { getCuratedFeed, SocialPost, fetchRedditPosts } from '../../../services/social-feed-service';

interface AggregatedSocialFeedProps {
  className?: string;
}

export default function AggregatedSocialFeed({ className = '' }: AggregatedSocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'reddit' | 'linkedin' | 'facebook' | 'twitter'>('all');
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // In production, this would call the real APIs
    // const redditPosts = await fetchRedditPosts(['flying', 'aviation', 'pilots'], 5);
    const feed = await getCuratedFeed();
    setPosts(feed);
    setLoading(false);
  };

  const toggleUpvote = (postId: string) => {
    setUpvotedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.source === filter);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'reddit':
        return <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">R</div>;
      case 'linkedin':
        return <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">in</div>;
      case 'facebook':
        return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">f</div>;
      case 'twitter':
        return <div className="w-5 h-5 bg-black border border-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">X</div>;
      default:
        return <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">P</div>;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'reddit': return 'border-orange-500/50';
      case 'linkedin': return 'border-blue-600/50';
      case 'facebook': return 'border-blue-500/50';
      case 'twitter': return 'border-gray-500/50';
      default: return 'border-yellow-500/50';
    }
  };

  const getEngagementIcon = (source: string) => {
    switch (source) {
      case 'reddit': return <ArrowBigUp className="w-4 h-4" />;
      case 'linkedin': return <ThumbsUp className="w-4 h-4" />;
      case 'facebook': return <Heart className="w-4 h-4" />;
      case 'twitter': return <Heart className="w-4 h-4" />;
      default: return <ArrowBigUp className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className={"space-y-4 " + className}>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Aggregated Pilot Feed
        </h2>
        <button 
          onClick={loadPosts}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Sources', count: posts.length },
          { id: 'reddit', label: 'Reddit', count: posts.filter(p => p.source === 'reddit').length },
          { id: 'linkedin', label: 'LinkedIn', count: posts.filter(p => p.source === 'linkedin').length },
          { id: 'facebook', label: 'Facebook', count: posts.filter(p => p.source === 'facebook').length },
          { id: 'twitter', label: 'X/Twitter', count: posts.filter(p => p.source === 'twitter').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={"flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors " + 
              (filter === tab.id 
                ? "bg-yellow-500 text-black" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700")}
          >
            {tab.label}
            <span className={"px-1.5 py-0.5 rounded-full text-[10px] " + 
              (filter === tab.id ? "bg-black/20" : "bg-gray-700 text-gray-300")}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <article 
            key={post.id} 
            className={"bg-gray-900/50 border-l-2 " + getSourceColor(post.source) + " rounded-r-lg p-4 hover:bg-gray-900 transition-colors group"}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              {getSourceIcon(post.source)}
              <span className="text-xs text-gray-400">
                {post.source === 'reddit' && post.subreddit && `r/${post.subreddit} • `}
                {post.source === 'facebook' && post.group && `${post.group} • `}
                {post.source === 'linkedin' && post.group && `${post.group} • `}
                u/{post.author.name}
              </span>
              {post.author.verified && (
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">✓ Verified</span>
              )}
              {post.flair && (
                <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">{post.flair}</span>
              )}
              <span className="text-xs text-gray-500 ml-auto">{new Date(post.timestamp).toLocaleDateString()}</span>
            </div>

            {/* Title */}
            {post.title && (
              <h3 className="font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors cursor-pointer">
                {post.title}
              </h3>
            )}

            {/* Content */}
            <p className="text-sm text-gray-300 mb-3 line-clamp-3">
              {post.content}
            </p>

            {/* Media Preview */}
            {post.media && post.media.length > 0 && (
              <div className="mb-3 rounded-lg overflow-hidden bg-gray-800">
                {post.media[0].type === 'image' && (
                  <img 
                    src={post.media[0].thumbnail || post.media[0].url} 
                    alt="Post media" 
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button 
                onClick={() => toggleUpvote(post.id)}
                className={"flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors " + 
                  (upvotedPosts.has(post.id) ? "text-orange-500" : "")}
              >
                {getEngagementIcon(post.source)}
                <span>
                  {upvotedPosts.has(post.id) 
                    ? (post.engagement.upvotes || post.engagement.likes || 0) + 1 
                    : (post.engagement.upvotes || post.engagement.likes || 0)}
                </span>
              </button>

              <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{post.engagement.comments}</span>
              </button>

              <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>

              <a 
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors ml-auto text-gray-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on {post.source}</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <button className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium">
        Load More Posts
      </button>
    </div>
  );
}
