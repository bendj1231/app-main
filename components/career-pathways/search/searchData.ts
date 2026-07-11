import type { AircraftTypeRating, Manufacturer } from '@/data/aircraft-manufacturers';
import { aircraftTypeRatings, manufacturers } from '@/data/aircraft-manufacturers';
import { DUMMY_FLIGHT_SCHOOLS, type FlightSchool } from '@/data/flight-schools';
import {
  airlines,
  type Airline,
} from '@/components/website/components/AirlineExpectationsCarousel';
import { staticTypeRatingNews, staticLatestTypeRatingChanges } from '@/services/newsService';
import type { TypeRatingNewsArticle, LatestTypeRatingChange } from '@/services/newsService';
import type { TabId } from '@/components/website/components/unified-platform/types';

export type SearchFilterId =
  | 'all'
  | 'aircraft'
  | 'airlines'
  | 'atos'
  | 'programs'
  | 'pages'
  | 'updates';

export type SearchResultType =
  | 'aircraft'
  | 'manufacturer'
  | 'airline'
  | 'ato'
  | 'program'
  | 'category'
  | 'tab'
  | 'page'
  | 'news'
  | 'action';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  image?: string;
  route: string;
  score: number;
  badge?: string;
  meta?: Record<string, unknown>;
}

export interface SearchFilter {
  id: SearchFilterId;
  label: string;
  resultTypes: SearchResultType[];
}

export const searchFilters: SearchFilter[] = [
  { id: 'all', label: 'All', resultTypes: [] },
  { id: 'aircraft', label: 'Aircraft', resultTypes: ['aircraft', 'manufacturer'] },
  { id: 'airlines', label: 'Airlines', resultTypes: ['airline'] },
  { id: 'atos', label: 'ATOs', resultTypes: ['ato'] },
  { id: 'programs', label: 'Programs', resultTypes: ['program', 'category'] },
  { id: 'pages', label: 'Pages', resultTypes: ['tab', 'page', 'action'] },
  { id: 'updates', label: 'Updates', resultTypes: ['news'] },
];

export interface QuickJumpItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

export const quickJumpItems: QuickJumpItem[] = [
  {
    id: 'type-ratings',
    title: 'Type Ratings',
    description: 'Find A320, B737, ATR, and more',
    route: '/type-ratings',
    icon: 'Award',
    color: '#ef4444',
  },
  {
    id: 'airlines',
    title: 'Airlines',
    description: 'Compare operator expectations',
    route: '/airlines',
    icon: 'Plane',
    color: '#6366f1',
  },
  {
    id: 'programs',
    title: 'ATO Programs',
    description: 'Flight schools & training centers',
    route: '/programs',
    icon: 'BookOpen',
    color: '#10b981',
  },
  {
    id: 'get-rated',
    title: 'Get Rated',
    description: 'Simulator and type-rating paths',
    route: '/get-rated',
    icon: 'Star',
    color: '#f59e0b',
  },
  {
    id: 'profile',
    title: 'Recognition',
    description: 'Build your verified pilot profile',
    route: '/profile',
    icon: 'ShieldCheck',
    color: '#8b5cf6',
  },
  {
    id: 'discover',
    title: 'Discover',
    description: 'Browse every pathway',
    route: '/discover',
    icon: 'Compass',
    color: '#06b6d4',
  },
];

export interface PlatformTab {
  id: TabId;
  label: string;
  description: string;
  icon: string;
  route: string;
}

export const platformTabs: PlatformTab[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Dashboard and overview',
    icon: 'LayoutDashboard',
    route: '/platform?tab=home',
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Your pilot profile and credentials',
    icon: 'User',
    route: '/platform?tab=profile',
  },
  {
    id: 'advanced-profile',
    label: 'Advanced Profile',
    description: 'Detailed experience and ratings',
    icon: 'UserCog',
    route: '/platform?tab=advanced-profile',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    description: 'Credentials and digital identity',
    icon: 'Wallet',
    route: '/platform?tab=wallet',
  },
  {
    id: 'logbook',
    label: 'Logbook',
    description: 'Flight hours and records',
    icon: 'BookText',
    route: '/platform?tab=logbook',
  },
  {
    id: 'pathways',
    label: 'Pathways',
    description: 'Career and training pathways',
    icon: 'Route',
    route: '/platform?tab=pathways',
  },
  {
    id: 'pathways-discovery',
    label: 'Pathways Discovery',
    description: 'Explore and match pathways',
    icon: 'Compass',
    route: '/platform?tab=pathways-discovery',
  },
  {
    id: 'pathways-directory',
    label: 'Pathways Directory',
    description: 'All available pathways',
    icon: 'Map',
    route: '/platform?tab=pathways-directory',
  },
  {
    id: 'programs',
    label: 'Programs',
    description: 'Training programs and courses',
    icon: 'BookOpen',
    route: '/platform?tab=programs',
  },
  {
    id: 'airlines',
    label: 'Airlines',
    description: 'Airline operator directory',
    icon: 'Plane',
    route: '/platform?tab=airlines',
  },
  {
    id: 'manufacturers',
    label: 'Manufacturers',
    description: 'Aircraft manufacturers',
    icon: 'Factory',
    route: '/platform?tab=manufacturers',
  },
  {
    id: 'atlas-cv',
    label: 'Atlas CV',
    description: 'Your portable aviation CV',
    icon: 'FileBadge',
    route: '/platform?tab=atlas-cv',
  },
  {
    id: 'recognition-plus',
    label: 'Recognition+',
    description: 'Verified recognition status',
    icon: 'ShieldCheck',
    route: '/platform?tab=recognition-plus',
  },
  {
    id: 'recognition-plus-tab',
    label: 'Recognition+ Tab',
    description: 'Recognition+ details',
    icon: 'ShieldCheck',
    route: '/platform?tab=recognition-plus-tab',
  },
  {
    id: 'score',
    label: 'Score',
    description: 'Pilot scoring and readiness',
    icon: 'BarChart3',
    route: '/platform?tab=score',
  },
  {
    id: 'market-intel',
    label: 'Market Intel',
    description: 'Industry market intelligence',
    icon: 'TrendingUp',
    route: '/platform?tab=market-intel',
  },
  {
    id: 'data-provenance',
    label: 'Data Provenance',
    description: 'Credential verification trail',
    icon: 'Fingerprint',
    route: '/platform?tab=data-provenance',
  },
  {
    id: 'cockpit',
    label: 'Cockpit',
    description: 'Pilot tools and resources',
    icon: 'Gauge',
    route: '/platform?tab=cockpit',
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'Credential verification',
    icon: 'CheckCircle',
    route: '/platform?tab=verification',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Aviation events and webinars',
    icon: 'Calendar',
    route: '/platform?tab=events',
  },
  {
    id: 'newsroom',
    label: 'Newsroom',
    description: 'Industry news and updates',
    icon: 'Newspaper',
    route: '/platform?tab=newsroom',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    description: 'Messages and notifications',
    icon: 'Mail',
    route: '/platform?tab=inbox',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Account and preferences',
    icon: 'Settings',
    route: '/platform?tab=settings',
  },
  {
    id: 'pilot-shortage-support',
    label: 'Pilot Shortage Support',
    description: 'Industry support programs',
    icon: 'HeartHandshake',
    route: '/platform?tab=pilot-shortage-support',
  },
  {
    id: 'foundation-welcome',
    label: 'Foundation Welcome',
    description: 'Foundation program welcome',
    icon: 'Sparkles',
    route: '/platform?tab=foundation-welcome',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Legacy dashboard view',
    icon: 'LayoutDashboard',
    route: '/platform?tab=dashboard',
  },
];

export interface PathwayPage {
  id: string;
  title: string;
  description: string;
  route: string;
  keywords: string[];
}

export const pathwayPages: PathwayPage[] = [
  {
    id: 'pathways-home',
    title: 'Pathways Home',
    description: 'Start exploring your aviation career',
    route: '/pathways',
    keywords: ['home', 'start', 'pathways', 'career'],
  },
  {
    id: 'discover',
    title: 'Discover',
    description: 'Browse every pathway and opportunity',
    route: '/discover',
    keywords: ['discover', 'explore', 'browse', 'all'],
  },
  {
    id: 'type-ratings',
    title: 'Type Rating Search',
    description: 'Search type-rating centers and aircraft',
    route: '/type-ratings',
    keywords: ['type rating', 'simulator', 'training center', 'aircraft'],
  },
  {
    id: 'airline-expectations',
    title: 'Airline Expectations',
    description: 'Compare airline requirements worldwide',
    route: '/airline-expectations',
    keywords: ['airline', 'expectations', 'requirements', 'operator'],
  },
  {
    id: 'airlines',
    title: 'Airlines & Operators',
    description: 'Explore airline and operator pathways',
    route: '/airlines',
    keywords: ['airlines', 'operators', 'cargo', 'charter'],
  },
  {
    id: 'programs',
    title: 'ATO Programs',
    description: 'Find flight schools and ATOs',
    route: '/programs',
    keywords: ['ato', 'flight school', 'program', 'training'],
  },
  {
    id: 'get-rated',
    title: 'Get Rated',
    description: 'Type-rating and simulator pathways',
    route: '/get-rated',
    keywords: ['get rated', 'rating', 'simulator'],
  },
  {
    id: 'get-started',
    title: 'Get Started',
    description: 'Funding, visas, and first steps',
    route: '/get-started',
    keywords: ['get started', 'funding', 'visa', 'beginner'],
  },
  {
    id: 'pilot-reels',
    title: 'Pilot Reels',
    description: 'Pilot stories and recognition',
    route: '/pilot-reels',
    keywords: ['reels', 'videos', 'pilots', 'stories'],
  },
  {
    id: 'profile',
    title: 'Recognition Profile',
    description: 'Build your verified pilot profile',
    route: '/profile',
    keywords: ['profile', 'cv', 'recognition', 'verification'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Directory',
    description: 'For airlines and operators',
    route: '/enterprise-directory',
    keywords: ['enterprise', 'operator', 'airline', 'directory'],
  },
  {
    id: 'my-pathways',
    title: 'My Pathways',
    description: 'Saved and submitted pathways',
    route: '/my-pathways',
    keywords: ['my pathways', 'saved', 'bookmarks', 'submitted'],
  },
];

export interface TrainingProgram {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  image: string;
  keywords: string[];
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 'foundation',
    title: 'Foundation Program',
    subtitle: 'Build core aviation knowledge',
    route: '/programs/foundation',
    image: '/images/set-08-website/Program.png',
    keywords: ['foundation', 'beginner', 'ground school'],
  },
  {
    id: 'transition',
    title: 'Transition Program',
    subtitle: 'Prepare for airline operations',
    route: '/programs/transition',
    image: '/images/set-08-website/Program.png',
    keywords: ['transition', 'airline', 'interview'],
  },
  {
    id: 'certification',
    title: 'Certification Prep',
    subtitle: 'ATPL and type-rating readiness',
    route: '/programs/certification',
    image: '/images/set-06-pathways/type.png',
    keywords: ['certification', 'atpl', 'exam', 'prep'],
  },
];

export interface SearchAction {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  keywords: string[];
}

export const searchActions: SearchAction[] = [
  {
    id: 'login',
    title: 'Login',
    subtitle: 'Sign in to your account',
    route: '/login',
    icon: 'LogIn',
    keywords: ['login', 'sign in', 'account'],
  },
  {
    id: 'create-account',
    title: 'Create Recognition Account',
    subtitle: 'Join the pilot network',
    route: '/register',
    icon: 'UserPlus',
    keywords: ['register', 'sign up', 'create account', 'join'],
  },
  {
    id: 'reset-password',
    title: 'Reset Password',
    subtitle: 'Recover your account',
    route: '/forgot-password',
    icon: 'KeyRound',
    keywords: ['reset', 'password', 'forgot'],
  },
  {
    id: 'contact',
    title: 'Contact Support',
    subtitle: 'Get help with your pathway',
    route: '/contact',
    icon: 'MessageCircle',
    keywords: ['contact', 'support', 'help'],
  },
];

export interface SearchUpdate {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  date: string;
  tag: string;
}

export const searchUpdates: SearchUpdate[] = [
  ...staticTypeRatingNews.map((article) => ({
    id: `news-${article.aircraftId}-${article.date}`,
    title: article.headline,
    subtitle: article.summary,
    route: `/type-ratings?aircraft=${article.aircraftId}`,
    date: article.date,
    tag: article.category,
  })),
  ...staticLatestTypeRatingChanges.map((change) => ({
    id: `change-${change.aircraftId}-${change.tag}`,
    title: change.headline,
    subtitle: change.summary,
    route: `/type-ratings?aircraft=${change.aircraftId}`,
    date: 'Latest',
    tag: change.tag,
  })),
];

export interface SearchDataIndex {
  aircraft: AircraftTypeRating[];
  manufacturers: Manufacturer[];
  airlines: Airline[];
  atos: FlightSchool[];
  programs: TrainingProgram[];
  pages: PathwayPage[];
  tabs: PlatformTab[];
  actions: SearchAction[];
  updates: SearchUpdate[];
  news: TypeRatingNewsArticle[];
  changes: LatestTypeRatingChange[];
  quickJump: QuickJumpItem[];
  filters: SearchFilter[];
}

export const searchDataIndex: SearchDataIndex = {
  aircraft: aircraftTypeRatings,
  manufacturers,
  airlines,
  atos: DUMMY_FLIGHT_SCHOOLS.filter((s) => s.id !== 'wingmentor-intro'),
  programs: trainingPrograms,
  pages: pathwayPages,
  tabs: platformTabs,
  actions: searchActions,
  updates: searchUpdates,
  news: staticTypeRatingNews,
  changes: staticLatestTypeRatingChanges,
  quickJump: quickJumpItems,
  filters: searchFilters,
};

export const TRENDING_SEARCHES = [
  'A320 type rating',
  'B737 MAX',
  'Emirates',
  'Alpha Aviation Group',
  'Cargo pilot',
  'ATPL prep',
];

export const SEARCH_EXAMPLES = [
  'Try "A320"',
  'Try "Emirates"',
  'Try "Alpha Aviation Group"',
  'Try "Cargo"',
  'Try "Logbook"',
];

export const resultTypeIcon: Record<string, string> = {
  aircraft: 'Plane',
  manufacturer: 'Factory',
  airline: 'Building2',
  ato: 'BookOpen',
  program: 'GraduationCap',
  category: 'Compass',
  tab: 'LayoutDashboard',
  page: 'Map',
  action: 'Zap',
  news: 'Bell',
};

export const resultTypeColor: Record<string, string> = {
  aircraft: '#6366f1',
  manufacturer: '#8b5cf6',
  airline: '#ef4444',
  ato: '#10b981',
  program: '#f59e0b',
  category: '#06b6d4',
  tab: '#3b82f6',
  page: '#64748b',
  action: '#ec4899',
  news: '#eab308',
};
