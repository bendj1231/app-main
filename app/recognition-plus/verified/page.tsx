'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function RecognitionPlusVerifiedPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/recognition-plus"
            className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold"
          >
            ← Back to Recognition+ Plans
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Recognition+ Verified
        </h1>

        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            LIVE REAL-TIME PROFILE
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Auto-updating profile that evolves with your career.
          </p>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
            THE PROBLEM
          </h3>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
            Traditional pilot CVs are static documents that become outdated the moment you save them. Hours
            flown, new type ratings, and recent experience aren't reflected in real-time, causing missed
            opportunities when airlines search for candidates.
          </p>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
            OUR SOLUTION
          </h3>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
            Your Recognition Profile automatically syncs with your logbook and updates in real-time. As you log
            hours, earn new ratings, or complete training, your profile instantly reflects these achievements —
            making you discoverable to airlines with current, verified data.
          </p>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            WHAT YOU GET
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Automatic logbook synchronization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Real-time hours and experience updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Instant type rating verification</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Live career progression tracking</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Airline-facing profile visibility</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Zero manual profile maintenance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Historical career data preservation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">Integration with major logbook apps</span>
            </li>
          </ul>

          {/* RECOGNITION AI */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">RECOGNITION AI</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              AI-powered career guidance and pathway optimization.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">THE PROBLEM</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Pilots navigate their careers blindly, unsure which type ratings to pursue, which airlines are
              hiring, or how their profile compares to successful candidates. Career decisions are based on
              hearsay rather than data.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">OUR SOLUTION</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Our AI analyzes your profile against real-time industry data from airlines and manufacturers.
              It provides personalized pathway recommendations, alerts you when you're close to qualifying for
              specific roles, and suggests optimal career moves based on market demand.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">WHAT YOU GET</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Personalized pathway recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Airline-specific qualification alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">OEM-aligned competency analysis (Airbus/Boeing)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Market demand forecasting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Competitive profile benchmarking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Career move optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Type rating ROI analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Hiring surge predictions</span>
              </li>
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-7 mb-3">FOR PILOTS</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Make career decisions based on data, not guesswork</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Know exactly what qualifications you need for target airlines</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Stay ahead of hiring trends and market demands</span>
              </li>
            </ul>
          </div>

          {/* PRIORITY MATCHING */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">PRIORITY MATCHING</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              First in line when airlines search for talent.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">THE PROBLEM</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              When airlines search pilot databases, free profiles are buried under hundreds of applicants. Without
              priority ranking, qualified pilots get overlooked simply because they're not at the top of the list.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">OUR SOLUTION</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Recognition Plus members receive AI-ranked priority placement in airline search results. When operators
              review pathway pools, your profile appears first based on your Recognition Score, verified competencies,
              and subscription status.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">WHAT YOU GET</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">AI-ranked priority in search results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">First visibility in airline pulling system</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Hiring surge priority access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Profile highlighting to recruiters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Top placement in ranked shortlists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Operator notification when you match</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Fast-track interview scheduling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Priority pathway submission</span>
              </li>
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-7 mb-3">FOR PILOTS</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Be seen first when airlines search for pilots</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Skip the queue during urgent hiring surges</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Get noticed by recruiters before free-tier pilots</span>
              </li>
            </ul>
          </div>

          {/* EBT CBTA FAST-TRACK */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">EBT CBTA FAST-TRACK</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Skip the queue for EBT/CBTA interviews.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">THE PROBLEM</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Foundation Program graduates often wait 1-2 months for EBT/CBTA interview slots. During this
              time, hiring opportunities pass by and candidates lose momentum in their job search.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">OUR SOLUTION</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Recognition Plus members receive fast-track access to EBT/CBTA interviews, skipping initial screening
              stages. This time advantage can be the difference between landing your dream job and missing the
              opportunity entirely.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">WHAT YOU GET</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Skip initial screening queues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Priority interview scheduling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Foundation Program fast-track</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Reduced waiting time for assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Direct pathway to airline interviews</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Expedited competency evaluations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Preferential assessment center slots</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Accelerated hiring pipeline</span>
              </li>
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-7 mb-3">FOR PILOTS</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Get assessed faster after Foundation training</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Reduce time between training and employment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Capitalize on urgent hiring opportunities</span>
              </li>
            </ul>
          </div>

          {/* AI MEDICAL ALERTS */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">AI MEDICAL ALERTS</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Never miss a medical renewal with automated monitoring.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">THE PROBLEM</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Medical certificate expiration can ground a pilot unexpectedly. With 60/90-day validity windows and
              complex renewal requirements, it's easy to miss deadlines — especially when managing multiple certificates
              across jurisdictions.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">OUR SOLUTION</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              24/7 automated monitoring tracks all your medical certificates and licenses with AI-powered alerts.
              Get warned 60 days before expiration with suggested Aviation Medical Examiners and open appointment slots.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">WHAT YOU GET</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">60-day expiration warnings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">AME appointment suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Multi-jurisdiction tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">License renewal reminders</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Type rating recency alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Recency requirement monitoring</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Auto-renewal documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Compliance status dashboard</span>
              </li>
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-7 mb-3">FOR PILOTS</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Never face unexpected grounding due to expired certificates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Stay ahead of renewal deadlines with early warnings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Manage multiple licenses across different authorities</span>
              </li>
            </ul>
          </div>

          {/* PROGRAM DISCOUNTS */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">PROGRAM DISCOUNTS</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Save 25-50% on Foundation and Transition programs.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">THE PROBLEM</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Quality flight training programs cost $30,000-$100,000+. These expenses are significant barriers for
              pilots advancing their careers, especially when transitioning between aircraft types or upgrading to command.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">OUR SOLUTION</h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6">
              Recognition Plus members receive exclusive discounts on partner training programs: 25% off Foundation and
              Transition programs, with savings increasing to 50% for Recognition+ Verified members. These discounts alone can
              offset your annual subscription cost.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">WHAT YOU GET</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">25% off Foundation Program (Regular)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">25% off Transition Program (Regular)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">50% off Foundation Program (Verified)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">50% off Transition Program (Verified)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Member-only training rates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Partner ATO preferential pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Type rating cost reductions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Simulator session discounts</span>
              </li>
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-7 mb-3">FOR PILOTS</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Save thousands on essential training programs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Invest in career advancement at reduced costs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">✓</span>
                <span className="text-slate-700">Subscription pays for itself through training savings</span>
              </li>
            </ul>
          </div>

          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Next step</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Choose your plan on the main Recognition+ page.
            </p>

            <Link
              to="/recognition-plus"
              className="inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 transition-colors"
            >
              View plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
