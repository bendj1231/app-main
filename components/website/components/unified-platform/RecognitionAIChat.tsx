import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  profile?: Record<string, unknown> | null;
}

/** 3-bar red epaulet icon for search bar */
const EpauletIcon3: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => {
  const barHeight = size * 0.12;
  const gap = size * 0.08;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height={barHeight} rx="1" fill="currentColor" />
      <rect x="4" y={4 + barHeight + gap} width="16" height={barHeight} rx="1" fill="currentColor" />
      <rect x="4" y={4 + (barHeight + gap) * 2} width="16" height={barHeight} rx="1" fill="currentColor" />
    </svg>
  );
};

const PLACEHOLDERS = [
  'What is the best pathway for me?',
  'Am I eligible for airline applications?',
  'How do I improve my Recognition Score?',
  'What does the pilot shortage mean for me?',
];

const FREE_DAILY_LIMIT = 3;

function getDailyCount(): number {
  const key = `pr_ai_requests_${new Date().toISOString().slice(0, 10)}`;
  const raw = localStorage.getItem(key);
  return raw ? Math.max(0, parseInt(raw, 10)) : 0;
}

function incrementDailyCount(): number {
  const key = `pr_ai_requests_${new Date().toISOString().slice(0, 10)}`;
  const next = getDailyCount() + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export const RecognitionAIChat: React.FC<Props> = ({ profile }) => {
  const isPlus =
    (profile?.subscription_tier as string) === 'plus' ||
    (profile?.subscription_tier as string) === 'enterprise' ||
    profile?.verified_account === true;

  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, Captain. I'm Recognition AI — your aviation career strategist. Ask me about your profile, pathways, or the industry outlook.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [requestsRemaining, setRequestsRemaining] = useState(
    isPlus ? Infinity : Math.max(0, FREE_DAILY_LIMIT - getDailyCount())
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    if (hasStarted) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [hasStarted]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    setInput('');
    setHasStarted(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
    ]);
    setIsLoading(true);

    if (!isPlus && requestsRemaining <= 0) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `You've reached your daily limit of ${FREE_DAILY_LIMIT} free requests. Upgrade to Recognition+ for unlimited AI access.`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (!isPlus) {
      const used = incrementDailyCount();
      setRequestsRemaining(Math.max(0, FREE_DAILY_LIMIT - used));
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const lower = message.toLowerCase();
      const hours = (profile?.total_flight_hours as number) || (profile?.total_hours as number) || 0;
      const license = (profile?.license_type as string) || 'CPL';
      const medical = (profile?.medical_class as string) || 'Class 1';

      let reply = '';
      if (lower.includes('pathway') || lower.includes('match')) {
        reply = `Based on your ${license} with ${hours} hours and ${medical} medical, you're well-positioned for commercial airline pathways. Focus on building PIC and cross-country hours to unlock ATPL eligibility.`;
      } else if (lower.includes('compliant') || lower.includes('eligible') || lower.includes('requirement')) {
        reply = `Your profile shows ${license} / ${medical} medical. Airlines typically require 1,500 total hours, an ATPL, and current Class 1 medical. Keep your recency within 90 days and logbook synced.`;
      } else if (lower.includes('shortage') || lower.includes('outlook') || lower.includes('market')) {
        reply = 'The global pilot shortage is projected at 30,000+ vacancies by 2030. Asia-Pacific and Middle East carriers are hiring aggressively. Verified pilots with Recognition+ status get pulled first.';
      } else if (lower.includes('score') || lower.includes('recognition')) {
        reply = 'Your Recognition Score improves with verified hours, credentials, and profile completeness. Connect your logbook and verify your license to boost your ranking in airline pulls.';
      } else if (lower.includes('medical') || lower.includes('expir')) {
        reply = `Your medical is listed as ${medical}. Ensure it is current — airlines will not consider pilots with expired medicals. You can upload a fresh certificate in your Wallet tab.`;
      } else if (lower.includes('logbook') || lower.includes('hours') || lower.includes('flight')) {
        reply = `You have ${hours} logged hours. Airlines want to see PIC, cross-country, night, and instrument time broken out. Sync your logbook to get a full breakdown and verification.`;
      } else {
        reply = `Captain, I see you hold a ${license} with ${hours} hours. Ask me about pathways, compliance, the pilot shortage, or how to improve your Recognition Score.`;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date().toISOString() },
      ]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setHasStarted(false);
    setMessages([
      {
        role: 'assistant',
        content: "Hello, Captain. I'm Recognition AI — your aviation career strategist. Ask me about your profile, pathways, or the industry outlook.",
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  return (
    <div
      className="rounded-2xl border border-white/40 p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <div className="mb-4">
        <p className="text-[11px] font-bold text-slate-500 tracking-wide">Ask Recognition AI</p>
        <p className="text-[10px] text-slate-400">Get advice on your pathways, career goals, and network.</p>
      </div>

      {/* Header — floating text, no wrapper */}
      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-2xl font-black tracking-wide">
          <span style={{ color: '#1e293b' }}>Recognition</span>
          <span style={{ color: '#dc2626' }}> AI</span>
        </p>
        {!isPlus && (
          <div className="flex justify-center mt-1.5">
            <span className={`text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full border ${
              requestsRemaining > 0
                ? 'text-amber-400 border-amber-400/20 bg-amber-400/10'
                : 'text-red-400 border-red-400/20 bg-red-400/10'
            }`}>
              {requestsRemaining}/{FREE_DAILY_LIMIT} free requests today
            </span>
          </div>
        )}
        {hasStarted && (
          <button
            onClick={resetChat}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Close chat"
          >
            <X size={14} className="text-white/40" />
          </button>
        )}
      </motion.div>

      {/* Messages — always visible even when limit reached */}
      <motion.div
        className="space-y-3 pr-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={`${msg.timestamp}-${idx}`}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white'
                  : ''
              }`}
              style={msg.role === 'user' ? {} : {
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
              }}
            >
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[9px] text-white/50 mt-1.5">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
              }}
            >
              <Loader2 size={14} className="text-amber-400 animate-spin" />
              <p className="text-[13px] text-white/70">Recognition AI is thinking…</p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input area — always white search bar, floating */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <EpauletIcon3 size={18} className="text-red-600 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={hasStarted ? 'Ask about your profile, pathways, shortage…' : PLACEHOLDERS[placeholderIdx]}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {hasStarted ? (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 bg-red-600 hover:bg-red-500"
              >
                <Send size={14} className="text-white" />
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-4 py-2 rounded-lg text-sm font-black tracking-wide transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 bg-red-600 hover:bg-red-500 text-white"
              >
                Search
              </button>
            )}
          </div>
      </motion.div>
    </div>
  );
};
