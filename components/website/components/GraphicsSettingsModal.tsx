import React, { useState, useEffect } from 'react';
import { X, Monitor, Zap, Check } from 'lucide-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';

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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Graphics Settings</h2>
                            <p className="text-sm text-slate-600">Adjust visual quality for performance</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Device Info */}
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-medium text-slate-900">Detected Device</p>
                            <p className="text-xs text-slate-700 mt-1 font-medium truncate">{detectedLabel || 'Detecting...'}</p>
                            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                detectedTier === 'high' ? 'bg-green-100 text-green-700' :
                                detectedTier === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {detectedTier === 'high' ? 'High-end' : detectedTier === 'medium' ? 'Mid-range' : 'Low-end'} · Auto-detected
                            </span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            detectedTier === 'high' ? 'bg-green-100' : detectedTier === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                            <Zap className={`w-5 h-5 ${
                                detectedTier === 'high' ? 'text-green-600' : detectedTier === 'medium' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                        </div>
                    </div>
                </div>

                {/* Quality Options */}
                <div className="p-6 space-y-3">
                    <p className="text-sm font-medium text-slate-900 mb-4">Graphics Quality</p>
                    
                    {(['auto', 'low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                        <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                quality === q
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900">{getQualityLabel(q)}</span>
                                        {quality === q && (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{getQualityDescription(q)}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                        Changes will take effect after page reload
                    </p>
                </div>
            </div>
        </div>
    );
}
