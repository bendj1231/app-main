'use client';

import { AlertTriangle, TrendingDown, UserX } from 'lucide-react';

export default function SpiritBankruptcy() {
  return (
    <section className="py-16 md:py-24 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-200 border border-red-300 rounded-full px-4 py-2 mb-6">
              <TrendingDown className="w-5 h-5 text-red-700" />
              <span className="text-red-800 font-bold">The Final Trap</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Spirit Airlines</h2>
            <p className="text-xl text-gray-600">The promise that wasn't</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">The Promise vs. Reality</h3>
                <p className="text-gray-600">
                  Even if you beat the odds, get hired, build seniority —
                  <strong> you're not safe.</strong>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* The Promise */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">The Promise</h4>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Make it past the 200:10 gauntlet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Build seniority over years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>You're finally safe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Job security achieved</span>
                  </li>
                </ul>
              </div>

              {/* The Reality */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">The Reality</h4>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✗</span>
                    <span>
                      <strong>Bankrupt.</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✗</span>
                    <span>Pilots with years of service — out of jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✗</span>
                    <span>Overnight. No warning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✗</span>
                    <span className="text-red-800 font-bold">Treated like nothing.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* The Treatment */}
            <div className="bg-[#1e3a5f] rounded-xl p-6 text-white text-center">
              <UserX className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h4 className="text-xl font-bold mb-2">Seniority, investment, sacrifice</h4>
              <p className="text-2xl font-bold text-red-400">Erased by a line item.</p>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-8 text-center">
            <p className="text-xl text-[#1e3a5f] font-bold mb-2">There is no safe harbor.</p>
            <p className="text-lg text-gray-600">
              Not at 200 hours. Not at 1,500 hours. Not at 5,000 hours with 12 years seniority.
            </p>
            <p className="text-[#c41e3a] font-bold text-xl mt-4">The entire system is unstable.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
