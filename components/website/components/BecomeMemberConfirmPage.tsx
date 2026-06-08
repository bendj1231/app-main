import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MeshGradient } from '@paper-design/shaders-react';

export const BecomeMemberConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOver16, setIsOver16] = useState(false);

  const setupQuery = searchParams.get('setup') === '1' ? '?setup=1' : '';
  const continueUrl = `/become-member${setupQuery}`;

  const isContinueEnabled = acceptedTerms && isOver16;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-slate-100">
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={[
            '#dbeafe',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e3a5f',
            '#1e3a8a',
            '#0f172a',
          ]}
          speed={0.22}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, rgba(30,58,95,0.35) 50%, rgba(15,23,42,0.65) 100%)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8 border-b border-white/10 bg-[rgba(15,23,42,0.7)] backdrop-blur-sm">
          <h1 className="text-base font-bold tracking-tight">
            <span className="text-white">PILOT</span>
            <span className="text-red-400">RECOGNITION</span>
          </h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all"
          >
            ← Cancel
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-6 rounded-[28px] bg-slate-800/80 p-6 border border-slate-700/70">
            <h1 className="text-3xl font-semibold text-white">
              ATC calling... <span className="text-red-300">Identify</span> yourself,{' '}
              <span className="text-red-300">Pilot</span>
            </h1>
            <p className="mt-3 text-slate-300 leading-7">
              We found your login, but you still need to finish creating your Pilot Recognition
              account. Accept the terms and confirm you are over 16 before continuing to the setup
              page.
            </p>
          </div>

          <div className="space-y-5">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-400"
              />
              <span className="text-slate-200 leading-7">
                I accept the{' '}
                <a
                  href="/terms-of-service"
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Terms &amp; Conditions
                </a>
                .
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4">
              <input
                type="checkbox"
                checked={isOver16}
                onChange={(event) => setIsOver16(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-400"
              />
              <span className="text-slate-200 leading-7">
                I confirm that I am over 16 years old.
              </span>
            </label>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 text-slate-400">
              <p className="text-sm leading-6">
                By continuing, you agree to create your Pilot Recognition account and enter the
                member setup process. This is required so we can securely store your profile, verify
                your eligibility, and give you access to member-only tools.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-2xl border border-white/10 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
            >
              Go back to home
            </button>
            <button
              type="button"
              disabled={!isContinueEnabled}
              onClick={() => navigate(continueUrl)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                isContinueEnabled
                  ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-red-300 shadow-xl shadow-sky-500/20 hover:brightness-110'
                  : 'cursor-not-allowed bg-slate-700 text-slate-400'
              }`}
            >
              Continue to account setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMemberConfirmPage;
