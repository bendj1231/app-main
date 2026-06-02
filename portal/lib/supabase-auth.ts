import { createClient } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '../types/user';
import { AVAILABLE_APPS, ROLE_PERMISSIONS } from '../types/user';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not configured:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  });
}

console.log('🔧 Supabase Client Initialization:', {
  url: supabaseUrl,
  hasServiceKey: !!supabaseKey,
  keyLength: supabaseKey?.length || 0,
  envUrl: import.meta.env.VITE_SUPABASE_URL,
  envKey: supabaseKey ? '***SET***' : 'missing'
});

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthState {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

export const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

// Create default app access for new users
const defaultAppAccess = AVAILABLE_APPS.map(app => ({
  appId: app.id,
  appName: app.name,
  granted: app.required,
  restricted: false
}));

export const createUserProfile = async (user: any, role: string = 'pilot'): Promise<UserProfile> => {
  console.log('🔧 createUserProfile called for:', user.email);
  
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise<UserProfile>((_, reject) => {
    setTimeout(() => reject(new Error('Profile creation timeout')), 5000);
  });
  
  try {
    const profileCreationPromise = (async () => {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        return existingProfile as UserProfile;
      }

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
      console.log('🔧 Attempting to create profile with data:', {
        id: user.id,
        email: user.email,
        displayName: userProfile.displayName
      });

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          display_name: userProfile.displayName,
          role: userProfile.role,
          status: userProfile.status,
          firebase_uid: user.user_metadata?.firebase_uid || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error creating profile:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: JSON.stringify(error, null, 2)
        });
        throw error;
      }

      console.log('✅ Profile created successfully:', data);

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
    })();
    
    return await Promise.race([profileCreationPromise, timeoutPromise]);
  } catch (error: any) {
    console.error('Error in createUserProfile:', error);
    
    // Return mock profile on timeout
    if (error?.message?.includes('timeout')) {
      console.log('⚠️ Profile creation timeout, returning mock profile');
      return {
        id: user.id,
        email: user.email || '',
        displayName: user.email?.split('@')[0] || 'User',
        firstName: user.email?.split('@')[0] || 'User',
        lastName: '',
        role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
        totalHours: 0,
        enrolledPrograms: [],
        appAccess: defaultAppAccess,
        createdAt: new Date(),
        lastLogin: new Date(),
        status: 'active'
      };
    }
    
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  console.log('🔍 getUserProfile called for:', uid);
  
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise<{data: any, error: any}>((_, reject) => {
    setTimeout(() => reject(new Error('Supabase query timeout')), 5000);
  });
  
  try {
    // Race between Supabase query and timeout
    const queryPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    
    const { data: profile, error: profileError } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as any;

    console.log('🔍 Profile query result:', { hasProfile: !!profile, error: profileError });

    if (profileError || !profile) {
      console.log('Profile not found:', profileError);
      return null;
    }

    // Use display_name from profile, or generate from email
    const displayName = profile.display_name || profile.email?.split('@')[0] || '';
    
    const firstName = displayName?.split(' ')[0] || profile.email?.split('@')[0] || '';
    const lastName = displayName?.split(' ').slice(1).join(' ') || '';

    console.log('🔍 About to fetch app access');
    // Get app access
    const { data: appAccess, error: accessError } = await supabase
      .from('user_app_access')
      .select('*')
      .eq('user_id', uid);

    console.log('🔍 App access query result:', { hasAccess: !!appAccess, error: accessError });

    if (accessError) {
      console.error('Error fetching app access:', accessError);
    }

    // Map app access to proper format
    const appAccessMap = {
      'foundational': 'Foundational Program',
      'pilot-profile': 'Pilot Profile', 
      'mentorship': 'Mentorship',
      'atlas-cv': 'ATLAS CV Generator',
      'w1000': 'W1000 Logbook'
    };

    const userProfile: UserProfile = {
      id: profile.id,
      email: profile.email,
      displayName: displayName,
      firstName: firstName,
      lastName: lastName,
      role: profile.role,
      totalHours: 0, // This would come from a separate table if needed
      enrolledPrograms: profile.enrolled_programs || [],
      appAccess: appAccess?.map(access => ({
        appId: access.app_id,
        appName: appAccessMap[access.app_id as keyof typeof appAccessMap] || access.app_id,
        granted: access.granted,
        restricted: !access.granted
      })) || defaultAppAccess,
      createdAt: new Date(profile.created_at),
      lastLogin: new Date(profile.updated_at),
      status: profile.status
    };

    return userProfile;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    
    // Return null on timeout or lock errors (profile will be created)
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
  console.log(`Switch system to ${system} for user ${uid}`);
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
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔍 Supabase Auth State Change:', { event, session: !!session });
    console.log('📞 About to call callback with auth state');
    
    if (session?.user) {
      console.log('👤 User logged in:', session.user.email);
      console.log('🔍 About to load user profile for:', session.user.id);
      
      try {
        let userProfile = await getUserProfile(session.user.id);
        
        console.log('📋 User profile loaded:', userProfile ? 'Success' : 'Not found');
        
        if (!userProfile) {
          console.log('🔧 Creating new user profile...');
          userProfile = await createUserProfile(session.user);
          console.log('🔧 Profile creation completed');
        } else {
          console.log('🔍 About to update last login');
          await updateUserLastLogin(session.user.id);
          console.log('🔍 Last login updated');
        }

        // Ensure super admin role for the specific email
        if (session.user.email === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
          console.log('👑 Granting super admin role...');
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

        console.log('✅ Final user profile:', {
          email: userProfile.email,
          role: userProfile.role,
          appAccessCount: userProfile.appAccess?.length || 0,
          canAccessMentorManagement: userProfile.role === 'super_admin' || userProfile.appAccess?.some(a => a.appId === 'mentor-management' && a.granted)
        });

        console.log('📞 Calling callback with user profile');
        callback({
          user: session.user,
          userProfile,
          loading: false,
          currentSystem: 'pms'
        });
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        console.log('📞 Calling callback with error (userProfile: null)');
        callback({
          user: session.user,
          userProfile: null,
          loading: false,
          currentSystem: 'pms'
        });
      }
    } else {
      console.log('👋 User logged out');
      console.log('📞 Calling callback for logged out user');
      callback({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms'
      });
    }
  });
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
  interest: string;
  goals: string;
  agreementVersion: string;
  agreedAt: string;
}) => {
  try {
    console.log('🔍 Starting enrollment process for user:', uid);
    console.log('🔍 Onboarding data:', onboardingData);
    
    // First, let's test if we can read the user's profile
    console.log('🔍 Testing user profile access...');
    const { data: profileTest, error: profileTestError } = await supabase
      .from('profiles')
      .select('id, email, role, enrolled_programs, display_name')
      .eq('id', uid)
      .single();
    
    if (profileTestError) {
      console.error('❌ Profile access test failed:', profileTestError);
      throw new Error(`Cannot access user profile: ${profileTestError.message}`);
    }
    
    console.log('✅ Profile access test successful:', profileTest);
    
    // Check if user is already enrolled
    if (profileTest.enrolled_programs && profileTest.enrolled_programs.includes('Foundational')) {
      console.log('⚠️ User is already enrolled in Foundational Program');
      throw new Error('You are already enrolled in the Foundational Program.');
    }
    
    // Check for existing enrollment record
    console.log('🔍 Checking for existing enrollment records...');
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
    
    if (existingEnrollment) {
      console.log('⚠️ Found existing enrollment record:', existingEnrollment);
      throw new Error('You already have an enrollment record for the Foundational Program.');
    }
    
    console.log('✅ No existing enrollment found, proceeding...');
    
    // Update user profile with enrollment data
    console.log('💾 Updating user profile...');
    const { data: profileUpdate, error: profileError } = await supabase
      .from('profiles')
      .update({
        enrolled_programs: ['Foundational'],
        onboarding_responses: onboardingData,
        enrollment_agreement_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', uid);

    if (profileError) {
      console.error('❌ Profile update error:', profileError);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    console.log('✅ Profile updated successfully:', profileUpdate);

    // Insert enrollment record in separate table
    console.log('📝 Creating enrollment record...');
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

    console.log('✅ Enrollment record created successfully:', enrollmentData);
    console.log('🎉 Enrollment process completed successfully for user:', uid);
    
    // Send confirmation email with timeout
    console.log('📧 Sending confirmation email...');
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
      console.log('✅ Email sent successfully');
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
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('enrolled_programs')
      .eq('id', uid)
      .single();

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
