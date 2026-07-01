import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, MessageSquare, Users, Search, UserPlus, Send, X,
  Plane, Building2, Wrench, Briefcase, Eye, ChevronRight,
  Star, Award
} from 'lucide-react';
import { RecognitionAIChat } from '../RecognitionAIChat';

interface Props {
  profile?: Record<string, unknown> | null;
  onNavigate?: (path: string) => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'pathway', title: 'New pathway match: Emirates Cadet Program', desc: 'Your profile now matches the Emirates cadet pathway requirements.', time: '2h ago', read: false, logo: 'https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo-700x394.png', color: '#38bdf8', label: 'Airline' },
  { id: 2, type: 'profile', title: '3 pilots viewed your profile', desc: 'Capt. Reyes, Capt. Dela Cruz, and 1 other viewed your profile today.', time: '4h ago', read: false, logo: 'https://i.pravatar.cc/150?u=reyes', color: '#a78bfa', label: 'Profile' },
  { id: 3, type: 'verification', title: 'Medical certificate expiring soon', desc: 'Your Class 1 Medical expires in 14 days. Renew now to stay current.', time: '1d ago', read: true, logo: 'https://i.pravatar.cc/150?u=authority', color: '#f472b6', label: 'CAA' },
  { id: 4, type: 'friend', title: 'Capt. Santos sent a friend request', desc: 'You flew together on Cessna 152 · RP-C9941 on 10 Jun 2026.', time: '2d ago', read: true, logo: 'https://i.pravatar.cc/150?u=santos', color: '#34d399', label: 'Pilot' },
  { id: 5, type: 'pathway', title: 'Qatar Airways hiring push', desc: 'Qatar Airways is actively recruiting low-hour FO candidates with your profile type.', time: '3d ago', read: true, logo: 'https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo-700x394.png', color: '#f59e0b', label: 'Airline' },
];

const MOCK_MESSAGES = [
  { id: 1, from: 'Capt. Reyes', avatar: 'CR', role: 'Flight Instructor', last: 'Hey, are you going for the A320 type rating next month?', time: '10m ago', unread: true, profileImage: 'https://i.pravatar.cc/150?u=reyes' },
  { id: 2, from: 'Capt. Dela Cruz', avatar: 'DC', role: 'Check Airman', last: 'Good progress on your engine-out procedures. Let me know when you want to schedule the next session.', time: '2h ago', unread: false, profileImage: 'https://i.pravatar.cc/150?u=delacruz' },
  { id: 3, from: 'Pathway Support', avatar: 'PS', role: 'Recognition Team', last: 'Your Emirates application documents have been forwarded to the recruitment team.', time: '1d ago', unread: false, profileImage: 'https://i.pravatar.cc/150?u=pathway' },
];

const MOCK_CONNECTIONS = [
  { id: 1, name: 'Capt. Reyes', role: 'Flight Instructor', airline: 'AirAsia Academy', mutual: 12, type: 'viewed', avatar: 'CR' },
  { id: 2, name: 'Capt. Santos', role: 'Line Captain', airline: 'Cebu Pacific', mutual: 8, type: 'flew-with', avatar: 'CS', aircraft: 'Cessna 152 · RP-C9941' },
  { id: 3, name: 'Capt. Dela Cruz', role: 'Check Airman', airline: 'PAL Express', mutual: 15, type: 'flew-with', avatar: 'DC', aircraft: 'Piper PA-44 · RP-S8820' },
  { id: 4, name: 'Capt. Lim', role: 'CFI', airline: 'Flight Deck Academy', mutual: 3, type: 'viewed', avatar: 'CL' },
];

const MOCK_PATHWAY_POSTERS = [
  { id: 1, name: 'Capt. Tan', role: 'A320 Type Rating Instructor', pathway: 'Airbus A320 Initial Type Rating', students: 24, rating: 4.9, avatar: 'CT' },
  { id: 2, name: 'Capt. Reyes', role: 'ATPL Ground School Lead', pathway: 'ATPL Theory Crash Course', students: 156, rating: 4.8, avatar: 'CR' },
];

const DISCOVER_USERS = [
  { name: 'Capt. Reyes', handle: '@captreyes', role: 'Flight Instructor', org: 'AirAsia Academy', type: 'pilots', avatar: 'CR', profileImage: 'https://i.pravatar.cc/150?u=reyes' },
  { name: 'Capt. Santos', handle: '@santos_fly', role: 'Line Captain', org: 'Cebu Pacific', type: 'pilots', avatar: 'CS', profileImage: 'https://i.pravatar.cc/150?u=santos' },
  { name: 'Capt. Dela Cruz', handle: '@delacruz_atp', role: 'Check Airman', org: 'PAL Express', type: 'pilots', avatar: 'DC', profileImage: 'https://i.pravatar.cc/150?u=delacruz' },
  { name: 'AirAsia Academy', handle: '@airasiaacademy', role: 'Training Organization', org: 'Philippines', type: 'operators', avatar: 'AA', profileImage: 'https://i.pravatar.cc/150?u=airasia' },
  { name: 'Flight Deck Academy', handle: '@flightdeckph', role: 'Flight School', org: 'Manila', type: 'operators', avatar: 'FD', profileImage: 'https://i.pravatar.cc/150?u=flightdeck' },
  { name: 'Tecnam Aircraft', handle: '@tecnamofficial', role: 'Manufacturer', org: 'Italy', type: 'manufacturers', avatar: 'TN', profileImage: 'https://i.pravatar.cc/150?u=tecnam' },
  { name: 'Emirates Recruitment', handle: '@emirates_crew', role: 'Pilot Recruitment', org: 'Dubai', type: 'airlines', avatar: 'EK', profileImage: 'https://i.pravatar.cc/150?u=emirates' },
  { name: 'Qatar Airways HR', handle: '@qatar_careers', role: 'HR — Flight Ops', org: 'Doha', type: 'airlines', avatar: 'QR', profileImage: 'https://i.pravatar.cc/150?u=qatar' },
];

const PATHWAY_CARDS = [
  {
    id: 1, name: 'AirAsia Academy', type: 'operators', logo: 'https://i.pravatar.cc/150?u=airasia', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    pathways: 12, rating: 4.8, established: '2008', hq: 'Philippines',
    desc: 'Fast-track CPL cadet programs with guaranteed airline placement partnerships across Southeast Asia.',
    contact: 'Capt. Maria Santos — Head of Training', badge: 'A+', badgeColor: '#16a34a',
    cta: 'Apply Now →', ctaColor: '#dc2626',
    barColor: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 2, name: 'Flight Deck Academy', type: 'operators', logo: 'https://i.pravatar.cc/150?u=flightdeck', image: 'https://images.unsplash.com/photo-1464037866556-6812c0ca4158?w=400&q=80',
    pathways: 8, rating: 4.6, established: '2012', hq: 'Manila',
    desc: 'Multi-engine instrument rating specialists with direct pipeline to PAL Express and Cebu Pacific.',
    contact: 'Capt. Lim — CFI', badge: 'A', badgeColor: '#2563eb',
    cta: 'Inquire →', ctaColor: '#2563eb',
    barColor: 'linear-gradient(90deg, #2563eb, #06b6d4)',
  },
  {
    id: 3, name: 'Tecnam Aircraft', type: 'manufacturers', logo: 'https://i.pravatar.cc/150?u=tecnam', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80',
    pathways: 5, rating: 4.9, established: '1948', hq: 'Italy',
    desc: 'Light sport aircraft manufacturer. Partnership programs for flight schools and ATOs worldwide.',
    contact: 'Giovanni Rossi — Partnership Director', badge: 'A+', badgeColor: '#16a34a',
    cta: 'Partner →', ctaColor: '#dc2626',
    barColor: 'linear-gradient(90deg, #f59e0b, #ef4444)',
  },
  {
    id: 4, name: 'Emirates Recruitment', type: 'airlines', logo: 'https://i.pravatar.cc/150?u=emirates', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    pathways: 18, rating: 4.7, established: '1985', hq: 'Dubai',
    desc: 'Active hiring for low-hour FO candidates with Recognition+ verification. Fast-track screening.',
    contact: 'Ahmed Hassan — Pilot Recruitment Lead', badge: 'A', badgeColor: '#2563eb',
    cta: 'Apply Now →', ctaColor: '#dc2626',
    barColor: 'linear-gradient(90deg, #dc2626, #f59e0b)',
  },
  {
    id: 5, name: 'Qatar Airways HR', type: 'airlines', logo: 'https://i.pravatar.cc/150?u=qatar', image: 'https://images.unsplash.com/photo-1464037866556-6812c0ca4158?w=400&q=80',
    pathways: 14, rating: 4.8, established: '1993', hq: 'Doha',
    desc: 'Global network expansion. Hiring experienced captains and cadet pilots with multi-crew experience.',
    contact: 'Fatima Al-Rashid — HR Flight Ops', badge: 'A+', badgeColor: '#16a34a',
    cta: 'Apply Now →', ctaColor: '#dc2626',
    barColor: 'linear-gradient(90deg, #7c3aed, #ec4899)',
  },
];

export const InboxTab: React.FC<Props> = ({ profile, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'notifications' | 'messages' | 'connections' | 'discover'>('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'pilots' | 'operators' | 'manufacturers' | 'airlines'>('all');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const sections = [
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'messages' as const, label: 'Messages', icon: MessageSquare, count: MOCK_MESSAGES.filter(m => m.unread).length },
    { id: 'connections' as const, label: 'Connections', icon: Users, count: MOCK_CONNECTIONS.length },
    { id: 'discover' as const, label: 'Discover', icon: Search, count: 0 },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedMessage) return;
    setMessageInput('');
  };

  const filteredUsers = DISCOVER_USERS
    .filter(u => searchFilter === 'all' || u.type === searchFilter)
    .filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.handle.toLowerCase().includes(searchQuery.toLowerCase()));

  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  };

  const cardMaterialize = (i: number) => ({
    initial: { opacity: 0, y: 36, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: '-30px' },
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      {/* Header */}
      <motion.div className="mb-8" {...fadeUp}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-2">Pilot Network</p>
        <h1 className="text-3xl font-serif font-normal text-white mb-2">Inbox</h1>
        <p className="text-sm text-white/50">Notifications, messages, and pilot connections.</p>
      </motion.div>

      {/* Section tabs */}
      <motion.div className="flex gap-1 mb-6 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveSection(s.id); setSelectedMessage(null); }}
            className={`relative flex-1 px-3 py-2.5 rounded-lg text-[11px] font-black tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              activeSection === s.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
            }`}
          >
            <s.icon size={13} />
            {s.label}
            {s.count > 0 && (
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                activeSection === s.id ? 'bg-white text-red-600' : 'bg-red-600 text-white'
              }`}>
                {s.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map((n, i) => {
            const bgOpacity = Math.max(0.04, 1 - i * 0.22);
            const isLight = bgOpacity > 0.5;
            const shadowOpacity = Math.max(0, 0.22 - i * 0.055);
            return (
              <motion.div
                key={n.id}
                {...cardMaterialize(i)}
                className="group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,${bgOpacity}) 0%, rgba(255,255,255,${Math.max(0, bgOpacity - 0.06)}) 55%, rgba(255,255,255,${Math.max(0, bgOpacity - 0.12)}) 100%)`,
                  border: `1px solid rgba(255,255,255,${Math.min(0.35, bgOpacity * 0.22 + 0.04)})`,
                  borderLeft: `3px solid #dc2626`,
                  boxShadow: `0 ${4 + i * 2}px ${20 + i * 4}px rgba(0,0,0,${shadowOpacity})`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                {/* Top-card premium shine sweep */}
                {i === 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.14) 45%, transparent 60%)',
                    }}
                  />
                )}

                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden"
                    style={{
                      background: isLight ? `#dc262612` : `#dc262618`,
                      border: `2px solid ${isLight ? '#dc262645' : '#dc262628'}`,
                      boxShadow: `0 2px 10px ${isLight ? '#dc262622' : '#dc262615'}`,
                    }}
                  >
                    <img src={n.logo} alt={n.label} className="w-full h-full object-cover" />
                  </div>
                  {!n.read && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0 relative">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{n.title}</p>
                    <span
                      className="text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: `${isLight ? '#dc262615' : '#dc262612'}`,
                        color: isLight ? '#dc2626' : '#dc2626DD',
                        border: `1px solid ${isLight ? '#dc262628' : '#dc262618'}`,
                      }}
                    >
                      {n.label}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/50'}`}>
                    {n.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{n.time}</p>
                    {!n.read && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`flex-shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-0.5 ${isLight ? 'text-slate-300' : 'text-white/20'}`}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MESSAGES */}
      {activeSection === 'messages' && (
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" {...fadeUp}>
          <div className="md:col-span-1 space-y-2">
            {MOCK_MESSAGES.map((m, i) => (
              <motion.button
                key={m.id}
                {...cardMaterialize(i)}
                onClick={() => setSelectedMessage(m.id)}
                className={`w-full text-left rounded-xl p-3 border transition-all ${
                  selectedMessage === m.id
                    ? 'bg-white/[0.06] border-white/[0.12]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.profileImage}
                    alt={m.from}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-red-600 ring-offset-2 ring-offset-slate-800"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.from)}&background=dc2626&color=fff`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{m.from}</p>
                      {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-[10px] text-white/40 truncate">{m.last}</p>
                  </div>
                  <span className="text-[9px] text-white/30 flex-shrink-0">{m.time}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div className="md:col-span-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col min-h-[320px]" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            {/* Recognition AI header */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
              <p className="text-sm font-black tracking-wide">
                <span className="text-white">Recognition</span>
                <span className="text-red-500"> AI</span>
              </p>
            </div>

            {selectedMessage ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white">
                      {MOCK_MESSAGES.find(m => m.id === selectedMessage)?.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{MOCK_MESSAGES.find(m => m.id === selectedMessage)?.from}</p>
                      <p className="text-[10px] text-white/40">{MOCK_MESSAGES.find(m => m.id === selectedMessage)?.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedMessage(null)} className="p-1 rounded-lg hover:bg-white/10">
                    <X size={14} className="text-white/40" />
                  </button>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-white/[0.06] border border-white/[0.10]">
                      <p className="text-[13px] text-white/80 leading-relaxed">{MOCK_MESSAGES.find(m => m.id === selectedMessage)?.last}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600 hover:bg-red-500 disabled:opacity-30 transition-all"
                  >
                    <Send size={13} className="text-white" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <RecognitionAIChat profile={profile} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* CONNECTIONS */}
      {activeSection === 'connections' && (
        <motion.div className="space-y-8" {...fadeUp}>
          {/* Profile viewers */}
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <Eye size={14} className="text-white/40" />
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Who Viewed Your Profile</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MOCK_CONNECTIONS.filter(c => c.type === 'viewed').map((c, i) => (
                <motion.div key={c.id} {...cardMaterialize(i)} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-white/40">{c.role} · {c.airline}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{c.mutual} mutual connections</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all flex-shrink-0">
                    Connect
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fellow pilots you flew with */}
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <Plane size={14} className="text-white/40" />
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Fellow Pilots You Flew With</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MOCK_CONNECTIONS.filter(c => c.type === 'flew-with').map((c, i) => (
                <motion.div key={c.id} {...cardMaterialize(i)} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-white/40">{c.role}</p>
                    <p className="text-[9px] text-sky-400 mt-0.5">{c.aircraft}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all flex-shrink-0">
                    Add Friend
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pathway posters */}
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <Award size={14} className="text-white/40" />
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Pathway Posters</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_PATHWAY_POSTERS.map((p, i) => (
                <motion.div key={p.id} {...cardMaterialize(i)} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xs font-black text-white">
                      {p.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-white/40">{p.role}</p>
                    </div>
                  </div>
                  <div className="rounded-lg p-3 bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-xs font-bold text-white mb-1">{p.pathway}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                      <span className="flex items-center gap-1"><Users size={10} /> {p.students} students</span>
                      <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" /> {p.rating}</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 rounded-lg text-[10px] font-black bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 transition-all">
                    View Pathway →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* DISCOVER */}
      {activeSection === 'discover' && (
        <motion.div className="space-y-6" {...fadeUp}>
          <motion.div className="flex gap-2 flex-wrap" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
            {[
              { id: 'all' as const, label: 'All', icon: Search },
              { id: 'pilots' as const, label: 'Pilots', icon: Plane },
              { id: 'operators' as const, label: 'Operators', icon: Building2 },
              { id: 'manufacturers' as const, label: 'Manufacturers', icon: Wrench },
              { id: 'airlines' as const, label: 'Airline Depts', icon: Briefcase },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSearchFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black tracking-wide transition-all border ${
                  searchFilter === f.id
                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
                    : 'bg-white/[0.03] text-white/40 border-white/[0.08] hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                <f.icon size={12} />
                {f.label}
              </button>
            ))}
          </motion.div>

          <motion.div className="relative" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.14 }}>
            {/* White search bar */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder={`Search ${searchFilter === 'all' ? 'pilots, operators, manufacturers, airline departments' : searchFilter} by username or name...`}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button className="px-4 py-2 rounded-lg text-sm font-black tracking-wide bg-red-600 hover:bg-red-500 text-white transition-all">
                Search
              </button>
            </div>

            {/* Rich dropdown */}
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl shadow-black/20 z-50 overflow-hidden max-h-[360px] overflow-y-auto"
              >
                {filteredUsers.length > 0 ? (
                  <div className="py-2">
                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">Suggested</p>
                    {filteredUsers.slice(0, 5).map((u) => (
                      <div
                        key={u.handle}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <img
                          src={u.profileImage}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=dc2626&color=fff`; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.handle}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{u.role} · {u.org}</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-red-600 hover:bg-red-500 text-white transition-all flex-shrink-0">
                          Connect
                        </button>
                      </div>
                    ))}
                    {filteredUsers.length > 5 && (
                      <p className="px-4 py-2 text-[11px] text-slate-400 text-center">+{filteredUsers.length - 5} more results</p>
                    )}
                  </div>
                ) : searchQuery ? (
                  <div className="px-4 py-6 text-center">
                    <Search size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No results found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <Search size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Start typing to discover pilots</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Pathway Carousel — shows when searching operators/manufacturers/airlines */}
          {(searchQuery || searchFilter !== 'all') && filteredUsers.some(u => u.type !== 'pilots') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Pathway Partners</p>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {PATHWAY_CARDS
                  .filter(p => searchFilter === 'all' || p.type === searchFilter)
                  .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                  <motion.div
                    key={p.id}
                    {...cardMaterialize(p.id)}
                    className="flex-shrink-0 w-[420px] snap-start rounded-2xl overflow-hidden flex"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {/* Left image */}
                    <div className="w-[45%] relative flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.03))' }} />
                    </div>
                    {/* Right content */}
                    <div className="flex-1 p-4 flex flex-col relative">
                      {/* Badge */}
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black" style={{ background: `${p.badgeColor}20`, border: `1px solid ${p.badgeColor}40`, color: p.badgeColor }}>
                        {p.badge}
                      </div>
                      {/* Title row */}
                      <div className="flex items-center gap-2 mb-2 pr-8">
                        <img src={p.logo} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <p className="text-[11px] font-black text-white truncate">{p.name}</p>
                      </div>
                      {/* Stats row */}
                      <div className="flex gap-4 mb-2">
                        <div>
                          <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Pathways</p>
                          <p className="text-sm font-black text-white">{p.pathways}</p>
                        </div>
                        <div>
                          <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Rating</p>
                          <p className="text-sm font-black text-white">{p.rating}</p>
                        </div>
                        <div>
                          <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Est.</p>
                          <p className="text-sm font-black text-white">{p.established}</p>
                        </div>
                      </div>
                      {/* Contact */}
                      <p className="text-[9px] text-white/40 mb-1.5">{p.contact}</p>
                      {/* Description */}
                      <p className="text-[10px] text-white/50 leading-relaxed mb-3 flex-1">{p.desc}</p>
                      {/* Bottom bar + CTA */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-[3px] rounded-full overflow-hidden mr-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(p.rating / 5 * 100, 100)}%`, background: p.barColor }} />
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wide text-white transition-all hover:brightness-110 flex-shrink-0" style={{ background: p.ctaColor }}>
                          {p.cta}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact grid */}
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUsers.map((u, i) => (
                <motion.div key={i} {...cardMaterialize(i)} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <img
                    src={u.profileImage}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-red-600/40"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=dc2626&color=fff`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{u.name}</p>
                    <p className="text-[10px] text-white/40">{u.handle}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{u.role} · {u.org}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all flex-shrink-0">
                    Connect
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div className="flex items-center justify-center py-16 border border-dashed border-white/10 rounded-2xl" {...fadeUp}>
              <div className="text-center">
                <Search size={32} className="text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">No results found</p>
                <p className="text-xs text-white/20 mt-1">Try a different search term or filter</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
