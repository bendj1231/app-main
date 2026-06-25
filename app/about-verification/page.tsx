import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ShieldCheck, Mail, Clock, Lock, Globe } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function AboutVerificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Back link */}
        <button
          onClick={() => navigate('/get-started/verify-apc')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Verification Form
        </button>

        <motion.h1
          className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About APC Verification
        </motion.h1>
        <motion.p
          className="text-gray-500 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          How Aviation Pathways Consultancy verifies your pilot credentials and protects your data.
        </motion.p>

        {/* Overview Card */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <ShieldCheck size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">What is APC Verification?</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Aviation Pathways Consultancy (APC) is a pilot credential verification service registered as a Data Controller in Mauritius. We verify your pilot license, medical certificate, ratings, and flight hours directly with your Aviation Training Organization (ATO) to confirm your records match official institutional data.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            This verification gives airlines, operators, and recruiters confidence that your credentials are genuine and your flight hours are accurate — a critical step in the hiring process.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText size={20} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">The Verification Process</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'You submit your documents',
                desc: 'Upload your pilot license, medical certificate, radio telephone license, type ratings, and logbook through our secure form. All documents are encrypted during upload.',
              },
              {
                step: '2',
                title: 'APC sends documents to your ATO',
                desc: 'We email your ATO along with a signed consent form. The ATO can use our form or their own institutional release form — whichever they prefer.',
              },
              {
                step: '3',
                title: 'ATO verifies your records',
                desc: 'Your ATO cross-references your uploaded logbook against their official training records and simulator logs. They confirm whether your flight hours, dates, aircraft types, and instructor signatures are accurate.',
              },
              {
                step: '4',
                title: 'Results sent directly to you',
                desc: 'The ATO sends verification results directly to your email address. APC does not see your actual flight hours or training details.',
              },
              {
                step: '5',
                title: 'APC receives confirmation only',
                desc: 'APC receives a "green light" confirmation from the ATO that verification was completed. We update your profile status without accessing the actual data.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Protection */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Lock size={20} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Data Protection & Privacy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">What we collect</h3>
              <ul className="space-y-1.5">
                {[
                  'Pilot license and radio telephone license',
                  'Medical certificate',
                  'Type ratings and endorsements',
                  'Flight logbook (all pages)',
                  'Signed ATO consent form',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">How we protect it</h3>
              <ul className="space-y-1.5">
                {[
                  'Enterprise-grade encrypted cloud storage',
                  'Documents deleted after 30 days',
                  'ATO receives results, not APC',
                  'APC only gets confirmation status',
                  'Mauritius DPA 2017 compliant',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Retention Policy:</span> Your sensitive raw documents are permanently deleted and purged from our systems exactly <span className="font-semibold">30 days</span> after your final verification report is delivered. Only the final anonymized confirmation of your verification status is retained for regulatory audit purposes.
            </p>
          </div>
        </motion.div>

        {/* Global Verification */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8"
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Globe size={20} className="text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Global Credential Verification</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            APC verifies pilot credentials <span className="font-semibold">globally</span> — regardless of which aviation authority issued your license. Whether your license is from CAAP (Philippines), FAA (USA), EASA (Europe), CASA (Australia), or any other ICAO-compliant authority, we can verify it.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our verification process is designed to work with any ATO worldwide. We send your documents via email and the ATO returns verification results directly to you.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8"
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Clock size={20} className="text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Expected Timeline</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            ATOs typically respond within <span className="font-semibold">3 to 14 business days</span>. Some ATOs may charge a processing fee for extracting logbook or simulator records. APC does not charge additional fees for the ATO verification step.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Mail size={20} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Questions?</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            For data protection inquiries, contact our designated Data Protection representative: <span className="font-semibold">Benjamin Bowler</span> — <a href="mailto:benjamin@pilotrecognition.com" className="text-red-500 hover:underline">benjamin@pilotrecognition.com</a>
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/get-started/verify-apc')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black tracking-wider text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Start Verification <ArrowLeft size={16} className="rotate-180" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
