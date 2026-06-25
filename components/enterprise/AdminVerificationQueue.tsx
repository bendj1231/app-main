import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, FileText, Download, Search, Filter,
  ChevronDown, Zap, ArrowRight
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface VerificationItem {
  id: string;
  enterprise_id: string;
  company_name?: string;
  pilot_email?: string;
  pilot_name?: string;
  document_type: string;
  document_url?: string;
  document_hash?: string;
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired';
  credits_burned: number;
  reviewer_notes?: string;
  reviewed_at?: string;
  expires_at?: string;
  metadata?: string;
  created_at: string;
}

export function AdminVerificationQueue() {
  const { callApi } = useEnterprisePortal();
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<VerificationItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await callApi('getVerificationQueue', filter === 'all' ? {} : { status: filter }) as VerificationItem[];
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const filtered = items.filter(i =>
    (i.pilot_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.pilot_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
    i.document_type.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      verified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      expired: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return <span className={`px-2 py-1 rounded-full text-xs border ${map[status] || map.pending}`}>{status}</span>;
  };

  const handleAction = async (status: 'verified' | 'rejected') => {
    if (!selected) return;
    setActionLoading(true);
    try {
      // Burn 1 credit ($1.00 = 100 cents) per verification
      await callApi('burnCredit', {
        enterprise_id: selected.enterprise_id,
        amount: 100,
        description: `Verification review: ${selected.document_type}`,
        verification_id: selected.id,
      });
      await callApi('updateVerification', {
        id: selected.id,
        status,
        reviewer_notes: reviewNotes,
        credits_burned: 100,
        reviewed_at: new Date().toISOString(),
      });
      setSelected(null);
      setReviewNotes('');
      load();
    } catch (e: any) {
      alert(e?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            Verification Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review and approve pilot document submissions. Each review burns 1 credit.</p>
        </div>
        <button onClick={load} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: items.filter(i => i.status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'In Review', value: items.filter(i => i.status === 'in_review').length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Verified', value: items.filter(i => i.status === 'verified').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Rejected', value: items.filter(i => i.status === 'rejected').length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{loading ? '—' : s.value}</div>
            <div className="text-slate-400 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by pilot, company, or document type..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'in_review', 'verified', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${filter === f ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Pilot</th>
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Company</th>
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Document</th>
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Status</th>
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Submitted</th>
              <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30 cursor-pointer" onClick={() => { setSelected(item); setReviewNotes(item.reviewer_notes || ''); }}>
                <td className="py-3 px-4">
                  <div className="text-white text-sm font-medium">{item.pilot_name || 'Unknown'}</div>
                  <div className="text-slate-400 text-xs">{item.pilot_email || '—'}</div>
                </td>
                <td className="py-3 px-4 text-slate-300 text-sm">{item.company_name || '—'}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <FileText className="w-4 h-4 text-slate-500" />
                    {item.document_type}
                  </div>
                </td>
                <td className="py-3 px-4">{statusBadge(item.status)}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <button className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Review
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  {loading ? 'Loading...' : 'No verification submissions found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Review Submission</h2>
                  <p className="text-slate-400 text-sm">{selected.pilot_name} — {selected.document_type}</p>
                </div>
                {statusBadge(selected.status)}
              </div>

              {/* Document preview */}
              {selected.document_url && (
                <div className="mb-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Document
                    </span>
                    <a href={selected.document_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                  {selected.document_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={selected.document_url} alt="Document" className="max-h-64 rounded-lg border border-slate-700 mx-auto" />
                  ) : (
                    <div className="bg-slate-900 rounded-lg p-4 text-slate-400 text-sm text-center">
                      Document preview not available. Click download to view.
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              {selected.metadata && (
                <div className="mb-6">
                  <h3 className="text-slate-300 text-sm font-medium mb-2">Metadata</h3>
                  <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400 overflow-x-auto border border-slate-700">
                    {JSON.stringify(JSON.parse(selected.metadata), null, 2)}
                  </pre>
                </div>
              )}

              {/* Reviewer notes */}
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">Reviewer Notes</label>
                <textarea
                  value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={3}
                  placeholder="Add notes about this verification..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('verified')}
                  disabled={actionLoading || selected.status === 'verified'}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {actionLoading ? 'Processing...' : 'Approve & Burn Credit'}
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading || selected.status === 'rejected'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
              <p className="text-center text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> This action will burn 1 credit ($1.00) from the enterprise account.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminVerificationQueue;
