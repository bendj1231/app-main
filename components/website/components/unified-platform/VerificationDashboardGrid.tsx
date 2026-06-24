import React from 'react';
import { Shield, Info, TrendingUp, ArrowRight } from 'lucide-react';
import type { TabId } from './types';

interface VerificationDashboardGridProps {
  profile: any;
  setTab: (tab: TabId) => void;
}

export const VerificationDashboardGrid: React.FC<VerificationDashboardGridProps> = ({ profile, setTab }) => {
  const explicitEndorsements = profile?.endorsements || {};
  const explicitRecency = profile?.endorsement_recency || {};
  const hasExplicit = Object.values(explicitEndorsements).some(Boolean);

  const ratingsRaw = profile?.ratings || profile?.license_types || [];
  const ratings = Array.isArray(ratingsRaw) ? ratingsRaw.map((r: any) => String(r).toLowerCase()) : [];
  const allText = [
    profile?.current_occupation,
    profile?.pilot_stage,
    profile?.license_type,
    profile?.current_level,
    Array.isArray(profile?.license_types) ? profile.license_types.join(' ') : '',
    Array.isArray(profile?.ratings) ? profile.ratings.join(' ') : '',
  ].join(' ').toLowerCase();
  const allTokens = allText.split(/[\s,;./()]+/).filter(Boolean);

  const hasRating = (terms: string[]) => terms.some(t => {
    if (ratings.includes(t)) return true;
    const termTokens = t.split(/\s+/).filter(Boolean);
    return termTokens.length > 0 && termTokens.every(token => allTokens.includes(token));
  });

  const isPlus = profile?.subscription_tier === 'plus' || profile?.subscription_tier === 'enterprise';

  const statusBadge = (has: boolean, recency?: number | null) => {
    if (!has) return { label: 'NOT VERIFIED', color: '#6b7280' };
    if (recency === null || recency === undefined) return { label: 'VALID', color: '#16a34a' };
    if (recency <= 0) return { label: 'EXPIRED', color: '#dc2626' };
    if (recency <= 30) return { label: 'EXPIRING SOON', color: '#d97706' };
    if (recency <= 90) return { label: 'RECURRENCY VALID', color: '#2563eb' };
    return { label: 'VALID', color: '#16a34a' };
  };

  const recencyDays = (field?: string, explicitKey?: string) => {
    if (explicitKey && explicitRecency[explicitKey]) {
      const days = Math.ceil((Date.now() - new Date(explicitRecency[explicitKey]).getTime()) / (1000 * 60 * 60 * 24));
      return days;
    }
    const val = field ? profile?.[field] : null;
    if (!val) return null;
    const days = Math.ceil((Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const recognitionBanner = (feature: string) => (
    <div className="mt-4 rounded-xl p-3 text-center" style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <p className="text-[10px] font-black text-white/80 leading-relaxed">
        <span className="text-white">Pilot</span>
        <span style={{ color: '#dc2626' }}>Recognition+</span> unlocks {feature}.
      </p>
    </div>
  );

  const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black tracking-wider uppercase text-white/70">{title}</span>
        <div className="group relative">
          <Info size={12} className="text-white/30 cursor-help" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 text-[9px] font-bold text-white bg-slate-900 rounded-lg p-2 border border-white/10 z-20">
            {description}
          </span>
        </div>
      </div>
      {children}
    </div>
  );

  const ItemRow: React.FC<{ label: string; description: string; has: boolean; recency: number | null }> = ({ label, description, has, recency }) => {
    const { label: status, color } = statusBadge(has, recency);
    const recencyText = recency === null ? null : recency <= 0 ? 'Expired' : recency <= 30 ? `${recency} days to expiry` : recency <= 90 ? `${recency} days since recurrency` : `${recency} days current`;
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <p className="text-[11px] font-bold text-white">{label}</p>
          <p className="text-[9px] text-white/40 mt-0.5">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-black px-2 py-0.5 rounded block" style={{ background: `${color}20`, color }}>{status}</span>
          {recencyText && <span className="text-[8px] text-white/40 mt-0.5 block">{recencyText}</span>}
        </div>
      </div>
    );
  };

  // Items only render if explicitly selected in the advanced profile form (or detected via text scan as fallback)
  const shouldShow = (key: string, terms: string[]) => {
    if (explicitEndorsements[key] === true) return true;
    if (hasExplicit) return false; // if user has set explicit endorsements, don't show undetected ones
    return hasRating(terms);
  };

  const licenseItems = [
    { key: 'firstOfficer', label: 'First Officer Endorsement', desc: 'Qualified to operate as second-in-command on multi-crew aircraft.', terms: ['first officer', 'fo'], field: 'fo_endorsement_recency' },
    { key: 'captain', label: 'Captain Endorsement', desc: 'Qualified to act as pilot-in-command and carry final authority.', terms: ['captain', 'cpt'], field: 'captain_endorsement_recency' },
  ];
  const aircraftItems = [
    { key: 'highPerformance', label: 'High Performance', desc: 'Aircraft with more than 200 hp per engine.', terms: ['high performance', 'hp'], field: 'high_performance_recency' },
    { key: 'complexAircraft', label: 'Complex Aircraft', desc: 'Retractable gear, flaps, and controllable-pitch propeller.', terms: ['complex'], field: 'complex_recency' },
    { key: 'tailwheel', label: 'Tailwheel', desc: 'Conventional-gear aircraft requiring a tailwheel endorsement.', terms: ['tailwheel'], field: 'tailwheel_recency' },
    { key: 'aerobatic', label: 'Aerobatic', desc: 'Flight manoeuvres beyond normal flight such as spins and rolls.', terms: ['aerobatic'], field: 'aerobatic_recency' },
    { key: 'seaplane', label: 'Float / Seaplane', desc: 'Take-off and landing on water.', terms: ['seaplane', 'float'], field: 'seaplane_recency' },
  ];
  const approachItems = [
    { key: 'catI', label: 'CAT I', desc: 'Standard precision approach down to 200 ft decision height.', terms: ['cat i', 'cat 1', 'category i'], field: 'cat_i_recency' },
    { key: 'catII', label: 'CAT II', desc: 'Autoland or guided approach down to 100 ft decision height.', terms: ['cat ii', 'cat 2', 'category ii'], field: 'cat_ii_recency' },
    { key: 'catIII', label: 'CAT III', desc: 'Zero-visibility autoland operations.', terms: ['cat iii', 'cat 3', 'category iii'], field: 'cat_iii_recency' },
  ];

  const visibleLicense = licenseItems.filter(i => shouldShow(i.key, i.terms));
  const visibleAircraft = aircraftItems.filter(i => shouldShow(i.key, i.terms));
  const visibleApproach = approachItems.filter(i => shouldShow(i.key, i.terms));

  return (
    <>
      {/* Licenses and Ratings Validity */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-sky-400" />
          <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Licenses and Ratings Validity</span>
        </div>

        {visibleLicense.length > 0 && (
          <Section title="License Endorsements" description="Job-role authorizations that show whether you are qualified to act as First Officer or Captain.">
            <div className="space-y-2">
              {visibleLicense.map(i => (
                <ItemRow key={i.key} label={i.label} description={i.desc} has={shouldShow(i.key, i.terms)} recency={recencyDays(i.field, i.key)} />
              ))}
            </div>
          </Section>
        )}

        {visibleAircraft.length > 0 && (
          <Section title="Aircraft Type Ratings" description="Specific aircraft operating privileges, including high-performance, complex, tailwheel, aerobatic, and seaplane.">
            <div className="space-y-2">
              {visibleAircraft.map(i => (
                <ItemRow key={i.key} label={i.label} description={i.desc} has={shouldShow(i.key, i.terms)} recency={recencyDays(i.field, i.key)} />
              ))}
            </div>
          </Section>
        )}

        {visibleApproach.length > 0 && (
          <Section title="Instrument Approach Authorizations" description="Low-visibility landing categories that determine the minimums you can fly to.">
            <div className="space-y-2">
              {visibleApproach.map(i => (
                <ItemRow key={i.key} label={i.label} description={i.desc} has={shouldShow(i.key, i.terms)} recency={recencyDays(i.field, i.key)} />
              ))}
            </div>
          </Section>
        )}

        {visibleLicense.length === 0 && visibleAircraft.length === 0 && visibleApproach.length === 0 && (
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[11px] font-bold text-white/50">No endorsements or ratings added yet.</p>
            <p className="text-[10px] text-white/30 mt-1">Complete your advanced profile to add license endorsements, aircraft type ratings, and approach authorizations.</p>
            <button
              onClick={() => setTab('advanced-profile')}
              className="mt-3 px-4 py-2 rounded-lg text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
            >
              ADD ENDORSEMENTS
            </button>
          </div>
        )}

        {!isPlus && recognitionBanner('full license and ratings validity tracking, recency alerts, and automatic renewal reminders')}
      </div>

      {/* Visibility maximizer banner */}
      <div className="mt-6 rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', border: '1px solid rgba(59,130,246,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-white/80" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/80">Maximize Your Visibility</span>
            </div>
            <p className="text-base font-black leading-snug" style={{ color: '#ffffff' }}>
              Complete your <span style={{ color: '#dc2626' }}>advanced profile</span> to ensure no <span style={{ color: '#dc2626' }}>qualification</span> goes un-noticed while undergoing verification.
            </p>
          </div>
          <button
            onClick={() => setTab('advanced-profile')}
            className="px-5 py-2.5 rounded-xl text-xs font-black tracking-wider text-white transition-all hover:brightness-110 flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            COMPLETE PROFILE <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default VerificationDashboardGrid;
