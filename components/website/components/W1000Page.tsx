import React, { useEffect, useState } from 'react';
import { W1000App } from '../../../portal/components/w1000/W1000App';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface W1000PageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
}

const W1000Page: React.FC<W1000PageProps> = ({ onBack, onNavigate }) => {
    const navigate = useNavigate();
    const { currentUser, userProfile, logout } = useAuth();
    const { callApi } = useWorkerAuth();
    const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; is_read: boolean; created_at: string }>>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [w12UserProfile, setW12UserProfile] = useState<{ displayName?: string; email?: string; avatarUrl?: string } | undefined>(undefined);

    // Initialize w12UserProfile and fetch profile image
    useEffect(() => {
        const initProfile = async () => {
            let profile = userProfile ? {
                displayName: userProfile.display_name || userProfile.displayName || currentUser?.email?.split('@')[0],
                email: currentUser?.email,
                avatarUrl: userProfile.profile_image_url || userProfile.avatar_url || userProfile.avatarUrl
            } : currentUser ? {
                displayName: currentUser.email?.split('@')[0],
                email: currentUser.email,
                avatarUrl: undefined
            } : undefined;

            // Fetch profile image from profiles table if not already set
            if (currentUser?.uid && !profile?.avatarUrl) {
                try {
                    const rows = await callApi<Record<string, unknown>[]>('queryTable', {
                        table: 'profiles',
                        operation: 'select',
                        where: { id: currentUser.uid },
                        limit: 1,
                    });
                    const data = rows?.[0];
                    if (data && data.profile_image_url) {
                        profile = { ...profile, avatarUrl: data.profile_image_url as string };
                    }
                } catch (err) {
                    console.error('Error fetching profile image:', err);
                }
            }

            setW12UserProfile(profile);
        };

        initProfile();
    }, [userProfile, currentUser]);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (userProfile?.id) {
                try {
                    const data = await callApi<Record<string, unknown>[]>('queryTable', {
                        table: 'notifications',
                        operation: 'select',
                        where: { user_id: userProfile.id },
                        limit: 10,
                    });
                    const sorted = (data || []).sort((a: any, b: any) => {
                        const ca = a.created_at || '';
                        const cb = b.created_at || '';
                        return cb.localeCompare(ca);
                    });
                    setNotifications(sorted as any);
                    const unreadCount = sorted.filter((n: any) => !n.is_read).length;
                    setNotificationCount(unreadCount);
                } catch (err) {
                    console.error('Error fetching notifications:', err);
                }
            }
        };

        fetchNotifications();
    }, [userProfile]);

    // Hide side panel when W12 loads
    useEffect(() => {
        // Add a class to body to hide any global side panels
        document.body.classList.add('w12-fullscreen');
        return () => {
            document.body.classList.remove('w12-fullscreen');
        };
    }, []);

    // Handle logout message from W12 iframe
    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.data.action === 'logout') {
                try {
                    // Sign out via Auth0
                    await logout();
                    // Navigate to home page
                    navigate('/');
                } catch (error) {
                    console.error('Logout error:', error);
                    // Fallback: still navigate to home page even if logout fails
                    navigate('/');
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

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
                {w12UserProfile ? (
                    <W1000App userProfile={w12UserProfile} />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-black">
                        <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default W1000Page;
