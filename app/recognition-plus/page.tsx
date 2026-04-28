import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function RecognitionPlusPage() {
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as About Us */}
      <div className="relative bg-white pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-400 mb-2">
            PILOTRECOGNITION.COM
          </p>
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-4">
            RECOGNITION PLUS
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
            AI-Powered Career Acceleration: Your Competitive Edge in Aviation
          </h2>
          <p className="text-xl font-medium tracking-wide text-slate-700 italic mb-10">
            Premium Recognition for Professional Pilots Worth $100/Year
          </p>

          <div className="max-w-4xl mx-auto space-y-8 mb-12">
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
              Recognition Plus is the premium subscription that transforms your pilot career from reactive to proactive. In an industry where timing is everything and opportunities are scarce, Recognition Plus gives you the AI-powered insights, verified credentials, and priority access that put you at the front of the line when airlines hire. Our proprietary Recognition AI analyzes your profile against manufacturer standards and airline requirements, providing personalized pathway recommendations that eliminate guesswork and accelerate your journey to the cockpit.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
              For just $99 per year—less than $8.33 per month—you gain access to features that professional pilots value at over $100 annually. This isn't just a subscription; it's an investment in your career that pays dividends through faster hiring, better opportunities, and continuous professional development. Our OEM-aligned profiles verify your competencies against Airbus and Boeing standards, giving airlines the confidence they need to fast-track your application. When hiring surges occur, Recognition Plus members are automatically prioritized in operator selection pools, giving you a significant advantage over free-tier applicants.
            </p>

            {!isFeaturesExpanded && (
              <button
                onClick={() => setIsFeaturesExpanded(true)}
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group px-4 py-2 bg-white border-2 border-blue-600 rounded-lg"
              >
                READ MORE <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {isFeaturesExpanded && (
              <>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                  Our Recognition AI system is the cornerstone of the subscription. It continuously monitors your profile, flight hours, type ratings, and certifications against real-time industry data from airlines and manufacturers. When you're 12 flight hours away from qualifying for a specific airline role, the AI alerts you with exact requirements and actionable steps. It recommends optimal pathways based on your career goals—whether that's cargo operations, corporate aviation, or major airlines—and provides experience advice that helps you make informed decisions about your next career move.
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                  The Priority Access feature ensures that when operators review pathway pools, your profile appears first. This AI-ranked priority system considers multiple factors including your Recognition Score, verified competencies, and subscription status. During partner hiring surges—when airlines urgently need qualified pilots—Recognition Plus members receive interview fast-track access, skipping initial screening stages that can take weeks. This time advantage can mean the difference between landing your dream job and missing the opportunity entirely.
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                  Compliance management is another critical benefit. Our 24/7 automated monitoring system tracks all your licenses, medical certificates, and type ratings with AI-automated alerts that warn you 60 days before expiration. It even suggests local Aviation Medical Examiners with open slots, ensuring you never face a grounding situation due to missed renewals. The auto-logbook sync feature automatically updates your Recognition Score as you fly, keeping your profile current without manual data entry. Zero-fail compliance means you can focus on flying while we handle the administrative burden.
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                  Full database job matching goes beyond the basic profile score available to free users. Recognition Plus includes interview performance data, complete profile analysis, and AI-ranked recommendations for partner airline hiring surges. This comprehensive matching system identifies opportunities that free-tier users miss, connecting you with roles that align perfectly with your experience and career aspirations. The investment of $99 per year provides access to a career acceleration platform that delivers measurable ROI through faster hiring, better positions, and continuous professional growth.
                </p>
              </>
            )}
          </div>

          <Link
            to="/recognition-plus-comparison"
            className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            VIEW FULL COMPARISON TABLE <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 mb-16 overflow-x-auto shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Platform Components</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 font-semibold text-slate-900 w-1/5">Component</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Profile</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Program</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Pathways</th>
                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/3" colSpan={2}>Recognition Plus</th>
              </tr>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-2 px-2 font-semibold text-slate-900 w-1/5"></th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/6">AI</th>
                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/6">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 bg-slate-100">
                <td className="py-2 px-2 text-slate-900 font-semibold">Profile</td>
                <td className="py-2 px-2 text-center text-blue-600">Credentials display</td>
                <td className="py-2 px-2 text-center text-slate-700">Free enrollment</td>
                <td className="py-2 px-2 text-center text-slate-700">Direct entry pathways</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-2 text-slate-900 font-semibold">Programs</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                <td className="py-2 px-2 text-center text-slate-700">Free mentorship</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-100">
                <td className="py-2 px-2 text-slate-900 font-semibold">Pathways</td>
                <td className="py-2 px-2 text-center text-blue-600">Score calculation</td>
                <td className="py-2 px-2 text-center text-slate-700">Standard access</td>
                <td className="py-2 px-2 text-center text-slate-700">Unlimited sectors</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-amber-900 font-semibold">Recognition Plus</td>
                <td className="py-2 px-2 text-center text-amber-600">OEM aligned</td>
                <td className="py-2 px-2 text-center text-amber-600">Fast-track</td>
                <td className="py-2 px-2 text-center text-amber-600">AI recommendations</td>
                <td className="py-2 px-2 text-center text-amber-600">Verification</td>
                <td className="py-2 px-2 text-center text-amber-600">✓ First in pools</td>
              </tr>
            </tbody>
          </table>
          <Link
            to="/recognition-plus-comparison"
            className="block text-center text-blue-600 hover:text-blue-700 text-sm font-bold underline mt-4"
          >
            View full comparison →
          </Link>
        </div>

        {/* Pricing CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Invest in Your Career Today</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Recognition Plus delivers over $100 in annual value through career acceleration, priority access, and comprehensive compliance management—all for just $99/year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-full transition-colors">
              Upgrade to Recognition Plus - $99/year
            </button>
            <button className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-4 rounded-full transition-colors">
              or $14.99/month
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-4">Cancel anytime. No hidden fees.</p>
        </div>

        {/* Feature Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Free Tier</h3>
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

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border-2 border-amber-300">
            <h3 className="text-2xl font-bold text-amber-900 mb-6">Recognition Plus</h3>
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
                <p className="text-slate-700">AI Career Strategist - pathway recommendations, experience advice, job notifications</p>
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

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is Recognition Plus worth the investment?</h3>
              <p className="text-slate-700">Absolutely. Professional pilots value these features at over $100 annually. For $99/year, you get AI-powered career guidance, priority access to hiring surges, interview fast-track, OEM-aligned profiles, and 24/7 compliance monitoring. The faster hiring and better opportunities alone can save you months of job searching and thousands in lost income.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How does the AI Career Strategist work?</h3>
              <p className="text-slate-700">Our AI continuously analyzes your profile against real-time industry data from airlines and manufacturers. It alerts you when you're close to qualifying for specific roles and provides exact requirements. For example: "You need 12 more flight hours on A320 to qualify for Emirates First Officer." It recommends optimal pathways based on your career goals.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What is the Priority Pipeline?</h3>
              <p className="text-slate-700">When operators review pathway pools, Recognition Plus members appear first due to AI-ranked priority. During partner hiring surges, you receive interview fast-track access, skipping initial screening stages. This time advantage can be the difference between landing your dream job and missing the opportunity.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-700">Yes. You can cancel your Recognition Plus subscription at any time with no penalties. Your profile and data will be preserved, and you can continue using the free tier features. Many pilots find the value so compelling they never cancel.</p>
            </div>
          </div>
        </div>

        {/* Strategic Partnerships & Growth Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12 border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Growth & Investor Readiness</h2>
            <p className="text-slate-700 text-center max-w-4xl mx-auto mb-12">
              PilotRecognition is building relationships across the aviation ecosystem to create a comprehensive platform that benefits pilots, flight schools, airlines, and investors alike. Our growth strategy focuses on three key pillars that drive value for all stakeholders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Investor Readiness */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Investor Readiness Traction</h3>
                <p className="text-slate-600 text-sm text-center mb-4">
                  Target: 100-500 pilot subscribers
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  We are building investor readiness traction through organic growth and strategic marketing. Our goal is to achieve 100-500 pilot subscribers to demonstrate market validation and revenue potential. This subscriber base provides the foundation for scaling our platform and attracting strategic investment. Recognition Plus subscriptions at $99/year create a sustainable recurring revenue model that scales with our user base.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    <span className="font-semibold text-blue-600">Revenue Potential:</span> 500 subscribers × $99/year = $49,500 MRR
                  </p>
                </div>
              </div>

              {/* Flight School Partnerships */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Flight School Partnerships</h3>
                <p className="text-slate-600 text-sm text-center mb-4">
                  Target: 2-3 flight schools for referrals
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  We are establishing partnerships with leading flight schools to create a seamless pathway from training to career. Flight schools refer graduating students to PilotRecognition, where they build their professional profiles and access career pathways. In return, flight schools receive data on student placement success and can offer enhanced career services. This partnership model creates value for both parties while supporting the next generation of pilots.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    <span className="font-semibold text-green-600">Partnership Benefits:</span> Student placement tracking, career services enhancement, referral revenue
                  </p>
                </div>
              </div>

              {/* Airline Partnership */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Airline Partnership</h3>
                <p className="text-slate-600 text-sm text-center mb-4">
                  Target: 1 airline pilot program
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Our flagship airline partnership establishes a pilot program where Recognition Plus members receive priority consideration for hiring opportunities. The airline gains access to a pre-vetted pool of qualified pilots with verified competencies and OEM-aligned profiles. This reduces recruitment costs while improving hiring quality. The pilot program serves as a proof-of-concept for scaling partnerships across multiple airlines and aviation sectors.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    <span className="font-semibold text-amber-600">Program Benefits:</span> Pre-vetted talent pool, reduced recruitment costs, faster hiring cycles
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl p-6 border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Why These Partnerships Matter</h3>
              <p className="text-slate-700 text-sm leading-relaxed text-center max-w-4xl mx-auto">
                These strategic initiatives create a self-reinforcing ecosystem: flight schools feed talent into the platform, airlines hire from our verified pool, and investors see a scalable business model with clear revenue streams. For pilots, this means better career opportunities and a more transparent hiring process. For the industry, it addresses the critical talent shortage with data-driven solutions that connect the right pilots to the right opportunities at the right time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
