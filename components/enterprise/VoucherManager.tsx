import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Plus, Download, Copy, CheckCircle, AlertTriangle,
  Users, XCircle, RotateCcw, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface VoucherBatch {
  id: string;
  batch_name: string;
  tier: string;
  amount_cents: number;
  quantity: number;
  codes_generated: number;
  codes_redeemed: number;
  expires_at: string | null;
  status: string;
  payment_status: string;
  dodo_checkout_id: string | null;
  created_at: string;
}

interface VoucherCode {
  id: string;
  code: string;
  status: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
}

export function VoucherManager() {
  const { account, callApi } = useEnterprisePortal();
  const [batches, setBatches] = useState<VoucherBatch[]>([]);
  const [codes, setCodes] = useState<Record<string, VoucherCode[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [newBatch, setNewBatch] = useState({
    batch_name: '',
    quantity: 10,
    tier: 'recognition_plus',
    amount_cents: 2900,
    expires_at: '',
  });

  const loadBatches = async () => {
    if (!account?.id) return;
    try {
      setLoading(true);
      const res = await callApi('getVoucherBatches', { enterprise_id: account.id }) as VoucherBatch[];
      setBatches(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Handle Dodo checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const batchId = params.get('batch');
    const checkout = params.get('checkout');
    if (batchId && checkout === 'success') {
      setMessage('Payment successful! Codes will be generated shortly.');
      setTimeout(() => setMessage(null), 5000);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
      loadBatches();
    } else if (batchId && checkout === 'cancelled') {
      setMessage('Payment cancelled. You can retry anytime.');
      setTimeout(() => setMessage(null), 5000);
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, [account?.id]);

  const handleCreate = async () => {
    if (!newBatch.batch_name || !account?.id) return;
    setLoading(true);
    try {
      await callApi('createVoucherBatch', {
        enterprise_id: account.id,
        batch_name: newBatch.batch_name,
        quantity: Number(newBatch.quantity),
        tier: newBatch.tier,
        amount_cents: Number(newBatch.amount_cents),
        expires_at: newBatch.expires_at || null,
      });
      setShowCreate(false);
      setNewBatch({ batch_name: '', quantity: 10, tier: 'recognition_plus', amount_cents: 2900, expires_at: '' });
      loadBatches();
      setMessage('Batch created successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to create batch');
    } finally { setLoading(false); }
  };

  const handleGenerate = async (batchId: string) => {
    setGenerating(batchId);
    try {
      const res = await callApi('generateVoucherCodes', { batch_id: batchId }) as { generated: number; codes: string[] };
      setMessage(`${res.generated} codes generated`);
      setTimeout(() => setMessage(null), 3000);
      loadBatches();
    } catch (e: any) {
      setMessage(e?.message || 'Failed to generate codes');
    } finally { setGenerating(null); }
  };

  const handlePurchase = async (batchId: string) => {
    setPaying(batchId);
    try {
      const res = await callApi('purchaseVoucherBatch', { batch_id: batchId }) as { checkout_url: string; total_cents: number };
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (e: any) {
      setMessage(e?.message || 'Checkout failed');
      setPaying(null);
    }
  };

  const loadCodes = async (batchId: string) => {
    if (codes[batchId]) { setExpandedBatch(expandedBatch === batchId ? null : batchId); return; }
    try {
      const res = await callApi('getVoucherCodes', { batch_id: batchId }) as VoucherCode[];
      setCodes(prev => ({ ...prev, [batchId]: res }));
      setExpandedBatch(batchId);
    } catch (e) { console.error(e); }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exportCodes = (batch: VoucherBatch, batchCodes: VoucherCode[]) => {
    const csv = ['Code,Status,Redeemed By,Redeemed At'].concat(
      batchCodes.map(c => `${c.code},${c.status},${c.redeemed_by || ''},${c.redeemed_at || ''}`)
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${batch.batch_name.replace(/\s+/g, '_')}_codes.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-emerald-400" />
            Bulk Voucher System
          </h1>
          <p className="text-slate-400 text-sm mt-1">Generate one-time codes for graduating classes. Pilots redeem for Recognition+ subscription.</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> New Batch
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${message.includes('success') || message.includes('generated') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.includes('success') || message.includes('generated') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message}
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-4 overflow-hidden">
            <h3 className="text-white font-bold">Create Voucher Batch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Batch Name</label>
                <input value={newBatch.batch_name} onChange={e => setNewBatch({ ...newBatch, batch_name: e.target.value })}
                  placeholder="WCC Class of 2026" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Quantity</label>
                <input type="number" value={newBatch.quantity} onChange={e => setNewBatch({ ...newBatch, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Tier</label>
                <select value={newBatch.tier} onChange={e => setNewBatch({ ...newBatch, tier: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                  <option value="recognition_plus">Recognition+</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Price per Voucher (cents)</label>
                <input type="number" value={newBatch.amount_cents} onChange={e => setNewBatch({ ...newBatch, amount_cents: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Batch Expires At (optional)</label>
                <input type="date" value={newBatch.expires_at} onChange={e => setNewBatch({ ...newBatch, expires_at: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition">Create Batch</button>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white px-4 py-2.5 transition">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : batches.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 text-center">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">No Voucher Batches</h3>
          <p className="text-slate-400 text-sm">Create a batch to generate codes for your graduating class.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map(batch => {
            const batchCodes = codes[batch.id] || [];
            const isExpanded = expandedBatch === batch.id;
            return (
              <div key={batch.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-600/15 rounded-xl flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm flex items-center gap-2">
                      {batch.batch_name}
                      {batch.payment_status === 'pending' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Unpaid</span>
                      )}
                      {batch.payment_status === 'paid' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Paid</span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{batch.tier}</span> · ${(batch.amount_cents / 100).toFixed(2)} each
                      {batch.expires_at && <span className="text-amber-400">· Expires {new Date(batch.expires_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white font-bold text-lg">{batch.codes_redeemed} / {batch.quantity}</div>
                    <div className="text-slate-500 text-xs">Redeemed</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {batch.payment_status === 'pending' ? (
                      <button onClick={() => handlePurchase(batch.id)} disabled={!!paying}
                        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                        {paying === batch.id ? 'Redirecting...' : `Pay $${(batch.amount_cents * batch.quantity / 100).toFixed(2)}`}
                      </button>
                    ) : batch.codes_generated === 0 ? (
                      <button onClick={() => handleGenerate(batch.id)} disabled={!!generating}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                        <RotateCcw className="w-3.5 h-3.5" />
                        {generating === batch.id ? 'Generating...' : 'Generate'}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => loadCodes(batch.id)}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {batchCodes.length > 0 ? 'Hide' : 'View'} Codes
                        </button>
                        {batchCodes.length > 0 && (
                          <button onClick={() => exportCodes(batch, batchCodes)}
                            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
                            <Download className="w-3.5 h-3.5" /> CSV
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && batchCodes.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-700/40 overflow-hidden">
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                        {batchCodes.map(c => (
                          <div key={c.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono ${
                            c.status === 'redeemed' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                              : c.status === 'revoked' ? 'bg-red-500/5 border-red-500/20 text-red-300'
                              : 'bg-slate-700/30 border-slate-600/30 text-slate-300'
                          }`}>
                            <span className="flex-1 truncate">{c.code}</span>
                            {c.status === 'unused' && (
                              <button onClick={() => copyToClipboard(c.code)} className="text-slate-500 hover:text-white transition">
                                {copiedCode === c.code ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                            {c.status === 'redeemed' && <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {c.status === 'revoked' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VoucherManager;
