'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

export default function ReferralLandingPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { callApi } = useWorkerAuth();
  const code = (params?.code as string)?.toUpperCase();

  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [referrerName, setReferrerName] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      navigate('/');
      return;
    }
    resolveCode();
  }, [code]);

  const resolveCode = async () => {
    // Check if it's a pilot referral code (in profiles via Worker API)
    try {
      const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'profiles',
        operation: 'select',
        where: { referral_code: code },
        limit: 1,
      });
      const profile = profileRows?.[0];

      if (profile) {
        const name = (profile['display_name'] as string) || (profile['full_name'] as string) || 'A fellow pilot';
        setReferrerName(name);
        // Store in cookie — 30 day expiry, read by AuthContext on signup
        document.cookie = `pr_ref=${code}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        setStatus('valid');

        // Redirect to become-member after short delay
        setTimeout(() => {
          navigate('/become-member?ref=' + code);
        }, 2500);
        return;
      }

      // Check referral_partners table (flight school / ATO codes)
      const partnerRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'referral_partners',
        operation: 'select',
        where: { referral_code: code, is_active: true },
        limit: 1,
      });
      const partnerRecord = partnerRows?.[0];

      if (partnerRecord) {
        setReferrerName((partnerRecord['name'] as string) || 'A partner');
        document.cookie = `pr_ref=${code}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        setStatus('valid');
        setTimeout(() => {
          navigate('/become-member?ref=' + code);
        }, 2500);
        return;
      }
    } catch {
      // non-critical
    }

    setStatus('invalid');
    setTimeout(() => navigate('/'), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        {/* Coded by Benjamin Bowler */}
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Validating invite code…</p>
          </div>
        )}

        {status === 'valid' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">You were invited by</p>
              <h1 className="text-2xl font-bold text-white mb-1">{referrerName}</h1>
              <p className="text-slate-400 text-sm">Invite code <span className="text-emerald-400 font-mono font-bold">{code}</span> saved.</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-left space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">What this means</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                When you create your free PilotRecognition account, your profile will be linked to your referrer's network. If you activate a <strong className="text-white">Recognition+ subscription</strong>, they'll receive a <strong className="text-emerald-400">$20 ecosystem dividend</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-xs">Taking you to sign up…</p>
            </div>
          </div>
        )}

        {status === 'invalid' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white font-semibold">Invalid invite code</p>
            <p className="text-slate-400 text-sm">Code <span className="font-mono text-red-400">{code}</span> doesn't match any active referral. Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
}
