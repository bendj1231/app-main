import React, { useEffect, useState, Component, ErrorInfo } from 'react';
import PortalApp from '../../../../portal/App';
import { AuthBridge } from './AuthBridge';

interface PortalWrapperProps {
    onNavigate: (page: string) => void;
    onBack: () => void;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Portal Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
                    <div className="text-white text-center">
                        <h2 className="text-2xl font-bold mb-4">Portal Error</h2>
                        <p className="text-slate-400 mb-4">The portal encountered an error. Please try refreshing the page.</p>
                        {this.state.error && (
                            <p className="text-red-400 text-sm mb-4">{this.state.error.message}</p>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export const PortalWrapper: React.FC<PortalWrapperProps> = ({ onNavigate, onBack }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);

        // CSS loading disabled due to MIME type errors
        // The portal CSS is causing conflicts with the main app
        // const loadPortalCSS = () => {
        //     try {
        //         const appCSS = document.createElement('link');
        //         appCSS.rel = 'stylesheet';
        //         appCSS.href = '/portal/App.css';
        //         appCSS.id = 'portal-app-css';
        //         document.head.appendChild(appCSS);

        //         const indexCSS = document.createElement('link');
        //         indexCSS.rel = 'stylesheet';
        //         indexCSS.href = '/portal/index.css';
        //         indexCSS.id = 'portal-index-css';
        //         document.head.appendChild(indexCSS);
        //     } catch (error) {
        //         console.error('Error loading portal CSS:', error);
        //     }
        // };

        // loadPortalCSS();

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
        <ErrorBoundary>
            <AuthBridge>
                <div className="portal-container">
                    <PortalApp />
                </div>
            </AuthBridge>
        </ErrorBoundary>
    );
};
