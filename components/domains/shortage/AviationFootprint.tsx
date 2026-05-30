'use client';

import { Fingerprint, Plane, Briefcase, Award, TrendingUp } from 'lucide-react';

export default function AviationFootprint() {
  const footprints = [
    { icon: Plane, label: 'Hours Flown', desc: 'Every takeoff, every landing, every hour' },
    { icon: Award, label: 'Ratings Earned', desc: 'Type ratings, certifications, qualifications' },
    { icon: Briefcase, label: 'Training Completed', desc: 'Courses, simulators, checks passed' },
    { icon: TrendingUp, label: 'Experience Gained', desc: 'Skills, judgment, professionalism' },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Fingerprint className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Portable Recognition</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Aviation Footprint
            </h2>
            <p className="text-xl text-gray-300">What you build should travel with you</p>
          </div>

          {/* The Problem */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 text-center">
              The Handcuffed Captain's Dilemma
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h4 className="font-bold text-red-800 mb-3">Current System</h4>
                <ul className="space-y-2 text-red-700">
                  <li>• Seniority = Trapped at one airline</li>
                  <li>• Leave = Start from zero</li>
                  <li>• 12 years of experience = Erased</li>
                  <li>• Aviation footprint = Left behind</li>
                </ul>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-3">PSA Solution</h4>
                <ul className="space-y-2 text-green-700">
                  <li>• Seniority leaves → Recognition stays</li>
                  <li>• Position resets → Footprint travels</li>
                  <li>• 12 years = Verified, portable, valuable</li>
                  <li>• Move freely between airlines/operators</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Makes Up The Footprint */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {footprints.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{item.label}</h4>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plus Recognition */}
          <div className="bg-[#c41e3a] rounded-xl p-6 mb-8 text-center">
            <h4 className="text-xl font-bold text-white mb-2">+ Recognition Earned</h4>
            <p className="text-white/90">
              Your verified, portable record that travels with the pilot — not trapped at one
              airline.
            </p>
          </div>

          {/* The Vision */}
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-white mb-4">
              "We're trying to bring that along with him. Seniority leaves, but his testimony and
              his recognition stays with him. He built something — a fingerprint, a footprint, an
              aviation footprint —<span className="text-[#c41e3a]"> that continues with him."</span>
            </blockquote>
            <p className="text-gray-300 text-lg">Capabilities travel, not just airline tenure.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
