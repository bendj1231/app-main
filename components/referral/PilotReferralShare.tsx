import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { Link2, Copy, Check, Share2, Mail, Twitter, Facebook, QrCode, Download } from 'lucide-react';

interface PilotReferralShareProps {
  userId?: string;
}

export const PilotReferralShare: React.FC<PilotReferralShareProps> = ({ userId }) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralCode();
  }, [userId]);

  const loadReferralCode = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (data?.referral_code) {
        setReferralCode(data.referral_code);
        setReferralLink(`${window.location.origin}/ref/${data.referral_code}`);
      }
    } catch (error) {
      console.error('Error loading referral code:', error);
    } finally {
      setLoading(false);
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
    const subject = encodeURIComponent('Join PilotRecognition.com - Exclusive Invitation');
    const body = encodeURIComponent(`Hi,\n\nI'm inviting you to join PilotRecognition.com, the leading platform for pilot career advancement.\n\nUse my referral link to sign up: ${referralLink}\n\nThis platform helps pilots connect with airline opportunities and advance their careers.\n\nBest regards`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`🚀 Join PilotRecognition.com - The platform for pilot career advancement. Sign up through my referral link: ${referralLink} #Aviation #PilotCareers`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const downloadQRCode = () => {
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <p className="text-slate-400 text-center">No referral code assigned yet. Contact support to get your referral code.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-400" />
          Share Your Referral Link
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Share your unique referral link and earn rewards when pilots sign up through it
        </p>
      </div>

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
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-slate-400 text-xs">Clicks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-slate-400 text-xs">Sign-ups</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">$0</p>
          <p className="text-slate-400 text-xs">Earned</p>
        </div>
      </div>
    </div>
  );
};
