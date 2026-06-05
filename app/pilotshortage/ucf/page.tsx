'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Clock, 
  Target, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Download,
  ArrowLeft,
  CheckCircle,
  Megaphone,
  Lock,
  Globe,
  Briefcase,
  GraduationCap,
  Plane,
  Scale
} from 'lucide-react';

const clusters = [
  {
    id: 'cluster-a',
    label: 'Cluster A — Core Advocacy (The Voice)',
    icon: Megaphone,
    color: 'bg-blue-500',
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
    icon: Lock,
    color: 'bg-green-500',
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
    icon: Globe,
    color: 'bg-amber-500',
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
    icon: Scale,
    color: 'bg-purple-500',
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
    icon: Briefcase,
    color: 'bg-gray-500',
    pillars: [
      { id: 'p19', num: 19, name: 'Anonymous Hosting & Identity Protection', desc: 'Technical infrastructure for whistleblower safety — Redaction, encryption, anonymous submission. Critical: Safety against airline retaliation.' },
      { id: 'p20', num: 20, name: 'Legal Shield (Whistleblower Protection)', desc: 'Legal framework for anonymous speakers — Jurisdiction selection, liability protection. Goal: Pilots can speak without career suicide.' },
      { id: 'p21', num: 21, name: 'Data Custodians (Benjamin Bowler)', desc: 'Non-profit database ownership — Owns PSA data, not airlines. Structure: No commercial exploitation of pilot stories. Pending incorporation of Aviation Pathways Ltd.' },
      { id: 'p22', num: 22, name: 'Collaboration Framework', desc: 'Association partnerships — Other aviation associations joining PSA cause. Goal: Coalition of pilot advocates.' },
      { id: 'p23', num: 23, name: 'Transparency Technology', desc: 'Open-source / auditable platform — Public can verify PSA operates as stated. Trust: No black boxes, no hidden agendas.' },
      { id: 'p24', num: 24, name: 'Academic Research Partners', desc: 'University aviation programs — Study pipeline clogging, publish findings. Credibility: Academic validation of PSA claims.' },
      { id: 'p25', num: 25, name: 'International Expansion', desc: 'Global replication — PSA model in other countries. Goal: Worldwide clogged pipeline recognition.' },
      { id: 'p26', num: 26, name: 'The September Deadline', desc: 'Accountability milestone — September 2026 = go-live or self-destruct. Urgency: Forces execution over endless planning.' },
    ]
  },
];

const waves = [
  { id: 'wave1', num: 1, name: 'Foundation', timeline: 'June 2026', focus: 'Voice Infrastructure — Pilots Can Speak', steps: 'Steps 1-25', color: 'bg-blue-500', borderColor: 'border-blue-500' },
  { id: 'wave2', num: 2, name: 'Verification', timeline: 'July 2026', focus: 'Proof Layer — Stories Become Credible', steps: 'Steps 26-50', color: 'bg-green-500', borderColor: 'border-green-500' },
  { id: 'wave3', num: 3, name: 'Pathways', timeline: 'August 2026', focus: 'Transparency — Before You Apply', steps: 'Steps 51-75', color: 'bg-amber-500', borderColor: 'border-amber-500' },
  { id: 'wave4', num: 4, name: 'Advocacy', timeline: 'September 2026', focus: 'Pressure — Industry Must Respond', steps: 'Steps 76-100', color: 'bg-[#c41e3a]', borderColor: 'border-[#c41e3a]' },
];

export default function PSAUCFPage() {
  const [expandedCluster, setExpandedCluster] = useState<string | null>('cluster-a');

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#1e3a5f] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/?shortage=1" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Pilot Shortage</span>
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="/docs/PSA_UCF_26_PILLARS.md"
                download
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download 26 Pillars</span>
              </a>
              <a
                href="/docs/PSA_UCF_100_STEPS.md"
                download
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download 100 Steps</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-[#c41e3a]" />
              <span className="text-white font-bold">Official Framework</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              PSA Universal Commercial Framework
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              26-Pillar Advocacy Grid. 100-Step Roadmap.
            </p>
            <p className="text-lg text-gray-400">
              Mission: Unclog the Pipeline Through Systemic Change
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-[#c41e3a] font-semibold">
              <Clock className="w-5 h-5" />
              <span>September 2026 Deadline — Self-Destruct Clause Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Domains */}
      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">The 3 Domains of PSA</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-8">
                <div className="text-5xl font-bold text-[#c41e3a] mb-4">01</div>
                <h3 className="text-2xl font-bold text-white mb-3">The Voice</h3>
                <p className="text-gray-400 mb-4">pilotshortage.org</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#c41e3a]" />
                    Advocacy
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#c41e3a]" />
                    Anonymous Stories
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#c41e3a]" />
                    Industry Pressure
                  </li>
                </ul>
              </div>
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-8">
                <div className="text-5xl font-bold text-[#c41e3a] mb-4">02</div>
                <h3 className="text-2xl font-bold text-white mb-3">Verification</h3>
                <p className="text-gray-400 mb-4">pilotrecognition.com</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#c41e3a]" />
                    Verified Data
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#c41e3a]" />
                    Logbooks/Hours
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#c41e3a]" />
                    Licenses/Medicals
                  </li>
                </ul>
              </div>
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-8">
                <div className="text-5xl font-bold text-[#c41e3a] mb-4">03</div>
                <h3 className="text-2xl font-bold text-white mb-3">The Pathway</h3>
                <p className="text-gray-400 mb-4">pilotcareerpathways.com</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#c41e3a]" />
                    Transparent Requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#c41e3a]" />
                    Before You Apply
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#c41e3a]" />
                    Gap Analysis
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 26 Pillars */}
      <section className="py-16 bg-[#0f2744]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Target className="w-10 h-10 text-[#c41e3a]" />
              <h2 className="text-3xl font-bold text-white">26 Pillars — 5 Clusters</h2>
            </div>

            <div className="space-y-4">
              {clusters.map((cluster) => {
                const Icon = cluster.icon;
                const isExpanded = expandedCluster === cluster.id;
                return (
                  <div key={cluster.id} className="bg-[#1e3a5f] rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${cluster.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">{cluster.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-3">
                        {cluster.pillars.map((pillar) => (
                          <div key={pillar.id} className="flex gap-4 p-5 bg-[#0a1628] rounded-xl border border-white/5">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#c41e3a]/20 rounded-xl flex items-center justify-center">
                              <span className="text-[#c41e3a] font-bold">{pillar.num}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg mb-2">{pillar.name}</h4>
                              <p className="text-gray-400">{pillar.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 100 Steps */}
      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Clock className="w-10 h-10 text-[#c41e3a]" />
              <h2 className="text-3xl font-bold text-white">100 Steps — 4 Waves</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {waves.map((wave) => (
                <div key={wave.id} className={`bg-[#1e3a5f] rounded-2xl border-2 ${wave.borderColor} p-6`}>
                  <div className={`w-14 h-14 ${wave.color} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-white font-bold text-xl">{wave.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Wave {wave.num}</h3>
                  <p className="text-[#c41e3a] font-semibold mb-3">{wave.name}</p>
                  <p className="text-gray-400 text-sm mb-2">{wave.timeline}</p>
                  <p className="text-gray-300 text-sm mb-4">{wave.focus}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-xs pt-4 border-t border-white/10">
                    <CheckCircle className="w-4 h-4" />
                    <span>{wave.steps}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Wave Details */}
            <div className="mt-12 space-y-6">
              <div className="bg-[#1e3a5f] rounded-xl border border-blue-500/30 p-6">
                <h4 className="text-xl font-bold text-white mb-3">Wave 1: Foundation (June 2026)</h4>
                <p className="text-gray-400 mb-4">Voice Infrastructure — Pilots Can Speak</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="text-blue-400 font-semibold mb-2">Key Deliverables:</p>
                    <ul className="space-y-1">
                      <li>• Anonymous submission form deployment</li>
                      <li>• Identity redaction system</li>
                      <li>• Story moderation workflow</li>
                      <li>• SSL/TLS encryption implementation</li>
                      <li>• IP anonymization (no logging)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-400 font-semibold mb-2">Cluster Focus:</p>
                    <p>Cluster A (Pillars 1-5): Core Advocacy</p>
                    <ul className="space-y-1 mt-2">
                      <li>• Anonymous Pilot Storyteller</li>
                      <li>• Verified Pilot Contributor</li>
                      <li>• Flight Instructor Advocate</li>
                      <li>• Airline Captain (Trapped)</li>
                      <li>• 200-Hour Graduate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a5f] rounded-xl border border-green-500/30 p-6">
                <h4 className="text-xl font-bold text-white mb-3">Wave 2: Verification (July 2026)</h4>
                <p className="text-gray-400 mb-4">Proof Layer — Stories Become Credible</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="text-green-400 font-semibold mb-2">Key Deliverables:</p>
                    <ul className="space-y-1">
                      <li>• pilotrecognition.com integration</li>
                      <li>• CAAP verification API</li>
                      <li>• License validation system</li>
                      <li>• Medical certificate verification</li>
                      <li>• "Verified Pilot" badge system</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold mb-2">Cluster Focus:</p>
                    <p>Cluster B (Pillars 6-10): Verification Partners</p>
                    <ul className="space-y-1 mt-2">
                      <li>• pilotrecognition.com</li>
                      <li>• CAAP (Philippines)</li>
                      <li>• FAA PRD (US)</li>
                      <li>• EASA (Europe)</li>
                      <li>• Medical Examiners</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a5f] rounded-xl border border-amber-500/30 p-6">
                <h4 className="text-xl font-bold text-white mb-3">Wave 3: Pathways (August 2026)</h4>
                <p className="text-gray-400 mb-4">Transparency — Before You Apply</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="text-amber-400 font-semibold mb-2">Key Deliverables:</p>
                    <ul className="space-y-1">
                      <li>• pilotcareerpathways.com integration</li>
                      <li>• Airline Pathway Cards</li>
                      <li>• Gap analysis tools</li>
                      <li>• ATO partnership framework</li>
                      <li>• Manufacturer collaboration</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold mb-2">Cluster Focus:</p>
                    <p>Clusters C & D (Pillars 11-18)</p>
                    <ul className="space-y-1 mt-2">
                      <li>• Pathway Transparency Partners</li>
                      <li>• Advocacy Amplifiers</li>
                      <li>• Unions, Media, Regulators</li>
                      <li>• Insurance Underwriters</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a5f] rounded-xl border border-[#c41e3a]/30 p-6">
                <h4 className="text-xl font-bold text-white mb-3">Wave 4: Advocacy (September 2026)</h4>
                <p className="text-gray-400 mb-4">Pressure — Industry Must Respond</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="text-[#c41e3a] font-semibold mb-2">Key Deliverables:</p>
                    <ul className="space-y-1">
                      <li>• Media campaign launch</li>
                      <li>• Regulatory submissions</li>
                      <li>• Airline transparency commitments</li>
                      <li>• Government engagement</li>
                      <li>• Platform go-live</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[#c41e3a] font-semibold mb-2">Cluster Focus:</p>
                    <p>Cluster E (Pillars 19-26): Infrastructure & Support</p>
                    <ul className="space-y-1 mt-2">
                      <li>• Identity Protection</li>
                      <li>• Legal Shield</li>
                      <li>• Data Custodians</li>
                      <li>• Academic Partners</li>
                      <li>• September Deadline</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-white mb-6">
              "The pilot is not the failure. The industry failed the pilot. We are here to change that."
            </blockquote>
            <p className="text-gray-400 mb-8">
              PSA treats all 26 stakeholders as nodes in a transparency network. 
              Unlike pilotrecognition.com's commercial verification framework, 
              pilotshortage.org operates as a non-profit advocacy collective. 
              We don't sell verification — we demand accountability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/?shortage=1"
                className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-xl transition-colors"
              >
                Join PSA — Free Forever
              </Link>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>September 2026 Deadline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Pilot Shortage Association. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/?shortage=1" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <a href="/docs/PSA_UCF_26_PILLARS.md" download className="text-gray-400 hover:text-white transition-colors">
                Download 26 Pillars
              </a>
              <a href="/docs/PSA_UCF_100_STEPS.md" download className="text-gray-400 hover:text-white transition-colors">
                Download 100 Steps
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
