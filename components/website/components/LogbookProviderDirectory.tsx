import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import {
  BookOpen, Link2, CheckCircle2, Clock, Star,
  Trophy, Users, ExternalLink, ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface LogbookProvider {
  id: string;
  name: string;
  provider_type: string;
  country: string;
  website: string;
  user_count: number;
  tier: string;
  certification_status: string;
  is_active: number;
}

const tierConfig: Record<string, { label: string; color: string; icon: React.ReactNode; minUsers: number }> = {
  provisional: { label: 'Provisional', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: <Clock className="w-3 h-3" />, minUsers: 0 },
  certified: { label: 'Certified', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: <CheckCircle2 className="w-3 h-3" />, minUsers: 50 },
  preferred: { label: 'Preferred', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <Star className="w-3 h-3" />, minUsers: 250 },
  anchor: { label: 'Anchor', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <Trophy className="w-3 h-3" />, minUsers: 1000 },
};

export const LogbookProviderDirectory: React.FC = () => {
  const { callApi } = useWorkerAuth();
  const [providers, setProviders] = useState<LogbookProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await callApi<LogbookProvider[]>('getLogbookProviders', {});
      setProviders(data || []);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Logbook Providers
        </h2>
      </div>

      {providers.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">No logbook providers registered yet.</p>
          <p className="text-slate-500 text-xs">Providers will appear here once they integrate with PilotRecognition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => {
            const tier = tierConfig[provider.tier] || tierConfig.provisional;
            const progressToNext = provider.tier === 'provisional'
              ? Math.min(100, (provider.user_count / 50) * 100)
              : provider.tier === 'certified'
              ? Math.min(100, ((provider.user_count - 50) / 200) * 100)
              : provider.tier === 'preferred'
              ? Math.min(100, ((provider.user_count - 250) / 750) * 100)
              : 100;

            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{provider.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{provider.country || 'Global'}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 border ${tier.color}`}>
                    {tier.icon}
                    {tier.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {provider.user_count} pilots
                  </span>
                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>

                {provider.tier !== 'anchor' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Progress to next tier</span>
                      <span className="text-slate-400">{Math.round(progressToNext)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-xs text-slate-500">
                    {provider.certification_status === 'approved' ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Certification approved
                      </span>
                    ) : provider.certification_status === 'pending' ? (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="w-3 h-3" />
                        Certification pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500">
                        <AlertTriangle className="w-3 h-3" />
                        Not certified
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const PilotLogbookConnection: React.FC<{ userId: string }> = ({ userId }) => {
  const { callApi } = useWorkerAuth();
  const [providers, setProviders] = useState<LogbookProvider[]>([]);
  const [connected, setConnected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await callApi<LogbookProvider[]>('getLogbookProviders', {});
      setProviders(data || []);
    } catch { /* ignore */ }
  };

  const handleConnect = async (providerId: string) => {
    setConnecting(true);
    try {
      await callApi('connectLogbookProvider', { user_id: userId, provider_id: providerId });
      setConnected(providerId);
    } catch { /* ignore */ }
    setConnecting(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
        <Link2 className="w-4 h-4 text-blue-400" />
        Connect Logbook
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => handleConnect(p.id)}
            disabled={connecting || connected === p.id}
            className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
              connected === p.id
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="truncate">{p.name}</span>
            {connected === p.id && <CheckCircle2 className="w-3 h-3 ml-auto" />}
            {!connected && <ChevronRight className="w-3 h-3 ml-auto" />}
          </button>
        ))}
      </div>
      {connected && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Connected. Verified hours will appear on your public card.
        </p>
      )}
    </div>
  );
};
