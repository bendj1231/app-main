'use client';

import { FileText, Download, ExternalLink, Shield, Clock, Users } from 'lucide-react';

export default function PSADocumentRelease() {
  return (
    <section className="py-16 md:py-24 bg-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-[#c41e3a]" />
              <span className="text-white font-bold">Official Framework Documents</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              PSA Universal Commercial Framework
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our 26-pillar advocacy grid and 100-step roadmap to unclog the pipeline by September
              2026.
            </p>
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 26 Pillars Document */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-[#c41e3a]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-[#c41e3a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">PSA UCF: 26 Pillars</h3>
                  <p className="text-gray-400 text-sm">
                    The complete advocacy framework covering Voice, Verification, and Pathways.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Users className="w-4 h-4 text-[#c41e3a]" />
                  <span>Cluster A-E: 26 Operational Pillars</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Shield className="w-4 h-4 text-[#c41e3a]" />
                  <span>Non-Profit Architecture</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-[#c41e3a]" />
                  <span>Updated: May 30, 2026</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/docs/PSA_UCF_26_PILLARS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Online
                </a>
                <a
                  href="/docs/PSA_UCF_26_PILLARS.md"
                  download
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 border border-white/30"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>

            {/* 100 Steps Document */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-[#c41e3a]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-[#c41e3a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">PSA UCF: 100 Steps</h3>
                  <p className="text-gray-400 text-sm">
                    The implementation roadmap from framework to function by September 2026.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-[#c41e3a]" />
                  <span>4 Waves: June → September 2026</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Users className="w-4 h-4 text-[#c41e3a]" />
                  <span>440 Developer Hours Estimated</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Shield className="w-4 h-4 text-[#c41e3a]" />
                  <span>Self-Destruct: September 30</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/docs/PSA_UCF_100_STEPS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Online
                </a>
                <a
                  href="/docs/PSA_UCF_100_STEPS.md"
                  download
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 border border-white/30"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>

          {/* Framework Summary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              26 Pillars — 3 Domains — 1 Mission
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#c41e3a]">1-5</div>
                <h4 className="font-bold text-white">The Voice</h4>
                <p className="text-gray-400 text-sm">
                  Anonymous pilots speaking. Whistleblower protected. Stories powering change.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#c41e3a]">6-10</div>
                <h4 className="font-bold text-white">Verification</h4>
                <p className="text-gray-400 text-sm">
                  pilotrecognition.com backing. CAAP, FAA, EASA verified. Credible voices.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#c41e3a]">11-26</div>
                <h4 className="font-bold text-white">Pathways & Advocacy</h4>
                <p className="text-gray-400 text-sm">
                  Transparent requirements. Union pressure. Regulatory action. Industry change.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-white font-bold text-lg mb-4">
              "The pilot is not the failure. The industry failed the pilot. We are here to change
              that."
            </p>
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>September 2026 Deadline — Self-Destruct Clause Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
