'use client';

// PSA - Pilot Shortage Association
// Built from lived experience. Not corporate. Not bullshit.

import PSAHeroSection from './PSAHeroSection';
import The2013Law from './The2013Law';
import TheTriad from './TheTriad';
import CaseStudyApplicant from './CaseStudyStephen';
import AirbusQuote from './AirbusQuote';
import EtihadValidation from './EtihadValidation';
import PilotNotFailure from './PilotNotFailure';
import ShareYourStory from './ShareYourStory';
import SpiritBankruptcy from './SpiritBankruptcy';
import AOMTrap from './AOMTrap';
import SunkCostTrap from './SunkCostTrap';
import FlightInstructorDignity from './FlightInstructorDignity';
import AviationFootprint from './AviationFootprint';
import PSAFooter from './PSAFooter';
import HowWeWork from './HowWeWork';
import PSADocumentRelease from './PSADocumentRelease';

export default function ShortageLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* PSA HERO - The Etihad founding story + Four-Floor Tower */}
      <PSAHeroSection />

      {/* THE 2013 LAW - The $520K gap */}
      <The2013Law />

      {/* THE TRIAD - Who controls your career */}
      <TheTriad />

      {/* SPIRIT AIRLINES - The final trap */}
      <SpiritBankruptcy />

      {/* AOM TRAP - 2,000 students, Cebu Pacific */}
      <AOMTrap />

      {/* SUNK COST TRAP - $50K, expiring credentials */}
      <SunkCostTrap />

      {/* CASE STUDY APPLICANT - The 200:10 Bloodbath */}
      <CaseStudyApplicant />

      {/* FLIGHT INSTRUCTOR DIGNITY - Recognition they deserve */}
      <FlightInstructorDignity />

      {/* AIRBUS QUOTE - 200-hour pilots ARE qualified */}
      <AirbusQuote />

      {/* AVIATION FOOTPRINT - Portable recognition */}
      <AviationFootprint />

      {/* ETIHAD VALIDATION - Airlines want this too */}
      <EtihadValidation />

      {/* THE PILOT IS NOT THE FAILURE - Dignity restoration */}
      <PilotNotFailure />

      {/* HOW WE WORK - Anonymous stories, verification, pathways */}
      <HowWeWork />

      {/* PSA UCF DOCUMENTS - 26 Pillars + 100 Steps Framework */}
      <PSADocumentRelease />

      {/* SHARE YOUR STORY - Verified testimony form */}
      <ShareYourStory />

      {/* NEWS / LATEST ADVOCACY - Association activity */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Latest Advocacy</h2>
            <a href="#" className="text-[#c41e3a] font-medium hover:underline">
              View All News →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                date: 'May 28, 2026',
                category: 'Industry Report',
                title:
                  'New Data Reveals 15,000+ Qualified Pilots Unable to Secure Airline Positions',
                excerpt:
                  'Association research shows systemic barriers preventing qualified aviators from entering the industry.',
              },
              {
                date: 'May 15, 2026',
                category: 'Member Success',
                title: 'PSA Members Secure Transparent Pathway Agreements with Regional Carriers',
                excerpt:
                  'Three regional airlines commit to published hiring criteria following PSA advocacy.',
              },
              {
                date: 'May 5, 2026',
                category: 'Government Relations',
                title: 'Association Submits Testimony to Aviation Workforce Committee',
                excerpt:
                  'PSA representatives highlight regulatory barriers affecting pilot career progression.',
              },
            ].map((news, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="text-[#c41e3a] font-medium">{news.category}</span>
                    <span>|</span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] mb-2 leading-tight hover:text-[#c41e3a] cursor-pointer transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{news.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBER BENEFITS - What you get */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Member Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PSA membership provides professional advocacy, career resources, and industry
              representation for pilots at all career stages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '✓',
                title: 'Career Advocacy',
                desc: 'Direct representation with airlines and training organizations for transparent pathways.',
              },
              {
                icon: '✓',
                title: 'Verified Credentials',
                desc: 'Professional verification system that makes your qualifications visible to employers.',
              },
              {
                icon: '✓',
                title: 'Industry Network',
                desc: 'Connect with 250+ pilots worldwide. Share experiences and career strategies.',
              },
              {
                icon: '✓',
                title: 'Legal Resources',
                desc: 'Access to guidance on contract review, regulatory compliance, and professional rights.',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-16 h-16 bg-[#c41e3a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#c41e3a] text-2xl font-bold">{benefit.icon}</span>
                </div>
                <h3 className="font-bold text-[#1e3a5f] mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP - COMPLETELY FREE */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-bold uppercase tracking-widest mb-4 px-4 py-2 rounded-full border border-green-300">
              100% Free Membership
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free for All Pilots</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PSA is free because our mission is truth, not profit. Every pilot deserves a
              voice—regardless of their bank account.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Student/Graduate - Free */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🎓</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Student Member</h3>
                <div className="text-3xl font-bold text-green-600">FREE</div>
                <p className="text-gray-500 text-sm">For students and recent graduates</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Access to career resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Industry news and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Member forum access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Submit your story</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors">
                Join Free
              </button>
            </div>

            {/* Professional - Free */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-red-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">✈️</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Professional Member</h3>
                <div className="text-3xl font-bold text-green-600">FREE</div>
                <p className="text-gray-500 text-sm">For active pilots and CFIs</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>All Student benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Verified pilot profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Direct airline connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Career advocacy support</span>
                </li>
              </ul>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-colors">
                Join Free
              </button>
            </div>

            {/* Airline Partner */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🏢</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Airline Partner</h3>
                <div className="text-3xl font-bold text-purple-600">FREE</div>
                <p className="text-gray-500 text-sm">For airlines and operators</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Access to verified pilot pool</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Published pathway commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Association partnership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Recruitment support</span>
                </li>
              </ul>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors">
                Partner With Us
              </button>
            </div>
          </div>

          {/* Why Free Banner */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xl">💡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Why Is PSA Free?</h3>
                <p className="text-gray-600 mb-4">
                  We believe the truth about the pilot shortage should not be behind a paywall.
                  Every pilot who invested $50,000–$200,000 in training deserves to be heard,
                  regardless of their current financial situation.
                </p>
                <p className="text-gray-600">
                  Our funding comes from <strong>airline partnerships</strong> and{' '}
                  <strong>advocacy grants</strong>—not from pilot wallets. This keeps us independent
                  and ensures our loyalty is to pilots, not profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHARE YOUR STORY - Bulletproof Submission Form */}
      <section id="share-story" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-[#c41e3a] text-sm font-bold uppercase tracking-widest">
              Verified Testimony
            </span>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mt-2 mb-4">Share Your Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your story matters. Help us document the real barriers facing qualified pilots. All
              submissions are verified and identity-protected.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            {/* Verification Badge Bar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                <span className="text-green-600 text-sm">✓</span>
                <span className="text-green-700 text-xs font-bold uppercase">
                  License Verification Required
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#1e3a5f]/10 px-3 py-1.5 rounded-full">
                <span className="text-[#1e3a5f] text-sm">🔒</span>
                <span className="text-[#1e3a5f] text-xs font-bold uppercase">
                  Identity Protected
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-full">
                <span className="text-gray-600 text-sm">⚖️</span>
                <span className="text-gray-700 text-xs font-bold uppercase">Legally Vetted</span>
              </div>
            </div>

            <form className="space-y-6">
              {/* Personal Information - Protected */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    First Name <span className="text-[#c41e3a]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Daniel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                  <p className="text-gray-400 text-xs mt-1">Only first name shown publicly</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    Last Name <span className="text-[#c41e3a]">*</span>
                    <span className="ml-2 text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      REDACTED PUBLICLY
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Smith"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Displayed as ███████ on public profiles
                  </p>
                </div>
              </div>

              {/* PilotRecognition.com Verification Integration */}
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg p-6">
                <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                  <span className="text-[#c41e3a]">✓</span>
                  Verified Pilot Status <span className="text-[#c41e3a]">*</span>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  PSA partners with <strong>pilotrecognition.com</strong> to verify pilot
                  credentials, background checks, and flight hours. Your verified profile supports
                  our mission of solving the pilot shortage through credible, transparent data.
                </p>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">PR</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#1e3a5f]">pilotrecognition.com</p>
                        <p className="text-gray-500 text-xs">Verified Credential Partner</p>
                      </div>
                    </div>
                    <a
                      href="https://pilotrecognition.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                      Verify Profile →
                    </a>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Pilot license verification (CAAP, FAA, EASA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Medical certificate validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Flight hours logbook review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Background check clearance</span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-[#c41e3a]">ℹ️</span>
                  <span>
                    <strong>How it works:</strong> Complete verification at pilotrecognition.com
                    first. Once verified, return here to link your profile. Your story will display
                    a ✓ VERIFIED badge, making your testimony unassailable.
                  </span>
                </div>
              </div>

              {/* Career Information */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    Total Flight Hours
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 700"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    Type Ratings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ATR 42/72"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    Training Investment
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all">
                    <option>Select range...</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000 - $150,000</option>
                    <option>$150,000 - $200,000</option>
                    <option>$200,000+</option>
                  </select>
                </div>
              </div>

              {/* Your Story - Legally Protected */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                  Your Story <span className="text-[#c41e3a]">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your experience: years invested, training completed, applications submitted, and barriers encountered..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all resize-none"
                />
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-xs">
                    <strong>⚠️ Content Guidelines:</strong> Share your personal journey only. Do NOT
                    include: proprietary company data, internal software details, specific contract
                    clauses, or confidential operational information. Keep it about{' '}
                    <strong>your</strong> experience, <strong>your</strong> investment, and{' '}
                    <strong>your</strong> career timeline.
                  </p>
                </div>
              </div>

              {/* Legal Consent Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm this is my true personal experience. I have not included proprietary
                    company information, trade secrets, or confidential operational data.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                  />
                  <span className="text-sm text-gray-700">
                    I understand my first name and story will be public, but my last name and
                    license details will remain private. I consent to PSA verifying my credentials.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                  />
                  <span className="text-sm text-gray-700">
                    I am not bound by any NDA that prevents me from discussing my personal career
                    experience, compensation, or hiring timeline.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-10 rounded-lg transition-colors text-lg"
                >
                  Submit Verified Story
                </button>
                <p className="text-gray-400 text-xs mt-3">
                  Submissions are reviewed within 24-48 hours. You'll receive email confirmation
                  once verified.
                </p>
              </div>
            </form>
          </div>

          {/* Legal Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs max-w-2xl mx-auto">
              <strong>Legal Protection:</strong> All stories are legally vetted before publication.
              PSA maintains strict editorial standards to ensure compliance with free speech
              protections while avoiding defamation. We do not publish stories containing
              proprietary corporate data or trade secrets.
              <a href="#" className="text-[#c41e3a] hover:underline">
                View our Legal Standards &rarr;
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Association?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Become part of a growing community of aviation professionals advocating for transparent,
            fair career pathways.
          </p>
          <button className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-10 rounded text-lg transition-colors">
            Become a Member Today
          </button>
        </div>
      </section>

      {/* FOOTER - Three domains */}
      <PSAFooter />
    </div>
  );
}
