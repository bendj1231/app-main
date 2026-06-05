import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const ICAO_COMPETENCIES = [
  { code: 'APP', label: 'Application of Procedures' },
  { code: 'COM', label: 'Communication' },
  { code: 'FPA', label: 'Flight Path Automation' },
  { code: 'FPM', label: 'Flight Path Manual Control' },
  { code: 'LTW', label: 'Leadership & Teamwork' },
  { code: 'PSD', label: 'Problem Solving & Decision Making' },
  { code: 'SAW', label: 'Situation Awareness' },
  { code: 'WLM', label: 'Workload Management' },
  { code: 'KNO', label: 'Knowledge Application' },
];

export const SESSION_TYPES = [
  { value: 'ifr_scenario',        label: 'IFR Scenario' },
  { value: 'emergency_procedure', label: 'Emergency Procedure' },
  { value: 'atc_phraseology',     label: 'ATC Phraseology' },
  { value: 'type_specific',       label: 'Type-Specific Training' },
  { value: 'cbta_structured',     label: 'CBTA Structured Session' },
  { value: 'general_practice',    label: 'General Practice' },
];

export interface SimSessionFormData {
  provider_name: string;
  session_type: string;
  aircraft_type: string;
  session_date: string;
  duration_minutes: number;
  scenario_description: string;
  competency_tags: string[];
}

export const EMPTY_SIM_FORM: SimSessionFormData = {
  provider_name: '',
  session_type: 'ifr_scenario',
  aircraft_type: '',
  session_date: '',
  duration_minutes: 0,
  scenario_description: '',
  competency_tags: [],
};

export type SimUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function useSimSessionUpload() {
  const { currentUser } = useAuth();
  const [status, setStatus]           = useState<SimUploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tokenId, setTokenId]         = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setUploadError(null);
    setTokenId(null);
  }, []);

  const submit = useCallback(async (form: SimSessionFormData) => {
    if (!currentUser?.id) return;
    if (!form.session_date || form.duration_minutes <= 0) {
      setUploadError('Session date and duration are required.');
      return;
    }
    setStatus('uploading');
    setUploadError(null);

    try {
      // 1. Upsert platform connection
      const _providerSlug = `manual-sim-${(form.provider_name || 'generic').toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`;

      const { data: existingConn } = await supabase
        .from('pilot_platform_connections')
        .select('id')
        .eq('pilot_id', currentUser.id)
        .eq('provider_slug', 'manual-sim')
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
            provider_type: 'simulation',
            provider_name: form.provider_name || 'Manual Sim Entry',
            provider_slug: 'manual-sim',
            connection_status: 'active',
            last_synced_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        if (connErr) throw connErr;
        connectionId = newConn.id;
      }

      // 2. Write sim_session_tokens row (L2 — device-verified, no instructor yet)
      const { data: token, error: tokenErr } = await supabase
        .from('sim_session_tokens')
        .insert({
          pilot_id:             currentUser.id,
          connection_id:        connectionId,
          provider_name:        form.provider_name || 'Manual Entry',
          session_type:         form.session_type,
          aircraft_type:        form.aircraft_type || null,
          session_date:         form.session_date,
          duration_minutes:     form.duration_minutes,
          scenario_description: form.scenario_description || null,
          competency_tags:      form.competency_tags,
          verification_level:   2,
          status:               'pending',
        })
        .select('id')
        .single();

      if (tokenErr) throw tokenErr;
      setTokenId(token.id);

      // 3. Audit event
      await supabase
        .from('p12_verification_events')
        .insert({
          pilot_id:         currentUser.id,
          connection_id:    connectionId,
          event_type:       'sim_session_submission',
          source_table:     'sim_session_tokens',
          source_record_id: token.id,
          provider_name:    form.provider_name || 'Manual Entry',
          step_reached:     'token_issued',
          outcome:          'success',
          outcome_detail:   `Sim session recorded. Type: ${form.session_type}. Duration: ${form.duration_minutes} min. Competencies: ${form.competency_tags.join(', ') || 'none tagged'}.`,
          referral_dividend_triggered: false,
        });

      setStatus('success');
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
      setStatus('error');
    }
  }, [currentUser?.id]);

  return { status, uploadError, tokenId, submit, reset };
}
