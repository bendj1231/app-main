'use client';

import { AlertTriangle, Calculator } from 'lucide-react';

export default function The2013Law() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 border border-red-300 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-bold">The Breaking Point</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">The 2013 Law</h2>
            <p className="text-xl text-gray-600">The regulation that crashed pilot careers</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: The Problem */}
              <div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                  Career Genocide for Pilots
                </h3>
                <p className="text-gray-600 mb-4">
                  After a crash, the <strong>1,500-hour minimum</strong> rule was implemented. The
                  intent was safety. The aviation industry now has the safest record ever.
                </p>
                <p className="text-gray-600 mb-4">
                  The <strong>unintended consequence:</strong> The gap between CPL (200 hours) and
                  airline minimum (1,500 hours) became a chasm.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-bold">
                    "I can't find a position" became the anthem of a generation.
                  </p>
                </div>
              </div>

              {/* Right: The Math */}
              <div className="bg-[#1e3a5f] rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-6 h-6" />
                  <h4 className="text-xl font-bold">The Math</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>CPL Hours</span>
                    <span className="font-bold">200</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Airline Minimum</span>
                    <span className="font-bold">1,500</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Gap to Bridge</span>
                    <span className="font-bold text-[#c41e3a]">1,300 hours</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Cost per Hour</span>
                    <span className="font-bold">~$400</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg">Total Gap Cost</span>
                    <span className="text-2xl font-bold text-[#c41e3a]">$520,000</span>
                  </div>
                </div>

                <p className="text-white/70 text-sm mt-4">To qualify for an entry-level job.</p>
              </div>
            </div>

            {/* Bottom: The Real Shortage */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <blockquote className="text-2xl md:text-3xl font-bold text-[#1e3a5f] text-center">
                "It's not about how many pilots there are. It's about the industry's
                <span className="text-[#c41e3a]"> broken pipeline</span> — the track to get from
                graduation to a job position."
              </blockquote>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-[#c41e3a]">2013</div>
              <div className="text-gray-600 text-sm">Law Implemented</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-[#c41e3a]">1,300</div>
              <div className="text-gray-600 text-sm">Hour Gap</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-[#c41e3a]">$520K</div>
              <div className="text-gray-600 text-sm">To Bridge</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
