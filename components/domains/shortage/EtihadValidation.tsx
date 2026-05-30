'use client';

import { CheckCircle, Handshake, Building2, ArrowRight } from 'lucide-react';

export default function EtihadValidation() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-6">
              <Handshake className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-bold">Airline Validation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">They Want This Too</h2>
            <p className="text-xl text-gray-300">
              January 21, 2026 — The conversation that changed everything
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                  Etihad Aviation Career Fair
                </h3>
                <p className="text-gray-600">
                  The approach: Not as a job seeker. As a <strong>pilot advocate</strong>.
                </p>
              </div>
            </div>

            {/* The Problem (Airline Side) */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-[#1e3a5f] mb-4">The Problem (From The Airline Side)</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#c41e3a]">•</span>
                  <span>They don't know what to tell pilots who approach them</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c41e3a]">•</span>
                  <span>
                    They have requirements (1,500 hours) but no way to communicate the pathway
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c41e3a]">•</span>
                  <span>They're flooded with unqualified applicants wasting everyone's time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c41e3a]">•</span>
                  <span>
                    They want pilots who are <strong>pre-aligned</strong> to their needs, not
                    surprises
                  </span>
                </li>
              </ul>
            </div>

            {/* The PSA Solution */}
            <div className="bg-[#1e3a5f]/5 border-2 border-[#1e3a5f]/20 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-[#1e3a5f] mb-4">The PSA Solution</h4>
              <blockquote className="text-lg text-[#1e3a5f] italic border-l-4 border-[#c41e3a] pl-4">
                "We're developing a platform where pilots could learn about the expectations, the
                requirements, how to align themselves to a career path which you are offering every
                year, every two years — so that pilots, before they apply to you, they know what to
                expect."
              </blockquote>
            </div>

            {/* The Response */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-green-800">The Response</h4>
              </div>
              <ul className="space-y-2 text-green-700">
                <li>
                  <strong>Welcoming.</strong> Not defensive.
                </li>
                <li>
                  <strong>Agreed it would help.</strong> The airlines recognize the problem too.
                </li>
                <li>
                  <strong>Waiting for platform response.</strong> Etihad and others are onboard.
                </li>
              </ul>
            </div>
          </div>

          {/* The Mutual Benefit */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4">For Pilots</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Know requirements before applying</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Understand the pathway</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>No more wasted 4,000-mile trips</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Dignity in the process</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4">For Airlines</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Pre-qualified, aligned candidates</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Reduced applicant flood</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Transparent communication</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  <span>Better hiring efficiency</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-8 text-center">
            <p className="text-xl text-white font-bold">This isn't pilot vs. airline.</p>
            <p className="text-xl text-[#c41e3a] font-bold mt-2">
              It's broken system vs. both sides.
            </p>
            <p className="text-lg text-gray-300 mt-4">PSA fixes the connection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
