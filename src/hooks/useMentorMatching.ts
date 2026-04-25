/**
 * useMentorMatching Hook
 * 
 * Matches mentees with mentors based on experience, aircraft types, and career stage
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MentorProfile {
  id: string;
  full_name: string;
  email: string;
  profile_image_url?: string;
  total_flight_hours: number;
  aircraft_rated_on?: string;
  experience_description?: string;
  mentor_tier?: string;
  mentorship_hours: number;
  mentorship_endorsement: number;
  country?: string;
  ratings?: string[];
  program_interests?: string[];
  pathway_interests?: string[];
}

export interface MentorMatch {
  mentor: MentorProfile;
  compatibilityScore: number;
  matchReasons: string[];
}

export interface MenteeProfile {
  id: string;
  full_name: string;
  email: string;
  total_flight_hours: number;
  aircraft_rated_on?: string;
  experience_description?: string;
  program_interests?: string[];
  pathway_interests?: string[];
  country?: string;
}

export const useMentorMatching = (menteeId: string | null, isPremium: boolean = false) => {
  const [matches, setMatches] = useState<MentorMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menteeId) {
      fetchMentorMatches();
    }
  }, [menteeId, isPremium]);

  const fetchMentorMatches = async () => {
    if (!menteeId) return;

    setLoading(true);
    setError(null);

    try {
      // Get mentee profile
      const { data: menteeData, error: menteeError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', menteeId)
        .single();

      if (menteeError) throw menteeError;

      const mentee: MenteeProfile = menteeData;

      // Get available mentors (role = 'mentor')
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor')
        .eq('status', 'active');

      if (mentorsError) throw mentorsError;

      // Calculate compatibility scores
      const calculatedMatches = calculateMatches(mentee, mentorsData || [], isPremium);

      // Sort by compatibility score (premium users get priority matching)
      const sortedMatches = isPremium
        ? calculatedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        : calculatedMatches.filter(m => m.compatibilityScore >= 50).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      setMatches(sortedMatches.slice(0, 10)); // Return top 10 matches
    } catch (err) {
      console.error('Error fetching mentor matches:', err);
      setError('Failed to load mentor matches');
    } finally {
      setLoading(false);
    }
  };

  const calculateMatches = (mentee: MenteeProfile, mentors: any[], isPremium: boolean): MentorMatch[] => {
    return mentors.map((mentor) => {
      let score = 0;
      const reasons: string[] = [];

      // Experience compatibility (max 35 points)
      const hourDifference = Math.abs(mentor.total_flight_hours - mentee.total_flight_hours);
      if (mentor.total_flight_hours >= mentee.total_flight_hours + 100) {
        score += 35;
        reasons.push('Mentor has significantly more experience');
      } else if (mentor.total_flight_hours >= mentee.total_flight_hours + 50) {
        score += 25;
        reasons.push('Mentor has more experience');
      } else if (hourDifference <= 50) {
        score += 15;
        reasons.push('Similar experience level for peer mentorship');
      }

      // Aircraft type compatibility (max 20 points)
      if (mentee.aircraft_rated_on && mentor.aircraft_rated_on) {
        const menteeAircraft = mentee.aircraft_rated_on.toLowerCase();
        const mentorAircraft = mentor.aircraft_rated_on.toLowerCase();
        
        if (mentorAircraft.includes(menteeAircraft) || menteeAircraft.includes(mentorAircraft)) {
          score += 20;
          reasons.push('Shared aircraft type expertise');
        }
      }

      // Program/pathway interest compatibility (max 15 points)
      const sharedInterests = (mentee.program_interests || []).filter((interest: string) =>
        (mentor.program_interests || []).includes(interest)
      );
      
      if (sharedInterests.length > 0) {
        score += Math.min(sharedInterests.length * 7.5, 15);
        reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
      }

      // Geographic proximity (max 10 points)
      if (mentee.country && mentor.country && mentee.country === mentor.country) {
        score += 10;
        reasons.push('Same country for easier coordination');
      }

      // Mentor tier bonus (max 10 points)
      if (mentor.mentor_tier === 'senior') {
        score += 10;
        reasons.push('Senior mentor with proven track record');
      } else if (mentor.mentor_tier === 'expert') {
        score += 6;
        reasons.push('Expert mentor');
      }

      // Mentorship experience bonus (max 10 points)
      if (mentor.mentorship_hours >= 100) {
        score += 10;
        reasons.push('Extensive mentorship experience');
      } else if (mentor.mentorship_hours >= 50) {
        score += 5;
        reasons.push('Experienced mentor');
      }

      // Premium priority matching boost
      if (isPremium) {
        // Premium users get access to senior/expert mentors first
        if (mentor.mentor_tier === 'senior' || mentor.mentor_tier === 'expert') {
          score += 15;
          reasons.push('⭐ Premium: Priority access to top-tier mentors');
        }
        // Premium users get higher quality matches
        if (mentor.mentorship_hours >= 50) {
          score += 10;
          reasons.push('⭐ Premium: Experienced mentor prioritized');
        }
      } else {
        // Free users have limited access to senior mentors
        if (mentor.mentor_tier === 'senior') {
          score -= 5; // Penalty for free users accessing senior mentors
        }
      }

      return {
        mentor: mentor as MentorProfile,
        compatibilityScore: Math.min(score, 100),
        matchReasons: reasons,
      };
    });
  };

  const requestMentorship = async (mentorId: string, message: string) => {
    if (!menteeId) return { success: false, error: 'No mentee ID provided' };

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          mentee_id: menteeId,
          mentor_id: mentorId,
          status: 'pending',
          message,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('Error requesting mentorship:', err);
      return { success: false, error: 'Failed to send mentorship request' };
    }
  };

  return {
    matches,
    loading,
    error,
    fetchMentorMatches,
    requestMentorship,
  };
};
