import React, { useState } from 'react';
import { LineChart } from 'lucide-react';

export const ProgramProgress = ({ connected, onConnect }: { connected: boolean; onConnect: () => void }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) onConnect();
    };

    if (!connected) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-slate-800">Program Progress Analytics</h2>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto py-16">
                    <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LineChart size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Connect Analytics Account</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Please sign in to your JotForm account to securely load your personalized program analytics, flight hours, and progress reports.
                    </p>

                    <form onSubmit={handleConnect} className="max-w-sm mx-auto space-y-4">
                        <input
                            type="text"
                            placeholder="JotForm Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                        >
                            Sign In & Load Analytics
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Program Progress Analytics</h2>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Live Analytics Synced
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[800px] relative">
                <iframe
                    src="https://www.jotform.com/report/240087115842049"
                    className="w-full h-full border-0"
                    title="Program Analytics"
                ></iframe>
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center -z-10">
                    <p className="text-slate-400 animate-pulse">Loading Secured Analytics Dashboard...</p>
                </div>
            </div>
        </div>
    );
};
