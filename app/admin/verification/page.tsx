'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../src/lib/supabase';

type DocStatus = 'pending_review' | 'verified' | 'rejected' | 'expired';

interface PilotDocument {
  id: string;
  pilot_id: string;
  doc_type: string;
  file_name: string;
  file_size_bytes: number | null;
  storage_path: string;
  storage_bucket: string;
  status: DocStatus;
  extracted_license_number: string | null;
  extracted_expiry_date: string | null;
  extracted_issue_date: string | null;
  extracted_issuing_authority: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  uploaded_at: string;
  pilot?: {
    full_name: string | null;
    email: string | null;
    country: string | null;
    verified_account: boolean | null;
    license_number: string | null;
  };
}

const STATUS_COLORS: Record<DocStatus, string> = {
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  license: 'Pilot License',
  medical: 'Medical Certificate',
  rating: 'Type Rating',
  logbook: 'Flight Logbook',
  radio: 'Radio License',
  other: 'Other',
};

export default function AdminVerificationQueue() {
  const [docs, setDocs] = useState<PilotDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'all'>('pending_review');
  const [selected, setSelected] = useState<PilotDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, total: 0 });

  const loadDocs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('pilot_documents')
      .select(`
        *,
        pilot:profiles!pilot_id (
          full_name, email, country, verified_account, license_number
        )
      `)
      .order('uploaded_at', { ascending: true });

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);

    const { data } = await query;
    setDocs((data as PilotDocument[]) ?? []);

    // Stats
    const { data: allDocs } = await supabase
      .from('pilot_documents')
      .select('status');
    if (allDocs) {
      setStats({
        pending: allDocs.filter((d: { status: string }) => d.status === 'pending_review').length,
        verified: allDocs.filter((d: { status: string }) => d.status === 'verified').length,
        rejected: allDocs.filter((d: { status: string }) => d.status === 'rejected').length,
        total: allDocs.length,
      });
    }
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const openDoc = async (doc: PilotDocument) => {
    setSelected(doc);
    setAdminNotes(doc.admin_notes ?? '');
    setSignedUrl(null);
    const { data } = await supabase.storage
      .from(doc.storage_bucket)
      .createSignedUrl(doc.storage_path, 300);
    if (data?.signedUrl) setSignedUrl(data.signedUrl);
  };

  const updateStatus = async (newStatus: DocStatus) => {
    if (!selected) return;
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('pilot_documents')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id);

    if (error) { setUpdating(false); return; }

    // If verified — check if ALL docs for this pilot are verified → flip verified_account = true
    if (newStatus === 'verified') {
      const { data: pilotDocs } = await supabase
        .from('pilot_documents')
        .select('id, status, doc_type')
        .eq('pilot_id', selected.pilot_id);

      const updatedStatuses = pilotDocs?.map((d: { id: string; status: string }) =>
        d.id === selected.id ? newStatus : d.status
      ) ?? [newStatus];

      const allVerified = updatedStatuses.every((s: string) => s === 'verified');
      const hasCritical = (pilotDocs ?? []).some((d: { doc_type: string }) =>
        ['license', 'medical'].includes(d.doc_type)
      );

      if (allVerified && hasCritical) {
        await supabase
          .from('profiles')
          .update({ verified_account: true, updated_at: new Date().toISOString() })
          .eq('id', selected.pilot_id);
      }
    }

    // If rejected — ensure verified_account is false
    if (newStatus === 'rejected') {
      await supabase
        .from('profiles')
        .update({ verified_account: false, updated_at: new Date().toISOString() })
        .eq('id', selected.pilot_id);
    }

    setUpdating(false);
    setSelected(null);
    loadDocs();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold">Admin</p>
            <h1 className="text-xl font-bold text-slate-900">Document Verification Queue</h1>
          </div>
          <div className="flex gap-5 text-center">
            {[
              { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
              { label: 'Verified', value: stats.verified, color: 'text-emerald-600' },
              { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
              { label: 'Total', value: stats.total, color: 'text-slate-700' },
            ].map(s => (
              <div key={s.label}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Queue list */}
        <div className="flex-1 min-w-0">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {(['pending_review', 'verified', 'rejected', 'all'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                  filterStatus === s
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {s === 'pending_review' ? 'Pending' : s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Loading...
            </div>
          ) : docs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-400 text-sm">No documents in this queue.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {docs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => openDoc(doc)}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4 ${
                    selected?.id === doc.id ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        {doc.pilot?.full_name ?? doc.pilot_id.slice(0, 8)}
                      </span>
                      <span className="text-slate-400 text-xs truncate">{doc.pilot?.email}</span>
                      {doc.pilot?.verified_account && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">
                        {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                      </span>
                      <span>•</span>
                      <span className="truncate">{doc.file_name}</span>
                      <span>•</span>
                      <span>{formatSize(doc.file_size_bytes)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-400">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${STATUS_COLORS[doc.status as DocStatus]}`}>
                      {doc.status === 'pending_review' ? 'Pending' : doc.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Review panel */}
        {selected && (
          <div className="w-96 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-sm">Review Document</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg leading-none"
                >×</button>
              </div>

              <div className="p-5 space-y-4">
                {/* Pilot info */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <p className="font-semibold text-slate-900 text-sm">{selected.pilot?.full_name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{selected.pilot?.email}</p>
                  <p className="text-xs text-slate-500">{selected.pilot?.country}</p>
                  {selected.pilot?.license_number && (
                    <p className="text-xs text-slate-600 font-mono">License: {selected.pilot.license_number}</p>
                  )}
                </div>

                {/* Document info */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="font-medium">{DOC_TYPE_LABELS[selected.doc_type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File</span>
                    <span className="font-mono truncate max-w-[180px]">{selected.file_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uploaded</span>
                    <span>{new Date(selected.uploaded_at).toLocaleString()}</span>
                  </div>
                  {selected.extracted_license_number && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">License #</span>
                      <span className="font-mono">{selected.extracted_license_number}</span>
                    </div>
                  )}
                  {selected.extracted_expiry_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expiry</span>
                      <span className={new Date(selected.extracted_expiry_date) < new Date() ? 'text-red-600 font-semibold' : ''}>
                        {selected.extracted_expiry_date}
                      </span>
                    </div>
                  )}
                </div>

                {/* Document viewer */}
                <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  {signedUrl ? (
                    signedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={signedUrl} alt="Document" className="w-full object-contain max-h-64" />
                    ) : (
                      <a
                        href={signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-6 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Open PDF ↗
                      </a>
                    )
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">Loading preview...</div>
                  )}
                </div>

                {/* Admin notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Optional notes for this document..."
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => updateStatus('verified')}
                    disabled={updating || selected.status === 'verified'}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                  >
                    {updating ? '...' : '✓ Verify'}
                  </button>
                  <button
                    onClick={() => updateStatus('rejected')}
                    disabled={updating || selected.status === 'rejected'}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-40 transition-colors"
                  >
                    {updating ? '...' : '✗ Reject'}
                  </button>
                  <button
                    onClick={() => updateStatus('expired')}
                    disabled={updating || selected.status === 'expired'}
                    className="flex-1 bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-300 disabled:opacity-40 transition-colors"
                  >
                    Expired
                  </button>
                </div>

                {selected.status === 'verified' && (
                  <p className="text-xs text-emerald-600 text-center">
                    ✓ Document verified{selected.pilot?.verified_account ? ' · Pilot account marked verified' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
