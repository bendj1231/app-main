import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


interface VerificationRequest {
  id: string;
  user_id: string;
  account_number: string;
  full_name: string;
  email: string;
  subscription_id: string | null;
  has_recognition_plus: boolean;
  payment_status: 'pending' | 'partial' | 'paid' | 'failed';
  payment_amount: number;
  amount_paid: number;
  amount_pending: number;
  documents_submitted: boolean;
  provider_name: string;
  provider_status: 'pending' | 'received' | 'processing' | 'completed' | 'rejected';
  provider_response: string | null;
  documents_received_by_provider: boolean;
  payment_invoice_due: boolean;
  invoice_amount: number;
  vc_deployed: boolean;
  vc_deployment_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminVerificationManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deployingVC, setDeployingVC] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    loadRequests();
  }, [currentUser, isAdmin, filterStatus]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Fetch verification requests with payment tracking
      // This would typically query a verification_requests table
      // For now, we'll simulate with profiles table
      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'profiles',
        operation: 'select',
        limit: 500,
      });
      const profiles = (rows || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      });

      if (!profiles) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Transform profiles into verification requests
      // In production, this would be a dedicated table
      const transformedRequests: VerificationRequest[] = profiles.map((p: any) => ({
        id: p.id,
        user_id: p.id,
        account_number: p.account_number || `ACC-${p.id.slice(0, 8).toUpperCase()}`,
        full_name: p.full_name || 'Unknown',
        email: p.email || 'Unknown',
        subscription_id: p.subscription_id || null,
        has_recognition_plus: p.account_tier === 'recognition_plus',
        payment_status: 'pending',
        payment_amount: 99,
        amount_paid: 0,
        amount_pending: 99,
        documents_submitted: false,
        provider_name: 'Veremark',
        provider_status: 'pending',
        provider_response: null,
        documents_received_by_provider: false,
        payment_invoice_due: false,
        invoice_amount: 20,
        vc_deployed: false,
        vc_deployment_date: null,
        created_at: p.created_at,
        updated_at: p.created_at,
      }));

      setRequests(transformedRequests);
    } catch (err) {
      console.error('Error loading verification requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployVC = async (request: VerificationRequest) => {
    setDeployingVC(true);
    setMessage('');

    try {
      // In production, this would call a VC deployment edge function
      // For now, we'll update the local state
      const updatedRequests = requests.map(r =>
        r.id === request.id
          ? {
              ...r,
              vc_deployed: true,
              vc_deployment_date: new Date().toISOString(),
            }
          : r
      );
      setRequests(updatedRequests);
      setSelectedRequest(null);
      setMessage('VC deployed successfully');
      setMessageType('success');
    } catch (err) {
      console.error('Error deploying VC:', err);
      setMessage('Failed to deploy VC');
      setMessageType('error');
    } finally {
      setDeployingVC(false);
    }
  };

  const handleUpdateProviderStatus = async (request: VerificationRequest, newStatus: 'pending' | 'received' | 'processing' | 'completed' | 'rejected') => {
    try {
      const updatedRequests = requests.map(r =>
        r.id === request.id
          ? {
              ...r,
              provider_status: newStatus,
              documents_received_by_provider: newStatus === 'received' || newStatus === 'processing' || newStatus === 'completed',
            }
          : r
      );
      setRequests(updatedRequests);
      if (selectedRequest?.id === request.id) {
        setSelectedRequest(updatedRequests.find(r => r.id === request.id) || null);
      }
      setMessage('Provider status updated');
      setMessageType('success');
    } catch (err) {
      console.error('Error updating provider status:', err);
      setMessage('Failed to update provider status');
      setMessageType('error');
    }
  };

  const handleUpdatePaymentStatus = async (request: VerificationRequest, newStatus: string) => {
    try {
      const updatedRequests = requests.map(r =>
        r.id === request.id
          ? {
              ...r,
              payment_status: newStatus as any,
              amount_paid: newStatus === 'paid' ? r.payment_amount : r.amount_paid,
              amount_pending: newStatus === 'paid' ? 0 : r.amount_pending,
            }
          : r
      );
      setRequests(updatedRequests);
      if (selectedRequest?.id === request.id) {
        setSelectedRequest(updatedRequests.find(r => r.id === request.id) || null);
      }
      setMessage('Payment status updated');
      setMessageType('success');
    } catch (err) {
      console.error('Error updating payment status:', err);
      setMessage('Failed to update payment status');
      setMessageType('error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return '#10b981';
      case 'partial':
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'failed':
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (!currentUser || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
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
              Verification Management
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Track verification requests, payments, and VC deployment
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AdminNotificationBell />
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Message banner */}
          {message && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 24,
                background: messageType === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${messageType === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: messageType === 'success' ? '#166534' : '#991b1b',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {message}
            </div>
          )}

          {/* Filters */}
          <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Filter:</span>
            {['all', 'pending', 'processing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '6px 12px',
                  background: filterStatus === status ? '#ef4444' : '#f3f4f6',
                  color: filterStatus === status ? '#fff' : '#6b7280',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Requests table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
              Loading verification requests...
            </div>
          ) : (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      Account
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      User
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      Subscription
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      Payment
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      Provider
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      VC Status
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
                      onClick={() => setSelectedRequest(request)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        <div style={{ fontWeight: 600 }}>{request.account_number}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        <div>{request.full_name}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{request.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: request.has_recognition_plus ? '#dbeafe' : '#f3f4f6',
                              color: request.has_recognition_plus ? '#1d4ed8' : '#6b7280',
                            }}
                          >
                            {request.has_recognition_plus ? 'Recognition Plus' : 'Free'}
                          </span>
                          {request.subscription_id && (
                            <span style={{ fontSize: 11, color: '#6b7280' }}>
                              ID: {request.subscription_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: `${getStatusColor(request.payment_status)}20`,
                              color: getStatusColor(request.payment_status),
                            }}
                          >
                            {request.payment_status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>
                            ${request.amount_paid}/${request.payment_amount}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        <div>{request.provider_name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: `${getStatusColor(request.provider_status)}20`,
                              color: getStatusColor(request.provider_status),
                            }}
                          >
                            {request.provider_status.toUpperCase()}
                          </span>
                          {request.documents_received_by_provider && (
                            <span style={{ fontSize: 11, color: '#10b981' }}>✓ Docs received</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1a1a1a' }}>
                        {request.vc_deployed ? (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Deployed</span>
                        ) : (
                          <span style={{ color: '#6b7280' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {selectedRequest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setSelectedRequest(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 700,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                Verification Request Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
                User Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Account Number</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{selectedRequest.account_number}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Full Name</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>{selectedRequest.full_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Email</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>{selectedRequest.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Subscription ID</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>
                    {selectedRequest.subscription_id || 'None'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
                Payment Status
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Status</div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: `${getStatusColor(selectedRequest.payment_status)}20`,
                      color: getStatusColor(selectedRequest.payment_status),
                    }}
                  >
                    {selectedRequest.payment_status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Amount</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>
                    ${selectedRequest.amount_paid} / ${selectedRequest.payment_amount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Pending</div>
                  <div style={{ fontSize: 13, color: selectedRequest.amount_pending > 0 ? '#ef4444' : '#10b981' }}>
                    ${selectedRequest.amount_pending}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Provider Invoice</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>
                    ${selectedRequest.invoice_amount} {selectedRequest.payment_invoice_due ? '(Due)' : '(Paid)'}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleUpdatePaymentStatus(selectedRequest, 'paid')}
                  style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Paid
                </button>
                <button
                  onClick={() => handleUpdatePaymentStatus(selectedRequest, 'partial')}
                  style={{
                    padding: '6px 12px',
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Partial
                </button>
              </div>
            </div>

            {/* Provider Status */}
            <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
                Verification Provider
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Provider</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{selectedRequest.provider_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Status</div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: `${getStatusColor(selectedRequest.provider_status)}20`,
                      color: getStatusColor(selectedRequest.provider_status),
                    }}
                  >
                    {selectedRequest.provider_status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Documents Submitted</div>
                  <div style={{ fontSize: 13, color: selectedRequest.documents_submitted ? '#10b981' : '#6b7280' }}>
                    {selectedRequest.documents_submitted ? '✓ Yes' : '✗ No'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Docs Received by Provider</div>
                  <div style={{ fontSize: 13, color: selectedRequest.documents_received_by_provider ? '#10b981' : '#6b7280' }}>
                    {selectedRequest.documents_received_by_provider ? '✓ Yes' : '✗ No'}
                  </div>
                </div>
              </div>
              {selectedRequest.provider_response && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Provider Response</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a', background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                    {selectedRequest.provider_response}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleUpdateProviderStatus(selectedRequest, 'received')}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Received
                </button>
                <button
                  onClick={() => handleUpdateProviderStatus(selectedRequest, 'processing')}
                  style={{
                    padding: '6px 12px',
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Processing
                </button>
                <button
                  onClick={() => handleUpdateProviderStatus(selectedRequest, 'completed')}
                  style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Completed
                </button>
              </div>
            </div>

            {/* VC Deployment */}
            <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
                Verifiable Credential Deployment
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Status</div>
                  <div style={{ fontSize: 13, color: selectedRequest.vc_deployed ? '#10b981' : '#6b7280' }}>
                    {selectedRequest.vc_deployed ? '✓ Deployed' : 'Pending'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Deployment Date</div>
                  <div style={{ fontSize: 13, color: '#1a1a1a' }}>
                    {selectedRequest.vc_deployment_date
                      ? new Date(selectedRequest.vc_deployment_date).toLocaleDateString()
                      : 'Not deployed'}
                  </div>
                </div>
              </div>
              {!selectedRequest.vc_deployed && (
                <button
                  onClick={() => handleDeployVC(selectedRequest)}
                  disabled={deployingVC}
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    background: deployingVC ? '#9ca3af' : '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: deployingVC ? 'not-allowed' : 'pointer',
                  }}
                >
                  {deployingVC ? 'Deploying...' : 'Deploy VC'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}