/**
 * ScoreOptimizationPage Component
 * 
 * Full page for viewing all recognition score optimization tips
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Loader2 } from 'lucide-react';
import { ScoreOptimizationGuide } from '../../../ScoreOptimizationGuide';
import { calculateRecognitionScore } from '../../../../lib/pilot-recognition-score';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface ScoreOptimizationPageProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
    profileData?: any;
}

export const ScoreOptimizationPage: React.FC<ScoreOptimizationPageProps> = ({
    onNavigate,
    onBack,
    profileData: externalProfileData,
}) => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState<any>(externalProfileData || null);

    // Fetch profile data if not provided externally
    useEffect(() => {
        if (externalProfileData) {
            setProfileData(externalProfileData);
            return;
        }

        const fetchProfileData = async () => {
            if (!currentUser?.uid) {
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.uid)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching profile data:', error);
                } else if (data) {
                    setProfileData(data);
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
            }
        };

        fetchProfileData();
    }, [currentUser?.uid, externalProfileData]);

    const currentScore = calculateRecognitionScore({
        stats: {
            totalHours: profileData?.total_hours || profileData?.total_flight_hours || 0,
            picHours: profileData?.pic_hours || 0,
            ifrHours: profileData?.ifr_hours || 0,
            nightHours: profileData?.night_hours || 0,
        },
        experience: {
            years: profileData?.experience_years || 0,
            achievements: profileData?.certifications?.length || 0,
            licenses: profileData?.type_ratings?.length || 0,
        },
        assessments: {
            programCompletion: 0,
            performanceScore: profileData?.overall_recognition_score || 0,
        },
        mentorship: {
            hours: 0,
            observations: 0,
            cases: 0,
        },
    });

    return (
        <div style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem', minHeight: '100vh' }}>
            <main style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
                {/* Header */}
                <header style={{ 
                    padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <button
                        onClick={onBack || (() => onNavigate('recognition-profile'))}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            color: '#64748b',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Profile
                    </button>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Target size={28} style={{ color: '#0ea5e9' }} />
                            <h1 style={{ 
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                                fontWeight: 600, 
                                color: '#0f172a',
                                fontFamily: 'Georgia, serif',
                                margin: 0
                            }}>
                                Score Optimization Guide
                            </h1>
                        </div>
                        <p style={{ 
                            margin: '0.5rem 0 0', 
                            color: '#64748b', 
                            lineHeight: 1.6, 
                            fontSize: '1rem',
                            maxWidth: '700px'
                        }}>
                            Personalized recommendations to improve your pilot recognition score. 
                            Follow these actionable tips to increase your score and enhance your career prospects.
                        </p>
                    </div>
                </header>

                {/* Full Optimization Guide */}
                <section style={{ padding: '0 clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
                    <ScoreOptimizationGuide
                        currentScore={currentScore}
                        isPremium={false}
                        userId={profileData?.user_id}
                        limit={undefined} // Show all tips
                        onNavigate={onNavigate}
                    />
                </section>
            </main>
        </div>
    );
};
