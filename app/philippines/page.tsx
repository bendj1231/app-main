import React from 'react';
import { Link } from 'react-router-dom';

export default function PhilippinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-red-700 to-yellow-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-4xl">🇵🇭</span>
              <span className="text-2xl">→</span>
              <span className="text-4xl">🇦🇪</span>
            </div>
            <p className="text-yellow-300 font-semibold text-sm uppercase tracking-wide mb-4">
              For Filipino Pilots
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upgrade Your PRC License to<br />
              <span className="text-yellow-300">UAE-Recognized Credentials</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Remote learning. Dubai-affiliated certification. Save 44% through our bulk partnership. 
              We handle visa, logistics, and exam coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/programs/dubai-credential"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-lg transition-colors"
              >
                View Dubai Credential Program →
              </Link>
              <a 
                href="mailto:philippines@pilotrecognition.com" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Contact Philippines Team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The Opportunity */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your PRC License Has Limits. Dubai Credentials Open Doors.
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Philippines License ≠ Global Recognition</h3>
                  <p className="text-gray-600">Your PRC license is valid locally. But airlines in UAE, Qatar, Singapore want Dubai-affiliated training.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Traditional Dubai Training Costs ₱275,000+</h3>
                  <p className="text-gray-600">Travel, accommodation, 18,000 AED course fees. Total cost prohibitive for most Filipino pilots.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">The Remote Solution</h3>
                  <p className="text-gray-600">Study from Manila. Exam in Fujairah (UAE). Get Dubai-recognized certification. Pay 44% less.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bulk Partnership Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Standard Dubai Course</span>
                <span className="text-red-600 font-bold">₱275,000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Our Bulk Rate (10+ pilots)</span>
                <span className="text-green-600 font-bold">₱153,000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Your Savings</span>
                <span className="text-green-600 font-bold text-xl">₱122,000 (44%)</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-900 font-semibold">Plus We Handle:</span>
                <span className="text-blue-600">Visa • Logistics • Exam Booking</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Based on 18,000 AED retail vs 10,000 AED bulk rate. Savings converted to PHP (₱61/AED).
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Philippines → Dubai: How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Remote learning meets world-class certification. All logistics handled.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Remote Learning</h3>
              <p className="text-sm text-gray-600">
                Study online from Manila. Dubai-affiliated curriculum. Self-paced modules.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. We Handle Visa</h3>
              <p className="text-sm text-gray-600">
                Invitation letter for Fujairah exam. Visa processing. Travel coordination.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Exam in UAE</h3>
              <p className="text-sm text-gray-600">
                Fly to Fujairah. Take proctored exam. Dubai aviation authority recognized.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">4. Global Recognition</h3>
              <p className="text-sm text-gray-600">
                UAE-recognized credential. Apply to Etihad, Emirates, Qatar Airways, Singapore Airlines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What's Included in the Dubai Credential Package
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Remote access to Dubai-affiliated training modules</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Invitation letter for UAE exam (visa support)</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Proctored exam in Fujairah, UAE</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">UAE-recognized certification (globally accepted)</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">PilotRecognition profile boost (+15 recognition points)</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Priority access to Etihad, Emirates, Qatar Airways pathways</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Bulk Enrollment Savings</h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>1-4 Pilots</span>
                  <span className="font-bold">Standard Rate</span>
                </div>
                <p className="text-sm text-blue-200">₱275,000 per pilot</p>
              </div>
              <div className="bg-yellow-500/20 p-4 rounded-lg border-2 border-yellow-400">
                <div className="flex justify-between items-center">
                  <span>5-9 Pilots</span>
                  <span className="font-bold text-yellow-300">15% Discount</span>
                </div>
                <p className="text-sm text-blue-200">₱234,000 per pilot • Save ₱41,000</p>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg border-2 border-green-400">
                <div className="flex justify-between items-center">
                  <span>10+ Pilots</span>
                  <span className="font-bold text-green-300">44% Discount</span>
                </div>
                <p className="text-sm text-blue-200">₱153,000 per pilot • Save ₱122,000</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Round up your instructor colleagues. Group enrollment maximizes savings.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Airlines */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Your Dubai Credential Opens Doors To:
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <p className="font-bold text-lg text-gray-900">Etihad Airways</p>
              <p className="text-sm text-gray-600">Abu Dhabi, UAE</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <p className="font-bold text-lg text-gray-900">Emirates</p>
              <p className="text-sm text-gray-600">Dubai, UAE</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <p className="font-bold text-lg text-gray-900">Qatar Airways</p>
              <p className="text-sm text-gray-600">Doha, Qatar</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <p className="font-bold text-lg text-gray-900">Singapore Airlines</p>
              <p className="text-sm text-gray-600">Singapore</p>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6">
            + 50+ other airlines recognizing UAE-affiliated training credentials
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Credentials?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join fellow Filipino pilots in our next cohort. Remote learning. 
            Dubai certification. 44% savings through bulk enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:philippines@pilotrecognition.com?subject=Dubai Credential Program Inquiry"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Join Cohort Waitlist →
            </a>
            <a 
              href="tel:+4915259057144"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              WhatsApp: +49 152 59057144
            </a>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            Next exam session: Fujairah, UAE • Limited to 20 pilots per cohort
          </p>
        </div>
      </div>
    </div>
  );
}
