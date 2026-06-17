import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';

const SIDEBAR_WIDTH = 260;


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
  sender_name?: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
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

  const [dailyQuote, setDailyQuote] = useState('"Excellence is not a destination, it is a continuous journey that never ends." — Karl Vogt');
  const [dailyObjectives, setDailyObjectives] = useState([
    { id: '1', text: 'Reach out to 2 new airline partnerships', completed: false },
    { id: '2', text: 'Review 3 pilot verification applications', completed: true },
    { id: '3', text: 'Update enterprise pricing deck', completed: false },
    { id: '4', text: 'Follow up with Veremark on CAAP PEL timeline', completed: false },
  ]);
  const [newQuote, setNewQuote] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [showQuoteInput, setShowQuoteInput] = useState(false);
  const [notifications] = useState([
    { id: '1', text: 'New enterprise inquiry from Alpha Aviation Group', time: '10m ago', type: 'lead' },
    { id: '2', text: '5 new Recognition+ subscriptions today', time: '1h ago', type: 'revenue' },
    { id: '3', text: 'Karl posted: "Push for September launch — no excuses"', time: '2h ago', type: 'memo' },
  ]);

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
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        recipient_id: selectedContact.id,
        content: newMessage.trim(),
      });
      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Fetch messages for selected contact
  const fetchMessages = async (contactId: string) => {
    if (!currentUserId) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const conversation = (data || []).filter(
        (m) =>
          (m.sender_id === currentUserId && m.recipient_id === contactId) ||
          (m.sender_id === contactId && m.recipient_id === currentUserId)
      );
      setMessages(conversation);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Realtime subscription
  useEffect(() => {
    if (!currentUserId) return;
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: any) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === currentUserId && newMsg.recipient_id === selectedContact?.id) ||
            (newMsg.sender_id === selectedContact?.id && newMsg.recipient_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, newMsg]);
            if (newMsg.sender_id !== currentUserId && selectedContact?.id === newMsg.sender_id) {
              // Mark as read immediately
              supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', newMsg.id).then();
            }
          }
          // Refresh unread counts
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, selectedContact?.id]);

  // Fetch messages when contact changes
  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      markConversationAsRead(selectedContact.id);
    }
  }, [selectedContact?.id]);

  const markConversationAsRead = async (contactId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', contactId)
        .eq('recipient_id', currentUserId)
        .is('read_at', null);
      fetchUnreadCounts();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const fetchUnreadCounts = async () => {
    if (!currentUserId) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('recipient_id', currentUserId)
        .is('read_at', null);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((m) => {
        counts[m.sender_id] = (counts[m.sender_id] || 0) + 1;
      });
      setContacts((prev) =>
        prev.map((c) => ({ ...c, unread: counts[c.id] || 0 }))
      );
    } catch (err) {
      console.error('Error fetching unread counts:', err);
    }
  };

  // Load unread counts on mount
  useEffect(() => {
    if (currentUserId) fetchUnreadCounts();
  }, [currentUserId]);

  const chatMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUserId && m.recipient_id === selectedContact?.id) ||
      (m.sender_id === selectedContact?.id && m.recipient_id === currentUserId)
  );

  const toggleObjective = (id: string) => {
    setDailyObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed: !o.completed } : o))
    );
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setDailyObjectives((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newObjective.trim(), completed: false },
    ]);
    setNewObjective('');
  };

  const updateDailyQuote = () => {
    if (!newQuote.trim()) return;
    setDailyQuote(newQuote.trim());
    setNewQuote('');
    setShowQuoteInput(false);
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      
      <AdminSidebar />

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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fa', overflowY: 'auto' }}>
            {/* Daily Briefing Header */}
            <div style={{ padding: '28px 32px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>📋 Daily Briefing</h2>
                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>

              {/* Quote of the Day */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20, position: 'relative' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Quote of the Day</div>
                <div style={{ fontSize: 15, color: '#1a1a1a', fontStyle: 'italic', lineHeight: 1.5 }}>{dailyQuote}</div>
                {userProfile?.role === 'super_admin' && (
                  <div style={{ marginTop: 12 }}>
                    {showQuoteInput ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          value={newQuote}
                          onChange={(e) => setNewQuote(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') updateDailyQuote(); }}
                          placeholder="Enter new quote..."
                          autoFocus
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }}
                        />
                        <button onClick={updateDailyQuote} style={{ padding: '8px 14px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Set</button>
                        <button onClick={() => { setShowQuoteInput(false); setNewQuote(''); }} style={{ padding: '8px 14px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowQuoteInput(true)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ef4444', borderRadius: 6, color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Quote</button>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications / Business Updates */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {notifications.map((n) => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: n.type === 'memo' ? '#fef2f2' : '#f9fafb', borderRadius: 8, borderLeft: n.type === 'memo' ? '3px solid #ef4444' : '3px solid #3b82f6' }}>
                      <span style={{ fontSize: 16 }}>{n.type === 'lead' ? '�' : n.type === 'revenue' ? '💰' : '📢'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Objectives */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Objectives</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dailyObjectives.map((o) => (
                    <div key={o.id} onClick={() => toggleObjective(o.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: o.completed ? '#f0fdf4' : '#f9fafb', borderRadius: 8, cursor: 'pointer', border: `1px solid ${o.completed ? '#86efac' : '#e5e7eb'}`, transition: 'all 0.15s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${o.completed ? '#10b981' : '#d1d5db'}`, background: o.completed ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>
                        {o.completed ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: 13, color: o.completed ? '#6b7280' : '#1a1a1a', textDecoration: o.completed ? 'line-through' : 'none', flex: 1 }}>{o.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addObjective(); }}
                    placeholder="Add a new objective..."
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }}
                  />
                  <button onClick={addObjective} style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}