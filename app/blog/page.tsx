'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Search,
  ChevronRight,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

// ─── Blog Post Data ───────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'modern-aviation-profile',
    title: 'Aligning Your Profile for the Modern Aviation Market',
    excerpt: 'Recruiters now prioritize competency-based evidence and professional alignment over simple logbook stats. Learn how to build a capability profile that stands out.',
    content: `# Aligning Your Profile for the Modern Aviation Market

To align your profile for the modern aviation market on platforms like PilotRecognition, you should look beyond just total flight hours. Recruiters now prioritize competency-based evidence and professional alignment over simple logbook stats.

## 1. Competency-Based Training (EBT & CBTA)

Modern airlines, especially those partnered with Airbus and Etihad, are moving toward Evidence-Based Training (EBT) and Competency-Based Training and Assessment (CBTA).

**Action:** Highlight specific training phases where you demonstrated core ICAO competencies, such as workload management, situational awareness, and manual aircraft control.

## 2. "Skill Stacking" & Non-Technical Skills

Instead of a standard résumé, aim for a capability profile. This involves "skill stacking"—building a range of abilities that elevate both your performance and safety floor.

**Soft Skills:** Focus on Crew Resource Management (CRM), decision-making under pressure, and effective communication.

**Teaching Experience:** Recruiters highly value Flight Instructor (CFI) experience because it proves you have mastered aviation concepts and can clearly communicate them.

## 3. Cultural and Strategic Alignment

Successful candidates understand the "Four Pillars" of the airline they are applying to: Finance, Product, Employee (Culture), and Environment.

**Cultural Fit:** Demonstrate an understanding of labor dynamics and the airline's specific safety and operational culture.

**Sustainability:** Be prepared to discuss how sustainability pressures are reshaping the industry, as this is becoming a key strategic lens for major carriers.

## 4. Technical and Psychological Readiness

Airlines use sophisticated hiring assessments to filter candidates.

**Cognitive & Personality Profiles:** Expect batteries focusing on attention switching, working memory, and personality profiles designed to identify a safe, reliable operating attitude.

**Language Proficiency:** While ICAO Level 4 is the minimum, many leading carriers prefer higher levels for better operational safety.

## 5. Verified Recognition and Mentorship

Use the PilotRecognition AI-powered pathway to match your verified profile against specific airline requirements.

**ATLAS CV Formatting:** Use platform-specific tools like WingMentor to manage your profile and ensure it is formatted according to proprietary ATLAS standards, making it easier for employers to find you.

**Mentorship:** Engaging with accredited mentorship programs can help refine your profile and unlock elite career pathways that might otherwise be overlooked.`,
    author: 'PilotRecognition Editorial',
    date: '2026-05-10',
    readTime: '8 min read',
    category: 'Career Development',
    tags: ['EBT', 'CBTA', 'Skill Stacking', 'ATLAS CV', 'Mentorship', 'Competency-Based Training'],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    featured: true,
  },
  {
    id: 'recognition-score-explained',
    title: 'Understanding Your Recognition Score',
    excerpt: 'Your Recognition Score is more than a number—it\'s your currency for pathway access in modern aviation recruitment.',
    content: `# Understanding Your Recognition Score

Your Recognition Score represents a comprehensive evaluation of your readiness for modern aviation careers...`,
    author: 'PilotRecognition Data Science Team',
    date: '2026-05-08',
    readTime: '6 min read',
    category: 'Platform Guide',
    tags: ['Recognition Score', 'Metrics', 'Career Progression'],
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  },
  {
    id: 'ebt-cbta-transition',
    title: 'The Industry Shift to EBT/CBTA: What Pilots Need to Know',
    excerpt: 'Evidence-Based Training and Competency-Based Training Assessment are reshaping how airlines evaluate pilot competence.',
    content: `# The Industry Shift to EBT/CBTA

The aviation industry is undergoing a fundamental transformation in how pilot competence is assessed...`,
    author: 'Capt. Sarah Chen',
    date: '2026-05-05',
    readTime: '10 min read',
    category: 'Industry Trends',
    tags: ['EBT', 'CBTA', 'Training', 'Industry Change'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  },
  {
    id: 'atlas-cv-guide',
    title: 'ATLAS CV: The New Standard for Pilot Profiles',
    excerpt: 'Why traditional résumés are becoming obsolete and how ATLAS formatting helps employers find you faster.',
    content: `# ATLAS CV: The New Standard

Traditional pilot résumés are static documents that fail to capture the dynamic nature of modern aviation careers...`,
    author: 'PilotRecognition Product Team',
    date: '2026-05-01',
    readTime: '5 min read',
    category: 'Platform Guide',
    tags: ['ATLAS CV', 'Profile Building', 'Job Search'],
    image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80',
  },
];

const CATEGORIES = ['All', 'Career Development', 'Industry Trends', 'Platform Guide', 'Training'];

// ─── Color Classes for Categories ─────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Career Development': 'bg-blue-100 text-blue-700 border-blue-200',
  'Industry Trends': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Platform Guide': 'bg-violet-100 text-violet-700 border-violet-200',
  'Training': 'bg-amber-100 text-amber-700 border-amber-200',
};

// ─── Main Blog Page Component ─────────────────────────────────────

export default function BlogPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ─── Blog Post Detail View ──────────────────────────────────────

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        {/* Sticky Nav */}
        <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className="max-w-6xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span className="text-sm font-medium">Back to Blog</span>
                </button>
              </div>
              <a href="https://pilotrecognition.com" className="flex items-center gap-2 text-slate-900">
                <span className="text-lg font-bold">Pilot<span className="text-red-600">Recognition</span></span>
              </a>
            </div>
          </div>
        </header>

        {/* Article Header */}
        <section className="relative border-b border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[selectedPost.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {selectedPost.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedPost.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{selectedPost.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Share */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Share</p>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Twitter className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Linkedin className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Facebook className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-2">Build Your Profile</p>
                  <p className="text-slate-700 text-sm mb-3">Create your verified PilotRecognition profile today.</p>
                  <button 
                    onClick={() => navigate('/become-member')}
                    className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-3 prose prose-slate max-w-none">
              <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </article>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Modernize Your Aviation Career?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of pilots who have switched from static résumés to live, verified profiles on PilotRecognition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/become-member')}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                Create Free Profile
              </button>
              <button 
                onClick={() => navigate('/recognition-plus')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                View Recognition+
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
              </span>
              <span className="text-sm font-semibold text-slate-500 tracking-wide">Blog</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 PilotRecognition. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ─── Blog Listing View ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Sticky Nav */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="https://pilotrecognition.com" className="flex items-center gap-3 group">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
              </span>
              <span className="text-sm font-semibold text-slate-900 tracking-wide">Blog</span>
            </a>

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
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
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === 'All' && searchQuery === '' && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Featured Article</p>
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group grid lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedPost(featuredPost)}
          >
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${CATEGORY_COLORS[featuredPost.category]}`}>
                {featuredPost.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>{formatDate(featuredPost.date)}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <button className="inline-flex items-center gap-2 text-red-600 font-semibold group/btn">
                Read Article 
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.article>
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
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 text-red-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col"
                onClick={() => setSelectedPost(post)}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={post.image} 
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
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.article>
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
