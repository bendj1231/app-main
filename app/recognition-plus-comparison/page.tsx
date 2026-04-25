import React from 'react';
import { Link } from 'react-router-dom';

export default function RecognitionPlusComparisonPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-b-2 border-red-500">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link to="/" className="text-red-400 hover:text-red-300 text-sm mb-8 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Free vs Recognition Plus</h1>
          <p className="text-xl text-red-400 font-medium mb-4">Compare Features & Benefits</p>
          <p className="text-slate-300 text-lg max-w-3xl">
            See what's included in our free tier and what premium features Recognition Plus unlocks for your aviation career.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Comparison Table */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-16 overflow-x-auto shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 font-bold text-slate-900 text-lg w-1/5">Platform Component</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6">Pilot Recognition Profile</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6">Foundation Program</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6">Career Pathways</th>
                <th className="text-center py-4 px-4 font-bold text-amber-600 text-lg w-1/3" colSpan={2}>Recognition Plus</th>
              </tr>
              <tr className="border-b-4 border-slate-300">
                <th className="text-left py-4 px-4 font-bold text-slate-900 text-lg w-1/5"></th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6"></th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6"></th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/6"></th>
                <th className="text-center py-4 px-4 font-bold text-amber-600 text-lg w-1/6">Recognition AI</th>
                <th className="text-center py-4 px-4 font-bold text-amber-600 text-lg w-1/6">Priority Access</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Profile</td>
                <td className="py-4 px-4 text-center text-blue-600 text-xs">Basic profile with credentials display across aviation sectors. Shows licenses, type ratings, experience, and Recognition Score to operators.</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">Free enrollment</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">Direct entry pathways</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Profile component</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Profile component</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Programs</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Programs component</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">Free mentorship, interview preparation, skill development, and 50+ hours of coaching. Completing earns priority in operator selection pools.</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Programs component</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Programs component</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">✓ Priority earned through 50+ hours mentorship effort</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Pathways</td>
                <td className="py-4 px-4 text-center text-blue-600 text-xs">Profile score calculation for pathway matching</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">Standard interview access through program completion</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">Unlimited access to all sectors: Cargo, Air Taxi, Private Charter, EMS, Corporate, and more. Submit to pathway pools for operator review.</td>
                <td className="py-4 px-4 text-center text-slate-400 text-xs">Not included in Pathways component</td>
                <td className="py-4 px-4 text-center text-slate-700 text-xs">✓ Standard pool access, priority with 50+ hours</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-slate-900 font-semibold">Recognition Plus</td>
                <td className="py-4 px-4 text-center text-amber-600 text-xs">Enhanced profile with OEM alignment (Airbus/Boeing standards) and Recognition AI verification</td>
                <td className="py-4 px-4 text-center text-amber-600 text-xs">Fast-track interview access with partner airlines, skip initial screening</td>
                <td className="py-4 px-4 text-center text-amber-600 text-xs">AI-powered pathway recommendations, experience advice, job opening notifications with auto-submission option</td>
                <td className="py-4 px-4 text-center text-amber-600 text-xs">Gathers manufacturer/type rating data, compares profile, checks verification status, provides utmost accuracy for career decisions</td>
                <td className="py-4 px-4 text-center text-amber-600 text-xs">✓ Priority listing in operator selection pools, shown first. AI-ranked priority for partner hiring surges.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Feature Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Tier */}
          <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Free Tier</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Create your Pilot Recognition Profile</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Access all career pathways (Cargo, Air Taxi, Private Charter, etc.)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Unlimited job applications</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Profile score calculation</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Foundation Program interview access</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Static medical certificate display on profile</p>
              </li>
            </ul>
          </div>

          {/* Recognition Plus Tier */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-amber-300">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Recognition Plus</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700 font-semibold">Everything in Free, plus:</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Recognition AI - manufacturer data comparison, verification checks, utmost accuracy</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">AI Career Strategist - pathway recommendations, experience advice, job opening notifications</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Priority Pipeline - AI-ranked for partner airline hiring surges</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Interview Fast-Track - skip initial screening with partners</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Pool of Interest Priority - shown first in operator selection pools</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">OEM Aligned Profiles - Airbus/Boeing standards</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">AI-automated medical alerts with 60-day warnings</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Zero-Fail Compliance - 24/7 automated monitoring</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Auto logbook sync with Recognition Score</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Full database job matching including interview data</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Priority System Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How Priority Works</h2>
          <p className="text-slate-700 mb-6 text-center max-w-3xl mx-auto">
            Our priority system is designed to be fair and merit-based. You can earn priority either through Recognition Plus or by putting in the effort through our Foundation Program.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">Recognition Plus</h3>
              <p className="text-slate-600 text-sm text-center">
                Recognition Plus members get priority listing in operator selection pools. Your profile is shown first to operators.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">Foundation Program</h3>
              <p className="text-slate-600 text-sm text-center">
                Free users who complete 50+ hours of mentorship in the Foundation Program also get priority because they have demonstrated experience.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-amber-400 transform scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-lg">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">Both - Top Priority</h3>
              <p className="text-slate-600 text-sm text-center">
                Having both Recognition Plus AND Foundation Program completion puts you at the very top of the priority list.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-slate-700 text-sm text-center">
              <strong className="text-slate-900">Pool of Interest System:</strong> When you express interest in a pathway, your profile is added to a pool of interest. Operators review this pool and handpick candidates based on their needs. Priority status is clearly shown to help operators make informed decisions.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Start free and upgrade when you're ready to accelerate your aviation career.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-3xl font-bold text-white mb-4">$0</p>
              <p className="text-slate-300 text-sm mb-6">Forever free</p>
              <button className="w-full bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-lg font-bold transition-colors">
                Get Started
              </button>
            </div>
            {/* Monthly */}
            <div className="bg-amber-500 border-2 border-amber-400 rounded-xl p-6 transform scale-105">
              <div className="text-amber-900 text-xs font-bold uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Recognition Plus</h3>
              <p className="text-3xl font-bold text-white mb-4">$14.99<span className="text-lg font-normal">/month</span></p>
              <p className="text-amber-900 text-sm mb-6">Cancel anytime</p>
              <button className="w-full bg-white hover:bg-slate-100 text-amber-600 py-3 rounded-lg font-bold transition-colors">
                Upgrade Now
              </button>
            </div>
            {/* Annual */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Annual</h3>
              <p className="text-3xl font-bold text-white mb-4">$99<span className="text-lg font-normal">/year</span></p>
              <p className="text-slate-300 text-sm mb-6">Save 45%</p>
              <button className="w-full bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-lg font-bold transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I switch from Free to Recognition Plus later?</h3>
              <p className="text-slate-700">Yes! You can upgrade to Recognition Plus at any time. Your profile and data will be preserved, and you'll immediately gain access to all premium features.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What's the difference between profile score and full database matching?</h3>
              <p className="text-slate-700">The free tier shows your overall profile score based on your qualifications. Recognition Plus includes full database matching that factors in interview performance, complete profile data, and AI-ranked priority for partner airline hiring surges.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is interview access included in the free tier?</h3>
              <p className="text-slate-700">Yes, standard interview access is included in the free tier as part of our Foundation Program. Recognition Plus provides priority access with partner airline fast-track, allowing you to skip initial screening stages.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do the medical alerts work?</h3>
              <p className="text-slate-700">Free users see a static view of their medical certificate on their profile. Recognition Plus includes AI-automated monitoring that warns you 60 days before your medical expires and suggests local AMEs with open slots.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
