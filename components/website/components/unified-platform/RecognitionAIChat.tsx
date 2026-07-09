import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, X, MessageCircle } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

// Safe hook that handles missing ThemeProvider (e.g. portal usage)
const useSafeTheme = () => {
  try {
    const context = useContext(ThemeContext);
    return (
      context || {
        isDarkMode: false,
        toggleTheme: () => {},
        isAutoMode: false,
        resetToAutoTheme: () => {},
      }
    );
  } catch {
    return {
      isDarkMode: false,
      toggleTheme: () => {},
      isAutoMode: false,
      resetToAutoTheme: () => {},
    };
  }
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  profile?: Record<string, unknown> | null;
}

/** 3-bar red epaulet icon for search bar */
const EpauletIcon3: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => {
  const barHeight = size * 0.12;
  const gap = size * 0.08;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height={barHeight} rx="1" fill="currentColor" />
      <rect
        x="4"
        y={4 + barHeight + gap}
        width="16"
        height={barHeight}
        rx="1"
        fill="currentColor"
      />
      <rect
        x="4"
        y={4 + (barHeight + gap) * 2}
        width="16"
        height={barHeight}
        rx="1"
        fill="currentColor"
      />
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

const FOLLOW_UPS = [
  'Which airlines fit me?',
  'How do I get verified?',
  "What's my score?",
  'Any good pathways right now?',
];

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
  const { isDarkMode } = useSafeTheme();

  const isPlus =
    (profile?.subscription_tier as string) === 'plus' ||
    (profile?.subscription_tier as string) === 'enterprise' ||
    profile?.verified_account === true;

  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey Captain! I'm Recognition AI — basically the senior FO in the right seat who's been through the hiring gauntlet. Ask me anything about your career, pathways, or where the industry's headed.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [requestsRemaining, setRequestsRemaining] = useState(
    isPlus ? Infinity : Math.max(0, FREE_DAILY_LIMIT - getDailyCount())
  );
  const [lastTopic, setLastTopic] = useState<string | null>(null);
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
          content: `You've hit your ${FREE_DAILY_LIMIT} free questions for today, Captain. Upgrade to Recognition+ and we can keep this briefing going all day.`,
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
      const hours =
        (profile?.total_flight_hours as number) || (profile?.total_hours as number) || 0;
      const license = (profile?.license_type as string) || 'CPL';
      const medical = (profile?.medical_class as string) || 'Class 1';
      const ato = (profile?.ato_name as string) || '';
      const verified = profile?.verified_account === true;
      const firstName = (profile?.first_name as string) || (profile?.name as string) || 'Captain';

      const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const maybeSignOff = () =>
        Math.random() > 0.6
          ? ' ' +
            pick([
              'Blue skies!',
              'Tailwinds!',
              'Keep the shiny side up!',
              'See you at FL350!',
              'Godspeed!',
              'Smooth skies ahead!',
            ])
          : '';

      let reply = '';
      let topic: string | null = null;

      // Small talk / social handlers
      if (/\b(hi|hello|hey|howdy|greetings)\b/.test(lower)) {
        reply = pick([
          `Hey ${firstName}! Ready to talk shop?`,
          `What's up, ${firstName}? I'm here when you need a second opinion.`,
          `Yo ${firstName}! Let's get into it — pathways, scores, whatever's on your mind.`,
        ]);
      } else if (/\bhow are you\b/.test(lower)) {
        reply = pick([
          `I'm running on 100% av-gas and good vibes, ${firstName}. You?`,
          `Can't complain — no turbulence in my server room, ${firstName}. What's cooking on your end?`,
          `All systems green here, ${firstName}. Ready to help you plot the next leg.`,
        ]);
      } else if (/\b(thanks|thank you|appreciate|cheers)\b/.test(lower)) {
        reply = pick([
          `Anytime, ${firstName}. That's what the right seat is for.`,
          `No worries, ${firstName}. Happy to help — hit me up anytime.`,
          `You got it, ${firstName}. Stick around, the good stuff's still coming.`,
        ]);
      } else if (/\b(haha|lol|lmao|😂|🤣)\b/.test(lower)) {
        reply = pick([
          `Glad I'm not the only one laughing at this industry, ${firstName}.`,
          `Right? Aviation's wild sometimes, ${firstName}.`,
          `Haha, ${firstName} — if we don't laugh at the checkride stories, what else is there?`,
        ]);
      } else if (/\b(bye|goodbye|see ya|cya|later|talk soon)\b/.test(lower)) {
        reply = pick([
          `Catch you on the next leg, ${firstName}. Fly safe!`,
          `Roger that, ${firstName}. See you on freq!`,
          `Later, ${firstName}. Don't forget to log those hours!`,
        ]);
      } else if (/\b(what can you do|help|who are you|what do you do)\b/.test(lower)) {
        reply = pick([
          `I'm basically your unofficial career co-pilot, ${firstName}. I can check your airline fit, talk market outlook, explain your Recognition Score, or break down pathways. What sounds useful?`,
          `Think of me as the senior FO who remembers every airline's hiring min-stats, ${firstName}. Pathways, scores, compliance, logbook tips — I'm your guy. Where do you want to start?`,
        ]);
      } else if (
        /\b(tell me more|and then|what else|go on|continue|more)\b/.test(lower) &&
        lastTopic
      ) {
        reply = pick([
          `Sure thing, ${firstName}. Where we left off: ${lastTopic}. Want me to dig deeper or pivot to something else?`,
          `Continuing from ${lastTopic}, ${firstName}. There's always more to unpack — say the word and I'll expand.`,
        ]);
      } else if (
        lower.includes('pathway') ||
        lower.includes('match') ||
        lower.includes('route') ||
        lower.includes('career')
      ) {
        topic = 'pathways & career routes';
        if (hours < 200) {
          reply = pick([
            `Hey ${firstName}, ${hours} hours — we've all been there! Most airlines want 1,500+, so your best bet is building PIC time. Instruction or charter gigs are goldmines for hours. Regional and cargo operators sometimes hire lower too. Stick with it!`,
            `Right on, ${firstName}. At ${hours} hours you're still in the grind phase — totally normal. Target instructor or charter roles to rack up PIC. Airlines will come knocking once you hit that magic number.`,
          ]);
        } else if (hours < 1500) {
          reply = pick([
            `Not bad, ${firstName} — ${hours} hours puts you in the sweet spot where things start moving. Focus on turbine and PIC time. Middle Eastern carriers sometimes pull at 1,000+ for transition programs. Keep building!`,
            `You're in the build phase, ${firstName}. ${hours} hours with a ${license} is solid. Turbine time and PIC are what recruiters eyeball first. Some carriers in the Middle East hire at 1,000+ for their bridge programs.`,
          ]);
        } else {
          reply = pick([
            `Nice, ${firstName} — ${license} and ${hours} hours? You're absolutely in the game. Major carriers are within reach. Just keep your recency tight and logbook synced so recruiters see you as ready to go.`,
            `Looking strong, ${firstName}! ${hours} hours and ${medical} medical — you're competitive for legacy and LCC pathways. Make sure your logbook's synced so airlines pull your verified profile first.`,
          ]);
        }
      } else if (
        lower.includes('compliant') ||
        lower.includes('eligible') ||
        lower.includes('requirement') ||
        lower.includes('qualify')
      ) {
        topic = 'eligibility & compliance';
        reply = pick([
          `So ${firstName}, you're sitting on a ${license} with ${hours} hours and ${medical} medical. Most airlines want 1,500 total, ATPL, current Class 1, and recency within 90 days. ${verified ? 'Good news — your verified badge already bumps you up the list.' : 'If you get verified, airlines will actually see you instead of filtering you out. Worth it.'}`,
          `Short version: ${license}, ${hours} hrs, ${medical} medical. Airlines typically filter for 1,500+, ATPL, current Class 1, and 90-day recency. ${verified ? "You're already pre-cleared — nice." : ' verification = instant visibility. Airlines skip unverified profiles by default.'}`,
        ]);
      } else if (
        lower.includes('shortage') ||
        lower.includes('outlook') ||
        lower.includes('market') ||
        lower.includes('demand') ||
        lower.includes('hiring')
      ) {
        topic = 'market outlook & hiring';
        reply = pick([
          `The shortage is real, ${firstName}. We're talking 30,000+ open seats by 2030. Asia-Pacific and the Middle East are hiring like crazy right now. ${verified ? "And since you're verified, you're at the top of their pull lists." : "Verified pilots get first dibs — unverified profiles often don't even make it to human eyes."}`,
          `It's a seller's market for pilots, ${firstName}. 30k+ vacancies projected, and carriers in the Middle East and Asia can't fill seats fast enough. ${verified ? 'Your verified status puts you ahead of the pack.' : 'If you verify, you skip the line — airlines literally filter for it.'}`,
        ]);
      } else if (
        lower.includes('score') ||
        lower.includes('recognition') ||
        lower.includes('rank')
      ) {
        topic = 'your Recognition Score';
        reply = pick([
          `Your Recognition Score is basically your street cred here, ${firstName}. Breakdown: verified hours (+25%), wallet docs (+20%), profile completeness (+15%), logbook sync (+20%), and recency within 90 days (+20%). ${!verified ? 'Biggest bang for your buck? Verify your license and medical.' : "You're already verified — now just keep that logbook synced and you're golden."}`,
          `Think of it like a credit score but for pilots, ${firstName}. Verified hours, uploaded credentials, complete profile, synced logbook, and current recency all add up. ${!verified ? 'Easiest win: get verified. Biggest jump.' : "You're verified, so you're already ahead. Keep it current."}`,
        ]);
      } else if (
        lower.includes('medical') ||
        lower.includes('expir') ||
        lower.includes('certificate')
      ) {
        topic = 'medical & certificates';
        reply = pick([
          `Your medical shows as ${medical}, ${firstName}. Airlines won't touch an app without current Class 1. If it's close to expiry, get ahead of it — DME slots book up fast. Upload the fresh one to your Wallet so you're match-ready. Some carriers also want ELP Level 4+, so double-check that too.`,
          `${medical} medical on file, ${firstName}. Pro tip: airlines auto-reject expired medicals before a human even sees your name. Keep it current, upload it to your Wallet, and don't forget your ELP if you're looking at international carriers.`,
        ]);
      } else if (
        lower.includes('logbook') ||
        lower.includes('sync') ||
        lower.includes('hours') ||
        lower.includes('flight') ||
        lower.includes('time')
      ) {
        topic = 'logbook & flight hours';
        reply = pick([
          `You've got ${hours} hours logged, ${firstName}. Recruiters love seeing PIC, cross-country, night, and instrument broken out clearly. Syncing your logbook auto-fills all that and gives you verification weight. ${hours < 500 ? 'At your hour level, every single one counts — sync it so nothing gets lost.' : "With your hours, a clean breakdown makes recruiters' jobs easy. They like easy."}`,
          `${hours} hours — nice. Airlines want the full picture: PIC, XC, night, instrument. Sync your logbook and it all populates automatically. ${hours < 500 ? "Trust me, every hour matters right now. Don't let any slip through the cracks." : "You're in a good spot. A detailed logbook just makes you look more professional."}`,
        ]);
      } else if (
        lower.includes('airline') ||
        lower.includes('carrier') ||
        lower.includes('emirates') ||
        lower.includes('etihad') ||
        lower.includes('flydubai') ||
        lower.includes('company')
      ) {
        topic = 'airline matches';
        reply = pick([
          `Airlines pull verified profiles first, ${firstName}. Your ${license} / ${hours}hrs / ${medical} medical lines up with several active pathways. Check the Pathways tab for live openings, or tell me a specific carrier and I'll break down what they want.`,
          `Your profile's got some matches out there, ${firstName}. ${license}, ${hours} hours, ${medical} medical — several carriers are pulling in that range. Hit the Pathways tab for current openings, or name a specific airline and I'll dig in.`,
        ]);
      } else if (
        lower.includes('ato') ||
        lower.includes('training') ||
        lower.includes('academy') ||
        lower.includes('school')
      ) {
        topic = 'ATO & training';
        reply = pick([
          `${ato ? `Your ATO (${ato}) can verify your training record right on the platform. ATO-verified hours carry extra weight — like a +15% boost to your score.` : `Link your ATO if you haven't yet, ${firstName}. ATO-verified training records give you a +15% score bump and go straight into airline pulls. Instant credibility.`}`,
          `${ato ? `Good news — ${ato} can verify your training here. That verification adds serious weight to your profile.` : `If your ATO is partnered with us, ${firstName}, linking them verifies your training record automatically. Big score boost. Worth checking.`}`,
        ]);
      } else if (
        lower.includes('upgrade') ||
        lower.includes('plus') ||
        lower.includes('subscription') ||
        lower.includes('premium')
      ) {
        topic = 'Recognition+ upgrade';
        reply = pick([
          `Honest take, ${firstName}? Recognition+ is basically your shortcut to the front of the line. Unlimited AI chats, verified badge, priority in airline pulls, and early pathway access. At ${hours} hours, one earlier pull pays for the whole year.`,
          `Recognition+ isn't just a badge, ${firstName}. It's unlimited AI access, priority placement, verified status, and first dibs on new pathways. If it gets you hired one month sooner, it pays for itself ten times over.`,
        ]);
      } else if (
        lower.includes('wallet') ||
        lower.includes('credential') ||
        lower.includes('document') ||
        lower.includes('upload')
      ) {
        topic = 'Wallet & credentials';
        reply = pick([
          `Your Wallet is your digital flight bag, ${firstName}. License, medical, ELP, logbook — all tamper-proof and verifiable. The more you stash in there, the higher your Recognition Score. Airlines see verified docs instantly. No paperwork chase.`,
          `Think of the Wallet as your forever-organized binder, ${firstName}. Upload once, verify once, and airlines see everything instantly. No more scrambling for PDFs when a recruiter calls.`,
        ]);
      } else if (
        lower.includes('atpl') ||
        lower.includes('type rating') ||
        lower.includes('instrument') ||
        lower.includes('pic')
      ) {
        topic = 'ATPL & type ratings';
        reply = pick([
          `ATPL and type ratings are your golden tickets, ${firstName}. With ${hours} hours, ${hours >= 1500 ? "you're likely at the threshold. Double-check your PIC and instrument totals in the Logbook tab — those are the numbers recruiters scrutinize." : "you're still building. Focus on PIC time first — type rating comes after you've got the hours to make it count."}`,
          `Type ratings and ATPL theory are game-changers, ${firstName}. At ${hours} hours, ${hours >= 1500 ? "you're probably there experience-wise. Verify your PIC and instrument breakdown in the Logbook tab." : 'hold off on the type rating for now. Build PIC first, then the rating makes financial sense.'}`,
        ]);
      } else {
        reply = pick([
          `Hey ${firstName}, I'm seeing your ${license} with ${hours} hours and ${medical} medical. What do you want to dive into — pathways, airline fit, the shortage, your score, or getting verified?`,
          `What's on your mind, ${firstName}? I can walk you through pathways, check your airline eligibility, talk market outlook, or help you bump that Recognition Score.`,
        ]);
      }

      reply += maybeSignOff();
      if (topic) setLastTopic(topic);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Hey, something went sideways on my end. Mind trying again?',
          timestamp: new Date().toISOString(),
        },
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
    setLastTopic(null);
    setMessages([
      {
        role: 'assistant',
        content:
          "Hey Captain! I'm Recognition AI — basically the senior FO in the right seat who's been through the hiring gauntlet. Ask me anything about your career, pathways, or where the industry's headed.",
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  return (
    <div
      className={`rounded-2xl border p-8 ${
        isDarkMode ? 'border-white/10' : 'border-white/40'
      }`}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.9))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        boxShadow: isDarkMode
          ? 'inset 0 1px 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)'
          : 'inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Top Bar Header */}
      <motion.div
        className="relative flex items-center justify-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left controls */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!isPlus && (
            <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full border text-white border-white/30 bg-slate-900/40">
              {requestsRemaining}/{FREE_DAILY_LIMIT} questions left today
            </span>
          )}
        </div>

        {/* Centered title */}
        <div className="text-center">
          <p className="text-2xl font-black tracking-wide">
            <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>Recognition</span>
            <span className="text-red-600"> AI</span>
          </p>
          <p
            className={`text-[10px] mt-0.5 ${
              isDarkMode ? 'text-white/50' : 'text-slate-400'
            }`}
          >
            Get advice on your pathways, career goals, and network.
          </p>
        </div>

        {/* Right controls */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {hasStarted && (
            <button
              onClick={resetChat}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'
              }`}
              title="Close chat"
            >
              <X size={14} className={isDarkMode ? 'text-white/50' : 'text-slate-400'} />
            </button>
          )}
        </div>
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
                msg.role === 'user' ? 'bg-red-600 text-white' : ''
              }`}
              style={
                msg.role === 'user'
                  ? {}
                  : isDarkMode
                    ? {
                        background: 'rgba(15,23,42,0.85)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }
                    : {
                        background: '#2563eb',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                      }
              }
            >
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[9px] text-white/50 mt-1.5">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
              style={
                isDarkMode
                  ? {
                      background: 'rgba(15,23,42,0.85)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }
                  : {
                      background: '#2563eb',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    }
              }
            >
              <Loader2 size={14} className="text-amber-400 animate-spin" />
              <p className="text-[13px] text-white/70">Checking the charts…</p>
            </div>
          </motion.div>
        )}
        {hasStarted &&
          !isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'assistant' && (
            <motion.div
              className="flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {FOLLOW_UPS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/60 border-white/10 hover:bg-slate-700/60'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <MessageCircle size={10} className={isDarkMode ? 'text-red-400' : 'text-red-500'} />
                  <span className={`text-[11px] font-medium ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>
                    {q}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input area — white in light mode, dark glass in dark mode */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 transition-all ${
            isDarkMode
              ? 'bg-slate-900/60 border border-white/10 focus-within:ring-red-500/30'
              : 'bg-white border border-slate-200 focus-within:ring-red-500/20'
          }`}
        >
          <EpauletIcon3 size={18} className="text-red-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              hasStarted
                ? 'Ask about your profile, pathways, shortage…'
                : PLACEHOLDERS[placeholderIdx]
            }
            disabled={isLoading}
            className={`flex-1 bg-transparent text-sm focus:outline-none ${
              isDarkMode
                ? 'text-white placeholder-white/40'
                : 'text-[#222222] placeholder-slate-600'
            }`}
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
              className="h-9 px-4 rounded-lg text-sm font-black tracking-wide flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 bg-red-600 hover:bg-red-500 text-white"
            >
              Search
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
