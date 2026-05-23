import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, Search } from 'lucide-react';
import { getAllPostMeta, getCategories } from '@/lib/blog/loader';

// ─── Helper Functions ─────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatReadTime(readingTime: number): string {
  return `${readingTime} min read`;
}

// ─── Color Classes for Categories ─────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Career Development': 'bg-blue-100 text-blue-700 border-blue-200',
  'Industry Trends': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Industry Insights': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Platform Guide': 'bg-violet-100 text-violet-700 border-violet-200',
  'Training': 'bg-amber-100 text-amber-700 border-amber-200',
  'Assessment': 'bg-red-100 text-red-700 border-red-200',
};

// ─── Main Blog Page Component ─────────────────────────────────────

export default function BlogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Fetch posts from markdown files (client-side)
  const [allPosts] = useState(getAllPostMeta());
  const [categories] = useState(getCategories());
  
  // Get search and filter params
  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';
  
  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // Get featured post (most recent)
  const featuredPost = allPosts[0];
  const regularPosts = activeCategory === 'All' && searchQuery === '' 
    ? filteredPosts.filter(p => p.slug !== featuredPost?.slug)
    : filteredPosts;
  
  // All categories for filter
  const allCategories = ['All', ...categories];

  const handleCategoryClick = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="https://pilotrecognition.com" className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">Pilot</span>
                <span className="text-lg font-bold text-red-600">Recognition</span>
              </a>
              <span className="text-sm font-semibold text-slate-500 tracking-wide">Blog</span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://pilotrecognition.com/become-member"
                className="hidden sm:inline-flex bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Create Profile →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-red-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-5">PilotRecognition Insights</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 text-slate-900">
            Modern Aviation<br />
            <span className="text-red-600">Career Intelligence.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
            Evidence-based strategies for pilots navigating the new competency-focused recruitment landscape. 
            No fluff. Just what works.
          </p>

          {/* Search & Filter */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === 'All' && searchQuery === '' && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Featured Article</p>
          <div 
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            className="group grid lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img 
                src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'} 
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${CATEGORY_COLORS[featuredPost.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {featuredPost.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span>{featuredPost.author.name}</span>
                <span>•</span>
                <span>{formatDate(featuredPost.publishedAt)}</span>
                <span>•</span>
                <span>{formatReadTime(featuredPost.readingTime)}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-red-600 font-semibold group/btn">
                Read Article 
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Post Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-6">
          {activeCategory === 'All' ? 'All Articles' : `${activeCategory} Articles`}
        </p>
        
        {regularPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No articles found matching your criteria.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-red-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <div
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className={`inline-flex w-fit px-2 py-1 rounded-md text-[10px] font-semibold border mb-3 ${CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatReadTime(post.readingTime)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Ahead of the Industry</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Get weekly insights on EBT/CBTA transitions, competency-based hiring, and aviation career strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-slate-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
              </span>
              <span className="text-sm font-semibold text-slate-500 tracking-wide">Blog</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="https://pilotrecognition.com" className="hover:text-red-600 transition-colors">Home</a>
              <a href="https://pilotrecognition.com/about" className="hover:text-red-600 transition-colors">About</a>
              <a href="https://pilotrecognition.com/pathways-modern" className="hover:text-red-600 transition-colors">Pathways</a>
              <a href="https://pilotrecognition.com/recognition-plus" className="hover:text-red-600 transition-colors">Recognition+</a>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">© 2026 PilotRecognition. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
