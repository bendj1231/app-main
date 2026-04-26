import React, { useState, useRef } from 'react';
import { X, User, Camera, Award, Clock, Edit } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate?: (page: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onNavigate }) => {
    const { currentUser } = useAuth();
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const [pilotId, setPilotId] = useState<string>('');
    const [totalHours, setTotalHours] = useState<number>(0);
    const [mentorshipHours, setMentorshipHours] = useState<number>(0);
    const [recognitionScore, setRecognitionScore] = useState<number>(0);
    const [isEnrolledInFoundation, setIsEnrolledInFoundation] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch profile data
    const fetchProfileData = async () => {
        if (currentUser?.uid) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('pilot_id, profile_image_url, total_flight_hours, mentorship_hours, recognition_score, enrolled_programs')
                    .eq('id', currentUser.uid)
                    .maybeSingle();
                
                if (data) {
                    setPilotId(data.pilot_id || '');
                    setProfileImageUrl(data.profile_image_url || null);
                    setTotalHours(data.total_flight_hours || 0);
                    setMentorshipHours(data.mentorship_hours || 0);
                    setRecognitionScore(data.recognition_score || 0);
                    setIsEnrolledInFoundation(data.enrolled_programs?.includes('Foundational') || false);
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            fetchProfileData();
        }
    }, [isOpen, currentUser]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser?.uid) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.uid}-${Date.now()}.${fileExt}`;
            const filePath = `profile-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile pics')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile pics')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image_url: publicUrl })
                .eq('id', currentUser.uid);

            if (updateError) throw updateError;

            setProfileImageUrl(publicUrl);
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-slate-900">Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-4 text-slate-600">Loading profile...</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <Camera className="w-4 h-4" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-900">{pilotId || currentUser?.displayName || 'Pilot'}</h3>
                                <p className="text-sm text-slate-600">{currentUser?.email}</p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600 uppercase tracking-wider">Total Hours</p>
                                    <p className="text-lg font-semibold text-slate-900">{totalHours.toFixed(1)} hrs</p>
                                </div>
                            </div>

                            {isEnrolledInFoundation && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 uppercase tracking-wider">Mentorship Hours</p>
                                        <p className="text-lg font-semibold text-slate-900">{mentorshipHours.toFixed(1)} hrs</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Award className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600 uppercase tracking-wider">Recognition Score</p>
                                    <p className="text-lg font-semibold text-slate-900">{recognitionScore.toFixed(0)}/100</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    onNavigate?.('pilot-recognition');
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            >
                                <User className="w-5 h-5" />
                                View Recognition Profile
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate?.('portal');
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
