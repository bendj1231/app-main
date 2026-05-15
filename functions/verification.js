const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const LAYER_1_CHECKS = ['identity', 'education', 'professional_qualification'];

const getSupabase = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ─── HELPERS ────────────────────────────────────────────────────────────────

function buildVeremarkPayload(profile) {
  return {
    subject: {
      first_name: profile.full_name?.split(' ')[0] ?? '',
      last_name: profile.full_name?.split(' ').slice(1).join(' ') ?? '',
      date_of_birth: profile.date_of_birth,
      nationality: profile.nationality,
      address: profile.personal_address,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
    },
    checks: [
      {
        type: 'identity',
        data: {
          government_id_type: 'SSS',
          country: profile.country ?? 'PH',
        },
      },
      {
        type: 'education',
        data: {
          institution: profile.flight_school_address,
          country: profile.country ?? 'PH',
        },
      },
      {
        type: 'professional_qualification',
        data: {
          license_number: profile.license_number,
          license_types: profile.license_types ?? [],
          license_expiry: profile.license_expiry,
          license_issuing_authority: profile.license_issuing_authority ?? 'CAAP',
          license_control_number: profile.license_control_number,
          medical_class: profile.medical_class,
          medical_expiry: profile.medical_expiry,
          medical_certificate_number: profile.medical_certificate_number,
          radio_license_number: profile.radio_license_number,
          radio_license_expiry: profile.radio_license_expiry,
          aircraft_ratings: profile.ratings ?? [],
        },
      },
    ],
    metadata: {
      pilot_id: profile.id,
      platform: 'pilotrecognition',
      bundle: 'layer_1_personal',
      country: 'PH',
    },
  };
}

async function calculateWalletCompleteness(supabase, walletId) {
  const { data: checks } = await supabase
    .from('verification_checks')
    .select('status')
    .eq('wallet_id', walletId);

  if (!checks || checks.length === 0) return 0;

  const done = checks.filter(c => c.status === 'verified' || c.status === 'not_required').length;
  return Math.round((done / checks.length) * 100);
}

async function sendVeremarkRequest(payload) {
  const apiKey = process.env.VEREMARK_API_KEY;

  if (!apiKey || apiKey.startsWith('your-')) {
    console.log('[Veremark] No API key configured — stubbing request', JSON.stringify(payload, null, 2));
    return { stubbed: true, order_id: `STUB-${Date.now()}`, subject_id: `STUB-SUBJ-${Date.now()}` };
  }

  const response = await fetch('https://api.veremark.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Veremark API error ${response.status}: ${err}`);
  }

  return response.json();
}

// ─── FUNCTION 1: INITIATE VERIFICATION ──────────────────────────────────────

exports.initiateVerification = onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabase();
  const { pilot_id, ip_address, user_agent } = req.body;

  if (!pilot_id) return res.status(400).json({ error: 'pilot_id required' });

  try {
    // 1. Check Recognition+ subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status, plan')
      .eq('user_id', pilot_id)
      .eq('status', 'active')
      .eq('plan', 'recognition_plus')
      .single();

    if (!subscription) {
      return res.status(403).json({ error: 'Recognition+ subscription required to initiate verification' });
    }

    // 2. Check if wallet already exists
    const { data: existingWallet } = await supabase
      .from('pilot_verification_wallet')
      .select('id, wallet_status')
      .eq('pilot_id', pilot_id)
      .single();

    if (existingWallet && ['verified', 'in_progress'].includes(existingWallet.wallet_status)) {
      return res.status(409).json({
        error: 'Verification already in progress or completed',
        wallet_status: existingWallet.wallet_status,
      });
    }

    // 3. Fetch pilot profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id, full_name, date_of_birth, nationality, country,
        personal_address, height_cm, weight_kg,
        license_number, license_types, license_expiry, license_issuing_authority,
        license_control_number, medical_class, medical_expiry, medical_certificate_number,
        radio_license_number, radio_license_expiry, ratings,
        flight_school_address
      `)
      .eq('id', pilot_id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Pilot profile not found' });
    }

    // 4. Create or update wallet
    const walletPayload = {
      pilot_id,
      wallet_status: 'in_progress',
      wallet_completeness_pct: 0,
      is_pre_cleared: false,
      provider: 'veremark',
      country_code: profile.country ?? 'PH',
      initiated_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
    };

    let walletId;
    if (existingWallet) {
      const { data: updatedWallet } = await supabase
        .from('pilot_verification_wallet')
        .update(walletPayload)
        .eq('id', existingWallet.id)
        .select('id')
        .single();
      walletId = updatedWallet.id;
    } else {
      const { data: newWallet, error: walletError } = await supabase
        .from('pilot_verification_wallet')
        .insert(walletPayload)
        .select('id')
        .single();
      if (walletError) throw walletError;
      walletId = newWallet.id;
    }

    // 5. Create verification check rows (one per Layer 1 check type)
    const checksPayload = LAYER_1_CHECKS.map(check_type => ({
      wallet_id: walletId,
      pilot_id,
      check_type,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    }));

    await supabase
      .from('verification_checks')
      .upsert(checksPayload, { onConflict: 'wallet_id,check_type' });

    // 6. Build data snapshot for consent log (strip nulls)
    const dataSnapshot = {
      license_number: profile.license_number,
      license_types: profile.license_types,
      medical_class: profile.medical_class,
      medical_expiry: profile.medical_expiry,
      radio_license_number: profile.radio_license_number,
      nationality: profile.nationality,
      country: profile.country,
    };

    // 7. Log consent
    await supabase
      .from('verification_consent_log')
      .upsert({
        pilot_id,
        wallet_id: walletId,
        consent_type: 'layer_1_bundle',
        check_types: LAYER_1_CHECKS,
        consented_at: new Date().toISOString(),
        ip_address: ip_address ?? req.ip,
        user_agent: user_agent ?? req.headers['user-agent'],
        consent_version: '1.0',
        data_snapshot: dataSnapshot,
      }, { onConflict: 'pilot_id,consent_type,consent_version' });

    // 8. Send to Veremark (or stub)
    const veremarkPayload = buildVeremarkPayload(profile);
    const veremarkResponse = await sendVeremarkRequest(veremarkPayload);

    // 9. Store Veremark order/subject IDs on wallet
    await supabase
      .from('pilot_verification_wallet')
      .update({
        veremark_order_id: veremarkResponse.order_id,
        veremark_subject_id: veremarkResponse.subject_id,
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', walletId);

    // 10. Update check statuses to in_review
    await supabase
      .from('verification_checks')
      .update({ status: 'in_review', updated_at: new Date().toISOString() })
      .eq('wallet_id', walletId);

    // 11. Notify pilot
    await supabase
      .from('notifications')
      .insert({
        user_id: pilot_id,
        type: 'verification',
        title: 'Verification Started',
        message: 'Your Layer 1 personal verification has been submitted. We will notify you when each check is complete.',
        read: false,
      });

    return res.status(200).json({
      success: true,
      wallet_id: walletId,
      veremark_order_id: veremarkResponse.order_id,
      stubbed: veremarkResponse.stubbed ?? false,
      checks_initiated: LAYER_1_CHECKS,
    });

  } catch (err) {
    console.error('[initiateVerification] Error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ─── FUNCTION 2: VEREMARK WEBHOOK RECEIVER ──────────────────────────────────

exports.veremarkWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 1. Verify HMAC signature if secret is configured
  const webhookSecret = process.env.VEREMARK_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers['x-veremark-signature'];
    if (!signature) return res.status(401).json({ error: 'Missing signature' });

    const rawBody = JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const supabase = getSupabase();
  const { event, order_id, subject_id, check_type, status, report_url, notes } = req.body;

  if (!order_id || !check_type || !status) {
    return res.status(400).json({ error: 'order_id, check_type, and status are required' });
  }

  try {
    // 2. Find wallet by Veremark order ID
    const { data: wallet, error: walletError } = await supabase
      .from('pilot_verification_wallet')
      .select('id, pilot_id, wallet_status')
      .eq('veremark_order_id', order_id)
      .single();

    if (walletError || !wallet) {
      console.error('[veremarkWebhook] Wallet not found for order_id:', order_id);
      return res.status(404).json({ error: 'Wallet not found for this order' });
    }

    // 3. Map Veremark status to our status
    const statusMap = {
      completed: 'verified',
      clear: 'verified',
      consider: 'verified',
      adverse: 'failed',
      cancelled: 'failed',
      expired: 'expired',
      in_progress: 'in_review',
    };
    const mappedStatus = statusMap[status] ?? 'in_review';

    // 4. Update the specific check
    const { error: checkError } = await supabase
      .from('verification_checks')
      .update({
        status: mappedStatus,
        verified_at: mappedStatus === 'verified' ? new Date().toISOString() : null,
        veremark_check_id: `${order_id}-${check_type}`,
        veremark_report_url: report_url ?? null,
        notes: notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_id', wallet.id)
      .eq('check_type', check_type);

    if (checkError) throw checkError;

    // 5. Recalculate wallet completeness
    const completeness = await calculateWalletCompleteness(supabase, wallet.id);

    // 6. Check if all 3 checks are verified
    const { data: allChecks } = await supabase
      .from('verification_checks')
      .select('status')
      .eq('wallet_id', wallet.id);

    const allVerified = allChecks?.every(c => c.status === 'verified' || c.status === 'not_required');
    const anyFailed = allChecks?.some(c => c.status === 'failed' || c.status === 'expired');

    const newWalletStatus = allVerified
      ? 'verified'
      : anyFailed
      ? 'partially_verified'
      : 'in_progress';

    // 7. Update wallet
    await supabase
      .from('pilot_verification_wallet')
      .update({
        wallet_status: newWalletStatus,
        wallet_completeness_pct: completeness,
        is_pre_cleared: allVerified,
        pre_cleared_at: allVerified ? new Date().toISOString() : null,
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', wallet.id);

    // 8. Send notifications
    if (allVerified) {
      await supabase.from('notifications').insert({
        user_id: wallet.pilot_id,
        type: 'verification',
        title: 'Professional Standing Active',
        message: 'All 3 verification checks have passed. Your profile is now Pre-Cleared and visible to airlines as a verified candidate.',
        read: false,
      });
    } else if (mappedStatus === 'failed' || mappedStatus === 'expired') {
      const checkLabels = {
        identity: 'Identity Verification',
        education: 'Education Check',
        professional_qualification: 'Professional Qualification',
      };
      await supabase.from('notifications').insert({
        user_id: wallet.pilot_id,
        type: 'verification',
        title: `${checkLabels[check_type] ?? check_type} — Action Required`,
        message: mappedStatus === 'expired'
          ? `Your ${checkLabels[check_type] ?? check_type} has expired. Please renew to maintain your verified status.`
          : `Your ${checkLabels[check_type] ?? check_type} could not be verified. Please contact support or resubmit.`,
        read: false,
      });
    } else {
      await supabase.from('notifications').insert({
        user_id: wallet.pilot_id,
        type: 'verification',
        title: `${check_type.replace(/_/g, ' ')} check complete`,
        message: `Your verification check has been updated. Wallet completeness: ${completeness}%.`,
        read: false,
      });
    }

    return res.status(200).json({
      success: true,
      wallet_id: wallet.id,
      check_type,
      new_status: mappedStatus,
      wallet_completeness: completeness,
      is_pre_cleared: allVerified,
    });

  } catch (err) {
    console.error('[veremarkWebhook] Error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});
