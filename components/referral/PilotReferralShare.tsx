import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { Link2, Copy, Check, Share2, Mail, Twitter, Facebook, QrCode, Download, DollarSign, ArrowRight } from 'lucide-react';

interface PilotReferralShareProps {
  userId?: string;
  compact?: boolean;
}

interface ReferralStats {
  signups: number;
  subscribed: number;
  earned: number;
}

export const PilotReferralShare: React.FC<PilotReferralShareProps> = ({ userId, compact }) => {
  const { callApi } = useWorkerAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({ signups: 0, subscribed: 0, earned: 0 });

  useEffect(() => {
    loadReferralCode();
  }, [userId]);

  const loadReferralCode = async () => {
    if (!userId) { setLoading(false); return; }

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
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <div className="text-center space-y-3">
          <p className="text-slate-400 text-sm">No referral code assigned yet.</p>
          <button
            onClick={generateCode}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {loading ? 'Generating...' : 'Get code'}
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
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-400" />
          Refer & Earn
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Share your link. Earn <strong className="text-emerald-400">$20</strong> for every pilot who subscribes to Recognition+.
        </p>
      </div>

      {/* Earnings Badge */}
      {stats.earned > 0 && (
        <div className="bg-emerald-600/20 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-emerald-300 font-bold text-lg">${stats.earned.toFixed(2)}</p>
            <p className="text-emerald-400/70 text-xs">Total referral earnings</p>
          </div>
        </div>
      )}

      {/* Referral Link Display */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Link2 className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-transparent text-slate-300 text-sm focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-xl p-4">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Your Referral Code</p>
        <p className="text-2xl font-bold text-white tracking-wider">{referralCode}</p>
      </div>

      {/* Share Options */}
      <div>
        <p className="text-slate-400 text-sm mb-3">Share via</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg text-sm transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
          <button
            onClick={shareViaEmail}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={shareViaTwitter}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg text-sm transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </button>
          <button
            onClick={shareViaFacebook}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white text-sm font-medium">QR Code</p>
              <p className="text-slate-400 text-xs">Download for print materials</p>
            </div>
          </div>
          <button
            onClick={downloadQRCode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{stats.signups}</p>
          <p className="text-slate-400 text-xs">Signed Up</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.subscribed}</p>
          <p className="text-slate-400 text-xs">Subscribed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">${stats.earned.toFixed(0)}</p>
          <p className="text-slate-400 text-xs">Earned</p>
        </div>
      </div>
    </div>
  );
};
