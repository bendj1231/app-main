import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import {
  Bell, BellRing, Check, Clock, AlertTriangle,
  FileCheck, Calendar, X, ChevronRight, ShieldCheck,
  Plane, Award, RefreshCw,
} from 'lucide-react';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  data?: string;
  read_at?: string;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  verification_approved: { icon: <FileCheck className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  verification_rejected: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10' },
  verification_expiring: { icon: <Clock className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  credential_issued: { icon: <ShieldCheck className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  pathway_match: { icon: <Plane className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  tier_upgrade: { icon: <Award className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  reminder: { icon: <Calendar className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  default: { icon: <Bell className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

export const NotificationSystem: React.FC<{ userId: string }> = ({ userId }) => {
  const { callApi } = useWorkerAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await callApi<Notification[]>('getNotifications', { user_id: userId, limit: 50 });
      setNotifications(data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [userId, callApi]);

  useEffect(() => {
    loadNotifications();
    // Poll every 60 seconds (no realtime since D1)
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markRead = async (id: string) => {
    try {
      await callApi('markNotificationRead', { id });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read_at);
    for (const n of unread) {
      try { await callApi('markNotificationRead', { id: n.id }); } catch { /* ignore */ }
    }
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        {unreadCount > 0 ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={loadNotifications}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const cfg = typeConfig[n.type] || typeConfig.default;
                    const isUnread = !n.read_at;
                    return (
                      <button
                        key={n.id}
                        onClick={() => { if (isUnread) markRead(n.id); }}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/40 transition-colors ${
                          isUnread ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isUnread ? 'text-white font-medium' : 'text-slate-300'}`}>
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          )}
                          <p className="text-[10px] text-slate-600 mt-1">
                            {new Date(n.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NotificationBadge: React.FC<{ count: number; onClick?: () => void }> = ({ count, onClick }) => (
  <button
    onClick={onClick}
    className="relative w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
  >
    {count > 0 ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </button>
);
