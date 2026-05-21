import React, { useState } from 'react';
import { ChevronRight, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, Terminal, CreditCard, Trash2 } from 'lucide-react';
import { StorageEngineCard } from './StorageEngineCard';
import { supabase } from '../../../src/lib/supabase';

interface SettingsDirectoryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

export const SettingsDirectoryPage: React.FC<SettingsDirectoryPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setDeleting(true);
        setDeleteError('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error('Not authenticated');
            await supabase.from('profiles').delete().eq('id', session.user.id);
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (e: any) {
            setDeleteError(e?.message || 'Failed to delete account.');
            setDeleting(false);
        }
    };
    const settingsCategories = [
        {
            title: 'Account',
            items: [
                { name: 'Profile Settings', icon: User, description: 'Update your personal information', action: 'portal' },
                { name: 'Subscription & Billing', icon: CreditCard, description: 'Manage your subscription plan', action: 'subscription' },
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
            title: 'Systems',
            items: [
                { name: 'Pilot Terminal', icon: Terminal, description: 'AI Agent Communication Network', action: 'pilot-terminal-settings' },
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

                {/* Danger Zone — Account Deletion */}
                <div>
                    <h2 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
                    <p className="text-sm text-slate-500 mb-4">Irreversible actions that permanently affect your account.</p>
                    <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">Delete Account</h3>
                                <p className="text-sm text-slate-500">Permanently delete your account and all data. This cannot be undone.</p>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete confirmation modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <h3 className="text-lg font-black text-red-600 mb-2">Delete your account?</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                This will permanently delete your profile, credentials, wallet, and all associated data. <strong>This cannot be undone.</strong> Under GDPR Article 17, your data will be erased within 30 days.
                            </p>
                            <p className="text-xs font-semibold text-slate-500 mb-2">Type <span className="font-mono font-black text-red-600">DELETE</span> to confirm:</p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={e => setDeleteConfirmText(e.target.value)}
                                placeholder="Type DELETE"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-red-400"
                            />
                            {deleteError && <p className="text-xs text-red-600 mb-3">{deleteError}</p>}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeleteError(''); }}
                                    className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={deleteConfirmText !== 'DELETE' || deleting}
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-lg transition-colors"
                                >
                                    {deleting ? 'Deleting...' : 'Delete My Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Infrastructure — Article 3 DCA v1.6 */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Data Infrastructure</h2>
                    <p className="text-sm text-slate-500 mb-4">Configure your encrypted storage engine routing per Article 3 of the Data Controller Agreement.</p>
                    <StorageEngineCard />
                </div>
            </div>
        </div>
    );
};
