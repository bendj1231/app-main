import React from 'react';
import { useRecognitionScore } from '@/src/hooks/useRecognitionScore';
import { calculateRecognitionScore } from '@/lib/pilot-recognition-score';
import { ScoreOptimizationGuide } from '../../../../ScoreOptimizationGuide';
import { VeremarkVerifiedBadge } from '../../pilot-recognition/VeremarkVerifiedBadge';
import { RecognitionPlusNotifications } from '../../pilot-recognition/RecognitionPlusNotifications';
import type { VerificationItem } from '../../pilot-recognition/VeremarkVerifiedBadge';

export const CockpitTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => {
  useRecognitionScore();
  const isPremium = profile?.subscription_tier === 'premium' || profile?.is_premium || false;

  const scoreInput = calculateRecognitionScore({
    stats: {
      totalHours: profile?.total_hours || profile?.current_flight_hours || 0,
      picHours: profile?.pic_hours || 0,
      ifrHours: profile?.ifr_hours || 0,
      nightHours: profile?.night_hours || 0,
    },
    experience: {
      years: profile?.experience_years || 0,
      achievements: profile?.certifications?.length || 0,
      licenses: profile?.type_ratings?.length || 0,
    },
    assessments: {
      programCompletion: 0,
      performanceScore: profile?.overall_recognition_score || 0,
    },
    mentorship: { hours: 0, observations: 0, cases: 0 },
  });

  const walletCompleteness = (() => {
    let checks = 0;
    const total = 9;
    if (profile?.license_type && profile?.license_type !== 'None') checks++;
    if (profile?.medical_status && profile?.medical_status !== 'None') checks++;
    if (profile?.total_hours && profile?.total_hours > 0) checks++;
    if (profile?.certifications?.length > 0) checks++;
    if (profile?.current_employer) checks++;
    if (profile?.country_of_license) checks++;
    if (profile?.veremark_verified) checks += 3;
    return Math.min(100, Math.round((checks / total) * 100));
  })();

  const riskTier = (() => {
    const medical = profile?.medical_status?.toLowerCase() || '';
    const hours = profile?.total_hours || 0;
    const license = profile?.license_status?.toLowerCase() || '';
    const incidents = profile?.incident_count || 0;
    const suspensions = profile?.license_suspension_count || 0;
    if (incidents >= 2 || suspensions >= 1 || medical.includes('special')) return 'high' as const;
    if (incidents === 1 || hours < 250 || !medical.includes('valid')) return 'moderate' as const;
    if (license.includes('valid') && medical.includes('valid') && hours >= 500) return 'low' as const;
    return 'unknown' as const;
  })();

  const vItems: VerificationItem[] = [];
  if (profile?.license_type && profile?.license_type !== 'None') {
    vItems.push({ id: 'lic', category: 'license', label: 'License Validation', status: profile?.license_status?.toLowerCase().includes('valid') ? 'verified' : 'pending' });
  }
  if (profile?.medical_status && profile?.medical_status !== 'None') {
    vItems.push({ id: 'med', category: 'medical', label: 'Medical Certificate', status: profile?.medical_status?.toLowerCase().includes('valid') ? 'verified' : 'pending' });
  }
  if (profile?.total_hours && profile?.total_hours > 0) {
    vItems.push({ id: 'hrs', category: 'identity', label: 'Flight Hours Log', status: 'verified' });
  }
  if (profile?.certifications?.length > 0) {
    vItems.push({ id: 'edu', category: 'education', label: 'Education & Credentials', status: 'verified' });
  }
  if (profile?.current_employer) {
    vItems.push({ id: 'emp', category: 'employment', label: 'Employment History', status: 'verified' });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-0.5">Recognition+</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Cockpit</h1>
          <p className="text-sm text-white/40 mt-0.5">Your score, verification status and career readiness — in one place.</p>
        </div>
      </div>

      {/* Visitor Account Banner */}
      {profile?.role === 'visitor' && (
        <div className="px-4 py-3 rounded-lg" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <p className="text-[10px] font-black text-sky-800 uppercase tracking-wide mb-1">Visitor Account — Limited Access</p>
          <p className="text-[9px] text-sky-700 leading-relaxed">
            You're browsing as a <strong>Visitor</strong>. You can explore pathways and resources, but pilot verification, pathway submissions, and operator matching require a licensed pilot profile. When you earn your pilot license, update your stage in Settings to unlock full access.
          </p>
        </div>
      )}

      {/* Score Optimization Guide */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Recognition+</h2>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Premium Score Optimization</span>
        </div>
        <ScoreOptimizationGuide
          currentScore={scoreInput}
          isPremium={isPremium}
          userId={profile?.user_id || profile?.id}
          limit={3}
          onViewAll={() => onNavigate('score-optimization')}
          onNavigate={onNavigate}
        />
      </div>

      {/* Veremark Verified Badge */}
      <div style={{ marginTop: '0.5rem' }}>
        <VeremarkVerifiedBadge
          isVerified={profile?.veremark_verified || false}
          isPreCleared={profile?.veremark_verified && profile?.verification_completeness === 100}
          verificationDate={profile?.veremark_verified_at ? new Date(profile.veremark_verified_at) : undefined}
          expiryDate={profile?.veremark_expires_at ? new Date(profile.veremark_expires_at) : undefined}
          verificationId={profile?.veremark_verification_id || undefined}
          riskTier={riskTier}
          countryCode={profile?.country_of_license}
          isPremium={isPremium}
          walletCompletenessPercent={walletCompleteness}
          items={vItems}
          onRequestVerification={() => onNavigate('veremark-verification')}
          onViewDetails={() => onNavigate('verification-details')}
        />
      </div>

      {/* Premium: Currency & Compliance Notifications */}
      {isPremium && (
        <div style={{ marginTop: '0.5rem' }}>
          <RecognitionPlusNotifications
            lastFlownDate={profile?.last_flight_date ? new Date(profile.last_flight_date) : null}
            medicalExpiry={profile?.medical_expiry ? new Date(profile.medical_expiry) : null}
            licenseExpiry={profile?.license_expiry ? new Date(profile.license_expiry) : null}
            totalHours={profile?.total_hours || 0}
            onAction={(action) => {
              if (action === 'Schedule Flight') onNavigate('digital-logbook');
              if (action === 'Schedule Medical') onNavigate('medical-certificate');
              if (action === 'View Requirements') onNavigate('license-requirements');
              if (action === 'Update Logbook') onNavigate('digital-logbook');
            }}
          />
        </div>
      )}
    </div>
  );
};
