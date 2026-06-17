import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';

const SIDEBAR_WIDTH = 260;


interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are the PilotRecognition Internal Assistant. You help the leadership team — Benjamin (founder/CEO), Keiv (director/strategy), and Karl (operations) — with brainstorming, drafting emails, internal planning, and general company questions.

Key facts about the company:
- PilotRecognition.com bridges the gap between low-time pilots and airline requirements.
- Products: Foundation Program ($49), Transition Program ($299), Recognition Plus ($99/year), Pathways.
- Key partners: Veremark (background checks), CAAP (Philippines), Airbus HINFACT.
- Current focus: Philippines launch, CAAP advisory board, "Founding Pilots" program.
- The platform offers live real-time profiles (not static CVs), recognition scores, and pathway cards.

VERIFICATION PROVIDER CONTEXT — use this when drafting emails to partners:

Veremark (Primary Verification Partner):
- London HQ, Singapore hub, Philippines office.
- Strengths: Europe/APAC coverage, fast onboarding (1 week), API-first.
- Confirmed capabilities: Philippines ATO credential verification, formal education checks (grad certs, diplomas), webhook payload schema available at api.veremark.com/external/v1/docs/#tag/webhooks.
- Limitations: NOT aviation-specific. Flight training hours, course completion records, fast-track confirmations = NOT standard check (best effort only). CAAP PEL Number single-pull (license + medical + ELP) = needs technical investigation, NOT confirmed.
- Open question: They asked whether we need professional qualification verification from multiple bodies OR employment check for pilot history + hours flown. Answer: we need BOTH.
- Action items when emailing Veremark: Ask for timeline on CAAP PEL technical feasibility, clarify webhook schema for real-time per-check-type updates, request partner onboarding terms (revenue share / per-check billing).
- US market weakness: Need separate US partner (First Advantage or HireRight) for FAA/PRD compliance.

US Verification Alternatives:
- HireRight Aviation: Gold standard for US/PRIA.
- First Advantage: PRD and FOIA Airmen Certification.
- Vault Workforce: HIMS testing, FAA physical reviews.

CAAP (Philippines):
- PEL Number system ties license + medical + ELP together.
- Class 1 Medical is linked to CPL validity.
- We are pursuing CAAP advisory board engagement.

When drafting emails to verification providers:
- Lead with the "Pilot-Owned Data" angle — pilots control who sees their data, not employers.
- Emphasize Veremark Career Passport (Verepass) = blockchain-backed digital wallet.
- Position PilotRecognition as the "Immigration" gateway and Veremark as the "Digital Passport Bureau".
- Airlines get a "Cleared to Hire" list, not 500 PDF resumes.
- Ask for timeline confirmations, not vague assurances.
- Copy Keiv and Karl on all verification provider emails.

When drafting emails to airlines:
- Lead with the "pulling system" — airlines pull from a live verified pool.
- Mention EBT Video Scoring as proprietary IP.
- Reference the four-floor tower problem narrative.
- Offer "Founding Airline" status for early adopters.

When drafting emails to ATOs / flight schools:
- Lead with the "bridge" narrative — we keep graduates in the pipeline.
- Mention 6 campus partnerships already secured.
- Offer "Affiliated Partner" tier with shared content model.
- Product must be 90% ready before partner interviews.

When drafting emails to logbook providers:
- Emphasize live real-time profile integration.
- Position as data portability, not vendor lock-in.

When brainstorming:
- Think from the perspective of a pilot-owned data platform.
- Consider the four-floor career tower: graduates → instructors → recognition gap → airline pilots.
- Propose actionable, measurable ideas.

When asked about strategy:
- Reference the Kevin O'Leary framework: unit economics, royalty deals, strategic partnerships.
- Emphasize the "pulling system" (airlines pull pilots) over push applications.
`;

export default function AIBotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your PilotRecognition assistant. Ask me to brainstorm ideas, draft emails, or help with internal planning.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/groq-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          message: userMsg.content,
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `API error ${res.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'No response.', timestamp: new Date() },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to get response';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Draft an email to Veremark about CAAP PEL integration',
    'Brainstorm 3 ideas for the Founding Pilots program launch',
    'Summarize our Q3 priorities for the team',
    'Write a LinkedIn post announcing the Philippines launch',
  ];

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
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
              AI Bot
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Brainstorm · Draft Emails · Internal Planning
            </p>
          </div>
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
            LIVE
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: '12px 32px',
              background: '#fef2f2',
              borderBottom: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Chat area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 4,
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '14px 18px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#1a1a1a' : '#f3f4f6',
                  color: msg.role === 'user' ? '#ffffff' : '#1a1a1a',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
              <span style={{ fontSize: 10, color: '#9ca3af', padding: '0 4px' }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#d1d5db',
                  animation: 'pulse 1s infinite',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#d1d5db',
                  animation: 'pulse 1s infinite 0.2s',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#d1d5db',
                  animation: 'pulse 1s infinite 0.4s',
                }}
              />
              <style>{"@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}"}</style>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && !loading && (
          <div style={{ padding: '0 32px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Prompts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  style={{
                    padding: '8px 14px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 20,
                    fontSize: 12,
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            padding: '16px 32px',
            borderTop: '1px solid #e5e7eb',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me to brainstorm, draft an email, or help with planning..."
              rows={1}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                fontSize: 14,
                resize: 'none',
                minHeight: 44,
                maxHeight: 120,
                background: '#f9fafb',
                color: '#1a1a1a',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 22px',
                background: loading || !input.trim() ? '#e5e7eb' : '#1a1a1a',
                color: loading || !input.trim() ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? '…' : 'Send'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
            Powered by OpenRouter AI · Llama 3 8B (Free)
          </div>
        </div>
      </main>
    </div>
  );
}