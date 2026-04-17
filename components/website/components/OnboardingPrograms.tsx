import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingProgramsProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const programs = [
    {
        id: 1,
        title: 'Foundation Program',
        description: 'Start your journey with fundamental pilot training',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        details: 'Our Foundation Program provides comprehensive ground school and flight training for aspiring pilots. Learn the fundamentals of aviation, aircraft systems, navigation, and meteorology with experienced instructors.'
    },
    {
        id: 2,
        title: 'Advanced Training',
        description: 'Specialized courses for career advancement',
        image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop',
        details: 'Take your skills to the next level with advanced training in instrument flying, multi-engine operations, and complex aircraft. Prepare for airline interviews and advanced certifications.'
    },
    {
        id: 3,
        title: 'Career Pathways',
        description: 'Tailored paths to major airlines and operators',
        image: 'https://images.unsplash.com/photo-1534397860164-120c97f7db5a?w=800&h=600&fit=crop',
        details: 'Get personalized guidance on your career trajectory. Our pathways connect you with airline partners, provide interview preparation, and help you navigate the hiring process.'
    },
    {
        id: 4,
        title: 'Certification Prep',
        description: 'Prepare for ATPL, CPL, and other certifications',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
        details: 'Comprehensive preparation courses for ATPL, CPL, type ratings, and other certifications. Practice with realistic exam simulations and get expert feedback on your progress.'
    }
];

export const OnboardingPrograms: React.FC<OnboardingProgramsProps> = ({ onBack, onNavigate, onLogin }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProgram, setSelectedProgram] = useState<typeof programs[0] | null>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % programs.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + programs.length) % programs.length);
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
                        Aviation Development Programs
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Structured pathways designed to guide you from student to professional pilot with comprehensive training and mentorship.
                    </p>
                    
                    {/* Carousel */}
                    <div className="relative mb-8">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={programs[currentSlide].image}
                                alt={programs[currentSlide].title}
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">{programs[currentSlide].title}</h3>
                                <p className="text-white/90">{programs[currentSlide].description}</p>
                                <button
                                    onClick={() => setSelectedProgram(programs[currentSlide])}
                                    className="mt-4 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
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
                            {programs.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSlide ? 'bg-emerald-600' : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-pilot-portal')}
                            className="px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('onboarding-recognition')}
                            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            Next: Recognition
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {selectedProgram && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProgram(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <img
                                src={selectedProgram.image}
                                alt={selectedProgram.title}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                            <button
                                onClick={() => setSelectedProgram(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedProgram.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{selectedProgram.details}</p>
                            <button
                                onClick={() => setSelectedProgram(null)}
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
