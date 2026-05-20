import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-veremark-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
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
    const event = JSON.parse(body);

    console.log('Veremark webhook received:', event.type, event.checkId || event.id);

    const checkId = event.checkId || event.id;
    const pilotId = event.metadata?.pilot_id || event.pilotId;
    const status = event.status || event.data?.status;
    const eventType = event.type || event.event_type;

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

          // AUTO-ISSUE VERIFIABLE CREDENTIALS if verified
          if (finalStatus === 'verified') {
            try {
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id, auth0_id, license_id, country_of_license, license_expiry, medical_class, medical_expiry, current_flight_hours')
                .eq('id', pilotId)
                .single();

              if (profile?.auth0_id) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
                const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
                const issueUrl = `${supabaseUrl}/functions/v1/pilot-terminal-issue`;

                const credentialsToIssue = [];

                // PilotLicenseVC
                if (profile.license_id) {
                  credentialsToIssue.push({
                    credential_type: 'PilotLicenseVC',
                    credential_data: {
                      licenseNumber: profile.license_id,
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
                        credential_type: cred.credential_type,
                        credential_data: cred.credential_data,
                        source_provider: 'Veremark',
                      }),
                    });

                    if (issueRes.ok) {
                      const issued = await issueRes.json();
                      // Register in revocation registry
                      if (issued.credential_id) {
                        await supabaseAdmin.from('vc_revocation_registry').upsert({
                          credential_id: issued.credential_id,
                          issuer_did: issued.issuer_did || 'did:web:pilotrecognition.com',
                          subject_did: `did:web:pilotrecognition.com:pilots:${profile.auth0_id.replace('|', '-')}`,
                          credential_type: cred.credential_type,
                          profile_id: pilotId,
                          status: 'active',
                          issued_at: new Date().toISOString(),
                          expires_at: cred.credential_data.expiryDate || cred.credential_data.medicalExpiry || null,
                          metadata: { source: 'veremark_webhook', check_id: checkId },
                        }, { onConflict: 'credential_id' });
                      }
                      console.log(`[veremark-webhook] Auto-issued ${cred.credential_type} for pilot ${pilotId}`);
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
