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
                <th className="text-left py-4 px-4 font-bold text-slate-900 text-lg w-1/4">Feature</th>
                <th className="text-center py-4 px-4 font-bold text-slate-900 text-lg w-1/3">Free Tier</th>
                <th className="text-center py-4 px-4 font-bold text-amber-600 text-lg w-1/3">Recognition Plus</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Profile Creation</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Profile Matching</td>
                <td className="py-4 px-4 text-center text-slate-700">Basic (shows 3 comparisons)</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓ Full comparison</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Pathway Access</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓ Recommended based on profile</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Recognition Score</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Foundation Program (Free)</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Priority Matching</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">AI Career Strategist</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">EBT CBTA Interview Fast-Track (Foundation Program)</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Recognition AI (OEM Aligned)</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">AI Medical Alerts (60-day warnings)</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Priority Pipeline (Hiring Surges)</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Zero-Fail Compliance Monitoring</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="py-4 px-4 text-slate-900 font-semibold">Background Check Verification (Criminal Records)</td>
                <td className="py-4 px-4 text-center text-slate-400">—</td>
                <td className="py-4 px-4 text-center text-amber-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4 text-slate-900 font-semibold">Auto Logbook Sync</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
                <td className="py-4 px-4 text-center text-blue-600">✓</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-slate-900 font-bold bg-amber-50">Price</td>
                <td className="py-4 px-4 text-center text-slate-900 font-bold bg-amber-50">Free</td>
                <td className="py-4 px-4 text-center text-amber-900 font-bold bg-amber-50">$99/year</td>
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
                <p className="text-slate-700">Basic profile matching (shows 3 comparisons)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">View career pathways</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Recognition Score calculation</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Foundation Program (Free)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Static medical certificate display</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Auto Logbook Sync</p>
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
                <p className="text-slate-700">Full profile comparison (vs. basic 3 comparisons)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Pathway recommendations based on profile</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Priority matching</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">AI Career Strategist - pathway recommendations</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">EBT CBTA Interview Fast-Track (Foundation Program) - skip initial screening</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Recognition AI - OEM aligned (Airbus/Boeing)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">AI Medical Alerts - 60-day expiration warnings</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-slate-700">Priority Pipeline - first in hiring surge pools</p>
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
                <p className="text-slate-700">Background Check Verification - criminal records aligned with aviation regulatory standards</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Monthly */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 border-2 border-teal-500 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Monthly Plan</h3>
              <p className="text-4xl font-bold text-white mb-1">$12<span className="text-lg font-normal text-teal-200">/month</span></p>
              <p className="text-sm text-teal-200 mb-2">Flexible, month-to-month</p>
              <p className="text-xs text-teal-300 mb-6 font-semibold">✓ 7-day free trial</p>
              <button className="w-full bg-white hover:bg-teal-50 text-teal-700 py-3 rounded-lg font-bold transition-colors">
                Get Monthly Plan
              </button>
            </div>
            {/* Annual */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-500 rounded-xl p-8 transform scale-105">
              <div className="text-blue-200 text-xs font-bold uppercase mb-2">Best Value</div>
              <h3 className="text-xl font-bold text-white mb-2">Annual Plan</h3>
              <p className="text-4xl font-bold text-white mb-1">$99<span className="text-lg font-normal text-blue-200">/year</span></p>
              <p className="text-sm text-blue-200 mb-2">Saves $45/year</p>
              <p className="text-xs text-blue-300 mb-6 font-semibold">✓ 3-day free trial</p>
              <button className="w-full bg-white hover:bg-blue-50 text-blue-700 py-3 rounded-lg font-bold transition-colors">
                Get Annual Plan
              </button>
            </div>
            {/* Semi-Annual */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-purple-500 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Semi-Annual Plan</h3>
              <p className="text-4xl font-bold text-white mb-1">$60<span className="text-lg font-normal text-purple-200">/6 months</span></p>
              <p className="text-sm text-purple-200 mb-2">Same features, flexible payment</p>
              <p className="text-xs text-purple-300 mb-6 font-semibold">✓ 3-day free trial</p>
              <button className="w-full bg-white hover:bg-purple-50 text-purple-700 py-3 rounded-lg font-bold transition-colors">
                Get Semi-Annual Plan
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-8">Cancel anytime. No hidden fees.</p>
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
