import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Shield, Zap, Target, Map, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import type { TabId } from '../types';

const COMPETENCIES = [
  { id: 1, name: 'Technical Knowledge', desc: 'Aircraft systems, avionics, regulations, meteorology, navigation. Verified via programs and exam scores.', weight: 15, icon: BookOpen },
  { id: 2, name: 'Flight Hours & Currency', desc: 'Total time, PIC time, instrument time, night time, multi-engine. Raw logbook data.', weight: 15, icon: Clock },
  { id: 3, name: 'License & Ratings', desc: 'CPL/ATPL, type ratings, endorsements. Verified via PIC record.', weight: 12, icon: Award },
  { id: 4, name: 'Medical Validity', desc: 'Class 1 / Class 2 current status. Expires independently of license.', weight: 10, icon: Shield },
  { id: 5, name: 'Behavioural Competency (EBT)', desc: 'Constructivism, cognitive thinking, CRM. Scored via EBT Video Interview — proprietary IP.', weight: 18, icon: Zap },
  { id: 6, name: 'Industry Alignment', desc: 'Completion of Transition Program, 9 core competencies mapped to HINFACT/ICAO standards.', weight: 12, icon: Target },
  { id: 7, name: 'Pathway Engagement', desc: 'Pathways submitted, matches accepted, operator interest received. Activity-based signal.', weight: 8, icon: Map },
  { id: 8, name: 'Background Verification', desc: 'NBI clearance, employment history, reference checks via Veremark. Token-based only.', weight: 6, icon: CheckCircle },
  { id: 9, name: 'Mentorship & Advocacy', desc: 'Pilots helped in Peer Chain. Effort-based recognition — aligns with two-tier model.', weight: 4, icon: TrendingUp },
];

export const ScoreTab: React.FC<{ profile: any; setTab: (t: TabId) => void }> = ({ profile, setTab }) => {
  const score = profile?.recognition_score ?? 0;
  const maxScore = 100;
  return (
    <motion.div className="space-y-6 max-w-2xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* Score hero */}
      <div className="rounded-xl p-6 flex items-center gap-6" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }}>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0ea5e9" strokeWidth="3"
              strokeDasharray={`${(score / maxScore) * 100} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-sky-300">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-400 font-bold mb-1">Recognition Score</p>
          <p className="text-2xl font-black text-white mb-1">{score} <span className="text-sm font-normal text-white/40">/ {maxScore}</span></p>
          <p className="text-xs text-white/50">Composite score across 9 competency pillars. Increases as you log hours, complete programs, and verify credentials.</p>
        </div>
      </div>

      {/* EBT callout */}
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
        <Zap size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Highest-Weight Competency — EBT Video Scoring (18%)</p>
          <p className="text-xs text-white/60">The EBT Video Interview is bundled with the Transition Program. A recorded interview scored on cognitive behavioural markers. Airlines view the score — not the raw video. Proprietary to PilotRecognition.</p>
          <button onClick={() => setTab('programs')} className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Enrol in Transition Program <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Competency list */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/40 font-bold">9 Competency Pillars</p>
        {COMPETENCIES.map(c => {
          const Icon = c.icon;
          const earned = Math.round((score / maxScore) * c.weight);
          return (
            <div key={c.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.15)' }}>
                  <Icon size={14} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-white">{c.id}. {c.name}</p>
                    <span className="text-xs text-white/40 flex-shrink-0 ml-2">{c.weight}%</span>
                  </div>
                  <p className="text-xs text-white/50 mb-2">{c.desc}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-700" style={{ width: `${(earned / c.weight) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">{earned} / {c.weight} pts earned</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to improve */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">How to Increase Your Score</p>
        <div className="space-y-2">
          {[
            { action: 'Complete Foundation Program', pts: '+8 pts', tab: 'programs' as TabId },
            { action: 'Verify credentials in Wallet', pts: '+10 pts', tab: 'wallet' as TabId },
            { action: 'Submit pathway interest', pts: '+4 pts', tab: 'pathways' as TabId },
            { action: 'EBT Video Interview (Transition Program)', pts: '+18 pts', tab: 'programs' as TabId },
          ].map(item => (
            <button key={item.action} onClick={() => setTab(item.tab)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all hover:brightness-110" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span className="text-white/70">{item.action}</span>
              <span className="font-bold text-emerald-400 flex-shrink-0 ml-2">{item.pts}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
