import { useState, useEffect, useCallback } from 'react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

export interface AirlinePassportConnection {
  id: string;
  user_id: string;
  airline_id: string;
  airline_name: string;
  airline_code: string;
  logo_url: string;
  status: 'connected' | 'pending' | 'available' | 'disconnected';
  last_synced_at: string | null;
  match_percentage: number;
  flight_hours_synced: boolean;
  competencies_synced: boolean;
  achievements_synced: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseAirlinePassportReturn {
  connections: AirlinePassportConnection[];
  loading: boolean;
  error: string | null;
  refreshConnections: () => Promise<void>;
  connectAirline: (airlineId: string, airlineName: string, airlineCode: string, logoUrl: string) => Promise<void>;
  disconnectAirline: (connectionId: string) => Promise<void>;
  syncAirlineData: (connectionId: string) => Promise<void>;
}

export const useAirlinePassport = (userId?: string): UseAirlinePassportReturn => {
  const [connections, setConnections] = useState<AirlinePassportConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { callApi } = useWorkerAuth();

  const fetchConnections = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'airline_passport_connections',
        operation: 'select',
        where: { user_id: userId },
        limit: 500,
      });
      const data = (rows || []).sort((a: any, b: any) => (b.updated_at || '').localeCompare(a.updated_at || ''));

      setConnections(data as unknown as AirlinePassportConnection[]);
    } catch (err: any) {
      console.error('Error fetching airline connections:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, callApi]);

  const connectAirline = async (
    airlineId: string,
    airlineName: string,
    airlineCode: string,
    logoUrl: string
  ) => {
    if (!userId) return;

    try {
      setError(null);

      // Check if already exists
      const existingRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'airline_passport_connections',
        operation: 'select',
        where: { user_id: userId, airline_id: airlineId },
        limit: 1,
      });
      const existing = existingRows?.[0];

      if (existing) {
        // Update to pending/connected
        await callApi('queryTable', {
          table: 'airline_passport_connections',
          operation: 'update',
          id: existing.id as string,
          data: {
            status: 'pending',
            updated_at: new Date().toISOString()
          },
        });
      } else {
        // Create new connection
        await callApi('queryTable', {
          table: 'airline_passport_connections',
          operation: 'insert',
          data: {
            user_id: userId,
            airline_id: airlineId,
            airline_name: airlineName,
            airline_code: airlineCode,
            logo_url: logoUrl,
            status: 'pending',
            match_percentage: 0,
            flight_hours_synced: false,
            competencies_synced: false,
            achievements_synced: false
          },
        });
      }

      await fetchConnections();
    } catch (err: any) {
      console.error('Error connecting airline:', err);
      setError(err.message);
    }
  };

  const disconnectAirline = async (connectionId: string) => {
    try {
      setError(null);

      await callApi('queryTable', {
        table: 'airline_passport_connections',
        operation: 'delete',
        id: connectionId,
      });

      await fetchConnections();
    } catch (err: any) {
      console.error('Error disconnecting airline:', err);
      setError(err.message);
    }
  };

  const syncAirlineData = async (connectionId: string) => {
    if (!userId) return;

    try {
      setError(null);

      // Get user's pilot portfolio data
      const portfolioRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_portfolio_data',
        operation: 'select',
        where: { user_id: userId },
        limit: 1,
      });
      const portfolio = portfolioRows?.[0];

      // Calculate match percentage based on portfolio data
      const matchPercentage = calculateMatchPercentage(portfolio);

      // Update connection with synced data
      await callApi('queryTable', {
        table: 'airline_passport_connections',
        operation: 'update',
        id: connectionId,
        data: {
          status: 'connected',
          last_synced_at: new Date().toISOString(),
          match_percentage: matchPercentage,
          flight_hours_synced: !!(portfolio as any)?.total_hours,
          competencies_synced: !!((portfolio as any)?.core_competencies?.length > 0),
          achievements_synced: !!((portfolio as any)?.achievements?.length > 0)
        },
      });

      await fetchConnections();
    } catch (err: any) {
      console.error('Error syncing airline data:', err);
      setError(err.message);
    }
  };

  const calculateMatchPercentage = (portfolio: any): number => {
    if (!portfolio) return 0;
    
    let score = 0;
    let maxScore = 0;

    // Flight hours (max 30 points)
    maxScore += 30;
    if (portfolio.total_hours >= 1500) score += 30;
    else if (portfolio.total_hours >= 500) score += 20;
    else if (portfolio.total_hours > 0) score += 10;

    // PIC hours (max 25 points)
    maxScore += 25;
    if (portfolio.pic_hours >= 500) score += 25;
    else if (portfolio.pic_hours >= 200) score += 15;
    else if (portfolio.pic_hours > 0) score += 5;

    // Licenses (max 20 points)
    maxScore += 20;
    const licenses = portfolio.licenses || [];
    if (licenses.some((l: any) => l.type?.includes('ATPL') || l.name?.includes('ATPL'))) score += 20;
    else if (licenses.some((l: any) => l.type?.includes('CPL') || l.name?.includes('CPL'))) score += 15;
    else if (licenses.length > 0) score += 10;

    // Type ratings (max 15 points)
    maxScore += 15;
    const typeRatings = portfolio.type_ratings || [];
    if (typeRatings.length >= 2) score += 15;
    else if (typeRatings.length === 1) score += 10;

    // Competencies (max 10 points)
    maxScore += 10;
    if (portfolio.core_competencies?.length >= 5) score += 10;
    else if (portfolio.core_competencies?.length > 0) score += 5;

    return Math.round((score / maxScore) * 100) || 0;
  };

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    loading,
    error,
    refreshConnections: fetchConnections,
    connectAirline,
    disconnectAirline,
    syncAirlineData
  };
};
