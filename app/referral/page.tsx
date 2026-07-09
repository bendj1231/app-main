import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { PilotReferralShare } from '@/components/referral';
import { ArrowLeft, Share2 } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/lib/device-detection';
import { useTheme } from '@/components/website/context/ThemeContext';

export default function ReferralTerminalPage() {
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!currentUser?.id) return;
    let active = true;
    callApi<Record<string, unknown>>('getProfile', { auth0_id: currentUser.id })
      .then((profile) => {
        if (!active) return;
        const id = profile?.['id'] as string | undefined;
        if (id) setProfileId(id);
      })
      .catch((err) => {
        console.error('[ReferralTerminal] getProfile failed:', err);
      });
    return () => { active = false; };
  }, [currentUser?.id, callApi]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── BACKGROUND: same MeshGradient as the home tab ── */}
      <div className="fixed inset-0 z-0">
        {graphicsConfig.enableMeshGradient ? (
          <MeshGradient
            className="w-full h-full"
            colors={isDarkMode ? [
              '#dbeafe',
              '#94a3b8',
              '#64748b',
              '#475569',
              '#334155',
              '#1e3a5f',
              '#1e3a8a',
              '#0f172a',
            ] : [
              '#ffffff',
              '#f0f5fa',
              '#c8d8e8',
              '#9ab0c8',
              '#5e85a8',
              '#345a7d',
              '#1e3a5f',
              '#0f2747',
            ]}
            speed={graphicsConfig.meshGradientSpeed}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: isDarkMode ? 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f0f5fa 0%, #1e3a5f 100%)' }}
          />
        )}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60' : 'bg-gradient-to-b from-white/10 via-slate-200/20 to-slate-400/40'}`} />
        <div className={`absolute inset-0 backdrop-blur-[1px] ${isDarkMode ? 'bg-slate-900/10' : 'bg-white/5'}`} />
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' : 'radial-gradient(ellipse at center, transparent 40%, rgba(15,39,71,0.65) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => navigate('/platform')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Platform</span>
          </button>

          <div>
            <div className="flex items-center gap-2 text-red-500">
              <Share2 className="w-5 h-5" />
              <h1 className="text-xl font-black tracking-tight text-white">Referral Terminal</h1>
            </div>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Share your unique link and earn <span className="text-emerald-400 font-bold">$20</span> for every pilot who subscribes to Recognition+.
            </p>
          </div>

          <PilotReferralShare userId={profileId} />
        </div>
      </div>
    </div>
  );
}
