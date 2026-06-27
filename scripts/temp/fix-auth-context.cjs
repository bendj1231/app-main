/**
 * Script to migrate AuthContext.tsx from Supabase to Cloudflare Worker API + Auth0
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'contexts', 'AuthContext.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Track changes
let changes = 0;

// Helper to replace unique strings
function replace(oldStr, newStr, label) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    changes++;
    console.log(`✓ ${label}`);
    return true;
  }
  console.log(`✗ ${label} (not found)`);
  return false;
}

// 1. Replace supabase.auth.signInWithPassword in login function
const loginBlock = `  async function login(email: string, password: string) {
    console.log('[AuthContext] login() called with email:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('[AuthContext] signInWithPassword result:', { hasUser: !!data.user, hasSession: !!data.session, error: error?.message });
      if (error) throw new Error(error.message || 'Login failed');
      if (!data.user || !data.session) throw new Error('Login failed: No user or session returned');
      await handlePostLogin(data.user, data.session, email);
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.log('[AuthContext] signInWithPassword failed:', errMsg);
      
      // Fallback: use custom admin_login RPC when Supabase Auth service is broken
      if (errMsg.includes('Database error querying schema') || errMsg.includes('Load failed')) {
        console.log('[AuthContext] Trying admin_login RPC fallback...');
        try {
          const { data: adminData, error: adminError } = await supabase.rpc('admin_login', {
            check_email: email,
            check_password: password
          });
          console.log('[AuthContext] admin_login RPC result:', { adminData, adminError: adminError?.message });
          
          if (adminError || !adminData || adminData.length === 0) {
            throw new Error('Invalid email or password');
          }
          
          const user = adminData[0];
          // Manually create a session-like object for admin users
          const mockUser = {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            user_metadata: { display_name: user.display_name, role: user.role }
          };
          const mockSession = { access_token: 'admin-fallback-token', refresh_token: '' };
          
          // Store a local flag to indicate admin fallback login
          localStorage.setItem('adminFallbackLogin', JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            display_name: user.display_name,
            timestamp: Date.now()
          }));
          
          await handlePostLogin(mockUser, mockSession, email);
          // Restore admin role since handlePostLogin may overwrite userProfile
          setUserProfile({
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            role: user.role,
            created_at: new Date().toISOString(),
          });
          console.log('[AuthContext] Admin fallback login succeeded for:', user.email);
          return;
        } catch (fallbackError: any) {
          console.error('[AuthContext] Admin fallback login failed:', fallbackError);
          throw new Error(fallbackError?.message || 'Login failed');
        }
      }
      
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  }`;

const newLoginBlock = `  async function login(_email: string, _password: string) {
    // Auth0 handles authentication — redirect to Auth0 login
    await auth0Context.loginWithRedirect();
  }`;

if (content.includes(loginBlock)) {
  content = content.replace(loginBlock, newLoginBlock);
  changes++;
  console.log('✓ Replaced login function with Auth0 redirect');
} else {
  console.log('✗ login block not found exactly');
}

// 2. Replace sendOtp
replace(
  `  async function sendOtp(email: string, redirectTo?: string) {
    const defaultRedirect = typeof window !== 'undefined' ? \`\${window.location.origin}/flight-deck-login\` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo || defaultRedirect,
      },
    });
    if (error) {
      console.error('sendOtp error:', error);
      throw new Error(error.message || 'Failed to send code. Please try again.');
    }
  }`,
  `  async function sendOtp(_email: string, _redirectTo?: string) {
    // Auth0 handles OTP — redirect to Auth0 login
    await auth0Context.loginWithRedirect();
  }`,
  'Replaced sendOtp with Auth0 redirect'
);

// 3. Replace verifyOtp
replace(
  `  async function verifyOtp(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) throw new Error(error.message || 'Invalid code. Please try again.');
      if (!data.user || !data.session) throw new Error('Verification failed. Please try again.');
      await handlePostLogin(data.user, data.session, email);
    } catch (error) {
      console.error('verifyOtp failed:', error);
      throw error;
    }
  }`,
  `  async function verifyOtp(_email: string, _token: string) {
    // Auth0 handles verification — redirect to Auth0 login
    await auth0Context.loginWithRedirect();
  }`,
  'Replaced verifyOtp with Auth0 redirect'
);

// 4. Replace logout
const logoutOld = `    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // If Supabase API fails, clear session storage directly
      // Remove all Supabase auth tokens from BOTH localStorage and sessionStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      // Also purge sessionStorage (Supabase auth session now lives here)
      const ssKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token'))) {
          ssKeysToRemove.push(key);
        }
      }
      ssKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
    }`;

const logoutNew = `    try {
      await auth0Context.logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('❌ Auth0 logout error:', error);
    }`;

if (content.includes(logoutOld)) {
  content = content.replace(logoutOld, logoutNew);
  changes++;
  console.log('✓ Replaced logout Supabase call with Auth0');
} else {
  console.log('✗ logout block not found exactly');
}

// 5. Replace resetPassword
replace(
  `  async function resetPassword(email: string) {
    // Use Supabase auth for password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: \`\${window.location.origin}/reset-password\`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }`,
  `  async function resetPassword(_email: string) {
    // Auth0 handles password reset
    await auth0Context.loginWithRedirect({ screen_hint: 'reset_password' });
  }`,
  'Replaced resetPassword with Auth0'
);

// 6. Replace refreshUserProfile
const refreshOld = `  // Refresh user profile from Supabase
  async function refreshUserProfile() {
    if (!currentUser) {
      return;
    }

    try {
      // Fetch profile from Supabase
      const { data: profileData, error } = await supabase
        .from('pilot_licensure_experience')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (profileData && !error) {
        await decryptAndSetUserProfile(profileData);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed after enrollment',
          timestamp: new Date().toISOString(),
        });
      } else {
        // Try profiles table as fallback
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (profilesData && !profilesError) {
          await decryptAndSetUserProfile(profilesData);
          logProfileUpdate(currentUser.id, {
            action: 'Profile refreshed from profiles table',
            timestamp: new Date().toISOString(),
          });
        } else {
        }
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
    }
  }`;

const refreshNew = `  // Refresh user profile from Worker API
  async function refreshUserProfile() {
    if (!currentUser) return;
    try {
      const licRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_licensure_experience',
        operation: 'select',
        where: { user_id: currentUser.id },
        limit: 1,
      });
      const licData = licRows?.[0];
      if (licData) {
        await decryptAndSetUserProfile(licData as UserProfile);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed after enrollment',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'profiles',
        operation: 'select',
        where: { id: currentUser.id },
        limit: 1,
      });
      const profileData = profileRows?.[0];
      if (profileData) {
        await decryptAndSetUserProfile(profileData as UserProfile);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed from profiles table',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
    }
  }`;

if (content.includes(refreshOld)) {
  content = content.replace(refreshOld, refreshNew);
  changes++;
  console.log('✓ Replaced refreshUserProfile with Worker API');
} else {
  console.log('✗ refreshUserProfile block not found exactly');
}

// 7. Replace MFA functions
replace(
  `      const { data, error } = await supabase.functions.invoke('auth-mfa-setup', {
        body: { userId: currentUser.uid, method, phoneNumber },
        headers: getAuthHeaders(),
      });`,
  `      const data = await callApi('mfaSetup', { userId: currentUser.uid, method, phoneNumber });`,
  'Replaced MFA setup edge function'
);

replace(
  `      const { data, error } = await supabase.functions.invoke('auth-mfa-verify', {
        body: { userId: currentUser.uid, code, isSetup },
        headers: getAuthHeaders(),
      });`,
  `      const data = await callApi('mfaVerify', { userId: currentUser.uid, code, isSetup });`,
  'Replaced MFA verify edge function'
);

replace(
  `      const { data, error } = await supabase.functions.invoke('auth-mfa-disable', {
        body: { userId: currentUser.uid, code },
        headers: getAuthHeaders(),
      });`,
  `      const data = await callApi('mfaDisable', { userId: currentUser.uid, code });`,
  'Replaced MFA disable edge function'
);

replace(
  `      const { data, error } = await supabase.functions.invoke('auth-mfa-backup-codes', {
        body: { userId: currentUser.uid, action: 'generate', codeCount: 10 },
        headers: getAuthHeaders(),
      });`,
  `      const data = await callApi('mfaBackupCodes', { userId: currentUser.uid, action: 'generate', codeCount: 10 });`,
  'Replaced MFA backup codes edge function'
);

// 8. Replace mfaCheckStatus
const mfaCheckOld = `      const { data, error } = await supabase
        .from('mfa_secrets')
        .select('is_enabled')
        .eq('user_id', currentUser.uid)
        .single();`;

const mfaCheckNew = `      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mfa_secrets',
        operation: 'select',
        where: { user_id: currentUser.uid },
        limit: 1,
      });
      const data = rows?.[0] || null;`;

if (content.includes(mfaCheckOld)) {
  content = content.replace(mfaCheckOld, mfaCheckNew);
  changes++;
  console.log('✓ Replaced mfaCheckStatus with Worker API');
} else {
  console.log('✗ mfaCheckStatus block not found');
}

// 9. Replace deleteAccount
replace(
  `      // Call the delete-account Edge Function
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId },
        headers: getAuthHeaders(),
      });`,
  `      const data = await callApi('deleteAccount', { userId });`,
  'Replaced deleteAccount edge function'
);

// 10. Replace onAuthStateChange effect (simplify for Auth0)
const authStateOld = `    // Listen for auth state changes from Supabase (handles OAuth redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Debug: record auth state change event
      try {
        const dbg = JSON.parse(sessionStorage.getItem('oauth_debug_log') || '[]');
        dbg.push({ ts: Date.now(), event, sessionUserId: session?.user?.id || null });
        sessionStorage.setItem('oauth_debug_log', JSON.stringify(dbg.slice(-50)));
        console.debug('[AuthContext] onAuthStateChange', { event, sessionUserId: session?.user?.id });
      } catch (e) {
        console.debug('[AuthContext] debug log write failed', e);
      }

      if (event === 'SIGNED_IN' && session?.user) {`;

const authStateNew = `    // Auth0 handles auth state changes — simplified listener
    const auth0Unsubscribe = () => {};`;

// This is a large block - let me find and replace the entire effect
const authStateEffectStart = content.indexOf('    // Listen for auth state changes from Supabase');
if (authStateEffectStart !== -1) {
  // Find the end of the useEffect (next useEffect or function)
  const authStateEffectEnd = content.indexOf('  useEffect(() => {', authStateEffectStart + 1);
  if (authStateEffectEnd !== -1) {
    const oldBlock = content.substring(authStateEffectStart, authStateEffectEnd);
    const newBlock = `    // Auth0 handles auth state changes — no Supabase listener needed\n    const auth0Unsubscribe = () => {};\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);\n\n`;
    content = content.substring(0, authStateEffectStart) + newBlock + content.substring(authStateEffectEnd);
    changes++;
    console.log('✓ Replaced onAuthStateChange effect with Auth0 stub');
  }
}

// 11. Replace verifySession effect
const verifySessionOld = `  useEffect(() => {
    // Verify session using Supabase native session check (bypassing Edge Function due to 403 errors)`;

if (content.includes(verifySessionOld)) {
  const vStart = content.indexOf(verifySessionOld);
  // Find the end of this useEffect
  let vEnd = content.indexOf('  }, []);', vStart);
  if (vEnd === -1) vEnd = content.indexOf('  });', vStart);
  if (vEnd !== -1) {
    const oldBlock = content.substring(vStart, vEnd + 9);
    const newBlock = `  useEffect(() => {
    // Verify session using Auth0 (bypassing Supabase)
    const verifySession = async () => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          // Auth0 session is valid
          setLoading(false);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      } catch {
        setCurrentUser(null);
        setLoading(false);
      }
    };
    verifySession();`;
    content = content.substring(0, vStart) + newBlock + content.substring(vEnd + 9);
    changes++;
    console.log('✓ Replaced verifySession effect with Auth0');
  }
}

// 12. Replace remaining supabase.auth.getSession calls
const getSessionPattern = /const \{\s*data:\s*\{\s*session(:\s*\w+)?\s*\}\s*\} = await supabase\.auth\.getSession\(\);/g;
let match;
while ((match = getSessionPattern.exec(content)) !== null) {
  console.log('Found supabase.auth.getSession at index', match.index);
}

// Replace with getAccessTokenSilently
content = content.replace(
  /const \{\s*data:\s*\{\s*session\s*\}\s*\} = await supabase\.auth\.getSession\(\);/g,
  'const token = await getAccessTokenSilently();'
);
content = content.replace(
  /const \{\s*data:\s*\{\s*session:\s*(\w+)\s*\}\s*\} = await supabase\.auth\.getSession\(\);/g,
  'const $1 = await getAccessTokenSilently();'
);

// Replace session?.access_token with token
content = content.replace(/session\?\.access_token/g, 'token');
content = content.replace(/session!\.user\?\.id/g, 'auth0User?.sub');
content = content.replace(/session!\.user\.id/g, 'auth0User?.sub || \'\'');
content = content.replace(/session\.user\?\.id/g, 'auth0User?.sub');

// 13. Replace remaining supabase.from patterns
// These are complex multi-line patterns - handle the most common ones

// Replace wallet-provision edge function call
content = content.replace(
  /fetch\(`\$\{import\.meta\.env\.VITE_SUPABASE_URL\}\/functions\/v1\/wallet-provision`,\s*\{[\s\S]*?\}\)/g,
  `callApi('provisionWallet', { profile_id: userId, auth0_id: userData.auth0Id || userId, email, name: userData.fullName || email.split('@')[0] })`
);

// 14. Replace send-account-created-email
content = content.replace(
  /const \{ error \} = await supabase\.functions\.invoke\('send-account-created-email',\s*\{[\s\S]*?\}\);/g,
  `await callApi('sendAccountCreatedEmail', { email, name: displayName })`
);

// 15. Replace generate-referral
content = content.replace(
  /supabase\.functions\s*\.invoke\('generate-referral',\s*\{[\s\S]*?\}\)/g,
  `callApi('generateReferral', { auth0Id: userData.auth0Id || userId, profileId: userId })`
);

// Write the file
fs.writeFileSync(filePath, content);
console.log(`\n=== Done ===`);
console.log(`Total changes applied: ${changes}`);
console.log(`File written: ${filePath}`);
