import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';

const SIDEBAR_WIDTH = 260;
const SUB_SIDEBAR_WIDTH = 240;


interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  category: string;
  notes?: string;
}

const defaultContacts: Contact[] = [
  { id: '1', name: 'Cebu Pacific Air', email: 'partnerships@cebupacificair.com', company: 'Cebu Pacific', category: 'Airlines', notes: 'Philippines low-cost carrier' },
  { id: '2', name: 'AirAsia Philippines', email: 'corp@airasia.com', company: 'AirAsia', category: 'Airlines', notes: 'Major SEA carrier' },
  { id: '3', name: 'Philippine Airlines', email: 'recruitment@philippineairlines.com', company: 'PAL', category: 'Airlines', notes: 'Flag carrier' },
  { id: '4', name: 'Philippine Charter Ops', email: 'ops@charter.ph', company: 'Philippine Charter', category: 'Operators', notes: 'Regional charter operator' },
  { id: '5', name: 'WCC Aviation College', email: 'partnerships@wccaviation.com', company: 'WCC', category: 'ATOs', notes: 'CAAP-approved ATO, Pangasinan' },
  { id: '6', name: 'OMNI Aviation', email: 'training@omniaviation.com', company: 'OMNI', category: 'ATOs', notes: 'Clark-based training center' },
  { id: '7', name: 'Alpha Aviation Group', email: 'enterprise@alphaaviationgroup.com', company: 'AAG', category: 'ATOs', notes: 'International ATO network' },
  { id: '8', name: 'Veremark Partnerships', email: 'partnerships@veremark.com', company: 'Veremark', category: 'Verification Providers', notes: 'Primary verification partner. London HQ. Ask about CAAP PEL single-pull timeline.' },
  { id: '9', name: 'HireRight Aviation', email: 'aviation@hireright.com', company: 'HireRight', category: 'Verification Providers', notes: 'Gold standard for US/PRIA. Use for FAA integration.' },
  { id: '10', name: 'First Advantage', email: 'aviation@fadv.com', company: 'First Advantage', category: 'Verification Providers', notes: 'PRD and FOIA Airmen Certification. US alternative.' },
  { id: '11', name: 'MyFlightBook', email: 'support@myflightbook.com', company: 'MyFlightBook', category: 'Logbook Providers', notes: 'Free logbook with API. OAuth integration active.' },
  { id: '12', name: 'Captain Joe', email: 'hello@captainjoe.aero', company: 'Captain Joe Media', category: 'Pilot Influencers', notes: 'Aviation YouTube, 2M+ subs' },
  { id: '13', name: 'Dutch Pilot Girl', email: 'info@dutchpilotgirl.com', company: 'DPG Media', category: 'Pilot Influencers', notes: 'Pilot career content, EU focus' },
  { id: '14', name: 'Mauritius DPO', email: 'dpo@dataprotection.govmu.org', company: 'Mauritius Data Protection Office', category: 'Business Contacts', notes: 'GDPR/data compliance for Mauritius entity' },
  { id: '15', name: 'Riana Cauchie', email: 'riana@seedlegal.mu', company: 'Seed Legal Mauritius', category: 'Business Contacts', notes: 'Business registration & legal advisory' },
];

const categoryOrder = [
  'Airlines',
  'Operators',
  'ATOs',
  'Verification Providers',
  'Logbook Providers',
  'Pilot Influencers',
  'Business Contacts',
  'Business Registration / Legal',
];

export default function EmailManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isDirector = userProfile?.role === 'admin';
  const isOwner = userProfile?.role === 'owner';
  const isEmployee = !isAdmin && !isSuperAdmin && !isOwner;
  const canReview = isSuperAdmin || isDirector || isOwner;

  const [emails, setEmails] = useState<any[]>([]);
  const [contacts] = useState<Contact[]>(defaultContacts);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [composeData, setComposeData] = useState({ recipient: '', subject: '', body: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('Airlines');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'drafts' | 'review'>('inbox');
  const [reviewNotes, setReviewNotes] = useState('');
  const [resendEmails, setResendEmails] = useState<any[]>([]);

  const userEmail = userProfile?.email || currentUser?.email || '';
  const fromName = userProfile?.display_name || userProfile?.full_name || 'PilotRecognition Team';

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchEmails();
    fetchResendEmails();
  }, [currentUser, isAdmin]);

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_emails')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEmails(data || []);
    } catch (err) {
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResendEmails = async () => {
    if (!userEmail) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Fetch sent emails from Resend
      const sentRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-list-emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({ type: 'sent', email: userEmail }),
        }
      );
      const sentData = await sentRes.json();
      if (sentRes.ok && sentData.emails) {
        setResendEmails(sentData.emails);
      } else {
        console.warn('Resend list error:', sentData.error || 'Unknown');
      }
    } catch (err) {
      console.error('Error fetching Resend emails:', err);
    }
  };

  const saveDraft = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const { error } = await supabase.from('admin_emails').insert([{
        recipient: composeData.recipient,
        subject: composeData.subject,
        body: composeData.body,
        status: 'draft',
        author_id: currentUser?.id,
        category: selectedCategory,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setShowCompose(false);
      setComposeData({ recipient: '', subject: '', body: '' });
      setSelectedContact(null);
      fetchEmails();
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  };

  const submitForReview = async (id: string) => {
    try {
      const { error } = await supabase.from('admin_emails').update({
        status: 'pending_review',
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
      fetchEmails();
    } catch (err) {
      console.error('Error submitting for review:', err);
    }
  };

  const approveAndSend = async (id: string) => {
    try {
      // Get the email details first
      const { data: email } = await supabase.from('admin_emails').select('*').eq('id', id).single();
      if (!email) {
        alert('Email not found');
        return;
      }

      // Call edge function to send via Resend
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-admin-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          email_id: id,
          recipient: email.recipient,
          subject: email.subject,
          body: email.body,
          from_email: userEmail,
          from_name: fromName,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error('Send failed:', result);
        alert('Failed to send email: ' + (result.error || 'Unknown error'));
        return;
      }

      // Update status in Supabase
      const { error } = await supabase.from('admin_emails').update({
        status: 'sent',
        reviewer_id: currentUser?.id,
        review_notes: reviewNotes || null,
        sent_at: new Date().toISOString(),
        resend_message_id: result.message_id || null,
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      if (error) throw error;
      setReviewNotes('');
      setSelectedEmail(null);
      fetchEmails();
    } catch (err) {
      console.error('Error approving email:', err);
      alert('Failed to send email');
    }
  };

  const rejectDraft = async (id: string) => {
    try {
      const { error } = await supabase.from('admin_emails').update({
        status: 'rejected',
        reviewer_id: currentUser?.id,
        review_notes: reviewNotes || null,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
      setReviewNotes('');
      setSelectedEmail(null);
      fetchEmails();
    } catch (err) {
      console.error('Error rejecting email:', err);
    }
  };

  const markAsReviewed = async (id: string) => {
    try {
      const { error } = await supabase.from('admin_emails').update({ status: 'reviewed' }).eq('id', id);
      if (error) throw error;
      fetchEmails();
    } catch (err) {
      console.error('Error marking as reviewed:', err);
    }
  };

  const statusColors: Record<string, string> = {
    draft: '#64748b',
    sent: '#10b981',
    reviewed: '#3b82f6',
    pending: '#f59e0b',
    pending_review: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    pending_review: 'Pending Review',
    sent: 'Sent',
    reviewed: 'Reviewed',
    rejected: 'Rejected',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }}>
        <div style={{ minHeight: '100vh', background: '#0b1121', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: '#e2e8f0' }}>
              Email Management
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Sending as: <strong>{userEmail}</strong>
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Compose Email
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Drafts', value: emails.filter(e => e.status === 'draft' || e.status === 'pending_review').length, color: '#f59e0b' },
            { label: 'Sent', value: resendEmails.length + emails.filter(e => e.status === 'sent').length, color: '#10b981' },
            { label: 'Pending Review', value: emails.filter(e => e.status === 'pending_review').length, color: '#ef4444' },
            { label: 'Resend API', value: resendEmails.length, color: '#3b82f6' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['inbox', 'sent', 'drafts', 'review'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === tab ? '#ef4444' : 'rgba(255,255,255,0.4)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'review' ? 'Pending Review' : tab}
            </button>
          ))}
        </div>

        {/* Email List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : (
          <>
            {/* Role-based header */}
            <div style={{ marginBottom: 20, padding: '16px 20px', background: canReview ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${canReview ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)'}`, borderRadius: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: canReview ? '#ef4444' : '#3b82f6', marginBottom: 4 }}>
                {canReview ? '👑 Owner/Director View' : '👤 Employee View'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {canReview ? 'Review and approve draft emails from employees' : 'Manage your draft emails and submit for review'}
              </div>
            </div>

            {/* Inbox tab — received emails */}
            {activeTab === 'inbox' && (
              <div>
                {resendEmails.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>�</div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>No received emails</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Inbound emails for {userEmail} will appear here</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {resendEmails.map((email: any) => (
                      <div key={email.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: '#e2e8f0' }}>{email.subject}</h3>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                              From: {email.from}
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                              To: {email.to?.join?.(', ') || email.to}
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                            {new Date(email.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sent tab */}
            {activeTab === 'sent' && (
              <div>
                {emails.filter(e => e.status === 'sent').length === 0 && resendEmails.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📤</div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>No sent emails yet</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Sent emails will appear here</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {emails.filter(e => e.status === 'sent').map((email) => (
                      <div key={email.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, cursor: 'pointer' }} onClick={() => setSelectedEmail(email)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: '#e2e8f0' }}>{email.subject}</h3>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>To: {email.recipient}</div>
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                            {new Date(email.sent_at || email.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {resendEmails.map((email: any) => (
                      <div key={email.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: '#e2e8f0' }}>{email.subject}</h3>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>To: {email.to?.join?.(', ') || email.to}</div>
                            <div style={{ fontSize: 11, color: '#3b82f6' }}>Resend API</div>
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                            {new Date(email.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drafts tab */}
            {activeTab === 'drafts' && (
              <div>
                {emails.filter(e => e.status === 'draft' || e.status === 'pending_review').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>No drafts</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {emails
                      .filter(e => e.status === 'draft' || e.status === 'pending_review')
                      .map((email) => (
                        <div key={email.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, cursor: 'pointer' }} onClick={() => setSelectedEmail(email)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                <span style={{ padding: '4px 10px', background: `${statusColors[email.status]}20`, color: statusColors[email.status], borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                                  {statusLabels[email.status] || email.status}
                                </span>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#e2e8f0' }}>{email.subject}</h3>
                              </div>
                              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>To: {email.recipient}</div>
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                              {new Date(email.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 8 }}>
                            {email.body.substring(0, 100)}...
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Review tab */}
            {activeTab === 'review' && (
              <div>
                {!canReview ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>Only directors can review emails</div>
                ) : emails.filter(e => e.status === 'pending_review' || e.status === 'draft').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>Nothing pending review</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {emails
                      .filter(e => e.status === 'pending_review' || e.status === 'draft')
                      .map((email) => (
                        <div key={email.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, cursor: 'pointer' }} onClick={() => setSelectedEmail(email)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                <span style={{ padding: '4px 10px', background: `${statusColors[email.status]}20`, color: statusColors[email.status], borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                                  {statusLabels[email.status] || email.status}
                                </span>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#e2e8f0' }}>{email.subject}</h3>
                              </div>
                              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>To: {email.recipient}</div>
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                              {new Date(email.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 8 }}>
                            {email.body.substring(0, 100)}...
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Compose Modal */}
        {showCompose && (
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
            onClick={() => setShowCompose(false)}
          >
            <div
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 28,
                width: '100%',
                maxWidth: 600,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2e8f0' }}>Compose Email</h2>
              <form onSubmit={(e) => { e.preventDefault(); saveDraft(); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>To</label>
                  <input
                    type="email"
                    value={composeData.recipient}
                    onChange={(e) => setComposeData({ ...composeData, recipient: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Subject</label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Body</label>
                  <textarea
                    value={composeData.body}
                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                    required
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Email Detail Modal */}
        {selectedEmail && (
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
            onClick={() => setSelectedEmail(null)}
          >
            <div
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 28,
                width: '100%',
                maxWidth: 700,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#e2e8f0' }}>{selectedEmail.subject}</h2>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    To: {selectedEmail.recipient} • {new Date(selectedEmail.created_at).toLocaleString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    background: `${statusColors[selectedEmail.status]}20`,
                    color: statusColors[selectedEmail.status],
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {selectedEmail.status}
                </span>
              </div>
              <div
                style={{
                  background: '#0b1121',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20,
                  whiteSpace: 'pre-wrap',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6,
                }}
              >
                {selectedEmail.body}
              </div>

              {/* Review section for owners/directors */}
              {canReview && (selectedEmail.status === 'pending_review' || selectedEmail.status === 'draft') && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add feedback or approval notes..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 13,
                      resize: 'vertical',
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => approveAndSend(selectedEmail.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Approve & Send
                    </button>
                    <button
                      onClick={() => rejectDraft(selectedEmail.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#ef4444',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Employee actions */}
              {!canReview && selectedEmail.author_id === currentUser?.id && selectedEmail.status === 'draft' && (
                <button
                  onClick={() => submitForReview(selectedEmail.id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit for Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
      </main>
    </div>
  );
}