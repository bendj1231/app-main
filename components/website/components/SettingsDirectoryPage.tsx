import React from 'react';
import { ChevronRight, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';

interface SettingsDirectoryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

export const SettingsDirectoryPage: React.FC<SettingsDirectoryPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const settingsCategories = [
        {
            title: 'Account',
            items: [
                { name: 'Profile Settings', icon: User, description: 'Update your personal information', action: 'portal' },
                { name: 'Notifications', icon: Bell, description: 'Manage your notification preferences', action: 'notifications' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { name: 'Privacy & Security', icon: Shield, description: 'Control your data and security settings', action: 'privacy' },
                { name: 'Appearance', icon: Palette, description: 'Customize your display preferences', action: 'appearance' },
                { name: 'Language & Region', icon: Globe, description: 'Set your language and region', action: 'language' },
            ]
        },
        {
            title: 'Support',
            items: [
                { name: 'Help Center', icon: HelpCircle, description: 'Get help and support', action: 'contact-support' },
            ]
        }
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
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-600 mt-1">Manage your account and preferences</p>
                </div>
            </div>

            {/* Settings Categories */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {settingsCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">{category.title}</h2>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            {category.items.map((item, itemIndex) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={itemIndex}
                                        onClick={() => item.action === 'portal' ? onNavigate('portal') : onNavigate(item.action)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                                    >
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                            <p className="text-sm text-slate-600">{item.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
