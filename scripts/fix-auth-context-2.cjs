/**
 * Script to migrate remaining Supabase references in AuthContext.tsx
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'contexts', 'AuthContext.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

let changes = 0;

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

// 1. Fix the getSession call in signup (already partially replaced by first script)
// Replace: const { data: { session } } = await supabase.auth.getSession();
// This was already handled by regex in script 1, but check if any remain
const remainingGetSession = /await supabase\.auth\.getSession\(\);/g;
let getSessionMatches = [...content.matchAll(remainingGetSession)];
console.log(`Found ${getSessionMatches.length} remaining getSession calls`);

// 2. Replace supabase.from('profiles').select('id').eq('id', userId).maybeSingle()
const checkProfileOld = `        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();`;

const checkProfileNew = `        const existingProfiles = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          where: { id: userId },
          limit: 1,
        });
        const existingProfile = existingProfiles?.[0] || null;`;

replace(checkProfileOld, checkProfileNew, 'Replaced profile existence check');

// 3. Replace supabase.from('profiles').update(...).eq('id', userId)
const updateProfileOld = `          const { error: updateError } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', userId);`;

const updateProfileNew = `          await callApi('queryTable', { table: 'profiles', operation: 'update', id: userId, data: updatePayload });`;

replace(updateProfileOld, updateProfileNew, 'Replaced profile update in signup');

// 4. Replace supabase.from('profiles').select('id', { count: 'exact', head: true })
const countProfileOld = `              const { count } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true });`;

const countProfileNew = `              const countResult = await callApi<Record<string, unknown>[]>('queryTable', {
                table: 'profiles',
                operation: 'select',
                columns: 'id',
                limit: 1,
              });
              const count = countResult?.length ?? 0;`;

replace(countProfileOld, countProfileNew, 'Replaced profile count in signup');

// 5. Replace supabase.from('profiles').insert(...)
const insertProfileOld = `          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: userId, ...insertPayload });`;

const insertProfileNew = `          await callApi('queryTable', {
            table: 'profiles',
            operation: 'insert',
            data: { id: userId, ...insertPayload },
          });`;

replace(insertProfileOld, insertProfileNew, 'Replaced profile insert in signup');

// 6. Replace the wallet provision block in signup (already partially replaced)
// The first script replaced the fetch with callApi but left the getSession wrapper
const walletBlockOld = `          try {
            const {
              data: { session: currentSession },
            } = await supabase.auth.getSession();
            if (currentSession?.access_token) {
              callApi('provisionWallet', { profile_id: userId, auth0_id: userData.auth0Id || userId, email, name: userData.fullName || email.split('@')[0] }),
              })`;

// This is likely broken - let me find and replace the whole block
const walletStart = content.indexOf('          try {');
if (walletStart !== -1) {
  const walletEnd = content.indexOf('            }', walletStart);
  if (walletEnd !== -1) {
    // Check if this block contains the wallet provision
    const block = content.substring(walletStart, walletEnd + 20);
    if (block.includes('wallet-provision') || block.includes('provisionWallet')) {
      const walletBlockNew = `          try {
            await callApi('provisionWallet', {
              profile_id: userId,
              auth0_id: userData.auth0Id || userId,
              email,
              name: userData.fullName || email.split('@')[0],
            });`;
      content = content.substring(0, walletStart) + walletBlockNew + content.substring(walletEnd + 20);
      changes++;
      console.log('✓ Replaced wallet provision block');
    }
  }
}

// 7. Replace referral tracking queries
replace(
  `              const { data: referrer } = await supabase
                .from('profiles')
                .select('id')
                .eq('referral_code', refCode)
                .maybeSingle();`,
  `              const referrerRows = await callApi<Record<string, unknown>[]>('queryTable', {
                table: 'profiles',
                operation: 'select',
                where: { referral_code: refCode },
                limit: 1,
              });
              const referrer = referrerRows?.[0] || null;`,
  'Replaced referrer lookup'
);

replace(
  `                await supabase
                  .from('profiles')
                  .update({
                    referred_by_code: refCode,
                    referred_by_profile_id: referrer.id,
                  })
                  .eq('id', userId);`,
  `                await callApi('queryTable', {
                  table: 'profiles',
                  operation: 'update',
                  id: userId,
                  data: {
                    referred_by_code: refCode,
                    referred_by_profile_id: (referrer as Record<string, unknown>).id,
                  },
                });`,
  'Referred profile update'
);

replace(
  `                const { data: partner } = await supabase
                  .from('referral_partners')
                  .select('id, commission_rate, total_referrals')
                  .eq('referral_code', refCode)
                  .eq('is_active', true)
                  .maybeSingle();`,
  `                const partnerRows = await callApi<Record<string, unknown>[]>('queryTable', {
                  table: 'referral_partners',
                  operation: 'select',
                  where: { referral_code: refCode, is_active: true },
                  limit: 1,
                });
                const partner = partnerRows?.[0] || null;`,
  'Replaced partner lookup'
);

replace(
  `                  await supabase.from('referral_conversions').upsert(
                    {
                      partner_id: partner.id,
                      referral_code: refCode,
                      pilot_id: userId,
                      pilot_email: email,
                      pilot_name: userData.fullName || null,
                      status: 'signed_up',
                      clicked_at: new Date().toISOString(),
                      signed_up_at: new Date().toISOString(),
                      commission_amount: partner.commission_rate ?? 20,
                    },
                    { onConflict: 'partner_id,pilot_email' }
                  );`,
  `                  await callApi('queryTable', {
                    table: 'referral_conversions',
                    operation: 'insert',
                    data: {
                      partner_id: (partner as Record<string, unknown>).id,
                      referral_code: refCode,
                      pilot_id: userId,
                      pilot_email: email,
                      pilot_name: userData.fullName || null,
                      status: 'signed_up',
                      clicked_at: new Date().toISOString(),
                      signed_up_at: new Date().toISOString(),
                      commission_amount: (partner as Record<string, unknown>).commission_rate ?? 20,
                    },
                  });`,
  'Replaced referral conversion upsert'
);

replace(
  `                  await supabase
                    .from('referral_partners')
                    .update({
                      total_referrals: partner.total_referrals + 1,
                    })
                    .eq('id', partner.id);`,
  `                  await callApi('queryTable', {
                    table: 'referral_partners',
                    operation: 'update',
                    id: (partner as Record<string, unknown>).id as string,
                    data: {
                      total_referrals: ((partner as Record<string, unknown>).total_referrals as number) + 1,
                    },
                  });`,
  'Replaced partner referral count update'
);

// 8. Replace user_app_access insert
replace(
  `        const { error: accessError } = await supabase
          .from('user_app_access')
          .insert(appAccessRecords);`,
  `        await callApi('queryTable', {
          table: 'user_app_access',
          operation: 'insert',
          data: appAccessRecords,
        });`,
  'Replaced user_app_access insert'
);

// 9. Replace pilot_licensure_experience insert/update in signup
// Find the block that uses supabase.from('pilot_licensure_experience')
const licInsertOld = `      // Step 6: Sync to Supabase pilot_licensure_experience table with all gathered information
      try {
        const rawLicensurePayload = {`;

if (content.includes(licInsertOld)) {
  // Find where this block ends
  const licStart = content.indexOf(licInsertOld);
  const licEnd = content.indexOf('      } catch (licensureError)', licStart);
  if (licEnd !== -1) {
    const oldBlock = content.substring(licStart, licEnd);
    // Replace all supabase.from inside this block
    let newBlock = oldBlock.replace(
      /const \{ data: existingLic, error: licError \} = await supabase\s*\.from\('pilot_licensure_experience'\)\s*\.select\('id'\)\s*\.eq\('user_id', userId\)\s*\.maybeSingle\(\);/g,
      `const licRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'pilot_licensure_experience',
          operation: 'select',
          where: { user_id: userId },
          limit: 1,
        });
        const existingLic = licRows?.[0] || null;`
    );
    newBlock = newBlock.replace(
      /await supabase\s*\.from\('pilot_licensure_experience'\)\s*\.update\(licPayload\)\s*\.eq\('user_id', userId\);/g,
      `await callApi('queryTable', { table: 'pilot_licensure_experience', operation: 'update', id: userId, data: licPayload });`
    );
    newBlock = newBlock.replace(
      /await supabase\s*\.from\('pilot_licensure_experience'\)\s*\.insert\(\[\{ user_id: userId, \.\.\.licPayload \}\]\);/g,
      `await callApi('queryTable', { table: 'pilot_licensure_experience', operation: 'insert', data: { user_id: userId, ...licPayload } });`
    );
    content = content.substring(0, licStart) + newBlock + content.substring(licEnd);
    changes++;
    console.log('✓ Replaced pilot_licensure_experience block');
  }
}

// 10. Replace the signup function's Supabase auth block
// This is complex - replace the inner Supabase auth logic with Auth0
const signupAuthOld = `      // Skip Edge Function to avoid rate limiting (429 errors) - use direct Supabase auth
      try {
        throw new Error('SKIP_EDGE_FUNCTION');
      } catch (_edgeFunctionError) {
        // Fallback to direct Supabase auth (original logic)
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: userData.fullName || email.split('@')[0],
              firebase_uid: null,
            },
          },
        });

        if (supabaseError) {
          if (
            supabaseError.message.includes('already registered') ||
            supabaseError.message === 'User already registered'
          ) {
            _userAlreadyExisted = true;

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(
              {
                email,
                password,
              }
            );

            if (signInError) {
              console.error('❌ Failed to sign in to get user ID:', signInError);
              throw new Error('USER_ALREADY_EXISTS');
            }

            if (!signInData.user) {
              throw new Error('USER_ALREADY_EXISTS');
            }

            userId = signInData.user.id;

            if (!signInData.user.email_confirmed_at) {
              const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email,
              });
              if (resendError) {
                console.warn('⚠️ Failed to resend confirmation email:', resendError);
              } else {
              }
            }
          } else {
            console.error('❌ Supabase auth error:', supabaseError);
            throw new Error(\`Supabase auth failed: \${supabaseError.message}\`);
          }
        } else {
          if (!supabaseData.user) {
            throw new Error('No user returned from Supabase auth');
          }

          userId = supabaseData.user.id;
        }
      }`;

const signupAuthNew = `      // Auth0 handles authentication — use Auth0 user ID
      try {
        const token = await getAccessTokenSilently();
        if (!token) {
          // Not authenticated with Auth0, redirect to signup
          await auth0Context.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
          return;
        }
        // Use Auth0 sub as user ID
        userId = auth0User?.sub || '';
        if (!userId) {
          throw new Error('Auth0 user ID not available');
        }
      } catch (authErr) {
        console.error('Auth0 auth error:', authErr);
        throw new Error('Authentication failed. Please try again.');
      }`;

if (content.includes(signupAuthOld)) {
  content = content.replace(signupAuthOld, signupAuthNew);
  changes++;
  console.log('✓ Replaced signup auth block with Auth0');
} else {
  console.log('✗ signup auth block not found exactly');
}

// 11. Replace remaining getSession in signup
const signupVaultOld = `      // Acquire vault key for this session (non-blocking, falls back gracefully)
      let vaultKey: CryptoKey | null = null;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const sub = auth0User?.sub || userId;
        if (token && sub) {
          vaultKey = await getVaultKey(sub, session.access_token);
        }
      } catch (vaultErr: unknown) {`;

// This was already partially replaced - check if it exists
if (content.includes('await supabase.auth.getSession();')) {
  content = content.replace(
    /await supabase\.auth\.getSession\(\);/g,
    'await getAccessTokenSilently();'
  );
  changes++;
  console.log('✓ Replaced remaining getSession calls');
}

// Write file
fs.writeFileSync(filePath, content);
console.log(`\n=== Done ===`);
console.log(`Total changes applied: ${changes}`);
console.log(`File written: ${filePath}`);
