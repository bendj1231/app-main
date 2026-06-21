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
  const completedCount = steps.filter(s => s.done).length;
  const total = steps.length;

  return (
    <div className="w-full rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">{completedCount}/{total}</span>
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.12em] uppercase text-slate-900">
                Getting Started
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {completedCount === total ? 'Profile ready' : `${total - completedCount} steps remaining`}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
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
                    ? 'bg-slate-50 hover:bg-slate-100'
                    : isHighlight
                    ? 'bg-red-50 hover:bg-red-100/80'
                    : 'bg-slate-50/60 hover:bg-slate-100'
                }`}
                style={{
                  border: `1px solid ${
                    s.done ? 'rgba(15,23,42,0.08)' : isHighlight ? 'rgba(239,68,68,0.15)' : 'rgba(15,23,42,0.06)'
                  }`,
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      s.done ? 'bg-slate-900' : isHighlight ? 'bg-red-500' : 'bg-slate-200'
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle size={13} className="text-white" strokeWidth={2.5} />
                    ) : (
                      <Icon size={13} className={isHighlight ? 'text-white' : 'text-slate-600'} />
                    )}
                  </div>
                  {s.done && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-900">Done</span>
                  )}
                </div>

                <div>
                  <p
                    className={`text-[11px] font-bold leading-tight ${
                      isHighlight ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {s.label}
                  </p>
                  {s.sublabel && (
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{s.sublabel}</p>
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
