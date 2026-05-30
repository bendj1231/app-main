'use client';

import { Award, GraduationCap, ArrowUpRight, Star } from 'lucide-react';

export default function FlightInstructorDignity() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-200 border border-orange-300 rounded-full px-4 py-2 mb-6">
              <Award className="w-5 h-5 text-orange-700" />
              <span className="text-orange-800 font-bold">The Forgotten Experts</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Flight Instructor Dignity Gap
            </h2>
            <p className="text-xl text-gray-600">Give them the recognition they deserve</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-8 md:p-12 mb-8">
            {/* The Problem */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-red-800 mb-4">The Problem</h3>
              <p className="text-gray-700 mb-4">
                Flight instructors have been teaching <strong>too long</strong> with:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No recognition for their expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No pathway to advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>
                    No credibility given for 5,000–7,000 hours of instructional experience
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Treated as "just teachers" rather than aviation professionals</span>
                </li>
              </ul>
            </div>

            {/* The Numbers */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <GraduationCap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1e3a5f]">5,000–7,000</div>
                <div className="text-gray-600 text-sm">Instructional Hours</div>
              </div>
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1e3a5f]">15+</div>
                <div className="text-gray-600 text-sm">Years Teaching</div>
              </div>
              <div className="bg-orange-100 rounded-xl p-6 text-center">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1e3a5f]">500+</div>
                <div className="text-gray-600 text-sm">Students Soloed</div>
              </div>
            </div>

            {/* The Solution */}
            <div className="bg-[#1e3a5f] rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 text-center">PSA Provides What They Deserve</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="font-bold mb-1">Recognition</div>
                  <div className="text-white/70 text-sm">
                    Verified instructional hours, student outcomes, expertise
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="font-bold mb-1">Credibility</div>
                  <div className="text-white/70 text-sm">
                    "Master Instructor" status, verified credentials
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div className="font-bold mb-1">Pathways</div>
                  <div className="text-white/70 text-sm">
                    Corporate aviation, training leadership, airline instructor
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Message */}
          <div className="bg-[#1e3a5f] rounded-2xl p-8 text-white text-center">
            <blockquote className="text-2xl md:text-3xl font-bold mb-4">
              "They've been there too long. Give them the recognition they deserve. Give them the
              credibility they deserve. And create a pathway that's aligned with their profile."
            </blockquote>
            <p className="text-white/70">
              Instructors become visible, valued, and mobile — not trapped for 15 years.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
