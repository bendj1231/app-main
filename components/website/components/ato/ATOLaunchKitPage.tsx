import React, { useState } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, DollarSign,
  TrendingUp, Users, Award, Shield, Zap, Globe, BarChart3,
  GraduationCap, Plane, Target, Clock, ArrowRight, Star,
  Building2, FileText, Lock, Cpu, AlertCircle, BookOpen
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const dark: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0b1120',
  color: '#ffffff',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  overflowX: 'hidden',
};

const card: React.CSSProperties = {
  background: 'rgba(15,23,42,0.85)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
};

const accent = '#10b981';
const accentBlue = '#0ea5e9';
const accentAmber = '#f59e0b';
const muted = '#94a3b8';
const subtle = 'rgba(255,255,255,0.04)';

const sectionTitle: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: 800,
  marginBottom: '0.4rem',
  letterSpacing: '-0.02em',
};

const sectionSub: React.CSSProperties = {
  color: muted,
  fontSize: '0.9rem',
  marginBottom: '2rem',
  maxWidth: 540,
  lineHeight: 1.6,
};

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  background: color + '22',
  color: color,
  border: `1px solid ${color}44`,
  borderRadius: '999px',
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '0.2rem 0.6rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
});

// ─── ROI CALCULATOR ────────────────────────────────────────────────────────────
function ROICalculator() {
  const [students, setStudents] = useState(40);
  const [placementRate, setPlacementRate] = useState(60);

  const subscriptionCost = 1000;
  const verificationRevenue = students * 0.05 * 99;
  const placedPilots = Math.round(students * (placementRate / 100));
  const successFeeRevenue = placedPilots * 500;
  const recruitmentSaved = placedPilots * 3200;
  const totalReturn = verificationRevenue + successFeeRevenue + recruitmentSaved;
  const roi = ((totalReturn - subscriptionCost) / subscriptionCost) * 100;

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: accent,
    cursor: 'pointer',
  };

  const metricCard = (label: string, value: string, color: string, sub?: string): React.CSSProperties => ({});

  return (
    <div style={{ ...card, background: 'rgba(16,185,129,0.06)', border: `1px solid ${accent}33` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <BarChart3 size={18} color={accent} />
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Enterprise ROI Calculator</span>
        <span style={{ ...badge(accent) }}>Live</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: muted, fontWeight: 600, marginBottom: '0.5rem' }}>
            Enrolled Students: <span style={{ color: accent }}>{students}</span>
          </label>
          <input type="range" min={10} max={200} value={students}
            onChange={e => setStudents(Number(e.target.value))} style={sliderStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: muted, fontWeight: 600, marginBottom: '0.5rem' }}>
            Placement Rate: <span style={{ color: accentBlue }}>{placementRate}%</span>
          </label>
          <input type="range" min={10} max={100} value={placementRate}
            onChange={e => setPlacementRate(Number(e.target.value))} style={sliderStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Verification Kickback', value: `$${verificationRevenue.toFixed(0)}`, color: accent, sub: `${students} students × 5% of $99` },
          { label: 'Placement Success Fees', value: `$${successFeeRevenue.toLocaleString()}`, color: accentBlue, sub: `${placedPilots} pilots × $500` },
          { label: 'Recruitment Cost Saved', value: `$${recruitmentSaved.toLocaleString()}`, color: accentAmber, sub: `${placedPilots} pilots × $3,200 avg` },
          { label: 'Total Annual Return', value: `$${totalReturn.toLocaleString()}`, color: '#a78bfa', sub: `vs $1,000 subscription` },
        ].map(m => (
          <div key={m.label} style={{ ...card, padding: '0.9rem', background: subtle }}>
            <div style={{ fontSize: '0.7rem', color: muted, fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: muted, marginTop: '0.2rem' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: `${accent}11`, border: `1px solid ${accent}33`, borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: muted }}>Your $1,000 subscription generates</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: accent }}>{roi > 0 ? `+${Math.round(roi)}%` : `${Math.round(roi)}%`} ROI</span>
      </div>
    </div>
  );
}

// ─── FAQ ACCORDION ─────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, padding: '0.25rem 0' }}
      >
        {q}
        {open ? <ChevronUp size={16} color={muted} /> : <ChevronDown size={16} color={muted} />}
      </button>
      {open && <p style={{ fontSize: '0.8rem', color: muted, marginTop: '0.5rem', lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

// ─── COMPARISON TABLE ──────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { metric: 'Pilot Visibility to Airlines', whiteboard: 'Word of mouth + LinkedIn', trust: 'Verified cryptographic token — airline-discoverable' },
    { metric: 'Graduate Hour Verification', whiteboard: 'Paper logbook (unverified)', trust: 'Verified hours issued as digital credential' },
    { metric: 'Placement Tracking', whiteboard: 'Manual spreadsheet or nothing', trust: 'Real-time placement rate on public ATO profile' },
    { metric: 'Liability on Training Records', whiteboard: 'Academy bears full risk', trust: 'Hash-anchored — tamper-evident, defensible' },
    { metric: 'Revenue from Alumni', whiteboard: '$0 after graduation', trust: '5% kickback on every verification check' },
    { metric: 'Airline Recruitment Cost', whiteboard: 'Airline pays ~$3,200 per hire', trust: 'Airlines pull pre-verified — cost drops 80%' },
    { metric: 'Student Confidence at Interview', whiteboard: 'Unprepared. No signal.', trust: 'EBT-scored video + Recognition Profile submitted' },
    { metric: 'ATO Differentiation', whiteboard: 'CAAP certificate only', trust: '"Recognition-Ready" designation. Visible on Pathways.' },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', color: muted, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Metric</th>
            <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', color: '#ef4444', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Whiteboard Model</th>
            <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', color: accent, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trust Layer (Enterprise)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? subtle : 'transparent' }}>
              <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{r.metric}</td>
              <td style={{ padding: '0.6rem 0.8rem', color: '#f87171' }}>{r.whiteboard}</td>
              <td style={{ padding: '0.6rem 0.8rem', color: '#6ee7b7' }}>{r.trust}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export function ATOLaunchKitPage({ onBack, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'pitch' | 'onepager' | 'comparison' | 'parentfaq' | 'next'>('pitch');

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'pitch', label: 'Pitch Deck' },
    { key: 'onepager', label: 'One-Pager' },
    { key: 'comparison', label: 'ROI vs Whiteboard' },
    { key: 'parentfaq', label: 'Parent FAQ' },
    { key: 'next', label: 'Next Steps' },
  ];

  return (
    <div style={dark}>
      {/* Header */}
      <div style={{ background: 'rgba(16,185,129,0.06)', borderBottom: '1px solid rgba(16,185,129,0.15)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GraduationCap size={18} color={accent} />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>B2B Flight School Launch Kit</span>
            <span style={{ ...badge(accent) }}>Founding ATO Offer</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: muted, marginTop: '0.2rem' }}>Close your first 5 academies. Letters of intent this week.</div>
        </div>
        <button
          onClick={() => onNavigate('ato-register')}
          style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '0.55rem 1.1rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Register Academy →
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', padding: '1rem 1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              background: activeTab === t.key ? `${accent}22` : 'none',
              border: activeTab === t.key ? `1px solid ${accent}44` : '1px solid transparent',
              borderRadius: '8px 8px 0 0',
              color: activeTab === t.key ? accent : muted,
              padding: '0.45rem 0.9rem',
              fontSize: '0.78rem',
              fontWeight: activeTab === t.key ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>

        {/* ── PITCH DECK ── */}
        {activeTab === 'pitch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Slide 1: Problem */}
            <div style={{ ...card, background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(15,23,42,0.9) 60%)' }}>
              <div style={{ ...badge('#ef4444'), marginBottom: '0.75rem' }}>Slide 1 — The Problem</div>
              <h2 style={{ ...sectionTitle, color: '#f87171' }}>The Pipeline is Clogged.</h2>
              <p style={{ ...sectionSub }}>
                A pilot graduates with 200 hours, $50,000 invested, and a CPL that means nothing to any airline. They were promised a pathway. The pathway doesn't exist. They wait. 2–3 years. The Batch of 2015 is still waiting.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { floor: 'Floor 0', title: 'The Graduate', pain: '200 hrs. $50K spent. No airline. Line to instructor backed up 3 years.' },
                  { floor: 'Floor 1', title: 'The Instructor', pain: '6,000 hrs. 15 years. Stuck because nobody above is leaving.' },
                  { floor: 'Floor 2', title: 'The Recognition Gap', pain: 'The collapse point. Everyone fighting for pathways they can\'t find.' },
                  { floor: 'Floor 3', title: 'The Airline Pilot', pain: 'Seniority trap. Captain going back to First Officer. Can\'t move.' },
                ].map(f => (
                  <div key={f.floor} style={{ ...card, padding: '0.9rem', background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.floor}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.75rem', color: muted, lineHeight: 1.5 }}>{f.pain}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 2: What we built */}
            <div style={{ ...card }}>
              <div style={{ ...badge(accentBlue), marginBottom: '0.75rem' }}>Slide 2 — The Platform</div>
              <h2 style={{ ...sectionTitle }}>A Recognition Framework. Not a Job Board.</h2>
              <p style={{ ...sectionSub }}>
                PilotRecognition doesn't post jobs. It issues verifiable credentials, builds live profiles, and lets airlines pull from a pre-cleared pool. Your graduates become discoverable. Permanently.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { icon: <Target size={18} color={accentBlue} />, title: 'Pathway Cards', desc: 'Shows the pilot exactly what they\'re missing for each airline. Not a job listing. A gap map.' },
                  { icon: <Users size={18} color={accent} />, title: 'Pulling System', desc: 'Airlines pull from your graduates. Pilots don\'t push blind applications into a black hole.' },
                  { icon: <Shield size={18} color='#a78bfa' />, title: 'Live Profiles', desc: 'Updates as pilots log hours. No static CV. The profile speaks while the pilot flies.' },
                ].map(p => (
                  <div key={p.title} style={{ ...card, padding: '0.9rem', background: subtle }}>
                    <div style={{ marginBottom: '0.5rem' }}>{p.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: muted, lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 3: ATO Dual Role */}
            <div style={{ ...card, background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(15,23,42,0.9) 60%)' }}>
              <div style={{ ...badge(accent), marginBottom: '0.75rem' }}>Slide 3 — Your Role as an ATO</div>
              <h2 style={{ ...sectionTitle }}>You're Not Just a Customer. You're a Node.</h2>
              <p style={{ ...sectionSub }}>
                Enterprise ATOs operate as both Operators and Validators. You recruit verified instructors AND monetize your training records. Two revenue streams from one subscription.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ ...card, background: `${accent}09`, border: `1px solid ${accent}22` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <Building2 size={16} color={accent} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: accent }}>As Operator (Inbound)</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: muted, lineHeight: 2 }}>
                    <li>Post Instructor Pathways</li>
                    <li>Pull 6,000-hr CFIs and Check Airmen</li>
                    <li>Manage fleet liability through verified crew</li>
                    <li>Full enterprise recruitment dashboard</li>
                  </ul>
                </div>
                <div style={{ ...card, background: `${accentBlue}09`, border: `1px solid ${accentBlue}22` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <Award size={16} color={accentBlue} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: accentBlue }}>As Validator (Outbound)</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: muted, lineHeight: 2 }}>
                    <li>Verify alumni logbooks on-demand</li>
                    <li>Earn 5% on every verification check ($99)</li>
                    <li>Busy ATO = hundreds of checks per year</li>
                    <li>Subscription fully self-funds through kickbacks</li>
                  </ul>
                </div>
              </div>
              <div style={{ background: `${accent}11`, border: `1px solid ${accent}33`, borderRadius: 10, padding: '0.75rem 1rem', marginTop: '1rem', fontSize: '0.8rem', color: accent, fontWeight: 600, textAlign: 'center' }}>
                A busy ATO with 200 alumni verifications/year earns $990 — effectively free Enterprise tier.
              </div>
            </div>

            {/* Slide 4: ROI */}
            <div>
              <div style={{ ...badge(accentAmber), marginBottom: '0.75rem' }}>Slide 4 — The Numbers</div>
              <ROICalculator />
            </div>

            {/* Slide 5: Recognition-Ready Designation */}
            <div style={{ ...card }}>
              <div style={{ ...badge('#a78bfa'), marginBottom: '0.75rem' }}>Slide 5 — Competitive Differentiation</div>
              <h2 style={{ ...sectionTitle }}>Your Graduates Become Airline-Discoverable.</h2>
              <p style={{ ...sectionSub }}>
                "Recognition-Ready" designation appears on your public ATO profile. Airlines see your placement rate. Your graduates show up in airline pull queries. Other academies don't.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { icon: <Lock size={16} color='#a78bfa' />, title: 'Recognition-Ready Badge', desc: 'Visible on PilotRecognition Pathways page. Airlines filter by Recognition-Ready academies first.' },
                  { icon: <Cpu size={16} color={accentBlue} />, title: 'Cryptographic Token Issuance', desc: 'Issue tamper-evident graduation tokens. Hash-anchored. Airline HR can verify in seconds.' },
                  { icon: <TrendingUp size={16} color={accent} />, title: 'Audited Placement Rate', desc: 'Your placement rate is verified, not self-reported. Carries credibility with parents and students.' },
                  { icon: <Globe size={16} color={accentAmber} />, title: 'Atlas CV Feed', desc: 'Your graduates\' Atlas CVs auto-feed to airline ATS systems. No manual application process.' },
                ].map(f => (
                  <div key={f.title} style={{ ...card, padding: '0.9rem', background: subtle, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '0.1rem' }}>{f.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>{f.title}</div>
                      <div style={{ fontSize: '0.73rem', color: muted, lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 6: Founding Offer */}
            <div style={{ ...card, background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(15,23,42,0.9) 60%)', border: `1px solid ${accentAmber}33` }}>
              <div style={{ ...badge(accentAmber), marginBottom: '0.75rem' }}>Slide 6 — Founding ATO Offer</div>
              <h2 style={{ ...sectionTitle }}>First 5 Academies. Different Terms.</h2>
              <p style={{ ...sectionSub }}>
                The first five ATOs to sign get founding member pricing and co-branded launch positioning. This is not available after launch.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  { label: 'Subscription', founding: '$500 / yr', standard: '$1,000 / yr', saved: 'Save $500' },
                  { label: 'Success Fee', founding: '$250 / hire', standard: '$500 / hire', saved: '50% discount' },
                  { label: 'Onboarding', founding: 'Dedicated support', standard: 'Self-serve', saved: 'White-glove' },
                ].map(p => (
                  <div key={p.label} style={{ ...card, padding: '0.9rem', background: `${accentAmber}09`, border: `1px solid ${accentAmber}22` }}>
                    <div style={{ fontSize: '0.7rem', color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>{p.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: accentAmber, marginBottom: '0.2rem' }}>{p.founding}</div>
                    <div style={{ fontSize: '0.72rem', color: muted, textDecoration: 'line-through', marginBottom: '0.2rem' }}>{p.standard}</div>
                    <div style={{ ...badge(accentAmber), fontSize: '0.65rem' }}>{p.saved}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.6 }}>
                <strong style={{ color: '#fff' }}>What we need from you:</strong> A letter of intent, your CAAP/authority certificate, and 10 pilot email addresses for the founding cohort. We handle the rest.
              </div>
            </div>

          </div>
        )}

        {/* ── ONE-PAGER ── */}
        {activeTab === 'onepager' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ ...card, background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(15,23,42,0.9) 60%)', textAlign: 'center', padding: '2rem' }}>
              <GraduationCap size={36} color={accent} style={{ marginBottom: '0.75rem' }} />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Why Your $1,000 Buys<br /><span style={{ color: accent }}>$100,000 in Student Confidence</span></h1>
              <p style={{ color: muted, fontSize: '0.88rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                When your graduate walks into an airline interview with a verified Recognition Profile, EBT video score, and cryptographic graduation token — they don't walk in hoping. They walk in verified.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { number: '40', unit: 'students', desc: 'Average ATO cohort that becomes permanently discoverable in the airline pull database', color: accentBlue },
                { number: '5%', unit: 'kickback', desc: 'You earn on every verification check your alumni run. For 200 checks/year = $990 back', color: accent },
                { number: '$0', unit: 'after yr 1', desc: 'Effective subscription cost for active ATOs once kickback revenue is factored in', color: accentAmber },
              ].map(s => (
                <div key={s.unit} style={{ ...card, textAlign: 'center', padding: '1.25rem', background: subtle }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.number}</div>
                  <div style={{ fontSize: '0.72rem', color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{s.unit}</div>
                  <div style={{ fontSize: '0.73rem', color: muted, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ ...card }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>What the $1,000 Enterprise Tier Delivers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  ['Verified Issuer Status', 'Your graduation tokens carry cryptographic proof. Hash-anchored. Tamper-evident. Airline HR accepts without question.'],
                  ['Recognition-Ready Designation', 'Appears on PilotRecognition Pathways. Airlines filter by Recognition-Ready ATOs when building candidate pools.'],
                  ['Graduate Dashboard', 'Real-time view of every enrolled student\'s verification status, recognition score, and pathway matches.'],
                  ['Pull API Access', 'Post Instructor Pathways. Pull verified 6,000-hr CFIs and Check Airmen directly into your recruitment pipeline.'],
                  ['Co-Branded Graduation Credentials', 'Issue digital graduation certificates with your ATO branding + PilotRecognition verification seal.'],
                  ['5% Verification Kickback', 'Alumni pay $99 to verify hours. You earn $4.95 per check. Passive revenue from your training legacy.'],
                ].map(([title, desc]) => (
                  <div key={title as string} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={15} color={accent} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{title}</span>
                      <span style={{ fontSize: '0.78rem', color: muted }}> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, background: `${accent}09`, border: `1px solid ${accent}22`, textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: muted, marginBottom: '0.5rem' }}>The Express Elevator Narrative</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                "Before PilotRecognition: my graduate finished training and disappeared into a gap no one could map. After: they walk out with a verified profile, a recognition score, and airlines already watching their hours accumulate in real time."
              </div>
              <div style={{ fontSize: '0.72rem', color: muted, marginTop: '0.75rem' }}>— Founding ATO Principal</div>
            </div>

            <ROICalculator />
          </div>
        )}

        {/* ── COMPARISON ── */}
        {activeTab === 'comparison' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={sectionTitle}>Whiteboard vs. Trust Layer</h2>
              <p style={sectionSub}>Eight metrics. What your academy looks like before and after Enterprise enrollment.</p>
            </div>
            <div style={{ ...card }}>
              <ComparisonTable />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ ...card, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ ...badge('#ef4444'), marginBottom: '0.75rem' }}>Whiteboard Model — The Reality</div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: muted, lineHeight: 2 }}>
                  <li>Graduation = end of relationship</li>
                  <li>Hours verified only by a paper logbook</li>
                  <li>Placement rate is a guess, not a data point</li>
                  <li>One fraudulent logbook = full ATO liability</li>
                  <li>Alumni never generate revenue again</li>
                  <li>No differentiation from 400 other ATOs</li>
                </ul>
              </div>
              <div style={{ ...card, background: `${accent}06`, border: `1px solid ${accent}22` }}>
                <div style={{ ...badge(accent), marginBottom: '0.75rem' }}>Trust Layer — The Shift</div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: muted, lineHeight: 2 }}>
                  <li>Graduation = start of verified career track</li>
                  <li>Hours verified by cryptographic token</li>
                  <li>Placement rate audited and publicly visible</li>
                  <li>Hash-anchored records = defensible in any dispute</li>
                  <li>Alumni generate passive revenue indefinitely</li>
                  <li>"Recognition-Ready" = filterable airline preference</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── PARENT FAQ ── */}
        {activeTab === 'parentfaq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={sectionTitle}>Cadet Parent FAQ</h2>
              <p style={sectionSub}>How your child's training record becomes airline-discoverable. Plain language.</p>
            </div>

            <div style={{ ...card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <BookOpen size={16} color={accentBlue} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>For Parents & Cadets</span>
              </div>
              {[
                {
                  q: 'My child just graduated. How does this help them get hired?',
                  a: 'Their training record is converted into a verified digital credential — a token. When an airline uses PilotRecognition to build their candidate pool, your child\'s token appears automatically. They don\'t apply. They get found. Airlines pull from the database directly.'
                },
                {
                  q: 'What exactly is a "Recognition Profile" and why does it matter?',
                  a: 'It\'s a live, updating profile — not a static CV. As your child logs flight hours, the profile updates in real time. Airlines see their progress. A 200-hour pilot building toward 1,500 hours is already visible and trackable. Recognition Score is their currency for accessing pathways and programs.'
                },
                {
                  q: 'What is an EBT Video Score and why do airlines care?',
                  a: 'Evidence-Based Training (EBT) scoring evaluates behavioral competencies — cognitive thinking, constructivism, leadership. Airlines use these behavioral markers, not just hours. An EBT video score from PilotRecognition signals your child has been assessed against the same framework airlines use internally.'
                },
                {
                  q: 'Is the training record permanent? What if the academy closes?',
                  a: 'The token is cryptographically anchored — a hash of the graduation record is stored independently of the academy. If the academy closes, the credential remains valid and verifiable. Think of it as a birth certificate for your child\'s flying career.'
                },
                {
                  q: 'We paid $50,000 for training. How much does this add?',
                  a: 'Through your academy\'s Enterprise membership, your child\'s verification check ($99/year) is what keeps the profile active. That\'s the only cost after training. The platform is free to use at the basic tier. Recognition Plus is $99/year for full pathway access and priority matching.'
                },
                {
                  q: 'How long does it take for an airline to find my child?',
                  a: 'Immediately after onboarding. The profile is live the moment the verification token is issued. Airlines using the pull API see them the same day. The waiting isn\'t for discovery — it\'s for the hours to accumulate. But they\'re visible from day one.'
                },
                {
                  q: 'What if my child\'s academy isn\'t on PilotRecognition yet?',
                  a: 'Your child can still create a Recognition Profile directly. They upload their documents (license, logbook, medical), which go through the admin verification queue. Once approved, they\'re in the database. We recommend asking your academy to register — it speeds the process and they become Recognition-Ready.'
                },
                {
                  q: 'Is this a job board? Is my child competing against thousands of applicants?',
                  a: 'No. This is not a job board. There are no mass applications. Airlines post Pathway Cards — specific requirement sets — and pull matching pilots directly. Your child\'s profile either matches the pathway or it shows them exactly what\'s missing and how to close the gap. It\'s a gap map, not a lottery.'
                },
              ].map(faq => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        )}

        {/* ── NEXT STEPS ── */}
        {activeTab === 'next' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={sectionTitle}>Close the First Five</h2>
              <p style={sectionSub}>The sequence that gets you letters of intent and early revenue this week. Integration comes after the signed contract.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  phase: 'Phase 1', label: 'This Week', color: accent,
                  steps: [
                    'Send this pitch deck to 8–10 target ATOs (3 Philippines, 2 UAE, 2 Southeast Asia, 2 Europe)',
                    'Collect letters of intent — founding tier offer expires at 5 signed academies',
                    'First 5 signed ATOs: white-glove onboarding, dedicated support, 50% off year 1',
                    'Each ATO signs with 10–40 pilot email addresses as founding cohort',
                  ]
                },
                {
                  phase: 'Phase 2', label: 'Next Week', color: accentBlue,
                  steps: [
                    'FlightSchedulePro webhook listener specification (one-direction: lesson completion → verification request)',
                    'ATO dashboard endpoint: "View all my enrolled students\' verification status"',
                    'Verification token batch issuance for founding cohort',
                    'ATO recognition score dashboard goes live with real data',
                  ]
                },
                {
                  phase: 'Phase 3', label: 'Month 2', color: '#a78bfa',
                  steps: [
                    'First ATO graduates visible in airline enterprise pull API results',
                    'Recognition-Ready ATOs appear in Pathways page filter for airlines',
                    'Airline enterprise tier upsell conversation: "We have 200 pre-verified pilots from 5 ATOs"',
                    'Revenue validation: ATO subscriptions + verification kickbacks running before airline deals close',
                  ]
                },
              ].map(p => (
                <div key={p.phase} style={{ ...card, borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ ...badge(p.color) }}>{p.phase}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.label}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: muted, lineHeight: 2.2 }}>
                    {p.steps.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ ...card, background: `${accentAmber}09`, border: `1px solid ${accentAmber}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <AlertCircle size={16} color={accentAmber} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: accentAmber }}>The Sequence Logic</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: muted, lineHeight: 1.7, margin: 0 }}>
                A signed ATO with 40 students generates immediate platform activity, verified credential volume, and pathway match data.
                That activity attracts airlines to the enterprise tier. The integration makes onboarding smoother for ATO #6–#60.
                Integration is post-revenue, not pre-revenue. Don't let the API spec delay the first five signatures.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('ato-register')}
                style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Register Your Academy <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigate('ato-dashboard')}
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.65rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                View ATO Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
