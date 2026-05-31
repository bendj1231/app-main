'use client';

import { ArrowRight, Shield, Globe, Plane } from 'lucide-react';

export default function MissionManifesto() {
  return (
    <div className="bg-[#0a0f1a]">
      {/* Main Manifesto Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#c41e3a]/20 border border-[#c41e3a]/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></span>
            <span className="text-[#c41e3a] text-sm font-bold uppercase tracking-wider">
              The Conversion Loop
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            The Wings We Earned
            <br />
            <span className="text-[#c41e3a]">Deserve The Sky.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            The pilot shortage isn't a lack of talent—it's a{' '}
            <span className="text-white font-bold">massive failure of industry infrastructure.</span>
          </p>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Thousands of commercial pilots worldwide have poured their life savings, years of 
              grueling discipline, and unyielding passion into earning their licenses. Yet, 
              countless excellent aviators are sitting stranded for 2, 3, or 4+ years without 
              a single clear path forward.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Meanwhile, airlines rely on outdated, fragmented social media loops to source talent. 
              We are here to change the industry base permanently. This is not a complaint board. 
              This is a <span className="text-white font-bold">unified, collaborative movement</span> bringing 
              Pilots, Aircraft Manufacturers, and Operators onto a single, high-trust network.
            </p>
            <p className="text-[#c41e3a] font-semibold leading-relaxed">
              Run and managed by pilots who lived the shortage problem—not corporations, not 
              consultants, not people who've never worn the uniform.
            </p>
          </div>
        </div>

        {/* The Three-Step Loop */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-12">
            Fight the Cause. <span className="text-[#c41e3a]">Solidify Your Voice.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1: Share Story */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-2xl border border-white/10 p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[#c41e3a] text-sm font-bold uppercase tracking-wider">
                    Step 1 — Free
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Tell Your Story
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Don't let your training journey become an invisible metric. Share your 
                  experience transparently on our global forum—without naming specific institutions.
                </p>
                <div className="flex items-center gap-2 text-[#c41e3a] text-sm font-semibold">
                  <span>pilotshortage.org</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              {/* Connector arrow (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-[#c41e3a]" />
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-2xl border border-[#c41e3a]/30 p-6 md:p-8 h-full ring-2 ring-[#c41e3a]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[#c41e3a] text-sm font-bold uppercase tracking-wider">
                    Step 2 — $99/year
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Verify Your Credentials
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Make your testimony undeniable. Turn your personal story into a{' '}
                  <span className="text-white">cryptographically verified asset</span> through 
                  zero-data verification badges.
                </p>
                <div className="flex items-center gap-2 text-[#c41e3a] text-sm font-semibold">
                  <span>pilotrecognition.com</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              {/* Connector arrow (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-[#c41e3a]" />
              </div>
            </div>

            {/* Step 3: Demand Pathways */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-2xl border border-white/10 p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[#c41e3a] text-sm font-bold uppercase tracking-wider">
                    Step 3 — Collective Action
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Demand Real Pathways
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Our collective community forces the global aviation supply chain to stop looking away. 
                  Together, we demand international carriers deploy transparent career tracks.
                </p>
                <div className="flex items-center gap-2 text-[#c41e3a] text-sm font-semibold">
                  <span>pilotcareerpathways.com</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* The Unified Value Prop */}
          <div className="mt-12 bg-[#c41e3a]/10 border border-[#c41e3a]/30 rounded-xl p-6 md:p-8">
            <p className="text-gray-300 text-center text-lg leading-relaxed">
              <span className="text-white font-bold">Verified pilots. True stories. Hard-hitting accountability.</span>
              <br className="hidden md:block" />
              Without naming anyone, our collective shows we are collaborative—and we{' '}
              <span className="text-[#c41e3a] font-bold">demand</span> pathways.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#share-story"
            className="inline-flex items-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Share Your Story & Join The Coalition
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Free membership. Identity protected. Verified through pilotrecognition.com
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>
    </div>
  );
}
