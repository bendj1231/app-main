import React from 'react';
import { Link } from 'react-router-dom';
export default function FlightSchoolPartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Coded by Benjamin Bowler */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-4">
              For Flight Training Organizations
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bridge the Gap Between Your<br />
              <span className="text-red-500">Graduates</span> and <span className="text-red-500">Airline Careers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your graduates have the hours. But they lack what airlines actually want. 
              Partner with us to keep your pilots in the industry and connect them directly 
              with Etihad, Airbus, FedEx, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:partners@pilotrecognition.com" 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Apply to Partner →
              </a>
              <a 
                href="https://enterprise.pilotrecognition.com/framework/full"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                View Our Framework
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Missing Link in Aviation Training
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">1500 Hours Isn't Enough</h3>
                  <p className="text-gray-600">Pilots complete training with 200 hours and don't know what airlines actually require beyond the minimum.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instructors Lack the Wider Picture</h3>
                  <p className="text-gray-600">Your instructors may only know small single/multi-engine planes. They can't teach airline operations, EBT/CBTA, or type ratings.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pilots Drop Out Due to Lack of Funds</h3>
                  <p className="text-gray-600">The gap between graduation and airline-ready takes 2-3 years of instructor work. Many pilots leave the industry entirely.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <blockquote className="text-lg italic text-gray-700 mb-4">
              "We are therefore looking to save this costly period for both pilot (not having the required back up knowledge) and the airline spending time and money."
            </blockquote>
            <p className="text-sm text-gray-500">— Karl Brian Vogt, Co-founder, WM Pilot Group</p>
          </div>
        </div>
      </div>

      {/* The Solution Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Bridge the Gap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The gap period between graduation and airline employment is the ideal time 
              to build relevant knowledge, not just hours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Foundation Program</h3>
              <p className="text-gray-600 text-sm">
                9 core modules covering airline-specific knowledge your graduates don't get in training: 
                EBT/CBTA, CRM, human factors, and industry culture.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Recognition Score</h3>
              <p className="text-gray-600 text-sm">
                Your graduates build a verified profile: flight hours, licenses, ratings, 
                training completion. Airlines see exactly who meets their requirements.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Direct Pathways</h3>
              <p className="text-gray-600 text-sm">
                We partner with Etihad, FedEx, Airbus, and more. Your graduates see 
                exactly which pathways they qualify for and what's missing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Benefits for Your Flight School
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Keep Graduates in Aviation</strong>
                  <p className="text-gray-600 text-sm">Prevent dropout due to lack of career pathway visibility. Your grads stay engaged.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Revenue Share Model</strong>
                  <p className="text-gray-600 text-sm">Earn when your graduates enroll in our programs. Passive income stream.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Airline Partnerships</strong>
                  <p className="text-gray-600 text-sm">Your school becomes part of the pipeline to Etihad, Airbus, FedEx, and more.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Verified Graduate Tracking</strong>
                  <p className="text-gray-600 text-sm">See where your graduates end up. Build your placement reputation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Shared Content Model</strong>
                  <p className="text-gray-600 text-sm">Contents of the app are shared with affiliated partners. Your logo on our platform.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Already Partnered With:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="font-bold">Etihad Airways</p>
                <p className="text-sm text-gray-400">Cadet Program</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="font-bold">Airbus</p>
                <p className="text-sm text-gray-400">Training Alignment</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="font-bold">FedEx Express</p>
                <p className="text-sm text-gray-400">Cargo Operations</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="font-bold">VistaJet</p>
                <p className="text-sm text-gray-400">Corporate Aviation</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-6 text-center">
              Plus private jet operators and regional carriers across Europe, Asia-Pacific, and Middle East
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Partnership Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Apply</h3>
              <p className="text-sm text-gray-600">Submit your flight school details and training programs offered.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Interview</h3>
              <p className="text-sm text-gray-600">We discuss your graduates' needs and how our platform fits.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Integrate</h3>
              <p className="text-sm text-gray-600">Your school is added to our database. Grads get priority recognition.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="font-bold text-gray-900 mb-2">Benefit</h3>
              <p className="text-sm text-gray-600">Earn revenue share as your graduates enroll and progress.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Bridge the Gap for Your Graduates?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join European Flight Academy and other leading ATOs. 
            Keep your pilots in the industry. Connect them with airlines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:partners@pilotrecognition.com?subject=Flight School Partnership Inquiry"
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Apply to Partner →
            </a>
            <a 
              href="tel:+4915259057144"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Call Karl: +49 152 59057144
            </a>
          </div>
          <p className="text-sm text-red-200 mt-6">
            Product is 90% ready. Initial interviews now open for qualified flight schools.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">WM Pilot Group</h4>
            <p className="text-sm text-gray-600">
              Achern, Talstraße 17<br />
              77855 Baden-Württemberg, Germany
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Contact</h4>
            <p className="text-sm text-gray-600">
              <a href="mailto:partners@pilotrecognition.com" className="text-blue-600 hover:underline">
                partners@pilotrecognition.com
              </a><br />
              WhatsApp: +49 152 59057144
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Database Ownership</h4>
            <p className="text-sm text-gray-600">
              WM Pilot Group owns the pilot database.<br />
              Partners receive verified access.
            </p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
          Created by pilots for pilots. Contributed by the industry for the industry.
        </p>
      </div>
    </div>
  );
}
