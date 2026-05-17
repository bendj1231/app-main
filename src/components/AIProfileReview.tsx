import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PendingProfile {
    id: string;
    estimated_flight_hours: string | null;
    license_type: string | null;
    license_ratings: string[] | null;
    type_ratings: string[] | null;
    pathway_interests: string[] | null;
    program_interests: string[] | null;
    confidence_score: number | null;
    created_at: string;
    source: string;
}

export const AIProfileReview: React.FC = () => {
    const [pending, setPending] = useState<PendingProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    // Session ID from browser storage (set by landing page or AI interaction)
    const sessionId = localStorage.getItem('pr_pending_session_id');

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }
        loadPendingProfile();
    }, [sessionId]);

    async function loadPendingProfile() {
        try {
            const { data, error } = await supabase
                .from('pending_profiles')
                .select('*')
                .eq('session_id', sessionId)
                .eq('approval_status', 'pending')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            setPending(data);
        } catch (err) {
            console.error('Failed to load pending profile:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove() {
        if (!sessionId) return;
        setProcessing(true);
        try {
            const { data, error } = await supabase
                .rpc('promote_pending_profile', { p_session_id: sessionId });

            if (error) throw error;

            setResult('Profile approved and synced to your account.');
            setPending(null);
            localStorage.removeItem('pr_pending_session_id');
        } catch (err: any) {
            setResult(`Error: ${err.message}`);
        } finally {
            setProcessing(false);
        }
    }

    async function handleReject() {
        if (!pending) return;
        setProcessing(true);
        try {
            await supabase
                .from('pending_profiles')
                .update({ approval_status: 'rejected', updated_by: 'user_rejection' })
                .eq('id', pending.id);

            setResult('AI-generated profile rejected. You can enter your data manually.');
            setPending(null);
            localStorage.removeItem('pr_pending_session_id');
        } catch (err: any) {
            setResult(`Error: ${err.message}`);
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <div className="text-center py-8 text-slate-500">Loading...</div>;
    if (!pending) return null;

    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    AI-Generated Profile Detected
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                    Our system pre-filled some profile data based on your interactions.
                    Please review before it goes live.
                </p>
            </div>

            <div className="p-6 space-y-4">
                {pending.estimated_flight_hours && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Estimated Flight Hours</span>
                        <span className="font-semibold text-slate-900">{pending.estimated_flight_hours}</span>
                    </div>
                )}
                {pending.license_type && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">License Type</span>
                        <span className="font-semibold text-slate-900">{pending.license_type}</span>
                    </div>
                )}
                {pending.license_ratings && pending.license_ratings.length > 0 && (
                    <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-600 block mb-1">Ratings</span>
                        <div className="flex flex-wrap gap-2">
                            {pending.license_ratings.map(r => (
                                <span key={r} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-700">{r}</span>
                            ))}
                        </div>
                    </div>
                )}
                {pending.pathway_interests && pending.pathway_interests.length > 0 && (
                    <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-600 block mb-1">Pathway Interests</span>
                        <div className="flex flex-wrap gap-2">
                            {pending.pathway_interests.map(p => (
                                <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{p}</span>
                            ))}
                        </div>
                    </div>
                )}

                {pending.confidence_score !== null && (
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>AI confidence:</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pending.confidence_score}%` }}
                            />
                        </div>
                        <span>{pending.confidence_score}%</span>
                    </div>
                )}

                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
                    <strong>Data provenance:</strong> Generated by {pending.source} on{' '}
                    {new Date(pending.created_at).toLocaleDateString()}.
                    This data has not been verified. You are responsible for its accuracy.
                </div>

                {result && (
                    <div className={`rounded-lg p-3 text-sm ${result.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {result}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleReject}
                        disabled={processing}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Reject & Enter Manually
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Approve & Sync'}
                    </button>
                </div>
            </div>
        </div>
    );
};
