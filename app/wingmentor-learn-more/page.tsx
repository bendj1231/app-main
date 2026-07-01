import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Award, CheckCircle, Settings, Bell, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WingMentorLearnMorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ background: 'transparent', height: '68px' }}
      >
        {/* Left — wordmark */}
        <div className="flex items-center min-w-0 flex-1">
          <span
            className="text-2xl tracking-tight leading-none cursor-pointer"
            style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }}
            onClick={() => navigate('/platform?tab=foundation-welcome')}
          >
            <span className="text-white">pilot</span>
            <span className="text-red-500">recognition</span>
            <span className="text-white">.com</span>
          </span>
        </div>

        {/* Centre — island nav container */}
        <div
          className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 px-2 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {[
            { id: 'home', label: 'Home' },
            { id: 'profile', label: 'Profile' },
            { id: 'pathways-directory', label: 'Pathways' },
            { id: 'foundation-welcome', label: 'Programs' },
            { id: 'recognition-plus-tab', label: 'Recognition+' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => navigate(`/platform?tab=${id}`)}
              className="relative px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all text-white/60 hover:text-white hover:bg-white/5"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right — icon toolbar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            title="Settings"
            onClick={() => navigate('/platform?tab=settings')}
            className="transition-all duration-150"
            style={{
              width: 44,
              height: 44,
              background: 'rgba(0,0,0,0.25)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={20} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/instructor vs wing mentor -2.png"
            alt="WingMentor Program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-4 py-2 bg-red-600/20 border border-red-500 rounded-full"
          >
            <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Founding Pilots Program</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Stuck at 200 Hours?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
          >
            Skip the 3-year instructor line. Mentor 50 pilots. Get Recognition+ priority status. Fast-track to airlines.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-white/70">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">47 spots remaining</span>
            </div>
            <div className="text-white/50 text-sm">Founding Pilots closes July 2026</div>
          </motion.div>
        </div>
      </section>

      {/* Career Timeline Comparison */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              Two Paths. One Choice.
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              The traditional path wastes years. WingMentor builds leadership while you wait.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Path */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="text-red-500 text-sm font-bold uppercase tracking-wider mb-4">Traditional Path</div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <div className="font-bold">200 Hours</div>
                    <div className="text-white/60 text-sm">Graduate with CPL</div>
                  </div>
                </div>
                <div className="border-l-2 border-gray-600 h-8 ml-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <div className="font-bold">Instructor Line</div>
                    <div className="text-white/60 text-sm">Wait 2-3 years for position</div>
                  </div>
                </div>
                <div className="border-l-2 border-gray-600 h-8 ml-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <div className="font-bold">5,000+ Hours</div>
                    <div className="text-white/60 text-sm">Finally qualify for airlines</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="text-red-400 font-bold text-sm">Result: 5+ years to airline cockpit</div>
              </div>
            </motion.div>

            {/* WingMentor Path */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-900/20 to-red-950/20 border-2 border-red-500 rounded-2xl p-8"
            >
              <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-4">WingMentor Path</div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <div className="font-bold">200 Hours</div>
                    <div className="text-white/60 text-sm">Graduate with CPL</div>
                  </div>
                </div>
                <div className="border-l-2 border-red-500 h-8 ml-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <div className="font-bold">Mentor 50 Pilots</div>
                    <div className="text-white/60 text-sm">50 hours of leadership experience</div>
                  </div>
                </div>
                <div className="border-l-2 border-red-500 h-8 ml-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <div className="font-bold">Recognition+ Status</div>
                    <div className="text-white/60 text-sm">Priority pathway matching</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-bold text-sm">Result: Fast-track to airline interviews</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is WingMentor */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              How It Works
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              You don't just log hours. You build the leadership mindset airlines are desperate for.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Help 50 Pilots',
                description: 'One-to-one mentorship on CRM, decision-making, and crew resource management. Real leadership, not theory.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: '50 Hours of Action',
                description: 'Each session logged. Each hour counts toward your Recognition+ score. Real experience airlines value.',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Recognition+ Status',
                description: 'Skip the line. Recognition+ pilots get priority matching with airline pathways. Your effort becomes your advantage.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <div className="text-red-500 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="py-20 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              Stop Waiting. Start Leading.
            </h2>
            <p className="text-lg text-black/70 max-w-3xl mx-auto leading-relaxed mb-8">
              The industry tells you to wait. Wait for hours. Wait for instructor slots. Wait for someone to give you permission.
              WingMentor changes the game. You don't wait for opportunity — you create it.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="bg-gray-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">The Old Way</h3>
              <p className="text-black/70">Graduate with 200 hours. Apply to 50 airlines. Get rejected. Wait 2 years for instructor job. Repeat.</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">The WingMentor Way</h3>
              <p className="text-black/70">Graduate with 200 hours. Mentor 50 pilots. Build leadership experience. Recognition+ status. Airlines pull you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black tracking-tight mb-12 text-center"
          >
            What You Actually Get
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Skip the Hiring Line',
                description: 'Recognition+ pilots get priority matching with airline pathways. You don\'t compete — you get pulled first.',
              },
              {
                title: 'Leadership Experience Airlines Want',
                description: '50 hours of real mentorship = CRM skills, decision-making, crew resource management. The exact skills airlines screen for.',
              },
              {
                title: 'Network of 50 Pilots You Helped',
                description: 'These pilots remember you. They\'re your network. When they get hired, they recommend you.',
              },
              {
                title: 'Recognition Score Boost',
                description: 'Every mentorship hour counts toward your Recognition Score. Higher score = more pathway access.',
              },
              {
                title: 'Free Verification (Founding Pilots)',
                description: 'First 100 WingMentor pilots get free verification through our Veremark partnership. $0 background check.',
              },
              {
                title: 'Effort-Based, Not Payment-Based',
                description: 'You earn status through action, not your wallet. Airlines respect this. It proves you\'re committed.',
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-3">
                  <CheckCircle className="text-red-500 flex-shrink-0 mt-1" />
                  <h3 className="font-bold text-lg">{benefit.title}</h3>
                </div>
                <p className="text-white/60 ml-8">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-red-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-500 rounded-full mb-6">
              <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Founding Pilots Program</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              47 Spots Remaining
            </h2>
            <p className="text-lg text-white/70 mb-4">
              First 100 WingMentor pilots get free verification ($0 background check) + Recognition+ priority status.
            </p>
            <p className="text-white/50 text-sm mb-8">
              Program closes July 2026. Don't miss the founding cohort.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-red-600 text-white text-sm font-black uppercase tracking-wider rounded-full hover:bg-red-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-red-600/30"
              onClick={() => navigate('/platform?tab=foundation-welcome')}
            >
              Join Founding Pilots <ArrowRight size={16} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-white/20 transition-colors"
              onClick={() => window.history.back()}
            >
              Learn More About Programs
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-8 text-white/50 text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Free verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Recognition+ status</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Priority pathway matching</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
