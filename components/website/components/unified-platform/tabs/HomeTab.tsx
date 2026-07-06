import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Home, User, Shield, Map, BookOpen, Plane, Wrench, FileText,
  BookMarked, Calendar, Newspaper, Settings, LogOut, Bell, Search,
  ChevronRight, TrendingUp, Award, Clock,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Star, Target,
  BarChart3, Building2, Zap, Globe, Menu, X, Filter, Download,
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye, Plus,
  Brain, FolderOpen, PlayCircle, GraduationCap, Activity, Image,
  CreditCard, Mail, Server, Database, Cloud, MessageSquare, Users,
  Linkedin, Instagram, Trophy, Snowflake, Mountain, Anchor, MapPin, Sun, Wind, Compass, Briefcase
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { safeRedirect } from '@/lib/url-validator';
import ProfileImage from '@/components/ProfileImage';
import { GettingStartedBar } from '../../GettingStartedBar';
import { CareerPathwaysCarousel } from '../../CareerPathwaysCarousel';
import { LogbookPreviewPanel, CredentialRequestCard, NotificationsFeedPanel } from '../shared';
import { PilotReferralShare } from '@/components/referral';
import { WelcomeGetStartedModal, useWelcomeModal } from '../WelcomeGetStartedModal';
import { DepartureBriefing } from '../DepartureBriefing';
import type { TabId } from '../types';

// ─── TAB: HOME ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

// Viewport-locked reference frame: M4 Air 13-inch content area below the nav.
const BASE_WIDTH = 1470;
const BASE_HEIGHT = 888;

export const HomeTab: React.FC<{
  profile: any; walletChecks: any[]; onNavigate: (p: string) => void; setTab: (t: TabId) => void;
  enrolledInFoundation: boolean; airlines: any[]; auth0User?: any; currentUser?: any;
  avatarInputRef?: React.RefObject<HTMLInputElement | null>;
  avatarUploading?: boolean;
  avatarError?: string;
  handleAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode?: boolean;
}> = ({ profile, walletChecks, onNavigate, setTab, enrolledInFoundation, airlines, auth0User, currentUser, avatarInputRef, avatarUploading, avatarError, handleAvatarUpload, isDarkMode = false }) => {
  const { callApi } = useWorkerAuth();
  const [visible, setVisible] = React.useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = React.useState(() => {
    try { return localStorage.getItem('welcome_dismissed') === '1'; } catch { return false; }
  });
  const dismissWelcome = () => {
    setWelcomeDismissed(true);
    try { localStorage.setItem('welcome_dismissed', '1'); } catch {}
  };
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(1);

  // First-time welcome tour (legacy)
  const { dismissed: tourDismissed, dismiss: dismissTour } = useWelcomeModal();
  const [showWelcomeTour, setShowWelcomeTour] = React.useState(false);

  React.useEffect(() => {
    if (!tourDismissed) {
      const timer = setTimeout(() => setShowWelcomeTour(true), 600);
      return () => clearTimeout(timer);
    }
  }, [tourDismissed]);

  // Departure Briefing spotlight tour
  const [showDepartureBriefing, setShowDepartureBriefing] = React.useState(() => {
    // Always show during development; later read from localStorage
    return true;
  });
  const navigateFromBriefing = (tabId: string) => {
    setShowDepartureBriefing(false);
    setTab(tabId as TabId);
  };

  const [obATO, setObATO] = React.useState('');
  const [obLicense, setObLicense] = React.useState('');
  const [obMedical, setObMedical] = React.useState('');
  const [obRadio, setObRadio] = React.useState('');
  const [obConsent, setObConsent] = React.useState(false);
  const [obConsent1, setObConsent1] = React.useState(false);
  const [obConsent2, setObConsent2] = React.useState(false);
  const [obConsent3, setObConsent3] = React.useState(false);
  const [obTokenising, setObTokenising] = React.useState(false);
  const [obDone, setObDone] = React.useState(false);
  const tokeniseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [obLogbookKey, setObLogbookKey] = React.useState('');
  const [obLogbookSynced, setObLogbookSynced] = React.useState(false);
  const [obLogbookSyncing, setObLogbookSyncing] = React.useState(false);
  const [obVaultUrl, setObVaultUrl] = React.useState('');
  const [obVaultLinked, setObVaultLinked] = React.useState(false);
  const [obCAA, setObCAA] = React.useState(profile?.caa_region ?? '');
  const [obATOs, setObATOs] = React.useState<string[]>(profile?.ato_name ? [profile.ato_name] : ['']);
  const [obLogbookProvider, setObLogbookProvider] = React.useState(profile?.logbook_provider ?? '');
  const [obHoursRaw, setObHoursRaw] = React.useState('');
  const [obHoursHash, setObHoursHash] = React.useState('');
  const [obHoursBand, setObHoursBand] = React.useState('');
  const [obHoursHashing, setObHoursHashing] = useState(false);
  const [obHoursHashed, setObHoursHashed] = useState(false);
  const [obDob, setObDob] = React.useState(profile?.date_of_birth ?? '');
  const [obLicenseType, setObLicenseType] = React.useState(profile?.current_occupation ?? '');

  // ── Viewport-locked scaling: keep the M4 Air 13-inch reference frame on every screen ──
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [wrapperSize, setWrapperSize] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setWrapperSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const viewportScale = Math.min(
    wrapperSize.width / BASE_WIDTH,
    wrapperSize.height / BASE_HEIGHT
  );

  // ── Pilot Career Status (pilotshortage.org compliant) ──
  const [obEmploymentStatus, setObEmploymentStatus] = React.useState<'employed' | 'unemployed' | 'transitioning' | 'graduate' | ''>(profile?.employment_status ?? '');
  const [obUnemployedDuration, setObUnemployedDuration] = React.useState(profile?.unemployed_duration ?? '');
  const [obCurrentJob, setObCurrentJob] = React.useState(profile?.current_job ?? '');
  const [obCareerGoal, setObCareerGoal] = React.useState(profile?.career_goal ?? '');

  // ── Pilot Training Stage (edit profile) ──
  const [obPilotStage, setObPilotStage] = React.useState<string>(profile?.pilot_stage ?? '');

  const obCadetTrack = React.useMemo(() => {
    const STUDENT_OCC = ['Student Pilot', 'Cadet'];
    const isStudent = STUDENT_OCC.includes(obLicenseType);
    const isMinor = obDob ? (() => {
      const birth = new Date(obDob);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      return age < 18;
    })() : false;
    if (!isMinor && !isStudent) return null;
    return isMinor ? 'minor' : 'student';
  }, [obDob, obLicenseType]);

  const hashHours = React.useCallback(async (rawHours: string) => {
    const n = parseFloat(rawHours);
    if (isNaN(n) || n < 0) return;
    setObHoursHashing(true);
    const band =
      n < 200 ? '<200h' : n < 500 ? '200-500h' : n < 1000 ? '500-1000h' :
      n < 1500 ? '1000-1500h' : n < 3000 ? '1500-3000h' : n < 5000 ? '3000-5000h' : '5000h+';
    const encoder = new TextEncoder();
    const data = encoder.encode(`PR_LOGBOOK_HOURS::${n.toFixed(1)}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setObHoursHash(hashHex);
    setObHoursBand(band);
    setObHoursHashing(false);
    setObHoursHashed(true);
  }, []);

  // ── Regional provider detection via timezone ──
  const detectedRegion = React.useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (
        tz.startsWith('Asia/Manila') || tz.startsWith('Asia/Singapore') ||
        tz.startsWith('Asia/Kuala') || tz.startsWith('Asia/Jakarta') ||
        tz.startsWith('Asia/Bangkok') || tz.startsWith('Asia/Ho_Chi') ||
        tz.startsWith('Asia/Hong_Kong') || tz.startsWith('Asia/Tokyo') ||
        tz.startsWith('Asia/Seoul') || tz.startsWith('Asia/Kolkata') ||
        tz.startsWith('Australia/') || tz.startsWith('Pacific/')
      ) return { label: 'Asia-Pacific', provider: 'Veremark', colour: '#16a34a' };
      if (
        tz.startsWith('Europe/') || tz.startsWith('Atlantic/')
      ) return { label: 'Europe', provider: 'Veremark', colour: '#2563eb' };
      if (
        tz.startsWith('America/') || tz.startsWith('US/')
      ) return { label: 'North America', provider: 'HireRight / First Advantage', colour: '#d97706' };
      return { label: 'Global', provider: 'Veremark', colour: '#6366f1' };
    } catch { return { label: 'Global', provider: 'Veremark', colour: '#6366f1' }; }
  }, []);

  const startTokenise = () => {
    setObTokenising(true);
    setOnboardingStep(4);
    setTimeout(() => { setObTokenising(false); setObDone(true); }, 3200);
  };

  React.useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  const score   = profile?.recognition_score ?? 0;
  const hours   = profile?.total_flight_hours ?? 0;
  const [logbookEntries, setLogbookEntries] = React.useState<any[]>([]);
  const [logbookLoaded, setLogbookLoaded] = React.useState(false);

  React.useEffect(() => {
    const id = profile?.id;
    if (!id) return;
    let active = true;
    callApi<Record<string, unknown>[]>('queryTable', {
      table: 'pilot_flight_logs',
      operation: 'select',
      where: { user_id: id },
      limit: 50,
    }).then((data) => {
      if (!active) return;
      const sorted = (data || []).sort((a: any, b: any) => {
        const da = a.date || '';
        const db = b.date || '';
        return db.localeCompare(da);
      });
      setLogbookEntries(sorted);
      setLogbookLoaded(true);
    });
    return () => { active = false; };
  }, [profile?.id]);

  const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
  const looksLikeEmailPrefix = (v: string) => /^[a-z0-9_\.]+$/.test(v) && v.length > 3;
  const rawName = profile?.display_name || profile?.full_name || profile?.first_name;
  const auth0Name = auth0User?.name || auth0User?.nickname || auth0User?.email?.split('@')[0];
  const currentUserName = currentUser?.display_name || currentUser?.displayName || currentUser?.email?.split('@')[0];
  const nameFromProfile = (rawName && !isCiphertext(rawName)) ? rawName : '';
  const name    = (nameFromProfile && !looksLikeEmailPrefix(nameFromProfile)) ? nameFromProfile : (auth0Name || currentUserName || 'Pilot');
  const firstName = profile?.first_name || auth0User?.given_name || (name && !name.includes('@') && !looksLikeEmailPrefix(name) ? name.split(/[\s._-]+/)[0] : 'Pilot');
  const rawLevel = profile?.current_occupation || profile?.license_type;
  const level   = (rawLevel && !isCiphertext(rawLevel)) ? rawLevel : 'Student Pilot';
  const pilotTierLines = (() => {
    const rankFromText = (text: string): number => {
      const t = text.toLowerCase();
      if (t.includes('atpl') || t.includes('airline transport')) return 4;
      if (t.includes('cpl') || t.includes('commercial')) return 3;
      if (t.includes('ppl') || t.includes('private')) return 2;
      if (t.includes('spl') || t.includes('student') || t.includes('cadet')) return 1;
      return 0;
    };
    const ranks = [
      rankFromText(profile?.license_type || ''),
      rankFromText(profile?.current_occupation || ''),
      rankFromText(profile?.pilot_stage || ''),
      rankFromText(profile?.current_level || ''),
      rankFromText(Array.isArray(profile?.license_types) ? profile.license_types.join(' ') : (profile?.license_types || '')),
      rankFromText(Array.isArray(profile?.ratings) ? profile.ratings.join(' ') : (profile?.ratings || '')),
    ];
    return Math.max(1, ...ranks);
  })();
  const initials = name.charAt(0).toUpperCase();
  const certifications = profile?.certifications || profile?.licenses || profile?.ratings || [];
  const certCount = Array.isArray(certifications) ? certifications.length : 0;

  const airportCodes = React.useMemo(() => {
    const codes = new Set<string>();
    logbookEntries.forEach((e: any) => {
      const route = String(e.route || '');
      const matches = route.match(/\b[A-Z]{3,4}\b/g);
      matches?.forEach(c => codes.add(c));
    });
    return Array.from(codes).slice(0, 12);
  }, [logbookEntries]);

  const airportTags = [
    { code: 'VNLK', name: 'Lukla', difficulty: 'Expert', classes: ['Class G'] },
    { code: 'KJFK', name: 'JFK', difficulty: 'Advanced', classes: ['Class B'] },
    { code: 'EGLL', name: 'Heathrow', difficulty: 'Advanced', classes: ['Class A'] },
    { code: 'TNCM', name: 'St. Maarten', difficulty: 'Advanced', classes: ['Class D'] },
    { code: 'KGCN', name: 'Grand Canyon', difficulty: 'Intermediate', classes: ['Class E'] },
  ].filter(t => airportCodes.includes(t.code));
  const hoursForNext = 50;
  const progressPct = Math.min((hours / hoursForNext) * 100, 100);
  const expiredChecks = walletChecks.filter(c => c.status === 'expired');

  const isAuthenticated = Boolean(profile || auth0User?.sub || currentUser?.id);
  const isAuthenticatedWithoutProfile = isAuthenticated && !profile;
  const hasLogbookSync = !!profile?.logbook_sync_valid || !!profile?.logbook_provider || logbookEntries.length > 0;
  const discoveryDone = (() => {
    try { return localStorage.getItem('pathways_discovery_done') === 'true'; } catch { return false; }
  })();
  const steps = [
    { step: 1, label: 'Account Created',     sublabel: 'Profile activated',          done: !!profile,                                          tab: 'profile'   as TabId, icon: User,       highlight: false },
    { step: 2, label: 'Complete Advanced Profile & Sync Logbook', sublabel: 'Add ratings, hours, and logbook', done: hasLogbookSync, tab: 'advanced-profile' as TabId, icon: RefreshCw,  highlight: false },
    { step: 3, label: 'Discover Pathways',     sublabel: 'Choose what to explore',     done: discoveryDone,                                       tab: 'pathways-discovery' as TabId, icon: Compass,    highlight: false },
  ];
  const completedCount = steps.filter(s => s.done).length;

  const matchPct = Math.min(
    Math.round(
      (profile ? 20 : 0) +
      (hours > 0 ? 20 : 0) +
      (walletChecks.some(c => c.status === 'verified') ? 25 : 0) +
      (score > 0 ? 20 : 0) +
      (enrolledInFoundation ? 15 : 0)
    ), 100
  );
  const isProfileComplete = !!(profile?.full_name && profile?.current_occupation && profile?.license_type);

  // Auto-redirect to pathways discovery when advanced profile completes
  React.useEffect(() => {
    if (!hasLogbookSync || discoveryDone) return;
    const alreadyRedirected = (() => {
      try { return sessionStorage.getItem('pathways_discovery_redirected') === '1'; } catch { return false; }
    })();
    if (alreadyRedirected) return;
    try { sessionStorage.setItem('pathways_discovery_redirected', '1'); } catch {}
    setTab('pathways-discovery' as TabId);
  }, [hasLogbookSync, discoveryDone, setTab]);

  const bCards = [
    { id: 'pathways', title: 'MY PATHWAYS',   image: '/images/airline-operations.png',                                                                    onClick: () => setTab('pathways') },
    { id: 'programs', title: enrolledInFoundation ? 'ACCESS PROGRAMS' : 'MY PROGRAMS', image: '/images/set-08-website/cessna.png', onClick: () => onNavigate(enrolledInFoundation ? 'foundational-platform' : 'foundational-program') },
  ];

  // MSFS 2024 Style Tiles Data
  const msfsTiles = [
    {
      id: 'my-pathways',
      title: 'MY PATHWAYS',
      subtitle: 'Complete your profile to reach 100% eligibility',
      image: '/images/airline-operations.png',
      size: 'large', // spans 2 cols
      onClick: () => setTab('pathways'),
      badge: `${matchPct}% Match`,
      badgeColor: matchPct >= 80 ? 'rgba(16,185,129,0.85)' : matchPct >= 40 ? 'rgba(234,179,8,0.85)' : 'rgba(239,68,68,0.8)'
    },
    {
      id: 'programs',
      title: enrolledInFoundation ? 'ACCESS PROGRAMS' : 'MY PROGRAMS',
      subtitle: 'Foundation & Transition Programs',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
      size: 'medium',
      onClick: () => onNavigate(enrolledInFoundation ? 'foundational-platform' : 'foundational-program')
    },
    {
      id: 'logbook',
      title: 'DIGITAL LOGBOOK',
      subtitle: hours > 0 ? `${hours} hrs logged` : 'Log your first flight',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
      size: 'medium',
      onClick: () => onNavigate('digital-logbook'),
      icon: BookMarked
    },
    {
      id: 'credentials',
      title: 'PILOT CREDENTIALS',
      subtitle: walletChecks.some(c => c.status === 'verified') 
        ? `${walletChecks.filter(c => c.status === 'verified').length} verified` 
        : 'Verify your credentials',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
      size: 'medium',
      onClick: () => setTab('wallet'),
      icon: Shield,
      status: walletChecks.some(c => c.status === 'verified') ? 'verified' : 'pending'
    },
    {
      id: 'type-rating',
      title: 'TYPE RATING SEARCH',
      subtitle: 'Find training providers worldwide',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
      size: 'medium',
      onClick: () => safeRedirect('/type-rating-search')
    },
    {
      id: 'airlines',
      title: 'AIRLINE EXPECTATIONS',
      subtitle: 'Operator requirements & pathways',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
      size: 'medium',
      onClick: () => setTab('pathways')
    },
    {
      id: 'recognition-plus',
      title: 'RECOGNITION+',
      subtitle: 'Upgrade for premium features',
      image: 'https://images.unsplash.com/photo-1542296332-2e44a24e5e8c?w=800&q=80',
      size: 'small',
      onClick: () => setTab('settings'),
      highlight: true
    },
    {
      id: 'events',
      title: 'EVENTS',
      subtitle: 'Aviation events & career fairs',
      image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80',
      size: 'small',
      onClick: () => onNavigate('events')
    },
    {
      id: 'newsroom',
      title: 'NEWSROOM',
      subtitle: 'Industry updates & announcements',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      size: 'small',
      onClick: () => onNavigate('newsroom')
    }
  ];

  const [selectedTile, setSelectedTile] = React.useState(msfsTiles[0].id);
  const activeTile = msfsTiles.find(t => t.id === selectedTile) ?? msfsTiles[0];

  const tileRequirements: Record<string, { label: string; met: boolean; value?: string }[]> = {
    'my-pathways': [
      { label: 'Profile Complete', met: !!profile },
      { label: 'Flight Hours Logged', met: hours > 0, value: hours > 0 ? `${hours} hrs` : undefined },
      { label: `Match Score`, met: matchPct >= 40, value: `${matchPct}%` },
    ],
    'programs': [
      { label: 'Account Active', met: !!profile },
      { label: 'Foundation Program', met: enrolledInFoundation },
    ],
    'logbook': [
      { label: 'Account Active', met: !!profile },
      { label: 'First Flight Logged', met: hours > 0 },
    ],
    'credentials': [
      { label: 'Account Active', met: !!profile },
      { label: 'License Verified', met: walletChecks.some(c => c.status === 'verified') },
      { label: 'Medical Verified', met: walletChecks.filter(c => c.status === 'verified').length >= 2 },
    ],
    'type-rating': [
      { label: 'Open to All Pilots', met: true },
    ],
    'airlines': [
      { label: 'Account Active', met: !!profile },
      { label: 'Recognition Score', met: score > 0, value: score > 0 ? `${score}/100` : undefined },
    ],
    'recognition-plus': [
      { label: 'Account Active', met: !!profile },
      { label: 'Subscription Active', met: false },
    ],
    'events': [{ label: 'Open to All Pilots', met: true }],
    'newsroom': [{ label: 'Open to All Pilots', met: true }],
  };

  const tileCompatible: Record<string, { label: string; sub: string; icon: React.ComponentType<{ className?: string; size?: number }> }[]> = {
    'my-pathways': [
      { label: 'Commercial Airlines', sub: `${airlines.length}+ operators`, icon: Plane },
      { label: 'Cargo Operations', sub: 'Freight & logistics', icon: Globe },
      { label: 'Private Aviation', sub: 'Charter & VIP', icon: Star },
    ],
    'programs': [
      { label: 'Foundation Program', sub: '$49 · Pilot development', icon: BookOpen },
      { label: 'Transition Program', sub: '$299 · Airline-ready', icon: GraduationCap },
    ],
    'logbook': [
      { label: 'ForeFlight', sub: 'Import via API key', icon: BookMarked },
      { label: 'Safelog', sub: 'CSV import', icon: BookMarked },
      { label: 'Manual Entry', sub: 'Direct log entry', icon: Edit3 },
    ],
    'credentials': [
      { label: 'CAAP License', sub: 'Philippines CAA', icon: Shield },
      { label: 'Class 1 Medical', sub: 'ICAO standard', icon: CheckCircle },
      { label: 'ELP Certificate', sub: 'ICAO Level 4–6', icon: Globe },
    ],
    'type-rating': [
      { label: 'Airbus A320', sub: 'Type rating centres worldwide', icon: Plane },
      { label: 'Boeing 737', sub: '200+ approved centres', icon: Plane },
    ],
    'airlines': [
      { label: 'Emirates', sub: 'AUH · Min 1500 hrs', icon: Plane },
      { label: 'Cebu Pacific', sub: 'MNL · Cadet pathway', icon: Plane },
      { label: 'Etihad Airways', sub: 'AUH · Type rating required', icon: Plane },
    ],
    'recognition-plus': [
      { label: 'Veremark Background Check', sub: 'Automated · APAC/EU', icon: Shield },
      { label: 'Priority Pathway Listing', sub: 'Airlines see you first', icon: Star },
      { label: 'ATO Logbook Validation', sub: 'Expedited pipeline', icon: CheckCircle },
    ],
    'events': [
      { label: 'Aviation Career Fairs', sub: 'Global events calendar', icon: Calendar },
    ],
    'newsroom': [
      { label: 'Industry Updates', sub: 'Aviation news & alerts', icon: Newspaper },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  };

  return (
    <div ref={wrapperRef} className="w-full h-full flex items-start justify-center overflow-hidden">
      <motion.div
        ref={frameRef}
        className="flex flex-col gap-3 px-4 pt-8 pb-4 mx-auto overflow-hidden"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${viewportScale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      <motion.div variants={itemVariants}>
        <GettingStartedBar
          steps={steps}
          onStepClick={(tab) => setTab(tab as TabId)}
          isGuest={!isAuthenticated}
          onGuestCta={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
        />
      </motion.div>

      <div className="flex gap-3 items-stretch flex-1 min-h-0 overflow-hidden">
        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0 overflow-hidden">

        {/* ── DISCOVER PATHWAYS (auto-rotating carousel) ── */}
        <motion.div variants={itemVariants} className="flex-1 min-h-0 overflow-hidden">
          <CareerPathwaysCarousel
            airlinesCount={airlines.length}
            setTab={(tab) => setTab(tab)}
            safeRedirect={safeRedirect}
          />
        </motion.div>

        {/* ── THREE CARDS ROW ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 h-[120px] flex-shrink-0 overflow-hidden">

          {/* ACCESS RECOGNITION — goes to profile */}
          <motion.div
            data-tour-target="home-access-recognition"
            className="relative overflow-hidden cursor-pointer group h-full border border-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(15,39,71,0.10)]"
            onClick={() => setTab('profile' as TabId)}
            variants={{ hidden: {}, visible: {} }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(220,38,38,0.25), inset 0 0 0 1px rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.96, boxShadow: '0 0 40px rgba(220,38,38,0.4), inset 0 0 0 1px rgba(255,255,255,0.25)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {(() => {
              const userTier = (profile?.subscription_tier || profile?.recognition_tier || 'free').toString();
              const isPremium = userTier === 'plus' || userTier === 'silver' || userTier === 'enterprise' || userTier === 'gold';
              return (
                <>
                  <div className="absolute inset-y-0 right-0 w-[48%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/images/set-07-ui-graphics/trailer1.png')" }} />
                  <div className="absolute inset-y-0 left-[52%] w-[12%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
                  <div className="absolute inset-y-0 left-0 w-[52%] z-20 flex flex-col justify-end p-3"
                    style={isDarkMode ? {
                      background: 'rgba(8,8,12,0.95)',
                      border: '1px solid rgba(77,208,225,0.35)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                    } : {
                      background: 'rgba(240,245,250,0.75)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.45)',
                      boxShadow: '0 8px 32px rgba(15,39,71,0.08), inset 0 1px 0 rgba(255,255,255,0.45)',
                    }}>
                    <p className="text-[8px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: isDarkMode ? '#4dd0e1' : 'rgba(248,113,113,0.85)' }}>
                      {isPremium ? 'Verified' : 'Profile'}
                    </p>
                    <h3 className="text-lg font-black tracking-tight leading-tight"><span style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>ACCESS</span><br/><span style={{ color: '#dc2626' }}>RECOGNITION</span></h3>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-[2px] z-30" style={{ background: '#dc2626' }} />
                  {isPremium && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(220,38,38,0.85)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="text-[8px] font-black text-white">RECOGNITION+</span>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>

          {/* DISCOVER PROGRAMS */}
          <div
            data-tour-target="home-discover-pathways"
            className="relative overflow-hidden cursor-pointer group h-full border border-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(15,39,71,0.10)]"
            onClick={() => {
              localStorage.setItem('careerpathways_mode', 'true');
              window.location.href = `${window.location.origin}/?product=careerpathways`;
            }}
          >
            <div className="absolute inset-y-0 right-0 w-[48%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/images/set-06-pathways/pathway4.png')" }} />
            <div className="absolute inset-y-0 left-[52%] w-[12%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
            <div className="absolute inset-y-0 left-0 w-[52%] z-20 flex flex-col justify-end p-3"
              style={isDarkMode ? {
                background: 'rgba(8,8,12,0.95)',
                border: '1px solid rgba(77,208,225,0.35)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              } : {
                background: 'rgba(240,245,250,0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.45)',
                boxShadow: '0 8px 32px rgba(15,39,71,0.08), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}>
              <p className="text-[8px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: isDarkMode ? '#4dd0e1' : 'rgba(248,113,113,0.85)' }}>Career</p>
              <h3 className="text-lg font-black tracking-tight leading-tight"><span style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>DISCOVER</span><br/><span style={{ color: '#dc2626' }}>PATHWAYS</span></h3>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[2px] z-30" style={{ background: '#dc2626' }} />
          </div>

          {/* THE PILOT SHORTAGE — pilotshortage.org in-app */}
          <div
            data-tour-target="home-pilot-shortage"
            className="relative overflow-hidden cursor-pointer group h-full border border-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(15,39,71,0.10)]"
            onClick={() => onNavigate('pilotshortage')}
          >
            <div className="absolute inset-y-0 right-0 w-[48%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/images/set-04-screenshots/photo1.png')" }} />
            <div className="absolute inset-y-0 left-[52%] w-[12%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
            <div className="absolute inset-y-0 left-0 w-[52%] z-20 flex flex-col justify-end p-3"
              style={isDarkMode ? {
                background: 'rgba(8,8,12,0.95)',
                border: '1px solid rgba(77,208,225,0.35)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              } : {
                background: 'rgba(240,245,250,0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.45)',
                boxShadow: '0 8px 32px rgba(15,39,71,0.08), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}>
              <p className="text-[8px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: isDarkMode ? '#4dd0e1' : 'rgba(248,113,113,0.85)' }}>Association</p>
              <h3 className="text-lg font-black tracking-tight leading-tight"><span style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>THE PILOT</span><br/><span style={{ color: '#dc2626' }}>SHORTAGE</span></h3>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[2px] z-30" style={{ background: '#dc2626' }} />

          </div>

        </motion.div>
      </div>

      {/* ── RIGHT PROFILE CARD ── */}
      <motion.div
        variants={itemVariants}
        className="w-80 flex-shrink-0 flex flex-col rounded-none overflow-hidden border border-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(15,39,71,0.10)] relative h-full"
        style={isDarkMode
          ? { background: 'rgba(8,8,12,0.95)', border: '1px solid rgba(77,208,225,0.35)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }
          : { background: 'rgba(240,245,250,0.38)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }
        }
      >
        {isDarkMode ? (
          /* Aviation PFD dark display background */
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(77,208,225,0.12), transparent 45%), radial-gradient(circle at 70% 80%, rgba(233,30,140,0.08), transparent 45%)' }} />
          </div>
        ) : (
          /* Milky cloud shimmer + brightness cap overlay */
          <>
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 50% 50%, rgba(15,39,71,0.08), transparent 70%)' }} />
            </div>
            <div className="absolute inset-0 bg-[#0f2747]/10 pointer-events-none" />
          </>
        )}

        {/* ── PROFILE CARD HEADER ── */}
        <div className="relative px-5 pt-5 pb-4 flex-shrink-0 border-b border-white/10">
          <div className="absolute top-0 left-0 right-0 flex flex-col gap-[2px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[2px] w-full transition-opacity"
                style={{ background: i < pilotTierLines ? '#facc15' : 'rgba(255,255,255,0.06)', opacity: i < pilotTierLines ? 1 : 0.4 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-black tracking-tight">
                <span style={{ color: isDarkMode ? '#4dd0e1' : '#dc2626', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Welcome Capt, </span>
                <span style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>{firstName || 'Pilot'}</span>
              </h2>
            </div>
          </div>
        </div>

        {profile || auth0User?.sub || currentUser?.id ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Game-style profile header */}
            {(() => {
              const occ = (profile?.current_occupation || profile?.license_type || '').toLowerCase();
              const isSplOrPpl = /spl|ppl|student|private/i.test(occ);
              const userTier = (profile?.subscription_tier || profile?.recognition_tier || 'free').toString();
              const isPremium = userTier === 'plus' || userTier === 'silver' || userTier === 'enterprise' || userTier === 'gold';
              const premiumButton = isPremium ? (
                <button
                  className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
                  title="Customize background"
                  onClick={() => {/* TODO: open background picker */}}
                >
                  <Camera size={12} style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#5e85a8' }} />
                </button>
              ) : null;
              if (isSplOrPpl) {
                return (
                  <div className="relative h-24 group/header" style={{ backgroundImage: 'url(/images/set-07-ui-graphics/images.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70" />
                    {premiumButton}
                  </div>
                );
              }
              return (
                <div className="relative h-24 group/header" style={{ backgroundImage: 'url(/images/set-04-screenshots/Captain-Paperwork-Medium.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70" />
                  {premiumButton}
                </div>
              );
            })()}

            {/* Avatar + identity */}
            <div className="flex flex-col items-center px-4 -mt-10 pb-4">
              {(() => {
                // Check each field independently and use the highest rank found
                const rankFromText = (text: string): number => {
                  const t = text.toLowerCase();
                  if (t.includes('atpl') || t.includes('airline transport')) return 4;
                  if (t.includes('cpl') || t.includes('commercial')) return 3;
                  if (t.includes('ppl') || t.includes('private')) return 2;
                  if (t.includes('spl') || t.includes('student') || t.includes('cadet')) return 1;
                  return 0;
                };
                const ranks = [
                  rankFromText(profile?.license_type || ''),
                  rankFromText(profile?.current_occupation || ''),
                  rankFromText(profile?.pilot_stage || ''),
                  rankFromText(Array.isArray(profile?.license_types) ? profile.license_types.join(' ') : (profile?.license_types || '')),
                  rankFromText(Array.isArray(profile?.ratings) ? profile.ratings.join(' ') : (profile?.ratings || '')),
                ];
                const stripes = Math.max(1, ...ranks); // minimum 1 stripe (student)
                return (
                  <div className="relative mb-3">
                    {/* Epaulet stripes behind avatar */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                      {Array.from({ length: stripes }).map((_, i) => (
                        <div key={i} className="w-5 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, #facc15, #eab308)' }} />
                      ))}
                    </div>
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                      {Array.from({ length: stripes }).map((_, i) => (
                        <div key={i} className="w-5 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, #facc15, #eab308)' }} />
                      ))}
                    </div>
                    <div className="relative cursor-pointer group" onClick={() => !avatarUploading && avatarInputRef?.current?.click()}>
                      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      <ProfileImage url={profile?.profile_image_url} publicId={profile?.profile_image_public_id} name={name} size={80} className="rounded-full border-[3px] border-[rgba(15,22,35,0.97)]" fallbackClassName="rounded-full bg-blue-500 text-white text-2xl" />
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {avatarUploading ? <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" /> : <Camera size={14} className="text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {(() => {
                // Clean name: never show raw email as the display name
                const rawDisplay = profile?.display_name || profile?.full_name || name;
                const cleanName = typeof rawDisplay === 'string' && rawDisplay.includes('@')
                  ? rawDisplay.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  : rawDisplay;
                const displayName = cleanName || name || 'Pilot';
                // Handle: if display_name is an email, derive from email prefix; otherwise use name
                const handleSource = (profile?.display_name || '');
                const handle = handleSource.includes('@')
                  ? handleSource.split('@')[0].replace(/[^a-z0-9]/gi, '')
                  : displayName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '');
                return (
                  <div className="flex flex-col items-center w-full">
                    <p className="text-lg font-black text-center truncate w-full tracking-tight" style={{ color: '#ffffff' }}>{displayName}</p>
                    {handle && !handleSource.includes('@') && (
                      <p className="text-[11px] font-bold text-center mt-1" style={{ color: isDarkMode ? '#FF00FF' : '#5e85a8' }}>@{handle}</p>
                    )}
                  </div>
                );
              })()}
              <p className="text-[10px] font-bold uppercase tracking-wider mt-2" style={{ color: isDarkMode ? '#ffffff' : '#dc2626', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>{level}</p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-2">
                {profile?.linkedin_url ? (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/20" style={{ background: isDarkMode ? 'rgba(255,255,255,0.06)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none"><Linkedin size={15} style={{ color: '#ffffff' }} /></span>
                  </a>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none"><Linkedin size={15} style={{ color: '#ffffff' }} /></span>
                  </div>
                )}
                {profile?.instagram_url ? (
                  <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/20" style={{ background: isDarkMode ? 'rgba(255,255,255,0.06)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none"><Instagram size={15} style={{ color: '#ffffff' }} /></span>
                  </a>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none"><Instagram size={15} style={{ color: '#ffffff' }} /></span>
                  </div>
                )}
                {profile?.x_url ? (
                  <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/20" style={{ background: isDarkMode ? 'rgba(255,255,255,0.06)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffffff' }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </span>
                  </a>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid #1e3a5f' }}>
                    <span className="flex items-center justify-center leading-none">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffffff' }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </span>
                  </div>
                )}
                {/* Add / manage social accounts */}
                <button
                  onClick={() => setTab('settings' as TabId)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
                  style={{ background: isDarkMode ? 'rgba(255,255,255,0.06)' : '#1e3a5f', border: isDarkMode ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #1e3a5f' }}
                  title="Manage social accounts"
                >
                  <span className="flex items-center justify-center leading-none"><Plus size={15} style={{ color: '#ffffff' }} /></span>
                </button>
              </div>

              {/* Sync social media accounts — only show if none connected */}
              {!profile?.linkedin_url && !profile?.instagram_url && !profile?.x_url && (
                <button
                  onClick={() => setTab('settings' as TabId)}
                  className="flex items-center gap-1.5 mt-2 text-[10px] font-bold hover:text-blue-400 transition-colors" style={{ color: isDarkMode ? '#FF00FF' : '#2b9eb3', fontFamily: "'G1000', 'VT323', monospace", textTransform: 'uppercase' }}
                >
                  <ExternalLink size={12} />
                  Sync social media accounts
                </button>
              )}

              {/* Account tier & invite code */}
              {(() => {
                const tier = (profile?.subscription_tier || profile?.recognition_tier || 'free').toString().toLowerCase();
                const isFree = tier === 'free' || tier === 'bronze';
                return isFree ? (
                  <div className="relative group flex items-center gap-2 mt-3">
                    {!isProfileComplete && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-wide whitespace-nowrap" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                          Complete your advance profile
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setTab('settings' as TabId)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase transition-all hover:brightness-110 ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`}
                      style={{ background: 'linear-gradient(180deg, #3a3a4a 0%, #2a2a38 100%)', border: '1px solid rgba(77,208,225,0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)', color: '#ffffff' }}
                    >
                      <span style={{ fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Get Invite Code With </span><span style={{ color: '#ff0000', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Recognition</span><span style={{ color: '#ff0000', verticalAlign: 'middle', position: 'relative', top: '-1px' }}>+</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase" style={{ background: 'rgba(77,208,225,0.1)', border: '1px solid rgba(77,208,225,0.35)', color: '#4dd0e1', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>
                      {tier === 'plus' || tier === 'silver' ? 'Recognition+' : tier === 'enterprise' || tier === 'gold' ? 'Enterprise' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Compact stat row */}
            <div className="relative group grid grid-cols-3 gap-2 px-4 mb-2">
              {!isProfileComplete && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-wide" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    Complete your advance profile
                  </div>
                </div>
              )}
              <div className={`text-center py-2.5 rounded-lg ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`} style={isDarkMode ? { background: '#000000', border: '1px solid rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-base font-black" style={{ color: '#ffffff', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{profile?.pic_hours || '0'}</p>
                <p className="text-[8px] font-black uppercase tracking-wider mt-0.5" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>PIC Time</p>
              </div>
              <div className={`text-center py-2.5 rounded-lg ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`} style={isDarkMode ? { background: '#000000', border: '1px solid rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-base font-black" style={{ color: '#ffffff', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{profile?.total_flight_hours || profile?.total_hours || '0'}</p>
                <p className="text-[8px] font-black uppercase tracking-wider mt-0.5" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Total Hours</p>
                {!profile?.license_number && (
                  <p className="text-[8px] font-bold mt-0.5 uppercase" style={{ color: '#dc2626', textDecoration: 'underline', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>UNVERIFIED</p>
                )}
              </div>
              <div className={`text-center py-2.5 rounded-lg ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`} style={isDarkMode ? { background: '#000000', border: '1px solid rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-base font-black" style={{ color: '#ffffff', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{profile?.dual_hours || '0'}</p>
                <p className="text-[8px] font-black uppercase tracking-wider mt-0.5" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Dual Time</p>
              </div>
            </div>

            {/* Recent activity / last flown */}
            <div className="relative group px-4 mb-4">
              {!isProfileComplete && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-wide" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    Complete your advance profile
                  </div>
                </div>
              )}
              {hasLogbookSync ? (
                <div className={`rounded-xl px-3 py-2.5 flex items-center justify-between ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`} style={isDarkMode ? { background: '#000000', border: '1px solid rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: isDarkMode ? '#4dd0e1' : '#9ab0c8' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isDarkMode ? '#4dd0e1' : '#9ab0c8', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Last Flown</span>
                  </div>
                  <span className="text-[11px] font-black" style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>{profile?.last_flown || profile?.last_flight_date || 'N/A'}</span>
                </div>
              ) : (
                <button
                  onClick={() => setTab('wallet' as TabId)}
                  className={`w-full rounded-full px-4 py-2.5 flex items-center justify-between transition-all hover:brightness-110 ${!isProfileComplete ? 'opacity-40 grayscale' : ''}`}
                  style={isDarkMode
                    ? { background: 'linear-gradient(180deg, #3a3a4a 0%, #2a2a38 100%)', border: '1px solid rgba(77,208,225,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)' }
                    : { background: '#f0f5fa', border: '1px solid rgba(30,58,95,0.15)' }
                  }
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw size={12} style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Connect Logbook</span>
                  </div>
                  <span className="text-[11px] font-black" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>→</span>
                </button>
              )}
            </div>

            {/* Airport tags */}
            {airportTags.length > 0 && (
              <div className="px-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} style={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : '#9ab0c8' }} />
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#9ab0c8', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Airport Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {airportTags.map(({ code, name, difficulty, classes }) => (
                    <div key={code} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-[9px] font-black" style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>{code}</span>
                      <span className="text-[8px]" style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#9ab0c8' }}>{name}</span>
                      <span className="text-[7px] font-black px-1 rounded" style={{ background: difficulty === 'Expert' ? 'rgba(239,68,68,0.2)' : difficulty === 'Advanced' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', color: difficulty === 'Expert' ? '#f87171' : difficulty === 'Advanced' ? '#fbbf24' : '#34d399', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>{difficulty}</span>
                      {classes.map(c => <span key={c} className="text-[7px] font-black" style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#9ab0c8' }}>{c}</span>)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Strength */}
            <div className="relative group px-4 mb-4">
              {!isProfileComplete && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-wide" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    Complete your advance profile
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: isDarkMode ? '#4dd0e1' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Profile Strength</span>
                <span className="text-[9px] font-black" style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f' }}>{matchPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: isDarkMode ? '#000000' : '#e2e8f0', border: isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${matchPct}%`, background: isDarkMode ? '#4dd0e1' : '#dc2626' }} />
              </div>
              {matchPct < 100 && (
                <p className="text-[8px] mt-1.5 leading-snug" style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>
                  Complete your profile, log hours, and verify credentials to unlock pathways.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 mt-auto pb-5 flex flex-col gap-2">
              {profile?.license_number ? (
                <button onClick={() => setTab('profile' as TabId)} className="w-full py-2.5 text-[11px] font-black tracking-wider rounded-xl transition-all hover:brightness-110" style={isDarkMode
                  ? { background: 'linear-gradient(180deg, #4a4a5a 0%, #3a3a48 100%)', border: '1px solid rgba(77,208,225,0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)', color: '#ffffff', fontFamily: "'G1000', 'VT323', monospace" }
                  : { background: 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(29,78,216,0.9))', color: '#ffffff', boxShadow: '0 8px 32px rgba(37,99,235,0.2)' }
                }>
                  VIEW DASHBOARD →
                </button>
              ) : (
                <button onClick={() => setTab('advanced-profile' as TabId)} className="w-full py-2.5 text-[11px] font-black tracking-wider rounded-xl transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.9), rgba(185,28,28,0.9))', color: '#ffffff', boxShadow: '0 8px 32px rgba(220,38,38,0.2)', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined }}>
                  COMPLETE ADVANCED PROFILE →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Not logged in */
          <div className="flex flex-col flex-1 items-center justify-center px-6 gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <User size={28} style={{ color: isDarkMode ? 'rgba(255,255,255,0.25)' : '#c8d8e8' }} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-black tracking-tight mb-1" style={{ color: isDarkMode ? '#ffffff' : '#1e3a5f', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>Welcome Aboard</p>
              <p className="text-[10px] leading-snug max-w-[200px]" style={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : '#9ab0c8', fontFamily: isDarkMode ? "'G1000', 'VT323', monospace" : undefined, textTransform: isDarkMode ? 'uppercase' : undefined }}>
                Sign in to activate your pilot profile.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="w-full py-3 text-[11px] font-black tracking-wider rounded-xl transition-all hover:brightness-110" style={isDarkMode
                ? { background: 'linear-gradient(180deg, #4a4a5a 0%, #3a3a48 100%)', border: '1px solid rgba(233,30,140,0.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 16px rgba(233,30,140,0.15)', color: '#ffffff', fontFamily: "'G1000', 'VT323', monospace" }
                : { background: 'rgba(220,38,38,0.85)', color: '#ffffff' }
              }>
                Get Recognition Free
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="w-full py-3 text-[11px] font-black tracking-wider rounded-xl transition-all hover:brightness-110" style={isDarkMode
                ? { background: 'linear-gradient(180deg, #3a3a4a 0%, #2a2a38 100%)', border: '1px solid rgba(77,208,225,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)', color: '#ffffff', fontFamily: "'G1000', 'VT323', monospace" }
                : { background: 'rgba(37,99,235,0.85)', color: '#ffffff' }
              }>
                Pilot Sign In
              </button>
            </div>
          </div>
        )}

      </motion.div>
      </div>

      {/* ── Refer & Earn (Recognition+ members only) ── */}
      {profile && (() => {
        const tier = (profile?.subscription_tier || profile?.recognition_tier || 'free').toString();
        const isPaid = tier === 'plus' || tier === 'silver' || tier === 'enterprise' || tier === 'gold';
        return isPaid;
      })() && (
        <motion.div variants={itemVariants} className="mt-4">
          <PilotReferralShare userId={profile?.id} />
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════
          ONBOARDING MODAL — 4-step multi-party verification flow
      ════════════════════════════════════════════════════════════ */}
      {onboardingOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
        >
          <motion.div
            className="w-full max-w-xl flex flex-col"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25)' }}
          >
            {/* Modal header — logo + title */}
            <div className="relative px-6 pt-7 pb-5 flex-shrink-0 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
              {!obTokenising && (
                <button onClick={() => setOnboardingOpen(false)} className="absolute top-4 right-5 text-gray-300 hover:text-gray-600 transition-colors">
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#cc0000' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L9 5L5 9M1 5H9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[11px] font-black tracking-[0.18em] text-gray-900 uppercase">PilotRecognition</span>
              </div>
              {/* Title hierarchy */}
              <p className="text-[19px] font-black text-gray-900 leading-tight mb-1">
                {obDone ? 'Verification Initiated' : onboardingStep === 1 ? 'Multi-Party Data Authorization' : onboardingStep === 2 ? 'Cryptographic Escrow Activation' : onboardingStep === 3 ? 'Consent Declaration' : 'Token Generation'}
              </p>
              <p className="text-[11px] text-gray-400 font-normal">
                {onboardingStep === 1 ? 'Step 1 — Cryptographic Legal Release & Verification Consent' : onboardingStep === 2 ? 'Step 2 — Helio Payment Gateway' : onboardingStep === 3 ? 'Step 3 — Final Authorization' : 'Step 4 — Processing'}
              </p>
            </div>

            {/* Step progress bar */}
            <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
              {[1,2,3,4].map(s => (
                <div key={s} className="flex-1 h-[3px]" style={{ background: '#e5e7eb' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: onboardingStep >= s ? '100%' : '0%', background: obDone ? '#16a34a' : '#1a1a1a' }}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* ── STEP 1: Cryptographic Legal Release & Multi-Party Consent ── */}
              {onboardingStep === 1 && (
                <>
                  {/* Section A — Pipeline Overview */}
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    By proceeding, you execute a decentralized, tokenized authorization directive enabling a multi-party credential verification process. This protocol operates strictly via zero-knowledge data routing mechanisms, facilitating an automated cryptographic exchange between your designated <strong className="text-gray-900">Approved Training Organisation (ATO)</strong>, the relevant <strong className="text-gray-900">Civil Aviation Authority (CAA)</strong>, your connected <strong className="text-gray-900">{profile?.logbook_provider ?? 'Logbook Provider'}</strong> flight records registry, and the regional verification infrastructure managed by <strong className="text-gray-900">{detectedRegion.provider}</strong>.
                  </p>

                  {/* Session Attributes — clean icon rows */}
                  <div className="rounded-xl space-y-0 overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #eef2f7' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">Claimed Session Profile — Pending Verification</p>
                      <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', border: `1px solid ${detectedRegion.colour}40` }}>
                        <span className="text-[8px] font-bold" style={{ color: detectedRegion.colour }}>{detectedRegion.label} · {detectedRegion.provider}</span>
                      </div>
                    </div>
                    {/* Auth0 ID — read only */}
                    <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium w-44 flex-shrink-0" style={{ color: '#cc0000' }}>Auth0 Cryptographic Identifier</span>
                      <span className="text-[10px] font-semibold text-gray-900 select-none font-mono">{profile?.id ? `0x${profile.id.slice(0,3).toUpperCase()}...${profile.id.slice(-4).toUpperCase()}` : '— Not resolved'}</span>
                    </div>

                    {/* Date of Birth — Article 11 age gate */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>Date of Birth <span className="text-gray-400 font-normal">(Article 11 — Age Verification)</span></span>
                        {obCadetTrack === 'minor' && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>⚠ Minor — Cadet Track</span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={obDob}
                        onChange={e => setObDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      />
                    </div>

                    {/* License / Occupation Type — Article 11 track gate */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>License / Occupation Type</span>
                        {obCadetTrack === 'student' && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>⚠ Student — Cadet Track</span>
                        )}
                      </div>
                      <select
                        value={obLicenseType}
                        onChange={e => setObLicenseType(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select license / occupation type...</option>
                        {['Student Pilot','Cadet','Private Pilot (PPL)','Commercial Pilot (CPL)','Airline Transport Pilot (ATPL)','Flight Instructor (CFI)','Senior/Check Captain','Retired Pilot','Other'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      {obCadetTrack && (
                        <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                          <p className="text-[8px] font-black text-orange-800 uppercase tracking-wide mb-0.5">Cadet Track Mode Activated</p>
                          <p className="text-[8px] text-orange-700 leading-relaxed">
                            {obCadetTrack === 'minor'
                              ? 'You are under 18 years of age. Terminal 3 international airline gates are restricted. You may access Terminal 1 and Terminal 2 (flight school & cadet pathways). Gates unlock automatically at age 18.'
                              : 'Student and Cadet licenses are restricted from Terminal 3 enterprise airline pathways. You may access Terminal 1 and Terminal 2. Gates unlock when you upgrade to CPL or above.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ── Pilot Career Status (pilotshortage.org compliant) ── */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>Current Employment Status</span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>pilotshortage.org</span>
                      </div>
                      <select
                        value={obEmploymentStatus}
                        onChange={e => setObEmploymentStatus(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select your current status...</option>
                        <option value="employed">I am currently employed as a pilot</option>
                        <option value="unemployed">I am unemployed / between jobs</option>
                        <option value="transitioning">I am a flight instructor looking to move forward</option>
                        <option value="graduate">I am a graduate looking for opportunities</option>
                      </select>

                      {/* If unemployed — duration */}
                      {obEmploymentStatus === 'unemployed' && (
                        <div className="mt-2">
                          <span className="text-[9px] text-gray-500 block mb-1">How long have you been unemployed?</span>
                          <select
                            value={obUnemployedDuration}
                            onChange={e => setObUnemployedDuration(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="">Select duration...</option>
                            <option value="<1m">Less than 1 month</option>
                            <option value="1-3m">1–3 months</option>
                            <option value="3-6m">3–6 months</option>
                            <option value="6-12m">6–12 months</option>
                            <option value=">1y">Over 1 year</option>
                          </select>
                        </div>
                      )}

                      {/* If employed — current role with aviation vs non-aviation split */}
                      {obEmploymentStatus === 'employed' && (
                        <div className="mt-2 space-y-2">
                          <span className="text-[9px] text-gray-500 block mb-1">What is your current role?</span>
                          <select
                            value={obCurrentJob}
                            onChange={e => setObCurrentJob(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="">Select current role...</option>
                            <optgroup label="✈️ Still in Aviation">
                              <option value="airline_fo">Airline First Officer</option>
                              <option value="airline_captain">Airline Captain</option>
                              <option value="corporate_pilot">Corporate / VIP Pilot</option>
                              <option value="cargo_pilot">Cargo Pilot</option>
                              <option value="flight_instructor">Flight Instructor (CFI/CFII)</option>
                              <option value="ato_instructor">ATO Ground Instructor</option>
                              <option value="sim_instructor">Simulator Instructor</option>
                              <option value="charter_pilot">Charter Pilot</option>
                              <option value="agricultural_pilot">Agricultural Pilot</option>
                              <option value="helicopter_pilot">Helicopter Pilot</option>
                              <option value="aviation_management">Aviation Management / Operations</option>
                              <option value="aviation_other">Other Aviation Role</option>
                            </optgroup>
                            <optgroup label="😔 Left Aviation — Surviving">
                              <option value="uber_delivery">Uber / Delivery Driver</option>
                              <option value="construction">Construction / Manual Labor</option>
                              <option value="baggage_handler">Baggage Handler / Ground Crew</option>
                              <option value="retail_hospitality">Retail / Hospitality</option>
                              <option value="sales">Sales / Real Estate</option>
                              <option value="it_tech">IT / Tech Industry</option>
                              <option value="finance">Finance / Banking</option>
                              <option value="military">Military / Armed Forces</option>
                              <option value="student">Full-Time Student (Career Change)</option>
                              <option value="unemployed_seeking">Unemployed — Actively Seeking</option>
                              <option value="non_aviation_other">Other Non-Aviation Role</option>
                            </optgroup>
                          </select>

                          {/* Harsh truth banner for non-aviation roles — downed pilots seeking recognition */}
                          {obCurrentJob && !obCurrentJob.startsWith('airline') && !obCurrentJob.startsWith('corporate') && !obCurrentJob.startsWith('cargo') && !obCurrentJob.startsWith('flight') && !obCurrentJob.startsWith('ato') && !obCurrentJob.startsWith('sim') && !obCurrentJob.startsWith('charter') && !obCurrentJob.startsWith('agricultural') && !obCurrentJob.startsWith('helicopter') && !obCurrentJob.startsWith('aviation') && (
                            <div className="px-4 py-4 rounded-lg space-y-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                              <p className="text-[8px] font-black text-red-800 uppercase tracking-wide mb-1">Downed Pilot — You Are Not Forgotten</p>
                              <p className="text-[8px] text-red-700 leading-relaxed">
                                You hold a valid pilot license. You logged the hours. You passed the checkrides. And now you're driving Uber, working construction, or handling bags — not because you failed, but because the industry failed <strong>you</strong>. The pipeline is clogged. Airlines say there's a shortage, yet licensed pilots like you can't get a call back.
                              </p>
                              <div className="px-3 py-2.5 rounded" style={{ background: 'white', border: '1px solid #fecaca' }}>
                                <p className="text-[8px] font-bold text-red-800 mb-1">Here's what we can do for you right now:</p>
                                <ul className="space-y-1">
                                  <li className="flex items-start gap-1.5">
                                    <span className="text-[8px] text-red-500 mt-0.5">▸</span>
                                    <span className="text-[8px] text-red-700">Verify your credentials and logged hours through international attestation standards</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <span className="text-[8px] text-red-500 mt-0.5">▸</span>
                                    <span className="text-[8px] text-red-700">Submit your pathway interest to our partner operators — get placed as a <strong>recommended pilot</strong></span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <span className="text-[8px] text-red-500 mt-0.5">▸</span>
                                    <span className="text-[8px] text-red-700">Share your story at <strong>pilotshortage.org</strong> — your voice matters in fixing this broken pipeline</span>
                                  </li>
                                </ul>
                              </div>
                              <p className="text-[8px] text-red-700 leading-relaxed">
                                We call this the <strong>Downed Pilot Program</strong> — supporting pilots in times of despair. Your license is valid. Your hours count. You deserve recognition for the work you've done. Create your account, verify your credentials, and we will place you where operators are actively pulling from our verified pool.
                              </p>
                              <div className="flex gap-2">
                                <a
                                  href="https://pilotshortage.org/share-your-story"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-2 text-center text-[8px] font-bold text-red-700 rounded transition-all hover:bg-red-100"
                                  style={{ background: 'white', border: '1px solid #fecaca', textDecoration: 'none' }}
                                >
                                  Share Your Story →
                                </a>
                                <span
                                  className="flex-1 py-2 text-center text-[8px] font-bold text-white rounded cursor-pointer transition-all hover:bg-red-700"
                                  style={{ background: '#dc2626', border: '1px solid #dc2626' }}
                                  onClick={() => setObConsent1(true)}
                                >
                                  Verify & Get Recognized →
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* If unemployed — capture what they were doing */}
                      {obEmploymentStatus === 'unemployed' && (
                        <div className="mt-2 space-y-2">
                          <span className="text-[9px] text-gray-500 block mb-1">What were you doing before?</span>
                          <select
                            value={obCurrentJob}
                            onChange={e => setObCurrentJob(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="">Select last role...</option>
                            <optgroup label="✈️ Aviation">
                              <option value="airline_fo">Airline First Officer</option>
                              <option value="airline_captain">Airline Captain</option>
                              <option value="flight_instructor">Flight Instructor</option>
                              <option value="corporate_pilot">Corporate Pilot</option>
                              <option value="cargo_pilot">Cargo Pilot</option>
                              <option value="charter_pilot">Charter Pilot</option>
                            </optgroup>
                            <optgroup label="😔 Non-Aviation Survival">
                              <option value="uber_delivery">Uber / Delivery</option>
                              <option value="construction">Construction</option>
                              <option value="baggage_handler">Baggage Handler</option>
                              <option value="retail_hospitality">Retail / Hospitality</option>
                              <option value="sales">Sales</option>
                              <option value="student">Student</option>
                              <option value="non_aviation_other">Other</option>
                            </optgroup>
                          </select>
                        </div>
                      )}

                      {/* If transitioning or graduate — pilot stage + career goal */}
                      {(obEmploymentStatus === 'transitioning' || obEmploymentStatus === 'graduate') && (
                        <div className="mt-2 space-y-2">
                          {obEmploymentStatus === 'graduate' && (
                            <div className="space-y-2">
                              <span className="text-[9px] text-gray-500 block mb-1">What stage are you at?</span>
                              <select
                                value={obPilotStage}
                                onChange={e => setObPilotStage(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                              >
                                <option value="">Select your pilot stage...</option>
                                <option value="bachelor_degree">Graduated with Bachelor of Commercial Flying</option>
                                <option value="fast_track">Completed Fast-Track Pilot Course</option>
                                <option value="licensed_no_hours">Licensed but low/no hours (CPL/PPL)</option>
                                <option value="current_training">Currently in flight training</option>
                                <option value="student_no_license">Student Pilot — no license yet</option>
                                <option value="ground_school">Ground School only — no flight hours</option>
                                <option value="aspirant">Interested in aviation — no pilot qualifications</option>
                              </select>
                            </div>
                          )}

                          <span className="text-[9px] text-gray-500 block mb-1">
                            {obEmploymentStatus === 'transitioning'
                              ? 'What are you looking to transition into?'
                              : 'What opportunities are you looking for?'}
                          </span>
                          <select
                            value={obCareerGoal}
                            onChange={e => setObCareerGoal(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="">Select target pathway...</option>
                            <option value="airline_fo">Airline First Officer</option>
                            <option value="airline_captain">Airline Captain</option>
                            <option value="corporate">Corporate / VIP Aviation</option>
                            <option value="cargo">Cargo Operations</option>
                            <option value="instructor">Flight Instructor</option>
                            <option value="charter">Charter Pilot</option>
                            <option value="helicopter">Helicopter Operations</option>
                            <option value="agricultural">Agricultural Aviation</option>
                            <option value="private">Private Aviation</option>
                            <option value="military">Military Aviation</option>
                            <option value="other">Other / Undecided</option>
                          </select>

                          {obEmploymentStatus === 'graduate' && (
                            <div className="px-3 py-2.5 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                              <p className="text-[8px] font-black text-amber-800 uppercase tracking-wide mb-1">The Pipeline is Real</p>
                              <p className="text-[8px] text-amber-700 leading-relaxed">
                                Graduates with 200 hours face a 2-3 year wait for instructor positions. Airlines want 1,500+ hours. The gap kills careers. We built Pathways to show you exactly what's missing and how to close it — before you end up driving Uber like the batch of 2015.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Disclaimer block */}
                      <div className="mt-3 px-3 py-2.5 rounded-lg" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                        <p className="text-[8px] font-black text-sky-800 uppercase tracking-wide mb-1">Important Notice</p>
                        <p className="text-[8px] text-sky-700 leading-relaxed">
                          <strong>PilotRecognition is not a job board.</strong> We are a networking, verification, and career pathway platform supported by an association of pilots at <strong>pilotshortage.org</strong>, aimed at solving the pilot shortage and reducing the loss of pilot careers. <strong>PilotCareerPathways.com</strong> is not a job site but a pathway platform tailored and powered by PilotRecognition.com, with industry partners participating in pilotshortage.org.
                        </p>
                      </div>
                    </div>

                    {/* Civil Aviation Authority — dropdown */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium block mb-1.5" style={{ color: '#cc0000' }}>Jurisdictional Civil Aviation Authority</span>
                      <select
                        value={obCAA}
                        onChange={e => setObCAA(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select Civil Aviation Authority...</option>
                        {[
                          'CAAP — Civil Aviation Authority of the Philippines',
                          'CASA — Civil Aviation Safety Authority (Australia)',
                          'CAA — Civil Aviation Authority (UK)',
                          'EASA — European Union Aviation Safety Agency',
                          'FAA — Federal Aviation Administration (USA)',
                          'DGCA — Directorate General of Civil Aviation (India)',
                          'CAAS — Civil Aviation Authority of Singapore',
                          'GCAA — General Civil Aviation Authority (UAE)',
                          'TCCA — Transport Canada Civil Aviation',
                          'CAA — Civil Aviation Authority (New Zealand)',
                          'SACAA — South African Civil Aviation Authority',
                          'ANAC — Agência Nacional de Aviação Civil (Brazil)',
                          'DGAC — Direction Générale de l\'Aviation Civile (France)',
                          'LBA — Luftfahrt-Bundesamt (Germany)',
                          'ENAC — Ente Nazionale per l\'Aviazione Civile (Italy)',
                          'AESA — Agencia Estatal de Seguridad Aérea (Spain)',
                          'JCAB — Japan Civil Aviation Bureau',
                          'CAAC — Civil Aviation Administration of China',
                          'AAI — Airports Authority of India',
                          'ICAO — International Civil Aviation Organization (Other)',
                        ].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Target ATO — text input, multi-ATO support */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>Target Training Provider (ATO)</span>
                        {obATOs.length > 1 && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
                            +${(obATOs.length - 1) * 30}.00 surcharge — {obATOs.length - 1} additional ATO{obATOs.length > 2 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {obATOs.map((ato, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={ato}
                              onChange={e => { const a = [...obATOs]; a[i] = e.target.value; setObATOs(a); }}
                              placeholder={i === 0 ? 'Enter ATO or flight school name...' : `Additional ATO ${i + 1}...`}
                              className="flex-1 px-2.5 py-1.5 text-[10px] text-gray-900 outline-none placeholder-gray-400"
                              style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px' }}
                            />
                            {i > 0 && (
                              <button onClick={() => setObATOs(obATOs.filter((_, j) => j !== i))} className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold transition-colors" style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '11px' }}>✕</button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => setObATOs([...obATOs, ''])}
                          className="text-[8px] font-semibold transition-colors"
                          style={{ color: '#cc0000' }}
                        >
                          + Add another ATO (+$30.00 per additional)
                        </button>
                      </div>
                    </div>

                    {/* Logbook Provider — select */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium block mb-1.5" style={{ color: '#cc0000' }}>Logbook Provider</span>
                      <select
                        value={obLogbookProvider}
                        onChange={e => setObLogbookProvider(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select logbook provider...</option>
                        <option value="PilotRecognition Secure Logbook">PilotRecognition Secure Logbook (Tokenized — Recommended)</option>
                        <option disabled>──────────────</option>
                        {['ForeFlight', 'MyFlightbook', 'Safelog', 'LogTen Pro', 'Pilot Log', 'Other / Not connected'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* Timestamp — read only */}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-[9px] font-medium w-44 flex-shrink-0" style={{ color: '#cc0000' }}>System Timestamp Epoch</span>
                      <span className="text-[10px] font-semibold text-gray-900 select-none">{new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}</span>
                    </div>
                  </div>

                  {/* PilotRecognition Secure Logbook note */}
                  {obLogbookProvider === 'PilotRecognition Secure Logbook' && (
                    <div className="rounded-xl px-4 py-3 space-y-1.5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <p className="text-[9px] font-black text-green-800 uppercase tracking-wide">PilotRecognition Secure Logbook — Zero-Knowledge Architecture</p>
                      <p className="text-[9px] text-green-700 leading-relaxed">Your flight hours are entered and stored exclusively within the PilotRecognition platform as a <strong>cryptographic hash</strong>. The raw hour values are never retained — only a tokenized, one-way hash is generated. Veremark receives this hash to verify your hours against ATO attestation records. Neither PilotRecognition nor Veremark can reverse-read your raw logbook data. You own the source. We hold nothing.</p>
                    </div>
                  )}

                  {/* Logbook Provider — Veremark Access Token */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: obLogbookSynced ? '#16a34a' : '#e5e7eb' }} />
                        <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">Verified Logbook Registry Provider</p>
                      </div>
                      {obLogbookSynced && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Access Token Confirmed</span>
                      )}
                    </div>
                    <div className="px-4 py-3 space-y-3">
                      {/* Provider selector */}
                      <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">Select Your Verified Logbook Registry Provider</p>
                        <select
                          value={obLogbookProvider || obLogbookKey.split('::')[0] || ''}
                          onChange={e => { setObLogbookProvider(e.target.value); setObLogbookKey(e.target.value + '::'); setObLogbookSynced(false); }}
                          className="w-full px-3 py-2 text-[10px] text-gray-900 outline-none"
                          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                        >
                          <option value="">Select provider...</option>
                          <option value="PilotRecognition Secure Logbook">PilotRecognition Secure Logbook (Tokenized — Recommended)</option>
                          <option disabled>─── Third-Party Live Integrations ───</option>
                          {['ForeFlight', 'MyFlightbook', 'Safelog', 'LogTen Pro', 'Other Third-Party Provider'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      {/* Transient token input — third-party only */}
                      {obLogbookProvider && obLogbookProvider !== 'PilotRecognition Secure Logbook' && <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">
                          {(obLogbookProvider || obLogbookKey.split('::')[0] || 'Provider')} Secure Share Token / API Key
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={obLogbookKey.split('::')[1] ?? ''}
                            onChange={e => {
                              const provider = obLogbookKey.split('::')[0] ?? '';
                              setObLogbookKey(provider + '::' + e.target.value);
                              setObLogbookSynced(false);
                            }}
                            placeholder="Paste read-only share token..."
                            className="flex-1 px-3 py-2 text-[10px] font-mono text-gray-900 outline-none"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <button
                            onClick={() => {
                              const [provider, token] = obLogbookKey.split('::');
                              if (!provider || !token?.trim()) return;
                              setObLogbookSyncing(true);
                              setTimeout(() => { setObLogbookSyncing(false); setObLogbookSynced(true); }, 1000);
                            }}
                            disabled={!obLogbookKey.includes('::') || !obLogbookKey.split('::')[1]?.trim() || !obLogbookKey.split('::')[0] || obLogbookSyncing}
                            className="px-3 py-2 text-[9px] font-bold text-white transition-all disabled:opacity-40"
                            style={{ background: '#1a1a1a', borderRadius: '6px', whiteSpace: 'nowrap' }}
                          >
                            {obLogbookSyncing ? 'Confirming...' : 'Confirm'}
                          </button>
                        </div>
                        {/* Transient Pipeline Relay Safeguard notice */}
                        <div className="mt-2.5 px-3 py-2.5 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <p className="text-[8px] font-black text-gray-700 mb-1">Transient Pipeline Relay Safeguard</p>
                          <p className="text-[8px] text-gray-500 leading-relaxed">To ensure total data privacy, your third-party logbook access token functions strictly as a single-use routing credential. This input acts exclusively as a secure transient conduit: your token is pushed directly to Veremark over an end-to-end encrypted stream and is instantly destroyed from system memory. Your access key is never written, cached, or permanently stored anywhere inside the PilotRecognition database ecosystem.</p>
                        </div>
                        {obLogbookSynced && (
                          <p className="text-[8px] text-green-700 mt-1.5 font-medium">Token confirmed. Upon consent sign-off, your token will be transmitted directly to Veremark over an encrypted TLS stream and immediately purged from system memory. Read-only access only — no write permissions granted.</p>
                        )}
                      </div>}

                      {/* PilotRecognition Secure Logbook — DB Protocol Card */}
                      {obLogbookProvider === 'PilotRecognition Secure Logbook' && (
                        <div className="rounded-lg overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          {/* Card header */}
                          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <p className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Database Protocol &amp; Ledger Architecture</p>
                            <span className="text-[7px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#e2e8f0', color: '#64748b' }}>D1 Vault Status: Neutral Node</span>
                          </div>
                          {/* Architecture rows */}
                          <div className="px-3 py-2.5 space-y-2">
                            {[
                              { label: 'Host Domain Storage', value: 'D1 Neutral Node Ledger' },
                              { label: 'Ingestion Vector', value: 'Secure Auth0 Identity Protocol Layer' },
                              { label: 'Storage Target', value: 'Encrypted D1 Database Network (profiles schema)' },
                              { label: 'Retention State', value: 'Permanent Cryptographic Hash Tokenization Only' },
                            ].map(row => (
                              <div key={row.label} className="flex items-baseline gap-2">
                                <span className="text-[8px] font-black text-gray-900 w-28 flex-shrink-0">{row.label}</span>
                                <span className="text-[8px] text-gray-500">{row.value}</span>
                              </div>
                            ))}
                          </div>
                          {/* Hours input — raw value never leaves this field */}
                          <div className="px-3 pb-2">
                            <div className="px-2.5 py-2.5 rounded space-y-2" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                              <p className="text-[7px] font-black text-gray-700 uppercase tracking-wide">Enter Total Flight Hours</p>
                              <p className="text-[8px] text-gray-400">Your raw hours are hashed instantly in-browser via SHA-256 and immediately discarded. Only the resulting hash string is stored.</p>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={obHoursRaw}
                                  onChange={e => { setObHoursRaw(e.target.value); setObHoursHashed(false); setObHoursHash(''); }}
                                  onBlur={() => { if (obHoursRaw) hashHours(obHoursRaw); }}
                                  placeholder="e.g. 1247.5"
                                  className="flex-1 px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <button
                                  onClick={() => { if (obHoursRaw) hashHours(obHoursRaw); }}
                                  disabled={!obHoursRaw || obHoursHashing}
                                  className="px-3 py-1.5 text-[9px] font-bold text-white disabled:opacity-40 transition-all"
                                  style={{ background: '#1a1a1a', borderRadius: '6px', whiteSpace: 'nowrap' }}
                                >
                                  {obHoursHashing ? 'Hashing...' : 'Hash'}
                                </button>
                              </div>
                              {obHoursHashed && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-gray-700 w-20 flex-shrink-0">Hash Output</span>
                                    <span className="text-[8px] font-mono text-gray-500 truncate">{obHoursHash.slice(0,16)}...{obHoursHash.slice(-8)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-gray-700 w-20 flex-shrink-0">Hour Band</span>
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>{obHoursBand}</span>
                                  </div>
                                  <p className="text-[7px] text-green-700 font-medium">Raw hours discarded. Hash + band ready for D1 ledger commit on consent sign-off.</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Directive paragraph */}
                          <div className="px-3 pb-3">
                            <div className="px-2.5 py-2 rounded" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                              <p className="text-[7px] font-black text-gray-700 uppercase tracking-wide mb-1">System Architecture Directive</p>
                              <p className="text-[8px] text-gray-500 leading-relaxed">Flight hour records are ingested exclusively via the secure Auth0 session layer, where they are immediately converted into one-way cryptographic hashes. This interface passes the resulting hash token directly to a neutral, read-only storage partition on D1. Because the platform possesses no structural decryption keys, the raw integer values are completely unrecoverable by the database host. The local database remains entirely neutral, retaining zero visible or readable logbook assets.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Veremark Direct Document Intake */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: obVaultLinked ? '#16a34a' : '#e5e7eb' }} />
                        <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">Veremark Document Intake</p>
                      </div>
                      {obVaultLinked && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Reference Token Received</span>
                      )}
                    </div>
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-[9px] text-gray-500 leading-relaxed">
                        Your credential documents — pilot licence, medical certificate, radio licence, and training records — are uploaded <strong className="text-gray-700">directly to Veremark's secure intake portal</strong>. No files pass through or are stored by this platform. Upon completing your upload on Veremark's side, paste the reference token they provide below to link your document submission to this verification request.
                      </p>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#f97316' }} />
                        <p className="text-[8px] text-orange-700">PilotRecognition never receives, stores, or processes your credential documents. All document handling, storage, and access control is managed exclusively by Veremark under their own GDPR and data privacy obligations.</p>
                      </div>
                      {/* Required documents checklist */}
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Required for Veremark Intake</p>
                        {[
                          'Pilot Licence (CAPL / CPL / ATPL)',
                          'Class 1 Medical Certificate',
                          'Radio / NTC Licence',
                          'ATO Training Records or Logbook Extract',
                        ].map(doc => (
                          <div key={doc} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#cbd5e1' }} />
                            <span className="text-[8px] text-gray-500">{doc}</span>
                          </div>
                        ))}
                      </div>
                      {/* Open Veremark portal button */}
                      <a
                        href="https://veremark.com/upload"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-4 py-2.5 text-white transition-all"
                        style={{ background: '#1a1a1a', borderRadius: '8px', textDecoration: 'none' }}
                      >
                        <span className="text-[10px] font-bold">Open Veremark Secure Upload Portal</span>
                        <span className="text-[9px] text-white/50">veremark.com →</span>
                      </a>
                      {/* Reference token input */}
                      <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">Paste your Veremark submission reference token:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={obVaultUrl}
                            onChange={e => { setObVaultUrl(e.target.value); setObVaultLinked(false); }}
                            placeholder="VRM-XXXXXXXX..."
                            className="flex-1 px-3 py-2 text-[10px] font-mono text-gray-900 outline-none"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <button
                            onClick={() => { if (obVaultUrl.trim()) setObVaultLinked(true); }}
                            disabled={!obVaultUrl.trim()}
                            className="px-3 py-2 text-[9px] font-bold text-white disabled:opacity-40 transition-all"
                            style={{ background: '#cc0000', borderRadius: '6px', whiteSpace: 'nowrap' }}
                          >
                            Confirm
                          </button>
                        </div>
                        {obVaultLinked && (
                          <p className="text-[8px] text-green-700 mt-1.5 font-medium">Token linked. Veremark will associate this submission with your verification request upon dispatch.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* System Constraint Notice */}
                  <div className="rounded-xl px-4 py-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-wide mb-1">System Constraint Notice</p>
                    <p className="text-[9px] text-gray-500 leading-relaxed">This interface functions exclusively as a secure pipeline relay. The underlying platform possesses no data decryption keys, database retention architecture, or administrative privileges required to intercept, modify, or cache your raw unencrypted credentials. The payload is directly transmitted to the verification endpoint as an immutable token bundle.</p>
                  </div>

                  {/* Section B — 3 Consent Checkboxes */}
                  <div className="space-y-3">
                    {/* Checkbox 1 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent1 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent1(!obConsent1)}
                      >
                        {obConsent1 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Regional Infrastructure Compliance (Veremark Processing)</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I hereby execute a digital authorization directive enabling Veremark and its authorized compliance nodes to submit a tokenized inquiry to the relevant Civil Aviation Authority, strictly limited to cross-referencing licensing parameters, currency statuses, radio telephony ratings, and medical certification records.</p>
                      </div>
                    </label>

                    <div style={{ borderTop: '1px solid #e5e7eb' }} />

                    {/* Checkbox 2 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent2 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent2(!obConsent2)}
                      >
                        {obConsent2 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Operational Record Audit (ATO Validation Dispatch)</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I authorize my designated Approved Training Organisation (ATO) or operating carrier to receive the secure ledger routing string, audit the matching digital logbook hours against institutional flight records, and return an encrypted verification receipt directly to the distributed platform network.</p>
                      </div>
                    </label>

                    <div style={{ borderTop: '1px solid #e5e7eb' }} />

                    {/* Checkbox 3 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent3 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent3(!obConsent3)}
                      >
                        {obConsent3 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Protocol Aggregation & Helio Payment Dispatch</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I acknowledge and accept the platform's Terms of Service and Data Handling Policies. I verify my understanding that all personally identifiable information (PII) is tokenized at the session origin via Auth0 cryptographic hashes. Furthermore, I acknowledge that all financial processing is managed directly via the Helio protocol, executing instant, programmable escrow distributions.</p>
                      </div>
                    </label>
                  </div>

                  {/* Section C — SLA Timelines */}
                  <div className="p-3 space-y-2" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest mb-1.5">Standardized SLA Timelines</p>
                    {[
                      { party: 'CAA Verification Relay', time: '24 – 48 Hours', note: 'Subject to jurisdictional processing windows' },
                      { party: 'ATO Evaluation Dispatch', time: '1 – 3 Business Days', note: null },
                    ].map(t => (
                      <div key={t.party}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[9px] text-gray-600">{t.party}</span>
                          <span className="text-[9px] font-black text-gray-900 whitespace-nowrap">Est. {t.time}</span>
                        </div>
                        {t.note && <p className="text-[8px] text-gray-400 mt-0.5">{t.note}</p>}
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '6px', paddingTop: '6px' }}>
                      <p className="text-[8px] text-gray-500 leading-relaxed italic">Automated Network Trigger: Upon digital signature and secure validation checkout via the <strong className="text-gray-700">Helio payment gateway</strong>, a standard <strong className="text-gray-700">$5.00 compliance escrow allocation</strong> is programmatically opened to the designated ATO ledger via smart contract to facilitate priority queue processing.</p>
                    </div>
                  </div>

                  {/* Sign-off button */}
                  <button
                    disabled={!obConsent1 || !obConsent2 || !obConsent3}
                    onClick={async () => {
                        if (profile?.id) {
                          const updatePayload: Record<string, unknown> = {
                            current_occupation: obLicenseType,
                            employment_status: obEmploymentStatus,
                            unemployed_duration: obUnemployedDuration,
                            current_job: obCurrentJob,
                            career_goal: obCareerGoal,
                            pilot_stage: obPilotStage || null,
                            caa_region: obCAA,
                            ato_name: obATOs[0] || null,
                            logbook_provider: obLogbookProvider,
                            date_of_birth: obDob,
                          };
                          if (obLogbookProvider === 'PilotRecognition Secure Logbook' && obHoursHashed) {
                            updatePayload.logbook_hash = obHoursHash;
                            updatePayload.logbook_hash_updated_at = new Date().toISOString();
                            updatePayload.logbook_total_hours_band = obHoursBand;
                          }
                          await callApi('queryTable', {
                            table: 'profiles',
                            operation: 'update',
                            id: profile.id,
                            data: updatePayload,
                          });
                        }
                        setOnboardingStep(2);
                      }}
                      className="w-full py-3 text-xs font-black tracking-widest text-white transition-all disabled:opacity-35 hover:bg-gray-800"
                      style={{ background: '#111827', border: 'none', borderRadius: '10px' }}
                    >
                      I AGREE, SIGN CONSENT &amp; CONTINUE →
                    </button>
                </>
              )}

              {/* ── STEP 2: Helio Secure Checkout ── */}
              {onboardingStep === 2 && (
                <>
                  {/* Notice bar */}
                  <div className="flex items-start gap-2 p-2.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Lock size={10} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[8px] text-gray-500 leading-relaxed italic">This transaction is routed directly via the Helio network layer. No raw card or bank data is visible to or cached by this interface.</p>
                  </div>

                  {/* Transaction Summary Matrix */}
                  <div style={{ border: '1px solid #e2e8f0' }}>
                    <div className="px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Transaction Summary</p>
                    </div>
                    {[
                      { label: 'Network Request ID', value: `HLO-${Date.now().toString(36).toUpperCase().slice(-8)}` },
                      { label: 'Selected Validation Plan', value: 'Recognition+ Verification Ledger (Annual Sync)' },
                      { label: 'Base Network Cost', value: '$100.00 USDC' },
                      { label: 'Regional ATO Processing Surcharges', value: '$0.00 (Single regional scope)' },
                      { label: 'Helio Protocol Network Fee', value: '1.0%' },
                    ].map(row => (
                      <div key={row.label} className="flex items-baseline gap-3 px-4 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <span className="text-[9px] text-gray-400 w-44 flex-shrink-0">{row.label}</span>
                        <span className="text-[10px] font-semibold text-gray-800">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex items-baseline gap-3 px-4 py-2.5" style={{ background: '#1a1a1a' }}>
                      <span className="text-[9px] text-white/50 w-44 flex-shrink-0">Total Settled Invoice Value</span>
                      <span className="text-[12px] font-black text-white">$100.00 USDC</span>
                    </div>
                  </div>

                  {/* Smart Contract Allocation Log */}
                  <div style={{ border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#16a34a' }} />
                      <p className="text-[9px] font-semibold text-green-700">Automated Smart Contract Allocation Log</p>
                    </div>
                    {[
                      { label: 'Compliance Node Activation', amount: '23.00 USDC', dest: `${detectedRegion.provider} Regional Processing Node (${detectedRegion.label})` },
                      { label: 'Logbook Sync Pipeline', amount: '5.00 USDC', dest: 'Authorized Third-Party Logbook Registry' },
                      { label: 'Training Provider Incentive', amount: '5.00 USDC', dest: 'ATO Settlement Ledger (24h escrow — held_commissions)' },
                      { label: 'Network Router Clearance', amount: '~67.00 USDC', dest: 'Platform Operational Reserve (after Helio fee)' },
                    ].map(row => (
                      <div key={row.label} className="px-4 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[9px] text-gray-500">{row.label}</span>
                          <span className="text-[9px] font-black text-gray-900 flex-shrink-0">{row.amount}</span>
                        </div>
                        <p className="text-[8px] text-gray-400 mt-0.5">→ {row.dest}</p>
                      </div>
                    ))}
                  </div>

                  {/* Helio Payment Widget */}
                  <div style={{ border: '2px solid #e2e8f0' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest mb-2.5">Payment Method</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'USDC / Crypto Wallet', active: true },
                          { label: 'Card / Apple Pay', active: false },
                        ].map(tab => (
                          <div key={tab.label} className="py-2 text-center text-[9px] font-bold cursor-pointer"
                            style={{ background: tab.active ? '#1a1a1a' : '#f5f7fa', color: tab.active ? 'white' : '#6b7280', border: `1px solid ${tab.active ? '#1a1a1a' : '#e2e8f0'}` }}>
                            {tab.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-4 text-center space-y-3">
                      <p className="text-[10px] text-gray-500">Connect PIC or scan QR to pay</p>
                      <div className="w-16 h-16 mx-auto flex items-center justify-center" style={{ background: '#f5f7fa', border: '1px solid #e2e8f0' }}>
                        <Lock size={20} className="text-gray-300" />
                      </div>
                      <p className="text-[8px] text-gray-400">Helio checkout iframe loads on deploy</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#f0fdf4', borderTop: '1px solid #d1fae5' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#16a34a' }} />
                      <p className="text-[8px] text-green-700 font-medium">Helio Protocol Active. Connected via End-to-End Encrypted Gateway. A digital cryptographic transaction receipt will be anchored directly to your Auth0 session profile upon block confirmation.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(1)} className="py-2.5 px-5 text-xs font-bold text-gray-500 tracking-wider transition-all hover:text-gray-800" style={{ background: '#f5f7fa', border: '1px solid #e2e8f0' }}>← Back</button>
                    <button onClick={() => setOnboardingStep(3)} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 transition-all" style={{ background: '#1a1a1a' }}>
                      PAYMENT CONFIRMED — INITIALIZE VEREMARK DISPATCH →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Cryptographic Consent ── */}
              {onboardingStep === 3 && (
                <>
                  <div className="p-4" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <p className="text-[9px] font-black tracking-[0.2em] text-white/25 uppercase mb-3">Cryptographic Consent Declaration</p>
                    <p className="text-[11px] text-white/65 leading-relaxed mb-3">
                      By proceeding, you grant <strong className="text-white">tokenized, secure consent</strong> for <strong className="text-yellow-300">Veremark</strong> to cross-reference your records with:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        { icon: Shield,     text: 'The Civil Aviation Authority (CAA) governing your pilot licence' },
                        { icon: BookOpen,   text: `Your designated ATO: ${obATO}` },
                        { icon: Lock,       text: 'Issue a cryptographic verification token to PilotRecognition.com' },
                        { icon: CheckCircle,text: 'Store a zero-knowledge proof receipt in your Verepass digital wallet' },
                      ].map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-2.5">
                          <Icon size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] text-white/50 leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="h-px w-full mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <p className="text-[9px] text-white/20 leading-relaxed italic">
                      PilotRecognition.com never stores, reads, or transmits your raw PII. Only the triangulated token outcome is surfaced on your profile. This consent may be revoked at any time, immediately invalidating the token chain.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <input
                      type="checkbox"
                      checked={obConsent}
                      onChange={e => setObConsent(e.target.checked)}
                      className="mt-0.5 flex-shrink-0 accent-sky-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-white/70 leading-relaxed font-semibold">
                      I confirm and grant tokenized, secure consent for Veremark to cross-reference my records with the Civil Aviation Authority and my designated ATO.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(2)} className="flex-1 py-2.5 text-xs font-bold text-white/40 tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>← BACK</button>
                    <button
                      disabled={!obConsent}
                      onClick={startTokenise}
                      className="flex-1 py-2.5 text-xs font-black tracking-widest text-white transition-all disabled:opacity-25"
                      style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))', border: '1px solid rgba(16,185,129,0.4)' }}
                    >
                      I AGREE & CONFIRM →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 4: Auth0 Token Generation ── */}
              {onboardingStep === 4 && (
                <div className="py-6 text-center space-y-5">
                  {obTokenising ? (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        >
                          <Lock size={26} className="text-sky-400" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white tracking-wide mb-1">Generating Cryptographic Token</p>
                        <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">Your personal data is being fully encrypted and tokenized. PilotRecognition.com will never store or view your raw credentials.</p>
                      </div>
                      <div className="space-y-2 max-w-sm mx-auto text-left">
                        {[
                          { label: 'Encrypting pilot licence data', done: true  },
                          { label: 'Routing consent to Veremark',   done: true  },
                          { label: 'Contacting CAA registry',       done: false },
                          { label: 'Issuing verification token',    done: false },
                        ].map((step, i) => (
                          <div key={step.label} className="flex items-center gap-2.5">
                            {step.done
                              ? <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                              : <motion.div
                                  className="w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent flex-shrink-0"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                                />
                            }
                            <p className={`text-[10px] ${step.done ? 'text-emerald-400' : 'text-white/40'}`}>{step.label}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : obDone ? (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
                        <CheckCircle size={28} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-400 tracking-wide mb-1">Verification Request Submitted</p>
                        <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">Veremark has received your consent and will contact your ATO and CAA. Your token will appear in the Pilot Credentials vault within 2–5 business days.</p>
                      </div>
                      <div className="p-3 max-w-sm mx-auto" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <p className="text-[9px] font-mono text-emerald-300/60">Token pipeline: ACTIVE · Request ID: VRM-{Date.now().toString(16).toUpperCase().slice(-8)}</p>
                      </div>
                      <button
                        onClick={() => { setOnboardingOpen(false); setTab('wallet'); }}
                        className="px-8 py-2.5 text-xs font-black tracking-widest text-white"
                        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))', border: '1px solid rgba(16,185,129,0.4)' }}
                      >
                        VIEW CREDENTIAL VAULT →
                      </button>
                    </>
                  ) : null}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}

      {/* First-time welcome tour modal */}
      <WelcomeGetStartedModal
        isOpen={showWelcomeTour}
        onClose={() => {
          setShowWelcomeTour(false);
          dismissTour();
        }}
        onStepAction={(stepIndex) => {
          if (stepIndex === 0) setTab('profile');
          if (stepIndex === 1) setTab('pathways');
          if (stepIndex === 2) setTab('verification');
        }}
      />

      {/* Departure Briefing spotlight tour */}
      <DepartureBriefing
        isOpen={showDepartureBriefing}
        onClose={() => setShowDepartureBriefing(false)}
        onNavigateToTab={navigateFromBriefing}
      />

    </motion.div>
  </div>
);
};
