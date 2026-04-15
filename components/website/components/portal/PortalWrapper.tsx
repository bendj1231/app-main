import React, { useEffect, useState } from 'react';
import PortalApp from '../../../../portal/App';
import { AuthBridge } from './AuthBridge';

interface PortalWrapperProps {
    onNavigate: (page: string) => void;
    onBack: () => void;
}

export const PortalWrapper: React.FC<PortalWrapperProps> = ({ onNavigate, onBack }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);

        // Load portal CSS
        const loadPortalCSS = () => {
            const appCSS = document.createElement('link');
            appCSS.rel = 'stylesheet';
            appCSS.href = '/portal/App.css';
            appCSS.id = 'portal-app-css';
            document.head.appendChild(appCSS);

            const indexCSS = document.createElement('link');
            indexCSS.rel = 'stylesheet';
            indexCSS.href = '/portal/index.css';
            indexCSS.id = 'portal-index-css';
            document.head.appendChild(indexCSS);
        };

        loadPortalCSS();

        // Cleanup function to remove portal CSS when unmounting
        return () => {
            const appCSS = document.getElementById('portal-app-css');
            const indexCSS = document.getElementById('portal-index-css');
            if (appCSS) appCSS.remove();
            if (indexCSS) indexCSS.remove();
        };
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Portal...</div>
            </div>
        );
    }

    // Portal has its own internal routing system - keeping systems separate
    return (
        <AuthBridge>
            <div className="portal-container">
                <PortalApp />
            </div>
        </AuthBridge>
    );
};
