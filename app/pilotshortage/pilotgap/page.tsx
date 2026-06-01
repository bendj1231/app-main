'use client';

import { 
  ArrowLeft,
  Building,
  GraduationCap,
  Plane,
  Users,
  AlertTriangle,
  TrendingDown,
  Clock,
  Ban,
  ArrowRight,
  BarChart3,
  TrendingUp,
  DoorOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const floors = [
  {
    floor: 4,
    title: 'The Airlines',
    subtitle: 'Hiring Freeze Disguised as Opportunity',
    icon: Plane,
    problem: 'Airlines post "open recruitment" but reject 95% of applicants. The 1,500-hour rule and opaque "scan the code" filtering block qualified candidates before human eyes ever see a CV.',
    stat: '95%',
    statLabel: 'Rejection Rate',
  },
  {
    floor: 3,
    title: 'The Recognition Gap',
    subtitle: 'Type Ratings & Airline-Ready Pilots',
    icon: DoorOpen,
    problem: 'Pilots with type ratings and 3,000+ hours still cannot break through. The industry demands experience no one will give. You need airline hours to get airline hours.',
    stat: '3K+',
    statLabel: 'Hours, Still Blocked',
  },
  {
    floor: 2,
    title: 'The Instructors',
    subtitle: '6,000 Hours, Zero Advancement',
    icon: GraduationCap,
    problem: 'Flight instructors built the next generation of pilots. They have 5,000–6,000 hours, multiple ratings, and decades of knowledge. But the instructor queue is their ceiling, not their ladder.',
    stat: '6K+',
    statLabel: 'Hours, Stuck Instructing',
  },
  {
    floor: 1,
    title: 'The Graduates',
    subtitle: '200 Hours, $50,000 Debt, No Path',
    icon: Users,
    problem: 'Fresh CPL holders walk out of flight school with a license the industry ignores. Promised an aviation career on enrollment. Delivered a bill and a prayer.',
    stat: '$50K+',
    statLabel: 'Debt, No Return',
  },
];

const stats = [
  { label: 'Graduate Pipeline Failure', value: '80%', desc: 'Of CPL holders never reach an airline flight deck' },
  { label: 'Instructor Queue Wait', value: '2–4 Yrs', desc: 'Average time stuck instructing before any airline call' },
  { label: 'Industry Investment Lost', value: '$2.1B', desc: 'Annual pilot training spend with no career outcome' },
  { label: 'Airline "Openings" That Reject', value: '95%', desc: 'Of applicants filtered out before human review' },
];

export default function PilotGapPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#1e3a5f] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/pilotshortage"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Pilot Shortage</span>
            </Link>
            <Link
              to="/pilotshortage/join"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-white font-bold">The Real Crisis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Pilot Gap
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Aviation is not running out of pilots. It is running out of pathways.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Flight schools graduate thousands every year. Airlines claim they need crews. 
              Yet between those two points is a chasm nobody talks about — 
              a broken pipeline where qualified pilots rot on the ground.
            </p>
          </div>
        </div>
      </section>

      {/* The Four Floors */}
      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">The Four Floors of Collapse</h2>
              <p className="text-gray-400">The aviation pipeline is not broken — it is inverted. Here is how.</p>
            </div>

            <div className="space-y-6">
              {floors.map((floor, idx) => {
                const Icon = floor.icon;
                return (
                  <div 
                    key={floor.floor}
                    className="bg-[#1e3a5f] rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left: Floor number & title */}
                      <div className="md:w-1/3 p-8 bg-[#0f2744] border-b md:border-b-0 md:border-r border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                            Floor {floor.floor}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{floor.title}</h3>
                        <p className="text-sm text-gray-400">{floor.subtitle}</p>
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="text-3xl font-bold text-white">{floor.stat}</div>
                          <div className="text-xs text-gray-500">{floor.statLabel}</div>
                        </div>
                      </div>
                      
                      {/* Right: Problem description */}
                      <div className="md:w-2/3 p-8 flex items-center">
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {floor.problem}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 bg-[#0f2744]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">By The Numbers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-6 text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-white mb-2">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Is the Gap */}
      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-8 h-8 text-red-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">What Is the Pilot Gap?</h2>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  The <span className="text-white font-semibold">Pilot Gap</span> is the structural disconnect between flight training output and airline hiring reality. 
                  It is not a shortage of pilots. It is a shortage of honest pathways.
                </p>
                
                <p>
                  Every year, flight schools worldwide produce tens of thousands of Commercial Pilot License holders. 
                  These pilots meet every regulatory requirement, pass every check-ride, and invest $50,000–$100,000 in their training. 
                  Then they hit a wall.
                </p>

                <p>
                  Airlines post recruitment campaigns, attend job fairs, and promise careers. 
                  But the fine print is brutal: 1,500 hours required, type rating preferred, 
                  prior airline experience essential. The 200-hour graduate is not even in the conversation.
                </p>

                <div className="bg-[#0a1628] rounded-xl p-6 border-l-4 border-red-500">
                  <p className="text-white font-semibold mb-2">The Math Does Not Lie</p>
                  <p className="text-sm text-gray-400">
                    A flight school graduates 100 CPL holders. Airlines need 20 first officers. 
                    But they will only hire those with 1,500+ hours and a type rating. 
                    Of the 100 graduates, maybe 5 will reach that threshold within 5 years. 
                    The other 95? Forgotten.
                  </p>
                </div>

                <p>
                  Meanwhile, flight instructors — the ones building the next generation — 
                  accumulate 5,000, 6,000, sometimes 10,000 hours. But they are trapped. 
                  The only way out is an airline job. The airline job requires... airline experience. 
                  The loop is perfect. And perfectly broken.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-[#0f2744]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Why It Matters</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Economic Waste</h3>
                <p className="text-sm text-gray-400">
                  Billions in training investment evaporates. Student loans default. 
                  Families are destroyed. And the industry shrugs.
                </p>
              </div>
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Ban className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Talent Destruction</h3>
                <p className="text-sm text-gray-400">
                  Qualified pilots leave aviation entirely. Engineers, doctors, taxi drivers. 
                  The industry loses people who already proved they can fly.
                </p>
              </div>
              <div className="bg-[#1e3a5f] rounded-2xl border border-white/10 p-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Time Theft</h3>
                <p className="text-sm text-gray-400">
                  Years of a pilot's life spent waiting, instructing, hoping. 
                  The prime career window closes while the system sorts itself out. It never does.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What PSA Is Doing */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">What PSA Is Doing About It</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              The Pilot Shortage Association does not accept the gap as inevitable. 
              We are building the infrastructure to bridge it — transparency, verification, and pressure.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
              <div className="bg-[#0a1628] rounded-xl border border-white/10 p-6">
                <TrendingUp className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Pathway Transparency</h3>
                <p className="text-sm text-gray-400">
                  Before you apply, know exactly what an airline wants. No more guessing. No more wasted applications.
                </p>
              </div>
              <div className="bg-[#0a1628] rounded-xl border border-white/10 p-6">
                <Users className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Verified Stories</h3>
                <p className="text-sm text-gray-400">
                  Pilots share their real experiences — anonymously or verified. The data becomes undeniable.
                </p>
              </div>
              <div className="bg-[#0a1628] rounded-xl border border-white/10 p-6">
                <Building className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Industry Pressure</h3>
                <p className="text-sm text-gray-400">
                  We name the airlines, expose the numbers, and demand accountability. The gap is not a secret anymore.
                </p>
              </div>
            </div>
            <Link
              to="/pilotshortage/join"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-colors"
            >
              Become a Member — Free Forever
              <ArrowRight className="w-5 h-5" />
            </Link>
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
              <Link to="/pilotshortage" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/pilotshortage/ucf" className="text-gray-400 hover:text-white transition-colors">
                UCF Framework
              </Link>
              <Link to="/pilotshortage/join" className="text-gray-400 hover:text-white transition-colors">
                Join PSA
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
