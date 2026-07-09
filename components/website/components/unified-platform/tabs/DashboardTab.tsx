import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { safeRedirect } from '@/lib/url-validator';
import { InfrastructureDashboard } from '../../InfrastructureDashboard';
import { RecognitionAIChat } from '../RecognitionAIChat';
import { LogbookHub } from '@/components/website/components/pilot-recognition/LogbookHub';
import { InteractiveProfilePreview } from '../InteractiveProfilePreview';
import { QuickAccessPathways } from '../QuickAccessPathways';
import type { TabId } from '../types';
import {
  BookOpen,
  Globe,
  User,
  Shield,
  Target,
  Zap,
  GraduationCap,
  Plane,
  Award,
  Brain,
  Clock,
  PlayCircle,
  Mail,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAirlinePathways } from '../useAirlinePathways';

const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

export interface DashboardProfile {
  last_flown?: string | null;
  last_flight_date?: string | null;
  total_flight_hours?: number | string | null;
  current_occupation?: string | null;
  license_type?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  subscription_tier?: string | null;
  recognition_tier?: string | null;
  verification_status?: string | Record<string, unknown> | null;
  role?: string | null;
}

export const DashboardTab: React.FC<{
  profile: DashboardProfile;
  onNavigate: (p: string) => void;
  setTab?: (tab: TabId) => void;
}> = ({ profile, onNavigate, setTab }) => {
  const { currentUser } = useAuth();
  const [dashTier, setDashTier] = React.useState<'free' | 'plus'>('plus');
  const dashFreeFeatures = [
    {
      icon: BookOpen,
      label: 'Digital Logbook Record',
      sub: 'Log your flight history securely on a verified network.',
    },
    {
      icon: Globe,
      label: 'Global Pathway Discovery',
      sub: 'Instantly browse international operator requirements worldwide.',
    },
    {
      icon: User,
      label: 'Basic Pilot Profile',
      sub: 'Establish your initial digital identity on the PilotRecognition platform.',
    },
  ];
  const dashPlusFeatures = [
    {
      icon: Shield,
      label: 'Automated Credential Background Check',
      sub: 'Tokenize physical licences, medical certificates, and radio telemetry ratings via an encrypted, zero-knowledge pipeline routed directly to your issuing Civil Aviation Authority.',
    },
    {
      icon: Target,
      label: 'Live Route & Fleet Requirements Audit',
      sub: 'Instantly audit your flight hours, type ratings, and currency data against live hiring metrics for Singapore Airlines and global operator pathways.',
    },
    {
      icon: Zap,
      label: 'Expedited ATO Validation Protocol',
      sub: 'Programmatically issue a $5.00 compliance validation incentive to your designated Approved Training Organisation via the Helio network to fast-track your logbook audit verification.',
    },
  ];
  const dashFeatures = dashTier === 'free' ? dashFreeFeatures : dashPlusFeatures;

  const {
    pathways,
    recommended,
    latest,
    submitted,
    loading: pathwaysLoading,
  } = useAirlinePathways(profile);
  const topMatch = !pathwaysLoading
    ? [...pathways].sort((a, b) => b.match - a.match)[0]
    : undefined;

  if (!currentUser)
    return (
      <motion.div
        className="flex w-full"
        style={{
          height: 'calc(100dvh - 108px)',
          maxHeight: 'calc(100dvh - 108px)',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* LEFT: white enterprise form */}
        <motion.div
          className="w-1/2 flex flex-col px-8 py-4 bg-white overflow-hidden"
          style={{ borderRight: '1px solid #e2e8f0' }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="text-sm font-black text-slate-900"
                style={{ fontFamily: 'Arial Black, sans-serif' }}
              >
                pilot
              </span>
              <span
                className="text-sm font-black text-red-600"
                style={{ fontFamily: 'Arial Black, sans-serif' }}
              >
                recognition
              </span>
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Pilot Portal
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              Unlock Your Digital
              <br />
              Flight Deck
            </h1>
            <p className="text-xs text-slate-800 mt-1 leading-snug">
              Authenticate or register to manage verified pilot credentials, cross-reference profile
              metrics against live operator criteria, and establish a direct connection to
              international carriers and manufacturing pipelines.
            </p>
          </div>
          <div className="flex mb-2 rounded-xl overflow-hidden border border-slate-200">
            <button
              onClick={() => setDashTier('free')}
              className="flex-1 py-2 text-center text-xs font-bold transition-all"
              style={{
                background: dashTier === 'free' ? '#f1f5f9' : 'white',
                color: dashTier === 'free' ? '#0f172a' : '#94a3b8',
              }}
            >
              Free Pilot Account
            </button>
            <button
              onClick={() => setDashTier('plus')}
              className="flex-1 py-2 text-center text-xs font-black transition-all"
              style={{
                background:
                  dashTier === 'plus'
                    ? 'linear-gradient(90deg,rgba(234,179,8,0.12),rgba(251,146,60,0.08))'
                    : 'white',
                color: dashTier === 'plus' ? '#b45309' : '#94a3b8',
                borderLeft: '1px solid #e2e8f0',
              }}
            >
              ⭐ Recognition+ Member
            </button>
          </div>
          <p
            className="text-[9px] font-black uppercase tracking-widest mb-1"
            style={{ color: dashTier === 'plus' ? '#d97706' : '#94a3b8' }}
          >
            {dashTier === 'free'
              ? 'Your Free Pilot Account Includes'
              : 'Unlocked with Recognition+'}
          </p>
          <div className="flex flex-col gap-1.5" style={{ flex: '0 0 auto' }}>
            {dashFeatures.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-2 rounded-xl border transition-all"
                style={{
                  background: dashTier === 'plus' ? '#fffbeb' : '#f8fafc',
                  borderColor: dashTier === 'plus' ? '#fde68a' : '#e2e8f0',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border"
                  style={{
                    background: dashTier === 'plus' ? '#fef3c7' : '#f1f5f9',
                    borderColor: dashTier === 'plus' ? '#fcd34d' : '#cbd5e1',
                  }}
                >
                  <Icon size={13} style={{ color: dashTier === 'plus' ? '#d97706' : '#64748b' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">{label}</p>
                  <p className="text-[10px] text-slate-500 leading-snug">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
              className="w-full py-2 text-sm font-black tracking-wide text-white transition-all hover:brightness-110 rounded-xl"
              style={{ background: '#dc2626' }}
            >
              {dashTier === 'free' ? 'Get Recognition Free' : 'Login'}
            </button>
            <button
              onClick={() => safeRedirect('/become-member')}
              className="w-full py-2 text-sm font-black tracking-wide transition-all hover:brightness-110 rounded-xl"
              style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}
            >
              {dashTier === 'free'
                ? 'Want verification? Upgrade to Recognition+ ($99/yr) →'
                : 'Join Recognition+ ($99/yr) →'}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100">
            {[
              { name: 'Auth0 Secured', dot: '#3b82f6' },
              { name: 'Helio Payments', dot: '#a855f7' },
              { name: 'Veremark Verified', dot: '#16a34a' },
            ].map(({ name, dot }, i) => (
              <React.Fragment key={name}>
                {i > 0 && <span className="text-slate-200">|</span>}
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                  <span className="text-[9px] font-bold text-slate-400">{name}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
        {/* RIGHT: blurred dashboard preview */}
        <motion.div
          className="w-1/2 relative overflow-hidden flex flex-col items-center justify-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ background: 'rgba(15,23,42,1)' }}
          >
            <div
              className="w-full h-full flex flex-col gap-2 p-3"
              style={{
                filter: 'blur(2px)',
                opacity: 0.6,
                transform: 'scale(0.82)',
                transformOrigin: 'top left',
                width: '122%',
                height: '122%',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex-1">
                  <p className="text-[9px] font-black text-white">Account Activation Required</p>
                  <p className="text-[7px] text-white/40">
                    Verify your credentials and flight logs to unlock airline pathways.
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded text-[8px] font-black text-white"
                  style={{ background: '#3b82f6' }}
                >
                  GET STARTED ›
                </div>
              </div>
              <div
                className="relative rounded overflow-hidden flex-shrink-0"
                style={{ height: '120px' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80')",
                    opacity: 0.75,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, rgba(5,10,20,0.7) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[7px] font-black"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  Profile Match: 0%
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-black text-white">MY PATHWAYS</p>
                  <p className="text-[7px] text-white/50">
                    Complete your profile to reach 100% eligibility
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0" style={{ height: '90px' }}>
                <div className="flex-1 relative rounded overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png')",
                      opacity: 0.65,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(5,10,20,0.85) 0%, transparent 60%)',
                    }}
                  />
                  <div className="absolute bottom-2 left-2">
                    <p className="text-[9px] font-black text-white">MY PROGRAMS</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div
                    className="flex-1 flex items-center gap-2 px-2 rounded"
                    style={{
                      background: 'rgba(30,41,59,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.2)' }}
                    >
                      <div className="w-2 h-2 rounded-sm" style={{ background: '#3b82f6' }} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white">DIGITAL LOGBOOK</p>
                      <p className="text-[6px] text-white/30">Log your first flight</p>
                    </div>
                  </div>
                  <div
                    className="flex-1 flex items-center gap-2 px-2 rounded"
                    style={{
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(234,179,8,0.18)' }}
                    >
                      <div className="w-2 h-2 rounded-sm" style={{ background: '#fbbf24' }} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white">PILOT CREDENTIALS</p>
                      <p className="text-[6px] text-white/30">No credentials yet</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-1">
                <div className="flex-1 relative rounded overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80')",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(5,10,20,0.9) 0%, transparent 50%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                    style={{ background: 'rgba(5,10,20,0.8)' }}
                  >
                    <p className="text-[6px] text-white/40 uppercase">Recommended</p>
                    <p className="text-[8px] font-black text-white">Type Rating Search</p>
                  </div>
                </div>
                <div className="flex-1 relative rounded overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80')",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(5,10,20,0.9) 0%, transparent 50%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                    style={{ background: 'rgba(5,10,20,0.8)' }}
                  >
                    <p className="text-[6px] text-white/40 uppercase">Explore</p>
                    <p className="text-[8px] font-black text-white">Operator Expectations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(5,10,20,0.42)', backdropFilter: 'blur(3px)' }}
          />
          <div className="relative z-10 flex flex-col items-center text-center px-8 mt-6">
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{
                background: 'linear-gradient(135deg,rgba(22,163,74,0.22),rgba(16,185,129,0.12))',
                border: '1.5px solid rgba(22,163,74,0.45)',
              }}
            >
              <Shield size={34} className="text-emerald-400" />
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-black tracking-widest whitespace-nowrap px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(22,163,74,0.85)', color: 'white' }}
              >
                Secure Pre-Flight Authorization Gateway
              </span>
            </div>
            <div className="flex flex-col gap-1.5 mb-6">
              {[
                '🔒 Identity Token Status: Standby (Awaiting Auth0 Clearance)',
                '🔒 Cryptographic Vault Status: Secure / Isolated',
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
              className="px-8 py-3 text-xs font-black tracking-widest text-white/80 transition-all hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '10px',
              }}
            >
              Existing Captains: Authenticate Credentials Here →
            </button>
          </div>
        </motion.div>
      </motion.div>
    );

  return (
    <div className="w-full min-h-[100dvh] space-y-8 px-4 md:px-6 lg:px-12 xl:px-16 pb-20 md:pb-0">
      <div className="relative hidden md:block">
        <h2 className="text-3xl font-serif text-white tracking-wide mb-2">Recognition Dashboard</h2>
        <div className="h-[2px] bg-gradient-to-r from-teal-500 to-blue-500 w-32" />
      </div>

      {/* Recognition AI Chat */}
      <RecognitionAIChat profile={profile as Record<string, unknown>} />

      {/* Quick Access Dashboard */}
      <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-black/20 p-8">
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
          <Zap size={16} className="text-amber-400" />
          <span>Quick Access</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch auto-rows-fr">
          {/* My Pathways */}
          <button
            type="button"
            onClick={() => onNavigate(`my-pathways${window.location.search}`)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
                <Plane size={20} strokeWidth={2.5} />
              </div>
              <h4 className="text-base font-black text-white mt-4 tracking-tight">My Pathways</h4>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">Matches</span>
                  <span className="font-black text-white">
                    {pathwaysLoading ? '—' : recommended.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">Top Match</span>
                  <span className="font-black text-indigo-400 text-right truncate max-w-[110px]">
                    {topMatch ? `${topMatch.name} ${topMatch.match}%` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">Submitted</span>
                  <span className="font-black text-white">
                    {pathwaysLoading ? '—' : submitted.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">
              <span>Open My Pathways</span>
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="ml-1 transform group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => setTab?.('profile' as TabId)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            {(() => {
              const completion = Math.round(
                ([
                  !!profile?.full_name,
                  !!profile?.current_occupation,
                  !!profile?.license_type,
                  !!profile?.total_flight_hours,
                  !!profile?.last_flown,
                ].filter(Boolean).length /
                  5) *
                  100
              );
              return (
                <>
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-base font-black text-white mt-4 tracking-tight">Profile</h4>

                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-400">Name</span>
                        <span className="font-black text-white truncate max-w-[110px]">
                          {profile?.display_name || profile?.full_name || 'Guest'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-400">License</span>
                        <span className="font-bold italic text-slate-500">
                          {profile?.license_type || 'Not set'}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                          <span>Completion</span>
                          <span className="text-emerald-400">{completion}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden border border-slate-700/30">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">
                    <span>View Profile</span>
                    <ArrowRight
                      size={14}
                      strokeWidth={2.5}
                      className="ml-1 transform group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </>
              );
            })()}
          </button>

          {/* Inbox */}
          <button
            type="button"
            onClick={() => setTab?.('inbox' as TabId)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            <div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
                <Mail size={20} strokeWidth={2.5} />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-slate-950">
                  3
                </span>
              </div>
              <h4 className="text-base font-black text-white mt-4 tracking-tight">Inbox</h4>

              <div className="mt-4 space-y-2 text-[11px] leading-relaxed font-medium">
                <div className="flex items-start gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <p>
                    New pathway match: <span className="text-white font-bold">Emirates</span>
                  </p>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <p>Medical cert expiring soon</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">
              <span>Open Inbox</span>
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="ml-1 transform group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </button>

          {/* Recognition+ */}
          <button
            type="button"
            onClick={() => setTab?.('recognition-plus' as TabId)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            {(() => {
              const tier = (profile?.subscription_tier || profile?.recognition_tier || 'free')
                .toString()
                .toLowerCase();
              const isMember = tier !== 'free' && tier !== 'bronze';
              const verifStatus =
                (profile?.verification_status as Record<string, unknown>)?.status ||
                (profile?.verification_status as string) ||
                'unverified';
              const manageLabel =
                tier === 'free' || tier === 'bronze' ? 'Upgrade Now' : 'Manage Plan';
              return (
                <>
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
                      <Star size={20} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-base font-black text-white mt-4 tracking-tight">
                      Recognition+
                    </h4>

                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-400">Status</span>
                        <span className="font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {isMember ? 'Active Member' : 'Free Account'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-400">Verification</span>
                        <span
                          className={`font-black ${
                            verifStatus === 'verified' ? 'text-emerald-400' : 'text-amber-500'
                          }`}
                        >
                          {verifStatus === 'verified' ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-400">Tier</span>
                        <span className="font-black text-white capitalize">{tier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">
                    <span>{manageLabel}</span>
                    <ArrowRight
                      size={14}
                      strokeWidth={2.5}
                      className="ml-1 transform group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </>
              );
            })()}
          </button>
        </div>
      </div>

      {/* Quick Access Pathways — airline logo carousel */}
      <div className="hidden md:block">
        <QuickAccessPathways
          profile={profile}
          pathways={pathways}
          recommended={recommended}
          latest={latest}
          submitted={submitted}
          loading={pathwaysLoading}
        />
      </div>

      {/* Interactive Profile Preview — glassy SaaS command centre */}
      <InteractiveProfilePreview
        profile={profile as Record<string, unknown>}
        setTab={setTab}
        onNavigate={onNavigate}
      />

      {/* Digital Logbook Hub */}
      <LogbookHub
        profile={profile}
        onNavigate={onNavigate}
        onCompleteProfile={() => setTab?.('advanced-profile' as TabId)}
      />

      {/* Admin Infrastructure Command Centre — only visible to super admin */}
      {(currentUser.email === SUPER_ADMIN_EMAIL || profile?.role === 'super_admin') && (
        <InfrastructureDashboard />
      )}

      {/* Programs */}
      <div
        className="backdrop-blur-2xl border border-white/20 p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={22} className="text-teal-400" />
          <h3 className="text-xl font-bold text-white">» PROGRAMS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: GraduationCap,
              color: 'text-purple-400',
              bg: 'bg-purple-500/20 text-purple-300',
              badge: 'Completed',
              name: 'Foundation Program',
              desc: 'Core pilot development and mentorship',
              pct: 100,
              bar: 'bg-purple-500',
            },
            {
              icon: Plane,
              color: 'text-blue-400',
              bg: 'bg-blue-500/20 text-blue-300',
              badge: 'In Progress',
              name: 'Transition Program',
              desc: 'Airline transition and industry alignment',
              pct: 65,
              bar: 'bg-blue-500',
            },
            {
              icon: Award,
              color: 'text-green-400',
              bg: 'bg-green-500/20 text-green-300',
              badge: 'Available',
              name: 'EBT Video Scoring',
              desc: 'Behavioral assessment and interview prep',
              pct: 0,
              bar: 'bg-green-500',
            },
          ].map((p) => (
            <div
              key={p.name}
              className="p-4 rounded-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                backdropFilter: 'blur(12px) saturate(1.1)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p.icon size={18} className={p.color} />
                <span className={`text-xs px-2 py-1 font-bold uppercase ${p.bg}`}>{p.badge}</span>
              </div>
              <h4 className="text-white font-bold mb-1">{p.name}</h4>
              <p className="text-slate-300 text-sm mb-3">{p.desc}</p>
              <div className="w-full bg-slate-700 h-2">
                <div className={`${p.bar} h-2`} style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examination Portal */}
      <div
        className="backdrop-blur-2xl border border-white/20 p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Brain size={22} className="text-orange-400" />
          <h3 className="text-xl font-bold text-white">» EXAMINATION PORTAL</h3>
        </div>
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            backdropFilter: 'blur(12px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <Brain size={22} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg mb-2">Certification Examinations</h4>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Complete your certification examinations to track your progress through the
                Foundational Program. Each exam unlocks new mentorship resources and advancement
                opportunities.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Timed assessments
                </span>
                <span className="flex items-center gap-1">
                  <Award size={12} /> Industry certification
                </span>
                <span className="flex items-center gap-1">
                  <Target size={12} /> Progress tracking
                </span>
              </div>
              <button
                onClick={() => {
                  safeRedirect('/examination-portal');
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <PlayCircle size={18} /> Access Examination Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
