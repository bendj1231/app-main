import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingRecognitionProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const recognitions = [
    {
        id: 1,
        title: 'Recognition Profile',
        description: 'Document your certifications and achievements',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        details: 'Build a comprehensive profile showcasing your pilot certifications, ratings, flight hours, and achievements. Your recognition profile serves as your digital portfolio for airlines and industry partners.'
    },
    {
        id: 2,
        title: 'Career Pathways',
        description: 'Guided paths to major airlines and operators',
        image: 'https://images.unsplash.com/photo-1534397860164-120c97f7db5a?w=800&h=600&fit=crop',
        details: 'Navigate your career with structured pathways to major airlines, charter operators, and aviation organizations. Get personalized recommendations based on your qualifications and goals.'
    },
    {
        id: 3,
        title: 'Verified Credentials',
        description: 'Industry-recognized proof of your skills',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
        details: 'Get your credentials verified by industry experts. Verified credentials carry greater weight with employers and demonstrate your commitment to excellence.'
    },
    {
        id: 4,
        title: 'Milestone Tracking',
        description: 'Celebrate your aviation journey achievements',
        image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop',
        details: 'Track your progress through various milestones from first solo to type ratings. Celebrate your achievements and see how far you have come in your aviation career.'
    }
];

export const OnboardingRecognition: React.FC<OnboardingRecognitionProps> = ({ onBack, onNavigate, onLogin }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedRecognition, setSelectedRecognition] = useState<typeof recognitions[0] | null>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % recognitions.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + recognitions.length) % recognitions.length);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', overflowX: 'hidden' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ width: '100%', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out', overflowX: 'hidden' }}>
                <div className="max-w-4xl mx-auto w-full">
                    <div className="mb-8 flex justify-center">
                        <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
                        Pilot Recognition & Pathways
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Showcase your achievements, earn industry-recognized credentials, and follow structured pathways to your dream aviation career.
                    </p>
                    
                    {/* Carousel */}
                    <div className="relative mb-8">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={recognitions[currentSlide].image}
                                alt={recognitions[currentSlide].title}
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">{recognitions[currentSlide].title}</h3>
                                <p className="text-white/90">{recognitions[currentSlide].description}</p>
                                <button
                                    onClick={() => setSelectedRecognition(recognitions[currentSlide])}
                                    className="mt-4 px-6 py-2 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
                                >
                                    Learn More &rarr;
                                </button>
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        >
                            <div style={{ pointerEvents: 'auto' }}>
                                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
                            </div>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        >
                            <div style={{ pointerEvents: 'auto' }}>
                                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
                            </div>
                        </button>

                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                            {recognitions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSlide ? 'bg-violet-600' : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description section below carousel */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{recognitions[currentSlide].title}</h3>
                        <p className="text-slate-600 leading-relaxed">{recognitions[currentSlide].details}</p>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-programs')}
                            className="px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={onLogin}
                            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {selectedRecognition && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecognition(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <img
                                src={selectedRecognition.image}
                                alt={selectedRecognition.title}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedRecognition(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedRecognition.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{selectedRecognition.details}</p>
                            <button
                                onClick={() => setSelectedRecognition(null)}
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
