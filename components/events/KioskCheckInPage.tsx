'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, CheckCircle, XCircle, AlertCircle, Search,
  User, Calendar, Clock, MapPin, RefreshCw, X, Camera,
  ScanLine, BadgeCheck
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface KioskCheckInPageProps {
  eventId: string;
  eventTitle: string;
  user?: any;
  onCancel?: () => void;
}

export function KioskCheckInPage({ eventId, eventTitle, user, onCancel }: KioskCheckInPageProps) {
  const [qrInput, setQrInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInCount, setCheckInCount] = useState(0);

  useEffect(() => {
    loadCheckInCount();
  }, [eventId]);

  const loadCheckInCount = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('checkins_count')
        .eq('id', eventId)
        .single();
      
      if (data) setCheckInCount(data.checkins_count || 0);
    } catch (err) {
      console.error('Error loading check-in count:', err);
    }
  };

  const handleCheckIn = async () => {
    if (!qrInput.trim()) {
      setError('Please enter a QR code');
      return;
    }

    setScanning(true);
    setError(null);
    setResult(null);

    try {
      // Look up registration by QR code
      const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (title, start_date, venue_city),
          profiles (display_name, email, profile_image_url)
        `)
        .eq('event_id', eventId)
        .eq('qr_code', qrInput.trim())
        .single();

      if (regError || !registration) {
        setError('QR code not found. Please check and try again.');
        setScanning(false);
        return;
      }

      // Check if already checked in
      if (registration.checked_in) {
        setResult({
          type: 'already_checked_in',
          registration,
          message: `${registration.profiles?.display_name || 'Attendee'} is already checked in`
        });
        setScanning(false);
        return;
      }

      // Check in the attendee
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
          checked_in_by: user?.id || null,
        })
        .eq('id', registration.id);

      if (updateError) throw updateError;

      // Update event check-in count
      await supabase
        .from('events')
        .update({ checkins_count: (checkInCount || 0) + 1 })
        .eq('id', eventId);

      setResult({
        type: 'success',
        registration,
        message: `${registration.profiles?.display_name || 'Attendee'} checked in successfully`
      });

      setCheckInCount(prev => prev + 1);
      setQrInput('');
    } catch (err) {
      console.error('Check-in error:', err);
      setError('Failed to check in. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setQrInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-blue-400" />
              Event Check-In Kiosk
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadCheckInCount}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
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

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BadgeCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Check-Ins Today</p>
                <p className="text-3xl font-bold text-white">{checkInCount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Kiosk Mode</p>
              <p className="text-white text-sm font-medium">Active</p>
            </div>
          </div>
        </div>

        {/* Scanner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* QR Code Input */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2">
              Enter or Scan QR Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
                placeholder="Scan or enter QR code..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:border-blue-500 focus:outline-none font-mono"
                autoFocus
              />
              <button
                onClick={handleCheckIn}
                disabled={scanning || !qrInput.trim()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
              >
                {scanning ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ScanLine className="w-5 h-5" />
                    Check In
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Camera Scanner Placeholder */}
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center">
            <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Camera scanner coming soon</p>
            <p className="text-slate-600 text-xs mt-1">For now, manually enter or scan QR codes</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
            >
              <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-2xl p-6 ${
                  result.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'bg-amber-500/10 border border-amber-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.type === 'success' ? (
                    <CheckCircle className="w-12 h-12 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-amber-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      result.type === 'success' ? 'text-emerald-300' : 'text-amber-300'
                    }`}>
                      {result.type === 'success' ? 'Check-In Successful' : 'Already Checked In'}
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">{result.message}</p>
                    
                    {result.registration && (
                      <div className="bg-slate-900/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="text-white text-sm">
                            {result.registration.profiles?.display_name || 'Attendee'}
                          </span>
                        </div>
                        {result.registration.profiles?.email && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-400 text-xs">{result.registration.profiles.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400 text-xs">
                            Ticket: {result.registration.ticket_type || 'Standard'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={resetScanner}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl px-4 py-2.5 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Scan Next
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-blue-400" />
            Check-In Instructions
          </h3>
          <ul className="text-slate-400 text-xs space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">1.</span>
              <span>Ask attendee for their event QR code (from registration)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">2.</span>
              <span>Enter QR code manually or use scanner (coming soon)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">3.</span>
              <span>Click "Check In" to process the attendee</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">4.</span>
              <span>Verify attendee details and confirm check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">5.</span>
              <span>Click "Scan Next" for the next attendee</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setQrInput('')}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl px-4 py-3 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Input
          </button>
          <button
            onClick={() => setQrInput('ONSITE-' + eventId + '-TEST')}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl px-4 py-3 transition-all"
          >
            <QrCode className="w-4 h-4" />
            Test Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default KioskCheckInPage;
