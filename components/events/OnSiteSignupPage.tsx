'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, User, Mail, Phone, CheckCircle, AlertCircle,
  Printer, Download, X, Calendar, MapPin, Plane
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface OnSiteSignupPageProps {
  eventId: string;
  eventTitle: string;
  onComplete?: (registration: any) => void;
  onCancel?: () => void;
}

export function OnSiteSignupPage({ eventId, eventTitle, onComplete, onCancel }: OnSiteSignupPageProps) {
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
  });
  const [registration, setRegistration] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate QR code
      const qrCode = `ONSITE-${eventId}-${Date.now()}`;

      const registrationData = {
        event_id: eventId,
        email: formData.email,
        phone: formData.phone,
        registration_type: 'standard',
        ticket_type: 'onsite',
        qr_code: qrCode,
        payment_status: 'free',
        metadata: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: formData.company,
          job_title: formData.job_title,
          signup_method: 'onsite',
        }
      };

      const { data, error: regError } = await supabase
        .from('event_registrations')
        .insert(registrationData)
        .select()
        .single();

      if (regError) throw regError;

      setRegistration(data);
      setStep('qr');
      
      if (onComplete) onComplete(data);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Event Pass - ${eventTitle}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 400px;
                margin: 40px auto;
                text-align: center;
                padding: 20px;
              }
              .pass {
                border: 2px solid #1e40af;
                border-radius: 16px;
                padding: 30px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              }
              h1 {
                color: #1e40af;
                font-size: 24px;
                margin-bottom: 10px;
              }
              .name {
                font-size: 28px;
                font-weight: bold;
                margin: 20px 0;
                color: #0f172a;
              }
              .info {
                margin: 10px 0;
                color: #475569;
              }
              .qr-container {
                background: white;
                padding: 20px;
                border-radius: 12px;
                margin: 20px auto;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <div class="pass">
              <h1>${eventTitle}</h1>
              <div class="name">${formData.first_name} ${formData.last_name}</div>
              <div class="info">${formData.email}</div>
              ${formData.company ? `<div class="info">${formData.company}</div>` : ''}
              <div class="qr-container">
                <div style="font-size: 100px; color: #1e40af;">■</div>
                <div style="font-size: 12px; margin-top: 10px; color: #64748b;">${registration?.qr_code}</div>
              </div>
              <div class="footer">
                Show this QR code at the event entrance<br>
                Registered: ${new Date().toLocaleDateString()}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <QrCode className="w-6 h-6 text-blue-400" />
              On-Site Registration
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2">Company / Organization</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Airline Company"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2">Job Title</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Pilot, Instructor, etc."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Register & Generate QR Code
                </>
              )}
            </button>
          </div>
        )}

        {/* QR Code Step */}
        {step === 'qr' && registration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6"
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-slate-400">Your event pass has been generated</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="mb-4">
                <h3 className="text-slate-900 font-bold text-lg">{eventTitle}</h3>
                <p className="text-slate-600">{formData.first_name} {formData.last_name}</p>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="bg-slate-100 p-8 rounded-xl mb-4">
                <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
              </div>
              
              <p className="text-slate-500 text-xs font-mono">{registration.qr_code}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={printQRCode}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-4 py-3 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print Pass
              </button>
              <button
                onClick={() => {
                  setStep('form');
                  setRegistration(null);
                  setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    company: '',
                    job_title: '',
                  });
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-3 transition-all"
              >
                <User className="w-4 h-4" />
                New Registration
              </button>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <p className="text-blue-300 text-sm">
                <strong>Important:</strong> Show this QR code at the event entrance for check-in
              </p>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">On-Site Registration</h4>
              <p className="text-slate-400 text-xs">
                This kiosk mode allows visitors to register for the event without an account. 
                They will receive a QR code that can be scanned at the entrance for check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnSiteSignupPage;
