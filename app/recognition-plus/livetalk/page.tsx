'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function RecognitionPlusLiveTalkPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/recognition-plus"
            className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold"
          >
            ← Back to Recognition+ Plans
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Recognition+ Live Talk
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          This tier is designed for pilots who want additional opportunities and guidance.
        </p>

        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Next step</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Return to the Recognition+ page to review all pilot plan details.
          </p>

          <Link
            to="/recognition-plus"
            className="inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 transition-colors"
          >
            View plans
          </Link>
        </div>
      </div>
    </div>
  );
}
