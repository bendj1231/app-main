import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { PilotReferralShare } from '@/components/referral';
import { ArrowLeft, Share2 } from 'lucide-react';

export default function ReferralTerminalPage() {
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/platform')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Platform
        </button>

        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Share2 className="w-6 h-6 text-emerald-400" />
          Referral Terminal
        </h1>
        <p className="text-slate-400 mb-6">
          Share your link and earn $20 for every pilot who subscribes to Recognition+.
        </p>

        <PilotReferralShare userId={profileId} />
      </div>
    </div>
  );
}
