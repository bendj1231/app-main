import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Lock, Linkedin, Instagram, UserPlus, Mail, Eye } from 'lucide-react';

interface ChatContact {
  id: number;
  name: string;
  role: string;
  org: string;
  type: string;
  avatar: string | null;
  online: boolean;
  isAI?: boolean;
  username?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  totalHours?: number;
  needsConnectPermission?: boolean;
  twoWayFriendRequestApproved?: boolean;
}

const CHAT_CONTACTS: ChatContact[] = [
  { id: 0, name: 'Recognition AI', role: 'Aviation Career Strategist', org: 'Pilot Recognition', type: 'ai', avatar: null, online: true, isAI: true },
  { id: 1, name: 'Capt. Reyes', role: 'Flight Instructor', org: 'AirAsia Academy', type: 'pilots', avatar: 'https://i.pravatar.cc/150?u=reyes', online: true, username: '@capt_reyes', linkedinUrl: 'https://linkedin.com/in/captreyes', instagramUrl: 'https://instagram.com/captreyes', totalHours: 4200, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 2, name: 'Capt. Santos', role: 'Line Captain', org: 'Cebu Pacific', type: 'pilots', avatar: 'https://i.pravatar.cc/150?u=santos', online: false, username: '@santos_aviation', linkedinUrl: 'https://linkedin.com/in/captsantos', instagramUrl: 'https://instagram.com/santos_aviation', totalHours: 8900, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 3, name: 'Capt. Dela Cruz', role: 'Check Airman', org: 'Philippine Airlines', type: 'pilots', avatar: 'https://i.pravatar.cc/150?u=delacruz', online: true, username: '@delacruz_flying', linkedinUrl: 'https://linkedin.com/in/delacruz', instagramUrl: 'https://instagram.com/delacruz_flying', totalHours: 12500, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 4, name: 'Emirates Recruitment', role: 'Pilot Recruitment', org: 'Dubai', type: 'airlines', avatar: 'https://i.pravatar.cc/150?u=emirates', online: true, username: '@emirates_pilots', linkedinUrl: 'https://linkedin.com/company/emirates', instagramUrl: 'https://instagram.com/emirates', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 5, name: 'Qatar Airways HR', role: 'HR — Flight Ops', org: 'Doha', type: 'airlines', avatar: 'https://i.pravatar.cc/150?u=qatar', online: false, username: '@qatar_crew', linkedinUrl: 'https://linkedin.com/company/qatar-airways', instagramUrl: 'https://instagram.com/qatarairways', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 6, name: 'AirAsia Academy', role: 'Training Organization', org: 'Philippines', type: 'operators', avatar: 'https://i.pravatar.cc/150?u=airasia', online: true, username: '@airasia_academy', linkedinUrl: 'https://linkedin.com/company/airasia', instagramUrl: 'https://instagram.com/airasia', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 7, name: 'CAE Training', role: 'Type Rating Centre', org: 'Singapore', type: 'training', avatar: 'https://i.pravatar.cc/150?u=cae', online: true, username: '@cae_training', linkedinUrl: 'https://linkedin.com/company/cae', instagramUrl: 'https://instagram.com/caepilot', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 8, name: 'Lufthansa Technik', role: 'Maintenance & Ops', org: 'Germany', type: 'manufacturers', avatar: 'https://i.pravatar.cc/150?u=lufthansa', online: false, username: '@lht_technik', linkedinUrl: 'https://linkedin.com/company/lufthansa-technik', instagramUrl: 'https://instagram.com/lufthansa', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 9, name: 'Boeing Training', role: 'Manufacturer Training', org: 'USA', type: 'manufacturers', avatar: 'https://i.pravatar.cc/150?u=boeing', online: true, username: '@boeing_training', linkedinUrl: 'https://linkedin.com/company/boeing', instagramUrl: 'https://instagram.com/boeing', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
  { id: 10, name: 'AirAsia Academy', role: 'Training Organization', org: 'Philippines', type: 'operators', avatar: 'https://i.pravatar.cc/150?u=airasia', online: true, username: '@airasia_ops', linkedinUrl: 'https://linkedin.com/company/airasia', instagramUrl: 'https://instagram.com/airasia', totalHours: 0, needsConnectPermission: true, twoWayFriendRequestApproved: false },
];

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({ isOpen, onClose }) => {
  const [selectedChatContact, setSelectedChatContact] = useState<number | null>(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<number, { role: 'user' | 'contact'; text: string; time: string }[]>>({});

  const sendMessage = () => {
    if (!chatInput.trim() || selectedChatContact === null) return;
    const contact = CHAT_CONTACTS.find((c) => c.id === selectedChatContact);
    if (!contact?.isAI) return; // Only allow messaging with AI
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => ({
      ...prev,
      [selectedChatContact]: [...(prev[selectedChatContact] || []), { role: 'user', text: chatInput.trim(), time: now }],
    }));
    setChatInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 top-16 z-[100] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 720,
            maxWidth: 'calc(100vw - 2rem)',
            height: 520,
            maxHeight: 'calc(100vh - 6rem)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,250,240,0.92) 100%)',
            border: '1px solid rgba(218,165,32,0.3)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 60px rgba(184,134,11,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Red top bar */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: '#dc2626', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-white" />
              <p className="text-xs font-black tracking-wider text-white">MESSAGES</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
              <X size={14} className="text-white/80" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="w-56 flex-shrink-0 overflow-y-auto" style={{ borderRight: '1px solid rgba(218,165,32,0.15)', background: 'rgba(255,255,255,0.4)' }}>
              {[
                { label: 'AI Assistant', key: 'ai', color: '#dc2626' },
                { label: 'Pilots', key: 'pilots', color: '#38bdf8' },
                { label: 'Airlines', key: 'airlines', color: '#f59e0b' },
                { label: 'Operators', key: 'operators', color: '#a78bfa' },
                { label: 'Manufacturers', key: 'manufacturers', color: '#34d399' },
                { label: 'Type Rating Centres', key: 'training', color: '#f472b6' },
              ].map((cat) => {
                const contacts = CHAT_CONTACTS.filter((c) => c.type === cat.key);
                if (contacts.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <p className="text-[9px] font-black tracking-wider text-amber-700/50 uppercase px-3 py-2">{cat.label}</p>
                    {contacts.map((c) => {
                      const msgs = chatMessages[c.id] || [];
                      const isActive = selectedChatContact === c.id;
                      const isLocked = !c.isAI;
                      return (
                        <motion.button
                          key={c.id}
                          onClick={() => setSelectedChatContact(c.id)}
                          whileHover={isLocked ? {} : { x: 2 }}
                          whileTap={isLocked ? {} : { scale: 0.98 }}
                          className={`w-full flex items-center gap-2 px-3 py-2 transition-all ${isActive && !isLocked ? 'bg-amber-500/10' : isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500/5'}`}
                          style={{ borderLeft: isActive ? `3px solid ${cat.color}` : '3px solid transparent' }}
                        >
                          <div className="relative flex-shrink-0">
                            {c.isAI ? (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: 'rgba(220,38,38,0.1)', border: `1.5px solid ${isActive ? '#dc2626' : 'rgba(220,38,38,0.2)'}` }}>
                                <span className="text-red-600">PR</span>
                              </div>
                            ) : (
                              <>
                                <img src={c.avatar || undefined} alt={c.name} className="w-8 h-8 rounded-full object-cover" style={{ border: `1.5px solid ${isActive ? cat.color : 'rgba(0,0,0,0.08)'}` }} />
                                {isLocked && (
                                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white/60">
                                    <Lock size={10} className="text-slate-500" />
                                  </div>
                                )}
                              </>
                            )}
                            {c.online && !isLocked && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                            )}
                          </div>
                          <div className="text-left min-w-0">
                            <p className={`text-[10px] font-bold truncate ${isActive && !isLocked ? 'text-slate-900' : 'text-slate-500'}`}>{c.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">{c.role}</p>
                          </div>
                          {c.isAI && msgs.length > 0 && (
                            <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white">{msgs.length}</span>
                          )}
                          {isLocked && (
                            <Lock size={12} className="ml-auto text-slate-300 flex-shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col min-w-0" style={{ background: 'rgba(255,255,255,0.3)' }}>
              {selectedChatContact !== null ? (
                (() => {
                  const c = CHAT_CONTACTS.find((x) => x.id === selectedChatContact);
                  if (!c) return null;
                  const isLocked = !c.isAI;
                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(218,165,32,0.12)' }}>
                        {c.isAI ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: 'rgba(220,38,38,0.1)', border: '1.5px solid rgba(220,38,38,0.2)' }}>
                            <span className="text-red-600">PR</span>
                          </div>
                        ) : (
                          <img src={c.avatar || undefined} alt={c.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{ border: '1.5px solid rgba(0,0,0,0.1)' }} />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.name}</p>
                          <p className="text-[9px] text-slate-500">{c.role} · {c.org}</p>
                        </div>
                        {isLocked && (
                          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100">
                            <Lock size={10} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500">Locked</span>
                          </div>
                        )}
                      </div>

                      {c.isAI ? (
                        <>
                          {/* AI Chat Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {(() => {
                              const msgs = chatMessages[selectedChatContact] || [];
                              const showDefault = msgs.length === 0;
                              const defaultForAI = "Welcome to Pilot Recognition! I'm here to help you set up your profile and guide you toward your desired career pathways. Ask me about airline programs, hour requirements, type ratings, or how to optimize your profile for recruitment.";
                              return (
                                <>
                                  {showDefault && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-start">
                                      <div className="max-w-[80%] rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(218,165,32,0.2)' }}>
                                        <p className="text-[12px] text-slate-700 leading-relaxed">{defaultForAI}</p>
                                        <p className="text-[9px] text-slate-400 mt-1.5">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                  <AnimatePresence>
                                    {msgs.map((msg, idx) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                      >
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-red-600 text-white' : 'text-slate-800'}`} style={msg.role === 'user' ? {} : { background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(218,165,32,0.2)' }}>
                                          <p className="text-[12px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                          <p className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/50' : 'text-slate-400'}`}>{msg.time}</p>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </>
                              );
                            })()}
                          </div>

                          {/* AI Chat Input */}
                          <div className="p-3" style={{ borderTop: '1px solid rgba(218,165,32,0.15)' }}>
                            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(218,165,32,0.2)' }}>
                              <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && chatInput.trim()) sendMessage(); }}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                              />
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={sendMessage}
                                disabled={!chatInput.trim()}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                                style={{ background: '#dc2626' }}
                              >
                                <Send size={12} className="text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Contact Profile View for Locked Contacts */
                        <div className="flex-1 overflow-y-auto p-5">
                          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">
                            {/* Profile Card */}
                            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(218,165,32,0.15)' }}>
                              <div className="flex items-center gap-3">
                                <img src={c.avatar || undefined} alt={c.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" style={{ border: '1.5px solid rgba(0,0,0,0.08)' }} />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{c.name}</p>
                                  <p className="text-[10px] text-slate-500">{c.role} · {c.org}</p>
                                  {c.username && <p className="text-[10px] text-slate-400 mt-0.5">{c.username}</p>}
                                </div>
                              </div>

                              {/* Social Links */}
                              {(c.linkedinUrl || c.instagramUrl) && (
                                <div className="flex items-center gap-2">
                                  {c.linkedinUrl && (
                                    <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110" style={{ background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.2)', color: '#0a66c2' }}>
                                      <Linkedin size={12} />
                                      LinkedIn
                                    </a>
                                  )}
                                  {c.instagramUrl && (
                                    <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110" style={{ background: 'rgba(225,48,108,0.08)', border: '1px solid rgba(225,48,108,0.15)', color: '#e1306c' }}>
                                      <Instagram size={12} />
                                      Instagram
                                    </a>
                                  )}
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-1">
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-black text-white transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
                                  <UserPlus size={12} />
                                  Request to Connect
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-black transition-all" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(218,165,32,0.25)', color: '#b45309' }}>
                                  <Mail size={12} />
                                  Formal Message
                                </button>
                              </div>
                            </div>

                            {/* Locked Details Card */}
                            <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.06)' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Eye size={14} className="text-slate-400" />
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Full Details</p>
                                <Lock size={12} className="text-slate-300 ml-auto" />
                              </div>

                              <div className="space-y-2.5">
                                {typeof c.totalHours === 'number' && c.totalHours > 0 && (
                                  <div className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                                    <span className="text-[11px] text-slate-500">Total Flight Hours</span>
                                    <span className="text-[11px] font-black text-slate-700">{c.totalHours.toLocaleString()} hrs</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                                  <span className="text-[11px] text-slate-500">Connect Permission</span>
                                  <span className="text-[11px] font-black text-amber-600">Required</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                                  <span className="text-[11px] text-slate-500">Friend Request</span>
                                  <span className="text-[11px] font-black text-slate-400">Two-way approval needed</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                                  <span className="text-[11px] text-slate-500">Message Access</span>
                                  <span className="text-[11px] font-black text-slate-400">Locked</span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                                <Lock size={10} />
                                <span>Connect to unlock full profile and messaging</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)' }}>
                    <MessageSquare size={24} className="text-red-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Select a contact to start messaging</p>
                  <p className="text-[10px] text-slate-400/60 mt-1">Recognition AI is available for career guidance</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
