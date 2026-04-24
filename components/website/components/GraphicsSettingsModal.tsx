import React, { useState, useEffect } from 'react';
import { X, Monitor, Zap, Check } from 'lucide-react';
import { getDevicePerformanceTier } from '@/src/lib/device-detection';

type GraphicsQuality = 'auto' | 'low' | 'medium' | 'high';

interface GraphicsSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GraphicsSettingsModal({ isOpen, onClose }: GraphicsSettingsModalProps) {
    const [quality, setQuality] = useState<GraphicsQuality>('auto');
    const [detectedTier, setDetectedTier] = useState<string>('');

    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem('graphicsQuality') as GraphicsQuality;
        if (saved) {
            setQuality(saved);
        }
        
        // Detect current device tier
        const tier = getDevicePerformanceTier();
        setDetectedTier(tier);
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
                        <div>
                            <p className="text-sm font-medium text-slate-900">Detected Device</p>
                            <p className="text-xs text-slate-600 mt-1">
                                {detectedTier === 'low' && 'Low-end device detected'}
                                {detectedTier === 'medium' && 'Medium-end device detected'}
                                {detectedTier === 'high' && 'High-end device detected'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-slate-600" />
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
