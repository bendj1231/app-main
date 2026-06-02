/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://api.veremark.com',
  'https://dashboard.veremark.com',
];

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o)) ? origin : 'null';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-veremark-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

/**
 * Verify HMAC-SHA256 signature against raw request body.
 * Veremark sends x-veremark-signature as hex-encoded HMAC-SHA256(body, secret).
 */
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  // Constant-time comparison
  if (signature.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Verify Veremark signature
    const signature = req.headers.get('x-veremark-signature');
    const veremarkSecret = Deno.env.get('VEREMARK_WEBHOOK_SECRET');

    if (!signature || !veremarkSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();

    const isValid = await verifySignature(body, signature, veremarkSecret);
    if (!isValid) {
      console.error('[veremark-webhook] Signature verification failed');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Validate required fields
    const checkId = event.checkId || event.id;
    const pilotId = event.metadata?.pilot_id || event.pilotId;
    const status = event.status || event.data?.status;
    const eventType = event.type || event.event_type;
    
    if (!checkId || !eventType) {
      return new Response(JSON.stringify({ error: 'Missing required fields: checkId/id, type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Log webhook for audit
    await supabaseAdmin.from('veremark_webhook_logs').insert({
      pilot_id: pilotId || null,
      veremark_check_id: checkId,
      event_type: eventType,
      status,
      payload: event,
      processed_at: new Date().toISOString(),
    });

    // Handle verification status updates
    if (pilotId) {
      switch (eventType) {
        case 'check.started':
        case 'verification.initiated': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'in_progress',
              veremark_verification_id: checkId,
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }

        case 'check.completed':
        case 'verification.completed': {
          const finalStatus = status === 'verified' ? 'verified' : 
                           status === 'discrepancy' ? 'discrepancy' : 
                           status === 'failed' ? 'failed' : 'discrepancy';
          
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: finalStatus,
              veremark_verification_id: checkId,
              veremark_checked_at: new Date().toISOString(),
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);

          // Log the completion
          await supabaseAdmin.from('user_activity_log').insert({
            user_id: pilotId,
            action: 'veremark_verification_completed',
            details: {
              check_id: checkId,
              status: finalStatus,
              provider: 'veremark',
              event_type: eventType,
            },
            created_at: new Date().toISOString(),
          });

          // REVOCATION: discrepancy or failed → revoke credentials and downgrade profile (ToS Sections 11.2, 16.1)
          if (finalStatus === 'discrepancy' || finalStatus === 'failed') {
            const now = new Date().toISOString();

            // Revoke all active credentials tied to this pilot
            await supabaseAdmin
              .from('pilot_credentials')
              .update({
                status: 'revoked',
                updated_at: now,
                metadata: { revocation_reason: `veremark_${finalStatus}`, veremark_check_id: checkId, revoked_at: now },
              })
              .eq('profile_id', pilotId)
              .eq('status', 'verified');

            // Revoke vc_revocation_registry entries
            await supabaseAdmin
              .from('vc_revocation_registry')
              .update({
                status: 'revoked',
                revoked_at: now,
                revocation_reason: `veremark_${finalStatus}`,
                updated_at: now,
              })
              .eq('profile_id', pilotId)
              .eq('status', 'active');

            // Downgrade profile: clear verified flag and tier (Terminal 3 → Terminal 2)
            await supabaseAdmin
              .from('profiles')
              .update({
                verified_account: false,
                account_tier: 'free',
                updated_by: 'veremark_webhook_revocation',
                updated_at: now,
              })
              .eq('id', pilotId);

            // Log revocation
            await supabaseAdmin.from('user_activity_log').insert({
              user_id: pilotId,
              action: 'veremark_revocation_triggered',
              details: {
                check_id: checkId,
                reason: finalStatus,
                profile_id: pilotId,
                source: 'veremark_webhook',
              },
              created_at: now,
            });

            console.log(`[veremark-webhook] Revoked credentials for pilot ${pilotId} due to ${finalStatus}`);
          }

          // AUTO-ISSUE VERIFIABLE CREDENTIALS if verified (PRODUCTION SIGNING)
          if (finalStatus === 'verified') {
            try {
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id, auth0_id, license_id, license_number, country_of_license, license_expiry, medical_class, medical_expiry, current_flight_hours, pel_number')
                .eq('id', pilotId)
                .single();

              if (profile?.auth0_id) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
                const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
                // Use new production issuer (self-hosted signing, no Walt.id dependency)
                const issueUrl = `${supabaseUrl}/functions/v1/issuer-sign`;

                const subjectDid = `did:web:pilotrecognition.com:pilots:${profile.auth0_id.replace('|', '-')}`;
                const credentialsToIssue = [];

                // PilotLicenseVC
                if (profile.license_id || profile.license_number) {
                  credentialsToIssue.push({
                    credential_type: 'PilotLicenseVC',
                    credential_data: {
                      licenseNumber: profile.license_id || profile.license_number,
                      pelNumber: profile.pel_number || (profile.license_id || profile.license_number || '').replace(/[^0-9]/g, ''),
                      issuingAuthority: profile.country_of_license || 'CAAP',
                      expiryDate: profile.license_expiry || null,
                      totalHours: profile.current_flight_hours || null,
                      verificationMethod: 'Veremark + PilotRecognition Multi-Layer Attestation',
                      veremarkCheckId: checkId,
                    },
                  });
                }

                // MedicalCertVC
                if (profile.medical_class) {
                  credentialsToIssue.push({
                    credential_type: 'MedicalCertVC',
                    credential_data: {
                      pelNumber: profile.pel_number || (profile.license_id || profile.license_number || '').replace(/[^0-9]/g, ''),
                      medicalClass: profile.medical_class,
                      medicalExpiry: profile.medical_expiry || null,
                      verificationMethod: 'Veremark + PilotRecognition Multi-Layer Attestation',
                      veremarkCheckId: checkId,
                    },
                  });
                }

                for (const cred of credentialsToIssue) {
                  try {
                    const issueRes = await fetch(issueUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${serviceKey}`,
                      },
                      body: JSON.stringify({
                        auth0_id: profile.auth0_id,
                        profile_id: pilotId,
                        subject_did: subjectDid,
                        credential_type: cred.credential_type,
                        credential_data: cred.credential_data,
                      }),
                    });

                    if (issueRes.ok) {
                      const issued = await issueRes.json();
                      // Register in revocation registry
                      if (issued.credential_id) {
                        await supabaseAdmin.from('vc_revocation_registry').upsert({
                          credential_id: issued.credential_id,
                          issuer_did: issued.issuer_did || 'did:web:pilotrecognition.com',
                          subject_did: subjectDid,
                          credential_type: cred.credential_type,
                          profile_id: pilotId,
                          status: 'active',
                          issued_at: new Date().toISOString(),
                          expires_at: cred.credential_data.expiryDate || cred.credential_data.medicalExpiry || null,
                          metadata: { source: 'veremark_webhook', check_id: checkId },
                        }, { onConflict: 'credential_id' });
                      }
                      console.log(`[veremark-webhook] Auto-issued ${cred.credential_type} for pilot ${pilotId} with production signature`);
                    } else {
                      console.error(`[veremark-webhook] Failed to issue ${cred.credential_type}:`, await issueRes.text());
                    }
                  } catch (issueErr: any) {
                    console.error(`[veremark-webhook] VC issuance error for ${cred.credential_type}:`, issueErr.message);
                  }
                }
              }
            } catch (vcErr: any) {
              console.error('[veremark-webhook] Auto-VC issuance block failed:', vcErr.message);
              // Non-critical — verification status already updated
            }
          }

          // ACTIVATION CREDIT: Generate 5% Member Credit for ATO (if verification succeeded)
          if (finalStatus === 'verified' && event.metadata?.ato_id) {
            const atoId = event.metadata.ato_id;
            const verificationFee = 99; // $99 base verification fee
            const creditAmount = verificationFee * 0.05; // 5% = $4.95
            
            // Calculate 5 business days expiration
            const expiresAt = new Date();
            let businessDays = 0;
            while (businessDays < 5) {
              expiresAt.setDate(expiresAt.getDate() + 1);
              const day = expiresAt.getDay();
              if (day !== 0 && day !== 6) businessDays++; // Skip weekends
            }

            // Create activation credit record with expiration
            const { data: creditRecord } = await supabaseAdmin
              .from('ato_activation_credits')
              .insert({
                ato_id: atoId,
                pilot_id: pilotId,
                verification_id: checkId,
                credit_amount: creditAmount,
                status: 'pending',
                created_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
                metadata: {
                  pilot_name: event.metadata?.pilot_name,
                  aircraft_type: event.metadata?.aircraft_type,
                  verification_fee: verificationFee,
                },
              })
              .select()
              .single();

            // Queue notification email with 5-day countdown
            await supabaseAdmin.from('notification_queue').insert({
              recipient_type: 'ato',
              recipient_id: atoId,
              notification_type: 'activation_credit_generated',
              subject: 'New Member Activation Credit: $5.00 Available — 5 Days to Claim',
              template_data: {
                credit_amount: creditAmount.toFixed(2),
                pilot_name: event.metadata?.pilot_name || 'A pilot',
                expires_at: expiresAt.toISOString(),
                days_remaining: 5,
                enterprise_seat_price: 1000,
                credit_id: creditRecord?.id,
                message: `A $5.00 Activation Credit has been generated for your flight school. You have 5 business days to activate your $1,000/Year Enterprise Seat to claim this credit as an onboarding discount. If the window expires, this promotional credit will lapse and return to the platform infrastructure pool.`,
              },
              status: 'pending',
              created_at: new Date().toISOString(),
            });

            console.log(`Activation Credit generated: $${creditAmount.toFixed(2)} for ATO ${atoId}, expires ${expiresAt.toISOString()}`);
          }
          break;
        }

        case 'check.expired':
        case 'verification.expired': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'expired',
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }

        case 'check.cancelled':
        case 'verification.cancelled': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'not_started',
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        received: true, 
        type: eventType,
        pilot_id: pilotId,
        check_id: checkId,
        status,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Veremark webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
