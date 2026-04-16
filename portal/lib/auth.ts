import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile, UserRole } from '../types/user';
import { AVAILABLE_APPS, ROLE_PERMISSIONS } from '../types/user';

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

export const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

export const createUserProfile = async (user: User, role: UserRole['type'] = 'mentee'): Promise<UserProfile> => {
  // Real Firebase operations
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const userRef = doc(db, 'users', user.uid);
  
  const defaultAppAccess = AVAILABLE_APPS.map(app => ({
    appId: app.id,
    appName: app.name,
    granted: app.required,
    restricted: false
  }));

  const userProfile: UserProfile = {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    firstName: user.displayName?.split(' ')[0] || '',
    lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
    role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
    totalHours: 0,
    enrolledPrograms: [],
    appAccess: defaultAppAccess,
    createdAt: new Date(),
    lastLogin: new Date(),
    status: 'active'
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }, { merge: true });

  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  // Real Firebase operations
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        lastLogin: data.lastLogin?.toDate?.(),
        appAccess: data.appAccess || []
      } as UserProfile;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }

  return null;
};

export const updateUserLastLogin = async (uid: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    lastLogin: serverTimestamp()
  }, { merge: true });
};

export const switchSystem = async (uid: string, system: 'pms' | 'wms' | 'super_admin') => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    currentSystem: system
  }, { merge: true });
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
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        let userProfile = await getUserProfile(user.uid);
        
        if (!userProfile) {
          userProfile = await createUserProfile(user);
        } else {
          await updateUserLastLogin(user.uid);
        }

        // Ensure super admin role for the specific email
        if (user.email === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
          userProfile.role = 'super_admin';
          if (db) {
            try {
              await setDoc(doc(db, 'users', user.uid), {
                role: 'super_admin'
              }, { merge: true });
            } catch (updateError) {
              console.warn('Failed to update super admin role:', updateError);
            }
          }
        }

        callback({
          user,
          userProfile,
          loading: false,
          currentSystem: (userProfile as any).currentSystem || 'pms'
        });
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        callback({
          user,
          userProfile: null,
          loading: false,
          currentSystem: 'pms'
        });
      }
    } else {
      callback({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms'
      });
    }
  });
};
