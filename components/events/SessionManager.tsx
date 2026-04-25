'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Plus, X, Edit2, Trash2,
  Mic, Video, Users as UsersIcon, ChevronUp, ChevronDown,
  Save, Search, Filter, CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface SessionManagerProps {
  eventId: string;
  eventTitle: string;
  user?: any;
  onClose?: () => void;
}

interface Session {
  id: string;
  event_id: string;
  title: string;
  description: string;
  session_type: string;
  status: string;
  session_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  room: string;
  virtual_session_url: string;
  speaker_id: string;
  speaker_name: string;
  speaker_bio: string;
  speaker_image_url: string;
  speaker_title: string;
  speaker_organization: string;
  max_attendees: number;
  current_attendees: number;
  requires_registration: boolean;
  views_count: number;
  sort_order: number;
}

export function SessionManager({ eventId, eventTitle, user, onClose }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'presentation' | 'workshop' | 'panel' | 'networking'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    session_type: 'presentation',
    session_date: '',
    start_time: '09:00',
    end_time: '10:00',
    timezone: 'UTC',
    room: '',
    virtual_session_url: '',
    speaker_name: '',
    speaker_bio: '',
    speaker_image_url: '',
    speaker_title: '',
    speaker_organization: '',
    max_attendees: 100,
    requires_registration: false,
    sort_order: 0,
  });

  useEffect(() => {
    loadSessions();
  }, [eventId]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.session_date) {
      setError('Please fill in required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const sessionData = {
        event_id: eventId,
        title: formData.title,
        description: formData.description,
        session_type: formData.session_type,
        session_date: formData.session_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        timezone: formData.timezone,
        room: formData.room,
        virtual_session_url: formData.virtual_session_url || null,
        speaker_name: formData.speaker_name,
        speaker_bio: formData.speaker_bio,
        speaker_image_url: formData.speaker_image_url,
        speaker_title: formData.speaker_title,
        speaker_organization: formData.speaker_organization,
        max_attendees: formData.max_attendees,
        requires_registration: formData.requires_registration,
        sort_order: formData.sort_order,
        status: 'scheduled',
      };

      if (editingSession) {
        const { error } = await supabase
          .from('event_sessions')
          .update(sessionData)
          .eq('id', editingSession.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_sessions')
          .insert(sessionData);

        if (error) throw error;
      }

      await loadSessions();
      setShowForm(false);
      setEditingSession(null);
      resetForm();
    } catch (err) {
      console.error('Error saving session:', err);
      setError('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const { error } = await supabase
        .from('event_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      await loadSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session');
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      session_type: session.session_type,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
      timezone: session.timezone,
      room: session.room,
      virtual_session_url: session.virtual_session_url,
      speaker_name: session.speaker_name,
      speaker_bio: session.speaker_bio,
      speaker_image_url: session.speaker_image_url,
      speaker_title: session.speaker_title,
      speaker_organization: session.speaker_organization,
      max_attendees: session.max_attendees,
      requires_registration: session.requires_registration,
      sort_order: session.sort_order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      session_type: 'presentation',
      session_date: '',
      start_time: '09:00',
      end_time: '10:00',
      timezone: 'UTC',
      room: '',
      virtual_session_url: '',
      speaker_name: '',
      speaker_bio: '',
      speaker_image_url: '',
      speaker_title: '',
      speaker_organization: '',
      max_attendees: 100,
      requires_registration: false,
      sort_order: sessions.length,
    });
  };

  const updateStatus = async (sessionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('event_sessions')
        .update({ status: newStatus })
        .eq('id', sessionId);

      if (error) throw error;
      await loadSessions();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.speaker_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || session.session_type === filterType;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'workshop': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'panel': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'networking': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Event Sessions
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingSession(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Session
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {editingSession ? 'Edit Session' : 'Add Session'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingSession(null);
                        resetForm();
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Session Title *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Session title"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Session Type *</label>
                        <select
                          value={formData.session_type}
                          onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="presentation">Presentation</option>
                          <option value="workshop">Workshop</option>
                          <option value="panel">Panel Discussion</option>
                          <option value="networking">Networking</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Session description..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Date *</label>
                        <input
                          type="date"
                          value={formData.session_date}
                          onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Start Time *</label>
                        <input
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">End Time *</label>
                        <input
                          type="time"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Room</label>
                        <input
                          type="text"
                          value={formData.room}
                          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Room name or number"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Max Attendees</label>
                        <input
                          type="number"
                          value={formData.max_attendees}
                          onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Virtual Session URL</label>
                      <input
                        type="text"
                        value={formData.virtual_session_url}
                        onChange={(e) => setFormData({ ...formData, virtual_session_url: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="https://zoom.us/..."
                      />
                    </div>

                    {/* Speaker Information */}
                    <div className="border-t border-slate-800 pt-4">
                      <h3 className="text-white font-semibold mb-3">Speaker Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Speaker Name</label>
                          <input
                            type="text"
                            value={formData.speaker_name}
                            onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Speaker name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 text-xs font-medium mb-2">Title</label>
                            <input
                              type="text"
                              value={formData.speaker_title}
                              onChange={(e) => setFormData({ ...formData, speaker_title: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                              placeholder="e.g., Captain, CEO"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 text-xs font-medium mb-2">Organization</label>
                            <input
                              type="text"
                              value={formData.speaker_organization}
                              onChange={(e) => setFormData({ ...formData, speaker_organization: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                              placeholder="Company or organization"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Speaker Bio</label>
                          <textarea
                            value={formData.speaker_bio}
                            onChange={(e) => setFormData({ ...formData, speaker_bio: e.target.value })}
                            rows={2}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="Brief bio..."
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Speaker Image URL</label>
                          <input
                            type="text"
                            value={formData.speaker_image_url}
                            onChange={(e) => setFormData({ ...formData, speaker_image_url: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.requires_registration}
                          onChange={(e) => setFormData({ ...formData, requires_registration: e.target.checked })}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">Requires Registration</span>
                      </label>
                      <div className="flex-1">
                        <label className="block text-slate-400 text-xs font-medium mb-1">Display Order</label>
                        <input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingSession(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Session
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="presentation">Presentations</option>
            <option value="workshop">Workshops</option>
            <option value="panel">Panels</option>
            <option value="networking">Networking</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No sessions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map(session => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-4 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSessionTypeColor(session.session_type)}`}>
                        {session.session_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {session.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{session.title}</h3>
                    
                    {/* Speaker */}
                    {session.speaker_name && (
                      <div className="flex items-center gap-2 mb-2">
                        {session.speaker_image_url && (
                          <img
                            src={session.speaker_image_url}
                            alt={session.speaker_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">{session.speaker_name}</p>
                          {(session.speaker_title || session.speaker_organization) && (
                            <p className="text-slate-500 text-xs">
                              {session.speaker_title} {session.speaker_organization && `• ${session.speaker_organization}`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Time & Location */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(session.session_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{session.start_time} - {session.end_time}</span>
                      </div>
                      {session.room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{session.room}</span>
                        </div>
                      )}
                      {session.virtual_session_url && (
                        <a
                          href={session.virtual_session_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          <Video className="w-3 h-3" />
                          <span>Virtual</span>
                        </a>
                      )}
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" />
                        <span>{session.current_attendees || 0} / {session.max_attendees}</span>
                      </div>
                      {session.requires_registration && (
                        <span>• Registration Required</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(session)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{sessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Mic className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-xs">With Speakers</p>
                <p className="text-2xl font-bold text-white">{sessions.filter(s => s.speaker_name).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-slate-400 text-xs">Virtual Sessions</p>
                <p className="text-2xl font-bold text-white">{sessions.filter(s => s.virtual_session_url).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Capacity</p>
                <p className="text-2xl font-bold text-white">{sessions.reduce((sum, s) => sum + (s.max_attendees || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionManager;
