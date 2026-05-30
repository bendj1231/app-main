'use client';

import { Users, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';

export default function AOMTrap() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 rounded-full px-4 py-2 mb-6">
              <GraduationCap className="w-5 h-5 text-orange-700" />
              <span className="text-orange-800 font-bold">The Alternative Trap</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">The AOM Trap</h2>
            <p className="text-xl text-gray-600">When flight schools pivot you mid-course</p>
          </div>

          {/* Main Content */}
          <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-8 md:p-12">
            {/* The Promise */}
            <div className="bg-white rounded-xl p-6 mb-8 border border-orange-200">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                "Switch to AOM — It's Safer"
              </h3>
              <p className="text-gray-600 mb-4">
                Mid-course, flight schools tell students to switch to
                <strong> AOM (Airlines Operations Management)</strong> — "it's safer, it's a safe
                place for you."
              </p>
              <div className="bg-orange-100 rounded-lg p-4">
                <p className="text-orange-800 font-bold">
                  "Get an office job at an airline, earn money, build your flight hours on the side,
                  then upgrade to pilot."
                </p>
              </div>
            </div>

            {/* The Reality */}
            <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-800">The Reality</h3>
              </div>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    Airline operations jobs are <strong>24/7 grind</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    You think you have time for flight training? <strong>You don't.</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Stuck in an office job you never wanted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Watching your pilot dream die slowly</span>
                </li>
              </ul>
            </div>

            {/* The AOM Bloodbath */}
            <div className="bg-[#1e3a5f] rounded-xl p-6 text-white mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8" />
                <h3 className="text-2xl font-bold">The AOM Bloodbath</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">2,000</div>
                  <div className="text-white/70 text-sm">AOM Students/Year</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">2 Years</div>
                  <div className="text-white/70 text-sm">Applying & Waiting</div>
                </div>
              </div>

              <div className="space-y-3 text-white/90">
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 mt-1" />
                  <span>
                    OJT (On-the-Job Training) with airlines like <strong>Cebu Pacific</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 mt-1" />
                  <span>The Absorption Lie: "Do OJT with us, prove yourself, get hired."</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 mt-1" />
                  <span>
                    Most don't get absorbed. Finish OJT, get thanked, join unemployment line.
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-red-500/20 border border-red-400 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-300">95%+</div>
                <div className="text-white/80">
                  Rejection Rate — Disguised as "training opportunity"
                </div>
              </div>
            </div>

            {/* The Truth */}
            <div className="bg-white rounded-xl p-6 border-2 border-[#c41e3a]">
              <h4 className="font-bold text-[#c41e3a] mb-2 text-center">The Schools Know</h4>
              <p className="text-gray-700 text-center">
                They see their own placement data. They know the CPL pipeline is a
                <strong> sunk cost trap.</strong> They steer students away from their own product.
              </p>
              <p className="text-[#1e3a5f] font-bold text-center mt-4">
                The AOM pivot is their admission that the system is broken.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
