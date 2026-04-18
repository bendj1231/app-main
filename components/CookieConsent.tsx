import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ConsentPreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}

export const CookieConsent: React.FC = () => {
    const [showConsent, setShowConsent] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true
    });

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookie-consent-preferences');
        if (!hasConsented) {
            setShowConsent(true);
        } else {
            // Load existing preferences
            try {
                const savedPrefs = JSON.parse(hasConsented);
                setPreferences(savedPrefs);
            } catch (e) {
                console.error('Error parsing cookie preferences:', e);
            }
        }
    }, []);

    const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleAccept = () => {
        const finalPreferences = {
            ...preferences,
            analytics: true,
            preferences: true
        };
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(finalPreferences));
        localStorage.setItem('cookieConsent', 'accepted');
        
        // Trigger analytics initialization if analytics is enabled
        if (finalPreferences.analytics) {
            window.dispatchEvent(new CustomEvent('analytics-consent-granted', { detail: finalPreferences }));
        }
        
        setShowConsent(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(preferences));
        
        // Trigger event with preferences
        window.dispatchEvent(new CustomEvent('analytics-consent-granted', { detail: preferences }));
        
        setShowConsent(false);
    };

    const handleDecline = () => {
        const declinedPreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: true
        };
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(declinedPreferences));
        localStorage.setItem('cookieConsent', 'declined');
        
        // Trigger event to disable analytics
        window.dispatchEvent(new CustomEvent('analytics-consent-denied'));
        
        setShowConsent(false);
    };

    const setCookie = (name: string, value: string, days: number = 365) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`;
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-4 shadow-2xl">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-white text-sm mb-2">
                            <span className="font-semibold">We use cookies</span> to enhance your experience, analyze traffic, and for security purposes.
                        </p>
                        <p className="text-slate-400 text-xs mb-3">
                            Customize your cookie preferences below.{' '}
                            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                                Learn more
                            </a>
                        </p>
                        
                        {showDetails && (
                            <div className="space-y-3 mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.necessary}
                                        disabled
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-white text-sm font-medium">Necessary</span>
                                        <p className="text-slate-400 text-xs">Required for the site to function</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-white text-sm font-medium">Analytics</span>
                                        <p className="text-slate-400 text-xs">Help us improve our services</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.preferences}
                                        onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-white text-sm font-medium">Preferences</span>
                                        <p className="text-slate-400 text-xs">Remember your settings</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-white text-sm font-medium">Marketing</span>
                                        <p className="text-slate-400 text-xs">Personalized content and ads</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                        {!showDetails && (
                            <button
                                onClick={() => setShowDetails(true)}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Customize
                            </button>
                        )}
                        
                        {showDetails ? (
                            <button
                                onClick={handleSavePreferences}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg hover:shadow-blue-500/25"
                            >
                                Save Preferences
                            </button>
                        ) : (
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg hover:shadow-blue-500/25"
                            >
                                Accept All
                            </button>
                        )}
                        
                        <button
                            onClick={handleDecline}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Decline
                        </button>
                        
                        <button
                            onClick={handleDecline}
                            className="p-2 text-slate-400 hover:text-white transition-colors sm:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
