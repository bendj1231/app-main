import React from 'react';
import { Home, CheckCircle } from 'lucide-react';

const NEWSROOM_DATA = [
  {
    id: 'recognition-systems',
    category: 'pilot' as const,
    tag: 'Recognition Systems',
    title: 'How to Build the Right Recognition Profile',
    description: 'CEO & Founder Benjamin Bowler breaks down how to align your profile with Airbus EBT standards. It is not about flight hours alone — airlines want cognitive skills, behavioral markers, and constructivist thinking that static CVs never capture.',
    bullets: ['EBT CBTA-aligned assessment framework', 'Industry-recognized competency validation', 'Live profile matching with operators'],
    metrics: [{ label: 'Live Webinars', value: 'This week' }, { label: 'Profile Views', value: '2,340 +' }],
    image: '/images/pilotrecognitioncompoennt.png',
    ctaTarget: 'pilot-recognition-profile',
  },
  {
    id: 'cebu-cadet',
    category: 'pathways' as const,
    tag: 'Pathway Update',
    title: 'Cebu Pacific Opens Cadet Programme 2026',
    description: 'Applications now open for the Cebu Pacific Ab-Initio Cadet programme. Recognition-matched candidates receive priority interview access through the pull system.',
    bullets: ['Ab-Initio to First Officer pathway', 'Recognition Score threshold: 65+', 'Priority pull for verified pilots'],
    metrics: [{ label: 'Intake Date', value: 'Aug 2026' }, { label: 'Open Slots', value: '40' }],
    image: '/public/images/airline-logos/cebu-pacific.svg',
    ctaTarget: 'pathways',
  },
  {
    id: 'airbus-ebt',
    category: 'industry' as const,
    tag: 'Industry & Manufacturer',
    title: 'New EBT Framework Guidance Released by ICAO',
    description: 'ICAO Doc 9995 updated guidance on Evidence-Based Training competencies. Platform assessment criteria have been updated to reflect the latest behavioural marker definitions.',
    bullets: ['Updated 9 core competency definitions', 'New behavioural indicators for CRM', 'Affects Transition Program curriculum'],
    metrics: [{ label: 'Effective Date', value: 'Jun 2026' }, { label: 'Certification', value: 'enroll now for free!' }],
    image: '/images/airline-expectations/airbus-training.png',
    ctaTarget: 'programs',
  },
  {
    id: 'recognition-plus',
    category: 'program' as const,
    tag: 'Program Update',
    title: 'Recognition Plus — Priority Pathway Matching Now Live',
    description: 'Recognition Plus subscribers now receive priority placement in the operator pull queue. Your profile ranks above unverified candidates on every airline dashboard.',
    bullets: ['Priority operator queue placement', 'Unlimited pathway comparison views', 'Full Recognition Score breakdown'],
    metrics: [{ label: 'Plan', value: '$99 / year' }, { label: 'Active Members', value: '1,200+' }],
    image: '/images/accessportal.png',
    ctaTarget: 'programs',
  },
  {
    id: 'airlines-update',
    category: 'airlines' as const,
    tag: 'Airlines',
    title: 'Emirates & Singapore Airlines Add Recognition Pathway Cards',
    description: 'Two of the world\'s top carriers have added structured pathway cards to the platform. Pilots can now see exact requirements and gap analysis against their live Recognition Profile.',
    bullets: ['Emirates A380 First Officer pathway live', 'Singapore Airlines cadet pathway added', 'Real-time gap comparison enabled'],
    metrics: [{ label: 'New Pathways', value: '6 added' }, { label: 'Airlines Active', value: '14' }],
    image: '/images/airline-operations.png',
    ctaTarget: 'airlines',
  },
];

const NEWS_CATEGORIES = [
  { id: 'pathways' as const, label: 'Pathways' },
  { id: 'program' as const, label: 'Program' },
  { id: 'pilot' as const, label: 'Pilot' },
  { id: 'industry' as const, label: 'Industry & Manufacturer' },
  { id: 'airlines' as const, label: 'Airlines' },
];

export const NewsroomTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'pathways' | 'program' | 'pilot' | 'industry' | 'airlines'>('all');
  const lastInteraction = React.useRef(Date.now());

  const filtered = activeCategory === 'all' ? NEWSROOM_DATA : NEWSROOM_DATA.filter(n => n.category === activeCategory);
  const item = filtered[activeIdx] ?? filtered[0];

  React.useEffect(() => { setActiveIdx(0); }, [activeCategory]);

  const filteredLenRef = React.useRef(filtered.length);
  React.useEffect(() => { filteredLenRef.current = filtered.length; }, [filtered.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInteraction.current >= 6000) {
        setActiveIdx(prev => (prev + 1) % filteredLenRef.current);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!item) return null;

  return (
    <div className="-m-5 lg:-m-7">
      <div className="relative border border-white/10 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.80) 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)' }} />

        {/* Category tabs */}
        <div className="relative px-5 pt-4 pb-3 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.3)' }}>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-3">NEWS ROOM</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg border transition-all ${activeCategory === 'all' ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white/80'}`}>All</button>
            {NEWS_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); lastInteraction.current = Date.now(); }} className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg border transition-all ${activeCategory === cat.id ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white/80'}`}>{cat.label}</button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-4 md:grid-cols-[1.4fr,1fr] p-5">
          {/* Left — article */}
          <div className="text-white space-y-4 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/40">
                  <span className="text-red-400">Recognition</span> <span className="text-white">Update</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  Live
                </div>
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">{activeIdx + 1} / {filtered.length}</span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200/80">{item.tag}</p>
              <h2 className="text-2xl lg:text-[2rem] font-serif leading-tight mt-1">{item.title}</h2>
              <p className="text-slate-100/85 text-sm mt-3 leading-relaxed">{item.description}</p>
            </div>

            <ul className="space-y-1.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-100/90">
                  <CheckCircle size={14} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-2">
              {item.metrics.map(m => (
                <div key={m.label} className="border border-white/25 bg-white/5 px-3 py-2 shadow-lg shadow-black/30">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">{m.label}</p>
                  {m.label === 'Certification' && m.value === 'enroll now for free!' ? (
                    <button onClick={() => onNavigate('become-a-member')} className="text-base font-semibold text-blue-400 hover:text-blue-300 underline">{m.value}</button>
                  ) : (
                    <p className="text-base font-semibold text-white">{m.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 pt-1">
              <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/80 text-slate-900 text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 transition">
                <Home size={14} /> Home
              </button>
              <button onClick={() => onNavigate(item.ctaTarget)} className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white">
                Open Update →
              </button>
            </div>
          </div>

          {/* Right — image card */}
          <div className="relative min-h-[200px] border border-white/25 overflow-hidden">
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/75 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">Latest drop</p>
              <p className="text-lg font-semibold text-white leading-tight">{item.tag}</p>
              <p className="text-sm text-white/80">Recognition, programs, and pathways broadcast through one newsroom overlay.</p>
            </div>
          </div>
        </div>

        {/* Latest updates bar */}
        <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.3)' }}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-2">Latest Updates</p>
          <div className="flex gap-1.5">
            {filtered.map((_, i) => (
              <button key={i} onClick={() => { setActiveIdx(i); lastInteraction.current = Date.now(); }} className={`h-1.5 flex-1 rounded-sm transition-all ${i === activeIdx ? 'bg-white/60 border-2 border-white/40' : 'bg-white/20 border-2 border-dashed border-white/10 hover:bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
