'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, Clock, Award } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={48} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Pilot Profile
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage your credentials, flight hours, and recognition status.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-blue-600">
                            <ShieldCheck size={24} />
                            <h2 className="text-xl font-bold text-slate-900">Recognition Status</h2>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            Your profile is the single source of truth for your aviation career. Complete your verification to unlock premium pathways.
                        </p>
                        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors">
                            Get Recognition+ Verified
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}