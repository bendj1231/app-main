'use client';

import React, { useState } from 'react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';
import { Search, FileText, ShieldCheck, AlertTriangle, Clock, User, Mail, Phone, Globe, Award, Briefcase } from 'lucide-react';

const SIDEBAR_WIDTH = 260;

interface VerificationResult {
  found: boolean;
  account_number: string;
  submission: {
    id: string;
    status: string;
    submitted_at: string;
    document_purge_after: string | null;
    documents_expired: boolean;
    license_number: string;
    license_type: string;
    license_expiry: string;
    medical_class: string;
    medical_expiry: string;
    total_hours: number;
    pic_hours: number;
    dual_hours: number;
    dual_xc_hours: number;
    night_hours: number;
    instrument_sim_hours: number;
    instrument_actual_hours: number;
    multi_engine_sim_hours: number;
    multi_engine_actual_hours: number;
    cross_country_hours: number;
    rating_sets: string;
    ato_name: string;
    ato_location: string;
    ato_data_needed: string;
    document_keys: string | null;
    consent_json_path: string;
  } | null;
  pilot: {
    auth0_id: string;
    email: string;
    full_name: string;
    phone: string;
    nationality: string;
    pilot_id: string;
    subscription_tier: string;
    status: string;
  } | null;
}

export default function ApcVerificationAdminPage() {
  const { callApi } = useWorkerAuth();
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSearch = async () => {
    if (!accountNumber.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setStatusMessage('');

    try {
      const data = await callApi<VerificationResult>('getVerificationByAccountNumber', {
        account_number: accountNumber.trim(),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!result?.submission?.id) return;
    setUpdatingStatus(true);
    setStatusMessage('');

    try {
      await callApi('updateVerificationStatus', {
        submission_id: result.submission.id,
        status: newStatus,
      });
      setStatusMessage(`Status updated to "${newStatus}". 30-day document purge clock started.`);
      // Refresh result
      await handleSearch();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatHours = (val: number) => (val ? `${val.toFixed(1)}h` : '—');

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      <AdminSidebar />
      <AdminNotificationBell />

      <main className="min-h-screen p-6" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">APC Verification Queue</h1>
            <p className="text-sm text-gray-500 mt-1">
              Search Recognition+ account numbers to view pilot verification submissions, documents, and trace data.
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Recognition+ account number (e.g. PR1234)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !accountNumber.trim()}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {!result.found ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-900 font-medium">No verification found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Account <span className="font-mono font-semibold">{result.account_number}</span> has not submitted an APC verification yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Pilot Profile Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-gray-500" />
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pilot Profile</h2>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: result.pilot?.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color: result.pilot?.status === 'active' ? '#166534' : '#991b1b',
                        }}
                      >
                        {result.pilot?.status || 'unknown'}
                      </span>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{result.pilot?.full_name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Account Number</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 mt-0.5">{result.account_number}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pilot ID</p>
                        <p className="text-sm font-mono font-medium text-gray-900 mt-0.5">{result.pilot?.pilot_id || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tier</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">{result.pilot?.subscription_tier || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <p className="text-sm text-gray-700">{result.pilot?.email || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <p className="text-sm text-gray-700">{result.pilot?.phone || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-400" />
                        <p className="text-sm text-gray-700">{result.pilot?.nationality || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Details */}
                  {result.submission && (
                    <>
                      {/* Status Banner */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-gray-500" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Verification Submission</h2>
                          </div>
                          <div className="flex items-center gap-3">
                            {result.submission.documents_expired && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                <Clock size={12} />
                                Documents Expired
                              </span>
                            )}
                            <select
                              value={result.submission.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              disabled={updatingStatus}
                              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize border-0 cursor-pointer focus:ring-2 focus:ring-red-500"
                              style={{
                                background: result.submission.status === 'verified' ? '#dcfce7' : result.submission.status === 'submitted' ? '#dbeafe' : result.submission.status === 'flagged' ? '#fef3c7' : '#fee2e2',
                                color: result.submission.status === 'verified' ? '#166534' : result.submission.status === 'submitted' ? '#1e40af' : result.submission.status === 'flagged' ? '#92400e' : '#991b1b',
                              }}
                            >
                              <option value="submitted">Submitted</option>
                              <option value="processing">Processing</option>
                              <option value="verified">Verified</option>
                              <option value="rejected">Rejected</option>
                              <option value="flagged">Flagged</option>
                            </select>
                            {updatingStatus && <span className="text-xs text-gray-400">Updating...</span>}
                          </div>
                        </div>

                        {statusMessage && (
                          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100">
                            <p className="text-xs text-blue-700 font-medium">{statusMessage}</p>
                          </div>
                        )}
                        <div className="p-6">
                          {/* License & Medical */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">License Number</p>
                              <p className="text-sm font-mono font-semibold text-gray-900 mt-1">{result.submission.license_number || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">License Type</p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{result.submission.license_type || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">License Expiry</p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{result.submission.license_expiry || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">Medical Expiry</p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{result.submission.medical_expiry || '—'}</p>
                            </div>
                          </div>

                          {/* Flight Hours */}
                          <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                              <Award size={14} />
                              Flight Hours Summary
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                              {[
                                { label: 'Total', value: result.submission.total_hours },
                                { label: 'PIC', value: result.submission.pic_hours },
                                { label: 'Dual', value: result.submission.dual_hours },
                                { label: 'Dual XC', value: result.submission.dual_xc_hours },
                                { label: 'Night', value: result.submission.night_hours },
                                { label: 'XC', value: result.submission.cross_country_hours },
                                { label: 'Inst. Sim', value: result.submission.instrument_sim_hours },
                                { label: 'Inst. Act.', value: result.submission.instrument_actual_hours },
                                { label: 'ME Sim', value: result.submission.multi_engine_sim_hours },
                                { label: 'ME Act.', value: result.submission.multi_engine_actual_hours },
                              ].map((item) => (
                                <div key={item.label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                                  <p className="text-[9px] font-semibold text-gray-400 uppercase">{item.label}</p>
                                  <p className="text-sm font-bold text-gray-900 mt-0.5">{formatHours(item.value)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ATO Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                              <Briefcase size={14} />
                              ATO Authorization
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Name:</span>{' '}
                                <span className="font-medium text-gray-900">{result.submission.ato_name || '—'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>{' '}
                                <span className="font-medium text-gray-900">{result.submission.ato_location || '—'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Data Requested:</span>{' '}
                                <span className="font-medium text-gray-900">{result.submission.ato_data_needed || '—'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Type Ratings */}
                          {result.submission.rating_sets && (
                            <div className="mb-6">
                              <h3 className="text-xs font-bold text-gray-700 mb-2">Type Ratings & Endorsements</h3>
                              <div className="space-y-2">
                                {(JSON.parse(result.submission.rating_sets) as Array<Record<string, unknown>>).map((set, idx) => (
                                  <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        Type Rating {idx + 1}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {set.trainingCenter as string} — {set.country as string}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      {(set.hasCertFile as boolean) && (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Cert</span>
                                      )}
                                      {(set.hasLicFile as boolean) && (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Lic</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Documents */}
                          <div>
                            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                              <FileText size={14} />
                              Documents & Forms
                            </h3>

                            {result.submission.documents_expired ? (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-amber-900">Documents Expired</p>
                                  <p className="text-xs text-amber-700 mt-0.5">
                                    The uploaded documents were purged from secure storage on{' '}
                                    {result.submission.document_purge_after
                                      ? new Date(result.submission.document_purge_after).toLocaleDateString()
                                      : 'the retention deadline'}.
                                    Only the claim record remains.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {result.submission.document_keys && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-green-900 mb-2">Documents Available</p>
                                    <div className="space-y-1">
                                      {Object.entries(JSON.parse(result.submission.document_keys) as Record<string, string>).map(([key, path]) => (
                                        <div key={key} className="flex items-center justify-between text-sm">
                                          <span className="text-green-800 capitalize">{key.replace(/-/g, ' ')}</span>
                                          <span className="text-xs font-mono text-green-600 truncate max-w-[200px]">{path}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                                      <Clock size={10} />
                                      {result.submission.document_purge_after
                                        ? `Purge on: ${new Date(result.submission.document_purge_after).toLocaleDateString()} (30 days from status change)`
                                        : 'Documents retained until status changes to verified/rejected/flagged'}
                                    </p>
                                  </div>
                                )}

                                {result.submission.consent_json_path && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText size={16} className="text-blue-600" />
                                      <div>
                                        <span className="text-sm font-medium text-blue-900">Consent Form JSON</span>
                                        <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 uppercase">Legal Record — Kept Permanently</span>
                                      </div>
                                    </div>
                                    <span className="text-xs font-mono text-blue-600 truncate max-w-[200px]">
                                      {result.submission.consent_json_path}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Submission Meta */}
                          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span>Submission ID: <span className="font-mono">{result.submission.id}</span></span>
                            <span>
                              Submitted:{' '}
                              {new Date(result.submission.submitted_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
