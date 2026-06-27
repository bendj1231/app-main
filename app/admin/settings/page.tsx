import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { logAuditAction } from '@/lib/auditLog';
import { type AdminPermissions, type PermissionSet, FULL_PERMISSIONS, READ_ONLY_PERMISSIONS } from '@/lib/permissions';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    displayName: userProfile?.display_name || '',
    email: userProfile?.email || '',
    referralCode: userProfile?.referral_code || '',
    phoneNumber: userProfile?.phone_number || '',
    region: userProfile?.region || '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.display_name || '',
        email: userProfile.email || '',
        referralCode: userProfile.referral_code || '',
        phoneNumber: userProfile.phone_number || '',
        region: userProfile.region || '',
      });
    }
    if (isAdmin) {
      fetchAdminUsers();
      fetchSecurityEvents();
    }
  }, [userProfile, isAdmin]);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, role, admin_permissions')
        .in('role', ['super_admin', 'admin'])
        .order('display_name', { ascending: true });
      if (error) throw error;
      setAdminUsers(data || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const fetchSecurityEvents = async () => {
    setEventsLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setSecurityEvents(data || []);
    } catch (err) {
      console.error('Error fetching security events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleSavePermissions = async (permissions: AdminPermissions) => {
    if (!selectedAdmin) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ admin_permissions: permissions })
        .eq('id', selectedAdmin.id);
      if (error) throw error;
      
      await logAuditAction({
        actionType: 'update',
        targetTable: 'profiles',
        targetId: selectedAdmin.id,
        oldValues: { admin_permissions: selectedAdmin.admin_permissions },
        newValues: { admin_permissions: permissions },
        description: `Updated permissions for admin: ${selectedAdmin.display_name || selectedAdmin.email}`,
      });
      
      setShowPermissionsModal(false);
      setSelectedAdmin(null);
      fetchAdminUsers();
    } catch (err) {
      console.error('Error saving permissions:', err);
      alert('Failed to save permissions');
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser?.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', currentUser?.id);

      if (error) throw error;

      setMessage('Profile photo updated successfully');
      setMessageType('success');
    } catch (err) {
      console.error('Error uploading profile:', err);
      setMessage('Failed to upload profile photo');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      const oldValues = {
        display_name: userProfile?.display_name,
        phone_number: userProfile?.phone_number,
        region: userProfile?.region,
      };

      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: formData.displayName,
          phone_number: formData.phoneNumber,
          region: formData.region,
        })
        .eq('id', currentUser.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Log audit action
      await logAuditAction({
        actionType: 'update',
        targetTable: 'profiles',
        targetId: currentUser.id,
        oldValues,
        newValues: {
          display_name: formData.displayName,
          phone_number: formData.phoneNumber,
          region: formData.region,
        },
        description: 'Admin updated their profile settings',
      });

      setMessage('Profile updated successfully');
      setMessageType('success');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setMessage(err?.message || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReferralCode = async () => {
    if (!formData.referralCode.trim()) {
      setMessage('Referral code cannot be empty');
      setMessageType('error');
      return;
    }

    if (!currentUser?.id) {
      setMessage('User not authenticated');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Check if code is already taken by another user
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', formData.referralCode.toUpperCase())
        .neq('id', currentUser.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking referral code:', checkError);
        throw checkError;
      }

      if (existing) {
        setMessage('This referral code is already taken');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: formData.referralCode.toUpperCase() })
        .eq('id', currentUser.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setMessage('Referral code updated successfully');
      setMessageType('success');
    } catch (err: any) {
      console.error('Error updating referral code:', err);
      setMessage(err?.message || 'Failed to update referral code');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    // Placeholder for 2FA setup
    setShow2FAModal(true);
  };

  const handleDisable2FA = async () => {
    setTwoFactorEnabled(false);
    setMessage('2FA disabled');
    setMessageType('success');
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
              Account Settings
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Manage your profile and security preferences
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AdminNotificationBell />
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px', maxWidth: 800 }}>
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

          {/* Profile Photo Section */}
          <div style={{ marginBottom: 32, padding: '24px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>
              Profile Photo
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: userProfile?.avatar_url 
                    ? `url(${userProfile.avatar_url}) center/cover` 
                    : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {!userProfile?.avatar_url && ((userProfile?.display_name || userProfile?.email || currentUser?.email || '?') as string).charAt(0).toUpperCase()}
              </div>
              <div>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="profile-upload"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                </label>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div style={{ marginBottom: 32, padding: '24px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>
              Profile Information
            </h2>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#6b7280',
                    fontSize: 14,
                    cursor: 'not-allowed',
                  }}
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                  Contact support to change email
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+1 234 567 8900"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Account Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                >
                  <option value="">Select region</option>
                  <option value="APAC">APAC (Asia-Pacific)</option>
                  <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
                  <option value="Americas">Americas</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#9ca3af' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Referral Code */}
          <div style={{ marginBottom: 32, padding: '24px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>
              Custom Referral Code
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Your Referral Code
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., KARL2026"
                  maxLength={12}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    textTransform: 'uppercase',
                  }}
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                  Set a custom code to share with partners. Max 12 characters, uppercase only.
                </p>
              </div>
              <button
                onClick={handleSaveReferralCode}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? 'Saving...' : 'Save Referral Code'}
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div style={{ marginBottom: 32, padding: '24px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>
              Two-Factor Authentication
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 4px' }}>
                  {twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                </p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                style={{
                  padding: '8px 16px',
                  background: twoFactorEnabled ? '#f3f4f6' : '#ef4444',
                  color: twoFactorEnabled ? '#1a1a1a' : '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Admin Permissions Management */}
          {userProfile?.role === 'super_admin' && (
            <div style={{ marginBottom: 32, padding: '24px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#166534' }}>
                Admin Permissions
              </h2>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                Configure granular permissions for each admin user
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#fff',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                        {admin.display_name || admin.email}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                        {admin.role} • {admin.admin_permissions ? 'Custom permissions' : 'Full access'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowPermissionsModal(true);
                      }}
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
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Audit Logs */}
          <div style={{ padding: '24px', background: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                Security Audit Logs
              </h2>
              <button
                onClick={fetchSecurityEvents}
                style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Refresh
              </button>
            </div>
            {eventsLoading ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#6b7280', fontSize: 13 }}>Loading security events...</div>
            ) : securityEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: 13 }}>No security events recorded</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {securityEvents.map((event) => (
                  <div key={event.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: event.severity === 'critical' ? '#ef4444' : event.severity === 'high' ? '#f59e0b' : event.severity === 'medium' ? '#3b82f6' : '#10b981',
                        display: 'inline-block'
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{event.event_type}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>
                          {event.ip_address ? `${event.ip_address} · ` : ''}
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 10,
                      background: event.severity === 'critical' ? 'rgba(239,68,68,0.1)' : event.severity === 'high' ? 'rgba(245,158,11,0.1)' : event.severity === 'medium' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                      color: event.severity === 'critical' ? '#ef4444' : event.severity === 'high' ? '#f59e0b' : event.severity === 'medium' ? '#3b82f6' : '#10b981',
                    }}>
                      {event.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div style={{ padding: '24px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#991b1b' }}>
              Danger Zone
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 4px' }}>
                  Request Account Access
                </p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                  Request access to a different admin account
                </p>
              </div>
              <button
                onClick={() => {
                  const subject = 'Admin Account Access Request';
                  const body = `I would like to request access to the admin account.\n\nCurrent email: ${currentUser?.email}\n\nReason: `;
                  window.location.href = `mailto:support@pilotrecognition.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                style={{
                  padding: '8px 16px',
                  background: '#ffffff',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Permissions Configuration Modal */}
      {showPermissionsModal && selectedAdmin && (
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
          onClick={() => setShowPermissionsModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 600,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' }}>
              Configure Permissions
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              {selectedAdmin.display_name || selectedAdmin.email}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Pilots */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Pilot Management</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view', 'edit', 'delete', 'verify'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.pilots?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.pilots || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            pilots: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enterprises */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Enterprise Accounts</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view', 'edit', 'delete'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.enterprises?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.enterprises || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            enterprises: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Employee Objectives</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view', 'edit', 'delete'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.objectives?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.objectives || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            objectives: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Event Management</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view', 'edit', 'delete'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.events?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.events || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            events: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>System Settings</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view', 'edit'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.settings?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.settings || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            settings: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Audit Log */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Audit Log</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['view'].map((perm) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        defaultChecked={(selectedAdmin.admin_permissions as AdminPermissions)?.audit_log?.[perm as keyof PermissionSet] || false}
                        onChange={(e) => {
                          const current = (selectedAdmin.admin_permissions as AdminPermissions)?.audit_log || {};
                          selectedAdmin.admin_permissions = {
                            ...selectedAdmin.admin_permissions,
                            audit_log: { ...current, [perm]: e.target.checked }
                          };
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                <button
                  onClick={() => handleSavePermissions(FULL_PERMISSIONS)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Full Access
                </button>
                <button
                  onClick={() => handleSavePermissions(READ_ONLY_PERMISSIONS)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Read Only
                </button>
                <button
                  onClick={() => handleSavePermissions(selectedAdmin.admin_permissions as AdminPermissions)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Custom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
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
          onClick={() => setShow2FAModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>
              Enable Two-Factor Authentication
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
              Scan the QR code below with your authenticator app to enable 2FA.
            </p>
            <div
              style={{
                width: 200,
                height: 200,
                background: '#f3f4f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 12,
                color: '#6b7280',
              }}
            >
              QR Code Placeholder
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShow2FAModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  color: '#6b7280',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTwoFactorEnabled(true);
                  setShow2FAModal(false);
                  setMessage('2FA enabled successfully');
                  setMessageType('success');
                }}
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
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}