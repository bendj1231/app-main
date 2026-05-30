'use client';

import { Shield, Award, Users, TrendingUp } from 'lucide-react';

export default function PilotNotFailure() {
  const youAreNot = [
    { icon: '✗', text: 'A "low-timer"' },
    { icon: '✗', text: '"Inexperienced"' },
    { icon: '✗', text: 'A failure' },
    { icon: '✗', text: 'Unqualified' },
  ];

  const youAre = [
    { icon: Users, text: 'A licensed pilot' },
    { icon: Award, text: 'A trained professional' },
    { icon: TrendingUp, text: 'An investor in your future ($50K+)' },
    { icon: Shield, text: 'A victim of a broken system' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-6xl font-bold text-[#1e3a5f] mb-6">
              The Pilot Is Not The Failure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The industry failed, not the pilot
            </p>
          </div>

          {/* Main Quote */}
          <div className="bg-[#1e3a5f] rounded-2xl p-8 md:p-12 text-white text-center mb-12">
            <blockquote className="text-2xl md:text-3xl font-bold mb-6">
              "The pilot was never a failure."
            </blockquote>
            <div className="space-y-2 text-white/90">
              <p>• 700 hours</p>
              <p>• Incredible experience earned by himself</p>
              <p>• A testimony that matters</p>
              <p className="text-[#c41e3a] font-bold text-xl mt-4">Qualified. Capable. Worthy.</p>
            </div>
          </div>

          {/* What Failed Him */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-bold text-red-800 mb-4 text-center">What Failed Him</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 mb-2">NO</div>
                <div className="text-gray-700">Placement</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 mb-2">NO</div>
                <div className="text-gray-700">Pathway</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 mb-2">NO</div>
                <div className="text-gray-700">Visibility of his value</div>
              </div>
            </div>
          </div>

          {/* You Are Not / You Are */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* You Are Not */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">✗</span>
                You Are NOT
              </h3>
              <ul className="space-y-3">
                {youAreNot.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-red-700">
                    <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-sm">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* You Are */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                You ARE
              </h3>
              <ul className="space-y-3">
                {youAre.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-green-700">
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The Dignity Principle */}
          <div className="bg-[#1e3a5f]/5 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">
              PSA Restores Dignity By
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-[#1e3a5f]">Naming the truth</div>
                  <div className="text-gray-600 text-sm">
                    The pilot is qualified. The system is broken.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-[#1e3a5f]">Verifying credentials</div>
                  <div className="text-gray-600 text-sm">Hours, license, medical — all real.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-[#1e3a5f]">Amplifying testimony</div>
                  <div className="text-gray-600 text-sm">Experience matters and will be heard.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-bold text-[#1e3a5f]">Demanding pathways</div>
                  <div className="text-gray-600 text-sm">
                    Industry must create routes for proven pilots.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Quote */}
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
              "Your testimony is not shame."
            </blockquote>
            <p className="text-3xl md:text-4xl font-bold text-[#c41e3a]">It is power.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
