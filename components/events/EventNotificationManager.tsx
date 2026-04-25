'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, X, Edit2, Trash2, Save, Search, Filter, CheckCircle,
  AlertCircle, Send, Clock, Users, MapPin, Calendar, Mail, Megaphone,
  ChevronUp, ChevronDown, Copy
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface EventNotificationManagerProps {
  eventId: string;
  eventTitle: string;
  user?: any;
  onClose?: () => void;
}

interface Notification {
  id: string;
  event_id: string;
  notification_type: string;
  target_audience: string;
  target_regions: string[];
  subject: string;
  message: string;
  scheduled_for: string;
  sent_at: string;
  sent_count: number;
  opened_count: number;
  status: string;
  created_at: string;
}

export function EventNotificationManager({ eventId, eventTitle, user, onClose }: EventNotificationManagerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'reminder' | 'update' | 'cancellation' | 'promo'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent' | 'cancelled'>('all');

  const [formData, setFormData] = useState({
    notification_type: 'reminder',
    target_audience: 'all',
    target_regions: [] as string[],
    subject: '',
    message: '',
    scheduled_for: '',
  });

  const [newRegion, setNewRegion] = useState('');

  useEffect(() => {
    loadNotifications();
  }, [eventId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_notifications')
        .select('*')
        .eq('event_id', eventId)
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.subject || !formData.message) {
      setError('Please fill in required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const notificationData = {
        event_id: eventId,
        notification_type: formData.notification_type,
        target_audience: formData.target_audience,
        target_regions: formData.target_regions,
        subject: formData.subject,
        message: formData.message,
        scheduled_for: formData.scheduled_for || null,
        status: formData.scheduled_for ? 'pending' : 'sent',
        sent_count: 0,
        opened_count: 0,
      };

      if (editingNotification) {
        const { error } = await supabase
          .from('event_notifications')
          .update(notificationData)
          .eq('id', editingNotification.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_notifications')
          .insert(notificationData);

        if (error) throw error;
      }

      await loadNotifications();
      setShowForm(false);
      setEditingNotification(null);
      resetForm();
    } catch (err) {
      console.error('Error saving notification:', err);
      setError('Failed to save notification');
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async (notificationId: string) => {
    if (!confirm('Send this notification now?')) return;

    setSending(true);
    setError(null);

    try {
      // Simulate sending (in production, this would call an email service)
      const { error } = await supabase
        .from('event_notifications')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString(),
          sent_count: Math.floor(Math.random() * 100) + 50,
        })
        .eq('id', notificationId);

      if (error) throw error;
      await loadNotifications();
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const { error } = await supabase
        .from('event_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      await loadNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      notification_type: notification.notification_type,
      target_audience: notification.target_audience,
      target_regions: notification.target_regions || [],
      subject: notification.subject,
      message: notification.message,
      scheduled_for: notification.scheduled_for,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      notification_type: 'reminder',
      target_audience: 'all',
      target_regions: [],
      subject: '',
      message: '',
      scheduled_for: '',
    });
    setNewRegion('');
  };

  const addRegion = () => {
    if (newRegion.trim()) {
      setFormData({
        ...formData,
        target_regions: [...formData.target_regions, newRegion.trim()],
      });
      setNewRegion('');
    }
  };

  const removeRegion = (index: number) => {
    setFormData({
      ...formData,
      target_regions: formData.target_regions.filter((_, i) => i !== index),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchQuery || 
      notification.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.notification_type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'update': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancellation': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'promo': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'update': return <Megaphone className="w-4 h-4" />;
      case 'cancellation': return <AlertCircle className="w-4 h-4" />;
      case 'promo': return <Mail className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'sent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-400" />
              Event Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingNotification(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Notification
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
                      {editingNotification ? 'Edit Notification' : 'Create Notification'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingNotification(null);
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
                        <label className="block text-slate-400 text-xs font-medium mb-2">Notification Type *</label>
                        <select
                          value={formData.notification_type}
                          onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="reminder">Reminder</option>
                          <option value="update">Update</option>
                          <option value="cancellation">Cancellation</option>
                          <option value="promo">Promotional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Target Audience *</label>
                        <select
                          value={formData.target_audience}
                          onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="all">All Attendees</option>
                          <option value="registered">Registered Only</option>
                          <option value="nearby">Nearby Pilots</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Subject *</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Notification subject"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Message *</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Notification message..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Target Regions</label>
                      <div className="space-y-2">
                        {formData.target_regions.map((region, index) => (
                          <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-white text-sm flex-1">{region}</span>
                            <button
                              onClick={() => removeRegion(index)}
                              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newRegion}
                            onChange={(e) => setNewRegion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Add region (e.g., USA, Europe)"
                          />
                          <button
                            onClick={addRegion}
                            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Schedule For (Optional)</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduled_for}
                        onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-slate-500 text-xs mt-1">Leave empty to send immediately</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingNotification(null);
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
                          Save Notification
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
              placeholder="Search notifications..."
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="reminder">Reminders</option>
            <option value="update">Updates</option>
            <option value="cancellation">Cancellations</option>
            <option value="promo">Promotional</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-4 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${getNotificationTypeColor(notification.notification_type)}`}>
                        {getNotificationTypeIcon(notification.notification_type)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(notification.status)}`}>
                        {notification.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{notification.subject}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-2">{notification.message}</p>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{notification.target_audience}</span>
                      </div>
                      {notification.scheduled_for && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(notification.scheduled_for).toLocaleString()}</span>
                        </div>
                      )}
                      {notification.sent_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Sent {new Date(notification.sent_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    {notification.status === 'sent' && (
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Send className="w-3 h-3" />
                          <span>{notification.sent_count} sent</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Mail className="w-3 h-3" />
                          <span>{notification.opened_count} opened</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {notification.status === 'pending' && (
                      <button
                        onClick={() => handleSendNow(notification.id)}
                        disabled={sending}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all"
                        title="Send now"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
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
              <Bell className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Notifications</p>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-slate-400 text-xs">Pending</p>
                <p className="text-2xl font-bold text-white">{notifications.filter(n => n.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Send className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-xs">Sent</p>
                <p className="text-2xl font-bold text-white">{notifications.filter(n => n.status === 'sent').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Opened</p>
                <p className="text-2xl font-bold text-white">{notifications.reduce((sum, n) => sum + (n.opened_count || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">Event Notification System</h4>
              <p className="text-slate-400 text-xs">
                Send reminders, updates, cancellations, and promotional notifications to event attendees. 
                Target specific audiences, schedule for later, and track open rates. Regional targeting helps localize messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventNotificationManager;
