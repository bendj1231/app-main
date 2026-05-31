'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Eye,
  Pin,
  Award,
  Lock
} from 'lucide-react';

// Types
interface ForumCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  requires_verification: boolean;
  topic_count?: number;
}

interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: string;
  author_name: string;
  display_name: string | null;
  is_verified_author: boolean;
  verification_badge_level: 'none' | 'psa_member' | 'pilot_recognition' | 'veremark_verified';
  category_id: string;
  category_name: string;
  category_slug: string;
  view_count: number;
  reply_count: number;
  like_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  last_reply_at: string | null;
}

export default function PSAForumPage() {
  const { currentUser: user, userProfile: profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'verified'>('trending');

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Load topics when category or tab changes
  useEffect(() => {
    loadTopics();
  }, [selectedCategory, activeTab]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (!error && data) {
      setCategories(data);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:author_id (full_name),
          forum_categories:category_id (name, slug)
        `)
        .eq('status', 'active')
        .order('is_pinned', { ascending: false });

      if (selectedCategory) {
        const category = categories.find(c => c.slug === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (activeTab === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'verified') {
        query = query.eq('is_verified_author', true)
                     .order('created_at', { ascending: false });
      } else {
        // trending - by reply count and last activity
        query = query.order('last_reply_at', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query.limit(50);

      if (!error && data) {
        const formattedTopics: ForumTopic[] = data.map((t: any) => ({
          ...t,
          author_name: t.profiles?.full_name || 'Unknown',
          category_name: t.forum_categories?.name || '',
          category_slug: t.forum_categories?.slug || ''
        }));
        setTopics(formattedTopics);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_forum', {
        p_query: searchQuery,
        p_limit: 20
      });

      if (!error && data) {
        // Convert search results to topic format
        const searchResults: ForumTopic[] = data.map((result: any) => ({
          id: result.id,
          title: result.title,
          slug: result.id,
          excerpt: result.content,
          content: result.content,
          author_id: '',
          author_name: 'Search Result',
          display_name: null,
          is_verified_author: false,
          verification_badge_level: 'none',
          category_id: '',
          category_name: 'Search',
          category_slug: 'search',
          view_count: 0,
          reply_count: 0,
          like_count: 0,
          is_pinned: false,
          is_featured: false,
          created_at: new Date().toISOString(),
          last_reply_at: null
        }));
        setTopics(searchResults);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (level: string) => {
    switch (level) {
      case 'veremark_verified':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'pilot_recognition':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'psa_member':
        return <Users className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getBadgeLabel = (level: string) => {
    switch (level) {
      case 'veremark_verified':
        return 'Verified Pilot';
      case 'pilot_recognition':
        return 'PR Verified';
      case 'psa_member':
        return 'PSA Member';
      default:
        return 'Guest';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - NAR Style */}
      <div className="bg-[#1e3a5f] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PSA Community Forum</h1>
              <p className="text-white/70 text-sm">Verified pilot stories. No anonymous venting.</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, stories, advice..."
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1 space-y-4">
            {/* New Topic Button */}
            {user && (
              <button
                onClick={() => setShowNewTopicModal(true)}
                className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Share Your Story
              </button>
            )}

            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Sign in to share your story
                </p>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700">Categories</h3>
              </div>
              <nav className="divide-y divide-gray-100">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    !selectedCategory ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="flex-1">All Topics</span>
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      selectedCategory === category.slug ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="flex-1 text-sm">{category.name}</span>
                    {category.requires_verification && (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-700 mb-3">Community Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Topics</span>
                  <span className="font-medium">{topics.length}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified Pilots</span>
                  <span className="font-medium text-green-600">
                    {topics.filter(t => t.is_verified_author).length}+
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stories Shared</span>
                  <span className="font-medium">
                    {topics.reduce((acc, t) => acc + t.reply_count, 0)}+
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Topics List */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'trending', label: 'Trending', icon: TrendingUp },
                  { id: 'recent', label: 'Recent', icon: Clock },
                  { id: 'verified', label: 'Verified Only', icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#1e3a5f] border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-500">Loading discussions...</p>
                </div>
              ) : topics.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No topics yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to share your story in this category.</p>
                  {user && (
                    <button
                      onClick={() => setShowNewTopicModal(true)}
                      className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a73] transition-colors"
                    >
                      Start a Discussion
                    </button>
                  )}
                </div>
              ) : (
                topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => navigate(`/forum/topic/${topic.slug}`)}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      topic.is_pinned ? 'border-l-4 border-l-[#1e3a5f]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Author Avatar Area */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          topic.is_verified_author ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {topic.is_verified_author ? (
                            <Shield className="w-5 h-5 text-green-600" />
                          ) : (
                            <Users className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          {topic.is_pinned && (
                            <Pin className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-1" />
                          )}
                          <h3 className="font-semibold text-gray-900 leading-tight hover:text-[#1e3a5f]">
                            {topic.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {topic.excerpt || topic.content.substring(0, 150)}...
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {/* Author Badge */}
                          <div className="flex items-center gap-1.5">
                            {getBadgeIcon(topic.verification_badge_level)}
                            <span className={topic.is_verified_author ? 'text-green-600 font-medium' : ''}>
                              {topic.display_name || topic.author_name}
                            </span>
                            {topic.is_verified_author && (
                              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                {getBadgeLabel(topic.verification_badge_level)}
                              </span>
                            )}
                          </div>

                          <span>•</span>

                          {/* Category */}
                          <span className="text-gray-400">{topic.category_name}</span>

                          <span>•</span>

                          {/* Time */}
                          <span>{formatTimeAgo(topic.created_at)}</span>

                          {topic.last_reply_at && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Active {formatTimeAgo(topic.last_reply_at)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-4 h-4" />
                            {topic.view_count}
                          </span>
                          <span className="flex items-center gap-1" title="Replies">
                            <MessageSquare className="w-4 h-4" />
                            {topic.reply_count}
                          </span>
                          <span className="flex items-center gap-1" title="Support">
                            <ThumbsUp className="w-4 h-4" />
                            {topic.like_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <NewTopicModal
          categories={categories}
          onClose={() => setShowNewTopicModal(false)}
          onSuccess={() => {
            setShowNewTopicModal(false);
            loadTopics();
          }}
        />
      )}
    </div>
  );
}

// New Topic Modal Component
function NewTopicModal({ 
  categories, 
  onClose, 
  onSuccess 
}: { 
  categories: ForumCategory[]; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { currentUser: user, userProfile: profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showRealName, setShowRealName] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = categories.find(c => c.id === categoryId);
  const requiresVerification = selectedCategory?.requires_verification || false;
  const isVerified = profile?.verified_account || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;

    if (requiresVerification && !isVerified) {
      setError('This category requires a verified PilotRecognition profile. Please complete verification first.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('forum_topics')
        .insert({
          category_id: categoryId,
          author_id: user!.id,
          title: title.trim(),
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100),
          content: content.trim(),
          display_name: displayName.trim() || null,
          show_real_name: showRealName,
          excerpt: content.trim().substring(0, 300)
        });

      if (submitError) throw submitError;
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create topic. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share Your Story</h2>
          <p className="text-gray-500 text-sm mt-1">
            Your experience helps other pilots. Verification badges add credibility.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1e3a5f]"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                  {cat.requires_verification ? ' (Verified Only)' : ''}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 2015 Graduate - Still Waiting After 11 Years"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1e3a5f]"
              maxLength={200}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Story *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience, timeline, flight school, applications, and where you are now..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1e3a5f] h-40 resize-y"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific. Include dates, flight schools, airlines contacted, and outcomes. Specificity builds credibility.
            </p>
          </div>

          {/* Identity Protection */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Identity Protection
            </h4>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Captain Niraj, Batch2015_Pilot, 200hr_Grad"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use your real name. Use a pseudonym for anonymity.
              </p>
            </div>

            {isVerified && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showRealName}
                  onChange={(e) => setShowRealName(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Show my real name alongside my verified badge</span>
              </label>
            )}
          </div>

          {/* Verification Notice */}
          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Your story will be verified</p>
                <p>Your Veremark verification will appear as a badge on this post.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim() || !categoryId}
              className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Posting...' : 'Share Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
