import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface EFBFormData {
  provider_name: string;
  period_from: string;
  period_to: string;
  ils_approaches: number;
  rnav_approaches: number;
  vor_approaches: number;
  visual_approaches: number;
  cat1_minima_operations: number;
  class_a_entries: number;
  class_b_entries: number;
  class_c_entries: number;
  oceanic_entries: number;
  imc_hours: number;
  adverse_weather_decisions: number;
  avg_route_waypoints: number;
  max_route_distance_nm: number;
}

export const EMPTY_EFB_FORM: EFBFormData = {
  provider_name: '',
  period_from: '',
  period_to: '',
  ils_approaches: 0,
  rnav_approaches: 0,
  vor_approaches: 0,
  visual_approaches: 0,
  cat1_minima_operations: 0,
  class_a_entries: 0,
  class_b_entries: 0,
  class_c_entries: 0,
  oceanic_entries: 0,
  imc_hours: 0,
  adverse_weather_decisions: 0,
  avg_route_waypoints: 0,
  max_route_distance_nm: 0,
};

export type EFBUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

function calcComplexityIndex(form: EFBFormData): number {
  // Weighted complexity scoring — 0.0 to 10.0
  const approachScore = Math.min(
    ((form.ils_approaches * 1.5) + (form.rnav_approaches * 1.2) + (form.vor_approaches * 1.0) + (form.cat1_minima_operations * 2.0)) / 20,
    3.0
  );
  const airspaceScore = Math.min(
    ((form.class_a_entries * 2.0) + (form.class_b_entries * 1.5) + (form.class_c_entries * 1.0) + (form.oceanic_entries * 2.5)) / 15,
    3.0
  );
  const weatherScore = Math.min(
    ((form.imc_hours * 0.5) + (form.adverse_weather_decisions * 0.8)) / 10,
    2.0
  );
  const routeScore = Math.min(
    ((form.avg_route_waypoints / 10) + (form.max_route_distance_nm / 500)),
    2.0
  );
  return Math.round((approachScore + airspaceScore + weatherScore + routeScore) * 10) / 10;
}

export function useEFBUpload() {
  const { currentUser } = useAuth();
  const [status, setStatus]         = useState<EFBUploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tokenId, setTokenId]       = useState<string | null>(null);
  const [complexityIndex, setComplexityIndex] = useState<number>(0);

  const previewComplexity = useCallback((form: EFBFormData) => {
    setComplexityIndex(calcComplexityIndex(form));
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setUploadError(null);
    setTokenId(null);
    setComplexityIndex(0);
  }, []);

  const submit = useCallback(async (form: EFBFormData) => {
    if (!currentUser?.id) return;
    setStatus('uploading');
    setUploadError(null);

    try {
      const complexity = calcComplexityIndex(form);

      // 1. Upsert platform connection
      const { data: existingConn } = await supabase
        .from('pilot_platform_connections')
        .select('id')
        .eq('pilot_id', currentUser.id)
        .eq('provider_slug', 'manual-efb')
        .maybeSingle();

      let connectionId: string;

      if (existingConn) {
        connectionId = existingConn.id;
        await supabase
          .from('pilot_platform_connections')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', connectionId);
      } else {
        const { data: newConn, error: connErr } = await supabase
          .from('pilot_platform_connections')
          .insert({
            pilot_id: currentUser.id,
            provider_type: 'efb',
            provider_name: form.provider_name || 'Manual EFB Entry',
            provider_slug: 'manual-efb',
            connection_status: 'active',
            last_synced_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        if (connErr) throw connErr;
        connectionId = newConn.id;
      }

      // 2. Write efb_complexity_tokens row
      const { data: token, error: tokenErr } = await supabase
        .from('efb_complexity_tokens')
        .insert({
          pilot_id:                  currentUser.id,
          connection_id:             connectionId,
          provider_name:             form.provider_name || 'Manual Entry',
          period_from:               form.period_from || null,
          period_to:                 form.period_to || null,
          ils_approaches:            form.ils_approaches,
          rnav_approaches:           form.rnav_approaches,
          vor_approaches:            form.vor_approaches,
          visual_approaches:         form.visual_approaches,
          cat1_minima_operations:    form.cat1_minima_operations,
          class_a_entries:           form.class_a_entries,
          class_b_entries:           form.class_b_entries,
          class_c_entries:           form.class_c_entries,
          oceanic_entries:           form.oceanic_entries,
          imc_hours:                 form.imc_hours,
          adverse_weather_decisions: form.adverse_weather_decisions,
          avg_route_waypoints:       form.avg_route_waypoints || null,
          max_route_distance_nm:     form.max_route_distance_nm || null,
          complexity_index:          complexity,
          plausibility_validated:    false,
          status:                    'pending',
        })
        .select('id')
        .single();

      if (tokenErr) throw tokenErr;
      setTokenId(token.id);
      setComplexityIndex(complexity);

      // 3. Audit event
      await supabase
        .from('p12_verification_events')
        .insert({
          pilot_id:         currentUser.id,
          connection_id:    connectionId,
          event_type:       'efb_complexity_ingestion',
          source_table:     'efb_complexity_tokens',
          source_record_id: token.id,
          provider_name:    form.provider_name || 'Manual Entry',
          step_reached:     'token_issued',
          outcome:          'success',
          outcome_detail:   `EFB complexity token created. Complexity index: ${complexity}. ILS: ${form.ils_approaches}, IMC hours: ${form.imc_hours}.`,
          referral_dividend_triggered: false,
        });

      setStatus('success');
    } catch (e: any) {
      setUploadError(e?.message ?? 'Upload failed.');
      setStatus('error');
    }
  }, [currentUser?.id]);

  return { status, uploadError, tokenId, complexityIndex, previewComplexity, submit, reset };
}
