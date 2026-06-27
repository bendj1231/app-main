import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import {
  Route, Target, TrendingUp, AlertTriangle, ShieldCheck,
  Plane, Clock, Award, ChevronRight, CheckCircle2, XCircle,
  Briefcase, GraduationCap, Building2, Package, UserCheck,
} from 'lucide-react';

interface PathwayMatch {
  id: string;
  name: string;
  eligible: boolean;
  match_score: number;
  minHours: number;
  maxHours: number;
  requiredCreds: number;
  riskTolerance: string;
}

interface CareerMatchResult {
  pilot_id: string;
  risk_score: number;
  risk_label: string;
  verified_credentials: number;
  has_verified_hours: boolean;
  logbook_provider: { name: string; tier: string } | null;
  total_flight_hours: number;
  pathway_matches: PathwayMatch[];
}

const riskConfig: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <ShieldCheck className="w-5 h-5" /> },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <AlertTriangle className="w-5 h-5" /> },
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <AlertTriangle className="w-5 h-5" /> },
};

const pathwayIcons: Record<string, React.ReactNode> = {
  airline_cadet: <GraduationCap className="w-5 h-5" />,
  regional_fo: <Plane className="w-5 h-5" />,
  major_airline: <Building2 className="w-5 h-5" />,
  cargo_operator: <Package className="w-5 h-5" />,
  corporate_aviation: <Briefcase className="w-5 h-5" />,
  flight_instructor: <UserCheck className="w-5 h-5" />,
};

export const CareerPathwayMatches: React.FC<{ userId?: string }> = ({ userId }) => {
  const { callApi } = useWorkerAuth();
  const [result, setResult] = useState<CareerMatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadMatches();
  }, [userId]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await callApi<CareerMatchResult>('getCareerPathwayMatches', { user_id: userId });
      setResult(data);
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
        <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Complete your profile and verification to see pathway matches.</p>
      </div>
    );
  }

  const risk = riskConfig[result.risk_label] || riskConfig.high;

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-5 ${risk.bg} ${risk.border}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl border border-current/30 flex items-center justify-center ${risk.color}`}>
            {risk.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${risk.color}`}>
                {result.risk_label === 'low' ? 'Low Risk' : result.risk_label === 'medium' ? 'Medium Risk' : 'High Risk'}
              </h2>
              <span className={`text-2xl font-bold ${risk.color}`}>{result.risk_score}%</span>
            </div>
            <p className="text-xs opacity-80 mt-1">
              {result.verified_credentials}/4 credentials verified
              {result.has_verified_hours ? ' · Hours verified' : ' · Hours unverified'}
              {result.logbook_provider ? ` · ${result.logbook_provider.name} (${result.logbook_provider.tier})` : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pathway Matches */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Route className="w-4 h-4 text-blue-400" />
          Career Pathways
        </h3>
        {result.pathway_matches.map((pathway, i) => (
          <motion.div
            key={pathway.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border p-4 flex items-center gap-4 ${
              pathway.eligible
                ? 'bg-slate-900/80 border-slate-700'
                : 'bg-slate-900/40 border-slate-800/50 opacity-60'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              pathway.eligible ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {pathwayIcons[pathway.id] || <Plane className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white text-sm">{pathway.name}</h4>
                {pathway.eligible ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Eligible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-800 rounded-full px-2 py-0.5">
                    <XCircle className="w-3 h-3" />
                    Not yet
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pathway.minHours}-{pathway.maxHours === 99999 ? '∞' : pathway.maxHours} hrs
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {pathway.requiredCreds} creds
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Match: {pathway.match_score}%
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${pathway.eligible ? 'text-blue-400' : 'text-slate-600'}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
