// Pathway Dashboard - Shows real pathway matches from browser engine
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { 
  Route, 
  Target, 
  Award, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Bell,
  Settings,
  Zap,
  User,
  CheckCircle,
  Lock
} from 'lucide-react';
import { usePathwayMatching } from '../../../hooks/usePathwayMatching';

interface PathwayDashboardPageProps {
  onNavigate?: (path: string) => void;
  pilotId?: string;
}

export const PathwayDashboardPage: React.FC<PathwayDashboardPageProps> = ({ 
  onNavigate,
  pilotId 
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const { 
    matches, 
    topMatches, 
    qualifiedMatches, 
    loading, 
    pilotSummary 
  } = usePathwayMatching({ 
    pilotId, 
    autoCalculate: true,
    limit: 10 
  });

  // Fetch real Supabase profile for the Profile Card
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        // Use pilotId prop if provided, otherwise get current auth user
        let targetUserId = pilotId;
        if (!targetUserId) {
          const { data: { user } } = await supabase.auth.getUser();
          targetUserId = user?.id;
        }
        
        if (!targetUserId) {
          setProfileLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, license_type, total_flight_hours, recognition_score, profile_readiness, profile_image_url, medical_expiry, ratings, type_ratings')
          .eq('id', targetUserId)
          .single();
        if (data) setProfile(data);
      } catch (e) { /* silent fail */ }
      setProfileLoading(false);
    };
    fetchProfile();
  }, [pilotId]);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // Mock stats for now - replace with real data from profile
  const stats = [
    { 
      label: 'Pathways Saved', 
      value: qualifiedMatches.length.toString(), 
      icon: Route,
      color: 'text-blue-400'
    },
    { 
      label: 'Skills Tracked', 
      value: pilotSummary?.ratings_count?.toString() || '0', 
      icon: Target,
      color: 'text-emerald-400'
    },
    { 
      label: 'Certificates', 
      value: '3', 
      icon: Award,
      color: 'text-purple-400'
    },
    { 
      label: 'Hours Logged', 
      value: pilotSummary?.total_hours?.toLocaleString() || '1,247', 
      icon: Clock,
      color: 'text-amber-400'
    },
  ];

  const quickActions = [
    { 
      label: 'Update Career Goals', 
      icon: Target,
      action: () => handleNavigate('/discover')
    },
    { 
      label: 'Browse Programs', 
      icon: Award,
      action: () => handleNavigate('/programs')
    },
    { 
      label: 'Log Flight Hours', 
      icon: TrendingUp,
      action: () => handleNavigate('/logbook')
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
              <p className="text-slate-400 mt-1">Track your career progression</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Getting Started Banner ── */}
        {profile && (
          <div className="mb-8 rounded-2xl border border-white/10 shadow-lg overflow-hidden" style={{ background: 'rgba(15,22,35,0.97)' }}>
            <div className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400/60 mb-1">Pilot Onboarding</p>
                <h3 className="text-lg font-black text-white tracking-tight">Getting Started</h3>
                <p className="text-xs text-white/40 mt-0.5">Complete these steps to unlock your full profile and pathway matching.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Complete Profile', done: (profile.profile_readiness || 0) > 20, path: '/profile' },
                  { label: 'Log Flight Hours', done: (profile.total_flight_hours || 0) > 0, path: '/logbook' },
                  { label: 'Verify Credentials', done: false, path: '/wallet' },
                  { label: 'Browse Pathways', done: qualifiedMatches.length > 0, path: '/discover' },
                  { label: 'Start a Program', done: false, path: '/programs' },
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavigate(s.path)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-bold transition-all hover:brightness-110 flex-shrink-0 ${
                      s.done
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white/80'
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      </div>
                    )}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-sm text-slate-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Recommended Pathways */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recommended Pathways</h2>
                <button 
                  onClick={() => handleNavigate('/discover')}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : topMatches.length > 0 ? (
                <div className="space-y-3">
                  {topMatches.slice(0, 3).map((match) => (
                    <div 
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => handleNavigate(`/pathways-detail/${match.pathways?.slug}`)}
                    >
                      <div>
                        <div className="font-medium text-white">{match.pathways?.name}</div>
                        <div className="text-sm text-slate-400 mt-0.5">
                          {match.pathways?.requirements?.min_total_hours} required
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          match.match_score >= 85 ? 'text-emerald-400' :
                          match.match_score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {match.match_score}%
                        </div>
                        <div className="text-xs text-slate-500">match</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No pathway matches yet.</p>
                  <button 
                    onClick={() => handleNavigate('/discover')}
                    className="mt-3 text-blue-400 hover:text-blue-300"
                  >
                    Discover pathways
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — Profile Card */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="w-full flex flex-col rounded-xl overflow-hidden border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_28px_rgba(0,0,0,0.55)]" style={{ background: 'rgba(15,22,35,0.97)' }}>
              {/* Header */}
              <div className="relative px-5 pt-5 pb-4 flex-shrink-0 border-b border-white/10">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00b4d8] to-blue-600" />
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[#00b4d8] text-xs font-bold">&#8811;</span>
                  <p className="text-[10px] text-[#00b4d8] font-bold uppercase tracking-[0.15em]">Pilot Platform</p>
                </div>
                <h2 className="text-base font-black text-white tracking-tight">Profile Card</h2>
              </div>

              {profile ? (
                <div className="flex flex-col flex-1">
                  {/* Avatar + name */}
                  <div className="flex flex-col items-center px-5 pt-6 pb-4">
                    {profile.profile_image_url ? (
                      <img src={profile.profile_image_url} alt="" className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white/20 mb-3" />
                    ) : (
                      <div className="w-[72px] h-[72px] rounded-full bg-blue-500 text-white text-xl font-black flex items-center justify-center border-2 border-white/20 mb-3">
                        {(profile.first_name || profile.last_name)?.charAt(0)?.toUpperCase() || 'B'}
                      </div>
                    )}
                    <p className="text-sm font-black text-white text-center truncate w-full">{profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.first_name || 'Benjamin Tiger Bowler'}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: '#f97316' }}>{profile.license_type?.toUpperCase() || 'COMMERCIAL PILOT (CPL)'}</p>
                  </div>

                  {/* Key stats — 2-up */}
                  <div className="grid grid-cols-2 gap-2 px-4 mb-4">
                    <div className="text-center py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-base font-black text-white">{profile.total_flight_hours?.toLocaleString() || '—'}</p>
                      <p className="text-[8px] text-white/35 uppercase tracking-widest">Hours</p>
                    </div>
                    <div className="text-center py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-base font-black text-sky-300">{profile.recognition_score?.toString() || '—'}</p>
                      <p className="text-[8px] text-white/35 uppercase tracking-widest">Score</p>
                    </div>
                  </div>

                  {/* Profile readiness bar */}
                  <div className="px-4 mb-5">
                    <div className="flex justify-between text-[9px] mb-1.5">
                      <span className="text-white/30 uppercase tracking-wider font-bold">Profile Readiness</span>
                      <span className="font-black" style={{ color: (profile.profile_readiness || 40) >= 80 ? '#10b981' : (profile.profile_readiness || 40) >= 40 ? '#f59e0b' : '#ef4444' }}>{profile.profile_readiness || 40}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${profile.profile_readiness || 40}%`, background: (profile.profile_readiness || 40) >= 80 ? '#10b981' : (profile.profile_readiness || 40) >= 40 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="px-4 mt-auto pb-5 flex flex-col gap-2">
                    <button onClick={() => handleNavigate('/profile')} className="w-full py-2.5 text-xs font-black tracking-wider text-white rounded-xl transition-all hover:brightness-110" style={{ background: 'rgba(37,99,235,0.75)', border: '1px solid rgba(96,165,250,0.3)' }}>
                      VIEW FULL PROFILE →
                    </button>
                    <button onClick={() => handleNavigate('/programs')} className="w-full py-2 text-[10px] font-black tracking-widest text-slate-900 rounded-xl transition-all hover:brightness-110" style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}>
                      RECOGNITION+ — $99/YR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center px-5 py-12 gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <User className="w-7 h-7 text-white/30" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-white mb-1">Welcome Aboard</p>
                    <p className="text-[10px] text-white/30 leading-snug">Sign in to activate your pilot profile.</p>
                  </div>
                  <button onClick={() => handleNavigate('/get-started')} className="w-full py-2.5 text-sm font-black tracking-wide text-white rounded-xl transition-all hover:brightness-110" style={{ background: '#dc2626' }}>
                    Get Recognition Free
                  </button>
                  <button onClick={() => handleNavigate('/become-member')} className="w-full py-2.5 text-sm font-black tracking-wide text-white rounded-xl transition-all hover:brightness-110" style={{ background: 'rgba(37,99,235,0.7)', border: '1px solid rgba(96,165,250,0.3)' }}>
                    Pilot Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
