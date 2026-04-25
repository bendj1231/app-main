/**
 * RecognitionScoreInfoPage Component
 * 
 * Informational page about the recognition score system
 */

import React from 'react';
import { TopNavbar } from '../TopNavbar';

interface RecognitionScoreInfoPageProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
    onLogin?: () => void;
}

export const RecognitionScoreInfoPage: React.FC<RecognitionScoreInfoPageProps> = ({
    onNavigate,
    onBack,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin || (() => {})} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Understanding Your Score
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Recognition Score System
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Your recognition score is a comprehensive metric that evaluates your pilot career progression across multiple dimensions. Scores range from 0 to 100, with higher scores indicating stronger career readiness and recognition in the aviation industry.
                    </p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="py-16 px-6 max-w-6xl mx-auto space-y-24">
                {/* Score Overview Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                        Score Overview
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">
                        Comprehensive Career Evaluation
                    </h2>
                    <div className="text-left space-y-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Your recognition score evaluates four key dimensions that contribute to your overall professional readiness. Each dimension is weighted based on its importance in modern aviation recruitment and career progression. The system provides operators with a standardized view of pilot capabilities beyond traditional metrics like total flight hours alone.
                        </p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">The Four Key Dimensions:</h3>
                            <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                                <p><strong>Flight Hours (40% weight):</strong> Total logged flight time serves as the foundation of your score, with additional points awarded for specialized experience such as Pilot-in-Command (PIC) time, Instrument Flight Rules (IFR) proficiency, and night flying capabilities. These specialized hours demonstrate command experience and operational versatility that airlines value highly.</p>
                                <p><strong>Experience (30% weight):</strong> Years of professional experience, industry achievements, additional certifications, and type ratings contribute to this dimension. Each additional license or certification shows commitment to continuous learning and career advancement, while achievements demonstrate recognition within the aviation community.</p>
                                <p><strong>Assessments (20% weight):</strong> Program completion rates and performance scores from examinations and practical evaluations reflect your dedication to training and ability to apply knowledge in operational scenarios. High assessment scores (80+) significantly impact your overall recognition and demonstrate competency in core areas.</p>
                                <p><strong>Mentorship (10% weight):</strong> Active participation in mentorship programs, conducting observations, and taking on mentorship cases demonstrates leadership qualities and contributes to community development. This dimension evaluates your ability to guide others and your engagement with the broader aviation community.</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Score Range:</strong> 0-100 points. Higher scores indicate stronger career readiness and greater alignment with airline recruitment standards. A score above 70 is considered competitive for most regional airline positions, while scores above 85 align with major carrier expectations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Flight Hours Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Flight Hours
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">
                        Building Experience Through Flight
                    </h2>
                    <div className="text-left space-y-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Total flight hours represent the foundation of your professional experience, but not all hours are equal. The recognition system evaluates the quality and diversity of your flight experience, not just the quantity. Airlines seek pilots with well-rounded experience across different operational environments and aircraft types.
                        </p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Specialized Experience Categories:</h3>
                            <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                                <p><strong>Pilot-in-Command (PIC) Time:</strong> Command experience demonstrates your ability to make critical decisions and manage crew resources. PIC time is weighted more heavily than co-pilot time, as it shows direct responsibility for flight operations and crew coordination.</p>
                                <p><strong>Instrument Flight Rules (IFR) Proficiency:</strong> IFR hours indicate your ability to operate in instrument meteorological conditions and navigate using instrument approaches. This specialized experience is essential for airline operations and is highly valued by recruiters.</p>
                                <p><strong>Night Flying Experience:</strong> Night operations require different skills and situational awareness compared to daytime flying. Night flight hours demonstrate your ability to manage operations in low-light conditions and your overall command experience.</p>
                                <p><strong>Multi-Engine Experience:</strong> Operating multi-engine aircraft shows technical proficiency and experience with complex aircraft systems. This experience is particularly relevant for airline transition programs and demonstrates readiness for larger aircraft.</p>
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <p className="text-sm text-green-800">
                                <strong>Recommendation:</strong> Building to 1000+ total hours with diverse experience across multiple categories significantly boosts your score. Focus on accumulating balanced experience rather than just total hours alone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                        Experience
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">
                        Professional Development & Achievements
                    </h2>
                    <div className="text-left space-y-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Professional experience extends beyond flight hours to include your career progression, educational achievements, and additional qualifications. This dimension evaluates your commitment to continuous learning and your standing within the aviation community.
                        </p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Experience Components:</h3>
                            <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                                <p><strong>Years of Experience:</strong> Total years in aviation provide context for your career progression. While not the primary factor, years of experience combined with other achievements demonstrate career stability and long-term commitment to the profession.</p>
                                <p><strong>Industry Achievements:</strong> Awards, commendations, and recognition from aviation organizations or employers demonstrate excellence in your field. These achievements show that you have been recognized by others for your performance and contributions.</p>
                                <p><strong>Additional Certifications:</strong> Beyond basic licenses, additional certifications such as Airline Transport Pilot (ATP), Flight Instructor (CFI), or specialized ratings show advanced qualifications and dedication to professional development.</p>
                                <p><strong>Type Ratings:</strong> Each additional type rating demonstrates your ability to learn and operate different aircraft types. Type ratings on aircraft relevant to airline operations (such as Boeing 737, Airbus A320, or regional jets) are particularly valuable.</p>
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                            <p className="text-sm text-purple-800">
                                <strong>Strategic Growth:</strong> Focus on obtaining type ratings and certifications that align with your career goals and the aircraft types operated by your target airlines. Each additional qualification adds incremental points to your score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assessments Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Assessments
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">
                        Measuring Knowledge & Performance
                    </h2>
                    <div className="text-left space-y-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Program completion rates and assessment performance scores provide objective measures of your knowledge retention and practical application skills. These assessments evaluate your ability to apply theoretical knowledge in operational scenarios and your overall readiness for advanced training programs.
                        </p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Assessment Categories:</h3>
                            <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                                <p><strong>Program Completion:</strong> Completion of structured training programs shows dedication to systematic learning. Programs that align with industry standards, such as those incorporating EBT CBTA principles, are particularly valuable for career progression.</p>
                                <p><strong>Performance Scores:</strong> High scores on examinations and practical evaluations demonstrate strong knowledge retention and application skills. Scores above 80 indicate competency in core areas and significantly impact your overall recognition score.</p>
                                <p><strong>Recency of Assessments:</strong> Recent assessment performance is weighted more heavily than older scores, as it reflects your current knowledge and skill levels. Regular assessment participation shows commitment to maintaining currency.</p>
                                <p><strong>Assessment Diversity:</strong> Performance across different assessment types (knowledge tests, practical evaluations, simulator sessions) provides a comprehensive view of your capabilities and reduces the impact of any single assessment anomaly.</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                <strong>Impact:</strong> High assessment scores (80+) significantly impact your overall recognition and can compensate for lower experience in other areas. Focus on achieving strong performance across all assessment categories.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mentorship Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                        Mentorship
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">
                        Leadership & Community Engagement
                    </h2>
                    <div className="text-left space-y-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Active participation in mentorship programs demonstrates leadership qualities, communication skills, and commitment to community development. This dimension evaluates your ability to guide others and your engagement with the broader aviation community beyond your individual career progression.
                        </p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Mentorship Activities:</h3>
                            <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                                <p><strong>Observation Hours:</strong> Time spent observing experienced pilots provides insights into advanced techniques and operational best practices. These observations help you develop a deeper understanding of professional standards and expectations.</p>
                                <p><strong>Mentoring Others:</strong> Conducting mentorship sessions, providing guidance to less experienced pilots, and taking on mentorship cases demonstrates your ability to transfer knowledge and support community development. Leadership in mentorship shows readiness for crew resource management roles.</p>
                                <p><strong>Community Engagement:</strong> Participation in aviation forums, professional organizations, and community events demonstrates your commitment to the broader aviation community and your willingness to contribute to collective knowledge sharing.</p>
                                <p><strong>Mentorship Certifications:</strong> Completion of formal mentorship training programs or certification as a mentor shows structured preparation for leadership roles and demonstrates systematic approach to professional development.</p>
                            </div>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                            <p className="text-sm text-pink-800">
                                <strong>Leadership Potential:</strong> Mentorship activities show leadership potential and community engagement that airlines value in candidates for captain positions and advanced roles. Even moderate mentorship participation can positively impact your score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center bg-white shadow-xl border border-slate-200">
                    <div className="relative z-10">
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="WingMentor Logo"
                            className="mx-auto w-32 h-auto object-contain mb-6"
                        />
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                            Improve Your Recognition Score
                        </h2>
                        <p className="text-base md:text-lg text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Focus on areas where you have the most potential for growth. Use the Score Optimization Guide to get personalized recommendations based on your current profile and identify specific actions to increase your score.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => onNavigate('score-optimization')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl hover:shadow-2xl border border-blue-200 flex items-center gap-2"
                            >
                                <span>View Optimization Tips</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onNavigate('pilot-recognition-profile')}
                                className="bg-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all border border-slate-300 flex items-center gap-2"
                            >
                                <span>View Your Profile</span>
                            </button>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <p className="text-sm text-slate-500">
                                Get AI-powered insights and track your progress over time
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-12 flex flex-col items-center gap-4">
                <button
                    onClick={onBack || (() => onNavigate('pilot-recognition-profile'))}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    Back to Profile
                </button>
            </div>
        </div>
    );
};
