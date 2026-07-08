import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { Link2, Copy, Check, Share2, Mail, Twitter, Facebook, QrCode, Download, ArrowRight } from 'lucide-react';

interface PilotReferralShareProps {
  userId?: string;
  compact?: boolean;
}

interface ReferralStats {
  signups: number;
  subscribed: number;
  earned: number;
}

// Module-level counter for observability — we expect exactly one load per userId
let referralRequestCount = 0;

export const PilotReferralShare: React.FC<PilotReferralShareProps> = ({ userId, compact }) => {
  const { callApi } = useWorkerAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({ signups: 0, subscribed: 0, earned: 0 });
  const lastLoadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if already loaded for this exact userId
    if (!userId || lastLoadedUserIdRef.current === userId) return;
    lastLoadedUserIdRef.current = userId;
    loadReferralCode();
  }, [userId]);

  const loadReferralCode = async () => {
    if (!userId) { setLoading(false); return; }

    referralRequestCount += 1;
    console.log(`[PilotReferralShare] loadReferralCode request #${referralRequestCount} for userId:`, userId);

    try {
      setLoading(true);
      // Referral codes live in the Recognition+ trace DB, not the public profiles table
      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'recognition_plus_referrals',
        operation: 'select',
        dbName: 'DB_TRACE',
        where: { profile_id: userId, is_active: 1 },
        limit: 1,
      });
      const referralRow = rows?.[0];
      let code = referralRow?.['referral_code'] as string | null;

      if (code) {
        setReferralCode(code);
        setReferralLink(`${window.location.origin}/ref/${code}`);
        await loadStats(code);
      }
    } catch (error) {
      console.error('Error loading referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const genRes = await callApi<Record<string, unknown>>('generateReferral', {
        profileId: userId,
        user_id: userId,
      });
      const code = (genRes?.['referralCode'] as string | null) ?? (genRes?.['referral_code'] as string | null) ?? null;

      if (code) {
        setReferralCode(code);
        setReferralLink(`${window.location.origin}/ref/${code}`);
        await loadStats(code);
      } else {
        console.error('generateReferral did not return a code:', genRes);
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (code: string) => {
    try {
      // Count how many people signed up with this code (referred_by_code is on the profiles DB)
      const signupRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'profiles',
        operation: 'select',
        dbName: 'DB_PROFILES',
        where: { referred_by_code: code },
      });
      const signups = signupRows?.length ?? 0;

      // Count how many converted to Recognition+ (subscribed) — operational DB
      const convRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'referral_conversions',
        operation: 'select',
        dbName: 'DB_OPS',
        where: { referral_code: code, status: 'subscribed' },
      });
      const subscribed = convRows?.length ?? 0;

      // Sum earned commission
      const earned = convRows?.reduce((sum, r) => {
        const amt = (r['commission_amount'] as number) ?? 0;
        return sum + amt;
      }, 0) ?? 0;

      setStats({ signups, subscribed, earned });
    } catch (e) {
      console.error('Error loading referral stats:', e);
    }
  };

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join PilotRecognition.com — Pilot Career Advancement');
    const body = encodeURIComponent(
      `Hi,\n\nI'm inviting you to join PilotRecognition.com, the platform for pilot career advancement and verified credentials.\n\nUse my referral link: ${referralLink}\n\nWhen you subscribe to Recognition+, I earn $20 — and you get priority pathway access.\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `🚀 Join PilotRecognition.com — the platform for pilot career advancement. Use my referral link and subscribe to Recognition+ for priority pathway access: ${referralLink} #Aviation #PilotCareers`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer');
  };

  const downloadQRCode = () => {
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl shadow-2xl shadow-black/30">
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl shadow-2xl shadow-black/30">
        <div className="text-center space-y-4 py-6">
          <p className="text-slate-400 text-sm font-medium">No referral code assigned yet.</p>
          <button
            onClick={generateCode}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black rounded-lg shadow-md shadow-red-600/10 active:scale-95 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {loading ? 'Generating...' : 'Get Referral Code'}
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Your Referral Code</p>
            <p className="text-xl font-bold text-white tracking-wider">{referralCode}</p>
            <p className="text-slate-400 text-xs mt-1">
              Earn <span className="text-emerald-400 font-medium">$20</span> per Recognition+ subscription.
            </p>
          </div>
          <button
            onClick={() => navigate('/referral')}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Referral Terminal
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl shadow-2xl shadow-black/30 space-y-6">
      {/* TOP MODULE: Referral Code Identifier */}
      <div className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Referral Code</p>
          <p className="text-lg font-black text-white font-mono tracking-wider mt-0.5">{referralCode}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Earn <span className="text-emerald-400 font-bold">$20</span> per Recognition+ subscription.
          </p>
        </div>
        <button
          onClick={copyReferralCode}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-colors shrink-0 ml-4"
        >
          {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {codeCopied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* LINK MODULE: Clean Referral Link Input Action Box */}
      <div className="relative flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 focus-within:border-red-500/30 transition-colors p-2 pl-4">
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full min-w-0 bg-transparent text-xs font-mono font-bold text-slate-300 tracking-wide focus:outline-none truncate"
          />
        </div>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black rounded-lg shadow-md shadow-red-600/10 active:scale-95 transition-all shrink-0 ml-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* MIDDLE MODULE: Crisp Social Share Matrix Hub */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Share Via Networks</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={shareViaEmail}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email Dispatch</span>
          </button>
          <button
            onClick={shareViaTwitter}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>X / Twitter</span>
          </button>
          <button
            onClick={shareViaFacebook}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      {/* LOWER MODULE: Highly Visual Download Block Bar Layout */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white">Unique QR Code Identifier</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Download asset for printed materials and logbooks.</p>
          </div>
        </div>
        <button
          onClick={downloadQRCode}
          className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors shrink-0 ml-3 inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
      </div>

      {/* BOTTOM MODULE: Live Analytics Metrics Board Ledger */}
      <div className="border-t border-slate-900 pt-6">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">Terminal Performance</label>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
            <p className="text-2xl font-black text-white">{stats.signups}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Signed Up</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
            <p className="text-2xl font-black text-white">{stats.subscribed}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Subscribed</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
            <p className="text-2xl font-black text-emerald-400">${stats.earned.toFixed(2)}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Total Earned</p>
          </div>
        </div>
      </div>
    </div>
  );
};
