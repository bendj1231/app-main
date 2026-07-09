import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Code2,
  Plane,
  ShieldCheck,
  CreditCard,
  Globe,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';

interface ContactSupportPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogin?: () => void;
}

const DEPARTMENTS = [
  {
    icon: Code2,
    title: 'Engineering & Platform',
    email: 'dev@pilotrecognition.com',
    desc: 'API issues, passkey bugs, and integrations',
  },
  {
    icon: Plane,
    title: 'Airline & Corporate',
    email: 'airlines@pilotrecognition.com',
    desc: 'Pilot shortage matrix queries and enterprise hiring slots',
  },
  {
    icon: ShieldCheck,
    title: 'Verification & Compliance',
    email: 'compliance@pilotrecognition.com',
    desc: 'Logbook checks and ICAO validation escalations',
  },
  {
    icon: CreditCard,
    title: 'General & Billing',
    email: 'billing@pilotrecognition.com',
    desc: 'Pilot premium status management',
  },
];

const REGIONAL_OFFICES = [
  {
    region: 'Asia Pacific',
    phone: '+63 967 048 1890',
    coverage: 'Philippines & Southeast Asia',
    hours: '08:00–20:00 PHT',
  },
  {
    region: 'Europe',
    phone: '+49 1525 9057144',
    coverage: 'Germany & European Region',
    hours: '08:00–18:00 CET',
  },
  {
    region: 'Middle East',
    phone: '+971 55 519 5391',
    coverage: 'UAE & Gulf Region',
    hours: '08:00–18:00 GST',
  },
];

const FAQ_LINKS = [
  { label: 'How does verification work?', target: 'verification' },
  { label: 'Recognition Plus benefits', target: 'pricing' },
  { label: 'Account and password help', target: 'account' },
  { label: 'Operator enterprise access', target: 'enterprise' },
];

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({
  onBack,
  onNavigate,
  onLogin,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', department: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a] pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Response under 12 hours
            </span>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-500 mb-3">
            Membership & Apps Support
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5">
            Support Center
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Route directly to the team that owns your issue. For urgent operational matters, use the
            regional hotlines or open a secure ticket below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-6 py-12 md:py-16 max-w-6xl mx-auto -mt-8 md:-mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column: Routing & Offices */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <RevealOnScroll>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Department Routing</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <a
                        key={dept.email}
                        href={`mailto:${dept.email}`}
                        className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:border-red-100 group-hover:text-red-600 transition-colors">
                          <Icon className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                            {dept.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {dept.desc}
                          </p>
                          <p className="text-xs font-mono text-red-500 mt-2 truncate">
                            {dept.email}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Regional Offices</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {REGIONAL_OFFICES.map((office) => (
                    <div
                      key={office.region}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <p className="text-sm font-semibold text-slate-900 mb-2">{office.region}</p>
                      <a
                        href={`tel:${office.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        {office.phone}
                      </a>
                      <p className="text-[11px] text-slate-500 mt-2">{office.coverage}</p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {office.hours}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="bg-gradient-to-br from-[#0f172a] to-slate-900 rounded-2xl border border-slate-700/50 p-6 md:p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-2">Prefer to find your own answer?</h3>
                    <p className="text-sm text-slate-300 mb-4 max-w-xl">
                      Most questions about verification, billing, and enterprise access are covered
                      in the FAQ.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FAQ_LINKS.map((faq) => (
                        <button
                          key={faq.target}
                          onClick={() => onNavigate('/faq')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors"
                        >
                          {faq.label}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Ticket Form */}
          <div className="lg:col-span-2">
            <RevealOnScroll delay={100}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-6 md:p-8 lg:sticky lg:top-28">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Open a Secure Ticket
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Encrypted routing to the right team. We never store credentials in tickets.
                </p>

                {formSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Ticket Submitted</h4>
                    <p className="text-xs text-slate-500">
                      We will route this to the correct team and respond within 12 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Department
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none appearance-none pr-10"
                        >
                          <option value="">Select a department</option>
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.email} value={dept.title}>
                              {dept.title}
                            </option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none resize-none"
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      By submitting, you agree to our support terms and privacy policy.
                    </p>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </main>

      {/* Back & Footer */}
      <div className="px-6 pb-16 max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-xs text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">
            © 2024 PilotRecognition. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => onNavigate('/faq')}
              className="hover:text-slate-600 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-slate-600 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-slate-600 transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
