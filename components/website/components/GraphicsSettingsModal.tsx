import React, { useState, useEffect } from 'react';
import { X, Monitor, Zap, Check } from 'lucide-react';
import { getHomepageGraphicsConfig } from '@/lib/device-detection';

type GraphicsQuality = 'auto' | 'low' | 'medium' | 'high';

interface GraphicsSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GraphicsSettingsModal({ isOpen, onClose }: GraphicsSettingsModalProps) {
    const [quality, setQuality] = useState<GraphicsQuality>('auto');
    const [detectedLabel, setDetectedLabel] = useState<string>('');
    const [detectedTier, setDetectedTier] = useState<string>('');

    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem('graphicsQuality') as GraphicsQuality;
        if (saved) {
            setQuality(saved);
        }

        // Detect current device using rich config
        const cfg = getHomepageGraphicsConfig();
        setDetectedTier(cfg.tier);
        setDetectedLabel(cfg.deviceLabel);
    }, []);

    const handleQualityChange = (newQuality: GraphicsQuality) => {
        setQuality(newQuality);
        localStorage.setItem('graphicsQuality', newQuality);
        
        // Reload page to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const getQualityLabel = (q: GraphicsQuality) => {
        switch (q) {
            case 'auto': return 'Automatic (Recommended)';
            case 'low': return 'Low Performance';
            case 'medium': return 'Balanced';
            case 'high': return 'High Quality';
        }
    };

    const getQualityDescription = (q: GraphicsQuality) => {
        switch (q) {
            case 'auto': return 'Automatically adjusts based on your device';
            case 'low': return 'Disables all shaders and animations for maximum performance';
            case 'medium': return 'Disables shaders but keeps animations';
            case 'high': return 'Full experience with all visual effects';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <style>{`
                .materialize-child {
                    animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    opacity: 0;
                }
                .stagger-1 { animation-delay: 0.05s; }
                .stagger-2 { animation-delay: 0.10s; }
                .stagger-3 { animation-delay: 0.15s; }
                .stagger-4 { animation-delay: 0.20s; }
                .stagger-5 { animation-delay: 0.25s; }
                .stagger-6 { animation-delay: 0.30s; }
                .stagger-7 { animation-delay: 0.35s; }
            `}</style>
            <div className="bg-[#0f172a]/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 materialize-child stagger-1">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 materialize-child stagger-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Graphics Settings</h2>
                            <p className="text-sm text-[#9ca3af]">Adjust visual quality for performance</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                </div>

                {/* Device Info */}
                <div className="p-6 bg-white/5 border-b border-white/10 materialize-child stagger-2">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-medium text-white">Detected Device</p>
                            <p className="text-xs text-[#9ca3af] mt-1 font-medium truncate">{detectedLabel || 'Detecting...'}</p>
                            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                detectedTier === 'high' ? 'bg-green-500/20 text-green-400' :
                                detectedTier === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {detectedTier === 'high' ? 'High-end' : detectedTier === 'medium' ? 'Mid-range' : 'Low-end'} · Auto-detected
                            </span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            detectedTier === 'high' ? 'bg-green-500/20' : detectedTier === 'medium' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                        }`}>
                            <Zap className={`w-5 h-5 ${
                                detectedTier === 'high' ? 'text-green-400' : detectedTier === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`} />
                        </div>
                    </div>
                </div>

                {/* Quality Options */}
                <div className="p-6 space-y-3 materialize-child stagger-3">
                    <p className="text-sm font-medium text-white mb-4">Graphics Quality</p>

                    {(['auto', 'low', 'medium', 'high'] as GraphicsQuality[]).map((q, idx) => (
                        <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left materialize-child stagger-${idx + 4} ${
                                quality === q
                                    ? 'border-sky-500 bg-sky-500/10'
                                    : 'border-white/15 hover:border-white/25 hover:bg-white/5'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{getQualityLabel(q)}</span>
                                        {quality === q && (
                                            <Check className="w-4 h-4 text-sky-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-[#9ca3af] mt-1 pb-2">{getQualityDescription(q)}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/10 materialize-child stagger-6">
                    <p className="text-xs text-slate-400 text-center">
                        Changes will apply instantly
                    </p>
                </div>
            </div>
        </div>
    );
}
