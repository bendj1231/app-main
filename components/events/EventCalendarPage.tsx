'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, Filter, Search, ChevronRight,
  Plane, Building2, Plus, Star, ExternalLink, TrendingUp
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

export function EventCalendarPage({ user }: { user?: any }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'airshow' | 'career_fair' | 'pilot_expo'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue_city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'airshow': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'career_fair': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pilot_expo': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'conference': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'ongoing': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-400" />
            Aviation Events
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover airshows, career fairs, and pilot expos near you
          </p>
        </div>

        {/* Featured Events */}
        {events.filter(e => e.is_featured).length > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.is_featured).slice(0, 2).map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all"
                >
                  <div className="flex gap-4">
                    {event.event_image_url && (
                      <img
                        src={event.event_image_url}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.start_date)}
                      </div>
                      {event.venue_city && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <MapPin className="w-3 h-3" />
                          {event.venue_city}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="airshow">Airshows</option>
              <option value="career_fair">Career Fairs</option>
              <option value="pilot_expo">Pilot Expos</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="all">All Status</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Calendar View
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-slate-900/40 border border-slate-800/40 rounded-2xl overflow-hidden hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                {event.event_image_url && (
                  <div className="aspect-video bg-slate-950 relative">
                    <img
                      src={event.event_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type.replace(/_/g, ' ')}
                      </span>
                      {event.is_featured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <h3 className="text-white font-semibold line-clamp-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.start_date)}</span>
                      {event.end_date !== event.start_date && (
                        <span>- {formatDate(event.end_date)}</span>
                      )}
                    </div>
                    {event.venue_city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{event.venue_city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{event.current_attendees || 0} registered</span>
                      {event.max_attendees && (
                        <span>/ {event.max_attendees}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-blue-400 text-sm">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(selectedEvent.event_type)}`}>
                        {selectedEvent.event_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Image */}
                {selectedEvent.event_image_url && (
                  <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden">
                    <img
                      src={selectedEvent.event_image_url}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Calendar className="w-3 h-3" />
                      Date
                    </div>
                    <p className="text-white text-sm">
                      {formatDate(selectedEvent.start_date)}
                      {selectedEvent.end_date !== selectedEvent.start_date && (
                        <> - {formatDate(selectedEvent.end_date)}</>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Users className="w-3 h-3" />
                      Attendees
                    </div>
                    <p className="text-white text-sm">
                      {selectedEvent.current_attendees || 0}
                      {selectedEvent.max_attendees && ` / ${selectedEvent.max_attendees}`}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">About</h3>
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Location</h3>
                  <div className="space-y-1 text-sm text-slate-400">
                    {selectedEvent.venue_name && <p>{selectedEvent.venue_name}</p>}
                    {selectedEvent.venue_address && <p>{selectedEvent.venue_address}</p>}
                    {selectedEvent.venue_city && <p>{selectedEvent.venue_city}</p>}
                  </div>
                </div>

                {/* Price */}
                {selectedEvent.registration_fee > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Registration Fee</span>
                      <span className="text-white font-bold text-lg">
                        ${selectedEvent.registration_fee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                {selectedEvent.promo_code && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <p className="text-emerald-400 text-sm">
                      <strong>Promo Code:</strong> {selectedEvent.promo_code}
                    </p>
                    <p className="text-emerald-400/70 text-xs mt-1">
                      {selectedEvent.promo_discount_percentage}% discount
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedEvent.website_url && (
                    <a
                      href={selectedEvent.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-4 py-3 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Event Website
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setShowRegistration(true);
                      setSelectedEvent(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-3 transition-all"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCalendarPage;
