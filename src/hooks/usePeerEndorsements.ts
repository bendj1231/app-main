import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchEndorsements();
    }
  }, [userId]);

  const fetchEndorsements = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('peer_endorsements')
        .select('*')
        .eq('endorsee_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch endorsements:', error);
      } else {
        setEndorsements(data || []);
        if (data && data.length > 0) {
          const avg = data.reduce((sum, e) => sum + (e.rating || 0), 0) / data.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
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
      const { data, error } = await supabase
        .from('peer_endorsements')
        .insert({
          endorser_id: endorserId,
          endorsee_id: endorseeId,
          endorsement_type: endorsementType,
          rating,
          comment,
          relationship,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create endorsement:', error);
        return null;
      }

      if (endorseeId === userId) {
        await fetchEndorsements();
      }
      return data;
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
      const { error } = await supabase
        .from('peer_endorsements')
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', endorsementId);

      if (error) {
        console.error('Failed to update endorsement:', error);
        return false;
      }

      await fetchEndorsements();
      return true;
    } catch (error) {
      console.error('Error in updateEndorsement:', error);
      return false;
    }
  };

  const deleteEndorsement = async (endorsementId: string) => {
    try {
      const { error } = await supabase
        .from('peer_endorsements')
        .delete()
        .eq('id', endorsementId);

      if (error) {
        console.error('Failed to delete endorsement:', error);
        return false;
      }

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
      const { data, error } = await supabase
        .from('peer_endorsements')
        .select('*')
        .eq('endorser_id', endorserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch given endorsements:', error);
        return [];
      }

      return data || [];
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
