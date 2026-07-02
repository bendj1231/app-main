import { useState, useEffect, useCallback, useRef } from 'react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

export interface JobMatchRequirement {
  label: string;
  required: string;
  userValue: string;
  status: 'met' | 'partial' | 'missing';
  gap?: string;
}

export interface MatchReason {
  type: 'strength' | 'match' | 'opportunity';
  text: string;
  detail?: string;
}

export interface JobMatchData {
  id: string;
  match_id: string;
  position: string;
  aircraft: string;
  airline: string;
  location: string;
  airline_logo?: string;
  salary?: string;
  posted_date: string;
  match_score: number;
  requirements: JobMatchRequirement[];
  match_reasons: MatchReason[];
  missing_requirements: string[];
  gap_hours: number;
  missing_licenses: string[];
  missing_type_ratings: string[];
  hours_match: number;
  license_match: number;
  type_rating_match: number;
  experience_match: number;
}

interface UsePilotJobMatchesOptions {
  userId?: string;
  limit?: number;
  enableRealtime?: boolean;
}

interface UsePilotJobMatchesReturn {
  matches: JobMatchData[];
  interestJobs: JobMatchData[];
  loading: boolean;
  error: string | null;
  hasProfileData: boolean;
  totalJobs: number;
  refetch: () => Promise<void>;
}

// Transform database match to UI format
const transformMatchData = (dbMatch: any): JobMatchData => {
  // Build requirements array from the match data
  const requirements: JobMatchRequirement[] = [];
  
  // Add hours requirement
  const hoursStatus = dbMatch.hours_match >= 40 ? 'met' : 
                     dbMatch.hours_match >= 30 ? 'partial' : 'missing';
  requirements.push({
    label: 'Total Hours',
    required: dbMatch.gap_hours > 0 ? `${dbMatch.gap_hours} more` : 'Met',
    userValue: hoursStatus === 'met' ? '✓' : hoursStatus === 'partial' ? '~' : '!',
    status: hoursStatus,
    gap: dbMatch.gap_hours > 0 ? `Need ${dbMatch.gap_hours} more hours` : undefined
  });
  
  // Add license requirement
  const licenseStatus = dbMatch.license_match >= 25 ? 'met' : 'missing';
  if (dbMatch.missing_licenses && dbMatch.missing_licenses.length > 0) {
    requirements.push({
      label: 'License',
      required: dbMatch.missing_licenses[0],
      userValue: '!',
      status: 'missing',
      gap: `Missing: ${dbMatch.missing_licenses[0]}`
    });
  } else {
    requirements.push({
      label: 'License',
      required: 'Qualified',
      userValue: '✓',
      status: 'met'
    });
  }
  
  // Add type rating requirement
  if (dbMatch.missing_type_ratings && dbMatch.missing_type_ratings.length > 0) {
    requirements.push({
      label: 'Type Rating',
      required: dbMatch.missing_type_ratings[0],
      userValue: '!',
      status: 'missing',
      gap: `Missing: ${dbMatch.missing_type_ratings[0]}`
    });
  } else {
    requirements.push({
      label: 'Type Rating',
      required: 'Current',
      userValue: '✓',
      status: 'met'
    });
  }
  
  // Add experience requirement
  const expStatus = dbMatch.experience_match >= 15 ? 'met' :
                   dbMatch.experience_match >= 8 ? 'partial' : 'missing';
  requirements.push({
    label: 'Experience',
    required: expStatus === 'met' ? 'Qualified' : 'Need more',
    userValue: expStatus === 'met' ? '✓' : expStatus === 'partial' ? '~' : '!',
    status: expStatus
  });
  
  return {
    id: dbMatch.job_id,
    match_id: dbMatch.match_id,
    position: dbMatch.job_position,
    aircraft: dbMatch.aircraft,
    airline: dbMatch.airline,
    location: dbMatch.location,
    airline_logo: dbMatch.airline_logo,
    salary: dbMatch.salary,
    posted_date: dbMatch.posted_date,
    match_score: dbMatch.match_score,
    requirements,
    match_reasons: dbMatch.match_reasons || [],
    missing_requirements: dbMatch.missing_requirements || [],
    gap_hours: dbMatch.gap_hours || 0,
    missing_licenses: dbMatch.missing_licenses || [],
    missing_type_ratings: dbMatch.missing_type_ratings || [],
    hours_match: dbMatch.hours_match || 0,
    license_match: dbMatch.license_match || 0,
    type_rating_match: dbMatch.type_rating_match || 0,
    experience_match: dbMatch.experience_match || 0
  };
};

// Transform job data for interest-based matches
const transformInterestJobData = (job: any): JobMatchData => {
  return {
    id: job.id,
    match_id: `interest-${job.id}`,
    position: job.job_position,
    aircraft: job.aircraft,
    airline: job.airline,
    location: job.location,
    airline_logo: job.airline_logo,
    salary: job.salary,
    posted_date: job.posted_date,
    match_score: 0,
    requirements: [],
    match_reasons: [{ type: 'opportunity', text: 'Matches your interests' }],
    missing_requirements: [],
    gap_hours: 0,
    missing_licenses: [],
    missing_type_ratings: [],
    hours_match: 0,
    license_match: 0,
    type_rating_match: 0,
    experience_match: 0
  };
};

export const usePilotJobMatches = ({
  userId,
  limit = 10,
  enableRealtime = true
}: UsePilotJobMatchesOptions): UsePilotJobMatchesReturn => {
  const [matches, setMatches] = useState<JobMatchData[]>([]);
  const [interestJobs, setInterestJobs] = useState<JobMatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfileData, setHasProfileData] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const channelRef = useRef<any>(null);

  const { callApi } = useWorkerAuth();

  const fetchMatches = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, check if user has a pilot profile
      const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_recognition_matches',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const profile = profileRows?.[0];

      const hasData = !!((profile?.total_hours as number) || (Array.isArray(profile?.licenses) && (profile?.licenses as string[]).length > 0));
      setHasProfileData(hasData);

      // Get total active jobs count
      const jobRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'job_database',
        operation: 'select',
        where: { status: 'active' },
        limit: 1000,
      });
      setTotalJobs((jobRows || []).length);

      // Fetch credential-based matches if profile exists
      if (profile) {
        // Fetch jobs and matches, then do client-side filtering
        const [jobDbRows, matchRows] = await Promise.all([
          callApi<Record<string, unknown>[]>('queryTable', {
            table: 'job_database',
            operation: 'select',
            where: { status: 'active' },
            limit: 500,
          }),
          callApi<Record<string, unknown>[]>('queryTable', {
            table: 'pilot_job_matches',
            operation: 'select',
            where: { user_id: userId },
            limit: 500,
          }),
        ]);

        const dbMatches = (matchRows || []).map((m: any) => {
          const job = (jobDbRows || []).find((j: any) => j.id === m.job_id || j.id === m.match_id);
          return { ...m, ...job };
        }).slice(0, limit);

        if (dbMatches.length > 0) {
          const transformedMatches = dbMatches.map(transformMatchData);
          setMatches(transformedMatches);
        } else {
          setMatches([]);
        }
      } else {
        setMatches([]);
      }

      // Fetch interest-based jobs
      // First get user interests
      const interestRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_interests',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const interests = interestRows?.[0];

      if (interests?.interest_tags && Array.isArray(interests.interest_tags) && (interests.interest_tags as string[]).length > 0) {
        // Query jobs matching those interests
        const interestJobRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'job_database',
          operation: 'select',
          where: { status: 'active' },
          limit: 500,
        });
        const tags = interests.interest_tags as string[];
        const interestJobData = (interestJobRows || []).filter((job: any) => {
          const jobTags = job.tags || [];
          return Array.isArray(jobTags) && jobTags.some((t: string) => tags.includes(t));
        }).slice(0, limit);

        const transformedInterestJobs = interestJobData.map(transformInterestJobData);
        setInterestJobs(transformedInterestJobs);
      } else {
        setInterestJobs([]);
      }
    } catch (err: any) {
      console.error('Error fetching job matches:', err);
      setError(err.message || 'Failed to fetch job matches');
      setMatches([]);
      setInterestJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit, callApi]);

  // Fetch matches on mount and when userId changes
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Set up polling instead of realtime subscriptions
  useEffect(() => {
    if (!userId || !enableRealtime) return;

    const interval = setInterval(() => {
      fetchMatches();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, enableRealtime, fetchMatches]);

  return {
    matches,
    interestJobs,
    loading,
    error,
    hasProfileData,
    totalJobs,
    refetch: fetchMatches
  };
};

// Helper hook to get user profile
export const usePilotProfile = (userId?: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const rows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'pilot_recognition_matches',
          operation: 'select',
          where: { user_id: userId },
          limit: 1,
        });
        const data = rows?.[0];

        setProfile(data || null);
      } catch (err: any) {
        console.error('Error fetching pilot profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, callApi]);

  return { profile, loading, error };
};
