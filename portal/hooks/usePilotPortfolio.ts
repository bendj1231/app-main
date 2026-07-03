import { useState, useEffect, useCallback } from 'react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

export interface PilotPortfolio {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  linkedin_url: string;
  total_hours: number;
  pic_hours: number;
  ifr_hours: number;
  night_hours: number;
  simulators: string[];
  licenses: { type?: string; name?: string; issuer?: string; year?: string }[];
  type_ratings: string[];
  medical_class: string;
  medical_expiry: string;
  core_competencies: string[];
  skills: string[];
  experience: {
    role?: string;
    job_title?: string;
    company?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    achievements?: string[];
  }[];
  education: {
    degree?: string;
    qualification?: string;
    institution?: string;
    year?: string;
  }[];
  summary: string;
  bio: string;
  mentorship_hours: number;
  mentorship_observations: number;
  mentorship_cases: number;
  achievements: {
    title?: string;
    name?: string;
    type?: string;
    category?: string;
    issuer?: string;
    year?: string;
    date?: string;
  }[];
  awards_count: number;
  certifications_count: number;
  last_synced_at: string;
  synced_from_recognition: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsePilotPortfolioReturn {
  portfolio: PilotPortfolio | null;
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
  updatePortfolio: (data: Partial<PilotPortfolio>) => Promise<void>;
  syncFromRecognition: (recognitionData: any) => Promise<void>;
}

export const usePilotPortfolio = (userId?: string): UsePilotPortfolioReturn => {
  const [portfolio, setPortfolio] = useState<PilotPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { callApi } = useWorkerAuth();

  const fetchPortfolio = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const data = rows?.[0];

      if (data) {
        setPortfolio(data as PilotPortfolio);
      } else {
        // Create default portfolio if none exists
        await createDefaultPortfolio();
      }
    } catch (err: any) {
      console.error('Error fetching pilot portfolio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, callApi]);

  const createDefaultPortfolio = async () => {
    if (!userId) return;

    try {
      const defaultPortfolio = {
        user_id: userId,
        first_name: '',
        last_name: '',
        total_hours: 0,
        pic_hours: 0,
        ifr_hours: 0,
        night_hours: 0,
        simulators: [],
        licenses: [],
        type_ratings: [],
        core_competencies: [],
        skills: [],
        experience: [],
        education: [],
        achievements: [],
        mentorship_hours: 0,
        mentorship_observations: 0,
        mentorship_cases: 0,
        awards_count: 0,
        certifications_count: 0
      };

      const data = await callApi('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'insert',
        data: defaultPortfolio,
      });
      setPortfolio(data as PilotPortfolio);
    } catch (err: any) {
      console.error('Error creating default portfolio:', err);
      setError(err.message);
    }
  };

  const updatePortfolio = async (data: Partial<PilotPortfolio>) => {
    if (!userId) return;

    try {
      setError(null);

      const existing = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const id = existing?.[0]?.id as string;
      if (!id) throw new Error('Portfolio not found');

      await callApi('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'update',
        id,
        data: {
          ...data,
          updated_at: new Date().toISOString()
        },
      });

      await fetchPortfolio();
    } catch (err: any) {
      console.error('Error updating portfolio:', err);
      setError(err.message);
    }
  };

  const syncFromRecognition = async (recognitionData: any) => {
    if (!userId || !recognitionData) return;

    try {
      setError(null);

      // Extract relevant data from Recognition & Achievements
      const syncData = {
        total_hours: recognitionData.totalHours || 0,
        pic_hours: recognitionData.picHours || 0,
        ifr_hours: recognitionData.ifrHours || 0,
        night_hours: recognitionData.nightHours || 0,
        achievements: recognitionData.achievements || [],
        awards_count: recognitionData.awardsCount || 0,
        certifications_count: recognitionData.certificationsCount || 0,
        licenses: recognitionData.licenses || [],
        core_competencies: recognitionData.coreCompetencies || [],
        skills: recognitionData.skills || [],
        experience: recognitionData.experience || [],
        education: recognitionData.education || [],
        summary: recognitionData.summary || recognitionData.bio || '',
        last_synced_at: new Date().toISOString(),
        synced_from_recognition: true
      };

      const existing = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const id = existing?.[0]?.id as string;
      if (!id) throw new Error('Portfolio not found');

      await callApi('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'update',
        id,
        data: syncData,
      });

      await fetchPortfolio();
    } catch (err: any) {
      console.error('Error syncing from recognition:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    refreshPortfolio: fetchPortfolio,
    updatePortfolio,
    syncFromRecognition
  };
};
