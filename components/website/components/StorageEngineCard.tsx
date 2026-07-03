import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

type StoragePreference = 'multi' | 'd1' | 'firebase';

const ENGINE_OPTIONS: {
    value: StoragePreference;
    label: string;
    sublabel: string;
    badge?: string;
    badgeColor?: string;
    description: string;
    risk?: string;
}[] = [
    {
        value: 'multi',
        label: 'Active-Active Multi-Engine',
        sublabel: 'Cloudflare D1 + Google LLC (Firebase)',
        badge: 'Recommended',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        description:
            'Simultaneous AES-256-GCM ciphertext mirroring to both database engines. Maximum redundancy — if one engine experiences an outage, your encrypted data remains fully available on the other.',
    },
    {
        value: 'd1',
        label: 'Cloudflare D1 Engine Only',
        sublabel: 'Single-engine configuration',
        description:
            'Encrypted ciphertext routed exclusively to the Cloudflare D1 infrastructure environment.',
        risk:
            'You assume all operational risks for localized Cloudflare D1 outages or downtime. This downgrades your disaster recovery posture below GDPR Art. 32 recommended redundancy.',
    },
    {
        value: 'firebase',
        label: 'Firebase Engine Only',
        sublabel: 'Single-engine configuration',
        description:
            'Encrypted ciphertext routed exclusively to the Google LLC (Firebase) infrastructure environment.',
        risk:
            'You assume all operational risks for localized Google LLC (Firebase) outages or downtime. This downgrades your disaster recovery posture below GDPR Art. 32 recommended redundancy.',
    },
];

interface StorageEngineCardProps {
    className?: string;
}

export const StorageEngineCard: React.FC<StorageEngineCardProps> = ({ className = '' }) => {
    const { currentUser } = useAuth();
    const { callApi } = useWorkerAuth();
    const [preference, setPreference] = useState<StoragePreference>('multi');
    const [pendingPreference, setPendingPreference] = useState<StoragePreference | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [showRiskConfirm, setShowRiskConfirm] = useState(false);
    const [riskAcknowledged, setRiskAcknowledged] = useState(false);

    // Load current preference from profiles on mount
    useEffect(() => {
        if (!currentUser?.id) return;
        callApi<Record<string, unknown>[]>('queryTable', {
            table: 'profiles',
            operation: 'select',
            where: { id: currentUser.id },
            limit: 1,
        }).then((rows) => {
            const data = rows?.[0];
            if (data?.storage_preference) {
                setPreference(data.storage_preference as StoragePreference);
            }
        });
    }, [currentUser?.id]);

    const handleSelect = (value: StoragePreference) => {
        if (value === preference) return;
        setError('');
        setSaved(false);
        if (value !== 'multi') {
            setPendingPreference(value);
            setRiskAcknowledged(false);
            setShowRiskConfirm(true);
        } else {
            applyPreference(value);
        }
    };

    const applyPreference = async (value: StoragePreference, acknowledged = false) => {
        if (!currentUser?.id) return;
        setSaving(true);
        setError('');
        try {
            await callApi('queryTable', {
                table: 'profiles',
                operation: 'update',
                id: currentUser.id,
                data: {
                    storage_preference: value,
                    updated_at: new Date().toISOString(),
                },
            });

            // Log operational risk acknowledgment timestamp if downgrading from multi
            if (value !== 'multi' && acknowledged) {
                try {
                    await callApi('queryTable', {
                        table: 'storage_risk_acknowledgments',
                        operation: 'insert',
                        data: {
                            user_id: currentUser.id,
                            engine: value,
                            acknowledged_at: new Date().toISOString(),
                        },
                    });
                } catch {
                    console.warn('[storage] Risk acknowledgment insert failed — preference saved to profiles table');
                }
            }

            setPreference(value);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) {
            setError(e.message || 'Failed to save preference. Please try again.');
        } finally {
            setSaving(false);
            setShowRiskConfirm(false);
            setPendingPreference(null);
        }
    };

    const selectedOption = ENGINE_OPTIONS.find(o => o.value === preference)!;
    const pendingOption = ENGINE_OPTIONS.find(o => o.value === pendingPreference);

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-800 font-bold text-sm">Storage Engine Configuration</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">Art. 3 — DCA v1.6</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Your encrypted ciphertext routing preference. You have absolute freedom of choice per PR-DCA-001 Article 3.
                    </p>
                </div>
                {saved && (
                    <span className="flex-shrink-0 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Saved
                    </span>
                )}
            </div>

            {/* Engine options */}
            <div className="p-4 space-y-3">
                {ENGINE_OPTIONS.map(opt => {
                    const isActive = preference === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            disabled={saving}
                            className={`w-full text-left rounded-xl border p-4 transition-all duration-150 ${
                                isActive
                                    ? 'border-indigo-300 bg-indigo-50/60 shadow-sm'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            } ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Radio indicator */}
                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                    isActive ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'
                                }`}>
                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <span className={`text-sm font-semibold ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                                            {opt.label}
                                        </span>
                                        {opt.badge && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{opt.sublabel}</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Current status strip */}
            <div className="px-4 pb-4">
                <div className={`rounded-xl p-3 text-xs leading-relaxed flex items-start gap-2 ${
                    preference === 'multi'
                        ? 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                }`}>
                    <span className="text-base leading-none mt-0.5">{preference === 'multi' ? '✅' : '⚠️'}</span>
                    <span>
                        <strong>Active: </strong>{selectedOption.label}.{' '}
                        {preference === 'multi'
                            ? 'Your encrypted payload is mirrored to both engines simultaneously.'
                            : selectedOption.risk}
                    </span>
                </div>
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>

            {/* Operational risk confirmation modal */}
            {showRiskConfirm && pendingOption && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowRiskConfirm(false); setPendingPreference(null); }} />
                    <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-2xl leading-none">⚠️</span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base mb-1">Operational Risk Acknowledgment</h3>
                                <p className="text-xs text-slate-500">Article 3 — PR-DCA-001 v1.6</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">
                            You are downgrading to <strong>{pendingOption.label}</strong>.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed mb-5">
                            {pendingOption.risk}
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer mb-5">
                            <input
                                type="checkbox"
                                checked={riskAcknowledged}
                                onChange={e => setRiskAcknowledged(e.target.checked)}
                                className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer flex-shrink-0"
                            />
                            <span className="text-xs text-slate-700 leading-relaxed">
                                I understand and accept all operational risks of a single-engine configuration as stated in Article 3 of the Data Controller Agreement (PR-DCA-001 v1.6).
                            </span>
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowRiskConfirm(false); setPendingPreference(null); }}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                            >
                                Cancel — Keep Multi-Engine
                            </button>
                            <button
                                onClick={() => pendingPreference && applyPreference(pendingPreference, true)}
                                disabled={!riskAcknowledged || saving}
                                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Confirm Downgrade'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
