'use client';

import { Shield, Lock, Scale, Send, ExternalLink } from 'lucide-react';

export default function ShareYourStory() {
  return (
    <section id="share-story" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#c41e3a]/10 border border-[#c41e3a]/20 rounded-full px-4 py-2 mb-6">
              <span className="text-[#c41e3a] font-bold">Verified Testimony</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Share Your Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your story matters. Help us document the real barriers facing qualified pilots.
            </p>
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-bold">
                License Verification Required
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#1e3a5f]/10 px-4 py-2 rounded-full">
              <Lock className="w-4 h-4 text-[#1e3a5f]" />
              <span className="text-[#1e3a5f] text-sm font-bold">Identity Protected</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <Scale className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 text-sm font-bold">Legally Vetted</span>
            </div>
          </div>

          {/* The Form */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            {/* How It Works */}
            <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                    1
                  </div>
                  <div className="text-sm font-bold text-[#1e3a5f]">Join PSA</div>
                  <div className="text-xs text-gray-500">Free membership</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                    2
                  </div>
                  <div className="text-sm font-bold text-[#1e3a5f]">Submit Story</div>
                  <div className="text-xs text-gray-500">Your experience</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                    3
                  </div>
                  <div className="text-sm font-bold text-[#c41e3a]">Get Verified</div>
                  <div className="text-xs text-gray-500">$99 via pilotrecognition.com</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                    4
                  </div>
                  <div className="text-sm font-bold text-green-600">✓ VERIFIED</div>
                  <div className="text-xs text-gray-500">Badge activated</div>
                </div>
              </div>
            </div>

            {/* PR Integration */}
            <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <span className="text-[#c41e3a]">✓</span>
                Verification Through pilotrecognition.com
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                PSA partners with <strong>pilotrecognition.com</strong> to verify pilot credentials.
                Your verified profile makes your testimony unassailable.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Pilot license (CAAP, FAA, EASA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Medical certificate</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Background check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Logbook hours</span>
                  </div>
                </div>
              </div>

              <a
                href="https://pilotrecognition.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                Verify on pilotrecognition.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Form Fields */}
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    First Name <span className="text-[#c41e3a]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                  <p className="text-gray-400 text-xs mt-1">Only first name shown publicly</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                    Last Name <span className="text-[#c41e3a]">*</span>
                    <span className="ml-2 text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      REDACTED
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your last name (private)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Displayed as ███████ on public profiles
                  </p>
                </div>
              </div>

              {/* Flight Hours */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                  Total Flight Hours
                </label>
                <input
                  type="number"
                  placeholder="e.g., 200"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                />
              </div>

              {/* Your Story */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">
                  Your Story <span className="text-[#c41e3a]">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your experience: training investment, hours built, barriers faced, and what you want the industry to know..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all resize-none"
                />
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-xs">
                    <strong>Content Guidelines:</strong> Share your personal journey only. Do NOT
                    include proprietary company data or confidential information. Keep it about{' '}
                    <strong>your</strong> experience and investment.
                  </p>
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm this is my true personal experience. I have not included proprietary
                    company information.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-[#c41e3a] rounded border-gray-300 focus:ring-[#c41e3a]"
                  />
                  <span className="text-sm text-gray-700">
                    I understand my first name and story will be public, but my last name will
                    remain private. I consent to PSA verifying my credentials.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-10 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
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
              proprietary corporate data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
