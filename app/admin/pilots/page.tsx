import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { logAuditAction } from '@/src/lib/auditLog';
import { canEdit, canDelete, canVerify, type AdminPermissions } from '@/src/lib/permissions';
import { TableSkeleton } from '@/src/components/admin/LoadingSpinner';
import AdminSidebar from '../components/AdminSidebar';

const SIDEBAR_WIDTH = 260;


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

export default function PilotManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [hoursFilter, setHoursFilter] = useState<'all' | '0-500' | '500-1500' | '1500+'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pilots' | 'verification'>('pilots');

  // Recognition+ Management tab state
  const [docs, setDocs] = useState<PilotDocument[]>([]);
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'all'>('pending_review');
  const [selectedDoc, setSelectedDoc] = useState<PilotDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, total: 0 });

  const adminPermissions = (userProfile?.admin_permissions as AdminPermissions) || null;
  const _canEditPilots = canEdit(adminPermissions, 'pilots');
  const _canDeletePilots = canDelete(adminPermissions, 'pilots');
  const canVerifyPilots = canVerify(adminPermissions);

  const fetchPilots = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPilots(data || []);
    } catch (err) {
      console.error('Error fetching pilots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('pilot_documents')
      .select(
        `
        *,
        pilot:profiles!pilot_id (
          full_name, email, country, verified_account, license_number
        )
      `
      )
      .order('uploaded_at', { ascending: true });

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);

    const { data } = await query;
    setDocs((data as PilotDocument[]) ?? []);

    // Stats
    const { data: allDocs } = await supabase.from('pilot_documents').select('status');
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

  const openDoc = async (doc: PilotDocument) => {
    setSelectedDoc(doc);
    setAdminNotes(doc.admin_notes ?? '');
    setSignedUrl(null);
    const { data } = await supabase.storage
      .from(doc.storage_bucket)
      .createSignedUrl(doc.storage_path, 300);
    if (data?.signedUrl) setSignedUrl(data.signedUrl);
  };

  const updateStatus = async (newStatus: DocStatus) => {
    if (!selectedDoc) return;

    // Check verify permission for verification actions
    if ((newStatus === 'verified' || newStatus === 'rejected') && !canVerifyPilots) {
      alert('You do not have permission to verify or reject documents.');
      return;
    }

    setUpdating(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const oldStatus = selectedDoc.status;

    const { error } = await supabase
      .from('pilot_documents')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedDoc.id);

    if (error) {
      setUpdating(false);
      return;
    }

    // Log audit action
    await logAuditAction({
      actionType:
        newStatus === 'verified' ? 'verify' : newStatus === 'rejected' ? 'reject' : 'update',
      targetTable: 'pilot_documents',
      targetId: selectedDoc.id,
      oldValues: { status: oldStatus, admin_notes: selectedDoc.admin_notes },
      newValues: { status: newStatus, admin_notes: adminNotes || null },
      description: `Document ${selectedDoc.doc_type} for pilot ${selectedDoc.pilot?.full_name || selectedDoc.pilot_id} changed from ${oldStatus} to ${newStatus}`,
    });

    // If verified — check if ALL docs for this pilot are verified → flip verified_account = true
    if (newStatus === 'verified') {
      const { data: pilotDocs } = await supabase
        .from('pilot_documents')
        .select('id, status, doc_type')
        .eq('pilot_id', selectedDoc.pilot_id);

      const updatedStatuses = pilotDocs?.map((d: { id: string; status: string }) =>
        d.id === selectedDoc.id ? newStatus : d.status
      ) ?? [newStatus];

      const allVerified = updatedStatuses.every((s: string) => s === 'verified');
      const hasCritical = (pilotDocs ?? []).some((d: { doc_type: string }) =>
        ['license', 'medical'].includes(d.doc_type)
      );

      if (allVerified && hasCritical) {
        await supabase
          .from('profiles')
          .update({ verified_account: true, updated_at: new Date().toISOString() })
          .eq('id', selectedDoc.pilot_id);

        // Log pilot verification
        await logAuditAction({
          actionType: 'verify',
          targetTable: 'profiles',
          targetId: selectedDoc.pilot_id,
          oldValues: { verified_account: false },
          newValues: { verified_account: true },
          description: `Pilot ${selectedDoc.pilot?.full_name || selectedDoc.pilot_id} verified - all documents approved`,
        });
      }
    }

    // If rejected — ensure verified_account is false
    if (newStatus === 'rejected') {
      await supabase
        .from('profiles')
        .update({ verified_account: false, updated_at: new Date().toISOString() })
        .eq('id', selectedDoc.pilot_id);

      // Log pilot verification removal
      await logAuditAction({
        actionType: 'reject',
        targetTable: 'profiles',
        targetId: selectedDoc.pilot_id,
        oldValues: { verified_account: true },
        newValues: { verified_account: false },
        description: `Pilot ${selectedDoc.pilot?.full_name || selectedDoc.pilot_id} verification revoked - document rejected`,
      });
    }

    setUpdating(false);
    setSelectedDoc(null);
    loadDocs();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPilots();

    // Real-time subscription for profiles
    const profilesSubscription = supabase
      .channel('pilots-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchPilots();
      })
      .subscribe();

    return () => {
      profilesSubscription.unsubscribe();
    };
  }, [currentUser, isAdmin, fetchPilots]);

  useEffect(() => {
    if (activeTab === 'verification' && currentUser && isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDocs();

      // Real-time subscription for pilot_documents
      const docsSubscription = supabase
        .channel('pilot-documents-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pilot_documents' }, () => {
          loadDocs();
        })
        .subscribe();

      return () => {
        docsSubscription.unsubscribe();
      };
    }
  }, [activeTab, filterStatus, currentUser, isAdmin, loadDocs]);

  const allCountries = Array.from(new Set(pilots.map((p) => p.country).filter(Boolean))).sort();
  const allRatings = Array.from(new Set(pilots.flatMap((p) => p.ratings || []).filter(Boolean))).sort();

  const filteredPilots = pilots.filter((pilot) => {
    const matchesSearch = (pilot.display_name || pilot.email || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && pilot.verified_account) ||
      (statusFilter === 'unverified' && !pilot.verified_account);
    const matchesCountry = countryFilter === 'all' || pilot.country === countryFilter;
    const hours = Number(pilot.total_flight_hours) || 0;
    const matchesHours =
      hoursFilter === 'all' ||
      (hoursFilter === '0-500' && hours < 500) ||
      (hoursFilter === '500-1500' && hours >= 500 && hours < 1500) ||
      (hoursFilter === '1500+' && hours >= 1500);
    const matchesRating = ratingFilter === 'all' || (pilot.ratings || []).includes(ratingFilter);
    return matchesSearch && matchesStatus && matchesCountry && matchesHours && matchesRating;
  });

  if (!currentUser || !isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a1a1a' }}>Access Denied</h2>
          <p style={{ color: '#6b7280' }}>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1a1a1a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
      }}
    >
      
      <AdminSidebar />

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }}>
        {/* Top header */}
        <header
          style={{
            height: 64,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(229,231,235,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
              Pilot Management
            </h1>
            <p
              style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}
            >
              Manage pilot accounts and verification status
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: '#ef4444',
                letterSpacing: '0.03em',
              }}
            >
              {pilots.length} Pilots
            </div>
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginBottom: 24,
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: 16,
            }}
          >
            <button
              onClick={() => setActiveTab('pilots')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'pilots' ? 'rgba(239,68,68,0.08)' : 'transparent',
                color: activeTab === 'pilots' ? '#ef4444' : '#6b7280',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: activeTab === 'pilots' ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              Pilot Accounts
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'verification' ? 'rgba(239,68,68,0.08)' : 'transparent',
                color: activeTab === 'verification' ? '#ef4444' : '#6b7280',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: activeTab === 'verification' ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              Recognition+ Management
            </button>
          </div>

          <>
            {/* Pilots Tab */}
            {activeTab === 'pilots' && (
              <>
                {loading ? (
                  <div style={{ padding: '28px 32px' }}>
                    <TableSkeleton rows={8} columns={5} />
                  </div>
                ) : (
                  <>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search pilots..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 20,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          color: '#1a1a1a',
                          fontSize: 13,
                          fontWeight: 500,
                          minWidth: 200,
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['all', 'verified', 'unverified'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status as typeof statusFilter)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 20,
                              border: '1px solid',
                              borderColor: statusFilter === status ? '#ef4444' : '#e5e7eb',
                              background: statusFilter === status ? 'rgba(239,68,68,0.08)' : '#fff',
                              color: statusFilter === status ? '#ef4444' : '#6b7280',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      {allCountries.length > 0 && (
                        <select
                          value={countryFilter}
                          onChange={(e) => setCountryFilter(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, color: '#6b7280', background: '#fff', cursor: 'pointer' }}
                        >
                          <option value="all">All Countries</option>
                          {allCountries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                      <select
                        value={hoursFilter}
                        onChange={(e) => setHoursFilter(e.target.value as any)}
                        style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, color: '#6b7280', background: '#fff', cursor: 'pointer' }}
                      >
                        <option value="all">All Hours</option>
                        <option value="0-500">0-500 hrs</option>
                        <option value="500-1500">500-1500 hrs</option>
                        <option value="1500+">1500+ hrs</option>
                      </select>
                      {allRatings.length > 0 && (
                        <select
                          value={ratingFilter}
                          onChange={(e) => setRatingFilter(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, color: '#6b7280', background: '#fff', cursor: 'pointer' }}
                        >
                          <option value="all">All Ratings</option>
                          {allRatings.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); setCountryFilter('all'); setHoursFilter('all'); setRatingFilter('all'); }}
                        style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    </div>

                    {/* Pilot list */}
                    {filteredPilots.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: 60,
                          background: '#f9fafb',
                          borderRadius: 12,
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
                        <div style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>
                          No pilots found
                        </div>
                        <div style={{ fontSize: 13, color: '#9ca3af' }}>
                          Try adjusting your search or filters
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredPilots.map((pilot) => (
                          <div
                            key={pilot.id}
                            style={{
                              padding: '16px 20px',
                              background: '#f9fafb',
                              borderRadius: 10,
                              border: '1px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 16,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: '#fff',
                                  flexShrink: 0,
                                }}
                              >
                                {(pilot.display_name || pilot.email || '?').charAt(0).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                                  {pilot.display_name || pilot.email}
                                </div>
                                <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  <span>{pilot.email}</span>
                                  {pilot.country && <span>· {pilot.country}</span>}
                                  {pilot.license_id && <span>· License: {pilot.license_id}</span>}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                              {pilot.total_flight_hours ? (
                                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: '#dbeafe', color: '#2563eb' }}>
                                  {pilot.total_flight_hours} hrs
                                </span>
                              ) : null}
                              {pilot.overall_recognition_score ? (
                                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: '#fef3c7', color: '#d97706' }}>
                                  Score: {pilot.overall_recognition_score}
                                </span>
                              ) : null}
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  background: pilot.verified_account ? '#f0fdf4' : '#fef2f2',
                                  color: pilot.verified_account ? '#10b981' : '#ef4444',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {pilot.verified_account ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Recognition+ Management Tab */}
            {activeTab === 'verification' && (
              <div style={{ display: 'flex', gap: 24 }}>
                {/* Queue list */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Filter tabs */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {(['pending_review', 'verified', 'rejected', 'all'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: filterStatus === s ? '#ef4444' : '#e5e7eb',
                          background: filterStatus === s ? 'rgba(239,68,68,0.08)' : '#fff',
                          color: filterStatus === s ? '#ef4444' : '#6b7280',
                          cursor: 'pointer',
                        }}
                      >
                        {s === 'pending_review'
                          ? 'Pending'
                          : s === 'all'
                            ? 'All'
                            : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      marginBottom: 16,
                      padding: 12,
                      background: '#f9fafb',
                      borderRadius: 8,
                    }}
                  >
                    {[
                      { label: 'Pending', value: stats.pending, color: '#f59e0b' },
                      { label: 'Verified', value: stats.verified, color: '#10b981' },
                      { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
                      { label: 'Total', value: stats.total, color: '#6b7280' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                      Loading...
                    </div>
                  ) : docs.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 60,
                        background: '#f9fafb',
                        borderRadius: 12,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontSize: 16, color: '#6b7280' }}>
                        No documents in this queue.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {docs.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => openDoc(doc)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '16px',
                            background: '#f9fafb',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 4,
                              }}
                            >
                              <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                                {doc.pilot?.full_name ?? doc.pilot_id.slice(0, 8)}
                              </span>
                              <span style={{ fontSize: 12, color: '#6b7280' }}>
                                {doc.pilot?.email}
                              </span>
                              {doc.pilot?.verified_account && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    background: '#f0fdf4',
                                    color: '#10b981',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    fontWeight: 600,
                                  }}
                                >
                                  VERIFIED
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 12,
                                color: '#6b7280',
                              }}
                            >
                              <span style={{ fontWeight: 500, color: '#1a1a1a' }}>
                                {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                              </span>
                              <span>•</span>
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {doc.file_name}
                              </span>
                              <span>•</span>
                              <span>{formatSize(doc.file_size_bytes)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: 4,
                                background: `${STATUS_COLORS[doc.status as DocStatus]}`,
                              }}
                            >
                              {doc.status === 'pending_review' ? 'Pending' : doc.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review panel */}
                {selectedDoc && (
                  <div style={{ width: 384, flexShrink: 0 }}>
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        border: '1px solid #e5e7eb',
                        padding: 20,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                          Review Document
                        </h2>
                        <button
                          onClick={() => setSelectedDoc(null)}
                          style={{
                            padding: '4px 8px',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            fontSize: 16,
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Pilot info */}
                        <div style={{ padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: '#1a1a1a',
                              marginBottom: 4,
                            }}
                          >
                            {selectedDoc.pilot?.full_name ?? '—'}
                          </div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                            {selectedDoc.pilot?.email}
                          </div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                            {selectedDoc.pilot?.country}
                          </div>
                          {selectedDoc.pilot?.license_number && (
                            <div
                              style={{ fontSize: 12, color: '#1a1a1a', fontFamily: 'monospace' }}
                            >
                              License: {selectedDoc.pilot.license_number}
                            </div>
                          )}
                        </div>

                        {/* Document info */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            fontSize: 12,
                            color: '#6b7280',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Type</span>
                            <span style={{ fontWeight: 500, color: '#1a1a1a' }}>
                              {DOC_TYPE_LABELS[selectedDoc.doc_type]}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>File</span>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 180,
                              }}
                            >
                              {selectedDoc.file_name}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Uploaded</span>
                            <span style={{ color: '#1a1a1a' }}>
                              {new Date(selectedDoc.uploaded_at).toLocaleString()}
                            </span>
                          </div>
                          {selectedDoc.extracted_license_number && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>License #</span>
                              <span style={{ fontFamily: 'monospace', color: '#1a1a1a' }}>
                                {selectedDoc.extracted_license_number}
                              </span>
                            </div>
                          )}
                          {selectedDoc.extracted_expiry_date && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Expiry</span>
                              <span
                                style={{
                                  color:
                                    new Date(selectedDoc.extracted_expiry_date) < new Date()
                                      ? '#ef4444'
                                      : '#1a1a1a',
                                  fontWeight: 600,
                                }}
                              >
                                {selectedDoc.extracted_expiry_date}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Document viewer */}
                        <div
                          style={{
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            background: '#f9fafb',
                          }}
                        >
                          {signedUrl ? (
                            signedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={signedUrl}
                                alt="Document"
                                style={{ width: '100%', objectFit: 'contain', maxHeight: 256 }}
                              />
                            ) : (
                              <a
                                href={signedUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  padding: 24,
                                  fontSize: 14,
                                  color: '#3b82f6',
                                  textDecoration: 'none',
                                  fontWeight: 500,
                                }}
                              >
                                Open PDF ↗
                              </a>
                            )
                          ) : (
                            <div
                              style={{
                                padding: 24,
                                textAlign: 'center',
                                fontSize: 12,
                                color: '#9ca3af',
                              }}
                            >
                              Loading preview...
                            </div>
                          )}
                        </div>

                        {/* Admin notes */}
                        <div>
                          <label
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#6b7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              display: 'block',
                              marginBottom: 6,
                            }}
                          >
                            Admin Notes
                          </label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                            placeholder="Optional notes for this document..."
                            style={{
                              width: '100%',
                              fontSize: 13,
                              border: '1px solid #e5e7eb',
                              borderRadius: 8,
                              padding: 10,
                              resize: 'none',
                              fontFamily: 'inherit',
                            }}
                          />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                          <button
                            onClick={() => updateStatus('verified')}
                            disabled={
                              updating || selectedDoc.status === 'verified' || !canVerifyPilots
                            }
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor:
                                updating || selectedDoc.status === 'verified' || !canVerifyPilots
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity:
                                updating || selectedDoc.status === 'verified' || !canVerifyPilots
                                  ? 0.4
                                  : 1,
                            }}
                          >
                            {updating ? '...' : '✓ Verify'}
                          </button>
                          <button
                            onClick={() => updateStatus('rejected')}
                            disabled={
                              updating || selectedDoc.status === 'rejected' || !canVerifyPilots
                            }
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor:
                                updating || selectedDoc.status === 'rejected' || !canVerifyPilots
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity:
                                updating || selectedDoc.status === 'rejected' || !canVerifyPilots
                                  ? 0.4
                                  : 1,
                            }}
                          >
                            {updating ? '...' : '✗ Reject'}
                          </button>
                          <button
                            onClick={() => updateStatus('expired')}
                            disabled={updating || selectedDoc.status === 'expired'}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#e5e7eb',
                              color: '#374151',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor:
                                updating || selectedDoc.status === 'expired'
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity: updating || selectedDoc.status === 'expired' ? 0.4 : 1,
                            }}
                          >
                            Expired
                          </button>
                        </div>

                        {selectedDoc.status === 'verified' && (
                          <div style={{ fontSize: 12, color: '#10b981', textAlign: 'center' }}>
                            ✓ Document verified
                            {selectedDoc.pilot?.verified_account
                              ? ' · Pilot account marked verified'
                              : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  );
}