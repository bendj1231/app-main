import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Target, Plane, Briefcase, TrendingUp, Clock,
  Award, MapPin, DollarSign, ChevronRight, Check,
  AlertTriangle, Shield, Zap, GraduationCap
} from 'lucide-react';

// ─── CAREER PATHWAY DEFINITIONS ─────────────────────────────────────────────
export interface CareerPathway {
  id: string;
  title: string;
  category: 'airline' | 'corporate' | 'cargo' | 'charter' | 'instruction' | 'specialized';
  icon: React.ReactNode;
  description: string;
  minHours: number;
  minPIC: number;
  requiredLicenses: string[];
  requiredRatings: string[];
  medicalClass: 'Class 1' | 'Class 2';
  englishLevel: string;
  avgSalaryRange: string;
  timeToAchieve: string;
  airlines?: string[];
}

export const CAREER_PATHWAYS: CareerPathway[] = [
  {
    id: 'regional-fo',
    title: 'First Officer — Regional Airline',
    category: 'airline',
    icon: <Plane size={20} />,
    description: 'Entry-level airline position. Fly regional routes for carriers like SkyWest, Republic, or Envoy.',
    minHours: 1500,
    minPIC: 250,
    requiredLicenses: ['CPL', 'IR'],
    requiredRatings: ['ME'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$45K – $75K/year',
    timeToAchieve: '1–3 years from CPL',
    airlines: ['SkyWest', 'Republic', 'Envoy', 'Piedmont', 'PSA'],
  },
  {
    id: 'major-fo',
    title: 'First Officer — Major/National Airline',
    category: 'airline',
    icon: <Plane size={20} />,
    description: 'National carriers like Delta, United, American. Requires more competitive hours.',
    minHours: 1500,
    minPIC: 500,
    requiredLicenses: ['CPL', 'IR', 'ATPL Frozen'],
    requiredRatings: ['ME', 'Jet Type Rating'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 5+',
    avgSalaryRange: '$80K – $120K/year',
    timeToAchieve: '3–6 years from CPL',
    airlines: ['Delta', 'United', 'American', 'Alaska', 'Hawaiian'],
  },
  {
    id: 'lcc-fo',
    title: 'First Officer — Low Cost Carrier',
    category: 'airline',
    icon: <Zap size={20} />,
    description: 'Southwest, JetBlue, Spirit. Fast growth potential, often direct from regional.',
    minHours: 1500,
    minPIC: 500,
    requiredLicenses: ['CPL', 'IR'],
    requiredRatings: ['ME'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$60K – $100K/year',
    timeToAchieve: '2–4 years from CPL',
    airlines: ['Southwest', 'JetBlue', 'Spirit', 'Frontier', 'Allegiant'],
  },
  {
    id: 'corporate',
    title: 'Corporate Pilot — Business Aviation',
    category: 'corporate',
    icon: <Briefcase size={20} />,
    description: 'Fly Gulfstream, Falcon, or Citation for private clients or corporations.',
    minHours: 2500,
    minPIC: 500,
    requiredLicenses: ['CPL', 'IR', 'ATPL'],
    requiredRatings: ['ME', 'Jet Type Rating'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 5+',
    avgSalaryRange: '$80K – $200K/year',
    timeToAchieve: '4–8 years from CPL',
  },
  {
    id: 'cargo',
    title: 'Cargo Pilot — FedEx / UPS / Atlas',
    category: 'cargo',
    icon: <TrendingUp size={20} />,
    description: 'Fly freight worldwide. UPS and FedEx are top-tier employers with strong benefits.',
    minHours: 1500,
    minPIC: 500,
    requiredLicenses: ['CPL', 'IR', 'ATPL Frozen'],
    requiredRatings: ['ME'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$70K – $150K/year',
    timeToAchieve: '3–6 years from CPL',
    airlines: ['FedEx', 'UPS', 'Atlas Air', 'DHL', 'Kalitta'],
  },
  {
    id: 'cfi',
    title: 'Flight Instructor — Build Hours',
    category: 'instruction',
    icon: <GraduationCap size={20} />,
    description: 'Teach the next generation while building PIC hours toward airline minimums.',
    minHours: 200,
    minPIC: 0,
    requiredLicenses: ['CPL', 'CFI'],
    requiredRatings: ['MEI', 'II'],
    medicalClass: 'Class 2',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$30K – $55K/year',
    timeToAchieve: 'Immediate after CFI',
  },
  {
    id: 'charter',
    title: 'Charter / Fractional Pilot',
    category: 'charter',
    icon: <MapPin size={20} />,
    description: 'NetJets, Flexjet, or charter operators. Mix of scheduled and on-demand flying.',
    minHours: 1500,
    minPIC: 500,
    requiredLicenses: ['CPL', 'IR'],
    requiredRatings: ['ME'],
    medicalClass: 'Class 1',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$65K – $120K/year',
    timeToAchieve: '2–5 years from CPL',
    airlines: ['NetJets', 'Flexjet', 'PlaneSense', 'Airshare'],
  },
  {
    id: 'helicopter',
    title: 'Commercial Helicopter Pilot',
    category: 'specialized',
    icon: <Shield size={20} />,
    description: 'EMS, tours, offshore oil, or utility work. Different pathway entirely.',
    minHours: 200,
    minPIC: 0,
    requiredLicenses: ['CPL (Helicopter)'],
    requiredRatings: ['Helicopter Type Rating'],
    medicalClass: 'Class 2',
    englishLevel: 'Level 4+',
    avgSalaryRange: '$50K – $90K/year',
    timeToAchieve: '1–2 years from PPL(H)',
  },
];

// ─── GAP ANALYSIS ENGINE ────────────────────────────────────────────────────
export function analyzeCareerGap(profile: any, pathway: CareerPathway) {
  const totalHours = (profile?.total_flight_hours ?? 0) as number;
  const picHours = (profile?.pic_hours ?? profile?.total_pic_hours ?? 0) as number;
  const userLicenses = ((profile?.licenses ?? profile?.license_type ?? '') as string)
    .split(',').map((s: string) => s.trim().toUpperCase());
  const userRatings = ((profile?.ratings ?? profile?.type_ratings ?? '') as string)
    .split(',').map((s: string) => s.trim().toUpperCase());
  const medical = (profile?.medical_class ?? '') as string;
  const english = (profile?.english_proficiency ?? '') as string;

  const gaps: { label: string; status: 'complete' | 'partial' | 'missing'; detail: string }[] = [];

  // Hours gap
  const hoursShort = Math.max(0, pathway.minHours - totalHours);
  gaps.push({
    label: 'Total Flight Hours',
    status: hoursShort === 0 ? 'complete' : 'missing',
    detail: hoursShort === 0
      ? `${totalHours} hrs ✓`
      : `${totalHours} / ${pathway.minHours} hrs — need ${hoursShort} more`,
  });

  // PIC gap
  const picShort = Math.max(0, pathway.minPIC - picHours);
  gaps.push({
    label: 'PIC Hours',
    status: picShort === 0 ? 'complete' : 'missing',
    detail: picShort === 0
      ? `${picHours} hrs ✓`
      : `${picHours} / ${pathway.minPIC} hrs — need ${picShort} more`,
  });

  // License gap
  const missingLicenses = pathway.requiredLicenses.filter(
    (lic) => !userLicenses.some((ul: string) => ul.includes(lic.replace(' ', '')))
  );
  gaps.push({
    label: 'Required Licenses',
    status: missingLicenses.length === 0 ? 'complete' : 'missing',
    detail: missingLicenses.length === 0
      ? 'All required licenses held ✓'
      : `Missing: ${missingLicenses.join(', ')}`,
  });

  // Rating gap
  const missingRatings = pathway.requiredRatings.filter(
    (rat) => !userRatings.some((ur: string) => ur.includes(rat.replace(' ', '')))
  );
  gaps.push({
    label: 'Required Ratings',
    status: missingRatings.length === 0 ? 'complete' : missingRatings.length < pathway.requiredRatings.length ? 'partial' : 'missing',
    detail: missingRatings.length === 0
      ? 'All required ratings held ✓'
      : `Missing: ${missingRatings.join(', ')}`,
  });

  // Medical
  const medOk = medical.includes(pathway.medicalClass) || (pathway.medicalClass === 'Class 2' && medical.includes('Class 1'));
  gaps.push({
    label: 'Medical Certificate',
    status: medOk ? 'complete' : 'missing',
    detail: medOk ? `${medical} ✓` : `Need ${pathway.medicalClass} (current: ${medical || 'None'})`,
  });

  // English
  const engOk = english.includes('5') || english.includes('6') || (pathway.englishLevel === 'Level 4+' && english.includes('4'));
  gaps.push({
    label: 'English Proficiency',
    status: engOk ? 'complete' : 'missing',
    detail: engOk ? `${english} ✓` : `Need ${pathway.englishLevel} (current: ${english || 'None'})`,
  });

  const complete = gaps.filter((g) => g.status === 'complete').length;
  const progress = Math.round((complete / gaps.length) * 100);

  return { gaps, progress, ready: progress === 100 };
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────
interface CareerGoalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  currentGoalId?: string;
  onSave: (goalId: string) => void;
}

export const CareerGoalSettings: React.FC<CareerGoalSettingsProps> = ({
  isOpen,
  onClose,
  profile,
  currentGoalId,
  onSave,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentGoalId ?? '');
  const [stage, setStage] = useState<'select' | 'detail'>('select');

  const selectedPathway = useMemo(
    () => CAREER_PATHWAYS.find((p) => p.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentGoalId ?? '');
      setStage('select');
    }
  }, [isOpen, currentGoalId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setStage('detail');
  };

  const handleSave = () => {
    if (selectedId) {
      onSave(selectedId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10"
              style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <Target size={16} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white tracking-wide">Career Alignment</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Select your mission goal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {stage === 'select' ? (
                <>
                  <p className="text-sm text-white/60 mb-6">
                    Choose your target career pathway. We'll analyze your profile and show exactly what's needed to get there.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CAREER_PATHWAYS.map((pathway) => {
                      const { progress } = analyzeCareerGap(profile, pathway);
                      const isSelected = selectedId === pathway.id;

                      return (
                        <motion.button
                          key={pathway.id}
                          onClick={() => handleSelect(pathway.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="relative text-left rounded-xl p-4 transition-all border"
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(30,41,59,0.5))'
                              : 'rgba(255,255,255,0.03)',
                            borderColor: isSelected ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}
                            >
                              <span className="text-sky-400">{pathway.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-white truncate">{pathway.title}</h3>
                              <p className="text-[11px] text-white/40 mt-1 line-clamp-2">{pathway.description}</p>

                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] text-white/30 flex items-center gap-1">
                                  <Clock size={10} /> {pathway.timeToAchieve}
                                </span>
                                <span className="text-[10px] text-white/30 flex items-center gap-1">
                                  <DollarSign size={10} /> {pathway.avgSalaryRange}
                                </span>
                              </div>

                              {/* Progress mini-bar */}
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-[10px] mb-1">
                                  <span className="text-white/30">Profile match</span>
                                  <span className={progress === 100 ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-red-400'}>
                                    {progress}%
                                  </span>
                                </div>
                                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full rounded-full"
                                    style={{
                                      background: progress === 100
                                        ? '#10b981'
                                        : progress >= 50
                                          ? '#f59e0b'
                                          : '#ef4444',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <ChevronRight size={16} className="text-white/20 flex-shrink-0 self-center" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                selectedPathway && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Back to selection */}
                    <button
                      onClick={() => setStage('select')}
                      className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors mb-4 flex items-center gap-1"
                    >
                      ← Back to pathways
                    </button>

                    {/* Detail header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}
                      >
                        <span className="text-sky-400">{selectedPathway.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{selectedPathway.title}</h3>
                        <p className="text-sm text-white/50 mt-1">{selectedPathway.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Award size={12} className="text-sky-400" /> {selectedPathway.avgSalaryRange}
                          </span>
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Clock size={12} className="text-sky-400" /> {selectedPathway.timeToAchieve}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gap analysis */}
                    {(() => {
                      const { gaps, progress, ready } = analyzeCareerGap(profile, selectedPathway);
                      return (
                        <>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-white/70">Readiness</span>
                              <span className={`text-xs font-black ${ready ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {ready ? 'READY TO APPLY' : `${progress}% COMPLETE`}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full"
                                style={{
                                  background: ready
                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                    : progress >= 50
                                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            {gaps.map((gap) => (
                              <div
                                key={gap.label}
                                className="flex items-center justify-between rounded-lg px-3 py-2.5"
                                style={{
                                  background: gap.status === 'complete'
                                    ? 'rgba(16,185,129,0.08)'
                                    : gap.status === 'partial'
                                      ? 'rgba(245,158,11,0.08)'
                                      : 'rgba(239,68,68,0.08)',
                                  border: `1px solid ${gap.status === 'complete'
                                    ? 'rgba(16,185,129,0.2)'
                                    : gap.status === 'partial'
                                      ? 'rgba(245,158,11,0.2)'
                                      : 'rgba(239,68,68,0.2)'}`,
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {gap.status === 'complete' ? (
                                    <Check size={14} className="text-emerald-400" />
                                  ) : (
                                    <AlertTriangle size={14} className={gap.status === 'partial' ? 'text-amber-400' : 'text-red-400'} />
                                  )}
                                  <span className="text-xs font-medium text-white/80">{gap.label}</span>
                                </div>
                                <span className={`text-[11px] ${gap.status === 'complete' ? 'text-emerald-400' : gap.status === 'partial' ? 'text-amber-400' : 'text-red-400'}`}>
                                  {gap.detail}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}

                    {/* Airlines */}
                    {selectedPathway.airlines && (
                      <div className="mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Target Airlines</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathway.airlines.map((airline) => (
                            <span
                              key={airline}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white/60"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              {airline}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Set as goal button */}
                    <button
                      onClick={handleSave}
                      className="w-full py-3 rounded-xl text-sm font-black tracking-wider uppercase text-white transition-all hover:brightness-110"
                      style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                        boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                      }}
                    >
                      Set as Career Goal
                    </button>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CareerGoalSettings;
