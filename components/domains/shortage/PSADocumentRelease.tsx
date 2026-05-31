'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, ExternalLink, Shield, Clock, Users, ChevronDown, ChevronUp, CheckCircle, Target } from 'lucide-react';

export default function PSADocumentRelease() {
  const [expandedCluster, setExpandedCluster] = useState<string | null>('cluster-a');

  const clusters = [
    {
      id: 'cluster-a',
      label: 'Cluster A — Core Advocacy (The Voice)',
      pillars: [
        { id: 'p1', num: 1, name: 'The Anonymous Pilot Storyteller', desc: 'Primary voice of the clogged pipeline — shares training investment, placement struggles, survival story. Identity anonymized for whistleblower safety.' },
        { id: 'p2', num: 2, name: 'The Verified Pilot Contributor', desc: 'Credibility-backed storyteller — verifies credentials via pilotrecognition.com, then speaks. Unimpeachable testimony.' },
        { id: 'p3', num: 3, name: 'The Flight Instructor Advocate', desc: '5,000-6,000 hour expert with no voice — speaks about dignity gap, recognition deficit. Industry acknowledgment of instructor expertise.' },
        { id: 'p4', num: 4, name: 'The Airline Captain (Trapped)', desc: '12-year senior pilot handcuffed to position — explains seniority trap, why leaving = First Officer reset. Capabilities real, but recognition non-portable.' },
        { id: 'p5', num: 5, name: 'The 200-Hour Graduate', desc: 'Fresh CPL holder with $50K+ investment — documents "scan the code" rejection, no placement pathway. Qualified by Airbus standards, rejected by industry practice.' },
      ]
    },
    {
      id: 'cluster-b',
      label: 'Cluster B — Verification Partners (The Proof)',
      pillars: [
        { id: 'p6', num: 6, name: 'pilotrecognition.com (Primary Verification Partner)', desc: 'Non-commercial verification backbone — Logbook verification, flight hours validation, license confirmation. Free for PSA contributors.' },
        { id: 'p7', num: 7, name: 'CAAP (Philippines Authority)', desc: 'Sovereign registry partner — Validates CPL, PEL, type ratings for Filipino pilots. Foundation verification for Southeast Asian contributors.' },
        { id: 'p8', num: 8, name: 'FAA PRD (US Authority)', desc: 'US registry for American pilots — Validates Airman certificates, check-ride history. Verification for North American contributors.' },
        { id: 'p9', num: 9, name: 'EASA & European CAAs', desc: 'European licensing authorities — Validates EU pilot credentials. Verification for European contributors.' },
        { id: 'p10', num: 10, name: 'National Medical Examiners', desc: 'Class 1/2 medical validators — Validates Medical certificate status. Health verification layer.' },
      ]
    },
    {
      id: 'cluster-c',
      label: 'Cluster C — Pathway Transparency Partners (The Bridge)',
      pillars: [
        { id: 'p11', num: 11, name: 'pilotcareerpathways.com', desc: 'Transparent pathway provider — Airline-specific requirements, gap analysis, career trajectory. Embedded in PSA for contributor benefit.' },
        { id: 'p12', num: 12, name: 'ATO Partnerships', desc: 'Flight school alignment — Bridge training to employment reality. Goal: Schools teach to actual airline requirements, not just 200 hours.' },
        { id: 'p13', num: 13, name: 'Airline Collaboration (Etihad, Cebu Pacific, etc.)', desc: 'Industry partners willing to be transparent — Publish real requirements, not "1500 hours + scan the code". Airlines get verified, prepared applicants.' },
        { id: 'p14', num: 14, name: 'Manufacturer Partnerships (Airbus, Boeing)', desc: 'OEM acknowledgment of 200-hour qualification — OEM states: "Our SOPs work with 200-hour pilots". Leverage: Use OEM standards to pressure airlines.' },
      ]
    },
    {
      id: 'cluster-d',
      label: 'Cluster D — Advocacy Amplifiers (The Pressure)',
      pillars: [
        { id: 'p15', num: 15, name: 'ALPA & Pilot Unions', desc: 'Labor representation — Union endorsement = institutional credibility. Goal: Unions adopt clogged pipeline narrative.' },
        { id: 'p16', num: 16, name: 'Aviation Media', desc: 'Story amplifiers — Press coverage of anonymous stories. Effect: Public pressure on airlines to respond.' },
        { id: 'p17', num: 17, name: 'Government Regulators (CAAP, FAA, EASA)', desc: 'Policy makers — Investigate 95% rejection rates disguised as opportunity. Goal: Regulatory pressure on disclosure requirements.' },
        { id: 'p18', num: 18, name: 'Insurance Underwriters', desc: 'Risk assessors — Question why "qualified" pilots are rejected. Leverage: Insurance industry scrutiny of airline hiring.' },
      ]
    },
    {
      id: 'cluster-e',
      label: 'Cluster E — Infrastructure & Support (The Foundation)',
      pillars: [
        { id: 'p19', num: 19, name: 'Anonymous Hosting & Identity Protection', desc: 'Technical infrastructure for whistleblower safety — Redaction, encryption, anonymous submission. Critical: Safety against airline retaliation.' },
        { id: 'p20', num: 20, name: 'Legal Shield (Whistleblower Protection)', desc: 'Legal framework for anonymous speakers — Jurisdiction selection, liability protection. Goal: Pilots can speak without career suicide.' },
        { id: 'p21', num: 21, name: 'Data Custodians (WM Pilot Group)', desc: 'Non-profit database ownership — Owns PSA data, not airlines. Structure: No commercial exploitation of pilot stories.' },
        { id: 'p22', num: 22, name: 'Collaboration Framework', desc: 'Association partnerships — Other aviation associations joining PSA cause. Goal: Coalition of pilot advocates.' },
        { id: 'p23', num: 23, name: 'Transparency Technology', desc: 'Open-source / auditable platform — Public can verify PSA operates as stated. Trust: No black boxes, no hidden agendas.' },
        { id: 'p24', num: 24, name: 'Academic Research Partners', desc: 'University aviation programs — Study pipeline clogging, publish findings. Credibility: Academic validation of PSA claims.' },
        { id: 'p25', num: 25, name: 'International Expansion', desc: 'Global replication — PSA model in other countries. Goal: Worldwide clogged pipeline recognition.' },
        { id: 'p26', num: 26, name: 'The September Deadline', desc: 'Accountability milestone — September 2026 = go-live or self-destruct. Urgency: Forces execution over endless planning.' },
      ]
    },
  ];

  const waves = [
    { id: 'wave1', num: 1, name: 'Foundation', timeline: 'June 2026', focus: 'Voice Infrastructure — Pilots Can Speak', steps: 'Steps 1-25', color: 'bg-blue-500' },
    { id: 'wave2', num: 2, name: 'Verification', timeline: 'July 2026', focus: 'Proof Layer — Stories Become Credible', steps: 'Steps 26-50', color: 'bg-green-500' },
    { id: 'wave3', num: 3, name: 'Pathways', timeline: 'August 2026', focus: 'Transparency — Before You Apply', steps: 'Steps 51-75', color: 'bg-amber-500' },
    { id: 'wave4', num: 4, name: 'Advocacy', timeline: 'September 2026', focus: 'Pressure — Industry Must Respond', steps: 'Steps 76-100', color: 'bg-[#c41e3a]' },
  ];

  return (
    <section id="psa-ucf" className="py-16 md:py-24 bg-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-[#c41e3a]" />
              <span className="text-white font-bold">Official Framework</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              PSA Universal Commercial Framework
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              26-pillar advocacy grid. 100-step roadmap. Unclog the pipeline by September 2026.
            </p>
          </div>

          {/* The 3 Domains */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="text-4xl font-bold text-[#c41e3a] mb-2">01</div>
              <h3 className="text-xl font-bold text-white mb-2">The Voice</h3>
              <p className="text-gray-400 text-sm">pilotshortage.org — Anonymous stories. Whistleblower protection. Industry pressure.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="text-4xl font-bold text-[#c41e3a] mb-2">02</div>
              <h3 className="text-xl font-bold text-white mb-2">Verification</h3>
              <p className="text-gray-400 text-sm">pilotrecognition.com — Verified data. Logbooks/Hours. Licenses/Medicals. Credibility.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="text-4xl font-bold text-[#c41e3a] mb-2">03</div>
              <h3 className="text-xl font-bold text-white mb-2">The Pathway</h3>
              <p className="text-gray-400 text-sm">pilotcareerpathways.com — Transparent requirements. Before you apply. No more flying blind.</p>
            </div>
          </div>

          {/* 26 Pillars Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Target className="w-8 h-8 text-[#c41e3a]" />
              26 Pillars — 5 Clusters
            </h3>

            <div className="space-y-4">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-white">{cluster.label}</span>
                    {expandedCluster === cluster.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedCluster === cluster.id && (
                    <div className="px-6 pb-6 space-y-3">
                      {cluster.pillars.map((pillar) => (
                        <div key={pillar.id} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#c41e3a]/20 rounded-lg flex items-center justify-center">
                            <span className="text-[#c41e3a] font-bold text-sm">{pillar.num}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">{pillar.name}</h4>
                            <p className="text-gray-400 text-sm">{pillar.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 100 Steps Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Clock className="w-8 h-8 text-[#c41e3a]" />
              100 Steps — 4 Waves
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {waves.map((wave) => (
                <div key={wave.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className={`w-12 h-12 ${wave.color} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-white font-bold text-lg">{wave.num}</span>
                  </div>
                  <h4 className="font-bold text-white mb-1">Wave {wave.num}: {wave.name}</h4>
                  <p className="text-[#c41e3a] text-sm font-semibold mb-2">{wave.timeline}</p>
                  <p className="text-gray-400 text-sm mb-3">{wave.focus}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    <span>{wave.steps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* 26 Pillars Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-[#c41e3a]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-[#c41e3a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">PSA UCF: 26 Pillars</h3>
                  <p className="text-gray-400 text-sm">Complete advocacy framework with 5 clusters</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Target className="w-4 h-4 text-[#c41e3a]" />
                  <span>26 Operational Pillars</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Users className="w-4 h-4 text-[#c41e3a]" />
                  <span>5 Advocacy Clusters</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Shield className="w-4 h-4 text-[#c41e3a]" />
                  <span>Non-Profit Architecture</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/pilotshortage/ucf"
                  className="flex-1 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Framework
                </Link>
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

            {/* 100 Steps Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-[#c41e3a]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-[#c41e3a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">PSA UCF: 100 Steps</h3>
                  <p className="text-gray-400 text-sm">Implementation roadmap to September 2026</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-[#c41e3a]" />
                  <span>4 Waves: June → September</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#c41e3a]" />
                  <span>100 Implementation Steps</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Target className="w-4 h-4 text-[#c41e3a]" />
                  <span>Self-Destruct: Sept 30</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/pilotshortage/ucf"
                  className="flex-1 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Roadmap
                </Link>
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

          {/* Mission Statement */}
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <p className="text-white font-bold text-xl mb-4">
              "The pilot is not the failure. The industry failed the pilot. We are here to change that."
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
