/**
 * Profile API Client
 * Replaces direct Supabase profile queries with batched Worker API calls
 */

const API_BASE = import.meta.env.VITE_PROFILE_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';

interface Profile {
  id: string;
  auth0_id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  nationality?: string;
  current_flight_hours?: number;
  total_flight_hours?: number;
  mentorship_hours?: number;
  foundation_progress?: number;
  overall_recognition_score?: number;
  current_level?: string;
  current_occupation?: string;
  license_id?: string;
  country_of_license?: string;
  ratings?: string;
  pilot_id?: string;
  enrolled_programs?: string;
  app_access?: string;
  is_enrolled_in_foundational?: number;
  recognition_tier?: string;
  subscription_tier?: string;
  created_at: string;
  updated_at: string;
  badges?: any[];
  flight_hours?: any;
}

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const profileApi = {
  // Get full profile with badges and flight hours in ONE request
  getFullProfile: (id: string): Promise<Profile> =>
    fetchApi(`/api/profile/${id}`),

  // Get by Auth0 ID (used during login)
  getByAuth0Id: (auth0Id: string): Promise<Profile> =>
    fetchApi(`/api/profile/auth0/${auth0Id}`),

  // Create profile after first login
  createProfile: (data: Partial<Profile>): Promise<Profile> =>
    fetchApi('/api/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update profile
  updateProfile: (id: string, data: Partial<Profile>): Promise<{ success: boolean }> =>
    fetchApi(`/api/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Get mentorship badges
  getMentorshipBadges: (userId: string): Promise<any[]> =>
    fetchApi(`/api/profile/${userId}/mentorship-badges`),

  // Get flight hours
  getFlightHours: (userId: string): Promise<any> =>
    fetchApi(`/api/profile/${userId}/flight-hours`),
};

export type { Profile };
