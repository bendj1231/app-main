'use client';

import { ExternalLink, Mail, MapPin } from 'lucide-react';

export default function PSAFooter() {
  const domains = [
    {
      name: 'pilotshortage.org',
      role: 'The Voice',
      desc: 'Advocacy. Free. The truth about the clogged pipeline.',
      color: 'bg-[#c41e3a]',
    },
    {
      name: 'pilotrecognition.com',
      role: 'The Verification',
      desc: "Credentials verified. $99/year. Proof you're real.",
      color: 'bg-[#1e3a5f]',
    },
    {
      name: 'pilotcareerpathways.com',
      role: 'The Connection',
      desc: 'Pathways posted. Airlines meet pilots. Transparent.',
      color: 'bg-green-600',
    },
  ];

  return (
    <footer className="bg-[#1e3a5f] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Three Domains */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {domains.map((domain, idx) => (
              <a
                key={idx}
                href={`https://${domain.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors group"
              >
                <div
                  className={`w-12 h-12 ${domain.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#c41e3a] transition-colors">
                  {domain.name}
                </h3>
                <div className="text-white/70 text-sm font-bold uppercase tracking-wider mb-2">
                  {domain.role}
                </div>
                <p className="text-white/60 text-sm">{domain.desc}</p>
              </a>
            ))}
          </div>

          {/* Main Footer Content */}
          <div className="border-t border-white/20 pt-12">
            <div className="grid md:grid-cols-4 gap-8">
              {/* About */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PSA</span>
                  </div>
                  <span className="text-white font-bold">pilotshortage.org</span>
                </div>
                <p className="text-white/70 text-sm mb-4 max-w-md">
                  An association run by pilots, for pilots. Not a corporation. Not an airline
                  mouthpiece. Just the truth about the clogged pipeline.
                </p>
                <p className="text-white/50 text-xs">
                  Founded January 21, 2026 — Etihad Aviation Career Fair
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4">The Problem</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>
                    <a href="#four-floors" className="hover:text-white transition-colors">
                      Four-Floor Tower
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      The 2013 Law
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      The Triad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Case Studies
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>contact@pilotshortage.org</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Global • Pilot-Run</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2026 Pilot Shortage Association. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Transparency
              </a>
            </div>
          </div>

          {/* The Line */}
          <div className="mt-8 text-center">
            <p className="text-white/30 text-xs">
              "The pilot is not the failure. The industry failed the pilot."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
