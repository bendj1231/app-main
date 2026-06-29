import React from 'react';
import { TopNavbar } from './TopNavbar';
import { ArrowLeft, Heart, Users, Target, Award, ArrowRight, ExternalLink } from 'lucide-react';

interface PilotShortageSupportPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogin?: () => void;
  setTab?: (tab: string) => void;
  hideNav?: boolean;
}

export const PilotShortageSupportPage: React.FC<PilotShortageSupportPageProps> = ({
  onBack,
  onNavigate,
  onLogin,
  setTab,
  hideNav,
}) => {
  const go = (tab: string) => (setTab ? setTab(tab) : onNavigate(tab));
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {!hideNav && (
        <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
      )}

      {/* Hero Section */}
      <div className={`${hideNav ? 'pt-8' : 'pt-32'} pb-16 px-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4">
            In Support Of
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-black leading-tight mb-4">
            pilot<span className="text-red-600">shortage</span>.org
          </h1>
          <p className="text-lg text-black/50 max-w-2xl mx-auto leading-relaxed">
            The WingMentor Program stands shoulder to shoulder with pilots building their future
            through action, not waiting for permission.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Mission Statement */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
              Leadership Through Action
            </h2>
            <p className="text-base text-black/60 leading-relaxed">
              The WingMentor Program is fully aligned with and in support of pilots undergoing a
              program aimed to educate and prepare them on leadership skills through self-initiated
              action. This involves 50 hours of helping fellow pilots, building the leadership
              mindset we need in aviation today.
            </p>
          </div>

          {/* Learn About — Our Mission & Connections */}
          <div className="border border-black/10 p-8 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-3">
              Learn About
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
              From awareness to action.
            </h2>
            <p className="text-base text-black/50 mb-8 max-w-2xl">
              pilotshortage.org tracks the real numbers — regional shortages, graduate unemployment,
              CFI bottlenecks, and airline hiring timelines. pilotrecognition.com turns those
              numbers into your next move. We connect verified pilots directly to the pathways and
              airlines that need them.
            </p>

            {/* What we track */}
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-wider text-black/30 mb-4">
                What we track
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Regional pilot shortage data by country',
                  '200-hour graduate hiring barriers',
                  'CFI pipeline wait times and hour builds',
                  'Airline hiring requirements by carrier',
                  'Live pathway openings from partner airlines',
                  'Verified pilot profile matching engine',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f5]">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    <span className="text-xs font-semibold text-black/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partnerships */}
            <div className="mb-8 p-5 bg-[#f5f5f5]">
              <p className="text-xs font-black uppercase tracking-wider text-black/30 mb-3">
                Partnerships
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                We are in active discussions with <strong className="text-black">Veremark</strong>{' '}
                to integrate their verification infrastructure directly into pilotrecognition.com.
                This means faster credential checks, trusted background screening, and a pre-cleared
                status for pilots that airlines can pull instantly — no more paper chase.
              </p>
            </div>

            {/* Bridge Table */}
            <p className="text-xs font-black uppercase tracking-wider text-black/30 mb-4">
              From data to your career
            </p>
            <div className="space-y-3">
              {[
                {
                  topic: 'Pilot Shortage by Region 2026',
                  bridge: 'See which airlines are actively hiring in your region →',
                  action: 'pathways',
                },
                {
                  topic: "Why 200-Hour Graduates Can't Get Hired",
                  bridge: 'Find your pathway from graduate to First Officer →',
                  action: 'programs',
                },
                {
                  topic: 'CFI Pipeline Backed Up 2-3 Years',
                  bridge: 'Check instructor pathway openings with verified hours →',
                  action: 'recognition-plus-tab',
                },
                {
                  topic: 'Airline Hiring Requirements by Carrier',
                  bridge: 'Match your profile to live pathway cards →',
                  action: 'profile',
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 bg-[#f5f5f5] hover:bg-black hover:text-white transition-all cursor-pointer"
                  onClick={() => go(row.action)}
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold text-black/50 group-hover:text-white/50 uppercase tracking-wider mb-0.5">
                      The data
                    </p>
                    <p className="text-sm font-black">{row.topic}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-white/50 shrink-0 hidden sm:block" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-500 group-hover:text-red-400 uppercase tracking-wider mb-0.5">
                      Your action
                    </p>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      {row.bridge}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-black/30 mt-4 text-center">
              pilotshortage.org shows the gap. pilotrecognition.com closes it.
            </p>
          </div>

          {/* Stats / Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f5f5f5] p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-3xl font-black text-black mb-1">50</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                Hours of Giving
              </p>
            </div>
            <div className="bg-[#f5f5f5] p-6 text-center">
              <Users className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-3xl font-black text-black mb-1">50+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                Pilots Helped
              </p>
            </div>
            <div className="bg-[#f5f5f5] p-6 text-center">
              <Award className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-3xl font-black text-black mb-1">1</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                Recognition+ Status
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-black text-white p-8 md:p-12">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-red-500" />
              How It Works
            </h3>
            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
              <p>
                <strong className="text-white">Step 1 — Commit:</strong> You commit to 50 hours of
                mentorship. Not for pay. Not for credit. For the industry.
              </p>
              <p>
                <strong className="text-white">Step 2 — Act:</strong> You help fellow pilots with
                logbook reviews, interview prep, pathway guidance — whatever they need.
              </p>
              <p>
                <strong className="text-white">Step 3 — Prove:</strong> Your hours are verified.
                Your leadership is documented. Your Recognition+ status is earned.
              </p>
              <p>
                <strong className="text-white">Step 4 — Lead:</strong> Airlines see a pilot who
                doesn't just fly — they lead. That's the pilot they hire.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <p className="text-sm text-black/40 mb-6">
              Not waiting for permission. Creating the solution.
            </p>
            <button
              onClick={() => onNavigate('foundational-program')}
              className="px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Start Your 50 Hours
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="py-12 px-6 bg-[#f5f5f5]">
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 px-8 py-4 bg-black text-white font-bold hover:bg-black/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
