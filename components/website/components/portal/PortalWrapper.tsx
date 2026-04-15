import React, { useEffect, useState } from 'react';
import PortalApp from '../../../../portal/App';

interface PortalWrapperProps {
    onNavigate: (page: string) => void;
    onBack: () => void;
}

export const PortalWrapper: React.FC<PortalWrapperProps> = ({ onNavigate, onBack }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Portal...</div>
            </div>
        );
    }

    return (
        <div className="portal-container">
            <PortalApp />
        </div>
    );
};
