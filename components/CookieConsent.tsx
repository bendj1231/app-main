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
        <>
            {/* Backdrop — dismisses without accepting on click */}
            <div className="fixed inset-0 z-[50] bg-black/20" onClick={handleDecline} />

            {/* Modal card */}
            <div className="fixed z-[51] bottom-4 left-4 right-4 sm:bottom-8 sm:right-8 sm:left-auto w-auto sm:w-full sm:max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                {/* Close button */}
                <button
                    onClick={handleAccept}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Body text */}
                <p className="text-slate-800 text-base leading-relaxed mb-6">
                    To provide and personalize our offerings and improve our services, we use site tools that collect and record your data, and which may share this data with third parties, such as ad vendors, social media companies, and research partners. This may be &ldquo;targeted advertising,&rdquo; &ldquo;selling,&rdquo; or &ldquo;sharing&rdquo; under certain privacy laws. Continuing to browse our site means you accept these terms and our{' '}
                    <a href="/privacy" className="text-blue-600 font-semibold hover:underline">
                        Privacy Policy
                    </a>
                </p>

                {/* Opt Out link */}
                <button
                    onClick={handleDecline}
                    className="text-blue-600 text-base underline hover:text-blue-800 transition-colors"
                >
                    Opt Out
                </button>
            </div>
        </>
    );
};
