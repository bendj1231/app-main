import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export type EndorsementType = 'professional' | 'leadership' | 'teamwork' | 'technical' | 'communication';

export interface PeerEndorsement {
  id: string;
  endorser_id: string;
  endorsee_id: string;
  endorsement_type: EndorsementType;
  rating: number;
  comment: string | null;
  relationship: string | null;
  created_at: string;
  updated_at: string;
}

export const usePeerEndorsements = (userId: string | null) => {
  const [endorsements, setEndorsements] = useState<PeerEndorsement[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchEndorsements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchEndorsements = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'peer_endorsements',
        operation: 'select',
        where: { endorsee_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      setEndorsements((data || []) as unknown as PeerEndorsement[]);
      if (data && data.length > 0) {
        const avg = data.reduce((sum, e) => sum + ((e as Record<string, unknown>).rating as number || 0), 0) / data.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error in fetchEndorsements:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEndorsement = async (
    endorserId: string,
    endorseeId: string,
    endorsementType: EndorsementType,
    rating: number,
    comment: string | null = null,
    relationship: string | null = null
  ) => {
    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'peer_endorsements',
        operation: 'insert',
        data: {
          endorser_id: endorserId,
          endorsee_id: endorseeId,
          endorsement_type: endorsementType,
          rating,
          comment,
          relationship,
        },
      });

      if (endorseeId === userId) {
        await fetchEndorsements();
      }
      return data as unknown as PeerEndorsement;
    } catch (error) {
      console.error('Error in createEndorsement:', error);
      return null;
    }
  };

  const updateEndorsement = async (
    endorsementId: string,
    rating: number,
    comment: string | null = null
  ) => {
    try {
      await callApi('queryTable', {
        table: 'peer_endorsements',
        operation: 'update',
        id: endorsementId,
        data: {
          rating,
          comment,
        },
      });

      await fetchEndorsements();
      return true;
    } catch (error) {
      console.error('Error in updateEndorsement:', error);
      return false;
    }
  };

  const deleteEndorsement = async (endorsementId: string) => {
    try {
      await callApi('queryTable', {
        table: 'peer_endorsements',
        operation: 'delete',
        id: endorsementId,
      });

      await fetchEndorsements();
      return true;
    } catch (error) {
      console.error('Error in deleteEndorsement:', error);
      return false;
    }
  };

  const getEndorsementsByType = (endorsementType: EndorsementType) => {
    return endorsements.filter(e => e.endorsement_type === endorsementType);
  };

  const getEndorsementsGiven = async (endorserId: string) => {
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'peer_endorsements',
        operation: 'select',
        where: { endorser_id: endorserId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      return (data || []) as unknown as PeerEndorsement[];
    } catch (error) {
      console.error('Error in getEndorsementsGiven:', error);
      return [];
    }
  };

  return {
    endorsements,
    averageRating,
    loading,
    fetchEndorsements,
    createEndorsement,
    updateEndorsement,
    deleteEndorsement,
    getEndorsementsByType,
    getEndorsementsGiven,
  };
};
