'use client';

import { Quote, Plane, CheckCircle, XCircle } from 'lucide-react';

export default function AirbusQuote() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-4 py-2 mb-6">
              <Plane className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-bold">Manufacturer Confirmation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              The Qualification Paradox
            </h2>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white mb-8">
            <Quote className="w-12 h-12 text-blue-300 mb-6" />

            <blockquote className="text-2xl md:text-3xl font-bold mb-6">
              "A 200-hour pilot is more than qualified to fly an Airbus A320 because they've done
              the rating, they've done the training."
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-bold text-xl">A</span>
              </div>
              <div>
                <div className="font-bold text-lg">Airbus</div>
                <div className="text-blue-200">Aircraft Manufacturer</div>
              </div>
            </div>
          </div>

          {/* The Contradiction */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Airbus Says */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">Manufacturer Says</h3>
              </div>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>
                    200 hours + A320 rating = <strong>QUALIFIED</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Training completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Ready to fly</span>
                </li>
              </ul>
            </div>

            {/* Industry Says */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-800">Industry Says</h3>
              </div>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">✗</span>
                  <span>
                    200 hours = <strong>"HIGH RISK"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✗</span>
                  <span>Need 1,500 hours minimum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✗</span>
                  <span>Not experienced enough</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The Disconnect */}
          <div className="mt-8 text-center">
            <p className="text-xl text-[#1e3a5f] font-bold">
              The people who <span className="text-blue-600">BUILD</span> the planes say you're
              ready.
            </p>
            <p className="text-xl text-[#1e3a5f] font-bold mt-2">
              The people who <span className="text-red-600">FLY</span> them say you're not.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
