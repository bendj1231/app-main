import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Clock, Shield, MessageCircle, Send, CheckCircle, Globe, MapPin } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface ContactSupportPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Membership & Apps Support
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        pilotrecognition.com
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                        We're here to help you with any questions about our programs, membership, or technical support.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mx-auto">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">
                            Response time: Within 24 hours
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Methods Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Email Support */}
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                            <Mail className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Email Support</h3>
                        <p className="text-slate-600 text-sm mb-4">Best for detailed inquiries and documentation</p>
                        <a href="mailto:contact@pilotrecognition.com" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors break-words">
                            contact@pilotrecognition.com
                        </a>
                    </div>

                    {/* Phone Support */}
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                            <Phone className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Phone Support</h3>
                        <p className="text-slate-600 text-sm mb-4">For urgent matters and direct assistance</p>
                        <a href="tel:+639670481890" className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
                            +63 967 048 1890
                        </a>
                    </div>

                    {/* WhatsApp Support */}
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                            <MessageCircle className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">WhatsApp</h3>
                        <p className="text-slate-600 text-sm mb-4">Quick messaging and instant responses</p>
                        <a href="https://wa.me/639670481890" className="text-green-600 font-semibold hover:text-green-800 transition-colors">
                            +63 967 048 1890
                        </a>
                    </div>
                </div>

                {/* Regional Offices */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-center mb-8">Regional Offices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-5 h-5 text-blue-600" />
                                <h4 className="font-bold">Asia Pacific</h4>
                            </div>
                            <p className="text-slate-700 mb-2"><strong>Phone:</strong> +63 967 048 1890</p>
                            <p className="text-slate-600 text-sm">Philippines & Southeast Asia</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-slate-50 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-5 h-5 text-purple-600" />
                                <h4 className="font-bold">Europe</h4>
                            </div>
                            <p className="text-slate-700 mb-2"><strong>Phone:</strong> +49 1525 9057144</p>
                            <p className="text-slate-600 text-sm">Germany & European Region</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-amber-50 to-slate-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-5 h-5 text-amber-600" />
                                <h4 className="font-bold">Middle East</h4>
                            </div>
                            <p className="text-slate-700 mb-2"><strong>Phone:</strong> +971 55 519 5391</p>
                            <p className="text-slate-600 text-sm">UAE & Gulf Region</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">Send us a Message</h3>
                    {formSubmitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                            <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Office Hours */}
            <div className="py-12 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Office Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="font-semibold text-slate-900">Monday - Friday</p>
                            <p className="text-slate-600">9:00 AM - 6:00 PM</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="font-semibold text-slate-900">Saturday</p>
                            <p className="text-slate-600">10:00 AM - 4:00 PM</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="font-semibold text-slate-900">Sunday</p>
                            <p className="text-slate-600">Closed</p>
                        </div>
                    </div>
                    <p className="mt-6 text-slate-600 text-sm">All times are in local regional office time zones</p>
                </div>
            </div>

            {/* Back Button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            {/* Footer */}
            <div className="py-8 text-center text-slate-500 text-sm">
                <p>© 2024 PilotRecognition. All rights reserved.</p>
            </div>
        </div>
    );
};
