import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'profile_update' 
  | 'assessment_completion' 
  | 'course_enrollment' 
  | 'goal_completion';

interface ActivityLogOptions {
  activityDetails?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export const useUserActivityLog = () => {
  const logActivity = async (
    activityType: ActivityType,
    userId: string,
    options: ActivityLogOptions = {}
  ) => {
    try {
      const { activityDetails = {}, ipAddress, userAgent } = options;
      
      // Get IP address if not provided
      let finalIpAddress = ipAddress;
      if (!finalIpAddress) {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          finalIpAddress = data.ip;
        } catch (error) {
          console.error('Failed to get IP address:', error);
        }
      }

      // Get user agent if not provided
      let finalUserAgent = userAgent;
      if (!finalUserAgent) {
        finalUserAgent = navigator.userAgent;
      }

      const { error } = await supabase
        .from('user_activity_log')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_details: activityDetails,
          ip_address: finalIpAddress,
          user_agent: finalUserAgent,
        });

      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  };

  const logLogin = async (userId: string) => {
    await logActivity('login', userId);
  };

  const logLogout = async (userId: string) => {
    await logActivity('logout', userId);
  };

  const logProfileUpdate = async (userId: string, details: Record<string, any>) => {
    await logActivity('profile_update', userId, { activityDetails: details });
  };

  const logAssessmentCompletion = async (userId: string, assessmentName: string, score: number) => {
    await logActivity('assessment_completion', userId, {
      activityDetails: { assessmentName, score }
    });
  };

  const logCourseEnrollment = async (userId: string, courseId: string, courseName: string) => {
    await logActivity('course_enrollment', userId, {
      activityDetails: { courseId, courseName }
    });
  };

  const logGoalCompletion = async (userId: string, goalId: string, goalTitle: string) => {
    await logActivity('goal_completion', userId, {
      activityDetails: { goalId, goalTitle }
    });
  };

  return {
    logActivity,
    logLogin,
    logLogout,
    logProfileUpdate,
    logAssessmentCompletion,
    logCourseEnrollment,
    logGoalCompletion,
  };
};

// Hook to automatically log login on mount
export const useAutoLogLogin = (userId: string | null, isLoggedIn: boolean) => {
  const { logLogin } = useUserActivityLog();

  useEffect(() => {
    if (userId && isLoggedIn) {
      logLogin(userId);
    }
  }, [userId, isLoggedIn, logLogin]);
};
