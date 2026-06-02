import type { UserProfile, UserRole } from '../types/user';
import { AVAILABLE_APPS, ROLE_PERMISSIONS } from '../types/user';

// Use shared Supabase client from main app to share session automatically
import { supabase } from '../../src/lib/supabase';
import { indexedDB } from '../../src/lib/indexedDB';
export { supabase };

export interface AuthState {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

export const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

export const createUserProfile = async (user: any, role: UserRole['type'] = 'mentee'): Promise<UserProfile> => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return existingProfile as UserProfile;
    }

    // Only log error if it's not a "not found" error
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError);
    }

    // Create default app access
    const defaultAppAccess = AVAILABLE_APPS.map(app => ({
      appId: app.id,
      appName: app.name,
      granted: app.required,
      restricted: false
    }));

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || '',
      firstName: user.user_metadata?.display_name?.split(' ')[0] || user.email?.split('@')[0] || '',
      lastName: user.user_metadata?.display_name?.split(' ').slice(1).join(' ') || '',
      role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
      totalHours: 0,
      enrolledPrograms: [],
      appAccess: defaultAppAccess,
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'active'
    };

    // Insert profile into Supabase
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: userProfile.displayName,
        role: userProfile.role,
        status: userProfile.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    // Create app access records
    const appAccessRecords = defaultAppAccess.map(app => ({
      user_id: user.id,
      app_id: app.appId,
      granted: app.granted,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: accessError } = await supabase
      .from('user_app_access')
      .insert(appAccessRecords);

    if (accessError) {
      console.error('Error creating app access:', accessError);
    }

    return userProfile;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
// [AUDIT] Removed console.log // line 105
    // Get profile from Supabase - removed timeout to allow natural query completion
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, profile_image_url')
      .eq('id', uid)
      .maybeSingle();

// [AUDIT] Removed console.log // line 113
      hasProfile: !!profile,
      profileError: profileError,
      profileData: profile ? {
        id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        profile_image_url: profile.profile_image_url,
        role: profile.role
      } : null
    });

    if (profileError) {
      // Only log error if it's not a "not found" error
      if (profileError.code !== 'PGRST116') {
// [AUDIT] Removed console.log // line 128
      }
      return null;
    }

    // Use display_name from profile, or generate from email
    const displayName = profile.display_name || profile.email?.split('@')[0] || '';

    const firstName = displayName?.split(' ')[0] || profile.email?.split('@')[0] || '';
    const lastName = displayName?.split(' ').slice(1).join(' ') || '';

    // Get app access
    let appAccess = [];
    try {
      const { data: accessData, error: accessError } = await supabase
        .from('user_app_access')
        .select('*')
        .eq('user_id', uid);

      if (!accessError && accessData) {
        appAccess = accessData.map((access: any) => ({
          appId: access.app_id,
          appName: access.app_name || '',
          granted: access.granted,
          grantedBy: access.granted_by,
          grantedAt: access.granted_at ? new Date(access.granted_at) : undefined,
          restricted: access.restricted || false
        }));
      }
    } catch (accessErr) {
      console.error('Error fetching app access:', accessErr);
    }

    // Check for Recognition Plus subscription
    let isRecognitionPlusMember = false;
    try {
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'active')
        .eq('plan', 'recognition_plus')
        .maybeSingle();

      if (!subError && subscription) {
        isRecognitionPlusMember = true;
// [AUDIT] Removed console.log // line 174
      }
    } catch (subErr) {
      console.error('Error checking subscription:', subErr);
    }

    const userProfile: UserProfile = {
      id: profile.id,
      uid: profile.firebase_uid || profile.id,
      email: profile.email,
      firstName,
      lastName,
      displayName,
      role: profile.role || 'mentee',
      totalHours: profile.total_flight_hours || 0,
      region: profile.region,
      flightSchool: profile.flight_school,
      enrolledPrograms: profile.enrolled_programs || [],
      appAccess,
      createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
      lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
      status: profile.status || 'active',
      isNewUser: profile.is_new_user || false,
      profile_image_url: profile.profile_image_url,
      isRecognitionPlusMember
    };

// [AUDIT] Removed console.log // line 201
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      displayName: userProfile.displayName,
      profile_image_url: userProfile.profile_image_url,
      appAccessCount: userProfile.appAccess.length
    });
// [AUDIT] Removed console.log // line 209
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserLastLogin = async (uid: string) => {
  try {
    await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', uid);
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const switchSystem = async (uid: string, system: 'pms' | 'wms' | 'super_admin') => {
// [AUDIT] Removed console.log // line 229
  // This could be stored in a user preferences table
};

export const hasPermission = (userProfile: UserProfile | null, permission: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin has all permissions
  if (userProfile.role === 'super_admin') return true;
  
  // Check role-based permissions
  const userPermissions = ROLE_PERMISSIONS[userProfile.role] || [];
  return userPermissions.includes(permission);
};

export const canAccessApp = (userProfile: UserProfile | null, appId: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin can access all apps
  if (userProfile.role === 'super_admin') return true;
  
  const appAccess = userProfile.appAccess.find(app => app.appId === appId);
  return appAccess?.granted || false;
};

export const onAuthStateChange = (callback: (authState: AuthState) => void) => {
// [AUDIT] Removed console.log // line 255

  // Clear expired sessions from IndexedDB before setting up listener
  const clearExpiredSessions = async () => {
    try {
// [AUDIT] Removed console.log // line 260
      const savedSession = await indexedDB.getSessionWithVerification(supabase);
      if (!savedSession) {
// [AUDIT] Removed console.log // line 263
      }
    } catch (error) {
      console.error('❌ Error checking expired sessions:', error);
    }
  };

  // Clear expired sessions
  clearExpiredSessions();

  // Set up auth listener
  const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
// [AUDIT] Removed console.log // line 275

    if (session?.user) {
// [AUDIT] Removed console.log // line 278

      try {
        let userProfile = await getUserProfile(session.user.id);

// [AUDIT] Removed console.log // line 283

        if (!userProfile) {
// [AUDIT] Removed console.log // line 286
          userProfile = await createUserProfile(session.user);
        } else {
          await updateUserLastLogin(session.user.id);
        }

        // Ensure super admin role for the specific email
        if (session.user.email === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
// [AUDIT] Removed console.log // line 294
          userProfile.role = 'super_admin';
          try {
            await supabase
              .from('profiles')
              .update({ role: 'super_admin' })
              .eq('id', session.user.id);
          } catch (updateError) {
            console.warn('Failed to update super admin role:', updateError);
          }
        }

// [AUDIT] Removed console.log // line 306
          email: userProfile.email,
          role: userProfile.role,
          appAccessCount: userProfile.appAccess?.length || 0,
          canAccessMentorManagement: userProfile.role === 'super_admin' || userProfile.appAccess?.some(a => a.appId === 'mentor-management' && a.granted)
        });

// [AUDIT] Removed console.log // line 313
        callback({
          user: session.user,
          userProfile,
          loading: false,
          currentSystem: 'pms'
        });
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        callback({
          user: session.user,
          userProfile: null,
          loading: false,
          currentSystem: 'pms'
        });
      }
    } else {
// [AUDIT] Removed console.log // line 330
      callback({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms'
      });
    }
  });

  return subscription;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0]
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Complete enrollment with onboarding data in Supabase
 */
export const completeEnrollment = async (uid: string, onboardingData: {
  goals: string;
  agreementVersion: string;
  agreedAt: string;
}) => {
  try {
// [AUDIT] Removed console.log // line 390
// [AUDIT] Removed console.log // line 391
    
    // First, let's test if we can read the user's profile
// [AUDIT] Removed console.log // line 394
    const { data: profileTest, error: profileTestError } = await supabase
      .from('profiles')
      .select('id, email, role, enrolled_programs, display_name')
      .eq('id', uid)
      .single();
    
    if (profileTestError) {
      console.error('❌ Profile access test failed:', profileTestError);
      throw new Error(`Cannot access user profile: ${profileTestError.message}`);
    }
    
// [AUDIT] Removed console.log // line 406
    
    // Check if user is already enrolled
    if (profileTest.enrolled_programs && profileTest.enrolled_programs.includes('Foundational')) {
// [AUDIT] Removed console.log // line 410
      throw new Error('You are already enrolled in the Foundational Program.');
    }
    
    // Check for existing enrollment record
// [AUDIT] Removed console.log // line 415
    const { data: existingEnrollment, error: existingError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', uid)
      .eq('program_name', 'Foundational')
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error checking existing enrollment:', existingError);
      throw new Error(`Error checking existing enrollment: ${existingError.message}`);
    }
    
    // Also check profiles.enrolled_programs for consistency
    const { data: profileData } = await supabase
      .from('profiles')
      .select('enrolled_programs')
      .eq('id', uid)
      .single();
    
    const isEnrolledInProfile = profileData?.enrolled_programs?.includes('Foundational');
    
    if (existingEnrollment || isEnrolledInProfile) {
// [AUDIT] Removed console.log // line 438
      throw new Error('You already have an enrollment record for the Foundational Program.');
    }
    
// [AUDIT] Removed console.log // line 442
    
    // Update user profile with enrollment data
// [AUDIT] Removed console.log // line 445
    const { data: profileUpdate, error: profileError } = await supabase
      .from('profiles')
      .update({
        enrolled_programs: ['Foundational'],
        onboarding_responses: onboardingData,
        enrollment_agreement_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', uid)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile update error:', profileError);
      console.error('Error details:', JSON.stringify(profileError, null, 2));
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

// [AUDIT] Removed console.log // line 464
    
    // Verify the update was successful
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('enrolled_programs')
      .eq('id', uid)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      throw new Error(`Verification error: ${verifyError.message}`);
    }
    
// [AUDIT] Removed console.log // line 478
    
    // Additional verification: Check if enrolled_programs was actually updated
    if (!verifyProfile?.enrolled_programs || !Array.isArray(verifyProfile.enrolled_programs)) {
      throw new Error('Verification failed: enrolled_programs was not properly updated');
    }
    
    if (!verifyProfile.enrolled_programs.includes('Foundational')) {
      throw new Error('Verification failed: Foundational program not found in enrolled_programs');
    }

    // Update pilot_portfolio table foundation_program_status
// [AUDIT] Removed console.log // line 490
    const { error: portfolioError } = await supabase
      .from('pilot_portfolio')
      .update({
        foundation_program_status: 'in_progress',
        program_start_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    if (portfolioError) {
      console.error('⚠️ Pilot portfolio update error:', portfolioError);
      // Non-critical: enrollment is still successful
    } else {
// [AUDIT] Removed console.log // line 504
    }
    
// [AUDIT] Removed console.log // line 507

    // Insert enrollment record in separate table
// [AUDIT] Removed console.log // line 510
    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: uid,
        program_name: 'Foundational',
        enrollment_status: 'completed',
        onboarding_data: onboardingData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error('❌ Enrollment record error:', enrollmentError);
      
      // Check for specific error types
      if (enrollmentError.message.includes('duplicate key') || enrollmentError.message.includes('unique')) {
        throw new Error('You are already enrolled in this program.');
      } else if (enrollmentError.message.includes('permission') || enrollmentError.message.includes('authorization')) {
        throw new Error('Permission denied. Please contact support.');
      } else {
        throw new Error(`Failed to create enrollment record: ${enrollmentError.message}`);
      }
    }

// [AUDIT] Removed console.log // line 536
// [AUDIT] Removed console.log // line 537
    
    // Send confirmation email with timeout
// [AUDIT] Removed console.log // line 540
    try {
      const emailPromise = import('./email').then(module => 
        module.sendEnrollmentConfirmationEmail({
          email: profileTest.email,
          name: profileTest.display_name
        })
      );
      
      // Add 10 second timeout for email
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 10000)
      );
      
      await Promise.race([emailPromise, timeoutPromise]);
// [AUDIT] Removed console.log // line 555
    } catch (emailError) {
      console.warn('⚠️ Email sending failed, but enrollment succeeded:', emailError);
      // Don't fail enrollment if email fails
    }
    
  } catch (error) {
    console.error('❌ Failed to complete enrollment:', error);
    throw error;
  }
};

/**
 * Get user enrollment status
 */
export const getEnrollmentStatus = async (uid: string): Promise<string[]> => {
  try {
    // First try with Supabase ID
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('enrolled_programs')
      .eq('id', uid)
      .single();

    // If that fails, try with Firebase UID
    if (error || !profile) {
// [AUDIT] Removed console.log // line 581
      const { data: firebaseProfile, error: firebaseError } = await supabase
        .from('profiles')
        .select('enrolled_programs')
        .eq('firebase_uid', uid)
        .single();

      if (firebaseError) {
        console.error('Error fetching enrollment status with Firebase UID:', firebaseError);
        return [];
      }

      return firebaseProfile?.enrolled_programs || [];
    }

    if (error) {
      console.error('Error fetching enrollment status:', error);
      return [];
    }

    return profile?.enrolled_programs || [];
  } catch (error) {
    console.error('Failed to get enrollment status:', error);
    return [];
  }
};

/**
 * Get detailed enrollment data for a user
 */
export const getUserEnrollmentData = async (uid: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching enrollment data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user enrollment data:', error);
    return null;
  }
};

/**
 * Search users by enrollment interests and goals
 */
export const searchUsersByEnrollmentData = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles!inner (
          id,
          email,
          display_name,
          role
        )
      `)
      .or(`
        onboarding_data->>'interest'.ilike.%${searchTerm}%,
        onboarding_data->>'goals'.ilike.%${searchTerm}%
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching enrollment data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search enrollment data:', error);
    return [];
  }
};

/**
 * Get all enrolled users with their interests and goals
 */
export const getAllEnrolledUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles!inner (
          id,
          email,
          display_name,
          role,
          created_at
        )
      `)
      .eq('enrollment_status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrolled users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get enrolled users:', error);
    return [];
  }
};
