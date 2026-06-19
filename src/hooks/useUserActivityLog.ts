import { useWorkerAuth } from './useWorkerAuth';

export type ActivityType =
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'assessment_completion'
  | 'course_enrollment'
  | 'goal_completion';

interface ActivityLogOptions {
  activityDetails?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export const useUserActivityLog = () => {
  const { callApi } = useWorkerAuth();

  const logActivity = async (
    activityType: ActivityType,
    userId: string,
    options: ActivityLogOptions = {}
  ) => {
    try {
      const { activityDetails = {}, ipAddress, userAgent } = options;

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

      let finalUserAgent = userAgent;
      if (!finalUserAgent) {
        finalUserAgent = navigator.userAgent;
      }

      await callApi('logActivity', {
        user_id: userId,
        activity_type: activityType,
        activity_details: activityDetails,
        ip_address: finalIpAddress,
        user_agent: finalUserAgent,
      });
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

  const logProfileUpdate = async (userId: string, details: Record<string, unknown>) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userId && isLoggedIn) {
      logLogin(userId);
    }
  }, [userId, isLoggedIn]);
};
