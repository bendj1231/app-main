'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, DollarSign, CheckCircle,
  AlertCircle, QrCode, Ticket, Star, ExternalLink, ChevronRight,
  Plane, Building2, Award, X
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface EventRegistrationPageProps {
  eventId: string;
  user?: any;
  onComplete?: (registrationId: string) => void;
  onCancel?: () => void;
}

export function EventRegistrationPage({ eventId, user, onComplete, onCancel }: EventRegistrationPageProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    ticket_type: 'standard',
    promo_code: '',
  });
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      setFinalPrice(event.registration_fee);
    }
  }, [event]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);

      // Check if user already registered
      if (user?.id) {
        const { data: existingReg } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        if (existingReg) {
          setRegistered(true);
        }
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Failed to load event information.');
    } finally {
      setLoading(false);
    }
  };

  const validatePromoCode = async () => {
    if (!formData.promo_code || !event) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('promo_discount_percentage, promo_max_uses, promo_uses_count, promo_code_expires_at')
        .eq('id', eventId)
        .eq('promo_code', formData.promo_code)
        .single();

      if (error || !data) {
        setError('Invalid promo code');
        setPromoDiscount(0);
        setFinalPrice(event.registration_fee);
        return;
      }

      // Check if promo is valid
      const now = new Date();
      const expiresAt = data.promo_code_expires_at ? new Date(data.promo_code_expires_at) : null;
      
      if (expiresAt && expiresAt < now) {
        setError('Promo code has expired');
        setPromoDiscount(0);
        setFinalPrice(event.registration_fee);
        return;
      }

      if (data.promo_max_uses && data.promo_uses_count >= data.promo_max_uses) {
        setError('Promo code has reached maximum uses');
        setPromoDiscount(0);
        setFinalPrice(event.registration_fee);
        return;
      }

      // Apply discount
      const discount = event.registration_fee * (data.promo_discount_percentage / 100);
      setPromoDiscount(discount);
      setFinalPrice(Math.max(0, event.registration_fee - discount));
      setError(null);
    } catch (err) {
      console.error('Error validating promo code:', err);
    }
  };

  const handleRegister = async () => {
    if (!user?.id) {
      setError('Please log in to register for this event.');
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      // Generate QR code
      const qrCode = `REG-${eventId}-${user.id}-${Date.now()}`;

      const registrationData = {
        event_id: eventId,
        user_id: user.id,
        profile_id: user.id,
        email: formData.email,
        phone: formData.phone,
        ticket_type: formData.ticket_type,
        qr_code: qrCode,
        promo_code_used: formData.promo_code || null,
        discount_amount: promoDiscount,
        payment_amount: finalPrice,
        payment_status: finalPrice > 0 ? 'pending' : 'free',
      };

      const { data, error: regError } = await supabase
        .from('event_registrations')
        .insert(registrationData)
        .select()
        .single();

      if (regError) throw regError;

      // Update event attendee count
      await supabase
        .from('events')
        .update({ 
          current_attendees: (event.current_attendees || 0) + 1,
          signups_count: (event.signups_count || 0) + 1
        })
        .eq('id', eventId);

      // Update promo code usage if used
      if (formData.promo_code) {
        await supabase
          .from('events')
          .update({ promo_uses_count: (event.promo_uses_count || 0) + 1 })
          .eq('id', eventId);
      }

      setRegistered(true);
      if (onComplete) onComplete(data.id);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white">Event not found</p>
        </div>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Registration Complete!</h1>
            <p className="text-slate-400 mb-6">
              You are now registered for <span className="text-white font-medium">{event.title}</span>
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <p className="text-slate-400 text-sm mb-2">Your QR Code</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <p className="text-slate-500 text-xs mt-2">Show this QR code at the event for check-in</p>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = event.registration_open && 
    (!event.registration_deadline || new Date(event.registration_deadline) > new Date());
  const isSoldOut = event.max_attendees && event.current_attendees >= event.max_attendees;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {event.end_date !== event.start_date && ` - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </span>
            {event.venue_city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue_city}
              </span>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.event_image_url && (
              <div className="bg-slate-900 rounded-2xl overflow-hidden">
                <img src={event.event_image_url} alt={event.title} className="w-full h-64 object-cover" />
              </div>
            )}

            {/* Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">About This Event</h2>
              <p className="text-slate-400 text-sm whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Event Type Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.event_type === 'airshow' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                event.event_type === 'career_fair' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                event.event_type === 'pilot_expo' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {event.event_type.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                event.status === 'ongoing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {event.status.toUpperCase()}
              </span>
            </div>

            {/* Registration Status */}
            {!isRegistrationOpen && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-300 font-medium text-sm">Registration Closed</p>
                  <p className="text-red-400/70 text-xs mt-1">
                    {event.registration_deadline ? `Registration deadline was ${new Date(event.registration_deadline).toLocaleDateString()}` : 'Registration is not currently open'}
                  </p>
                </div>
              </div>
            )}

            {isSoldOut && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-300 font-medium text-sm">Event Sold Out</p>
                  <p className="text-red-400/70 text-xs mt-1">
                    All {event.max_attendees} spots have been filled
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-400" />
                Registration
              </h2>

              {!user && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <p className="text-amber-300 text-sm">Please log in to register for this event.</p>
                </div>
              )}

              {user && isRegistrationOpen && !isSoldOut && (
                <div className="space-y-4">
                  {/* Ticket Type */}
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-2">Ticket Type</label>
                    <select
                      value={formData.ticket_type}
                      onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="standard">Standard</option>
                      <option value="vip">VIP</option>
                      <option value="student">Student</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Promo Code */}
                  {event.promo_code && (
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">
                        Promo Code: <span className="text-emerald-400 font-mono">{event.promo_code}</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.promo_code}
                          onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                          onBlur={validatePromoCode}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Enter promo code"
                        />
                      </div>
                      {promoDiscount > 0 && (
                        <p className="text-emerald-400 text-xs mt-1">
                          Promo discount applied: -${promoDiscount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Registration Fee</span>
                      <span className="text-white">${event.registration_fee.toFixed(2)}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount</span>
                        <span className="text-emerald-400">-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-700 pt-2 flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-white font-bold">${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-red-300 text-xs">{error}</p>
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
                  >
                    {registering ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {finalPrice > 0 ? `Register - $${finalPrice.toFixed(2)}` : 'Register Free'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Attendee Count */}
              <div className="flex items-center gap-2 text-slate-500 text-xs pt-4 border-t border-slate-800">
                <Users className="w-4 h-4" />
                <span>{event.current_attendees || 0} registered</span>
                {event.max_attendees && (
                  <span> / {event.max_attendees} spots</span>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Event Details
              </h2>
              <div className="space-y-3 text-sm">
                {event.start_time && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                )}
                {event.venue_name && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-4 h-4" />
                    <span>{event.venue_name}</span>
                  </div>
                )}
                {event.venue_address && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{event.venue_address}</span>
                  </div>
                )}
                {event.website_url && (
                  <a
                    href={event.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Event Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventRegistrationPage;
