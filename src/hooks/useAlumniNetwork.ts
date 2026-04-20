import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const fetchConnections = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alumni_network')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch alumni connections:', error);
      } else {
        setConnections(data || []);
        const highValue = (data || []).filter(c => c.professional_value >= 4).length;
        setHighValueConnections(highValue);
      }
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
      const { data, error } = await supabase
        .from('alumni_network')
        .insert({
          user_id: userId,
          alumni_id: alumniId,
          connection_type: connectionType,
          interaction_frequency: interactionFrequency,
          professional_value: professionalValue,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add connection:', error);
        return null;
      }

      await fetchConnections();
      return data;
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
      const { error } = await supabase
        .from('alumni_network')
        .update({
          interaction_frequency: interactionFrequency,
          professional_value: professionalValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', connectionId);

      if (error) {
        console.error('Failed to update connection:', error);
        return false;
      }

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
      const { error } = await supabase
        .from('alumni_network')
        .delete()
        .eq('id', connectionId);

      if (error) {
        console.error('Failed to delete connection:', error);
        return false;
      }

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
