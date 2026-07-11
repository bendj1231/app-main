'use client';

import { useState } from 'react';
import {
  Plane,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Send,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Globe,
  DollarSign,
  Zap,
  Repeat,
} from 'lucide-react';

interface InternshipProgramPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
}

interface InternshipRole {
  id: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  transferableSkills: string[];
  remote: boolean;
  duration: string;
  icon: typeof Plane;
  color: string;
}

const INTERNSHIP_ROLES: InternshipRole[] = [
  {
    id: 'operations-coordinator',
    title: 'Aviation Operations Coordinator',
    department: 'Operations & Airline Partnerships',
    description:
      'Support the coordination between airlines, ATOs, and the PilotRecognition platform. Help manage airline expectation data, verify operator requirements, and assist in partnership outreach. This is the role for pilots who understand airline operations from the inside — even if they never sat in the cockpit.',
    responsibilities: [
      'Compile and verify airline hiring requirements data',
      'Assist in airline partner onboarding and expectation page setup',
      'Coordinate with ATOs for verification provider integrations',
      'Support the enterprise portal data quality process',
      'Help draft airline partnership proposals and briefing documents',
    ],
    requirements: [
      'CPL or aviation degree (any age, any gap — we do not discriminate on flight recency)',
      'Understanding of airline operations, SOPs, or safety management systems',
      'Written English proficiency',
      'Reliable internet connection (remote role)',
    ],
    transferableSkills: [
      'Airline operations knowledge → data verification',
      'Aviation safety awareness → quality assurance',
      'SOP familiarity → process documentation',
      'Crew communication skills → stakeholder coordination',
    ],
    remote: true,
    duration: '6 months (renewable)',
    icon: Plane,
    color: 'blue',
  },
  {
    id: 'pilot-data-analyst',
    title: 'Pilot Data & Pathways Analyst',
    department: 'Data & Research',
    description:
      'Research, compile, and maintain the aviation career pathway data that powers the platform. Analyze airline requirements, salary data, type rating ROI, and career trajectory information. This is the role for pilots who know the industry data gap from personal experience — and want to close it for the next generation.',
    responsibilities: [
      'Research and compile airline hiring requirements across regions',
      'Maintain type rating cost, ROI, and hiring outcome data',
      'Analyze pilot career trajectory data and salary benchmarks',
      'Contribute to the "Real Hire Range Database" and "Career Outcome Data" projects',
      'Help build the data that exposes the gap between marketing and reality',
    ],
    requirements: [
      'CPL, aviation degree, or equivalent aviation knowledge',
      'Research skills (university-level or self-taught)',
      'Spreadsheet proficiency (Excel, Google Sheets)',
      'Attention to detail and data accuracy',
    ],
    transferableSkills: [
      'Aviation theory knowledge → pathway data validation',
      'METAR/navigation study habits → data precision',
      'Flight planning methodology → research methodology',
      'Checklist discipline → data quality control',
    ],
    remote: true,
    duration: '6 months (renewable)',
    icon: TrendingUp,
    color: 'emerald',
  },
  {
    id: 'community-manager',
    title: 'Pilot Community Manager',
    department: 'Community & Mentorship',
    description:
      'Manage the "Pilot in Waiting" community, the mentor matching program, and pilot support initiatives. Engage with waiting pilots, collect stories, facilitate peer support, and help build the community that ends the isolation of the waiting period. This is the role for pilots who lived the waiting and want to make sure no one waits alone.',
    responsibilities: [
      'Moderate and engage the "Pilot in Waiting" community forums',
      'Match waiting pilots with mentors based on profile and needs',
      'Collect and publish pilot stories (with consent) for the PSA and case study library',
      'Facilitate peer support groups for pilots in the waiting period',
      'Manage the anonymous "I Want Out" feature responses and follow-up',
    ],
    requirements: [
      'Lived experience of the aviation waiting period (any duration)',
      'Empathy, discretion, and emotional maturity',
      'Written communication skills',
      'Willingness to engage with pilots in difficult emotional situations',
    ],
    transferableSkills: [
      'Lived waiting experience → authentic community leadership',
      'Aviation knowledge → credible peer support',
      'Cultural awareness (for international pilot communities) → inclusive moderation',
      'Personal resilience → crisis response capability',
    ],
    remote: true,
    duration: '6 months (renewable)',
    icon: Users,
    color: 'violet',
  },
  {
    id: 'content-writer',
    title: 'Aviation Content Writer',
    department: 'Content & Education',
    description:
      'Write the guides, articles, and pathway content that the platform needs. Cover topics from "CFI to Corporate Transition Guide" to "Narrow-Body to Wide-Body Transition" to "15-Year Gap Re-Entry Pathway." This is the role for pilots who have the aviation knowledge and want to turn it into the content the industry needs — the content that doesn\'t exist anywhere else.',
    responsibilities: [
      'Write aviation career guides and pathway content',
      'Create the "reality check" content for prospective students',
      'Develop case studies from pilot stories (with consent)',
      'Write airline-specific requirement guides and comparison content',
      'Contribute to the PSA (Pilot Shortage Advocacy) content library',
    ],
    requirements: [
      'CPL, aviation degree, or equivalent aviation knowledge',
      'Strong written English',
      'Ability to translate technical aviation knowledge into accessible content',
      'Understanding of the aviation career landscape (from any perspective)',
    ],
    transferableSkills: [
      'Aviation theory → educational content',
      'Flight training study habits → research and writing discipline',
      'Briefing/debriefing experience → structured content creation',
      'Personal aviation experience → authentic, credible voice',
    ],
    remote: true,
    duration: '6 months (renewable)',
    icon: GraduationCap,
    color: 'orange',
  },
  {
    id: 'ambassador',
    title: 'Regional Aviation Ambassador',
    department: 'Outreach & Representation',
    description:
      'Represent Aviation Pathways Consultancy at aviation events, career fairs, and ATO/airline meetings in your region. Build relationships with local flight schools, airlines, and aviation organizations. This is the role for pilots who want to be the face of the platform in their country or region — and who understand the local aviation landscape.',
    responsibilities: [
      'Represent Aviation Pathways Consultancy at regional aviation events',
      'Build relationships with local ATOs, flight schools, and airlines',
      'Conduct outreach to regional aviation authorities and regulators',
      'Support local language content creation and translation',
      'Report regional aviation market intelligence to the leadership team',
    ],
    requirements: [
      'Based in a region with active aviation training or airline activity',
      'Understanding of the local aviation landscape',
      'Professional communication and presentation skills',
      'Willingness to attend events and conduct in-person meetings',
    ],
    transferableSkills: [
      'Local aviation knowledge → regional market intelligence',
      'Cultural fluency → relationship building',
      'Language skills → localization and translation',
      'Aviation network (even if dormant) → partnership development',
    ],
    remote: true,
    duration: '12 months (renewable)',
    icon: Globe,
    color: 'rose',
  },
  {
    id: 'qa-tester',
    title: 'Platform QA Tester',
    department: 'Product & Technology',
    description:
      'Test the PilotRecognition platform from a pilot user perspective. File bug reports, test user flows, verify data accuracy, and provide feedback on features. This is the role for pilots who can run the app in their browser — no dev environment needed. The role that works on a 2017 MacBook Air.',
    responsibilities: [
      'Test platform features from a pilot user perspective',
      'File detailed bug reports with reproduction steps',
      'Verify airline data accuracy and flag inconsistencies',
      'Test the application tracker, currency dashboard, and pathway tools',
      'Provide user experience feedback to the product team',
    ],
    requirements: [
      'A web browser and internet connection (any device, any age)',
      'Attention to detail and ability to write clear bug reports',
      'Understanding of what pilots need from the platform',
      'No coding experience required',
    ],
    transferableSkills: [
      'Checklist discipline → systematic QA testing',
      'Aviation safety mindset → thoroughness in finding issues',
      'Flight planning attention to detail → test case documentation',
      'User perspective as a pilot → authentic UX feedback',
    ],
    remote: true,
    duration: '3 months (renewable)',
    icon: ShieldCheck,
    color: 'cyan',
  },
];

const SUCCESS_PATHS = [
  {
    from: '15-year waiting pilot (cafe worker)',
    through: 'Aviation Operations Coordinator intern',
    to: 'Aviation data analyst at a regional airline',
    timeline: 'Internship → contract role → full-time aviation industry employment',
  },
  {
    from: 'Stuck CFI (3,200 hours, 5 years instructing)',
    through: 'Pilot Data & Pathways Analyst intern',
    to: 'Training program coordinator at an ATO',
    timeline: 'Internship → ATO partnership role → aviation training career',
  },
  {
    from: 'Career shifter (left aviation for construction)',
    through: 'Regional Aviation Ambassador intern',
    to: 'Aviation consultancy associate at Aviation Pathways Consultancy',
    timeline: 'Internship → associate role → aviation B2B career',
  },
  {
    from: 'Long-gap pilot (graduated 2010, never flew)',
    through: 'Platform QA Tester intern',
    to: 'Aviation product specialist at a pilot tech company',
    timeline: 'Internship → product role → aviation technology career',
  },
];

export default function InternshipProgramPage({ onNavigate, onLogin }: InternshipProgramPageProps) {
  const [selectedRole, setSelectedRole] = useState<InternshipRole | null>(null);
  const [applicationSent, setApplicationSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    background: '',
    yearsSinceGraduation: '',
    whyApply: '',
  });

  const handleApply = (role: InternshipRole) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role: role.title }));
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSent(true);
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-600' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', iconBg: 'bg-violet-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', iconBg: 'bg-orange-600' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', iconBg: 'bg-rose-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', iconBg: 'bg-cyan-600' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1a2f4f] to-[#0f1f35] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-5 h-5 text-rose-400" />
              <span className="text-sm font-semibold text-white/90">Aviation Pathways Consultancy Ltd</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The Door Is Open.
              <br />
              <span className="text-rose-400">Walk Through It.</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              An internship program for pilots who have been locked out of the cockpit — the
              long-gap pilots, the waiting pilots, the career shifters, the stuck CFIs. Your
              aviation knowledge is an asset. Your lived experience is qualification. We don't care
              that you haven't flown in 15 years. We care that you know aviation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                View Open Roles
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-bold text-lg transition-all"
              >
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                The Industry Trained You. Then Locked You Out.
              </h2>
              <p className="text-lg text-gray-600">
                You have a CPL, an aviation degree, thousands of hours of study, and a deep
                understanding of how aviation works. And you're working at a cafe, a warehouse, a
                construction site. Not because you're not qualified — because the cockpit door
                closed and no other door was offered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-bold text-red-800 mb-2">The Rejection Loop</h3>
                <p className="text-sm text-red-700">
                  You applied to be a ramp agent — rejected for "no experience." You applied to be
                  an aircraft cleaner — "overqualified." You offered to volunteer — "liability."
                  Even free, you're unhireable in aviation-adjacent roles.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <Clock className="w-8 h-8 text-amber-600 mb-3" />
                <h3 className="font-bold text-amber-800 mb-2">The Qualification Decay</h3>
                <p className="text-sm text-amber-700">
                  Your medical expired. Your IR lapsed. Your CFI expired. Your multi-engine rating
                  is gone. Each expiry is a small death. The industry watched you decay and offered
                  no re-entry path.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-blue-800 mb-2">The Knowledge That Remains</h3>
                <p className="text-sm text-blue-700">
                  But you still know METARs. You still know airspace. You still know SOPs, safety
                  management, crew resource management, aviation law. That knowledge didn't expire.
                  It's an asset the industry doesn't know how to value. We do.
                </p>
              </div>
            </div>

            <div className="bg-[#1e3a5f] rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Aviation Pathways Consultancy Ltd
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                We are an aviation consultancy that works with airlines, ATOs, manufacturers, and
                regulators. We need people who understand aviation — not people with current
                medicals. We need aviation knowledge, lived experience, and the determination that
                comes from 15 years of waiting. That's not a liability. That's a qualification.
              </p>
              <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 rounded-full px-6 py-3">
                <Heart className="w-5 h-5 text-rose-400" />
                <span className="text-white font-semibold">
                  We hire the pilots the industry threw away.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">How It Works</h2>
              <p className="text-lg text-gray-600">
                A structured path from "pilot who can't get hired" to "aviation professional with a
                career."
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Apply with Your Aviation Background — Not Your Logbook',
                  desc: 'We don\'t ask for current flight hours, medical validity, or recency. We ask: what do you know about aviation? What did you study? What did you live? Your CPL from 2010 is as relevant as one from 2024 — because the knowledge didn\'t expire, even if the card did.',
                  icon: GraduationCap,
                },
                {
                  step: 2,
                  title: 'Match to a Role Based on Your Knowledge and Experience',
                  desc: 'Six roles, each using a different part of your aviation background. Operations, data, community, content, outreach, QA. You don\'t need to code. You don\'t need a dev environment. You need a browser and aviation knowledge.',
                  icon: Briefcase,
                },
                {
                  step: 3,
                  title: 'Work Remotely on Real Aviation Industry Projects',
                  desc: '6-month internship (renewable). Remote. Flexible hours. Work alongside the team that builds the platform airlines use. Your work directly impacts pilots in the waiting period — because you\'re building the tools you wish you\'d had.',
                  icon: Globe,
                },
                {
                  step: 4,
                  title: 'Build a Verified Work Record in Aviation',
                  desc: 'Your internship is logged in your PilotRecognition Profile as verified aviation industry experience. After 15 years of "250 hours and nothing," your profile starts showing real, current, verified work in aviation. The gap closes.',
                  icon: ShieldCheck,
                },
                {
                  step: 5,
                  title: 'Transition to Aviation Industry Employment',
                  desc: 'Internship → contract role → full-time. Within Aviation Pathways Consultancy, with our airline partners, with our ATO partners, or with aviation companies that recognize the value of your combined experience. The door doesn\'t just open — it stays open.',
                  icon: ArrowRight,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-6 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-rose-600" />
                      <h3 className="text-xl font-bold text-[#1e3a5f]">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="roles" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Open Internship Roles</h2>
              <p className="text-lg text-gray-600">
                Six roles. Each uses a different part of your aviation background. All remote. All
                require a browser, not a cockpit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {INTERNSHIP_ROLES.map((role) => {
                const colors = colorClasses[role.color];
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`${colors.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">{role.title}</h3>
                        <p className={`text-sm font-semibold ${colors.text}`}>{role.department}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{role.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className="inline-flex items-center gap-1 bg-white/60 rounded-full px-3 py-1 text-gray-700">
                        <Clock className="w-3 h-3" /> {role.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/60 rounded-full px-3 py-1 text-gray-700">
                        <MapPin className="w-3 h-3" /> Remote
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        What You'll Do
                      </p>
                      <ul className="space-y-1">
                        {role.responsibilities.slice(0, 3).map((r, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 text-gray-400" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Your Aviation Knowledge Transfers To
                      </p>
                      <ul className="space-y-1">
                        {role.transferableSkills.map((s, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-emerald-500" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/60 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        Requirements
                      </p>
                      <p className="text-sm text-gray-700">
                        {role.requirements.join(' • ')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApply(role)}
                      className={`w-full ${colors.iconBg} hover:opacity-90 text-white rounded-xl py-3 font-bold text-sm transition-all hover:scale-[1.02]`}
                    >
                      Apply for This Role
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Success Paths */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                The Path From Waiting to Working
              </h2>
              <p className="text-lg text-gray-600">
                Real trajectories. The internship isn't the destination — it's the on-ramp.
              </p>
            </div>

            <div className="space-y-4">
              {SUCCESS_PATHS.map((path, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-red-100 text-red-700 text-xs font-bold rounded-full px-3 py-1">
                        FROM
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{path.from}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold rounded-full px-3 py-1">
                        THROUGH
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{path.through}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full px-3 py-1">
                        TO
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{path.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#1e3a5f] rounded-2xl p-6 text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                The internship is the bridge. The bridge goes from "pilot who can't get hired" to
                "aviation professional with a verified work record." The cockpit may be closed. But
                aviation is bigger than the cockpit — and your knowledge belongs in it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Care About */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                What We Don't Care About
              </h2>
              <p className="text-lg text-gray-600">
                Because the industry cared about the wrong things for too long.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "We don't care that your medical expired 11 years ago.",
                "We don't care that you haven't flown since 2010.",
                "We don't care that your IR lapsed and your CFI expired.",
                "We don't care that you work at McDonald's, a cafe, or a warehouse.",
                "We don't care that you're 37, 42, or 51.",
                "We don't care that your logbook has 250 hours frozen in time.",
                "We don't care that LinkedIn says 'Commercial Pilot' and you feel like a liar.",
                "We don't care that you've been waiting 2, 5, 10, or 15 years.",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-800 font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-emerald-800 mb-3">What We DO Care About</h3>
              <div className="space-y-2 text-left max-w-md mx-auto">
                {[
                  'You know aviation — theory, operations, safety, regulations.',
                  'You lived the waiting period — and you understand what pilots need.',
                  'You have the determination that comes from 15 years of not giving up.',
                  'You can work remotely with a browser and an internet connection.',
                  'You want to build the tools you wish you\'d had during the wait.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-800 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Business Case — Why This Exists */}
      <section className="py-16 md:py-20 bg-[#0f1f35] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 rounded-full px-4 py-2 mb-4">
                <Building2 className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-rose-300">
                  For Partners, Investors & Internal Team
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                This Isn't Charity. It's the Business Model.
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                The internship program isn't a CSR initiative. It's the cheapest, most authentic
                labor pool in the aviation industry — and the engine of the platform's growth
                flywheel.
              </p>
            </div>

            {/* Three columns: Saves Money, Saves Time, Makes Money */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Saves Money */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold">Saves Money</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { role: 'Data analyst', market: '$50K-$60K/yr', intern: '~$0' },
                    { role: 'Content writer', market: '$40K-$50K/yr', intern: '~$0' },
                    { role: 'QA tester', market: '$30K-$40K/yr', intern: '~$0' },
                    { role: 'Community manager', market: '$35K-$45K/yr', intern: '~$0' },
                    { role: 'Regional B2D sales', market: '$50K-$70K/yr', intern: '~$0' },
                    { role: 'Ops coordinator', market: '$45K-$55K/yr', intern: '~$0' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-white/70">{row.role}</span>
                      <div className="text-right">
                        <span className="text-red-400 line-through text-xs">{row.market}</span>
                        <span className="text-emerald-400 font-bold ml-2">{row.intern}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-3">
                  <p className="text-sm text-emerald-300 font-semibold">
                    6 interns = $250K-$320K/yr of work at near-zero cost
                  </p>
                </div>
              </div>

              {/* Saves Time */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Saves Time</h3>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    <span><strong className="text-white">Data collection in parallel</strong> — 6 interns researching 10 airlines each = 60 airlines mapped in weeks, not months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    <span><strong className="text-white">Content at scale</strong> — hundreds of guides written in months, not years. Content drives SEO. SEO drives traffic.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    <span><strong className="text-white">QA in real-time</strong> — interns test features as they ship. Bugs caught before users find them. No QA bottleneck.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    <span><strong className="text-white">Regional expansion</strong> — 6 regions opened simultaneously instead of 1 at a time. Benjamin can't be everywhere. Interns can.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    <span><strong className="text-white">Community moderation</strong> — daily moderation handled by interns. Benjamin builds. Interns manage.</span>
                  </div>
                </div>
              </div>

              {/* Makes Money */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold">Makes Money</h3>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                    <span><strong className="text-white">Recognition+ subscriptions</strong> — internship gated behind Recognition+ ($99/yr). Every intern is a paying subscriber. Community & content they create drives more subscriptions.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                    <span><strong className="text-white">Enterprise revenue</strong> — regional ambassadors sign airline partners ($1,000/yr each) and ATO partners ($500/yr each). 5 airlines per ambassador = $5K/yr per ambassador.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                    <span><strong className="text-white">Content → SEO → revenue</strong> — 100 articles × 500 visitors/mo × 2% conversion = 100 new subscribers/mo = $99K/yr from intern-written content alone.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                    <span><strong className="text-white">Data as a product</strong> — airline requirements & hiring data collected by interns becomes a premium enterprise data product. Free to collect, valuable to sell.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                    <span><strong className="text-white">Talent pipeline</strong> — interns who convert to full-time = zero recruiting cost ($5K-$10K saved per hire), zero onboarding, zero cultural fit risk.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Flywheel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <Repeat className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold">The Flywheel</h3>
              </div>
              <div className="grid md:grid-cols-7 gap-2 items-center">
                {[
                  { label: 'Interns build features & content', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
                  { label: 'Features attract pilots', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
                  { label: 'Pilots pay Recognition+ ($99/yr)', color: 'bg-rose-500/20 text-rose-300 border-rose-400/30' },
                  { label: 'Revenue funds more internships', color: 'bg-amber-500/20 text-amber-300 border-amber-400/30' },
                  { label: 'More interns → more features', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
                  { label: 'More pilots → more revenue', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
                  { label: 'Interns → full-time team', color: 'bg-violet-500/20 text-violet-300 border-violet-400/30' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`${step.color} border rounded-xl p-3 text-xs font-semibold text-center flex-1`}>
                      {step.label}
                    </div>
                    {i < 6 && <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 hidden md:block" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm leading-relaxed">
                  The internship isn't charity. It's the cheapest, most authentic labor pool in the
                  aviation industry. The value flows both ways: interns get a verified work record
                  and a career path; we get domain expertise, content, data, and market expansion
                  at near-zero cost. The pilots the industry threw away become the team that builds
                  the door for the next generation — and the engine that grows the company.
                </p>
              </div>
            </div>

            {/* The ROI Summary */}
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">$250K+</p>
                <p className="text-xs text-white/60 mt-1">Annual labor value (6 interns)</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-400/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-rose-400">$99K</p>
                <p className="text-xs text-white/60 mt-1">Yr 1 content-driven subscription revenue</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">$30K</p>
                <p className="text-xs text-white/60 mt-1">Potential enterprise revenue (6 ambassadors)</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">20-60x</p>
                <p className="text-xs text-white/60 mt-1">ROI on internship program (labor value vs cost)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Apply</h2>
              <p className="text-lg text-gray-600">
                Tell us about your aviation background. Not your logbook — your knowledge.
              </p>
            </div>

            {applicationSent ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 md:p-10 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-800 mb-3">Application Received</h3>
                <p className="text-emerald-700 leading-relaxed mb-6">
                  We received your application. We review every application personally — not with an
                  ATS, not with a keyword filter. A human who understands aviation will read your
                  background and respond within 7 days.
                </p>
                <p className="text-emerald-700 leading-relaxed mb-6">
                  {selectedRole && (
                    <>
                      You applied for: <strong>{selectedRole.title}</strong>
                    </>
                  )}
                </p>
                <p className="text-sm text-emerald-600 italic">
                  If you've been waiting 15 years for someone to say "yes" — this is the first step.
                  We're glad you're here.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all bg-white"
                  >
                    <option value="">Select a role</option>
                    {INTERNSHIP_ROLES.map((r) => (
                      <option key={r.id} value={r.title}>
                        {r.title}
                      </option>
                    ))}
                    <option value="general">Not sure — I want guidance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Years Since Graduation (or since you last flew)
                  </label>
                  <input
                    type="text"
                    value={formData.yearsSinceGraduation}
                    onChange={(e) =>
                      setFormData({ ...formData, yearsSinceGraduation: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    placeholder="e.g., 15 years, 2 years, I'm still in training"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This doesn't disqualify you. It helps us understand your journey.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Aviation Background
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.background}
                    onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all resize-none"
                    placeholder="CPL, IR, CFI, aviation degree, hours, type ratings — whatever you have. Expired is fine."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Why You're Applying
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.whyApply}
                    onChange={(e) => setFormData({ ...formData, whyApply: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us why you want to work in aviation — even if it's not in the cockpit. Tell us what you've been doing. Tell us what you know. Be honest."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    No cover letter format needed. Just tell us your story.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-4 font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Application
                </button>

                <p className="text-center text-xs text-gray-500">
                  Reviewed by a human. Response within 7 days. No ATS. No keyword filter. No
                  rejection for "overqualified" or "not enough experience."
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#1e3a5f] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              15 Years of Waiting. 15 Years of Knowledge.
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              The industry told you that your knowledge expired with your medical. It didn't. The
              industry told you that 15 years of waiting means you're no longer a pilot. You are —
              you're just a pilot who needs a different door. This is that door.
            </p>
            <button
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Apply Now
            </button>
            <p className="text-white/50 text-sm mt-6">
              Aviation Pathways Consultancy Ltd — We hire the pilots the industry threw away.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
