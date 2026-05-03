import React, { useEffect } from 'react';
import { W1App } from '@/external-references/W12/index.tsx';
import { ArrowLeft, Maximize2 } from 'lucide-react';

interface W1000PageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
}

const W1000Page: React.FC<W1000PageProps> = ({ onBack, onNavigate }) => {
    // Hide side panel when W12 loads
    useEffect(() => {
        // Add a class to body to hide any global side panels
        document.body.classList.add('w12-fullscreen');
        return () => {
            document.body.classList.remove('w12-fullscreen');
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="h-screen w-screen bg-black overflow-hidden relative">
            {/* Floating control buttons */}
            <div className="absolute top-4 left-4 z-[9999] flex gap-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-lg border border-white/30 px-3 py-2 rounded-lg hover:bg-black/80 transition-all group shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                    <span className="text-white text-xs font-medium">Back</span>
                </button>
                
                <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-lg border border-white/30 px-3 py-2 rounded-lg hover:bg-black/80 transition-all group shadow-lg"
                    title="Toggle Fullscreen"
                >
                    <Maximize2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-white text-xs font-medium">FS</span>
                </button>
            </div>
            
            {/* W12 Application - Full Screen without side tools */}
            <div className="h-full w-full">
                <style>{`
                    .w12-fullscreen .side-panel,
                    .w12-fullscreen .sidebar,
                    .w12-fullscreen .side-controls {
                        display: none !important;
                    }
                    .w12-fullscreen .main-content {
                        margin-left: 0 !important;
                    }
                `}</style>
                <W1App />
            </div>
        </div>
    );
};

export default W1000Page;
