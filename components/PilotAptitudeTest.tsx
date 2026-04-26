import React, { useState } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowRight, TrendingUp } from 'lucide-react';

interface PilotAptitudeTestProps {
  airlineName?: string;
  isDarkMode?: boolean;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  // Numerical Reasoning
  {
    id: 1,
    category: 'Numerical Reasoning',
    question: 'An aircraft burns 2,500 kg of fuel per hour. If the flight duration is 8.5 hours, how much total fuel is required?',
    options: ['20,500 kg', '21,250 kg', '21,750 kg', '22,000 kg'],
    correctAnswer: 1,
    explanation: '2,500 kg/hour × 8.5 hours = 21,250 kg'
  },
  {
    id: 2,
    category: 'Numerical Reasoning',
    question: 'If an aircraft is cruising at 450 knots and needs to cover 1,800 nautical miles, how long will the flight take?',
    options: ['3.5 hours', '4 hours', '4.5 hours', '5 hours'],
    correctAnswer: 1,
    explanation: '1,800 nm ÷ 450 knots = 4 hours'
  },
  // Verbal Reasoning
  {
    id: 3,
    category: 'Verbal Reasoning',
    question: 'Which statement best describes the primary purpose of Crew Resource Management (CRM)?',
    options: [
      'To ensure strict hierarchy in the cockpit',
      'To optimize communication and decision-making among crew members',
      'To minimize fuel consumption during flights',
      'To prioritize captain authority over all decisions'
    ],
    correctAnswer: 1,
    explanation: 'CRM focuses on effective communication, teamwork, and decision-making to enhance flight safety.'
  },
  {
    id: 4,
    category: 'Verbal Reasoning',
    question: 'In aviation, "sterile cockpit" refers to:',
    options: [
      'A cockpit with no passengers allowed',
      'A clean and organized flight deck',
      'No non-essential communication during critical phases of flight',
      'A cockpit with no electronic devices'
    ],
    correctAnswer: 2,
    explanation: 'Sterile cockpit rule prohibits non-essential conversation during critical phases like takeoff and landing.'
  },
  // Spatial Reasoning
  {
    id: 5,
    category: 'Spatial Reasoning',
    question: 'If you are flying on a heading of 090° (East) and need to turn right to a heading of 180° (South), what is the turn angle?',
    options: ['90° right', '90° left', '180° right', '180° left'],
    correctAnswer: 0,
    explanation: 'From 090° to 180° is a 90° turn to the right.'
  },
  {
    id: 6,
    category: 'Spatial Reasoning',
    question: 'An aircraft is at FL350 (35,000 feet) and needs to descend to FL150 (15,000 feet). How many feet of descent is required?',
    options: ['15,000 feet', '20,000 feet', '25,000 feet', '30,000 feet'],
    correctAnswer: 1,
    explanation: '35,000 - 15,000 = 20,000 feet of descent required.'
  },
  // Technical Knowledge
  {
    id: 7,
    category: 'Technical Knowledge',
    question: 'What is the primary function of the autopilot system?',
    options: [
      'To completely replace pilot input',
      'To maintain aircraft attitude and flight path',
      'To communicate with air traffic control',
      'To manage fuel consumption only'
    ],
    correctAnswer: 1,
    explanation: 'Autopilot maintains aircraft attitude, altitude, and flight path as programmed by the pilot.'
  },
  {
    id: 8,
    category: 'Technical Knowledge',
    question: 'In a standard instrument approach, the decision altitude (DA) is:',
    options: [
      'The altitude at which the approach must be abandoned if visual references are not established',
      'The altitude where the aircraft levels off',
      'The altitude for cruise flight',
      'The altitude for emergency descent'
    ],
    correctAnswer: 0,
    explanation: 'DA is the minimum altitude at which a pilot must decide to continue or execute a missed approach.'
  },
  // Leadership & Teamwork (Core Competency 1)
  {
    id: 9,
    category: 'Leadership & Teamwork',
    question: 'During a group exercise scenario (e.g., survival situation), what is the most effective approach to building consensus?',
    options: [
      'Vote immediately on the first proposed solution',
      'Dominate the discussion with your expertise',
      'Listen to all perspectives and facilitate collaborative decision-making',
      'Stay passive and let others decide'
    ],
    correctAnswer: 2,
    explanation: 'Effective leadership involves listening to all team members and facilitating consensus without being overly dominant or passive.'
  },
  {
    id: 10,
    category: 'Leadership & Teamwork',
    question: 'Your First Officer disagrees with your decision during a non-emergency situation. What should you do?',
    options: [
      'Immediately assert your authority as Captain',
      'Ignore the disagreement and proceed',
      'Discuss the concerns and consider alternative viewpoints',
      'Report the First Officer to management'
    ],
    correctAnswer: 2,
    explanation: 'Good CRM involves open communication and considering crew input while maintaining final decision authority.'
  },
  // Application of Knowledge & Procedures (Core Competency 2)
  {
    id: 11,
    category: 'Application of Knowledge',
    question: 'During a volcanic ash encounter, what is the most critical action according to SOPs?',
    options: [
      'Continue flight and monitor instruments',
      'Immediately execute a 180° turn and climb if possible',
      'Contact ATC and wait for instructions',
      'Descend to avoid the ash layer'
    ],
    correctAnswer: 1,
    explanation: 'Standard procedure for volcanic ash is immediate 180° turn and climb if possible to avoid engine damage.'
  },
  {
    id: 12,
    category: 'Application of Knowledge',
    question: 'In monsoon conditions with reduced visibility, what should be your primary focus?',
    options: [
      'Maintain scheduled arrival time',
      'Strict adherence to instrument procedures and weather minimums',
      'Request visual approach to save fuel',
      'Follow other aircraft on radar'
    ],
    correctAnswer: 1,
    explanation: 'In adverse weather, strict adherence to instrument procedures and weather minimums is critical for safety.'
  },
  // Professionalism & Customer Focus (Core Competency 3)
  {
    id: 13,
    category: 'Professionalism',
    question: 'A passenger complains about a delay. How should you respond professionally?',
    options: [
      'Ignore the complaint as it\'s not your responsibility',
      'Explain the situation calmly and show empathy',
      'Defend the airline aggressively',
      'Tell them to file a complaint with customer service'
    ],
    correctAnswer: 1,
    explanation: 'Professionalism involves calm communication and empathy even when not directly customer-facing.'
  },
  {
    id: 14,
    category: 'Professionalism',
    question: 'What is the most important aspect of maintaining operational reliability?',
    options: [
      'Flying as fast as possible to maintain schedule',
      'Following all procedures and reporting any discrepancies',
      'Skipping non-essential checks to save time',
      'Making decisions based on convenience'
    ],
    correctAnswer: 1,
    explanation: 'Operational reliability requires strict adherence to procedures and reporting systems for premium service standards.'
  },
  // Safety & Situational Awareness (Core Competency 4)
  {
    id: 15,
    category: 'Safety & Situational Awareness',
    question: 'During a simulator assessment with raw-data ILS, what is the key skill being tested?',
    options: [
      'Ability to use all automation systems',
      'Manual flying skills and instrument interpretation',
      'Communication with ATC',
      'Navigation system management'
    ],
    correctAnswer: 1,
    explanation: 'Raw-data ILS tests manual flying skills without flight director or autothrottle assistance.'
  },
  {
    id: 16,
    category: 'Safety & Situational Awareness',
    question: 'You experience a cargo fire indication during cruise. What is the immediate priority?',
    options: [
      'Complete all checklists before any action',
      'Identify the threat and execute fire drill procedures',
      'Continue to destination and handle on landing',
      'Divert immediately without assessment'
    ],
    correctAnswer: 1,
    explanation: 'Threat management requires immediate identification and execution of emergency procedures.'
  },
  // Communication (Core Competency 5)
  {
    id: 17,
    category: 'Communication',
    question: 'When communicating with ATC during an emergency, what is the most important factor?',
    options: [
      'Using complex aviation terminology',
      'Clear, concise, and standardized phraseology',
      'Providing extensive background information',
      'Speaking quickly to save time'
    ],
    correctAnswer: 1,
    explanation: 'Clear, concise communication using standard phraseology is critical in emergency situations.'
  },
  {
    id: 18,
    category: 'Communication',
    question: 'Your crew member seems fatigued. How should you address this?',
    options: [
      'Ignore it if they haven\'t mentioned it',
      'Publicly reprimand them for unprofessionalism',
      'Have a private conversation and offer support',
      'Report them immediately'
    ],
    correctAnswer: 2,
    explanation: 'Professional communication involves addressing concerns privately and supportively.'
  },
  // Decision Making (Core Competency 6)
  {
    id: 19,
    category: 'Decision Making',
    question: 'You have two diversion airports available with different weather conditions. How do you decide?',
    options: [
      'Choose the closest airport regardless of conditions',
      'Choose based on fuel remaining and weather minimums',
      'Let the First Officer decide',
      'Continue to original destination'
    ],
    correctAnswer: 1,
    explanation: 'Decision making requires weighing multiple factors including fuel, weather, and safety margins.'
  },
  {
    id: 20,
    category: 'Decision Making',
    question: 'During a sudden weather deterioration, what decision-making process should you follow?',
    options: [
      'React instinctively without thinking',
      'Gather information, assess options, choose the safest course',
      'Wait for ATC to make all decisions',
      'Follow what other aircraft are doing'
    ],
    correctAnswer: 1,
    explanation: 'Systematic decision making involves information gathering, assessment, and choosing the safest option.'
  }
];

export const PilotAptitudeTest: React.FC<PilotAptitudeTestProps> = ({
  airlineName = 'Airline',
  isDarkMode = true
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const text = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const bg = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const border = isDarkMode ? 'border-slate-700' : 'border-slate-200';
  const accent = isDarkMode ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-50 text-sky-700 border-sky-200';
  const accentHover = isDarkMode ? 'hover:bg-sky-500/30' : 'hover:bg-sky-100';

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === QUESTIONS[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score: number) => {
    const percentage = (score / QUESTIONS.length) * 100;
    if (percentage >= 80) return 'text-emerald-500';
    if (percentage >= 60) return 'text-sky-500';
    return 'text-amber-500';
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / QUESTIONS.length) * 100;
    if (percentage >= 80) return 'Excellent match for airline expectations';
    if (percentage >= 60) return 'Good potential, some areas for improvement';
    return 'Needs significant preparation';
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setShowExplanation(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / QUESTIONS.length) * 100);

    return (
      <div className={`rounded-2xl p-6 md:p-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 mx-auto mb-4 text-sky-500" />
          <h3 className={`text-2xl font-semibold mb-2 ${text}`}>Your Aptitude Test Results</h3>
          <p className={`text-sm ${subtext}`}>How well your skills match {airlineName} expectations</p>
        </div>

        <div className={`rounded-xl p-8 text-center mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>{percentage}%</div>
          <p className={`text-lg ${text} mb-2`}>{score} out of {QUESTIONS.length} correct</p>
          <p className={`text-sm ${subtext}`}>{getScoreMessage(score)}</p>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className={`font-semibold ${text}`}>Performance by Category:</h4>
          {['Numerical Reasoning', 'Verbal Reasoning', 'Spatial Reasoning', 'Technical Knowledge', 'Leadership & Teamwork', 'Application of Knowledge', 'Professionalism', 'Safety & Situational Awareness', 'Communication', 'Decision Making'].map(category => {
            const categoryQuestions = QUESTIONS.filter(q => q.category === category);
            if (categoryQuestions.length === 0) return null;
            const categoryCorrect = categoryQuestions.filter((q, idx) => {
              const questionIndex = QUESTIONS.indexOf(q);
              return selectedAnswers[questionIndex] === q.correctAnswer;
            }).length;
            const categoryPercentage = Math.round((categoryCorrect / categoryQuestions.length) * 100);

            return (
              <div key={category} className="flex items-center justify-between">
                <span className={`text-sm ${subtext}`}>{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${categoryPercentage >= 80 ? 'bg-emerald-500' : categoryPercentage >= 60 ? 'bg-sky-500' : 'bg-amber-500'}`}
                      style={{ width: `${categoryPercentage}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${text}`}>{categoryPercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetTest}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
            }`}
          >
            Retake Test
          </button>
          <button
            onClick={() => window.location.href = '/pathways-modern'}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors bg-sky-500 hover:bg-sky-600 text-white`}
          >
            View Training Resources
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <div className={`rounded-2xl p-6 md:p-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-sky-500" />
          <div>
            <h3 className={`text-xl font-semibold ${text}`}>Pilot Aptitude Test</h3>
            <p className={`text-xs ${subtext}`}>Match your skills with {airlineName} expectations</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${accent}`}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-700 mb-6 overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-700'
        }`}>
          {question.category}
        </span>
      </div>

      {/* Question */}
      <h4 className={`text-lg font-semibold mb-6 ${text}`}>{question.question}</h4>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswers[currentQuestion] === index;
          let optionClass = `border-2 transition-all cursor-pointer ${border} ${accentHover}`;

          if (showExplanation) {
            if (index === question.correctAnswer) {
              optionClass = 'border-2 border-emerald-500 bg-emerald-500/10';
            } else if (isSelected && index !== question.correctAnswer) {
              optionClass = 'border-2 border-rose-500 bg-rose-500/10';
            }
          } else if (isSelected) {
            optionClass = `border-2 border-sky-500 ${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-50'}`;
          }

          return (
            <button
              key={index}
              onClick={() => !showExplanation && handleAnswer(index)}
              disabled={showExplanation}
              className={`w-full p-4 rounded-xl text-left ${optionClass} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  showExplanation
                    ? index === question.correctAnswer
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isSelected && index !== question.correctAnswer
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-slate-500'
                    : isSelected
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-slate-500'
                }`}>
                  {showExplanation && index === question.correctAnswer ? <CheckCircle2 className="w-4 h-4" /> : String.fromCharCode(65 + index)}
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 mb-6 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className={`text-xs ${subtext}`}>{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentQuestion === 0
              ? 'opacity-50 cursor-not-allowed'
              : isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            !isAnswered
              ? 'opacity-50 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
