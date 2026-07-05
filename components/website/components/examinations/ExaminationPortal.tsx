import React, { useState } from 'react';
import { Clock, Users, Award, ChevronRight, Lock, CheckCircle, PlayCircle, BookOpen, Brain, Plane, Shield, Target, ArrowLeft } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Examination {
    id: string;
    title: string;
    description: string;
    duration: string;
    questions: number;
    passingScore: number;
    category: string;
    prerequisites?: string[];
    icon?: React.ComponentType<{ className?: string }>;
    status?: 'locked' | 'available' | 'completed';
}

interface ExaminationCategory {
    id: string;
    title: string;
    description: string;
    examinations: Examination[];
    icon?: React.ComponentType<{ className?: string }>;
}

const ExaminationPortal: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const examinationCategories: ExaminationCategory[] = [
        {
            id: 'initial',
            title: 'Category 1: Initial Examinations',
            description: 'Complete these examinations to establish your foundational knowledge and technical competency.',
            icon: BookOpen,
            examinations: [
                {
                    id: 'foundational-knowledge',
                    title: 'Foundational Knowledge Examination',
                    description: 'Demonstrate your understanding of core PilotRecognition concepts and aviation mentorship fundamentals.',
                    duration: '45 min',
                    questions: 50,
                    passingScore: 80,
                    category: 'initial',
                    icon: Brain,
                    status: 'available'
                },
                {
                    id: 'pilot-licensure',
                    title: 'Pilot Licensure Examination',
                    description: 'Select your current license rating and take the corresponding examination to test your technical knowledge.',
                    duration: '90 min',
                    questions: 60,
                    passingScore: 70,
                    category: 'initial',
                    icon: Award,
                    status: 'available'
                }
            ]
        },
        {
            id: 'risk-management',
            title: 'Category 2: Risk Management & Pathways Assessment',
            description: 'Assessment for the Pilot Risk Management & Pathways module. Tests your understanding of risk assessment and career pathway planning.',
            icon: Shield,
            examinations: [
                {
                    id: 'risk-management-pathways',
                    title: 'Pilot Risk Management & Pathways Examination',
                    description: 'Assessment of pilot risk management principles and career pathway selection. Evaluate your understanding of aviation risk assessment and pathway planning.',
                    duration: '60 min',
                    questions: 35,
                    passingScore: 75,
                    category: 'risk-management',
                    icon: Target,
                    status: 'available'
                },
                {
                    id: 'ongoing-learning',
                    title: 'Ongoing Learning & Development Assessment',
                    description: 'Continuous assessment designed for mentors who are also learners. Tests your ability to integrate mentorship with ongoing professional development.',
                    duration: '45 min',
                    questions: 25,
                    passingScore: 70,
                    category: 'risk-management',
                    icon: Users,
                    status: 'locked',
                    prerequisites: ['Complete Category 1 exams']
                }
            ]
        },
        {
            id: 'mentorship',
            title: 'Category 3: Mentorship Examinations',
            description: 'Available after completing Category 1 and Mentor Modules. Tests your mentorship readiness.',
            icon: Users,
            examinations: [
                {
                    id: 'mentorship-knowledge',
                    title: 'Mentorship Knowledge Examination',
                    description: 'Test your understanding of mentorship principles, psychology, and best practices.',
                    duration: '60 min',
                    questions: 40,
                    passingScore: 75,
                    category: 'mentorship',
                    icon: BookOpen,
                    status: 'locked',
                    prerequisites: ['Complete Category 1 & 2 exams and Mentor Modules']
                },
                {
                    id: 'interview-assessment',
                    title: 'Interview Assessment',
                    description: 'Comprehensive interview evaluating your readiness for mentorship responsibilities.',
                    duration: '45 min',
                    questions: 30,
                    passingScore: 80,
                    category: 'mentorship',
                    icon: PlayCircle,
                    status: 'locked',
                    prerequisites: ['Complete Category 1 & 2 exams and Mentor Modules']
                },
                {
                    id: 'mentorship-practical',
                    title: 'Mentorship Practical Examination',
                    description: 'Practical scenario-based assessment of your mentorship capabilities.',
                    duration: '120 min',
                    questions: 5,
                    passingScore: 85,
                    category: 'mentorship',
                    icon: Plane,
                    status: 'locked',
                    prerequisites: ['Complete Category 1 & 2 exams and Mentor Modules']
                }
            ]
        },
        {
            id: 'ebt-cbta',
            title: 'Category 4: EBT CBTA Advanced Assessments',
            description: 'Final assessments based on mentorship acquisition and constructivism principles.',
            icon: Award,
            examinations: [
                {
                    id: 'airbus-ebt-interview',
                    title: 'Airbus EBT CBTA Interview',
                    description: 'Advanced interview assessment aligned with AIRBUS Evidence-Based Training principles.',
                    duration: '60 min',
                    questions: 40,
                    passingScore: 75,
                    category: 'ebt-cbta',
                    icon: Brain,
                    status: 'locked',
                    prerequisites: ['Complete Category 1, 2, and 3 examinations']
                },
                {
                    id: 'ebt-practical-scenario',
                    title: 'EBT CBTA Competency Practical Scenario Examination',
                    description: 'Practical examination based on mentorship acquisition and constructivism principles.',
                    duration: '180 min',
                    questions: 3,
                    passingScore: 80,
                    category: 'ebt-cbta',
                    icon: Target,
                    status: 'locked',
                    prerequisites: ['Complete Category 1, 2, and 3 examinations']
                }
            ]
        }
    ];

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    const ExaminationCard: React.FC<{ examination: Examination; index: number }> = ({ examination, index }) => {
        const Icon = examination.icon || BookOpen;
        const isLocked = examination.status === 'locked';
        const isCompleted = examination.status === 'completed';

        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ y: -2 }}
                className={`bg-white rounded-xl shadow-sm border ${isLocked ? 'border-slate-200 opacity-75' : 'border-slate-300 hover:border-blue-300'} transition-all duration-200 overflow-hidden`}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isLocked ? 'bg-slate-100' : isCompleted ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                            <Icon className={`w-6 h-6 ${isLocked ? 'text-slate-400' : isCompleted ? 'text-emerald-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-2">{examination.title}</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{examination.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{examination.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Brain className="w-3 h-3" />
                                    <span>{examination.questions} questions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    <span>{examination.passingScore}% to pass</span>
                                </div>
                            </div>

                            {examination.prerequisites && (
                                <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-xs font-medium">Prerequisites:</span>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-1">{examination.prerequisites.join(', ')}</p>
                                </div>
                            )}

                            <button
                                disabled={isLocked}
                                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    isLocked 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : isCompleted
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/25'
                                }`}
                            >
                                {isLocked ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Locked</span>
                                    </div>
                                ) : isCompleted ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Completed</span>
                                    </div>
                                ) : examination.id === 'pilot-licensure' ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <PlayCircle className="w-4 h-4" />
                                        <span>Select License & Start</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <PlayCircle className="w-4 h-4" />
                                        <span>Start Examination</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50" style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: '125%' }}>
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        {/* WingMentor Logo */}
                        <div className="w-32 h-32 relative">
                            <img src="/images/set-01-logos/logo.png" alt="WingMentor Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">WINGMENTOR PROGRAMS</h1>
                            <p className="text-lg font-semibold text-blue-600">Examination Portal</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-2">Welcome back, Pilot</h2>
                        <p className="text-sm text-slate-600">
                            Complete your certification examinations to track your progress through the Foundational Program. Each exam unlocks new mentorship resources and advancement opportunities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {examinationCategories.map((category, categoryIndex) => {
                    const Icon = category.icon;
                    return (
                        <div key={category.id} className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
                                    <p className="text-sm text-slate-600">{category.description}</p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {category.examinations.map((examination, examIndex) => (
                                    <ExaminationCard 
                                        key={examination.id} 
                                        examination={examination} 
                                        index={categoryIndex * 10 + examIndex}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Footer Notice */}
                <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">Examination Guidelines</p>
                            <p className="text-xs text-blue-700">
                                All examinations are proctored and timed. Ensure you have a stable internet connection before starting. 
                                Results are automatically saved and can be reviewed in your examination history.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationPortal;
