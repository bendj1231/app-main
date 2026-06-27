import React, { useEffect } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { TopNavbar } from './TopNavbar';

interface W2000ApplicationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
}

export const W2000ApplicationPage: React.FC<W2000ApplicationPageProps> = ({ onBack, onNavigate }) => {
    useEffect(() => {
        
        // Use the working version of W2000 (index.html is now the simple version)
        const w2000Url = '/W2000/index.html';
        
        // Method 1: Try window.open
        try {
            const newWindow = window.open(w2000Url, '_blank', 'noopener,noreferrer');
            if (newWindow) {
                newWindow.focus();
            } else {
                // Method 2: Fallback to redirect
                safeRedirect(w2000Url);
            }
        } catch (error) {
            console.error('[DEBUG W2000ApplicationPage] Error opening W2000:', error);
            // Method 3: Fallback to redirect
            safeRedirect(w2000Url);
        }
        
        // Navigate back to Portal 2 programs tab after a short delay
        setTimeout(() => {
            onNavigate('access-portal-2?tab=programs');
        }, 500);
    }, [onBack, onNavigate]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Opening W2000 Application...</p>
                <p className="text-slate-400 text-sm mt-2">If it doesn't open, check your popup blocker</p>
            </div>
        </div>
    );
};
