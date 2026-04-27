'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Plane, Briefcase, Building2, Search,
  Settings, HelpCircle, LogOut, ChevronRight, Plus, Edit3,
  Trash2, Eye, EyeOff, Upload, X, Check, AlertCircle,
  Users, TrendingUp, Star, Globe, Menu, Bell, ExternalLink,
  FileText, Clock, MapPin, DollarSign, Shield, RefreshCw,
  ShieldCheck, UserCheck, UserX, ChevronDown, Download, Video, History,
  GraduationCap
} from 'lucide-react';
import { useEnterpriseAuth, supabase, FIREBASE_BASE } from './hooks/useEnterpriseAuth';
import { InterviewerDashboard } from './InterviewerDashboard';
import { InterviewHistoryPage } from './InterviewHistoryPage';
import { FlightSchoolPortal } from './FlightSchoolPortal';
import ResumeViewer from './ResumeViewer';

const LOGO = 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dridtecu6/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = 'enterprise_unsigned';

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = 'dashboard' | 'pathway-cards' | 'job-listings' | 'airline-expectations' | 'pilot-search' | 'applications' | 'analytics' | 'settings' | 'support' | 'admin' | 'interviews' | 'interview-history' | 'flight-school';

// ─── 72 Airlines List ────────────────────────────────────────────────────────
const AIRLINE_LIST = [
  'ANA All Nippon','Aegean Airlines','Aeromexico','Air Canada','Air China',
  'Air France','Air India','Air India Express','Asiana Airlines','Austrian Airlines',
  'Avianca','Biman Bangladesh','British Airways','Brussels Airlines','Cathay Dragon',
  'Cathay Pacific','Cebu Pacific','China Eastern','China Southern','Copa Airlines',
  'Czech Airlines','Delta Air Lines','EgyptAir','El Al Israel','Ethiopian Airlines',
  'Etihad Airways','Emirates','Finnair','GOL Linhas','Garuda Indonesia',
  'HK Express','Iberia','ITA Airways','Icelandair','IndiGo',
  'Japan Airlines','JetBlue Airways','Jetstar Asia','KLM','Korean Air',
  'LOT Polish','LATAM Airlines','Lufthansa','Malaysia Airlines','Nepal Airlines',
  'Norwegian','Oman Air','Peach Aviation','Philippine Airlines','Qantas',
  'Qatar Airways','Royal Jordanian','SAS Scandinavian','Saudia','Scoot',
  'Singapore Airlines','South African Airways','Southwest Airlines','SpiceJet',
  'Spring Airlines','SriLankan Airlines','Swiss International','TAP Portugal',
  'Thai Airways','Turkish Airlines','United Airlines','Vietnam Airlines',
  'Virgin Australia','WestJet','Alaska Airlines','American Airlines',
  'Other / Not listed',
].sort();

// ─── Cloudinary Upload Helper ─────────────────────────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  fd.append('folder', 'enterprise');
  const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'pathway-cards', label: 'Pathway Cards', icon: Plane },
  { id: 'job-listings', label: 'Job Listings', icon: Briefcase },
  { id: 'airline-expectations', label: 'Airline Expectations', icon: Building2 },
  { id: 'pilot-search', label: 'Pilot Search', icon: Search },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'interviews', label: 'Interviews', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'support', label: 'Contact Support', icon: HelpCircle },
] as const;

const FLIGHT_SCHOOL_NAV = { id: 'flight-school', label: 'Flight School', icon: GraduationCap };
const ADMIN_NAV = { id: 'admin', label: 'Enterprise Admin', icon: ShieldCheck };

function Sidebar({ page, setPage, account, onLogout, collapsed, setCollapsed, isManager, isFlightSchool }: {
  page: Page; setPage: (p: Page) => void;
  account: any; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  isManager: boolean;
  isFlightSchool: boolean;
}) {
  return (
    <div className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <img src={LOGO} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight truncate">Enterprise Portal</div>
            <div className="text-blue-400 text-xs truncate">{account?.airline_name || 'Your Airline'}</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-slate-500 hover:text-white transition-colors">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {isFlightSchool ? (
          <button
            key={FLIGHT_SCHOOL_NAV.id}
            onClick={() => setPage(FLIGHT_SCHOOL_NAV.id as Page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              page === FLIGHT_SCHOOL_NAV.id
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-800/20'
            }`}
          >
            <FLIGHT_SCHOOL_NAV.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{FLIGHT_SCHOOL_NAV.label}</span>}
          </button>
        ) : (
          NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id as Page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))
        )}
        {isManager && !isFlightSchool && (
          <>
            {!collapsed && <div className="px-3 pt-3 pb-1"><p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Manager</p></div>}
            <button
              onClick={() => setPage('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === 'admin'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-amber-800/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Enterprise Admin</span>}
            </button>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: any; icon: any; color: string; sub?: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
      {sub && <div className="text-slate-500 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Applications Page ───────────────────────────────────────────────────────
function ApplicationsPage({ user, account }: { user: any; account: any }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);

  const loadApplications = async () => {
    if (!account?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pilot_applications')
        .select('*')
        .eq('enterprise_account_id', account.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter by status if not 'all'
      const filtered = selectedStatus !== 'all'
        ? (data || []).filter(app => app.status === selectedStatus)
        : (data || []);
      
      setApplications(filtered);
    } catch (e) {
      console.error('Error loading applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [account?.id, selectedStatus]);

  const updateStatus = async (appId: string, newStatus: string, notes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`${FIREBASE_BASE}/updateApplicationStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus, notes }),
      });
      if (!res.ok) throw new Error('Failed to update');
      await loadApplications();
      setSelectedApp(null);
    } catch (e) {
      console.error('Error updating status:', e);
    } finally {
      setUpdating(false);
    }
  };

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shortlisted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    interview_scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    offer_made: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hired: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    withdrawn: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const statusLabels: Record<string, string> = {
    applied: 'Applied',
    shortlisted: 'Shortlisted',
    interview_scheduled: 'Interview Scheduled',
    offer_made: 'Offer Made',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };

  const pipelineStages = ['applied', 'shortlisted', 'interview_scheduled', 'offer_made', 'hired'];

  const groupedByStatus = pipelineStages.reduce((acc, status) => {
    acc[status] = applications.filter(a => a.status === status);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" /> Applications Pipeline
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage pilot applications through your hiring pipeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {pipelineStages.map(stage => (
          <div key={stage} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider">{statusLabels[stage]}</p>
            <p className="text-2xl font-bold text-white mt-1">{groupedByStatus[stage]?.length || 0}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {pipelineStages.map(stage => (
            <div key={stage} className="space-y-3">
              <div className={`px-3 py-2 rounded-lg border ${statusColors[stage]}`}>
                <p className="text-sm font-semibold">{statusLabels[stage]}</p>
                <p className="text-xs opacity-70">{groupedByStatus[stage]?.length || 0} candidates</p>
              </div>
              <div className="space-y-2">
                {groupedByStatus[stage]?.map((app: any) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setShowResumeViewer(true);
                    }}
                    className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 cursor-pointer hover:border-slate-600 transition-all"
                  >
                    <p className="text-white font-medium text-sm truncate">{app.pilot_name}</p>
                    <p className="text-slate-400 text-xs">{app.pilot_total_hours?.toLocaleString()} hrs</p>
                    {app.pilot_type_ratings?.length > 0 && (
                      <p className="text-slate-500 text-xs mt-1">{app.pilot_type_ratings.join(', ')}</p>
                    )}
                    <p className="text-slate-600 text-xs mt-2">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(!groupedByStatus[stage] || groupedByStatus[stage].length === 0) && (
                  <p className="text-slate-600 text-xs text-center py-4">No candidates</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && !showResumeViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedApp.pilot_name}</h2>
                    <p className="text-slate-400">{selectedApp.pilot_email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[selectedApp.status]}`}>
                        {statusLabels[selectedApp.status]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        PR Score: {selectedApp.pilot_pr_score}%
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-slate-500 text-xs uppercase">Total Hours</p>
                    <p className="text-lg font-semibold text-white">{selectedApp.pilot_total_hours?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-slate-500 text-xs uppercase">Nationality</p>
                    <p className="text-lg font-semibold text-white">{selectedApp.pilot_nationality || 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 col-span-2">
                    <p className="text-slate-500 text-xs uppercase">Type Ratings</p>
                    <p className="text-white">{selectedApp.pilot_type_ratings?.join(', ') || 'None listed'}</p>
                  </div>
                </div>

                {selectedApp.cover_letter && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-2">Cover Letter</p>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                  </div>
                )}

                {selectedApp.notes && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-2">Internal Notes</p>
                    <p className="text-slate-300 text-sm">{selectedApp.notes}</p>
                  </div>
                )}

                {/* Status Actions */}
                <div className="border-t border-slate-800 pt-4">
                  <p className="text-slate-500 text-xs uppercase mb-3">Move to Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {pipelineStages.filter(s => s !== selectedApp.status).map(stage => (
                      <button
                        key={stage}
                        onClick={() => updateStatus(selectedApp.id, stage)}
                        disabled={updating}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusColors[stage]} hover:opacity-80 disabled:opacity-50`}
                      >
                        Move to {statusLabels[stage]}
                      </button>
                    ))}
                    <button
                      onClick={() => updateStatus(selectedApp.id, 'rejected')}
                      disabled={updating}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:opacity-80 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Email Link */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${selectedApp.pilot_email}?subject=Re: Your Application to ${account?.airline_name}`}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Email Pilot
                    </a>
                    <button
                      onClick={() => setShowResumeViewer(true)}
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Full Resume
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Viewer Modal */}
      {selectedApp && (
        <ResumeViewer
          isOpen={showResumeViewer}
          onClose={() => {
            setShowResumeViewer(false);
            setSelectedApp(null);
          }}
          applicationId={selectedApp.id}
          enterpriseAccountId={account?.id}
        />
      )}
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage({ user, account, isFlightSchool, flightSchoolId }: { user: any; account: any; isFlightSchool?: boolean; flightSchoolId?: string }) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [referralMetrics, setReferralMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const loadAnalytics = async () => {
    if (!account?.id) return;
    setLoading(true);
    try {
      const { data: cards, error } = await supabase
        .from('enterprise_pathway_cards')
        .select('*')
        .eq('enterprise_account_id', account.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Calculate CTR and conversion rates in frontend
      const cardsWithAnalytics = (cards || []).map(card => {
        const views = card.views || 0;
        const applications = card.application_count || 0;
        const ctr = views > 0 ? (applications / views * 100).toFixed(2) : '0';
        
        return {
          ...card,
          ctr: parseFloat(ctr),
          conversion_rate: parseFloat(ctr)
        };
      });
      
      setAnalytics(cardsWithAnalytics);
    } catch (e) {
      console.error('Error loading analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralMetrics = async () => {
    if (!isFlightSchool || !flightSchoolId) return;
    try {
      const { data } = await supabase
        .from('referral_analytics')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('period_start', { ascending: false })
        .limit(30);

      if (data) {
        const aggregated = data.reduce((acc: any, curr) => {
          acc.total_referrals += curr.total_referrals || 0;
          acc.clicked_referrals += curr.clicked_referrals || 0;
          acc.sign_ups += curr.sign_ups || 0;
          acc.completed_signups += curr.completed_signups || 0;
          acc.total_commission += curr.total_commission || 0;
          acc.paid_commission += curr.paid_commission || 0;
          acc.pending_commission += curr.pending_commission || 0;
          return acc;
        }, {
          total_referrals: 0,
          clicked_referrals: 0,
          sign_ups: 0,
          completed_signups: 0,
          total_commission: 0,
          paid_commission: 0,
          pending_commission: 0
        });
        setReferralMetrics(aggregated);
      }
    } catch (e) {
      console.error('Error loading referral metrics:', e);
    }
  };

  useEffect(() => {
    loadAnalytics();
    if (isFlightSchool) {
      loadReferralMetrics();
    }
  }, [account?.id, timeRange, isFlightSchool, flightSchoolId]);

  // Calculate totals
  const totalViews = analytics.reduce((sum, card) => sum + (card.view_count || 0), 0);
  const totalApplications = analytics.reduce((sum, card) => sum + (card.application_count || 0), 0);
  const avgCTR = analytics.length > 0
    ? (analytics.reduce((sum, card) => sum + (parseFloat(card.conversion_rate) || 0), 0) / analytics.length).toFixed(2)
    : '0';

  const topPerforming = [...analytics].sort((a, b) => (b.application_count || 0) - (a.application_count || 0)).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> {isFlightSchool ? 'Referral & Performance Analytics' : 'Performance Analytics'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{isFlightSchool ? 'Track referrals, commissions, and performance' : 'Track views, applications, and conversion rates'}</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Referral Performance Metrics (Flight Schools Only) */}
      {isFlightSchool && referralMetrics && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Total Referrals</span>
            </div>
            <p className="text-3xl font-bold text-white">{referralMetrics.total_referrals}</p>
            <p className="text-slate-500 text-xs mt-1">{referralMetrics.clicked_referrals} clicked</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Sign-ups</span>
            </div>
            <p className="text-3xl font-bold text-white">{referralMetrics.sign_ups}</p>
            <p className="text-slate-500 text-xs mt-1">{referralMetrics.completed_signups} completed</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Total Commission</span>
            </div>
            <p className="text-3xl font-bold text-white">${referralMetrics.total_commission.toFixed(2)}</p>
            <p className="text-slate-500 text-xs mt-1">${referralMetrics.pending_commission.toFixed(2)} pending</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Conversion Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {referralMetrics.sign_ups > 0 ? ((referralMetrics.completed_signups / referralMetrics.sign_ups) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-slate-500 text-xs mt-1">Sign-up to complete</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400 text-sm">Total Views</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-400 text-sm">Applications</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalApplications.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400 text-sm">Avg. CTR</span>
          </div>
          <p className="text-3xl font-bold text-white">{avgCTR}%</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-slate-400 text-sm">Conversion</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(2) : '0'}%
          </p>
        </div>
      </div>

      {/* Top Performing Cards */}
      {topPerforming.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Top Performing Cards
          </h3>
          <div className="space-y-3">
            {topPerforming.map((card, i) => (
              <div key={card.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{card.title}</p>
                    <p className="text-slate-500 text-xs">
                      Published {new Date(card.published_at || card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{card.view_count || 0}</p>
                    <p className="text-slate-500 text-xs">Views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">{card.application_count || 0}</p>
                    <p className="text-slate-500 text-xs">Applications</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-semibold">{card.ctr}</p>
                    <p className="text-slate-500 text-xs">CTR</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Card Performance Details</h3>
          <button
            onClick={loadAnalytics}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : analytics.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No published cards yet. Create and publish pathway cards to see analytics.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Card Title</th>
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-center">Status</th>
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">Views</th>
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">Applications</th>
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">CTR</th>
                  <th className="pb-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analytics.map(card => (
                  <tr key={card.id} className="hover:bg-slate-800/30">
                    <td className="py-3">
                      <p className="text-white font-medium">{card.title}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(card.published_at || card.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        card.is_published
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {card.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white">{card.view_count || 0}</td>
                    <td className="py-3 text-right text-emerald-400 font-medium">{card.application_count || 0}</td>
                    <td className="py-3 text-right text-purple-400">{card.ctr}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                            style={{ width: `${Math.min(parseFloat(card.conversion_rate) || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-slate-400 text-xs">{card.conversion_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, account }: { user: any; account: any }) {
  const [stats, setStats] = useState({ cards: 0, jobs: 0, published: 0, drafts: 0 });
  const [recentCards, setRecentCards] = useState<any[]>([]);

  useEffect(() => {
    if (!account?.id) return;
    supabase.from('enterprise_pathway_cards').select('id, is_published', { count: 'exact' })
      .eq('enterprise_account_id', account.id)
      .then(({ data, count }) => {
        const published = data?.filter(c => c.is_published).length || 0;
        setStats(s => ({ ...s, cards: count || 0, published, drafts: (count || 0) - published }));
      });
    supabase.from('job_opportunities').select('id', { count: 'exact' })
      .eq('enterprise_account_id', account.id)
      .then(({ count }) => setStats(s => ({ ...s, jobs: count || 0 })));
    supabase.from('enterprise_pathway_cards').select('id, title, position_type, is_published, created_at')
      .eq('enterprise_account_id', account.id)
      .order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentCards(data || []));
  }, [account?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back{account?.airline_name ? `, ${account.airline_name}` : ''}</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your airline's presence on PilotRecognition.com</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pathway Cards" value={stats.cards} icon={Plane} color="bg-blue-600" sub={`${stats.published} published`} />
        <StatCard label="Job Listings" value={stats.jobs} icon={Briefcase} color="bg-emerald-600" sub="Active listings" />
        <StatCard label="Published" value={stats.published} icon={Eye} color="bg-violet-600" sub="Visible to pilots" />
        <StatCard label="Drafts" value={stats.drafts} icon={FileText} color="bg-amber-600" sub="Awaiting publish" />
      </div>

      {/* Insight banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Platform Insights</h3>
            <p className="text-slate-400 text-sm mt-1">
              Supabase PostgreSQL handles millions of rows — <strong className="text-white">400+ pathway cards</strong> and <strong className="text-white">1,000+ job listings</strong> are fully supported with zero performance degradation. Card images are served from Cloudinary CDN with global edge caching.
            </p>
          </div>
        </div>
      </div>

      {/* Recent cards */}
      {recentCards.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3">Recent Pathway Cards</h2>
          <div className="space-y-2">
            {recentCards.map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3">
                <Plane className="w-4 h-4 text-slate-500" />
                <span className="text-white text-sm flex-1">{c.title}</span>
                <span className="text-slate-500 text-xs">{c.position_type}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.is_published ? 'bg-emerald-600/20 text-emerald-400' : 'bg-amber-600/20 text-amber-400'}`}>
                  {c.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pathway Cards ─────────────────────────────────────────────────────────────
function PathwayCardsPage({ user, account }: { user: any; account: any }) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', subtitle: '', category: 'airline-pathways' as string, position_type: 'First Officer',
    hiring_status: 'active', is_published: false, is_featured: false,
    positions_available: 1, application_url: '', application_email: '',
    company_culture: '', benefits_summary: '', base_locations: '',
    minimum_requirements: { total_hours: 0, pic_hours: 0, license_type: 'ATPL', type_rating_required: false, medical_class: 'Class 1', icao_elp_level: '4' },
    profile_alignment: { flight_hours_weight: 30, behavioral_weight: 20, language_weight: 15, technical_skills_weight: 20, recognition_score_weight: 15, notes: '' },
    compensation: { salary_min: '', salary_max: '', currency: 'USD', per: 'month', housing: false, transport: false },
  });

  const load = async () => {
    if (!account?.id) return;
    setLoading(true);
    const { data } = await supabase.from('enterprise_pathway_cards').select('*')
      .eq('enterprise_account_id', account.id).order('created_at', { ascending: false });
    setCards(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [account?.id]);

  const openCreate = () => { setEditing(null); setForm({ ...form, title: '', subtitle: '' }); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      title: c.title || '', subtitle: c.subtitle || '', category: c.category || 'airline-pathways',
      position_type: c.position_type || 'First Officer', hiring_status: c.hiring_status || 'active',
      is_published: c.is_published || false, is_featured: c.is_featured || false,
      positions_available: c.positions_available || 1, application_url: c.application_url || '',
      application_email: c.application_email || '', company_culture: c.company_culture || '',
      benefits_summary: c.benefits_summary || '', base_locations: (c.base_locations || []).join(', '),
      minimum_requirements: c.minimum_requirements || form.minimum_requirements,
      profile_alignment: c.profile_alignment || form.profile_alignment,
      compensation: c.compensation || form.compensation,
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!user?.id) return;
    setSaving(true);
    const payload = {
      userId: user.id,
      cardData: {
        ...form,
        base_locations: form.base_locations.split(',').map((s: string) => s.trim()).filter(Boolean),
      },
    };
    if (editing) {
      await supabase.from('enterprise_pathway_cards').update({
        ...payload.cardData,
        updated_at: new Date().toISOString(),
        published_at: form.is_published && !editing.is_published ? new Date().toISOString() : editing.published_at,
      }).eq('id', editing.id);
    } else {
      await fetch(`${FIREBASE_BASE}/postEnterprisePathwayCard`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowModal(false);
    load();
  };

  const togglePublish = async (c: any) => {
    await supabase.from('enterprise_pathway_cards').update({
      is_published: !c.is_published,
      published_at: !c.is_published ? new Date().toISOString() : null,
    }).eq('id', c.id);
    load();
  };

  const deleteCard = async (id: string) => {
    if (!confirm('Delete this pathway card?')) return;
    await supabase.from('enterprise_pathway_cards').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pathway Cards</h1>
          <p className="text-slate-400 text-sm mt-1">Post full pathway cards visible to pilots on PilotRecognition.com</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all">
          <Plus className="w-4 h-4" /> New Card
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
          <Plane className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No pathway cards yet. Create your first card.</p>
          <button onClick={openCreate} className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">+ Create pathway card</button>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map(c => (
            <div key={c.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{c.title}</div>
                <div className="text-slate-500 text-xs mt-0.5">{c.position_type} · {c.category}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.hiring_status === 'active' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                {c.hiring_status}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.is_published ? 'bg-blue-600/20 text-blue-400' : 'bg-amber-600/20 text-amber-400'}`}>
                {c.is_published ? 'Published' : 'Draft'}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => togglePublish(c)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all">{c.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                <button onClick={() => deleteCard(c.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-white font-bold text-lg">{editing ? 'Edit Pathway Card' : 'New Pathway Card'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <Section title="Basic Information">
                  <Field label="Title *"><input className={INPUT} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Emirates First Officer Pathway" /></Field>
                  <Field label="Subtitle"><input className={INPUT} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Short description" /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Position Type">
                      <select className={INPUT} value={form.position_type} onChange={e => setForm(f => ({ ...f, position_type: e.target.value }))}>
                        {['First Officer','Captain','Flight Instructor','Pilot Cadet','Fighter Pilot','Cargo Pilot'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Category">
                      <select className={INPUT} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {['airline-pathways','cadet-programme','type-rating','cargo','private','privateSector','airtaxi-drones'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Hiring Status">
                      <select className={INPUT} value={form.hiring_status} onChange={e => setForm(f => ({ ...f, hiring_status: e.target.value }))}>
                        {['active','paused','closed','upcoming'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Positions Available"><input type="number" className={INPUT} value={form.positions_available} onChange={e => setForm(f => ({ ...f, positions_available: Number(e.target.value) }))} /></Field>
                  </div>
                </Section>

                {/* Requirements */}
                <Section title="Minimum Requirements">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Total Hours"><input type="number" className={INPUT} value={form.minimum_requirements.total_hours} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, total_hours: Number(e.target.value) } }))} /></Field>
                    <Field label="PIC Hours"><input type="number" className={INPUT} value={form.minimum_requirements.pic_hours} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, pic_hours: Number(e.target.value) } }))} /></Field>
                    <Field label="License Type"><select className={INPUT} value={form.minimum_requirements.license_type} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, license_type: e.target.value } }))}>
                      {['ATPL','CPL','PPL','MPL','LAPL'].map(l => <option key={l}>{l}</option>)}
                    </select></Field>
                    <Field label="ICAO ELP Level"><select className={INPUT} value={form.minimum_requirements.icao_elp_level} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, icao_elp_level: e.target.value } }))}>
                      {['4','5','6'].map(l => <option key={l}>Level {l}</option>)}
                    </select></Field>
                    <Field label="Medical Class"><select className={INPUT} value={form.minimum_requirements.medical_class} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, medical_class: e.target.value } }))}>
                      {['Class 1','Class 2','Class 3'].map(m => <option key={m}>{m}</option>)}
                    </select></Field>
                    <Field label="Type Rating Required">
                      <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={form.minimum_requirements.type_rating_required} onChange={e => setForm(f => ({ ...f, minimum_requirements: { ...f.minimum_requirements, type_rating_required: e.target.checked } }))} />
                        <span className="text-slate-400 text-sm">Yes, type rating required</span>
                      </div>
                    </Field>
                  </div>
                </Section>

                {/* Profile Alignment */}
                <Section title="Profile Alignment Weights (must total 100)">
                  <p className="text-slate-500 text-xs mb-3">Configure how the Recognition Formula weights each factor when matching pilots to this pathway.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'flight_hours_weight', label: 'Flight Hours' },
                      { key: 'behavioral_weight', label: 'Behavioral' },
                      { key: 'language_weight', label: 'Language' },
                      { key: 'technical_skills_weight', label: 'Technical Skills' },
                      { key: 'recognition_score_weight', label: 'Recognition Score' },
                    ].map(({ key, label }) => (
                      <Field key={key} label={`${label} %`}>
                        <input type="number" min="0" max="100" className={INPUT}
                          value={(form.profile_alignment as any)[key]}
                          onChange={e => setForm(f => ({ ...f, profile_alignment: { ...f.profile_alignment, [key]: Number(e.target.value) } }))} />
                      </Field>
                    ))}
                  </div>
                  <Field label="Alignment Notes"><textarea className={`${INPUT} h-16 resize-none`} value={form.profile_alignment.notes} onChange={e => setForm(f => ({ ...f, profile_alignment: { ...f.profile_alignment, notes: e.target.value } }))} placeholder="e.g. We prioritize Type A CRM candidates" /></Field>
                </Section>

                {/* Compensation */}
                <Section title="Compensation">
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Min Salary"><input type="number" className={INPUT} value={form.compensation.salary_min} onChange={e => setForm(f => ({ ...f, compensation: { ...f.compensation, salary_min: e.target.value } }))} /></Field>
                    <Field label="Max Salary"><input type="number" className={INPUT} value={form.compensation.salary_max} onChange={e => setForm(f => ({ ...f, compensation: { ...f.compensation, salary_max: e.target.value } }))} /></Field>
                    <Field label="Currency"><select className={INPUT} value={form.compensation.currency} onChange={e => setForm(f => ({ ...f, compensation: { ...f.compensation, currency: e.target.value } }))}>
                      {['USD','EUR','GBP','AED','SGD','AUD','CAD'].map(c => <option key={c}>{c}</option>)}
                    </select></Field>
                  </div>
                  <div className="flex items-center gap-4">
                    {[{key:'housing',label:'Housing Provided'},{key:'transport',label:'Transport Provided'}].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={(form.compensation as any)[key]} onChange={e => setForm(f => ({ ...f, compensation: { ...f.compensation, [key]: e.target.checked } }))} />
                        <span className="text-slate-400 text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </Section>

                {/* Application */}
                <Section title="Application Details">
                  <Field label="Application URL"><input className={INPUT} value={form.application_url} onChange={e => setForm(f => ({ ...f, application_url: e.target.value }))} placeholder="https://..." /></Field>
                  <Field label="Application Email"><input className={INPUT} value={form.application_email} onChange={e => setForm(f => ({ ...f, application_email: e.target.value }))} placeholder="careers@airline.com" /></Field>
                  <Field label="Base Locations (comma separated)"><input className={INPUT} value={form.base_locations} onChange={e => setForm(f => ({ ...f, base_locations: e.target.value }))} placeholder="Dubai, Colombo, Singapore" /></Field>
                  <Field label="Benefits Summary"><textarea className={`${INPUT} h-20 resize-none`} value={form.benefits_summary} onChange={e => setForm(f => ({ ...f, benefits_summary: e.target.value }))} /></Field>
                  <Field label="Company Culture"><textarea className={`${INPUT} h-20 resize-none`} value={form.company_culture} onChange={e => setForm(f => ({ ...f, company_culture: e.target.value }))} /></Field>
                </Section>

                {/* Visibility */}
                <Section title="Visibility">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                      <span className="text-slate-300 text-sm">Publish immediately</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-yellow-500" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                      <span className="text-slate-300 text-sm">Feature this card</span>
                    </label>
                  </div>
                </Section>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={save} disabled={saving || !form.title} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editing ? 'Save Changes' : 'Create Card'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Job Listings ─────────────────────────────────────────────────────────────
function JobListingsPage({ user, account }: { user: any; account: any }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: '', location: '', job_type: 'Full-time', category: 'airline-pathways',
    description: '', flight_hours_required: 0, pic_hours_required: 0,
    type_rating_required: false, license_required: 'ATPL', icao_elp_level: '4',
    medical_class_required: 'Class 1', visa_sponsorship: false,
    salary_min: '', salary_max: '', salary_currency: 'USD',
    application_url: '', positions_available: 1,
  });

  const load = async () => {
    if (!account?.id) return;
    setLoading(true);
    const { data } = await supabase.from('job_opportunities').select('*')
      .eq('enterprise_account_id', account.id).order('posting_date', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [account?.id]);

  const save = async () => {
    if (!user?.id) return;
    setSaving(true);
    if (editing) {
      await supabase.from('job_opportunities').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await fetch(`${FIREBASE_BASE}/postEnterpriseJobListing`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, jobData: form }),
      });
    }
    setSaving(false);
    setShowModal(false);
    load();
  };

  const toggleActive = async (j: any) => {
    await supabase.from('job_opportunities').update({ is_active: !j.is_active, status: !j.is_active ? 'active' : 'closed' }).eq('id', j.id);
    load();
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job listing?')) return;
    await supabase.from('job_opportunities').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Listings</h1>
          <p className="text-slate-400 text-sm mt-1">Post and manage pilot job opportunities</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all">
          <Plus className="w-4 h-4" /> Post Job
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No job listings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{j.title}</div>
                <div className="text-slate-500 text-xs mt-0.5">{j.location} · {j.flight_hours_required}h required</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${j.is_active ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                {j.is_active ? 'Active' : 'Closed'}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(j); setForm({ ...form, ...j }); setShowModal(true); }} className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggleActive(j)} className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-all">{j.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                <button onClick={() => deleteJob(j.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-white font-bold text-lg">{editing ? 'Edit Job Listing' : 'Post Job Listing'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Field label="Job Title *"><input className={INPUT} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="First Officer – B737" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Location"><input className={INPUT} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Dubai, UAE" /></Field>
                  <Field label="Job Type"><select className={INPUT} value={form.job_type} onChange={e => setForm(f => ({ ...f, job_type: e.target.value }))}>
                    {['Full-time','Part-time','Contract','Wet Lease'].map(t => <option key={t}>{t}</option>)}
                  </select></Field>
                </div>
                <Field label="Description"><textarea className={`${INPUT} h-24 resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Total Hours Required"><input type="number" className={INPUT} value={form.flight_hours_required} onChange={e => setForm(f => ({ ...f, flight_hours_required: Number(e.target.value) }))} /></Field>
                  <Field label="PIC Hours"><input type="number" className={INPUT} value={form.pic_hours_required} onChange={e => setForm(f => ({ ...f, pic_hours_required: Number(e.target.value) }))} /></Field>
                  <Field label="License Required"><select className={INPUT} value={form.license_required} onChange={e => setForm(f => ({ ...f, license_required: e.target.value }))}>
                    {['ATPL','CPL','MPL','PPL'].map(l => <option key={l}>{l}</option>)}
                  </select></Field>
                  <Field label="ICAO ELP Level"><select className={INPUT} value={form.icao_elp_level} onChange={e => setForm(f => ({ ...f, icao_elp_level: e.target.value }))}>
                    {['4','5','6'].map(l => <option key={l}>Level {l}</option>)}
                  </select></Field>
                  <Field label="Min Salary"><input type="number" className={INPUT} value={form.salary_min} onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} /></Field>
                  <Field label="Max Salary"><input type="number" className={INPUT} value={form.salary_max} onChange={e => setForm(f => ({ ...f, salary_max: e.target.value }))} /></Field>
                </div>
                <Field label="Application URL"><input className={INPUT} value={form.application_url} onChange={e => setForm(f => ({ ...f, application_url: e.target.value }))} placeholder="https://careers.airline.com" /></Field>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={form.visa_sponsorship} onChange={e => setForm(f => ({ ...f, visa_sponsorship: e.target.checked }))} />
                    <span className="text-slate-300 text-sm">Visa Sponsorship</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={form.type_rating_required} onChange={e => setForm(f => ({ ...f, type_rating_required: e.target.checked }))} />
                    <span className="text-slate-300 text-sm">Type Rating Required</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={save} disabled={saving || !form.title} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editing ? 'Save Changes' : 'Post Job'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Airline Expectations ──────────────────────────────────────────────────────
function AirlineExpectationsPage({ user, account }: { user: any; account: any }) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company_description: '', airline_website: '', airline_logo_url: '',
    pilot_expectations: { min_hours: 0, pic_hours: 0, type_ratings: '', icao_level: '4', medical_class: 'Class 1', age_limit: '', preferred_nationalities: '' },
    minimum_requirements: { total_hours: 0, pic_hours: 0, license_type: 'ATPL' },
    benefits_compensation: { base_salary: '', housing: false, transport: false, health_insurance: false, notes: '' },
    recruitment_process: { stages: '', typical_timeline: '', assessment_info: '' },
    contact_information: { hr_email: '', hr_phone: '', careers_url: '' },
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!account?.id) return;
    supabase.from('airline_expectations').select('*').eq('enterprise_account_id', account.id).single()
      .then(({ data }) => {
        if (data) {
          setRecord(data);
          setForm(f => ({
            ...f,
            company_description: data.company_description || '',
            airline_website: data.airline_website || '',
            airline_logo_url: data.airline_logo_url || '',
            pilot_expectations: data.pilot_expectations || f.pilot_expectations,
            minimum_requirements: data.minimum_requirements || f.minimum_requirements,
            benefits_compensation: data.benefits_compensation || f.benefits_compensation,
            recruitment_process: data.recruitment_process || f.recruitment_process,
            contact_information: data.contact_information || f.contact_information,
          }));
        }
        setLoading(false);
      });
  }, [account?.id]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, airline_logo_url: url }));
    } catch (err) { alert('Upload failed'); }
    setUploading(false);
  };

  const save = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      if (record?.id) {
        // Update existing record
        const { error } = await supabase
          .from('airline_expectations')
          .update({ ...form, airline_name: account?.airline_name })
          .eq('id', record.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('airline_expectations')
          .insert([{ 
            ...form, 
            airline_name: account?.airline_name,
            enterprise_account_id: account?.id 
          }]);
        
        if (error) throw error;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Error saving expectations:', e);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Airline Expectations</h1>
          <p className="text-slate-400 text-sm mt-1">Update the accurate requirements and culture for <strong className="text-white">{account?.airline_name}</strong> only.</p>
        </div>
        <button onClick={save} disabled={saving} className={`flex items-center gap-2 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'} disabled:opacity-50`}>
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-amber-600/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-300 text-sm">You can only update the expectations record for <strong>{account?.airline_name}</strong>. Changes to other airlines' records are not permitted.</p>
      </div>

      <div className="space-y-5">
        {/* Logo */}
        <Section title="Airline Branding">
          <div className="flex items-center gap-4">
            {form.airline_logo_url && <img src={form.airline_logo_url} alt="Logo" className="w-16 h-16 object-contain bg-slate-800 rounded-xl border border-slate-700" />}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all">
              {uploading ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Logo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
          <Field label="Website"><input className={INPUT} value={form.airline_website} onChange={e => setForm(f => ({ ...f, airline_website: e.target.value }))} placeholder="https://..." /></Field>
          <Field label="Company Description"><textarea className={`${INPUT} h-24 resize-none`} value={form.company_description} onChange={e => setForm(f => ({ ...f, company_description: e.target.value }))} /></Field>
        </Section>

        <Section title="Pilot Requirements">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum Total Hours"><input type="number" className={INPUT} value={form.pilot_expectations.min_hours} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, min_hours: Number(e.target.value) } }))} /></Field>
            <Field label="PIC Hours"><input type="number" className={INPUT} value={form.pilot_expectations.pic_hours} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, pic_hours: Number(e.target.value) } }))} /></Field>
            <Field label="ICAO ELP Level"><select className={INPUT} value={form.pilot_expectations.icao_level} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, icao_level: e.target.value } }))}>
              {['4','5','6'].map(l => <option key={l}>Level {l}</option>)}
            </select></Field>
            <Field label="Medical Class"><select className={INPUT} value={form.pilot_expectations.medical_class} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, medical_class: e.target.value } }))}>
              {['Class 1','Class 2','Class 3'].map(m => <option key={m}>{m}</option>)}
            </select></Field>
          </div>
          <Field label="Accepted Type Ratings (comma separated)"><input className={INPUT} value={form.pilot_expectations.type_ratings} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, type_ratings: e.target.value } }))} placeholder="B737, A320, B787" /></Field>
          <Field label="Preferred Nationalities (comma separated)"><input className={INPUT} value={form.pilot_expectations.preferred_nationalities} onChange={e => setForm(f => ({ ...f, pilot_expectations: { ...f.pilot_expectations, preferred_nationalities: e.target.value } }))} placeholder="Any, or specific nationalities" /></Field>
        </Section>

        <Section title="Recruitment Process">
          <Field label="Stages (e.g. CV Review → Assessment → Sim Check)"><input className={INPUT} value={form.recruitment_process.stages} onChange={e => setForm(f => ({ ...f, recruitment_process: { ...f.recruitment_process, stages: e.target.value } }))} /></Field>
          <Field label="Typical Timeline"><input className={INPUT} value={form.recruitment_process.typical_timeline} onChange={e => setForm(f => ({ ...f, recruitment_process: { ...f.recruitment_process, typical_timeline: e.target.value } }))} placeholder="e.g. 6-8 weeks" /></Field>
          <Field label="Assessment Info"><textarea className={`${INPUT} h-20 resize-none`} value={form.recruitment_process.assessment_info} onChange={e => setForm(f => ({ ...f, recruitment_process: { ...f.recruitment_process, assessment_info: e.target.value } }))} /></Field>
        </Section>

        <Section title="Contact Information">
          <div className="grid grid-cols-2 gap-3">
            <Field label="HR Email"><input className={INPUT} value={form.contact_information.hr_email} onChange={e => setForm(f => ({ ...f, contact_information: { ...f.contact_information, hr_email: e.target.value } }))} placeholder="hr@airline.com" /></Field>
            <Field label="HR Phone"><input className={INPUT} value={form.contact_information.hr_phone} onChange={e => setForm(f => ({ ...f, contact_information: { ...f.contact_information, hr_phone: e.target.value } }))} /></Field>
          </div>
          <Field label="Careers URL"><input className={INPUT} value={form.contact_information.careers_url} onChange={e => setForm(f => ({ ...f, contact_information: { ...f.contact_information, careers_url: e.target.value } }))} placeholder="https://careers.airline.com" /></Field>
        </Section>
      </div>
    </div>
  );
}

// ─── Pilot Search ─────────────────────────────────────────────────────────────
function PilotSearchPage({ user }: { user: any }) {
  const [filters, setFilters] = useState({ minHours: '', maxHours: '', icaoLevel: '', nationality: '', typeRating: '', availabilityStatus: '', licenseType: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!user?.id) return;
    setLoading(true);
    setSearched(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Apply filters
      if (filters.nationality) query = query.eq('nationality', filters.nationality);
      if (filters.licenseType) query = query.ilike('ratings', `%${filters.licenseType}%`);
      if (filters.minHours) query = query.gte('total_flight_hours', parseFloat(filters.minHours));
      if (filters.icaoLevel) query = query.eq('language_icao_level', filters.icaoLevel);
      if (filters.availabilityStatus) query = query.eq('status', filters.availabilityStatus);
      
      const { data, error } = await query;
      
      if (error) throw error;
      setResults(data || []);
    } catch (e) {
      console.error('Error searching profiles:', e);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Name', 'Email', 'Nationality', 'License Country', 'License Type', 'Total Hours', 'ICAO Level', 'Type Ratings', 'Availability', 'PR Score', 'Phone'];
    const rows = results.map(p => [
      p.display_name || p.full_name || '',
      p.email || '',
      p.nationality || '',
      p.country_of_license || '',
      p.license_type || '',
      p.total_flight_hours || 0,
      p.language_icao_level || '',
      Array.isArray(p.type_ratings) ? p.type_ratings.join('; ') : '',
      p.availability_status || '',
      p.overall_recognition_score || 0,
      p.phone_number || ''
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pilots-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pilot Search</h1>
          <p className="text-slate-400 text-sm mt-1">Search pilot profiles in the PilotRecognition database by qualifications.</p>
        </div>
        {results.length > 0 && (
          <button onClick={exportCSV} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Min Flight Hours"><input type="number" className={INPUT} value={filters.minHours} onChange={e => setFilters(f => ({ ...f, minHours: e.target.value }))} placeholder="e.g. 1500" /></Field>
          <Field label="Max Flight Hours"><input type="number" className={INPUT} value={filters.maxHours} onChange={e => setFilters(f => ({ ...f, maxHours: e.target.value }))} placeholder="e.g. 10000" /></Field>
          <Field label="ICAO ELP Level"><select className={INPUT} value={filters.icaoLevel} onChange={e => setFilters(f => ({ ...f, icaoLevel: e.target.value }))}>
            <option value="">Any</option>
            {['4','5','6'].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select></Field>
          <Field label="License Type"><select className={INPUT} value={filters.licenseType} onChange={e => setFilters(f => ({ ...f, licenseType: e.target.value }))}>
            <option value="">Any</option>
            <option value="ATPL">ATPL</option>
            <option value="CPL">CPL</option>
            <option value="MPL">MPL</option>
            <option value="PPL">PPL</option>
          </select></Field>
          <Field label="Nationality (keyword)"><input className={INPUT} value={filters.nationality} onChange={e => setFilters(f => ({ ...f, nationality: e.target.value }))} placeholder="e.g. Malaysian" /></Field>
          <Field label="Type Rating (keyword)"><input className={INPUT} value={filters.typeRating} onChange={e => setFilters(f => ({ ...f, typeRating: e.target.value }))} placeholder="e.g. B737" /></Field>
          <Field label="Availability"><select className={INPUT} value={filters.availabilityStatus} onChange={e => setFilters(f => ({ ...f, availabilityStatus: e.target.value }))}>
            <option value="">Any</option>
            <option value="available">Available</option>
            <option value="considering">Considering Offers</option>
            <option value="not_looking">Not Looking</option>
          </select></Field>
        </div>
        <button onClick={search} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
          Search Pilots
        </button>
      </div>

      {searched && !loading && (
        <div>
          <p className="text-slate-400 text-sm mb-3">{results.length} pilot{results.length !== 1 ? 's' : ''} found</p>
          {results.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No pilots match these filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(p => (
                <div key={p.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                    {p.profile_image_url ? <img src={p.profile_image_url} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">{p.display_name || p.full_name || 'Pilot'}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{p.nationality} · {p.country_of_license} license · {p.license_type || 'Unknown License'}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300">{Number(p.total_flight_hours || 0).toLocaleString()}h</span>
                    <span className="bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300">ICAO {p.language_icao_level || '—'}</span>
                    {p.availability_status && (
                      <span className={`px-2.5 py-1 rounded-lg ${
                        p.availability_status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.availability_status === 'considering' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-600 text-slate-400'
                      }`}>
                        {p.availability_status === 'available' ? 'Available' : p.availability_status === 'considering' ? 'Considering' : 'Not Looking'}
                      </span>
                    )}
                    <span className="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg">Score {p.overall_recognition_score || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPage({ user, account, refreshAccount, upsertEnterpriseAccount }: { user: any; account: any; refreshAccount: () => void; upsertEnterpriseAccount: (data: any) => Promise<any> }) {
  const [form, setForm] = useState({
    airline_name: account?.airline_name || '', airline_iata_code: account?.airline_iata_code || '',
    airline_logo_url: account?.airline_logo_url || '', airline_website: account?.airline_website || '',
    company_description: account?.company_description || '', country: account?.country || '',
    account_type: account?.account_type || 'airline', base_locations: (account?.base_locations || []).join(', '),
    linked_airline: account?.linked_airline || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, airline_logo_url: url }));
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    await upsertEnterpriseAccount({ ...form, base_locations: form.base_locations.split(',').map(s => s.trim()).filter(Boolean) });
    setSaving(false);
    setSaved(true);
    refreshAccount();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your enterprise account and airline profile.</p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-4 mb-2">
          {form.airline_logo_url
            ? <img src={form.airline_logo_url} alt="Logo" className="w-16 h-16 object-contain bg-slate-900 rounded-xl border border-slate-700" />
            : <div className="w-16 h-16 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center"><Building2 className="w-6 h-6 text-slate-600" /></div>
          }
          <label className="flex items-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all">
            {uploading ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Logo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Airline Name *"><input className={INPUT} value={form.airline_name} onChange={e => setForm(f => ({ ...f, airline_name: e.target.value }))} /></Field>
          <Field label="IATA Code"><input className={INPUT} value={form.airline_iata_code} onChange={e => setForm(f => ({ ...f, airline_iata_code: e.target.value }))} placeholder="EK" /></Field>
          <Field label="Website"><input className={INPUT} value={form.airline_website} onChange={e => setForm(f => ({ ...f, airline_website: e.target.value }))} placeholder="https://..." /></Field>
          <Field label="Country"><input className={INPUT} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></Field>
          <Field label="Account Type"><select className={INPUT} value={form.account_type} onChange={e => setForm(f => ({ ...f, account_type: e.target.value }))}>
            {['airline','ato','recruiter','manufacturer','staffing'].map(t => <option key={t}>{t}</option>)}
          </select></Field>
          <Field label="Base Locations (comma separated)"><input className={INPUT} value={form.base_locations} onChange={e => setForm(f => ({ ...f, base_locations: e.target.value }))} placeholder="Dubai, Colombo" /></Field>
        </div>
        <Field label="Link to Airline Expectations (72 airlines)">
          <select className={INPUT} value={form.linked_airline} onChange={e => setForm(f => ({ ...f, linked_airline: e.target.value, airline_name: e.target.value !== 'Other / Not listed' ? e.target.value : f.airline_name }))}>
            <option value="">— Select your airline —</option>
            {AIRLINE_LIST.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <p className="text-slate-500 text-xs mt-1">Linking grants you edit access to your airline's Expectations page on PilotRecognition.com</p>
        </Field>
        <Field label="Company Description"><textarea className={`${INPUT} h-24 resize-none`} value={form.company_description} onChange={e => setForm(f => ({ ...f, company_description: e.target.value }))} /></Field>
        <button onClick={save} disabled={saving || !form.airline_name} className={`flex items-center gap-2 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all disabled:opacity-50 ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-2">Signed in as</h3>
        <p className="text-slate-400 text-sm">{user?.email}</p>
        <p className="text-slate-500 text-xs mt-1">Enterprise access: <span className="text-emerald-400 font-medium">Granted</span></p>
      </div>
    </div>
  );
}

// ─── Support ──────────────────────────────────────────────────────────────────
function SupportPage({ user, account }: { user: any; account: any }) {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!form.subject || !form.message) return;
    setSending(true);
    await fetch('https://us-central1-pilotrecognition-airline.cloudfunctions.net/enterpriseAccess', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: account?.airline_name || 'Enterprise User', email: user?.email, company: account?.airline_name || '', role: 'Enterprise User', message: `SUPPORT REQUEST\n\nSubject: ${form.subject}\n\n${form.message}` }),
    });
    setSending(false);
    setSent(true);
    setForm({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Support</h1>
        <p className="text-slate-400 text-sm mt-1">Having difficulty? Our team responds within 24 hours.</p>
      </div>

      {sent ? (
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
          <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold">Message sent!</p>
          <p className="text-slate-400 text-sm mt-1">We'll get back to you at {user?.email} within 24 hours.</p>
          <button onClick={() => setSent(false)} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Send another message</button>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 space-y-4">
          <Field label="Subject"><input className={INPUT} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Unable to publish pathway card" /></Field>
          <Field label="Message"><textarea className={`${INPUT} h-36 resize-none`} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue in detail..." /></Field>
          <button onClick={send} disabled={sending || !form.subject || !form.message} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all">
            {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HelpCircle className="w-4 h-4" />}
            Send Message
          </button>
          <p className="text-slate-500 text-xs">Or email directly: <a href="mailto:enterprise@pilotrecognition.com" className="text-blue-400">enterprise@pilotrecognition.com</a></p>
        </div>
      )}
    </div>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────
const INPUT = 'w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-semibold text-sm border-b border-slate-800 pb-2">{title}</h3>
      {children}
    </div>
  );
}

// ─── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ user }: { user: any }) {
  const [tab, setTab] = useState<'requests' | 'users'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  const loadRequests = async () => {
    const { data } = await supabase.from('enterprise_access_requests').select('*').order('created_at', { ascending: false });
    setRequests(data || []);
  };
  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, email, display_name, enterprise_access, is_enterprise_manager, created_at').eq('enterprise_access', true).order('created_at', { ascending: false });
    setUsers(data || []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadRequests(), loadUsers()]).finally(() => setLoading(false));
  }, []);

  const approveRequest = async (req: any) => {
    setActioning(req.id);
    try {
      // Grant enterprise access
      await supabase.from('profiles').update({ enterprise_access: true }).eq('email', req.email);
      await supabase.from('enterprise_access_requests').update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('id', req.id);
      await loadRequests();
      await loadUsers();
    } finally { setActioning(null); }
  };

  const rejectRequest = async (req: any) => {
    setActioning(req.id);
    try {
      await supabase.from('enterprise_access_requests').update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('id', req.id);
      await loadRequests();
    } finally { setActioning(null); }
  };

  const revokeAccess = async (u: any) => {
    if (!confirm(`Revoke enterprise access for ${u.email}?`)) return;
    setActioning(u.id);
    try {
      await supabase.from('profiles').update({ enterprise_access: false }).eq('id', u.id);
      await loadUsers();
    } finally { setActioning(null); }
  };

  const toggleManager = async (u: any) => {
    setActioning(u.id);
    try {
      await supabase.from('profiles').update({ is_enterprise_manager: !u.is_enterprise_manager }).eq('id', u.id);
      await loadUsers();
    } finally { setActioning(null); }
  };

  const statusColor = (s: string) => s === 'approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : s === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-amber-400" /> Enterprise Admin</h1>
        <p className="text-slate-400 text-sm mt-1">Manage access requests and enterprise users.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['requests', 'users'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white bg-slate-800/40'}`}>
            {t === 'requests' ? `Access Requests (${requests.length})` : `Enterprise Users (${users.length})`}
          </button>
        ))}
        <button onClick={() => { loadRequests(); loadUsers(); }} className="ml-auto text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800/40"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div> : (
        <>
          {tab === 'requests' && (
            <div className="space-y-3">
              {requests.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No requests yet.</p>}
              {requests.map(req => (
                <div key={req.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-white font-semibold">{req.full_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(req.status)}`}>{req.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{req.email} · {req.company_name}</p>
                      <p className="text-slate-500 text-xs mt-1">{req.role} · {req.country} · {req.company_size}</p>
                      {req.business_type && <p className="text-slate-400 text-xs mt-1"><strong>What they do:</strong> {req.business_type}</p>}
                      {req.partnership_interest && <p className="text-slate-400 text-xs mt-0.5"><strong>Interest:</strong> {req.partnership_interest}</p>}
                      {req.message && <p className="text-slate-500 text-xs mt-1 italic">{req.message}</p>}
                      <div className="flex gap-2 mt-1.5 flex-wrap text-xs text-slate-500">
                        {req.is_operator && <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Airline Operator</span>}
                        {req.is_manufacturer && <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Manufacturer</span>}
                        {req.is_ato && <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ATO</span>}
                        {req.is_type_rating_provider && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Type Rating</span>}
                        {req.is_airline_recruiter && <span className="bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">Recruiter</span>}
                        {req.is_staffing_firm && <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Staffing</span>}
                        {req.is_recruitment_agency && <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Recruitment Agency</span>}
                      </div>
                      <p className="text-slate-600 text-xs mt-2">{new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => approveRequest(req)} disabled={actioning === req.id} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          <UserCheck className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => rejectRequest(req)} disabled={actioning === req.id} className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          <UserX className="w-3.5 h-3.5" /> Reject
                        </button>
                        <a href={`mailto:${req.email}?subject=WingMentor Enterprise Access&body=Hi ${req.full_name},%0A%0AThank you for your interest in WingMentor Enterprise.`} className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          <Bell className="w-3.5 h-3.5" /> Email
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-3">
              {users.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No enterprise users yet.</p>}
              {users.map(u => (
                <div key={u.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">{u.display_name || u.email}</p>
                    <p className="text-slate-400 text-sm">{u.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Enterprise Active</span>
                      {u.is_enterprise_manager && <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Manager</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleManager(u)} disabled={actioning === u.id} title={u.is_enterprise_manager ? 'Remove manager' : 'Make manager'} className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-50">
                      {u.is_enterprise_manager ? 'Remove Mgr' : 'Make Mgr'}
                    </button>
                    <button onClick={() => revokeAccess(u)} disabled={actioning === u.id || u.id === user.id} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Portal App ───────────────────────────────────────────────────────────
export function EnterprisePortalApp() {
  const { user, account, loading, logout, refreshAccount, upsertEnterpriseAccount } = useEnterpriseAuth();
  const [page, setPage] = useState<Page>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isFlightSchool, setIsFlightSchool] = useState(false);
  const [flightSchoolId, setFlightSchoolId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) window.location.href = '/enterprise/login';
    if (!loading && user && !user.enterprise_access) window.location.href = '/enterprise/login';
  }, [user, loading]);

  // Check if current user is an enterprise manager
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('is_enterprise_manager').eq('id', user.id).single()
      .then(({ data }) => setIsManager(data?.is_enterprise_manager === true));
  }, [user?.id]);

  // Check if user is a flight school admin
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('flight_school_admins')
      .select('flight_school_id')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setIsFlightSchool(true);
          setFlightSchoolId(data.flight_school_id);
          setPage('flight-school');
        }
      });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !user.enterprise_access) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar page={page} setPage={setPage} account={account} onLogout={async () => { await logout(); window.location.href = '/enterprise/login'; }} collapsed={collapsed} setCollapsed={setCollapsed} isManager={isManager} isFlightSchool={isFlightSchool} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {page === 'dashboard' && <Dashboard user={user} account={account} />}
        {page === 'pathway-cards' && <PathwayCardsPage user={user} account={account} />}
        {page === 'job-listings' && <JobListingsPage user={user} account={account} />}
        {page === 'airline-expectations' && <AirlineExpectationsPage user={user} account={account} />}
        {page === 'pilot-search' && <PilotSearchPage user={user} />}
        {page === 'applications' && <ApplicationsPage user={user} account={account} />}
        {page === 'interviews' && <InterviewerDashboard user={user} account={account} />}
        {page === 'interview-history' && <InterviewHistoryPage user={user} />}
        {page === 'analytics' && <AnalyticsPage user={user} account={account} isFlightSchool={isFlightSchool} flightSchoolId={flightSchoolId || undefined} />}
        {page === 'settings' && <SettingsPage user={user} account={account} refreshAccount={refreshAccount} upsertEnterpriseAccount={upsertEnterpriseAccount} />}
        {page === 'support' && <SupportPage user={user} account={account} />}
        {page === 'admin' && isManager && <AdminPanel user={user} />}
        {page === 'flight-school' && isFlightSchool && flightSchoolId && <FlightSchoolPortal flightSchoolId={flightSchoolId} user={user} />}
      </main>
    </div>
  );
}

export default EnterprisePortalApp;
