import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SafeMeshGradient } from '@/components/ui/SafeMeshGradient';
import { getHomepageGraphicsConfig } from '@/lib/device-detection';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useVaultProfile } from '@/hooks/useVaultProfile';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { ChevronLeft, TrendingUp, Target, Pencil, ArrowRight, Clock } from 'lucide-react';

const PathwayProgressTracker = React.lazy(() => import('./PathwayProgressTracker'));
const CareerGoalSettings = React.lazy(() => import('./CareerGoalSettings'));

// Helper to analyze gap (duplicated here to avoid circular dep issues at runtime)
function analyzeGapForCard(profile: any, pathway: any) {
  const totalHours = (profile?.total_flight_hours ?? 0) as number;
  const picHours = (profile?.pic_hours ?? profile?.total_pic_hours ?? 0) as number;
  const userLicenses = ((profile?.licenses ?? profile?.license_type ?? '') as string)
    .split(',').map((s: string) => s.trim().toUpperCase());
  const userRatings = ((profile?.ratings ?? profile?.type_ratings ?? '') as string)
    .split(',').map((s: string) => s.trim().toUpperCase());
  const medical = (profile?.medical_class ?? '') as string;
  const english = (profile?.english_proficiency ?? '') as string;

  const gaps = [];
  gaps.push({ label: 'Total Hours', ok: totalHours >= pathway.minHours, have: totalHours, need: pathway.minHours });
  gaps.push({ label: 'PIC Hours', ok: picHours >= pathway.minPIC, have: picHours, need: pathway.minPIC });
  gaps.push({ label: 'Licenses', ok: pathway.requiredLicenses.every((lic: string) => userLicenses.some((ul: string) => ul.includes(lic.replace(' ', '')))) });
  gaps.push({ label: 'Ratings', ok: pathway.requiredRatings.every((rat: string) => userRatings.some((ur: string) => ur.includes(rat.replace(' ', '')))) });
  gaps.push({ label: 'Medical', ok: medical.includes(pathway.medicalClass) || (pathway.medicalClass === 'Class 2' && medical.includes('Class 1')) });
  gaps.push({ label: 'English', ok: english.includes('5') || english.includes('6') || (pathway.englishLevel === 'Level 4+' && english.includes('4')) });

  const complete = gaps.filter((g) => g.ok).length;
  return Math.round((complete / gaps.length) * 100);
}

export const CareerProgressDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { user: auth0User } = useAuth0();
  const { readProfile } = useVaultProfile();
  const { callBatch } = useWorkerAuth();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);

  const [profileData, setProfileData] = useState<any>(userProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [careerGoalId, setCareerGoalId] = useState<string>(() => {
    try { return localStorage.getItem('pr_career_goal') || ''; } catch { return ''; }
  });

  // Seed from auth context
  useEffect(() => {
    if (userProfile && !profileData?.id) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  // Fetch full profile + licensure via unified dashboard
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

        setProfileData({ ...profile, ...flightHours, ...(licensure || {}) });
      } catch (err) {
        console.error('[CareerProgressDashboard] fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id, auth0User?.sub, callBatch]);

  const handleBack = () => {
    navigate('/platform?tab=verification');
  };

  const handleSaveGoal = (goalId: string) => {
    setCareerGoalId(goalId);
    try { localStorage.setItem('pr_career_goal', goalId); } catch { /* noop */ }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0" style={{ background: '#0f172a' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
          {graphicsConfig.enableMeshGradient && (
            <SafeMeshGradient
              className="w-full h-full"
              colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
              speed={graphicsConfig.meshGradientSpeed}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
          <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-sky-400 rounded-full animate-spin" />
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Loading career data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* ── BACKGROUND: Portal 2 MeshGradient ── */}
      <div className="fixed inset-0 z-0" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
        {graphicsConfig.enableMeshGradient && (
          <SafeMeshGradient
            className="w-full h-full"
            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
            speed={graphicsConfig.meshGradientSpeed}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Verification
        </button>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-sky-400" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-sky-400">Career Progress Dashboard</span>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto pt-4"
        >
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight">Career Progress</h1>
            <p className="text-sm text-white/50 mt-1">Track your pathway to airline readiness</p>
          </div>

          {/* Career Alignment Card */}
          {(() => {
            const pathway = careerGoalId ? (() => {
              const pathways = [
                { id: 'regional-fo', title: 'First Officer — Regional Airline', description: 'Entry-level airline position. Fly regional routes for carriers like SkyWest, Republic, or Envoy.', icon: '✈️', category: 'airline', minHours: 1500, minPIC: 250, requiredLicenses: ['CPL','IR'], requiredRatings: ['ME'], medicalClass: 'Class 1', englishLevel: 'Level 4+', avgSalaryRange: '$45K – $75K/year', timeToAchieve: '1–3 years from CPL' },
                { id: 'major-fo', title: 'First Officer — Major/National Airline', description: 'National carriers like Delta, United, American. Requires more competitive hours and ATPL frozen.', icon: '✈️', category: 'airline', minHours: 1500, minPIC: 500, requiredLicenses: ['CPL','IR','ATPL Frozen'], requiredRatings: ['ME','Jet Type Rating'], medicalClass: 'Class 1', englishLevel: 'Level 5+', avgSalaryRange: '$80K – $120K/year', timeToAchieve: '3–6 years from CPL' },
                { id: 'lcc-fo', title: 'First Officer — Low Cost Carrier', description: 'Southwest, JetBlue, Spirit. Fast growth potential, often direct from regional carriers.', icon: '⚡', category: 'airline', minHours: 1500, minPIC: 500, requiredLicenses: ['CPL','IR'], requiredRatings: ['ME'], medicalClass: 'Class 1', englishLevel: 'Level 4+', avgSalaryRange: '$60K – $100K/year', timeToAchieve: '2–4 years from CPL' },
                { id: 'corporate', title: 'Corporate Pilot — Business Aviation', description: 'Fly Gulfstream, Falcon, or Citation for private clients or corporations. Premium lifestyle.', icon: '💼', category: 'corporate', minHours: 2500, minPIC: 500, requiredLicenses: ['CPL','IR','ATPL'], requiredRatings: ['ME','Jet Type Rating'], medicalClass: 'Class 1', englishLevel: 'Level 5+', avgSalaryRange: '$80K – $200K/year', timeToAchieve: '4–8 years from CPL' },
                { id: 'cargo', title: 'Cargo Pilot — FedEx / UPS / Atlas', description: 'Fly freight worldwide. UPS and FedEx are top-tier employers with strong benefits.', icon: '📦', category: 'cargo', minHours: 1500, minPIC: 500, requiredLicenses: ['CPL','IR','ATPL Frozen'], requiredRatings: ['ME'], medicalClass: 'Class 1', englishLevel: 'Level 4+', avgSalaryRange: '$70K – $150K/year', timeToAchieve: '3–6 years from CPL' },
                { id: 'cfi', title: 'Flight Instructor — Build Hours', description: 'Teach the next generation while building PIC hours toward airline minimums.', icon: '🎓', category: 'instruction', minHours: 200, minPIC: 0, requiredLicenses: ['CPL','CFI'], requiredRatings: ['MEI','II'], medicalClass: 'Class 2', englishLevel: 'Level 4+', avgSalaryRange: '$30K – $55K/year', timeToAchieve: 'Immediate after CFI' },
                { id: 'charter', title: 'Charter / Fractional Pilot', description: 'NetJets, Flexjet, or charter operators. Mix of scheduled and on-demand flying.', icon: '🚁', category: 'charter', minHours: 1500, minPIC: 500, requiredLicenses: ['CPL','IR'], requiredRatings: ['ME'], medicalClass: 'Class 1', englishLevel: 'Level 4+', avgSalaryRange: '$65K – $120K/year', timeToAchieve: '2–5 years from CPL' },
                { id: 'helicopter', title: 'Commercial Helicopter Pilot', description: 'EMS, tours, offshore oil, or utility work. Different pathway entirely.', icon: '🚁', category: 'specialized', minHours: 200, minPIC: 0, requiredLicenses: ['CPL (Helicopter)'], requiredRatings: ['Helicopter Type Rating'], medicalClass: 'Class 2', englishLevel: 'Level 4+', avgSalaryRange: '$50K – $90K/year', timeToAchieve: '1–2 years from PPL(H)' },
              ];
              return pathways.find((p) => p.id === careerGoalId);
            })() : null;

            const progress = pathway ? analyzeGapForCard(profileData, pathway) : 0;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 rounded-2xl p-5 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                onClick={() => setShowGoalSettings(true)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-sky-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">Career Alignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pathway && (
                      <span className={`text-[10px] font-black uppercase tracking-wider ${progress === 100 ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {progress}% Ready
                      </span>
                    )}
                    <Pencil size={12} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>

                {pathway ? (
                  <>
                    <h3 className="text-lg font-black text-white mb-1">{pathway.title}</h3>
                    <p className="text-xs text-white/50 mb-3">{pathway.description}</p>

                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <TrendingUp size={12} /> {pathway.avgSalaryRange}
                      </span>
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <Clock size={12} /> {pathway.timeToAchieve}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: progress === 100
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : progress >= 50
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #ef4444, #f87171)',
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-[11px] text-sky-400 font-medium">
                      <span>Edit career goal</span>
                      <ArrowRight size={12} />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                      <Target size={18} className="text-white/30" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">No career goal set</p>
                    <p className="text-xs text-white/40 mb-3">Select your target pathway to unlock personalized progress tracking</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-medium">
                      Choose your mission <ArrowRight size={12} />
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* Pathway Progress Tracker */}
          <React.Suspense fallback={null}>
            <PathwayProgressTracker
              profile={profileData}
              onNavigate={(page) => navigate(`/${page}`)}
            />
          </React.Suspense>
        </motion.div>
      </main>

      {/* Career Goal Settings Modal */}
      <React.Suspense fallback={null}>
        <CareerGoalSettings
          isOpen={showGoalSettings}
          onClose={() => setShowGoalSettings(false)}
          profile={profileData}
          currentGoalId={careerGoalId}
          onSave={handleSaveGoal}
        />
      </React.Suspense>
    </div>
  );
};

export default CareerProgressDashboard;
