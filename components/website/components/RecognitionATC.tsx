import React, { useState, useContext } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

// Safe hook that handles missing ThemeProvider
const useSafeTheme = () => {
  try {
    const context = useContext(ThemeContext);
    const resolved = context || { isDarkMode: false, toggleTheme: () => {}, isAutoMode: false, resetToAutoTheme: () => {} };
    console.log('[RecognitionATC] useSafeTheme', {
      hasContext: Boolean(context),
      isDarkMode: resolved.isDarkMode,
    });
    return resolved;
  } catch (error) {
    console.log('[RecognitionATC] useSafeTheme error:', error);
    return { isDarkMode: false, toggleTheme: () => {}, isAutoMode: false, resetToAutoTheme: () => {} };
  }
};

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  actionType?: 'benefit' | 'followup' | 'faq' | 'text'; // Track what triggered this message
}

interface FAQ {
  id: string;
  question: string;
}

interface Benefit {
  id: string;
  emoji: string;
  title: string;
  answer: string;
  followUps: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const FAQ_QUESTIONS: FAQ[] = [
  { id: '1', question: 'What are the benefits of recognition+' },
  { id: '2', question: 'How does my Recognition Profile match with Career Pathways' },
  { id: '3', question: 'Is what is the beneficial certification of programs' },
];

// Recognition+ Benefits with follow-up questions
const RECOGNITION_BENEFITS: Benefit[] = [
  {
    id: 'profile',
    emoji: '🔄',
    title: 'Live Real-Time Profile',
    answer: 'Your profile syncs automatically with your logbook. Every hour flown, new type rating, or completed training shows up instantly — no more outdated CVs. Airlines see your current qualifications in real time.',
    followUps: [
      { id: 'profile-1', question: 'How often does my profile update?', answer: 'Your Recognition+ profile updates in real-time as you log flight hours through our integrated logbook system. Every training completion, certification, or type rating is reflected instantly across all airline job boards.' },
      { id: 'profile-2', question: 'Can airlines see my profile updates?', answer: 'Yes! Airlines receive real-time notifications when your profile changes. This means if you just completed a type rating or hit a flight hour milestone, recruiters are alerted immediately — putting you ahead of static CV candidates.' },
      { id: 'profile-3', question: 'What happens to my old profile data?', answer: 'Your historical flight data is preserved in your Recognition Profile archive. You can view your career progression at any time, and airlines can see your complete career timeline, which builds trust and demonstrates consistency.' },
    ],
  },
  {
    id: 'ai',
    emoji: '🤖',
    title: 'Recognition AI (Career Strategist)',
    answer: 'Our AI compares your profile against live industry data from airlines and manufacturers. It alerts you with things like: "You need 12 more A320 hours to qualify for Emirates First Officer." You get personalized pathway recommendations, market demand forecasts, and OEM-aligned (Airbus/Boeing) competency analysis.',
    followUps: [
      { id: 'ai-1', question: 'What kind of alerts does Recognition AI send?', answer: 'Recognition AI sends personalized alerts about: flight hour milestones for target airlines, new job openings that match your profile, type rating opportunities, upcoming training deadlines, and market forecasts showing where demand is highest for your qualifications.' },
      { id: 'ai-2', question: 'Can AI help me choose my next type rating?', answer: 'Absolutely! Recognition AI analyzes airline hiring trends, OEM forecasts, and your career goals to recommend which type rating will make you most competitive. It considers market demand, your experience level, and typical career progression paths.' },
      { id: 'ai-3', question: 'How accurate is the AI matching?', answer: 'Our Recognition AI is trained on 5+ years of airline hiring data, OEM reports, and real pilot career outcomes. It has a 87% accuracy rate for matching pilots to appropriate airline positions and identifying the exact gaps you need to fill.' },
    ],
  },
  {
    id: 'matching',
    emoji: '⭐',
    title: 'Priority Matching & Fast-Track Interviews',
    answer: 'When airlines pull pilot pools, Recognition+ members appear first thanks to AI-ranked placement. During hiring surges you get top shortlist placement, operator match notifications, and the ability to skip the EBT/CBTA queue (saving 1–2 months).',
    followUps: [
      { id: 'matching-1', question: 'How do I get top shortlist placement?', answer: 'Recognition+ members are automatically AI-ranked in airline talent pools based on your profile strength, experience match, and skill alignment. Airlines see your top ranking first, which significantly increases your chances of interview invitations.' },
      { id: 'matching-2', question: 'Can I really skip EBT/CBTA queue?', answer: 'Yes! Recognition+ Verified badge holders often bypass initial screening and EBT/CBTA assessments. Many airlines recognize our verification as proof of competency, allowing you to move directly to type-rating or interview stages — saving weeks or months.' },
      { id: 'matching-3', question: 'What happens during hiring surges?', answer: 'During peak hiring periods, our priority matching algorithm ensures Recognition+ members get notified first and receive front-of-queue placement. You\'ll get interview offers within days instead of months, and operator match notifications alert you to best-fit airlines in real-time.' },
    ],
  },
  {
    id: 'medical',
    emoji: '🏥',
    title: 'AI Medical & Compliance Alerts',
    answer: '24/7 monitoring of medicals, licenses, and recency across multiple jurisdictions. We warn you 60 days before any deadline and even suggest AME appointments with open slots — so you\'re never unexpectedly grounded.',
    followUps: [
      { id: 'medical-1', question: 'What compliance items does Recognition+ monitor?', answer: 'Recognition+ monitors class 1 medicals, type ratings currency, recency requirements, license validity across multiple jurisdictions (EASA, FAA, CAAC), insurance coverage, and training deadlines. Alerts arrive 60 days before expiry.' },
      { id: 'medical-2', question: 'Can it suggest AME appointments?', answer: 'Yes! Recognition+ integrates with partner AME networks to show available appointment slots. When your medical is approaching 60-day expiry, we recommend nearby AMEs with open bookings and coordinate scheduling to keep you current.' },
      { id: 'medical-3', question: 'Does it handle multi-country compliance?', answer: 'Absolutely. Recognition+ tracks licensing and compliance requirements across multiple countries and aviation authorities. It automatically adjusts monitoring based on where you\'re working or planning to work.' },
    ],
  },
  {
    id: 'training',
    emoji: '💰',
    title: '50% Off Training Programs',
    answer: 'Save thousands on partner Foundation and Transition programs. Most pilots find the annual subscription pays for itself through training discounts alone.',
    followUps: [
      { id: 'training-1', question: 'What training programs are discounted?', answer: 'Recognition+ gives 50% off Foundation Programs (mentorship & profile building), Transition Programs (CV optimization & interview prep), EBT/CBTA Fast-Track modules, type-rating endorsements, and specialized career development courses.' },
      { id: 'training-2', question: 'How much can I save annually?', answer: 'Recognition+ members typically save $2,000–$5,000+ per year through training discounts. Most pilots recover their annual subscription cost (under $100) within their first training module. Multiple pilots see the subscription as free value.' },
      { id: 'training-3', question: 'Can I use discounts on multiple programs?', answer: 'Yes! Your 50% discount applies across all partner training programs for the entire year of your Recognition+ subscription. Stack multiple programs and maximize your savings on career development.' },
    ],
  },
  {
    id: 'credentials',
    emoji: '🛡️',
    title: 'Verified Credentials & Background Check',
    answer: 'A Veremark background check and Recognition+ Verified badge appear on your profile. Airlines filter candidates by these — meaning you\'re discoverable to recruiters who specifically want pre-vetted pilots.',
    followUps: [
      { id: 'cred-1', question: 'What does the background check include?', answer: 'The Veremark background check verifies flight hours, certifications, training records, employment history, and regulatory compliance. It\'s recognized by 200+ airlines and confirms your credentials are legitimate and current.' },
      { id: 'cred-2', question: 'How does the Verified badge help me?', answer: 'The Recognition+ Verified badge appears on your profile and resume, signaling to airlines that you\'re pre-vetted and trustworthy. Airlines actively search for verified pilots, so you\'ll be discovered faster during recruitment campaigns.' },
      { id: 'cred-3', question: 'Does verification expire?', answer: 'Your Recognition+ Verified status is maintained as long as your subscription is active and your compliance records stay current. Annual renewal is simple — just maintain your medical and license validity.' },
    ],
  },
];

// Career Pathways Matching Topics with follow-ups
const PATHWAY_MATCHING_TOPICS: Benefit[] = [
  {
    id: 'profile-contents',
    emoji: '🧩',
    title: 'What\'s in Your Recognition Profile',
    answer: 'Your Recognition Profile isn\'t just a CV — it\'s a live, structured record of your aviation identity. It includes: flight hours broken down by category (PIC, multi-engine, turbine, cross-country, night, instrument), type ratings and aircraft-specific experience, medical class and recency status, license validity across jurisdictions, EBT/CBTA readiness, Veremark background check status, nationality and right-to-work eligibility, and your Recognition Score.',
    followUps: [
      { id: 'profile-1', question: 'What is a Recognition Score?', answer: 'Your Recognition Score is the composite metric that airlines filter by. It\'s calculated from your total flight hours, type rating diversity, medical currency, EBT readiness, background verification, and career continuity. Higher scores = higher priority placement in airline talent pools.' },
      { id: 'profile-2', question: 'How often is my profile updated?', answer: 'Your Recognition Profile updates in real-time as you log flight hours, complete type ratings, renew medicals, or pass assessments. Every change is instantly reflected across all Career Pathways, ensuring airlines always see your current qualifications.' },
      { id: 'profile-3', question: 'Which data matters most for matching?', answer: 'Airlines weight matching in this order: (1) Total flight hours and PIC, (2) Type ratings and aircraft experience, (3) Medical class and recency, (4) EBT/CBTA readiness, (5) Recognition Score, (6) Nationality and right-to-work, (7) Background verification.' },
    ],
  },
  {
    id: 'pathway-contents',
    emoji: '🎯',
    title: 'What\'s in a Career Pathway',
    answer: 'Every Career Pathway is a structured **Pathway Card** published by an operator (airline, charter, cargo, eVTOL). Instead of vague job posts saying "competitive experience required," each card lists exactly: required hours by type (e.g., 1,500 hrs, 500 multi-engine PIC), type ratings needed, medical class required, EBT/CBTA expectations, nationality eligibility (EU only, sponsorship available, etc.), Recognition Score threshold, and preferred endorsements.',
    followUps: [
      { id: 'pathway-1', question: 'Can pathways have different requirements?', answer: 'Absolutely. A charter operator might require 1,000 turbine hours and a type rating, while an eVTOL startup requires 500 hours and EBT completion. A legacy airline might need 2,000+ hours, while a regional partner could start at 1,500. Each operator sets their own criteria.' },
      { id: 'pathway-2', question: 'What does "sponsorship available" mean?', answer: 'It means the operator will sponsor work visas for pilots outside their home country. Recognition+ highlights pathways with sponsorship when your nationality eligibility shows you\'d need visa support, removing guesswork from international applications.' },
      { id: 'pathway-3', question: 'Do pathways change?', answer: 'Yes! Operators update pathways as hiring needs shift. New pathways appear constantly. When an operator adjusts requirements or lowers hour minimums, your profile is instantly re-matched — you\'ll see new opportunities you might have just qualified for.' },
    ],
  },
  {
    id: 'matching-engine',
    emoji: '⚙️',
    title: 'How the Matching Engine Works',
    answer: 'The matching engine runs a real-time comparison every time a pathway is published or your profile changes, comparing your live profile against every active Career Pathway you could be eligible for. It surfaces a clear result: ✅ Match (meet every requirement), 🟡 Partial Match (close, exact gaps shown), or 🔴 Gap (significant criteria unmet, structured route to close shown).',
    followUps: [
      { id: 'match-1', question: 'What does "Partial Match" mean exactly?', answer: 'You\'re close but missing something specific. For example: you have 1,400 hours but need 1,500, or you\'re type-rating-ready but haven\'t passed EBT yet. The engine shows the exact gap and how many hours/days until you qualify.' },
      { id: 'match-2', question: 'If there\'s a Gap, can I bridge it?', answer: 'Yes! The engine generates a **structured pathway to close the gap**, including specific training routes and partner ATOs (often at Recognition+ discount). For instance: "Complete 120 hours multi-engine PIC" or "Complete EBT at XYZ center." Most gaps can be closed in 3–6 months.' },
      { id: 'match-3', question: 'How fast does matching happen?', answer: 'Matching is instant. When you log 10 hours, renew your medical, or pass an assessment, your profile re-syncs and is immediately compared against all active pathways. Gaps that were unreachable yesterday become Match status today — and you\'re notified immediately.' },
    ],
  },
  {
    id: 'priority-matching',
    emoji: '⭐',
    title: 'Priority Matching for Recognition+ Members',
    answer: 'Free members get 2 pathway submissions and 3 profile comparisons per month. Recognition+ members get unlimited pathway submissions, unlimited profile comparisons, AI-ranked priority placement in airline search results, operator notifications when a new pathway matches your profile, fast-track interviews during hiring surges, and the ability to skip the EBT/CBTA queue after Foundation training.',
    followUps: [
      { id: 'priority-1', question: 'What is "priority placement" exactly?', answer: 'When airlines pull candidate pools, Recognition+ members are AI-ranked at the top based on profile strength and match quality. You appear first, get notified first, and receive interview invitations first — often within days instead of weeks or months.' },
      { id: 'priority-2', question: 'How do operator notifications work?', answer: 'When a new pathway is published that matches your profile, you get a notification before general job boards see it. If it\'s a strong match or a pathway you previously couldn\'t reach, you get priority access to submit interest.' },
      { id: 'priority-3', question: 'What\'s the queue-skipping benefit?', answer: 'After completing Foundation training, Recognition+ members often bypass initial EBT/CBTA screening and move directly to type-rating or interview stages. This saves 1–2 months and significantly increases your odds of getting hired quickly.' },
    ],
  },
  {
    id: 'continuous-matching',
    emoji: '🔁',
    title: 'Continuous Re-Matching',
    answer: 'The matching isn\'t a one-time event. When you log new flight hours, earn a type rating, renew your medical, or achieve a training milestone, your Recognition Profile is instantly re-matched against every pathway you previously didn\'t qualify for. Pathways you couldn\'t reach yesterday become open today — and you\'ll be the first to know.',
    followUps: [
      { id: 'continuous-1', question: 'Do I have to manually trigger re-matches?', answer: 'No — it\'s automatic. Every time your profile updates (new hours synced, medical renewed, rating earned), the system re-compares you against all active pathways in real-time. No action needed on your end.' },
      { id: 'continuous-2', question: 'When will I be notified of new matches?', answer: 'You\'ll receive push notifications, email alerts, and in-app messages when you achieve new match status or when a newly published pathway matches your profile. Priority Matching (Recognition+) gets notified first.' },
      { id: 'continuous-3', question: 'What if I log hours outside the app?', answer: 'Sync your logbook manually or connect third-party integrations (Logten, CloudAhoy, etc.). Once synced, new hours are reflected instantly and re-matching begins within seconds.' },
    ],
  },
  {
    id: 'what-is-pathway',
    emoji: '❓',
    title: 'Is a Career Pathway a Job Application?',
    answer: 'No — a Career Pathway is NOT a job application or recruitment submission. It\'s not a traditional recruitment agency process. Instead, it\'s a **signal of interest** to an operator. When you submit interest in a pathway, you\'re telling the operator: "I meet your criteria and I\'m interested in your operation." The operator then monitors interested pilots and at the end of the pathway period, they select the pilots who best align with their preferred profile and operational needs.',
    followUps: [
      { id: 'pathway-1', question: 'How does the operator selection process work?', answer: 'Operators set a pathway end date (typically 30–90 days). During that period, pilots can signal interest. At the end date, the operator reviews all interested pilots\' profiles, compares Recognition Scores and experience, and reaches out to their top matches for interviews or further discussions. It\'s a curated talent pool, not a first-come-first-served application.' },
      { id: 'pathway-2', question: 'What happens after I signal interest?', answer: 'Your profile joins the operator\'s talent pool for that pathway. The operator can see your live Recognition Profile (hours, ratings, medical status, etc.). They won\'t necessarily contact you immediately — they monitor the pool until the pathway closes, then make contact decisions based on their final hiring needs and your profile strength.' },
      { id: 'pathway-3', question: 'Can I signal interest in multiple pathways from the same operator?', answer: 'Yes! You can signal interest in different pathways (e.g., First Officer pathway AND Captain pathway from Emirates). Each signals a different level of interest and qualification. The operator sees all your interests and can assess your fit for each role. Just ensure your profile accurately reflects your qualifications.' },
    ],
  },
];

// Other FAQ Answers
const FAQ_ANSWERS: Record<string, string> = {
  'Is what is the beneficial certification of programs': 'Our partner programs focus on high-ROI certifications including Foundation Program (20HR mentorship & profile building), Transition Program (CV optimization & interview prep), EBT/CBTA Fast-Track, and specialized type-rating endorsements. Each program is aligned with what airlines actually hire for, not just generic credentials.',
};

export const RecognitionATC: React.FC = () => {
  const { isDarkMode } = useSafeTheme();
  const iconSrc = isDarkMode ? '/images/set-08-website/ATC3.png' : '/images/set-08-website/ATC2.png';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Recognition ATC calling, how can we assist and verify your pilot intention?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationStage, setConversationStage] = useState<'faq' | 'benefits' | 'benefit-selected' | 'pathways' | 'pathways-selected'>('faq');
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [selectedPathwayTopic, setSelectedPathwayTopic] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputValue,
      timestamp: new Date(),
      actionType: 'text',
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: 'Thank you for your message. Our ATC team is reviewing your request. We\'ll get back to you shortly.',
        timestamp: new Date(),
        actionType: 'text',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleFAQClick = (question: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: question,
      timestamp: new Date(),
      actionType: 'faq',
    };

    setMessages([...messages, userMessage]);

    // If this is the Recognition+ benefits question, move to benefits stage
    if (question === 'What are the benefits of recognition+') {
      setConversationStage('benefits');
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: 'Great question! Recognition+ is the premium tier of PilotRecognition. Let me walk you through the key benefits. Which one interests you most?',
          timestamp: new Date(),
          actionType: 'faq',
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    } else if (question === 'How does my Recognition Profile match with Career Pathways') {
      // Move to pathways matching stage
      setConversationStage('pathways');
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: 'Great question — this is where PilotRecognition really differs from a job board. We continuously compare your live profile against every active Career Pathway. Let me break down how it works:',
          timestamp: new Date(),
          actionType: 'faq',
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    } else {
      // For other FAQs, use standard answers
      const answer = FAQ_ANSWERS[question] || 'Great question! Our team is looking into this for you. We\'ll provide detailed information shortly.';

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: answer,
          timestamp: new Date(),
          actionType: 'faq',
        };
        setMessages(prev => [...prev, botMessage]);
      }, 800);
    }
  };

  const handleBenefitSelect = (benefit: Benefit) => {
    // Add user message with benefit title
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: `${benefit.emoji} ${benefit.title}`,
      timestamp: new Date(),
      actionType: 'benefit',
    };

    setMessages([...messages, userMessage]);
    setSelectedBenefit(benefit.id);
    setConversationStage('benefit-selected');

    // Show bot response with the benefit answer
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: benefit.answer,
        timestamp: new Date(),
        actionType: 'benefit',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleFollowUpSelect = (followUp: { id: string; question: string; answer: string }) => {
    // Add user message with follow-up question
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: followUp.question,
      timestamp: new Date(),
      actionType: 'followup',
    };

    setMessages([...messages, userMessage]);

    // Show bot response with the answer
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: followUp.answer,
        timestamp: new Date(),
        actionType: 'followup',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handlePathwayTopicSelect = (topic: Benefit) => {
    // Add user message with topic title
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: `${topic.emoji} ${topic.title}`,
      timestamp: new Date(),
      actionType: 'benefit',
    };

    setMessages([...messages, userMessage]);
    setSelectedPathwayTopic(topic.id);
    setConversationStage('pathways-selected');

    // Show bot response with the topic answer
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: topic.answer,
        timestamp: new Date(),
        actionType: 'benefit',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {/* Floating Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] group"
        aria-label="Open Recognition ATC Chat"
      >
        <div className="relative">
          {/* Pulsing background ring */}
          <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/30" />
          
          {/* Main button */}
          <div className="relative px-3 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all cursor-pointer group-hover:scale-105 bg-red-600 border-2 border-red-700 text-white hover:shadow-xl hover:shadow-red-600/50">
            {/* ATC icon image */}
            <img
              src={iconSrc}
              alt="Recognition ATC"
              className="w-10 h-10 flex-shrink-0"
            />

            {/* Text label */}
            <span className="font-bold text-sm whitespace-nowrap">Recognition ATC Chat</span>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-xs font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-[998] w-96 max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl shadow-black/20 overflow-hidden ${isDarkMode ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-gray-200'}`}>
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={iconSrc}
                alt="Recognition ATC"
                className="w-8 h-8"
              />
              <h3 className="text-white font-bold text-lg">Recognition ATC</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-5 h-5 text-white" />
                ) : (
                  <Minimize2 className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          {!isMinimized && (
            <>
              <div className={`h-80 overflow-y-auto p-4 space-y-3 ${isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? isDarkMode
                            ? 'bg-blue-700 text-white rounded-br-none'
                            : 'bg-red-600 text-white rounded-br-none'
                          : isDarkMode
                            ? 'bg-slate-800 text-white rounded-bl-none border border-slate-700'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-300'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <span className={`text-xs mt-1 block opacity-70 ${msg.type === 'user' || isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

              {/* FAQ Pills */}
              {messages.length === 1 && conversationStage === 'faq' && (
                <div className="mt-6 space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                    Frequently Asked Questions
                  </p>
                  <div className="space-y-2">
                    {FAQ_QUESTIONS.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleFAQClick(faq.question)}
                        className={`w-full px-3 py-2 rounded-full text-xs font-medium text-left transition-all transform hover:scale-105 ${isDarkMode ? 'bg-blue-900 border border-blue-700 text-white hover:bg-blue-800' : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400'}`}
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Selection - shown after user selects "What are the benefits of recognition+" */}
              {conversationStage === 'benefits' && (
                <div className="mt-6 space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                    Recognition+ Benefits
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {RECOGNITION_BENEFITS.map((benefit) => (
                      <button
                        key={benefit.id}
                        onClick={() => handleBenefitSelect(benefit)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all transform hover:scale-105 ${isDarkMode ? 'bg-blue-900 border border-blue-700 text-white hover:bg-blue-800' : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400'}`}
                      >
                        <span className="mr-2">{benefit.emoji}</span>
                        {benefit.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Questions - shown after user selects a specific benefit */}
              {conversationStage === 'benefit-selected' && selectedBenefit && (
                <div className="mt-6 space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                    Dive Deeper
                  </p>
                  <div className="space-y-2">
                    {RECOGNITION_BENEFITS.find(b => b.id === selectedBenefit)?.followUps.map((followUp) => (
                      <button
                        key={followUp.id}
                        onClick={() => handleFollowUpSelect(followUp)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all transform hover:scale-105 ${isDarkMode ? 'bg-blue-900 border border-blue-700 text-white hover:bg-blue-800' : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400'}`}
                      >
                        {followUp.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pathway Topics Selection - shown after user selects "How does my Recognition Profile match with Career Pathways" */}
              {conversationStage === 'pathways' && (
                <div className="mt-6 space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                    Core Topics
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {PATHWAY_MATCHING_TOPICS.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handlePathwayTopicSelect(topic)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all transform hover:scale-105 ${isDarkMode ? 'bg-blue-900 border border-blue-700 text-white hover:bg-blue-800' : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400'}`}
                      >
                        <span className="mr-2">{topic.emoji}</span>
                        {topic.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pathway Follow-up Questions - shown after user selects a specific pathway topic */}
              {conversationStage === 'pathways-selected' && selectedPathwayTopic && (
                <div className="mt-6 space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                    Dive Deeper
                  </p>
                  <div className="space-y-2">
                    {PATHWAY_MATCHING_TOPICS.find(t => t.id === selectedPathwayTopic)?.followUps.map((followUp) => (
                      <button
                        key={followUp.id}
                        onClick={() => handleFollowUpSelect(followUp)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-all transform hover:scale-105 ${isDarkMode ? 'bg-blue-900 border border-blue-700 text-white hover:bg-blue-800' : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400'}`}
                      >
                        {followUp.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>

              {/* Input Area */}
              <div className={`flex gap-2 p-3 ${isDarkMode ? 'bg-slate-950 border-t border-slate-800' : 'bg-gray-50 border-t border-gray-200'}`}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type your message..."
                  className={`flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:border-blue-500' : 'bg-white text-gray-800 placeholder-gray-400 border border-gray-300 focus:border-red-500'}`}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Footer */}
              <div className={`px-4 py-2 ${isDarkMode ? 'bg-slate-950 border-t border-slate-800' : 'bg-gray-50 border-t border-gray-200'}`}>
                <p className={`text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Powered by Recognition ATC • We typically respond within 2 minutes
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
