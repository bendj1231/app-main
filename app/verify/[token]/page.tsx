'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, ShieldCheck, ShieldAlert, Plane, Clock, Award,
  MapPin, Mail, BadgeCheck, AlertTriangle, CheckCircle2,
  FileCheck, Radio, Headphones, BookOpen, TrendingUp,
} from 'lucide-react';

interface PublicProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  total_flight_hours?: number;
  license_id?: string;
  country_of_license?: string;
  ratings?: string;
  license_types?: string;
  type_ratings?: string;
  current_occupation?: string;
  current_level?: string;
  pilot_stage?: string;
  nationality?: string;
  subscription_tier?: string;
  credentials: Array<{ credential_type: string; status: string; issued_at?: string; expires_at?: string }>;
  verifications: Array<{ document_type: string; status: string; created_at?: string }>;
  risk_score: number;
  verified_pct: number;
  created_at?: string;
}

export default function PublicPilotCardPage() {
  const params = useParams();
  const token = params?.token as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchPublicProfile();
  }, [token]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://pilotrecognition-pilot-api.benjamintigerbowler.workers.dev/api/public/profile?token=${encodeURIComponent(token)}`);
      if (!res.ok) throw new Error(res.status === 404 ? 'Pilot not found' : 'Failed to load profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Profile Unavailable</h1>
          <p className="text-slate-400 text-sm">{error || 'This pilot profile could not be found or is no longer public.'}</p>
        </div>
      </div>
    );
  }

  const riskColor = profile.risk_score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : profile.risk_score >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-red-400 bg-red-500/10 border-red-500/30';

  const riskLabel = profile.risk_score >= 80 ? 'Low Risk' : profile.risk_score >= 50 ? 'Medium Risk' : 'High Risk';

  const credMap: Record<string, { label: string; icon: React.ReactNode }> = {
    license: { label: 'Pilot License', icon: <FileCheck className="w-4 h-4" /> },
    medical: { label: 'Medical Certificate', icon: <ShieldCheck className="w-4 h-4" /> },
    radio_license: { label: 'Radio License', icon: <Radio className="w-4 h-4" /> },
    english_proficiency: { label: 'ELP', icon: <Headphones className="w-4 h-4" /> },
    flight_hours: { label: 'Flight Hours', icon: <Clock className="w-4 h-4" /> },
    profile: { label: 'Profile VC', icon: <BadgeCheck className="w-4 h-4" /> },
  };

  const activeCreds = profile.credentials.filter(c => c.status === 'active');

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-slate-700 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                profile.name?.charAt(0).toUpperCase() || 'P'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                  <BadgeCheck className="w-3 h-3" />
                  Verified Pilot
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {profile.current_occupation || profile.current_level || profile.pilot_stage || 'Pilot'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                {profile.nationality && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.nationality}
                  </span>
                )}
                {profile.license_id && (
                  <span className="flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {profile.license_id}
                  </span>
                )}
                {profile.country_of_license && (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {profile.country_of_license}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${riskColor}`}>
            <div className="w-12 h-12 rounded-xl border border-current/30 flex items-center justify-center text-lg font-bold">
              {profile.risk_score}%
            </div>
            <div>
              <p className="font-semibold">{riskLabel}</p>
              <p className="text-xs opacity-80">
                {profile.verified_pct}% of required credentials verified
                {profile.total_flight_hours ? ` · ${profile.total_flight_hours} total hours` : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6"
        >
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Verified Credentials
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(credMap).map(([key, meta]) => {
              const hasCred = activeCreds.some(c => c.credential_type === key);
              return (
                <div
                  key={key}
                  className={`rounded-xl border p-3 flex items-center gap-3 ${
                    hasCred
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                  }`}
                >
                  {meta.icon}
                  <span className="text-sm font-medium">{meta.label}</span>
                  {hasCred ? (
                    <CheckCircle2 className="w-4 h-4 ml-auto" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 ml-auto opacity-50" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6"
        >
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Pilot Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.ratings && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase">Ratings</p>
                <p className="text-sm text-slate-200">{profile.ratings}</p>
              </div>
            )}
            {profile.type_ratings && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase">Type Ratings</p>
                <p className="text-sm text-slate-200">{profile.type_ratings}</p>
              </div>
            )}
            {profile.license_types && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase">License Types</p>
                <p className="text-sm text-slate-200">{profile.license_types}</p>
              </div>
            )}
            {profile.total_flight_hours !== undefined && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase">Total Flight Hours</p>
                <p className="text-sm text-slate-200 font-mono">{profile.total_flight_hours}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-3 py-4"
        >
          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Verified by PilotRecognition — Yearly credential check
          </div>
          <p className="text-xs text-slate-600">
            This is a public verification card. For full profile access, the pilot must grant permission through the platform.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
