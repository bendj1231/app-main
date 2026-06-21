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
}

export const GettingStartedBar: React.FC<GettingStartedBarProps> = ({ steps, onStepClick }) => {
  return (
    <div
      className="w-full overflow-hidden border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_28px_rgba(0,0,0,0.55)]"
      style={{ background: 'rgba(15,22,35,0.97)' }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/25 flex-shrink-0">
            Getting Started
          </p>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.step}
                onClick={() => onStepClick(s.tab)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all hover:brightness-110 flex-shrink-0"
                style={{
                  background: s.done
                    ? 'rgba(16,185,129,0.1)'
                    : s.highlight
                    ? 'rgba(251,146,60,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    s.done
                      ? 'rgba(16,185,129,0.2)'
                      : s.highlight
                      ? 'rgba(251,146,60,0.25)'
                      : 'rgba(255,255,255,0.06)'
                  }`,
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.done ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                >
                  {s.done ? (
                    <CheckCircle size={11} className="text-white" />
                  ) : (
                    <Icon size={11} className="text-white/30" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold truncate ${
                    s.done ? 'text-emerald-300' : 'text-white/50'
                  }`}
                >
                  {s.label}
                </span>
                {s.done && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-[#00b4d8] to-blue-600" />
    </div>
  );
};

export default GettingStartedBar;
