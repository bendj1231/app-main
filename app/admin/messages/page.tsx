import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';

const SIDEBAR_WIDTH = 260;

const sidebarNav = [
  { label: 'Dashboard', path: '/admin', icon: '◆' },
  { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
  { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
  { label: 'Messages', path: '/admin/messages', icon: '◈' },
  { label: 'Support Inbox', path: '/admin/support', icon: '◉' },
  { label: 'Blogs & Articles', path: '/admin/blogs', icon: '◉' },
  { label: 'Future Prospects', path: '/admin/prospects', icon: '◉' },
  { label: 'Meetings', path: '/admin/meetings', icon: '▶', badge: 3 },
  { label: 'Planning Board', path: '/admin/planning', icon: '◐' },
  { label: 'AI Bot', path: '/admin/bot', icon: '◉' },
  { label: 'Verification Queue', path: '/admin/verification', icon: '◈' },
  { label: 'Pilot Management', path: '/admin/pilots', icon: '◉' },
  { label: 'Enterprise Accounts', path: '/admin/enterprises', icon: '◆' },
  { label: 'Event Management', path: '/admin/events', icon: '◈' },
  { label: 'System Settings', path: '/admin/settings', icon: '◉' },
];

interface Contact {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  lastMessage?: string;
  unread?: number;
}

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

const defaultAdminContacts: Contact[] = [
  { id: 'admin-1', name: 'Benjamin Bowler', email: 'benjamin@pilotrecognition.com', role: 'admin' },
  { id: 'admin-2', name: 'Karl Vogt', email: 'karl@pilotrecognition.com', role: 'admin' },
  { id: 'admin-3', name: 'Keiv Chen', email: 'keiv@pilotrecognition.com', role: 'admin' },
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [contacts, setContacts] = useState<Contact[]>(defaultAdminContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'admins' | 'members'>('admins');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = currentUser?.id || '';

  useEffect(() => {
    if (!isAdmin) return;
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, email')
          .not('role', 'in', '("super_admin","admin")')
          .limit(50);
        if (error) throw error;
        const memberContacts: Contact[] = (data || []).map((p) => ({
          id: p.id,
          name: p.display_name || p.email?.split('@')[0] || 'Member',
          email: p.email || '',
          role: 'member' as const,
        }));
        setContacts((prev) => [...defaultAdminContacts, ...memberContacts]);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };
    fetchMembers();
  }, [isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'admins' ? c.role === 'admin' : c.role === 'member';
    return matchesSearch && matchesTab;
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !currentUser) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender_id: currentUserId,
      sender_name: userProfile?.display_name || userProfile?.email || 'Admin',
      recipient_id: selectedContact.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const chatMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUserId && m.recipient_id === selectedContact?.id) ||
      (m.sender_id === selectedContact?.id && m.recipient_id === currentUserId)
  );

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: SIDEBAR_WIDTH, background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#ef4444', fontSize: 22 }}>◆</span>
            <span>Admin<span style={{ color: '#ef4444' }}>OS</span></span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.05em' }}>
            PILOTRECOGNITION MANAGEMENT
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sidebarNav.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent', border: 'none', color: isActive ? '#ef4444' : '#6b7280', fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', position: 'relative' }}>
                {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#ef4444', borderRadius: '0 4px 4px 0' }} />}
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 16px 20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {((userProfile?.display_name || userProfile?.email || currentUser?.email || '?') as string).charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile?.display_name || userProfile?.email || currentUser?.email}</div>
              <div style={{ fontSize: 10, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>● {userProfile?.role || 'admin'}</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px 0', background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>←</span> Back to Home
          </button>
        </div>
      </aside>

      {/* Contact List */}
      <div style={{ width: 300, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: SIDEBAR_WIDTH, bottom: 0, zIndex: 40 }}>
        <div style={{ padding: '20px 16px 12px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>Messages</h2>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search contacts..." style={{ width: '100%', padding: '8px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} />
        </div>

        <div style={{ display: 'flex', padding: '0 16px', gap: 8, borderBottom: '1px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('admins')} style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: activeTab === 'admins' ? '2px solid #ef4444' : '2px solid transparent', color: activeTab === 'admins' ? '#ef4444' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Admins</button>
          <button onClick={() => setActiveTab('members')} style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: activeTab === 'members' ? '2px solid #ef4444' : '2px solid transparent', color: activeTab === 'members' ? '#ef4444' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Members</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filteredContacts.map((contact) => (
            <button key={contact.id} onClick={() => setSelectedContact(contact)} style={{ width: '100%', padding: '10px 16px', background: selectedContact?.id === contact.id ? 'rgba(239,68,68,0.05)' : 'transparent', border: 'none', borderLeft: selectedContact?.id === contact.id ? '3px solid #ef4444' : '3px solid transparent', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: contact.role === 'admin' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: contact.role === 'admin' ? '#fff' : '#6b7280', flexShrink: 0 }}>
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{contact.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{contact.role === 'admin' ? 'Admin' : 'Pilot Member'}</div>
              </div>
              {contact.unread ? <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>{contact.unread}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <main style={{ marginLeft: SIDEBAR_WIDTH + 300, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {selectedContact ? (
          <>
            <div style={{ height: 60, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: selectedContact.role === 'admin' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: selectedContact.role === 'admin' ? '#fff' : '#6b7280' }}>
                {selectedContact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{selectedContact.name}</div>
                <div style={{ fontSize: 11, color: '#10b981' }}>{selectedContact.role === 'admin' ? 'Online' : 'Pilot Member'}</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#f8f9fa' }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                  <div style={{ fontSize: 14 }}>Start a conversation with {selectedContact.name}</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>{selectedContact.role === 'member' ? 'Reach out for pathway matches or internship invites' : 'Internal team messaging'}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {chatMessages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: 12, background: isMe ? '#ef4444' : '#fff', color: isMe ? '#fff' : '#1a1a1a', fontSize: 13, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <div>{msg.content}</div>
                          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} placeholder={`Message ${selectedContact.name}...`} style={{ flex: 1, padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }} />
              <button onClick={handleSendMessage} disabled={!newMessage.trim()} style={{ padding: '10px 20px', background: newMessage.trim() ? '#ef4444' : '#e5e7eb', border: 'none', borderRadius: 8, color: newMessage.trim() ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 600, cursor: newMessage.trim() ? 'pointer' : 'not-allowed' }}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>Select a contact to start messaging</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Contact admin team or pilot members</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
