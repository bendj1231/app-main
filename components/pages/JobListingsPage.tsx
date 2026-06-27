import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Plane, 
  Briefcase, 
  Clock, 
  ExternalLink,
  Building2,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { jobApplicationListings } from '../portal/pages/PilotJobDatabasePage';
import { useAuth } from '../src/contexts/AuthContext';

interface JobListingsPageProps {
  onNavigate?: (page: string) => void;
}

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  matchPct: number;
  isBlindSpot: boolean;
  missingRating?: string;
  hiringStatus: string;
}

const JobListingsPage: React.FC<JobListingsPageProps> = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [blindSpotPicks, setBlindSpotPicks] = useState<JobMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchStats, setMatchStats] = useState({ totalJobs: 0, blindSpotCount: 0, above75: 0, above90: 0 });

  // Call Firebase function to get job matches
  useEffect(() => {
    const fetchJobMatches = async () => {
      if (!currentUser) return;
      
      setLoadingMatches(true);
      try {
        const response = await fetch('https://us-central1-pilotrecognition-recognition.cloudfunctions.net/pathways_getJobMatches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            jobListings: jobApplicationListings.map((job, index) => ({
              id: `job-${index}`,
              title: job.title,
              company: job.company,
              aircraft: job.aircraft,
              location: job.location,
              role: job.role,
              status: job.status,
              flightTime: job.flightTime,
              picTime: job.picTime,
              typeRating: job.typeRating,
              url: job.url
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          setJobMatches(data.scoredJobs || []);
          setBlindSpotPicks(data.blindSpotPicks || []);
          setMatchStats({
            totalJobs: data.totalJobs || 0,
            blindSpotCount: data.blindSpotCount || 0,
            above75: data.above75 || 0,
            above90: data.above90 || 0
          });
        }
      } catch (error) {
        console.error('Error fetching job matches:', error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchJobMatches();
  }, [currentUser]);

  // Create a map of job IDs to match percentages
  const jobMatchMap = useMemo(() => {
    const map = new Map<string, JobMatch>();
    jobMatches.forEach(match => {
      map.set(match.jobId, match);
    });
    return map;
  }, [jobMatches]);

  // Extract unique values for filters
  const aircraftTypes = useMemo(() => 
    Array.from(new Set(jobApplicationListings.map(job => job.aircraft).filter(Boolean))),
    []
  );
  const locations = useMemo(() => 
    Array.from(new Set(jobApplicationListings.map(job => job.location).filter(Boolean))),
    []
  );
  const roles = useMemo(() => 
    Array.from(new Set(jobApplicationListings.map(job => job.role).filter(Boolean))),
    []
  );

  // Category filters
  const categoryFilters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'low-timer', label: 'Low Timer' },
    { id: 'mid-timer', label: 'Mid Timer' },
    { id: 'high-timer', label: 'High Timer' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'airline', label: 'Airline' },
    { id: 'captain', label: 'Captain' },
    { id: 'first-officer', label: 'First Officer' },
    { id: 'cadet-program', label: 'Cadet Program' }
  ];

  // Parse hours from string
  const parseHours = (value?: string | number) => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'number') return value;
    const numeric = value.replace(/[^0-9.]/g, '');
    return numeric ? parseInt(numeric, 10) : null;
  };

  // Job category matching
  const jobMatchesCategory = (job: typeof jobApplicationListings[number], category: string) => {
    if (category === 'all') return true;
    const role = (job.role || '').toLowerCase();
    const title = job.title.toLowerCase();
    const company = (job.company || '').toLowerCase();
    const flightHours = parseHours(job.flightTime || job.picTime);

    switch (category) {
      case 'low-timer': {
        if (flightHours !== null && flightHours < 1000) return true;
        return role.includes('cadet') || role.includes('second in command') || title.includes('cadet');
      }
      case 'mid-timer':
        return flightHours !== null && flightHours >= 1000 && flightHours < 4000;
      case 'high-timer':
        return flightHours !== null && flightHours >= 4000;
      case 'corporate':
        return role.includes('corporate') || title.includes('corporate') || title.includes('pilot in command') || company.includes('jet') || company.includes('aviation');
      case 'airline':
        return company.includes('air') || company.includes('airline');
      case 'captain':
        return role.includes('captain');
      case 'first-officer':
        return role.includes('first officer');
      case 'cadet-program':
        return role.includes('cadet') || title.includes('cadet');
      default:
        return true;
    }
  };

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobApplicationListings.filter(job => {
      const matchesAircraft = selectedAircraft === 'all' || job.aircraft === selectedAircraft;
      const matchesLocation = selectedLocation === 'all' || job.location?.includes(selectedLocation);
      const matchesRole = selectedRole === 'all' || job.role === selectedRole;
      const matchesCategory = jobMatchesCategory(job, activeCategory);
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query.length === 0 ||
        [job.title, job.company, job.aircraft, job.location, job.role, job.status]
          .filter(Boolean)
          .some(field => field!.toLowerCase().includes(query));

      return matchesAircraft && matchesLocation && matchesRole && matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedAircraft, selectedLocation, selectedRole, activeCategory]);

  const toggleJobExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 backdrop-blur-sm">
        <div className="mx-auto pr-6 py-4 w-full max-w-[1800px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => onNavigate?.('home')}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform hover:scale-105"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* Logo */}
                <div className="flex flex-col">
                  <span style={{ fontFamily: 'Georgia, serif' }} className="text-black text-2xl font-normal">
                    Discover <span className="text-red-600">Jobs</span>
                  </span>
                  <span className="text-xs text-slate-600 font-normal">
                    pilotrecognition.com
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                { label: 'Pilot Pathways', page: 'pathways-modern' },
                { label: 'Job Listings', page: 'job-listings' },
              ].map(({ label, page }) => {
                const isActive = page === 'job-listings';
                return (
                <button
                  key={page}
                  onClick={() => onNavigate && onNavigate(page)}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap"
                  style={{
                    color: isActive ? '#2563eb' : '#0f172a',
                    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                    paddingBottom: '4px'
                  }}
                >
                  {label}
                </button>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-3">
              {/* Profile section */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">
                      {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                    </span>
                    <span className="text-[10px] text-slate-500">Signed In</span>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {userProfile?.profile_image_url ? (
                      <img
                        src={userProfile.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {currentUser?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate('login')}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('become-member')}
                    className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Become Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Title Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-400 mb-3">Discover Job Listings</p>
          <h1 className="text-3xl md:text-4xl font-serif font-normal mb-2">
            Pilot Job Listings
          </h1>
          <p className="text-blue-100/80 text-lg max-w-2xl">
            Browse {jobApplicationListings.length}+ active pilot opportunities. Filter by aircraft, location, and experience level.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xs text-blue-200 uppercase tracking-wider">Live Jobs</div>
              <div className="text-2xl font-bold">{jobApplicationListings.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xs text-blue-200 uppercase tracking-wider">Airlines</div>
              <div className="text-2xl font-bold">{new Set(jobApplicationListings.map(j => j.company)).size}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xs text-blue-200 uppercase tracking-wider">Aircraft Types</div>
              <div className="text-2xl font-bold">{aircraftTypes.length}</div>
            </div>
          </div>

          {/* Match Statistics (if logged in) */}
          {currentUser && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              {loadingMatches ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-blue-100">Calculating your job matches...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Your Match Statistics</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{matchStats.above90}</div>
                      <div className="text-xs text-blue-200">90%+ Matches</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{matchStats.above75}</div>
                      <div className="text-xs text-blue-200">75%+ Matches</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{matchStats.blindSpotCount}</div>
                      <div className="text-xs text-blue-200">Blind Spots</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{matchStats.totalJobs}</div>
                      <div className="text-xs text-blue-200">Total Jobs</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, airline, aircraft, or location..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Aircraft Type</label>
              <select
                value={selectedAircraft}
                onChange={(e) => setSelectedAircraft(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="all">All Aircraft</option>
                {aircraftTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categoryFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === filter.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredJobs.length}</span> of {jobApplicationListings.length} jobs
          </div>
        </div>
      </div>

      {/* Job Listings - Vertical Scroll */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Blind Spot Picks Section */}
        {currentUser && !loadingMatches && blindSpotPicks.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900">Blind Spot Picks</h2>
              <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {blindSpotPicks.length} jobs you might have missed
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blindSpotPicks.slice(0, 4).map((blindSpot) => (
                <div
                  key={blindSpot.jobId}
                  className="bg-white rounded-xl p-4 border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          {Math.round(blindSpot.matchPct)}% Match
                        </span>
                        <span className="text-xs text-purple-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Blind Spot
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{blindSpot.title}</h3>
                      <p className="text-sm text-slate-600">{blindSpot.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-xs text-slate-500">High Match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredJobs.map((job, index) => {
            const isExpanded = expandedJobId === `${job.title}-${index}`;
            const jobId = `job-${index}`;
            const jobMatch = jobMatchMap.get(jobId);
            const matchPercentage = jobMatch ? Math.round(jobMatch.matchPct) : null;
            const isBlindSpot = jobMatch?.isBlindSpot;
            
            return (
              <div
                key={`${job.title}-${index}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? 'border-blue-300 shadow-lg shadow-blue-500/10' : 
                  isBlindSpot ? 'border-purple-300 shadow-md shadow-purple-500/10 hover:border-purple-400' : 
                  'border-slate-200 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {/* Job Header - Always visible */}
                <div
                  onClick={() => toggleJobExpand(`${job.title}-${index}`)}
                  className="p-5 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 text-lg">{job.title}</h3>
                            {matchPercentage !== null && (
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                matchPercentage >= 90 ? 'bg-green-100 text-green-700' :
                                matchPercentage >= 75 ? 'bg-blue-100 text-blue-700' :
                                matchPercentage >= 60 ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {matchPercentage}% Match
                              </span>
                            )}
                            {isBlindSpot && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                <Sparkles className="w-3 h-3" />
                                Blind Spot
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                        <Plane className="w-4 h-4" />
                        {job.aircraft}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      {job.role && (
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                          {job.role}
                        </span>
                      )}
                      <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                        job.status === 'Hiring Now!' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {job.status || 'Open'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Flight Time */}
                      {job.flightTime && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            Flight Time Required
                          </div>
                          <div className="font-semibold text-slate-900">{job.flightTime}</div>
                        </div>
                      )}

                      {/* PIC Time */}
                      {job.picTime && job.picTime !== '0' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            PIC Time
                          </div>
                          <div className="font-semibold text-slate-900">{job.picTime}</div>
                        </div>
                      )}

                      {/* Type Rating */}
                      {job.typeRating && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <Plane className="w-3.5 h-3.5" />
                            Type Rating
                          </div>
                          <div className="font-semibold text-slate-900">{job.typeRating}</div>
                        </div>
                      )}

                      {/* License */}
                      {job.license && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            License
                          </div>
                          <div className="font-semibold text-slate-900">{job.license}</div>
                        </div>
                      )}

                      {/* Medical */}
                      {job.medicalClass && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Medical
                          </div>
                          <div className="font-semibold text-slate-900">{job.medicalClass}</div>
                        </div>
                      )}

                      {/* Compensation */}
                      {job.compensation && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            Compensation
                          </div>
                          <div className="font-semibold text-slate-900">{job.compensation}</div>
                        </div>
                      )}

                      {/* Visa Sponsorship */}
                      {job.visaSponsorship && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Visa Sponsorship
                          </div>
                          <div className="font-semibold text-slate-900">{job.visaSponsorship}</div>
                        </div>
                      )}

                      {/* ICAO ELP */}
                      {job.icaoElpLevel && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ICAO ELP Level
                          </div>
                          <div className="font-semibold text-slate-900">{job.icaoElpLevel}</div>
                        </div>
                      )}
                    </div>

                    {/* Posted Date */}
                    {job.posted && (
                      <div className="mt-4 text-sm text-slate-500">
                        Posted: {job.posted}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-200">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Full Listing
                      </a>
                      <button
                        onClick={() => toggleJobExpand(`${job.title}-${index}`)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                        Close Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more listings</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAircraft('all');
                setSelectedLocation('all');
                setSelectedRole('all');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>Job listings sourced from Pilot Career Center and other aviation career platforms.</p>
          <p className="mt-2">Always verify details on the official airline website before applying.</p>
        </div>
      </footer>
    </div>
  );
};

export default JobListingsPage;
