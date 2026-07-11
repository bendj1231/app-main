import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { QuickAccessPathways } from '@/components/website/components/unified-platform/QuickAccessPathways';
import {
  useAirlinePathways,
  type AirlinePathwayProfile,
} from '@/components/website/components/unified-platform/useAirlinePathways';

export const MyPathwaysPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  useEffect(() => {
    document.title = 'My Pathways | Pilot Recognition';
  }, []);

  const profile = useMemo<AirlinePathwayProfile>(() => {
    if (!userProfile) return {};
    return {
      total_flight_hours: userProfile.total_flight_hours,
      verification_status: userProfile.verification_status,
      subscription_tier: userProfile.subscription_tier,
      recognition_tier: userProfile.recognition_tier,
    };
  }, [userProfile]);

  const { pathways, recommended, latest, submitted, loading } = useAirlinePathways(profile);

  return (
    <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block">
          <QuickAccessPathways
            profile={profile}
            pathways={pathways}
            recommended={recommended}
            latest={latest}
            submitted={submitted}
            loading={loading}
            darkMode
            onSelect={(pathway) => navigate(`/pathways-detail/${pathway.id}`)}
          />
        </div>
      </div>
    </div>
  );
};
