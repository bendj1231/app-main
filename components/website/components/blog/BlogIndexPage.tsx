import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight, Search } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BlogPostMeta, BlogCategory } from '@/lib/blog/types';
import { formatDate } from '@/lib/blog/loader';

interface BlogIndexPageProps {
  posts: BlogPostMeta[];
  categories: BlogCategory[];
  tags: string[];
  onNavigate: (page: string) => void;
  onLogin?: () => void;
  onArticleClick: (slug: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({
  posts,
  categories,
  tags,
  onNavigate,
  onLogin,
  onArticleClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesSearch = 
      !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  const featuredPost = posts[0];
  const remainingPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

      {/* Header Section */}
      <div className="pt-32 pb-12 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <RevealOnScroll>
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
              PilotRecognition Insights
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
              Industry Perspectives & Updates
            </h1>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
              Expert analysis on pilot careers, EBT CBTA developments, regulatory changes, 
              and platform innovations from the team building aviation's first recognition-based platform.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {!searchQuery && !selectedTag && selectedCategory === 'All' && featuredPost && (
        <div className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll>
              <div
                onClick={() => onArticleClick(featuredPost.slug)}
                className="group cursor-pointer grid md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video md:aspect-auto md:h-full bg-slate-200 relative overflow-hidden">
                  {featuredPost.featuredImage ? (
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-slate-800">
                      <span className="text-white text-lg font-medium">Featured</span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readingTime} min read
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                    Read Article <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post, index) => (
              <RevealOnScroll key={post.slug} delay={index * 0.1}>
                <article
                  onClick={() => onArticleClick(post.slug)}
                  className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="text-slate-400 text-sm">{post.category}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-slate-700 text-xs font-medium rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-xs">
                          <p className="font-medium text-slate-900">{post.author.name}</p>
                          <p className="text-slate-500">{formatDate(post.publishedAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readingTime}m
                      </span>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {remainingPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="py-12 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-serif text-slate-900 mb-6">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
