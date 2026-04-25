'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Link2, Users, DollarSign, TrendingUp,
  Share2, Copy, Check, X, Download, Mail, Plus, Filter,
  Calendar, ArrowUpRight, ArrowDownRight, AlertCircle,
  FileText, Settings, Bell, ChevronRight, ChevronDown,
  ExternalLink, RefreshCw
} from 'lucide-react';
import { supabase } from '../../shared/lib/supabase';
import { FlightSchoolAnalyticsDashboard } from '../../components/referral';

interface FlightSchoolPortalProps {
  flightSchoolId: string;
  user: any;
}

type Tab = 'overview' | 'referrals' | 'payouts' | 'marketing' | 'pilots' | 'settings';

export const FlightSchoolPortal: React.FC<FlightSchoolPortalProps> = ({ flightSchoolId, user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [flightSchool, setFlightSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [newReferralEmail, setNewReferralEmail] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadFlightSchoolData();
  }, [flightSchoolId]);

  const loadFlightSchoolData = async () => {
    try {
      setLoading(true);
      
      // Load flight school data
      const { data: schoolData } = await supabase
        .from('flight_schools')
        .select('*')
        .eq('id', flightSchoolId)
        .single();
      
      if (schoolData) setFlightSchool(schoolData);

      // Load referrals
      const { data: referralData } = await supabase
        .from('referrals')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (referralData) setReferrals(referralData);

      // Load payouts
      const { data: payoutData } = await supabase
        .from('payouts')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (payoutData) setPayouts(payoutData);

      // Load notifications
      const { data: notificationData } = await supabase
        .from('flight_school_notifications')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (notificationData) {
        setNotifications(notificationData);
        setUnreadNotifications(notificationData.filter(n => !n.read).length);
      }

    } catch (error) {
      console.error('Error loading flight school data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateReferralLink = (email: string) => {
    if (!flightSchool) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/ref/${flightSchool.referral_code}?email=${encodeURIComponent(email)}`;
  };

  const handleCreateReferral = async () => {
    if (!newReferralEmail || !flightSchool) return;

    try {
      const referralLink = generateReferralLink(newReferralEmail);
      
      await supabase.from('referrals').insert({
        flight_school_id: flightSchoolId,
        pilot_email: newReferralEmail,
        referral_code: flightSchool.referral_code,
        referral_link: referralLink,
        commission_amount: flightSchool.commission_rate,
        status: 'pending'
      });

      setNewReferralEmail('');
      setShowNewReferralModal(false);
      loadFlightSchoolData();
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('flight_school_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const referralLink = flightSchool 
    ? `${window.location.origin}/ref/${flightSchool.referral_code}`
    : '';

  const stats = {
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter(r => r.status === 'completed' || r.status === 'paid').length,
    pendingCommissions: referrals
      .filter(r => r.commission_status === 'eligible' || r.commission_status === 'pending')
      .reduce((sum, r) => sum + parseFloat(r.commission_amount), 0),
    paidCommissions: payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            {flightSchool?.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Flight School Partnership Portal</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-slate-400 hover:text-white relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-sm p-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer ${!notification.read ? 'bg-slate-800/30' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{notification.title}</p>
                            <p className="text-slate-400 text-xs mt-1">{notification.message}</p>
                            <p className="text-slate-500 text-xs mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={loadFlightSchoolData}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Referrals"
          value={stats.totalReferrals}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          label="Completed"
          value={stats.completedReferrals}
          icon={Check}
          color="bg-emerald-600"
        />
        <StatCard
          label="Pending Commission"
          value={`$${stats.pendingCommissions.toFixed(2)}`}
          icon={DollarSign}
          color="bg-amber-600"
        />
        <StatCard
          label="Total Paid"
          value={`$${stats.paidCommissions.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-purple-600"
        />
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Your Referral Link
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 text-sm"
          />
          <button
            onClick={() => copyToClipboard(referralLink, 'link')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'link' ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => window.open(referralLink, '_blank')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Test
          </button>
        </div>
        <p className="text-slate-400 text-xs mt-2">
          Share this link with pilots. You'll earn ${flightSchool?.commission_rate || 20} for each pilot who completes the program.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'referrals', label: 'Referrals', icon: Users },
            { id: 'payouts', label: 'Payouts', icon: DollarSign },
            { id: 'marketing', label: 'Marketing', icon: Share2 },
            { id: 'pilots', label: 'Pilots', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <FlightSchoolAnalyticsDashboard flightSchoolId={flightSchoolId} />
          </motion.div>
        )}

        {activeTab === 'referrals' && (
          <motion.div
            key="referrals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Referral Tracking</h2>
              <button
                onClick={() => setShowNewReferralModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Referral
              </button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Pilot Email</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Status</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Commission</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {referrals.map(referral => (
                    <tr key={referral.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-white">{referral.pilot_email}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="py-3 px-4 text-emerald-400">
                        ${parseFloat(referral.commission_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No referrals yet. Share your referral link to start tracking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'payouts' && (
          <motion.div
            key="payouts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Payout History</h2>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Amount</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Status</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Method</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payouts.map(payout => (
                    <tr key={payout.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-white font-semibold">
                        ${parseFloat(payout.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <PayoutStatusBadge status={payout.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-300 capitalize">
                        {payout.payout_method || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No payouts yet. Commissions will be paid when pilots complete the program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'marketing' && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white">Marketing Materials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketingCard
                title="Email Template"
                description="Pre-written email to send to pilots"
                icon={Mail}
                action="Copy Template"
                onAction={() => copyToClipboard(getEmailTemplate(flightSchool), 'email')}
                copied={copied === 'email'}
              />
              <MarketingCard
                title="Social Media Post"
                description="Social media copy for LinkedIn/Twitter"
                icon={Share2}
                action="Copy Post"
                onAction={() => copyToClipboard(getSocialMediaPost(flightSchool), 'social')}
                copied={copied === 'social'}
              />
              <MarketingCard
                title="QR Code"
                description="Download QR code for print materials"
                icon={Download}
                action="Generate QR"
                onAction={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`, '_blank')}
              />
              <MarketingCard
                title="Referral Card"
                description="Printable referral card template"
                icon={FileText}
                action="Download PDF"
                onAction={() => alert('PDF download coming soon')}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'pilots' && (
          <motion.div
            key="pilots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Referred Pilots</h2>
              <div className="flex gap-2">
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Pilot Name</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Email</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Status</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Progress</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Commission</th>
                    <th className="pb-3 px-4 text-slate-400 text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {referrals.map(referral => (
                    <tr key={referral.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-white">{referral.pilot_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-300">{referral.pilot_email}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              referral.status === 'completed' || referral.status === 'paid'
                                ? 'bg-emerald-500'
                                : referral.status === 'signed_up'
                                ? 'bg-amber-500'
                                : 'bg-slate-500'
                            }`}
                            style={{
                              width: referral.status === 'completed' || referral.status === 'paid'
                                ? '100%'
                                : referral.status === 'signed_up'
                                ? '50%'
                                : '10%'
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-emerald-400">
                        ${parseFloat(referral.commission_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`mailto:${referral.pilot_email}`, '_blank')}
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(generateReferralLink(referral.pilot_email), 'pilot-link')}
                            className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                          >
                            {copied === 'pilot-link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No pilots referred yet. Share your referral link to start tracking pilots.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pilot Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Total Referred</p>
                <p className="text-2xl font-bold text-white mt-1">{referrals.length}</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Active Pilots</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {referrals.filter(r => r.status === 'signed_up' || r.status === 'completed' || r.status === 'paid').length}
                </p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Completed Program</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {referrals.filter(r => r.status === 'completed' || r.status === 'paid').length}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Settings</h2>
            
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Commission Rate ($ per pilot)</label>
                <input
                  type="number"
                  value={flightSchool?.commission_rate || 20}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300"
                />
                <p className="text-slate-500 text-xs mt-1">Contact support to change commission rate</p>
              </div>
              
              <div>
                <label className="block text-slate-400 text-sm mb-2">Payout Method</label>
                <input
                  type="text"
                  value={flightSchool?.payout_method || 'Not set'}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm">
                  Contact Support to Change Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Referral Modal */}
      <AnimatePresence>
        {showNewReferralModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewReferralModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Referral</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Pilot Email</label>
                  <input
                    type="email"
                    value={newReferralEmail}
                    onChange={e => setNewReferralEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="pilot@example.com"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateReferral}
                    disabled={!newReferralEmail}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                  >
                    Create Referral
                  </button>
                  <button
                    onClick={() => setShowNewReferralModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: any;
  color: string;
}> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-slate-400 text-sm">{label}</div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    clicked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    signed_up: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    paid: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};

const PayoutStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};

const MarketingCard: React.FC<{
  title: string;
  description: string;
  icon: any;
  action: string;
  onAction: () => void;
  copied?: boolean;
}> = ({ title, description, icon: Icon, action, onAction, copied }) => (
  <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <button
        onClick={onAction}
        className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : action}
      </button>
    </div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

const getEmailTemplate = (school: any) => `
Subject: Join PilotRecognition.com - Exclusive Invitation

Hi [Pilot Name],

I'm writing to personally invite you to join PilotRecognition.com, the leading platform for pilot career advancement.

As a valued student of ${school?.name || 'our flight school'}, you'll get exclusive access to:
- Verified Pilot Recognition Database
- Career pathway matching with top airlines
- Interview preparation tools
- Mentorship programs

Use my exclusive referral link to sign up: ${window.location.origin}/ref/${school?.referral_code}

This platform has helped hundreds of pilots land their dream jobs with major airlines. I'd love to see you succeed too.

Best regards,
${school?.contact_name || 'Your Flight School'}
`;

const getSocialMediaPost = (school: any) => `
🚀 Exciting news for pilots!

I'm thrilled to share PilotRecognition.com with my network. This platform is transforming how pilots connect with airline opportunities.

✅ Verified pilot recognition database
✅ Career pathway matching
✅ Interview preparation
✅ Direct airline connections

Join through my referral link: ${window.location.origin}/ref/${school?.referral_code}

#Aviation #PilotCareers #FlightTraining
`;
