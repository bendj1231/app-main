import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Clock, Mail, RefreshCw,
  ShieldAlert, Users, XCircle, Search, Filter, Play,
  ChevronDown, ChevronUp, Bell
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface QueueItem {
  id: string;
  pilot_id: string;
  pilot_email: string;
  pilot_name: string;
  credential_type: string;
  current_expiry: string;
  status: string;
  cycle_year: number;
  created_at: string;
  notified_at: string | null;
}

interface ExpiryStats {
  total_credentials: number;
  expiring_90d: number;
  expired: number;
  scan_date: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  notified: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  dismissed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const CRED_LABEL: Record<string, string> = {
  license: 'Pilot License',
  medical: 'Medical Certificate',
  radio_license: 'Radio License',
  english_proficiency: 'English Proficiency',
  flight_hours: 'Flight Hours',
};

export function ReverificationQueueAdmin() {
  const { callApi } = useEnterprisePortal();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<ExpiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [queue, expiryStats] = await Promise.all([
        callApi('getReverificationQueue', { status: statusFilter || undefined }) as Promise<QueueItem[]>,
        callApi('getCredentialExpiryStats') as Promise<ExpiryStats>,
      ]);
      setItems(queue);
      setStats(expiryStats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleScan = async () => {
    setScanning(true);
    try {
      const res = await callApi('triggerAnnualReverification') as { created: number; skipped: number; cycle_year: number };
      setMessage(`Scan complete: ${res.created} added, ${res.skipped} skipped for ${res.cycle_year}`);
      setTimeout(() => setMessage(null), 4000);
      load();
    } catch (e: any) {
      setMessage(e?.message || 'Scan failed');
    } finally { setScanning(false); }
  };

  const handleNotify = async (id: string) => {
    try {
      await callApi('notifyReverification', { id });
      setMessage('Notification sent');
      setTimeout(() => setMessage(null), 3000);
      load();
    } catch (e: any) {
      setMessage(e?.message || 'Notify failed');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await callApi('dismissReverification', { id });
      setMessage('Item dismissed');
      setTimeout(() => setMessage(null), 3000);
      load();
    } catch (e: any) {
      setMessage(e?.message || 'Dismiss failed');
    }
  };

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    return !q || (i.pilot_name || '').toLowerCase().includes(q) || (i.pilot_email || '').toLowerCase().includes(q) || i.credential_type.includes(q);
  });

  const grouped = filtered.reduce<Record<string, QueueItem[]>>((acc, item) => {
    const type = item.credential_type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const expiredCount = items.filter(i => i.current_expiry && new Date(i.current_expiry) < new Date()).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-amber-400" />
            Annual Re-Verification Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1">Automated year-end workflow. Pilots with expiring credentials are queued for re-submission.</p>
        </div>
        <button onClick={handleScan} disabled={scanning}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition">
          <Play className="w-4 h-4" />
          {scanning ? 'Scanning...' : 'Run Annual Scan'}
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-4 h-4" /> {message}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <ShieldAlert className="w-5 h-5 text-amber-400 mb-2" />
          <div className="text-2xl font-bold text-white">{pendingCount}</div>
          <div className="text-slate-500 text-xs">Pending Re-Verification</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl font-bold text-white">{expiredCount}</div>
          <div className="text-slate-500 text-xs">Already Expired</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats?.expiring_90d || 0}</div>
          <div className="text-slate-500 text-xs">Expiring in 90 Days</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <Clock className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats?.total_credentials || 0}</div>
          <div className="text-slate-500 text-xs">Total Credentials Tracked</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search pilots..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="notified">Notified</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Queue */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 text-center">
          <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">Queue Empty</h3>
          <p className="text-slate-400 text-sm">Run an annual scan to populate the re-verification queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([type, typeItems]) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-wider">
                <Bell className="w-4 h-4 text-amber-400" />
                {CRED_LABEL[type] || type} ({typeItems.length})
              </div>
              <div className="space-y-2">
                {typeItems.map(item => {
                  const isExpired = item.current_expiry && new Date(item.current_expiry) < new Date();
                  const daysLeft = item.current_expiry
                    ? Math.ceil((new Date(item.current_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div key={item.id} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: isExpired ? 'rgba(239,68,68,0.1)' : daysLeft !== null && daysLeft <= 30 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)' }}>
                        {isExpired ? <AlertTriangle className="w-5 h-5 text-red-400" />
                          : daysLeft !== null && daysLeft <= 30 ? <Clock className="w-5 h-5 text-amber-400" />
                          : <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm">{item.pilot_name || 'Unknown Pilot'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {item.pilot_email || 'No email'} · {CRED_LABEL[item.credential_type] || item.credential_type}
                          {item.current_expiry && (
                            <span className={isExpired ? 'text-red-400 ml-2' : daysLeft !== null && daysLeft <= 30 ? 'text-amber-400 ml-2' : 'text-slate-500 ml-2'}>
                              · {isExpired ? `Expired ${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${STATUS_COLOR[item.status] || STATUS_COLOR.pending} shrink-0`}>
                        {item.status}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'pending' && (
                          <button onClick={() => handleNotify(item.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                            <Mail className="w-3.5 h-3.5" /> Notify
                          </button>
                        )}
                        {item.status !== 'dismissed' && item.status !== 'completed' && (
                          <button onClick={() => handleDismiss(item.id)}
                            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                            <XCircle className="w-3.5 h-3.5" /> Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReverificationQueueAdmin;
