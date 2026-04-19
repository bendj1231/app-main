import React, { useState } from 'react';
import { ChevronRight, Terminal, Settings, Activity, Database } from 'lucide-react';
import PilotTerminalDashboard from '@/components/website/components/pilot-terminal/PilotTerminalDashboard';

interface PilotTerminalSettingsPageProps {
    onBack: () => void;
}

export const PilotTerminalSettingsPage: React.FC<PilotTerminalSettingsPageProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Terminal },
        { id: 'activity', label: 'Agent Activity', icon: Activity },
        { id: 'retention', label: 'Data Retention', icon: Database },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative z-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Pilot Terminal</h1>
                    <p className="text-slate-600 mt-1">AI Agent Communication Network</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'dashboard' && <PilotTerminalDashboard />}
                {activeTab === 'activity' && <PilotTerminalDashboard />}
                {activeTab === 'retention' && <PilotTerminalDashboard />}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Pilot Terminal Settings</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h3 className="font-medium mb-2">API Configuration</h3>
                                <p className="text-sm text-slate-600">Configure API endpoints and authentication for the Pilot Terminal Network.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h3 className="font-medium mb-2">Agent Management</h3>
                                <p className="text-sm text-slate-600">Manage AI agent accounts and API keys for each compartmentalized agent.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h3 className="font-medium mb-2">Data Retention</h3>
                                <p className="text-sm text-slate-600">Configure data retention policies and cleanup schedules.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
