import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  step: number;
  label: string;
  sublabel?: string;
  done: boolean;
  tab: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  highlight?: boolean;
}

interface GettingStartedBarProps {
  steps: Step[];
  onStepClick: (tab: string) => void;
  isGuest?: boolean;
  onGuestCta?: () => void;
}

export const GettingStartedBar: React.FC<GettingStartedBarProps> = ({ steps, onStepClick, isGuest, onGuestCta }) => {
  const completedCount = steps.filter(s => s.done).length;
  const total = steps.length;

  if (isGuest) {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">0/{total}</span>
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.12em] uppercase text-white">
                Getting Started
              </p>
              <p className="text-[10px] text-white/60 font-medium">
                Sign in to track your onboarding progress
              </p>
            </div>
          </div>
          <button
            onClick={onGuestCta}
            className="px-4 py-2 text-[10px] font-black tracking-wider uppercase text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">{completedCount}/{total}</span>
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.12em] uppercase text-white">
                Getting Started
              </p>
              <p className="text-[10px] text-white/60 font-medium">
                {completedCount === total ? 'Profile ready' : `${total - completedCount} steps remaining`}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 h-1.5 w-32 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${(completedCount / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
          {steps.map((s) => {
            const Icon = s.icon;
            const isHighlight = s.highlight;
            return (
              <button
                key={s.step}
                onClick={() => onStepClick(s.tab)}
                className={`group relative flex flex-col items-start justify-between min-w-[140px] flex-1 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  s.done
                    ? 'bg-red-500 hover:bg-red-600'
                    : isHighlight
                    ? 'bg-red-50 hover:bg-red-100/80'
                    : 'bg-white/70 hover:bg-white'
                }`}
                style={{
                  border: `1px solid ${
                    s.done ? 'rgba(239,68,68,1)' : isHighlight ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.25)'
                  }`,
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      s.done ? 'bg-white' : isHighlight ? 'bg-red-500' : 'bg-slate-200'
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle size={13} className="text-red-500" strokeWidth={2.5} />
                    ) : (
                      <Icon size={13} className={isHighlight ? 'text-white' : 'text-slate-600'} />
                    )}
                  </div>
                  {s.done && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-white">Done</span>
                  )}
                </div>

                <div>
                  <p
                    className={`text-[11px] font-bold leading-tight ${
                      s.done ? 'text-white' : isHighlight ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {s.label}
                  </p>
                  {s.sublabel && (
                    <p className={`text-[9px] mt-0.5 leading-snug ${s.done ? 'text-white/80' : 'text-slate-500'}`}>
                      {s.sublabel}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GettingStartedBar;
