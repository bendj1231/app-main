import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const BecomeMemberConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOver16, setIsOver16] = useState(false);

  const setupQuery = searchParams.get('setup') === '1' ? '?setup=1' : '';
  const continueUrl = `/become-member${setupQuery}`;

  const isContinueEnabled = acceptedTerms && isOver16;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-6 rounded-3xl bg-slate-800/80 p-6 border border-slate-700/60">
          <h1 className="text-3xl font-semibold text-white">Whoops — your account isn't created yet</h1>
          <p className="mt-3 text-slate-300 leading-7">
            We found your login, but you still need to finish creating your Pilot Recognition account.
            Please accept our terms and confirm you are over 16 before continuing to the setup page.
          </p>
        </div>

        <div className="space-y-5">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-400"
            />
            <span className="text-slate-200 leading-7">
              I accept the <a href="/terms-of-service" className="font-semibold text-blue-400 hover:text-blue-300">Terms &amp; Conditions</a>.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4">
            <input
              type="checkbox"
              checked={isOver16}
              onChange={(event) => setIsOver16(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-400"
            />
            <span className="text-slate-200 leading-7">
              I confirm that I am over 16 years old.
            </span>
          </label>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 text-slate-400">
            <p className="text-sm leading-6">
              By continuing, you agree to create your Pilot Recognition account and enter the member setup process.
              This is required so we can securely store your profile, verify your eligibility, and give you access to member-only tools.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-2xl border border-slate-700/80 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Go back to home
          </button>
          <button
            type="button"
            disabled={!isContinueEnabled}
            onClick={() => navigate(continueUrl)}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              isContinueEnabled
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-xl shadow-sky-500/20 hover:brightness-110'
                : 'cursor-not-allowed bg-slate-700 text-slate-400'
            }`}
          >
            Continue to account setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeMemberConfirmPage;
