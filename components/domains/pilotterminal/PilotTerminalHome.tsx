'use client';

// Pilot Terminal Home - Landing Page
// Marketing page for the pilot community forum
// Domain: pilotterminal.com

import { useState, useEffect } from 'react';
import { MessageSquare, Users, Radio, Zap, Globe, Shield, ArrowRight, Play, Star, CheckCircle, Plane, Map, AlertTriangle } from 'lucide-react';
import { CookieConsent } from '../../../components/CookieConsent';
import PilotTerminalLanding from './PilotTerminalLanding';

export default function PilotTerminalHome() {
  const [showForum, setShowForum] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-8">
          {/* Loading Text */}
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            <span className="text-white">accessing pilot</span>
            <span className="text-yellow-400">terminal</span>
            <span className="text-white">.com</span>
          </h2>
          
          {/* Purple Loading Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-fuchsia-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center mt-6 gap-2">
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Show the actual forum if user clicks "Enter Terminal"
  if (showForum) {
    return <PilotTerminalLanding />;
  }

  const features = [
    {
      icon: MessageSquare,
      title: 'Real-Time Discussions',
      description: 'Chat with pilots worldwide. Get instant answers to your aviation questions.',
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'Every member is a real pilot. No bots, no recruiters, just aviators.',
    },
    {
      icon: Radio,
      title: 'Live Tower',
      description: 'See who\'s online now. Join voice channels for real-time cockpit talk.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for pilots on the move. Works in the crew room, hotel, or cockpit.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Pilots' },
    { value: '120+', label: 'Countries' },
    { value: '2.4M', label: 'Messages/Month' },
    { value: '24/7', label: 'Global Chat' },
  ];

  const testimonials = [
    {
      name: 'Captain Sarah M.',
      role: 'B737 Captain',
      content: 'Finally, a place where I can talk shop without LinkedIn recruiters breathing down my neck.',
      avatar: 'SM',
    },
    {
      name: 'Jake Thompson',
      role: 'CFI, 3,200 hrs',
      content: 'Got my airline job through a connection I made here. Better than any job board.',
      avatar: 'JT',
    },
    {
      name: 'Miguel R.',
      role: 'Corporate Pilot',
      content: 'The live tower feature is genius. It\'s like having a crew room in your pocket.',
      avatar: 'MR',
    },
  ];

  const channels = [
    { name: 'Student Pilots', count: '8.2k', color: 'bg-blue-500' },
    { name: 'CFI Life', count: '5.1k', color: 'bg-green-500' },
    { name: 'Airline Career', count: '12.4k', color: 'bg-purple-500' },
    { name: 'Medical & FAA', count: '3.8k', color: 'bg-orange-500' },
    { name: 'Type Ratings', count: '4.2k', color: 'bg-pink-500' },
    { name: 'Off-Topic', count: '6.7k', color: 'bg-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Three Vertical Epaulet Bars */}
              <div className="flex gap-1">
                <div className="w-1.5 h-8 bg-yellow-400 rounded-sm" />
                <div className="w-1.5 h-8 bg-yellow-400 rounded-sm" />
                <div className="w-1.5 h-8 bg-yellow-400 rounded-sm" />
              </div>
              <span className="font-bold text-lg"><span className="text-white">Pilot</span><span className="text-yellow-400">Terminal</span><span className="text-white">.com</span></span>
              <span className="hidden sm:inline text-xs text-slate-500">Beta</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#channels" className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors">
                Channels
              </a>
              <button 
                onClick={() => setShowForum(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2"
              >
                Enter Terminal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - ProPilotWorld Style */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden bg-black">
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            {/* Left Side - Text Content */}
            <div className="text-left">
              {/* Main Title with Underline */}
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-white">Pilot</span><span className="text-yellow-400">Terminal</span><span className="text-white">.com</span>
              </h1>
              <div className="w-64 h-1 bg-yellow-400 mb-6" />

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-white font-semibold mb-6">
                The Premier Information & Networking Resource for Professional Pilots
              </p>

              {/* Member Count CTA */}
              <p className="text-lg md:text-xl text-red-500 font-bold underline mb-6">
                Join over 50,000+ Professional Pilot Members Today!
              </p>

              {/* Description */}
              <p className="text-lg text-white mb-4">
                PilotTerminal.com is the <span className="text-fuchsia-500 underline">Largest</span> Pilot Owned & Pilot Operated, Professional Aviation Community in the World!
              </p>

              {/* Years of Service */}
              <p className="text-xl text-white font-bold mb-8">
                Serving the Professional Pilot Community with Verified Credentials
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setShowForum(true);
                    }, 2000);
                  }}
                  className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                >
                  Launch Terminal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 ${color} rounded-full border-2 border-black flex items-center justify-center text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">From 12,000+ verified pilots</p>
                </div>
              </div>
            </div>

            {/* Right Side - Space for Photography */}
            <div className="hidden lg:block relative h-full min-h-[400px]">
              {/* Placeholder for hero photography */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Plane className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Hero Photography</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* W1000 Style Quick Nav - Full Width Edge to Edge */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <div className="bg-[#151515] border-t border-white/5 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-stretch h-16">
              {[
                { icon: MessageSquare, label: 'Forums' },
                { icon: Users, label: 'Pilots' },
                { icon: Radio, label: 'Live' },
                { icon: Globe, label: 'Network' },
                { icon: Shield, label: 'Verify' },
                { icon: Plane, label: 'Recognition' },
                { icon: Map, label: 'Pathways' },
                { icon: AlertTriangle, label: 'Shortage' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="relative flex-1 h-full transition-all duration-75 flex flex-col items-center justify-center gap-1 border-r border-white/5 last:border-r-0 border-t border-white/10 border-b border-black bg-gradient-to-b from-[#383838] to-[#202020] hover:from-[#444] hover:to-[#2a2a2a] active:translate-y-[2px] shadow-[0_4px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] active:shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(0,0,0,0.8)]"
                >
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-[11px] text-gray-300 font-medium uppercase tracking-wider">{item.label}</span>
                  <div className="absolute top-0 left-[2px] right-[2px] h-[1px] bg-white/20 opacity-40"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Pilots Choose Terminal</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built specifically for aviation professionals. Every feature designed with your workflow in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels Preview */}
      <section id="channels" className="py-20 lg:py-32 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Channel</h2>
              <p className="text-slate-400 mb-8">
                Whether you're a student pilot struggling with landings or a 20-year captain dealing with contract issues, there's a channel for you.
              </p>

              <div className="space-y-3">
                {channels.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${channel.color} rounded-full`} />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">{channel.count}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowForum(true)}
                className="mt-8 text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-2"
              >
                Explore all 50+ channels
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs text-slate-500">#airline-career</span>
                </div>

                <div className="space-y-4">
                  {[
                    { user: 'ATP_John', msg: 'Just got the call from Delta! 6 years of instructing finally paid off.', time: '2m ago' },
                    { user: 'CFI_Mike', msg: 'Congrats! Which base?', time: '1m ago' },
                    { user: 'ATP_John', msg: 'ATL. Start class next month.', time: 'Now' },
                  ].map((chat, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {chat.user[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm text-yellow-400">{chat.user}</span>
                          <span className="text-xs text-slate-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-slate-300">{chat.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Message #airline-career..."
                    className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
                    readOnly
                  />
                  <button className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Pilots Say</h2>
            <p className="text-slate-400">Real pilots. Real stories. Real connections.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{t.content}"</p>
                <div className="mt-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-900/30 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-yellow-400 mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Pilot-Verified Community</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Real Pilots. Real Names. Real Talk.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle, text: 'License verification required' },
              { icon: CheckCircle, text: 'No anonymous trolling' },
              { icon: CheckCircle, text: 'Moderated by active pilots' },
              { icon: CheckCircle, text: 'Zero recruiters allowed' },
              { icon: CheckCircle, text: 'End-to-end encrypted DMs' },
              { icon: CheckCircle, text: 'No data sold, ever' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the Conversation?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              50,000+ pilots are waiting to meet you. Free forever. No recruiters. No BS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowForum(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Enter Pilot Terminal
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Free to join • Takes 2 minutes • Pilot verification required
            </p>
          </div>
        </div>
      </section>

      <CookieConsent />

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-yellow-400" />
              <span className="font-bold"><span className="text-white">Pilot</span><span className="text-yellow-400">Terminal</span></span>
              <span className="text-slate-500 text-sm">| A WM Pilot Group Project</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="/pilot-terminal/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/pilot-terminal/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/pilot-terminal/guidelines" className="hover:text-white transition-colors">Guidelines</a>
              <a href="/dpo" className="hover:text-white transition-colors">DPO Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
