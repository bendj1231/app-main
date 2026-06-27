import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export type ConnectionType = 'classmate' | 'mentor' | 'colleague' | 'friend';
export type InteractionFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'rarely';

export interface AlumniNetwork {
  id: string;
  user_id: string;
  alumni_id: string;
  connection_type: ConnectionType;
  interaction_frequency: InteractionFrequency;
  professional_value: number;
  created_at: string;
  updated_at: string;
}

export const useAlumniNetwork = (userId: string | null) => {
  const [connections, setConnections] = useState<AlumniNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [highValueConnections, setHighValueConnections] = useState(0);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchConnections = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'alumni_network',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      setConnections((data || []) as unknown as AlumniNetwork[]);
      const highValue = (data || []).filter(c => (c as Record<string, unknown>).professional_value as number >= 4).length;
      setHighValueConnections(highValue);
    } catch (error) {
      console.error('Error in fetchConnections:', error);
    } finally {
      setLoading(false);
    }
  };

  const addConnection = async (
    alumniId: string,
    connectionType: ConnectionType,
    interactionFrequency: InteractionFrequency,
    professionalValue: number
  ) => {
    if (!userId) return null;

    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'alumni_network',
        operation: 'insert',
        data: {
          user_id: userId,
          alumni_id: alumniId,
          connection_type: connectionType,
          interaction_frequency: interactionFrequency,
          professional_value: professionalValue,
        },
      });

      await fetchConnections();
      return data as unknown as AlumniNetwork;
    } catch (error) {
      console.error('Error in addConnection:', error);
      return null;
    }
  };

  const updateConnection = async (
    connectionId: string,
    interactionFrequency?: InteractionFrequency,
    professionalValue?: number
  ) => {
    if (!userId) return false;

    try {
      await callApi('queryTable', {
        table: 'alumni_network',
        operation: 'update',
        id: connectionId,
        data: {
          interaction_frequency: interactionFrequency,
          professional_value: professionalValue,
        },
      });

      await fetchConnections();
      return true;
    } catch (error) {
      console.error('Error in updateConnection:', error);
      return false;
    }
  };

  const deleteConnection = async (connectionId: string) => {
    if (!userId) return false;

    try {
      await callApi('queryTable', {
        table: 'alumni_network',
        operation: 'delete',
        id: connectionId,
      });

      await fetchConnections();
      return true;
    } catch (error) {
      console.error('Error in deleteConnection:', error);
      return false;
    }
  };

  const getConnectionsByType = (connectionType: ConnectionType) => {
    return connections.filter(c => c.connection_type === connectionType);
  };

  const getHighValueConnections = () => {
    return connections.filter(c => c.professional_value >= 4);
  };

  return {
    connections,
    highValueConnections,
    loading,
    fetchConnections,
    addConnection,
    updateConnection,
    deleteConnection,
    getConnectionsByType,
    getHighValueConnections,
  };
};
