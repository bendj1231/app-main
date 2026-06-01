'use client';

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Plane,
  GraduationCap,
  Users,
  Scale,
  Factory,
  Radar,
  ClipboardList,
  TrendingUp,
  Landmark,
  Globe,
  Handshake,
  Eye,
  BarChart3,
  Map,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stakeholders = [
  {
    icon: Plane,
    title: 'Airlines',
    role: 'The Destination',
    description: 'They need experienced, qualified pilots. But hiring minimums are opaque, regional pipelines are uneven, and the bridge between training and the flight deck has no map.',
  },
  {
    icon: GraduationCap,
    title: 'Flight Schools & ATOs',
    role: 'The Training Ground',
    description: 'They invest in curriculum, aircraft, and instructors. But they operate without standardized placement accountability, leaving graduates to navigate the maze alone.',
  },
  {
    icon: Users,
    title: 'Pilots & Instructors',
    role: 'The Workforce',
    description: 'They bear the financial risk, the medical risk, and the career risk. They train the next generation while waiting for their own shot — often without visibility into why the wait continues.',
  },
  {
    icon: Factory,
    title: 'Manufacturers',
    role: 'The Supply Chain',
    description: 'They build the aircraft the industry depends on. But without a healthy pipeline of new aviators, their customers cannot crew the planes they have already ordered.',
  },
  {
    icon: Landmark,
    title: 'Regulators',
    role: 'The Framework',
    description: 'They set the safety standards and issue the certificates. But they do not track career outcomes, measure pipeline attrition, or publish longitudinal data on where graduates end up.',
  },
  {
    icon: Scale,
    title: 'Labor Representatives',
    role: 'The Advocate',
    description: 'They defend contracts and working conditions for those already inside the profession. Their mandate is clear, but the pathway into the profession remains outside their jurisdiction.',
  },
];

const gaps = [
  {
    icon: ClipboardList,
    title: 'No Career Outcome Data',
    description: 'No one publishes what happens between a CPL certificate and an airline flight deck. Attrition, debt load, years-to-hire, and placement rates by school remain unmeasured.',
  },
  {
    icon: Eye,
    title: 'No Transparency Standard',
    description: 'Flight schools market placement rates without defining "placement." Airlines post minimums that are not the actual hiring bar. Students invest more than a medical degree with less disclosure than a car loan.',
  },
  {
    icon: BarChart3,
    title: 'No Cost-to-Climb Index',
    description: 'The industry markets the destination — the Captain salary — but obscures the journey: tuition, living expenses, medical costs, recurrent training, CFI wages, and the years of financial stress in between.',
  },
  {
    icon: Award,
    title: 'No CFI Recognition System',
    description: 'Flight instructors train every pilot in the system, yet no association represents their economic interests, publishes their wage data, or creates portable credentials that travel between employers.',
  },
  {
    icon: Map,
    title: 'No Alternative Career Map',
    description: 'The industry markets a single pathway: flight school → CFI → regional FO → mainline Captain. For the majority who will not complete this track, no alternative map exists.',
  },
  {
    icon: ShieldCheck,
    title: 'No Coalition Forum',
    description: 'No permanent, inclusive table exists where airlines, flight schools, manufacturers, regulators, and pilots meet as equals to audit the pipeline and share accountability.',
  },
];

export default function CoalitionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Back */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/pilotshortage"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to pilotshortage.org
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0a1628] opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              The Aviation Pipeline Coalition
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Where Aviation Comes
              <span className="block text-red-400">Together to Connect.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Airlines contribute hiring opportunities. Flight schools contribute trained graduates. 
              Manufacturers contribute the aircraft. Regulators contribute safety. 
              Together, we are building the connections that ensure every graduating pilot has a mapped, 
              transparent, and fair pathway into the profession.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pilotshortage/join"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Partner With the Coalition
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#the-gaps"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all backdrop-blur-sm border border-white/20"
              >
                See What We Are Building
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Every Institution Contributes to the Industry.
              <span className="block text-red-500">No One Connects the Contributions.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The aviation industry is a delicate pipeline managed in fragments. Flight schools contribute 
              trained graduates. Airlines contribute hiring opportunities. Labor representatives contribute 
              contract protections. Regulators contribute safety standards. Each plays an essential role — 
              but the spaces between them are where pilots get lost, and where the industry loses talent it 
              cannot afford to lose.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">The Silo Effect</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Each stakeholder operates within its own mandate. No permanent forum connects flight schools 
                to airline hiring reality, or CFI wages to manufacturer delivery schedules.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">The Data Desert</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The FAA publishes certificates. Airlines publish minimums. Schools publish tuition. 
                No one publishes what happens in between — attrition, debt, years-to-hire, or placement truth.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Radar className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">The Blind Spot</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The thousands who do not reach the flight deck have no platform, no recognition, and no voice. 
                Their stories are buried in silence. Their data does not exist in any public record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Six Stakeholders. One Pipeline.
              <span className="block text-red-500">No Shared Map.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Every group below is essential. Every group below is doing its job. 
              But the pipeline is only as strong as the weakest connection — and right now, 
              the connections are invisible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {stakeholders.map((s, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                  <s.icon className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1">{s.role}</p>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Gaps */}
      <section id="the-gaps" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Six Gaps No Association Addresses
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              These are not accusations. They are observations. No existing labor organization, 
              trade association, or regulatory body has made these issues its primary focus. 
              That is not failure — it is fragmentation. And it is where the coalition begins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gaps.map((g, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-red-200 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <g.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{g.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What PSA Builds */}
      <section className="py-16 md:py-24 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              What the Coalition Builds
              <span className="block text-red-400">Together.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              The Pilot Shortage Association does not claim to fix these gaps alone. 
              We claim to name them, measure them, and build the infrastructure no one else has built — 
              inviting every stakeholder to contribute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'The Pipeline Tracker',
                desc: 'A public dashboard mapping CPL issuance, airline hiring, ATP conversion, and attrition — by region, by year, by pathway. Open data. Updated continuously.',
              },
              {
                title: 'The Flight School Scorecard',
                desc: 'Standardized A-F ratings for transparency: tuition clarity, placement rate disclosure, CFI wage publishing, graduate outcome tracking, and debt counseling.',
              },
              {
                title: 'The CFI Census',
                desc: 'An annual, anonymous survey of active flight instructors capturing wages, hours, debt, years since certification, and attrition intentions. The first dataset of its kind.',
              },
              {
                title: 'The Cost-to-Climb Calculator',
                desc: 'An interactive tool showing the true probability-weighted investment required to reach the flight deck — not the brochure price, the real price.',
              },
              {
                title: 'The Coalition Table',
                desc: 'A quarterly roundtable where airlines, flight schools, manufacturers, regulators, and pilot representatives meet as equals to audit the pipeline and share accountability.',
              },
              {
                title: 'The Alternative Pathway Map',
                desc: 'For the majority who will not reach a mainline Captain seat — 50 aviation careers where pilot credentials have value, from corporate aviation to regulatory consulting.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-400 font-bold text-sm">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coalition Ecosystem */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Built on a Verified Ecosystem
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The Coalition is powered by three interconnected platforms working together to close the gaps 
              no single organization could close alone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">pilotshortage.org</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">The Coalition Hub</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                The non-profit advocacy arm that names the gaps, measures the pipeline, and convenes the stakeholders. 
                No profit motive. No membership dues required to access data.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                We advise pilots, flight schools, and airlines toward verified credentialing and transparent pathways.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Verified through <span className="font-semibold">pilotrecognition.com</span>? 
                PSA issues a public coalition badge — proof of verified status, trusted by airlines and ATOs.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">pilotrecognition.com</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">Verification & Trust</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Provides independent verification of pilot credentials, logbook hours, and training records. 
                Reduces falsification. Creates a single source of truth for who a pilot actually is and what they have actually done.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Verification here unlocks pathways on pilotcareerpathways.com automatically. 
                One profile. Two platforms. Zero friction.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">pilotcareerpathways.com</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">Live Pathways & Outcomes</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Publishes real-time airline, operator, and manufacturer requirements — not stale social media posts 
                that have not been updated in two years. Tracks fleet demand shifts, regulatory changes like Airbus HINFACT requirements, 
                and airline expectation updates as they happen.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Verified pilots see exactly where they stand and how to align their career. Unverified pilots see what they are missing. 
                Airlines and ATOs publish live expectations, not historical myths.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12 p-6 bg-red-50 rounded-xl border border-red-100">
            <p className="text-gray-700 text-sm leading-relaxed text-center">
              <strong>How it works together:</strong> A pilot gets verified through{" "}
              <span className="font-semibold">pilotrecognition.com</span>. That same verified profile unlocks live pathways 
              on <span className="font-semibold">pilotcareerpathways.com</span> — no re-entering hours, no re-uploading documents. 
              Verified users see exactly where they stand against real airline, operator, and manufacturer requirements. 
              Their outcomes — and the gaps they still face — feed back into the data published by{" "}
              <span className="font-semibold">pilotshortage.org</span>. The loop closes. The pipeline becomes visible.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-gray-500 text-sm">
              These three platforms are the founding infrastructure of the coalition. But the coalition itself 
              is open to <strong>every stakeholder</strong> aligned with closing the gaps: airlines, flight schools, ATOs, 
              manufacturers, regulators, labor representatives, safety advocates, and pilot associations worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Partner With Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                  Partner With the Coalition
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Whether you are an airline, a flight school, a manufacturer, or a safety advocate — 
                  the table is open. The data is shared. The goal is mutual: a healthier pipeline for everyone.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Airlines</h3>
                  <p className="text-gray-600 text-sm">Publish hiring insights. Support CFI pathways. Access verified pipeline data.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Flight Schools & ATOs</h3>
                  <p className="text-gray-600 text-sm">Earn transparency badges. Publish placement rates. Align curriculum with hiring reality.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Factory className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Manufacturers</h3>
                  <p className="text-gray-600 text-sm">Invest in pipeline health. Sponsor data collection. Ensure your customers can crew their aircraft.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Landmark className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Regulators & Safety Advocates</h3>
                  <p className="text-gray-600 text-sm">Contribute framework expertise. Shape transparent standards. Audit pipeline health.</p>
                </div>
              </div>

              <div className="text-center mb-10">
                <p className="text-gray-500 text-sm">
                  And any other stakeholder committed to a healthier pipeline: labor representatives, corporate operators, 
                  charter services, UAV operators, aerospace investors, and pilot associations worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/pilotshortage/join"
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                >
                  <Handshake className="w-5 h-5" />
                  Become a Coalition Partner
                </Link>
                <a
                  href="mailto:coalition@pilotshortage.org"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-lg border border-gray-300 transition-all"
                >
                  Contact the Coalition Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission: Close Ourselves */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission Is to Close the Shortage.
              <span className="block text-red-500">And Then Close Ourselves.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The Pilot Shortage Association is not designed to be a permanent institution. We are a bridge — 
              built to provide the necessary infrastructure for all stakeholders to close the gaps themselves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Publish the Data</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once the pipeline is measured, the data belongs to the industry. 
                We are the first source. We will not be the only source.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Convene the Coalition</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once the table is built, it belongs to the stakeholders. 
                Our role is to set it up. Their role is to keep it running.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Verify the Pipeline</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once verification is standard, it belongs to the platforms. 
                pilotrecognition.com and pilotcareerpathways.com carry the torch.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 bg-red-50 rounded-xl border border-red-100">
            <p className="text-gray-700 text-sm leading-relaxed text-center">
              When the pilot shortage is closed — when airlines have transparent hiring, flight schools have accountable placement rates, 
              and every CFI earns a living wage — the coalition will have succeeded. And the Pilot Shortage Association 
              will have fulfilled its purpose. <strong>We exist to make ourselves unnecessary.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Final Statement */}
      <section className="py-16 md:py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              The Frontier Is Not Inside the Gate.
              <span className="block text-red-400">It Is the 95% Outside It.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              This is not any single organization's fault. It is not a union's failure, a regulator's oversight, 
              or a flight school's deception. It is a gap in the industry that no one addressed — because no single 
              institution was designed to see the whole journey.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We are not here to blame. We are here to build. Airlines win when the pipeline is healthy. 
              Flight schools win when placement is transparent. Manufacturers win when their customers can crew their aircraft. 
              And pilots win when the path to the flight deck is mapped, measured, and fair. 
              We are the organization that says: <em>"This is what it actually costs. This is who it actually leaves behind. 
              And this is what we are going to do about it — together."</em>
            </p>
            <Link
              to="/pilotshortage/join"
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Join the Coalition
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2240] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-4">
                <span className="text-white">pilot</span>
                <span className="text-red-500">shortage</span>
                <span className="text-white">.org</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Aviation Pipeline Coalition. Mapping the gaps. Building the bridges. 
                No one left behind.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Coalition</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/pilotshortage/coalition" className="hover:text-white">The Coalition</Link></li>
                <li><Link to="/pilotshortage/pilotgap" className="hover:text-white">The Pilot Gap</Link></li>
                <li><Link to="/pilotshortage/join" className="hover:text-white">Join PSA</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/pilotshortage/about" className="hover:text-white">About PSA</Link></li>
                <li><Link to="/pilotshortage/advocacy" className="hover:text-white">Advocacy</Link></li>
                <li><Link to="/pilotshortage/news" className="hover:text-white">News & Updates</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} The Pilot Shortage Association. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
