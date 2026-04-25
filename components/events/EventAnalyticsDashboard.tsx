'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, DollarSign, Calendar,
  CheckCircle, ArrowUpRight, ArrowDownRight, Filter,
  Download, RefreshCw, Plane, Building2, Star, MapPin
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

export function EventAnalyticsDashboard({ user, account }: { user?: any; account?: any }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalCheckIns: 0,
    totalRevenue: 0,
    averageAttendance: 0,
    conversionRate: 0,
    topEvent: null as any,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId || events.length > 0) {
      loadAnalytics();
    }
  }, [selectedEventId, events, timeRange]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let query = supabase.from('events').select('*');
      
      // Filter by organizer or enterprise
      if (user?.id) {
        query = query.or(`organizer_id.eq.${user.id},enterprise_account_id.in.(select id from enterprise_accounts where profile_id.eq.${user.id})`);
      }
      
      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const eventId = selectedEventId || (events.length > 0 ? events[0].id : null);
      if (!eventId) return;

      // Load event with registrations
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          event_registrations (
            id,
            payment_status,
            payment_amount,
            checked_in,
            promo_code_used
          )
        `)
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      const registrations = eventData.event_registrations || [];
      const checkIns = registrations.filter(r => r.checked_in).length;
      const revenue = registrations.reduce((sum: number, r: any) => sum + (r.payment_amount || 0), 0);
      const conversionRate = eventData.views_count > 0 
        ? (registrations.length / eventData.views_count) * 100 
        : 0;

      const averageAttendance = eventData.max_attendees > 0 
        ? (checkIns / eventData.max_attendees) * 100 
        : 0;

      setAnalytics({
        totalEvents: events.length,
        totalRegistrations: registrations.length,
        totalCheckIns: checkIns,
        totalRevenue: revenue,
        averageAttendance,
        conversionRate,
        topEvent: eventData,
      });
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Event Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track event performance and ROI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAnalytics}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-2 text-sm transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Event Selector */}
      <div className="flex items-center gap-4">
        <select
          value={selectedEventId || ''}
          onChange={(e) => setSelectedEventId(e.target.value || null)}
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 min-w-[300px]"
        >
          <option value="">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} - {new Date(event.start_date).toLocaleDateString()}
            </option>
          ))}
        </select>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalEvents}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Registrations</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalRegistrations}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Check-Ins</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalCheckIns}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">${analytics.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Conversion Rate</h2>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">{analytics.conversionRate.toFixed(1)}%</p>
          <p className="text-slate-400 text-sm">
            Registrations / Views
          </p>
        </div>
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Attendance Rate</h2>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">{analytics.averageAttendance.toFixed(1)}%</p>
          <p className="text-slate-400 text-sm">
            Check-Ins / Capacity
          </p>
        </div>
      </div>

      {/* Top Performing Event */}
      {analytics.topEvent && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Top Performing Event
          </h2>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              {analytics.topEvent.event_image_url && (
                <img
                  src={analytics.topEvent.event_image_url}
                  alt={analytics.topEvent.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">{analytics.topEvent.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Registrations</p>
                    <p className="text-white">{analytics.totalRegistrations}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Check-Ins</p>
                    <p className="text-white">{analytics.totalCheckIns}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Revenue</p>
                    <p className="text-white">${analytics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Location</p>
                    <p className="text-white">{analytics.topEvent.venue_city || 'Virtual'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Event Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase">
                <th className="pb-3">Event</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Registrations</th>
                <th className="pb-3">Check-Ins</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {events.map(event => (
                <tr key={event.id} className="border-t border-slate-800">
                  <td className="py-3 text-white font-medium">{event.title}</td>
                  <td className="py-3 text-slate-400 capitalize">{event.event_type.replace(/_/g, ' ')}</td>
                  <td className="py-3 text-slate-400">
                    {new Date(event.start_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-white">{event.current_attendees || 0}</td>
                  <td className="py-3 text-white">{event.checkins_count || 0}</td>
                  <td className="py-3 text-white">
                    ${event.registration_fee ? ((event.current_attendees || 0) * event.registration_fee).toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400' :
                      event.status === 'ongoing' ? 'bg-emerald-500/20 text-emerald-400' :
                      event.status === 'completed' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promo Code Performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Promo Code Performance</h2>
        <div className="space-y-3">
          {events.filter(e => e.promo_code).map(event => (
            <div key={event.id} className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 px-3 py-1.5 rounded-lg">
                  <code className="text-emerald-400 text-sm font-mono">{event.promo_code}</code>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{event.title}</p>
                  <p className="text-slate-500 text-xs">{event.promo_discount_percentage}% discount</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">{event.promo_uses_count || 0} uses</p>
                <p className="text-slate-500 text-xs">
                  {event.promo_max_uses ? `/ ${event.promo_max_uses}` : 'unlimited'}
                </p>
              </div>
            </div>
          ))}
          {events.filter(e => e.promo_code).length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">No promo codes used yet</p>
          )}
        </div>
      </div>

      {/* ROI Insights */}
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">ROI Insights</h4>
            <p className="text-slate-400 text-xs">
              Track event performance to measure the return on investment from physical presence at aviation events.
              High check-in rates and promo code usage indicate effective event engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventAnalyticsDashboard;
