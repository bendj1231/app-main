'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/lib/device-detection';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { ChevronLeft } from 'lucide-react';
import { VerificationStatusTab } from '@/components/website/components/unified-platform/tabs/VerificationStatusTab';
import type { TabId } from '@/components/website/components/unified-platform/types';

export default function VerificationRecurrencyPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { user: auth0User } = useAuth0();
  const { callBatch } = useWorkerAuth();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);

  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(userProfile as Record<string, unknown> | null);
  const [walletChecks, setWalletChecks] = useState<Record<string, unknown>[]>([]);
  const [credentials, setCredentials] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seed from auth context
  useEffect(() => {
    if (userProfile && !profileData?.id) {
      setProfileData(userProfile as Record<string, unknown>);
    }
  }, [userProfile]);

  // Fetch full profile + dashboard data
  useEffect(() => {
    const userId = currentUser?.id || auth0User?.sub;
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const batch = await callBatch([
          { action: 'getProfile', params: { id: userId } },
          { action: 'getDashboardData', params: { user_id: userId } },
        ]);

        const profile = (batch.result_1 as any) || null;
        const dashboard = (batch.result_2 as any) || null;

        const flightHours = dashboard?.flight_hours as Record<string, unknown> | null;
        const licensure = dashboard?.licensure as Record<string, unknown> | null;
        const receipts = dashboard?.verification_receipts as Array<Record<string, unknown>> | null;
        const credentialList = dashboard?.credentials as Array<Record<string, unknown>> | null;

        const mergedProfile = { ...profile, ...flightHours, ...(licensure || {}) };

        setProfileData(mergedProfile);
        if (receipts) setWalletChecks(receipts);
        if (credentialList) setCredentials(credentialList);
      } catch (err) {
        console.error('[VerificationRecurrencyPage] fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id, auth0User?.sub, callBatch]);

  const handleSetTab = (tab: TabId) => {
    navigate(`/platform?tab=${tab}`);
  };

  const handleNavigate = (page: string) => {
    if (page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  const handleProfileImageUpdate = (url: string, publicId?: string) => {
    setProfileData((prev) =>
      prev
        ? { ...prev, profile_image_url: url, profile_image_public_id: publicId || null }
        : prev
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      {/* Background shader */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MeshGradient
          colors={graphicsConfig.meshColors}
          speed={0.2}
          style={{ width: '100%', height: '100%', opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate('/platform?tab=verification-recurrency')}
              className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
              Back to Platform
            </button>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30">
              Verification & Recurrency
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VerificationStatusTab
              profile={profileData}
              walletChecks={walletChecks}
              credentials={credentials}
              setTab={handleSetTab}
              onNavigate={handleNavigate}
              onProfileImageUpdate={handleProfileImageUpdate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
