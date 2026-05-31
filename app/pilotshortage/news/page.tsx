'use client';

import { useState } from 'react';
import { ChevronDown, Calendar, ArrowRight, Tag } from 'lucide-react';

const regions = [
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪' },
];

const navItems = [
  { label: 'About PSA', href: '/pilotshortage/about' },
  { label: 'Member Benefits', href: '/pilotshortage/benefits' },
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news', active: true },
];

const newsItems = [
  {
    date: 'May 28, 2026',
    category: 'Industry Report',
    title: 'New Data Reveals 15,000+ Qualified Pilots Unable to Secure Airline Positions',
    excerpt: 'Association research shows systemic barriers preventing qualified aviators from entering the industry. The 1,500-hour rule and lack of structured pathways are identified as primary obstacles.',
    featured: true,
  },
  {
    date: 'May 15, 2026',
    category: 'Member Success',
    title: 'PSA Members Secure Transparent Pathway Agreements with Regional Carriers',
    excerpt: 'Three regional airlines commit to published hiring criteria following PSA advocacy efforts. Members now have clear visibility into requirements before applying.',
    featured: false,
  },
  {
    date: 'May 5, 2026',
    category: 'Government Relations',
    title: 'Association Submits Testimony to Aviation Workforce Committee',
    excerpt: 'PSA representatives highlight regulatory barriers affecting pilot career progression and propose competency-based training alternatives.',
    featured: false,
  },
  {
    date: 'April 22, 2026',
    category: 'Policy Analysis',
    title: 'The "Backlog Illusion": Why 2023 ATP Numbers Are Misleading',
    excerpt: 'Analysis of FAA certification data reveals that 60% of 2023 ATP issuances were pandemic-era backlogs, not sustainable pipeline growth.',
    featured: false,
  },
  {
    date: 'April 10, 2026',
    category: 'Member Story',
    title: '"I Spent $180,000 and 4 Years Building Hours. I Still Cannot Get an Interview."',
    excerpt: 'Verified member testimonial exposes the reality of the hour-building trap and the financial devastation facing qualified pilots.',
    featured: false,
  },
  {
    date: 'March 28, 2026',
    category: 'Industry Partnership',
    title: 'PilotRecognition.com Verification System Reaches 2,000 Verified Pilots',
    excerpt: 'Milestone demonstrates growing demand for transparent, blockchain-verified pilot credentials among both aviators and employers.',
    featured: false,
  },
];

const categories = ['All', 'Industry Report', 'Member Success', 'Government Relations', 'Policy Analysis', 'Member Story', 'Industry Partnership'];

export default function NewsPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredNews = selectedCategory === 'All'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

  const featuredNews = newsItems.find(item => item.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/pilotshortage" className="text-2xl font-bold tracking-tight">
              <span className="text-black">pilot</span>
              <span className="text-red-500">shortage</span>
              <span className="text-black">.org</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                    item.active
                      ? 'text-red-500 font-bold'
                      : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                  <span>{currentRegion.flag}</span>
                  <span className="text-gray-700">{currentRegion.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <a
                href="/pilotshortage/join"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide transition-colors"
              >
                Join PSA
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0a1628] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold uppercase tracking-wider">
              Latest Updates
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            News & Advocacy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The latest from PSA: industry analysis, member success stories, policy updates, 
            and advocacy milestones.
          </p>
        </div>
      </div>

      {/* Featured Article */}
      {featuredNews && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#c41e3a] text-white px-6 py-3">
                  <span className="text-sm font-bold uppercase tracking-wider">Featured Story</span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block bg-[#c41e3a]/10 text-[#c41e3a] px-3 py-1 rounded-full text-sm font-medium">
                      {featuredNews.category}
                    </span>
                    <span className="text-gray-500 text-sm">{featuredNews.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
                    {featuredNews.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">{featuredNews.excerpt}</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[#c41e3a] font-semibold hover:underline">
                    Read Full Report
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <Tag className="w-4 h-4 text-gray-400 mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#c41e3a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredNews.filter(item => !item.featured).map((item, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block bg-[#1e3a5f]/10 text-[#1e3a5f] px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="text-gray-400 text-xs">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] mb-2 leading-tight hover:text-[#c41e3a] cursor-pointer transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[#c41e3a] text-sm font-semibold hover:underline">
                    Read more
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
          <p className="text-gray-300 mb-8">
            Get the latest PSA news, policy updates, and member stories delivered to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            Free subscription. Unsubscribe anytime. No spam.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">
                <span className="text-white">pilot</span>
                <span className="text-red-500">shortage</span>
                <span className="text-gray-400">.org</span>
              </h4>
              <p className="text-gray-400 text-sm">
                Professional representation for aviation professionals worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/about" className="hover:text-white">Our Mission</a></li>
                <li><a href="/pilotshortage/about#four-floors" className="hover:text-white">The Four Floors</a></li>
                <li><a href="/pilotshortage/about#who-we-are" className="hover:text-white">Who We Are</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Members</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/join" className="hover:text-white">Join PSA</a></li>
                <li><a href="/pilotshortage/benefits" className="hover:text-white">Member Benefits</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Advocacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/ucf" className="hover:text-white">UCF Framework</a></li>
                <li><a href="/pilotshortage/news" className="hover:text-white">News & Updates</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Policy Positions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 pilotshortage.org. All rights reserved. Run by pilots, for pilots.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
