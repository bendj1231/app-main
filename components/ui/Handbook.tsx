import React from 'react';
import { BookOpen } from 'lucide-react';

export const Handbook = () => (
    <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800">Program Operating Handbook</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['General Operations', 'Emergency Procedures', 'Aircraft Systems', 'Performance Data', 'Safety Protocols', 'Communication Standards'].map((item) => (
                <div key={item} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="font-semibold text-slate-700">{item}</span>
                        </div>
                        <span className="text-xs text-slate-400">PDF • 2.4 MB</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
