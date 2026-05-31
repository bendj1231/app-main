'use client';

import { useState } from 'react';
import { ChevronDown, Shield, Lock, FileText, Send, Check, ArrowLeft } from 'lucide-react';

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
  { label: 'News', href: '/pilotshortage/news' },
];

export default function JoinPSAPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    licenseType: '',
    totalHours: '',
    trainingInvestment: '',
    story: '',
    consent1: false,
    consent2: false,
    consent3: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
  };

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
                  className="text-sm font-medium uppercase tracking-wide transition-colors text-gray-700 hover:text-red-500"
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

              <span className="bg-red-500 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide">
                Join PSA
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Link */}
      <div className="container mx-auto px-4 py-4">
        <a href="/pilotshortage" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#c41e3a] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[#c41e3a] text-sm font-bold uppercase tracking-widest">
            Free Membership
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mt-2 mb-4">
            Join PSA & Share Your Story
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your story matters. Help us document the real barriers facing qualified pilots. 
            All submissions are verified and identity-protected.
          </p>
        </div>

        {/* Verification Badge Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-xs font-bold uppercase">License Verification Required</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1e3a5f]/10 px-3 py-1.5 rounded-full">
            <Lock className="w-4 h-4 text-[#1e3a5f]" />
            <span className="text-[#1e3a5f] text-xs font-bold uppercase">Identity Protected</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-full">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs font-bold uppercase">Legally Vetted</span>
          </div>
        </div>

        {/* The Three-Step Process */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="font-semibold text-sm">Join PSA</div>
              <div className="text-xs text-gray-500">Free membership</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-sm">Verify Credentials</div>
              <div className="text-xs text-gray-500">Via pilotrecognition.com</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-sm">Share Your Story</div>
              <div className="text-xs text-gray-500">Make your voice heard</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                First Name <span className="text-[#c41e3a]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Daniel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <p className="text-gray-400 text-xs mt-1">Only first name shown publicly</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                Last Name <span className="text-[#c41e3a]">*</span>
                <span className="ml-2 text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded">
                  REDACTED PUBLICLY
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g., Smith"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <p className="text-gray-400 text-xs mt-1">Displayed as ███████ on public profiles</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
              Email <span className="text-[#c41e3a]">*</span>
              <span className="ml-2 text-xs font-normal text-gray-500">(Never shared publicly)</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Pilot Information */}
          <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#c41e3a]" />
              Pilot Credentials <span className="text-[#c41e3a]">*</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  value={formData.licenseType}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="ppl">Private Pilot (PPL)</option>
                  <option value="cpl">Commercial Pilot (CPL)</option>
                  <option value="atpl">Airline Transport Pilot (ATPL)</option>
                  <option value="cpl-ir">CPL + Instrument Rating</option>
                  <option value="student">Student Pilot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Flight Hours</label>
                <input
                  type="number"
                  placeholder="e.g., 700"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  value={formData.totalHours}
                  onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Training Investment</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  value={formData.trainingInvestment}
                  onChange={(e) => setFormData({ ...formData, trainingInvestment: e.target.value })}
                >
                  <option value="">Select range...</option>
                  <option value="50-100">$50,000 - $100,000</option>
                  <option value="100-150">$100,000 - $150,000</option>
                  <option value="150-200">$150,000 - $200,000</option>
                  <option value="200+">$200,000+</option>
                </select>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">PR</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a5f]">pilotrecognition.com</p>
                    <p className="text-gray-500 text-xs">Verified Credential Partner</p>
                  </div>
                </div>
                <a
                  href="https://pilotrecognition.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                >
                  Verify Profile →
                </a>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              <strong>How it works:</strong> Complete verification at pilotrecognition.com first. 
              Once verified, return here to link your profile. Your story will display a ✓ VERIFIED badge.
            </p>
          </div>

          {/* Story */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
              Your Story <span className="text-[#c41e3a]">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Describe your experience: years invested, training completed, applications submitted, and barriers encountered..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all resize-none"
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            />
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs">
                <strong>⚠️ Content Guidelines:</strong> Share your personal journey only. Do NOT 
                include: proprietary company data, internal software details, specific contract 
                clauses, or confidential operational information. Keep it about your experience, 
                your investment, and your career timeline.
              </p>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                checked={formData.consent1}
                onChange={(e) => setFormData({ ...formData, consent1: e.target.checked })}
              />
              <span className="text-sm text-gray-700">
                I confirm this is my true personal experience. I have not included proprietary 
                company information, trade secrets, or confidential operational data.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                checked={formData.consent2}
                onChange={(e) => setFormData({ ...formData, consent2: e.target.checked })}
              />
              <span className="text-sm text-gray-700">
                I understand my first name and story will be public, but my last name and 
                license details will remain private. I consent to PSA verifying my credentials.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                checked={formData.consent3}
                onChange={(e) => setFormData({ ...formData, consent3: e.target.checked })}
              />
              <span className="text-sm text-gray-700">
                I am not bound by any NDA that prevents me from discussing my personal career 
                experience, compensation, or hiring timeline.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-10 rounded-lg transition-colors text-lg"
            >
              Submit Verified Story & Join PSA
            </button>
            <p className="text-gray-400 text-xs mt-3">
              Submissions are reviewed within 24-48 hours. You will receive email confirmation 
              once verified. Membership is free and lifetime.
            </p>
          </div>
        </form>

        {/* Legal Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs max-w-2xl mx-auto">
            <strong>Legal Protection:</strong> All stories are legally vetted before publication. 
            PSA maintains strict editorial standards to ensure compliance with free speech 
            protections while avoiding defamation. We do not publish stories containing 
            proprietary corporate data or trade secrets.
            <a href="#" className="text-[#c41e3a] hover:underline ml-1">View our Legal Standards →</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-12 mt-16">
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
