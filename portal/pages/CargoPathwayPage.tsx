import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';

// TYPE DEFINITIONS
interface PathwayJob {
  id: string;
  title: string;
  company: string;
  matchPercentage: number;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  image: string;
}

interface UserProfileData {
  logged_hours?: number | null;
  program_inputs?: number | null;
  total_hours?: number | null;
}

const isProfileEmpty = (profile: UserProfileData | null): boolean => {
  if (!profile) return true;
  const loggedHours = profile.logged_hours ?? profile.total_hours ?? 0;
  const programInputs = profile.program_inputs ?? 0;
  return loggedHours === 0 && programInputs === 0;
};

// HELPER COMPONENTS
const MatchBadge: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getGradient = (p: number) => {
    if (p >= 90) return 'from-emerald-400 to-teal-300';
    if (p >= 80) return 'from-blue-400 to-cyan-300';
    if (p >= 70) return 'from-amber-400 to-yellow-300';
    return 'from-slate-400 to-zinc-300';
  };
  return (
    <div className={`relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${getGradient(percentage)} text-slate-950 shadow-lg`}>
      <span>{percentage}%</span>
    </div>
  );
};

const MatchBadgeOrNA: React.FC<{ percentage: number; profile: UserProfileData | null }> = ({ percentage, profile }) => {
  if (isProfileEmpty(profile)) {
    return <div className="relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-slate-400 to-gray-400 text-slate-950 shadow-lg"><span>N/A</span></div>;
  }
  return <MatchBadge percentage={percentage} />;
};

const OmniSearchBar: React.FC<{ value: string; onChange: (v: string) => void; isDarkMode?: boolean }> = ({ value, onChange, isDarkMode = true }) => {
  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px' }}>
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        borderRadius: '16px',
        border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
        boxShadow: isDarkMode 
          ? '0 0 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)'
          : '0 0 20px rgba(139, 92, 246, 0.15), 0 0 40px rgba(236, 72, 153, 0.1)',
        padding: '4px', backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '14px 18px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search cargo pathways..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: '17px', padding: '14px 0' }} />
        <button style={{ padding: '12px 16px', margin: '4px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)', borderRadius: '12px', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#cbd5e1' : '#64748b'} strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

// CARGO PATHWAY DATA
const CARGO_PATHWAYS: PathwayJob[] = [
  {
    id: 'wingmentor-intro',
    title: 'Pathways to Partnered Cargo Programs',
    company: 'WingMentor',
    matchPercentage: 100,
    location: 'Global',
    type: 'Introduction',
    salary: 'Direct entry pathways for cargo aviation careers',
    requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Cargo Airline Eligible'],
    tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
    postedAt: 'Featured',
    image: 'wingmentor-white'
  },
  {
    id: 'disc-cargo-fedex',
    title: 'FedEx Purple Runway Program',
    company: 'FedEx Express',
    matchPercentage: 91,
    location: 'Memphis, TN / Indianapolis, IN',
    type: 'Cadet to Captain',
    salary: '$60,000 during training',
    requirements: ['750 hrs', 'ATP Written', 'US Citizen/Permanent Resident'],
    tags: ['Fortune 500', 'MD-11 to B777', 'Retirement Benefits'],
    postedAt: 'Pipeline Program',
    image: 'https://d386an9otcxw2c.cloudfront.net/oms/2634/image/2025/8/3QC0D_purple-runway-pathway/purple-runway-pathway.jpg'
  },
  {
    id: 'disc-cargo-ups',
    title: 'UPS FlightPath Program',
    company: 'UPS Airlines',
    matchPercentage: 88,
    location: 'Louisville, KY',
    type: 'Career Development',
    salary: '$55,000 starting pay',
    requirements: ['1,000 hrs', 'Part 121 Experience', 'ATP'],
    tags: ['Teamsters Union', 'Pension', 'Global Routes'],
    postedAt: 'Hiring Window Open',
    image: 'https://cdn.phenompeople.com/CareerConnectResources/UPBUPSGLOBAL/images/img-flightpath-fastfacts-1736537912855.jpg'
  },
  {
    id: 'disc-cargo-atlas',
    title: 'Atlas Air International Pathway',
    company: 'Atlas Air',
    matchPercentage: 86,
    location: 'Purchase, NY / Miami, FL',
    type: 'ACMI Career Track',
    salary: '$180,000 - $280,000',
    requirements: ['2,000 hrs', 'B747 Type Rating', 'Heavy Jet Experience'],
    tags: ['Global Operations', 'Amazon/Atlas', 'Travel Benefits'],
    postedAt: 'Direct Entry Available',
    image: 'https://live-cms.acronaviation.com/media/sgbhxpsv/acron-academy-airline-relationships-usa-atlas-air.jpg?width=1200&height=630&quality=80'
  },
  {
    id: 'disc-cargo-dhl',
    title: 'DHL Aviation First Officer Program',
    company: 'DHL Aviation (EAT Leipzig)',
    matchPercentage: 83,
    location: 'Leipzig, Germany',
    type: 'Entry Level Cargo',
    salary: 'EUR 65,000 - 85,000',
    requirements: ['250 hrs', 'EASA CPL', 'A330 Type Rating Program'],
    tags: ['European Hub', 'A330F', 'Night Operations'],
    postedAt: 'EU Nationals Only',
    image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=800&auto=format&fit=crop'
  }
];

// DISCOVERY CAROUSEL
const DiscoveryCarousel: React.FC<{ isDarkMode: boolean; profile: UserProfileData | null; searchQuery: string }> = ({ isDarkMode, profile, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayIndex, setDisplayIndex] = useState(0);

  const filteredPathways = CARGO_PATHWAYS.filter(pathway => 
    pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pathway.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -1024 : 1024, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setDisplayIndex(Math.min(Math.round(scrollRef.current.scrollLeft / 1024), filteredPathways.length - 1));
    }
  };

  const navigateCard = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? Math.max(0, displayIndex - 1) : Math.min(filteredPathways.length - 1, displayIndex + 1);
    setDisplayIndex(newIndex);
    scrollRef.current?.scrollTo({ left: newIndex * 1024, behavior: 'smooth' });
  };

  if (filteredPathways.length === 0) {
    return <div className="text-center py-12" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}><p>No pathways found.</p></div>;
  }

  return (
    <section className="py-8 px-4">
      <div className="w-full">
        <div className="flex flex-col items-center mb-5">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Cargo Pathways</h2>
          <p style={{ margin: '0.5rem 0 0', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Explore opportunities in air cargo and freight operations</p>
        </div>

        <div className="flex items-center justify-end gap-2 mb-4 px-4">
          <button onClick={() => scroll('left')} className="p-2 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
            <Icons.ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative overflow-hidden">
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <div ref={scrollRef} onScroll={handleScroll} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
            <div className="flex gap-6">
              {filteredPathways.map((pathway, index) => (
                <div key={pathway.id} className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative"
                  style={{ width: index === 0 ? '600px' : '1000px', height: '420px', scrollSnapAlign: 'center', backgroundColor: index === 0 ? '#ffffff' : (isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)') }}>
                  {index === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white">
                      <img src="/logo.png" alt="WingMentor Logo" className="w-20 h-20 object-contain mb-5" />
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#0f172a', textAlign: 'center' }}>Pathways to Partnered Cargo Programs</h2>
                      <p style={{ color: '#475569', textAlign: 'center' }}>Direct entry pathways for cargo aviation careers</p>
                    </div>
                  ) : (
                    <>
                      <img src={pathway.image} alt={pathway.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute top-5 right-6 z-10"><MatchBadgeOrNA percentage={pathway.matchPercentage} profile={profile} /></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                        <span className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-4">CARGO — {pathway.type.toUpperCase()}</span>
                        <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{pathway.title}</h3>
                        <p className="text-lg text-gray-200 mb-4">{pathway.company}</p>
                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
                          <span className="flex items-center gap-2"><Icons.MapPin className="w-4 h-4" /> {pathway.location}</span>
                          <span className="flex items-center gap-2"><Icons.DollarSign className="w-4 h-4" /> {pathway.salary}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button className="px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff' }}>
                            <span>Discover Pathway</span>
                            <Icons.ArrowRight className="w-4 h-4" />
                          </button>
                          <div className="flex gap-2">
                            {pathway.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(11, 15, 25, 0.9), transparent)' : 'linear-gradient(to right, rgba(248, 250, 252, 0.9), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none" style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(11, 15, 25, 0.95), transparent)' : 'linear-gradient(to left, rgba(248, 250, 252, 0.95), transparent)' }} />
        </div>

        <div className="mt-8 px-4">
          <div className="text-center flex items-center justify-center gap-4">
            <button onClick={() => navigateCard('prev')} className="p-3 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <Icons.ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)', color: isDarkMode ? '#60a5fa' : '#2563eb' }}>CARGO PATHWAY</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{filteredPathways[displayIndex]?.title}</h2>
            </div>
            <button onClick={() => navigateCard('next')} className="p-3 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <Icons.ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// MAIN COMPONENT
interface CargoPathwayPageProps {
  onBack: () => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}

export const CargoPathwayPage: React.FC<CargoPathwayPageProps> = ({ onBack, onLogout, isDarkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('pilot_recognition_matches').select('total_hours, logged_hours, program_inputs').eq('user_id', user.id).maybeSingle();
        if (data) setProfile({ total_hours: data.total_hours, logged_hours: data.logged_hours, program_inputs: data.program_inputs });
      } catch (err) { console.error('Error:', err); }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDarkMode ? '#0B0F19' : '#f8fafc', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
      <button onClick={onBack} style={{ position: 'fixed', top: '20px', left: '20px', padding: '10px 20px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', borderRadius: '999px', cursor: 'pointer', zIndex: 50 }}>
        <Icons.ChevronLeft style={{ width: '16px', height: '16px' }} /> Return to Platform
      </button>
      <button onClick={onLogout} style={{ position: 'fixed', top: '20px', right: '20px', padding: '10px 20px', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', borderRadius: '999px', cursor: 'pointer', zIndex: 50 }}>
        <Icons.LogOut style={{ width: '16px', height: '16px' }} /> Logout
      </button>

      <header style={{ textAlign: 'center', padding: '60px 20px 30px' }}>
        <div style={{ marginBottom: '24px' }}>
          <img src="/logo.png" alt="WingMentor" style={{ maxWidth: '280px' }} />
        </div>
        <div style={{ letterSpacing: '0.3em', color: isDarkMode ? '#60a5fa' : '#2563eb', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px' }}>WINGMENTOR PATHWAYS</div>
        <h1 style={{ fontSize: '48px', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', fontFamily: '"Georgia", serif', marginBottom: '20px' }}>Cargo Pathway</h1>
        <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
          Discover opportunities in air cargo and freight operations with major carriers and logistics companies.
        </p>
      </header>

      <OmniSearchBar value={searchQuery} onChange={setSearchQuery} isDarkMode={isDarkMode} />
      <main style={{ width: '100%' }}>
        <DiscoveryCarousel isDarkMode={isDarkMode} profile={profile} searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default CargoPathwayPage;
