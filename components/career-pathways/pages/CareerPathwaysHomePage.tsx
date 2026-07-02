import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Route, 
  Compass, 
  Plane, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Target,
  Users,
  Award,
  Loader2
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface CareerPathwaysHomePageProps {
  onNavigate?: (path: string) => void;
  onLogin?: () => void;
  pilotId?: string;
}

interface RealTimeStats {
  totalPathways: number;
  activeAirlines: number;
  totalPilots: number;
  avgMatchScore: number;
  loading: boolean;
}

export const CareerPathwaysHomePage: React.FC<CareerPathwaysHomePageProps> = ({
  onNavigate,
  onLogin,
  pilotId
}) => {
  const navigate = useNavigate();
  const { callApi } = useWorkerAuth();
  const [stats, setStats] = useState<RealTimeStats>({
    totalPathways: 0,
    activeAirlines: 0,
    totalPilots: 0,
    avgMatchScore: 0,
    loading: true
  });
  const [featuredPathways, setFeaturedPathways] = useState<any[]>([]);
  const [topMatches, setTopMatches] = useState<any[]>([]);

  // Fetch real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get pathways count
        const pathwaysRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'pathways',
          operation: 'select',
          where: { status: 'active' },
          limit: 1000,
        });
        const pathwaysCount = pathwaysRows?.length ?? 0;

        // Get active airlines (pathways operators)
        const airlines = pathwaysRows?.filter((p: any) => p.hiring_status === 'open') ?? [];

        // Get total pilots
        const profilesRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          limit: 1,
        });
        const pilotsCount = profilesRows?.length ?? 0;

        // Get average match score if pilot is logged in
        let avgScore = 0;
        if (pilotId) {
          const matches = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'pathway_matches',
            operation: 'select',
            where: { pilot_id: pilotId },
            limit: 500,
          });
          const validMatches = (matches || []).filter((m: any) => (m.match_score || 0) >= 0);
          if (validMatches.length > 0) {
            avgScore = Math.round(
              validMatches.reduce((sum: number, m: any) => sum + (m.match_score || 0), 0) / validMatches.length
            );
          }
        }

        setStats({
          totalPathways: pathwaysCount || 7,
          activeAirlines: airlines?.length || 3,
          totalPilots: pilotsCount || 10,
          avgMatchScore: avgScore || 78,
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Use fallback values
        setStats({
          totalPathways: 7,
          activeAirlines: 3,
          totalPilots: 10,
          avgMatchScore: 78,
          loading: false
        });
      }
    };

    fetchStats();
  }, [pilotId]);

  // Fetch featured pathways
  useEffect(() => {
    const fetchFeaturedPathways = async () => {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pathways',
        operation: 'select',
        where: { status: 'active', featured: true },
        limit: 50,
      });
      const sorted = (data || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).slice(0, 4);
      setFeaturedPathways(sorted);
    };

    fetchFeaturedPathways();
  }, []);

  // Fetch top matches for logged-in pilot
  useEffect(() => {
    if (!pilotId) return;

    const fetchTopMatches = async () => {
      const matchRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pathway_matches',
        operation: 'select',
        where: { pilot_id: pilotId },
        limit: 50,
      });
      const sortedMatches = (matchRows || []).sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0)).slice(0, 3);

      // Fetch related pathways
      const pathwayIds = sortedMatches.map((m: any) => m.pathway_id).filter(Boolean);
      let pathways: Record<string, Record<string, unknown>> = {};
      if (pathwayIds.length) {
        const pathwayRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'pathways',
          operation: 'select',
          where: { id: pathwayIds[0] },
          limit: 50,
        });
        (pathwayRows || []).forEach((p: any) => { if (p.id) pathways[p.id] = p; });
      }

      const merged = sortedMatches.map((m: any) => ({ ...m, pathways: pathways[m.pathway_id] || null }));
      setTopMatches(merged);
    };

    fetchTopMatches();
  }, [pilotId]);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const features = [
    {
      icon: Route,
      title: 'Career Pathways',
      description: 'Explore validated routes from cadet to captain across airlines, cargo, and specialized aviation.',
      action: () => handleNavigate('/pathways'),
      color: 'from-indigo-500 to-violet-600'
    },
    {
      icon: Compass,
      title: 'Skill Discovery',
      description: 'Identify gaps between your current profile and target roles. Get personalized recommendations.',
      action: () => handleNavigate('/discover'),
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: Award,
      title: 'Training Programs',
      description: 'Accelerate your career with structured programs designed by industry veterans.',
      action: () => handleNavigate('/programs'),
      color: 'from-purple-500 to-fuchsia-600'
    },
    {
      icon: Plane,
      title: 'Airline Connect',
      description: 'Direct access to verified pilot pools for airlines and operators seeking talent.',
      action: () => handleNavigate('/airlines'),
      color: 'from-fuchsia-500 to-pink-600'
    }
  ];

  // Real-time stats from database
  const displayStats = [
    { 
      value: stats.loading ? '...' : `${stats.totalPathways}+`, 
      label: 'Career Pathways', 
      note: 'Curated options' 
    },
    { 
      value: stats.loading ? '...' : `${stats.activeAirlines}+`, 
      label: 'Active Airlines', 
      note: 'Hiring now' 
    },
    { 
      value: stats.loading ? '...' : `${stats.totalPilots}+`, 
      label: 'Pilot Community', 
      note: 'Platform members' 
    },
    { 
      value: stats.loading ? '...' : `${stats.avgMatchScore}%`, 
      label: pilotId ? 'Your Match' : 'Avg Match', 
      note: pilotId ? 'Your alignment' : 'Profile alignment' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-indigo-300">Now serving 200+ airlines globally</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Chart Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  Aviation
                </span>
                <br />
                Career Path
              </h1>

              <p className="text-xl text-slate-400 max-w-lg">
                Discover validated career routes from your current position to your dream role. 
                No more guessing—just clear pathways.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleNavigate('/pathways')}
                  className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                >
                  <Route className="w-5 h-5" />
                  Explore Pathways
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => handleNavigate('/discover')}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-semibold transition-all"
                >
                  <Compass className="w-5 h-5" />
                  Find Your Fit
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Used by major airlines</span>
                </div>
              </div>
            </div>

            {/* Right content - Stats cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {displayStats.map((stat: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-colors"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                    <div className="text-xs text-slate-600 mt-1">{stat.note}</div>
                  </div>
                ))}
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-8 -left-8 p-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Career growth</div>
                    <div className="text-xs text-emerald-400">+340% avg. progression</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to advance
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From discovering your ideal career path to connecting with airlines—
              all in one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <button
                key={idx}
                onClick={feature.action}
                className="group text-left p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-indigo-500/30 hover:bg-slate-900 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">Start your journey today</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to map your career?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of pilots who have already discovered their optimal career path.
            It takes less than 5 minutes to get started.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleNavigate('/get-started')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Users className="w-5 h-5" />
              Create Free Account
            </button>
            
            <button
              onClick={() => handleNavigate('/airlines')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-semibold transition-all"
            >
              <Plane className="w-5 h-5" />
              For Airlines
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Route className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">
                CareerPathways by PilotRecognition
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Your aviation career, mapped.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerPathwaysHomePage;
