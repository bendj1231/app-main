import { useState, useCallback } from 'react';
import { useWorkerAuth } from './useWorkerAuth';
import { useAuth } from '../contexts/AuthContext';

export interface ParsedLogbookRow {
  date: string;
  aircraft_type: string;
  aircraft_registration: string;
  pic_hours: number;
  sic_hours: number;
  night_hours: number;
  ifr_hours: number;
  cross_country_hours: number;
  total_hours: number;
  remarks: string;
}

export interface UploadSummary {
  totalHours: number;
  picHours: number;
  sicHours: number;
  nightHours: number;
  ifrHours: number;
  crossCountryHours: number;
  rowCount: number;
  aircraftTypes: string[];
  dateFrom: string;
  dateTo: string;
}

export type UploadStatus = 'idle' | 'parsing' | 'preview' | 'uploading' | 'success' | 'error';

const COLUMN_ALIASES: Record<string, string> = {
  // date
  date: 'date', 'flight date': 'date', 'dep date': 'date',
  // aircraft type
  'aircraft type': 'aircraft_type', type: 'aircraft_type', 'a/c type': 'aircraft_type', aircraft: 'aircraft_type',
  // registration
  registration: 'aircraft_registration', reg: 'aircraft_registration', 'tail number': 'aircraft_registration', tail: 'aircraft_registration',
  // pic
  'pic hours': 'pic_hours', pic: 'pic_hours', 'pilot in command': 'pic_hours',
  // sic
  'sic hours': 'sic_hours', sic: 'sic_hours', 'second in command': 'sic_hours',
  // night
  'night hours': 'night_hours', night: 'night_hours',
  // ifr
  'ifr hours': 'ifr_hours', ifr: 'ifr_hours', instrument: 'ifr_hours', 'actual instrument': 'ifr_hours',
  // cross country
  'cross country hours': 'cross_country_hours', 'cross country': 'cross_country_hours', 'xc hours': 'cross_country_hours', xc: 'cross_country_hours',
  // total
  'total hours': 'total_hours', total: 'total_hours', 'total time': 'total_hours', duration: 'total_hours',
  // remarks
  remarks: 'remarks', notes: 'remarks', comments: 'remarks',
};

function parseNum(val: string): number {
  if (!val || val.trim() === '') return 0;
  const n = parseFloat(val.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function normaliseHeader(h: string): string {
  return COLUMN_ALIASES[h.trim().toLowerCase()] ?? h.trim().toLowerCase().replace(/\s+/g, '_');
}

export function parseCSV(text: string): { rows: ParsedLogbookRow[]; errors: string[] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return { rows: [], errors: ['CSV has no data rows.'] };

  const rawHeaders = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
  const headers = rawHeaders.map(normaliseHeader);

  const rows: ParsedLogbookRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = values[idx] ?? ''; });

    const totalHours = parseNum(obj['total_hours']) || (parseNum(obj['pic_hours']) + parseNum(obj['sic_hours']));

    if (totalHours === 0 && !obj['date']) continue;

    rows.push({
      date: obj['date'] ?? '',
      aircraft_type: obj['aircraft_type'] ?? '',
      aircraft_registration: obj['aircraft_registration'] ?? '',
      pic_hours: parseNum(obj['pic_hours']),
      sic_hours: parseNum(obj['sic_hours']),
      night_hours: parseNum(obj['night_hours']),
      ifr_hours: parseNum(obj['ifr_hours']),
      cross_country_hours: parseNum(obj['cross_country_hours']),
      total_hours: totalHours,
      remarks: obj['remarks'] ?? '',
    });
  }

  if (rows.length === 0) errors.push('No valid data rows found. Check column headers match expected format.');

  return { rows, errors };
}

export function summariseRows(rows: ParsedLogbookRow[]): UploadSummary {
  const dates = rows.map(r => r.date).filter(Boolean).sort();
  const types = [...new Set(rows.map(r => r.aircraft_type).filter(Boolean))];
  return {
    totalHours:       rows.reduce((s, r) => s + r.total_hours, 0),
    picHours:         rows.reduce((s, r) => s + r.pic_hours, 0),
    sicHours:         rows.reduce((s, r) => s + r.sic_hours, 0),
    nightHours:       rows.reduce((s, r) => s + r.night_hours, 0),
    ifrHours:         rows.reduce((s, r) => s + r.ifr_hours, 0),
    crossCountryHours:rows.reduce((s, r) => s + r.cross_country_hours, 0),
    rowCount:         rows.length,
    aircraftTypes:    types,
    dateFrom:         dates[0] ?? '',
    dateTo:           dates[dates.length - 1] ?? '',
  };
}

export function useLogbookUpload() {
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const [status, setStatus]       = useState<UploadStatus>('idle');
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [rows, setRows]           = useState<ParsedLogbookRow[]>([]);
  const [summary, setSummary]     = useState<UploadSummary | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tokenId, setTokenId]     = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setParseErrors([]);
    setRows([]);
    setSummary(null);
    setUploadError(null);
    setTokenId(null);
  }, []);

  const handleFile = useCallback((file: File) => {
    setStatus('parsing');
    setParseErrors([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { rows: parsed, errors } = parseCSV(text);
      setParseErrors(errors);
      if (parsed.length > 0) {
        setRows(parsed);
        setSummary(summariseRows(parsed));
        setStatus('preview');
      } else {
        setStatus('error');
      }
    };
    reader.onerror = () => {
      setParseErrors(['Failed to read file.']);
      setStatus('error');
    };
    reader.readAsText(file);
  }, []);

  const submit = useCallback(async (issuerName: string) => {
    if (!currentUser?.id || !summary) return;
    setStatus('uploading');
    setUploadError(null);

    try {
      // 1. Ensure pilot_platform_connections row exists for manual-upload source
      const existingConnRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_platform_connections',
        operation: 'select',
        where: { pilot_id: currentUser.id, provider_slug: 'manual-csv' },
        limit: 1,
      });
      const existingConn = existingConnRows?.[0];

      let connectionId: string;

      if (existingConn) {
        connectionId = existingConn.id as string;
      } else {
        const newConn = await callApi<Record<string, unknown>>('queryTable', {
          table: 'pilot_platform_connections',
          operation: 'insert',
          data: {
            pilot_id: currentUser.id,
            provider_type: 'logbook',
            provider_name: 'Manual CSV Upload',
            provider_slug: 'manual-csv',
            connection_status: 'active',
          },
        });
        connectionId = (newConn as { id: string }).id;
      }

      // 2. Write the logbook_hour_tokens row (L1 — self-reported)
      const token = await callApi<Record<string, unknown>>('queryTable', {
        table: 'logbook_hour_tokens',
        operation: 'insert',
        data: {
          pilot_id:             currentUser.id,
          connection_id:        connectionId,
          issuer_type:          'self_reported',
          issuer_name:          issuerName || 'Self (CSV Import)',
          total_hours:          Math.round(summary.totalHours * 10) / 10,
          pic_hours:            Math.round(summary.picHours * 10) / 10,
          sic_hours:            Math.round(summary.sicHours * 10) / 10,
          night_hours:          Math.round(summary.nightHours * 10) / 10,
          ifr_hours:            Math.round(summary.ifrHours * 10) / 10,
          cross_country_hours:  Math.round(summary.crossCountryHours * 10) / 10,
          period_from:          summary.dateFrom || null,
          period_to:            summary.dateTo || null,
          verification_level:   1,
          status:               'pending',
        },
      });

      const tokenId = (token as { id: string }).id;
      setTokenId(tokenId);

      // 3. Write audit event
      await callApi('queryTable', {
        table: 'p12_verification_events',
        operation: 'insert',
        data: {
          pilot_id:        currentUser.id,
          connection_id:   connectionId,
          event_type:      'logbook_verification',
          source_table:    'logbook_hour_tokens',
          source_record_id: tokenId,
          provider_name:   'Manual CSV Upload',
          step_reached:    'token_issued',
          outcome:         'success',
          outcome_detail:  `${summary.rowCount} rows parsed. ${summary.totalHours} total hours. L1 self-reported token created.`,
        },
      });

      setStatus('success');
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
      setStatus('error');
    }
  }, [currentUser?.id, summary]);

  return { status, parseErrors, rows, summary, uploadError, tokenId, handleFile, submit, reset };
}
