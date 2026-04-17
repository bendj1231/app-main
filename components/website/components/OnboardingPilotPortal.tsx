import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingPilotPortalProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const features = [
    {
        id: 1,
        title: 'Examination Terminal',
        description: 'Access through programs or dashboard page',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
        details: 'The Examination Terminal provides a comprehensive testing environment for pilot certifications. Access through the programs or dashboard page to take exams, track progress, and receive instant feedback on your performance.'
    },
    {
        id: 2,
        title: 'Pilot Terminal',
        description: 'Chat with fellow members and discuss aviation',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop',
        details: 'Connect with pilots worldwide through our Pilot Terminal. Share experiences, discuss industry trends, and build valuable relationships with fellow aviation professionals.'
    },
    {
        id: 3,
        title: 'Industry News',
        description: 'Stay updated on AIRBUS aligned updates and airline expectations',
        image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800&h=600&fit=crop',
        details: 'Get real-time updates on AIRBUS aligned training programs, airline recruitment requirements, and industry trends. Stay ahead of the curve with our curated news feed.'
    },
    {
        id: 4,
        title: 'Job Requirements',
        description: 'Notices of job requirement changes and updates',
        image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=800&h=600&fit=crop',
        details: 'Receive instant notifications when airlines update their job requirements. Track changes in minimum hours, certifications, and experience levels needed for various pilot positions.'
    },
    {
        id: 5,
        title: 'WingMentor Support',
        description: 'Contact us for any issues or assistance',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
        details: 'Our dedicated support team is available 24/7 to assist with any questions or technical issues. Get help with account management, program enrollment, or career guidance.'
    },
    {
        id: 6,
        title: 'PilotRecognition.ai',
        description: 'Upcoming AI for performance tracking and score management',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
        details: 'Coming soon: AI-powered performance tracking that monitors your flight hours, provides personalized career recommendations, and helps maintain your pilot recognition score.'
    }
];

export const OnboardingPilotPortal: React.FC<OnboardingPilotPortalProps> = ({ onBack, onNavigate, onLogin }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % features.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', overflowX: 'hidden' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ width: '100%', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out', overflowX: 'hidden' }}>
                <div className="max-w-4xl mx-auto w-full">
                    <div className="mb-8 flex justify-center">
                        <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
                        Welcome to Your Pilot Portal
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Your central hub to access programs, pathways, pilot recognition profile, and comprehensive aviation resources.
                    </p>
                    
                    {/* Carousel */}
                    <div className="relative mb-8">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={features[currentSlide].image}
                                alt={features[currentSlide].title}
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">{features[currentSlide].title}</h3>
                                <p className="text-white/90">{features[currentSlide].description}</p>
                                <button
                                    onClick={() => setSelectedFeature(features[currentSlide])}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    Learn More &rarr;
                                </button>
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        >
                            &#8594;
                        </button>

                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSlide ? 'bg-blue-600' : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-programs')}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Next: Programs
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {selectedFeature && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFeature(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <img
                                src={selectedFeature.image}
                                alt={selectedFeature.title}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedFeature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{selectedFeature.details}</p>
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
