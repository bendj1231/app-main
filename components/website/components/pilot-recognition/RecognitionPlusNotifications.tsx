/**
 * RecognitionPlusNotifications Component
 * 
 * Premium notifications for Recognition+ members:
 * - Inactivity & Currency Notifications (90-day recency alerts)
 * - Medical & License Expiry reminders
 * - Skill Proficiency Reminders
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Clock, Shield, Plane, Radio, GraduationCap, Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'recency' | 'medical' | 'license' | 'skill';
  severity: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  date: Date;
  actionRequired: boolean;
  actionText?: string;
}

interface RecognitionPlusNotificationsProps {
  lastFlownDate?: Date | null;
  medicalExpiry?: Date | null;
  licenseExpiry?: Date | null;
  totalHours?: number;
  onAction?: (action: string) => void;
}

export const RecognitionPlusNotifications: React.FC<RecognitionPlusNotificationsProps> = ({
  lastFlownDate,
  medicalExpiry,
  licenseExpiry,
  totalHours = 0,
  onAction,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const generateNotifications = () => {
      const notifs: Notification[] = [];
      const now = new Date();

      // 1. Recency Alert (90 days without flight)
      if (lastFlownDate) {
        const daysSinceLastFlight = Math.floor((now.getTime() - lastFlownDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastFlight >= 90) {
          notifs.push({
            id: 'recency-90',
            type: 'recency',
            severity: 'critical',
            title: 'Currency Expired',
            message: `You haven't flown in ${daysSinceLastFlight} days. You need 3 takeoffs and landings to re-establish currency before carrying passengers.`,
            date: now,
            actionRequired: true,
            actionText: 'Schedule Flight',
          });
        } else if (daysSinceLastFlight >= 60) {
          notifs.push({
            id: 'recency-60',
            type: 'recency',
            severity: 'warning',
            title: 'Currency Expiring Soon',
            message: `It's been ${daysSinceLastFlight} days since your last flight. Currency expires in ${90 - daysSinceLastFlight} days.`,
            date: now,
            actionRequired: true,
            actionText: 'Schedule Flight',
          });
        }
      } else {
        // No last flown date recorded
        notifs.push({
          id: 'recency-unknown',
          type: 'recency',
          severity: 'info',
          title: 'Update Flight Hours',
          message: 'Add your last flight date to track currency and recency requirements.',
          date: now,
          actionRequired: true,
          actionText: 'Update Logbook',
        });
      }

      // 2. Medical Certificate Expiry
      if (medicalExpiry) {
        const daysUntilExpiry = Math.floor((medicalExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
          notifs.push({
            id: 'medical-expired',
            type: 'medical',
            severity: 'critical',
            title: 'Medical Certificate Expired',
            message: 'Your medical certificate has expired. You cannot act as PIC until renewed.',
            date: now,
            actionRequired: true,
            actionText: 'Schedule Medical',
          });
        } else if (daysUntilExpiry <= 30) {
          notifs.push({
            id: 'medical-expiring',
            type: 'medical',
            severity: daysUntilExpiry <= 7 ? 'critical' : 'warning',
            title: 'Medical Certificate Expiring',
            message: `Your medical expires in ${daysUntilExpiry} days (${medicalExpiry.toLocaleDateString()}). Schedule your renewal exam.`,
            date: now,
            actionRequired: true,
            actionText: 'Schedule Medical',
          });
        }
      }

      // 3. License/Part 61 Recurrent Training
      if (licenseExpiry) {
        const daysUntilExpiry = Math.floor((licenseExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
          notifs.push({
            id: 'license-expired',
            type: 'license',
            severity: 'critical',
            title: 'License/Recurrent Training Expired',
            message: 'Your license or recurrent training has expired. Immediate action required.',
            date: now,
            actionRequired: true,
            actionText: 'View Requirements',
          });
        } else if (daysUntilExpiry <= 60) {
          notifs.push({
            id: 'license-expiring',
            type: 'license',
            severity: daysUntilExpiry <= 14 ? 'critical' : 'warning',
            title: 'Recurrent Training Due',
            message: `Part 61 recurrent training expires in ${daysUntilExpiry} days. Complete your training to maintain compliance.`,
            date: now,
            actionRequired: true,
            actionText: 'View Requirements',
          });
        }
      }

      // 4. Skill Proficiency Reminders (IFR, Radio, etc.)
      if (totalHours > 0 && totalHours < 50) {
        notifs.push({
          id: 'skill-ifr',
          type: 'skill',
          severity: 'info',
          title: 'IFR Proficiency Reminder',
          message: 'Consider simulator sessions or refresher training to maintain IFR proficiency.',
          date: now,
          actionRequired: false,
        });
      }

      setNotifications(notifs);
    };

    generateNotifications();
  }, [lastFlownDate, medicalExpiry, licenseExpiry, totalHours]);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 border-red-700 text-red-400';
      case 'warning':
        return 'bg-amber-900/30 border-amber-700 text-amber-400';
      default:
        return 'bg-blue-900/30 border-blue-700 text-blue-400';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'recency':
        return <Clock className="w-5 h-5" />;
      case 'medical':
        return <Shield className="w-5 h-5" />;
      case 'license':
        return <GraduationCap className="w-5 h-5" />;
      case 'skill':
        return <Radio className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const criticalCount = notifications.filter(n => n.severity === 'critical').length;
  const warningCount = notifications.filter(n => n.severity === 'warning').length;

  return (
    <div className="bg-slate-800/80 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-slate-700/50 border-b border-slate-600 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-blue-400" />
            {(criticalCount > 0 || warningCount > 0) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Currency & Compliance</h3>
            <p className="text-xs text-slate-400">
              {criticalCount > 0 ? (
                <span className="text-red-400">{criticalCount} critical alert{criticalCount > 1 ? 's' : ''}</span>
              ) : warningCount > 0 ? (
                <span className="text-amber-400">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>
              ) : (
                'All requirements up to date'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
              {criticalCount}
            </span>
          )}
          <span className="text-slate-400 text-sm">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Notifications List */}
      {expanded && (
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active notifications</p>
              <p className="text-xs mt-1">Your certificates and currency are current</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border ${getSeverityStyles(notif.severity)} transition-all hover:opacity-90`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-white">{notif.title}</h4>
                      {notif.severity === 'critical' && (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                    
                    {notif.actionRequired && onAction && (
                      <button
                        onClick={() => onAction(notif.actionText || 'action')}
                        className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        {notif.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-slate-600 grid grid-cols-3 gap-3">
            <div className="text-center">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <p className="text-xs text-slate-400">Last Flight</p>
              <p className="text-sm font-medium text-white">
                {lastFlownDate ? lastFlownDate.toLocaleDateString() : 'Not recorded'}
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <p className="text-xs text-slate-400">Medical</p>
              <p className={`text-sm font-medium ${medicalExpiry && new Date(medicalExpiry) < new Date() ? 'text-red-400' : 'text-white'}`}>
                {medicalExpiry ? medicalExpiry.toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div className="text-center">
              <GraduationCap className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <p className="text-xs text-slate-400">Recurrent</p>
              <p className={`text-sm font-medium ${licenseExpiry && new Date(licenseExpiry) < new Date() ? 'text-red-400' : 'text-white'}`}>
                {licenseExpiry ? licenseExpiry.toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecognitionPlusNotifications;
