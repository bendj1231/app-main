import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import foundationalQuestions from '../data/foundational-knowledge-exam-questions.json';

interface FoundationalKnowledgeExamPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onComplete?: (score: number) => void;
}

const examQuestions = foundationalQuestions.questions || [];

export const FoundationalKnowledgeExamPage: React.FC<FoundationalKnowledgeExamPageProps> = ({
  userProfile,
  onBack,
  onComplete
}) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(examQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [examSaved, setExamSaved] = useState(false);
  const passingScore = foundationalQuestions.passingScore || 80;

  const saveExamResult = async (score: number) => {
    if (examSaved) return;
    
    const userId = userProfile?.id || userProfile?.uid;
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    try {
      const { error } = await supabase
        .from('pilot_exams')
        .insert({
          user_id: userId,
          exam_name: 'Foundational Knowledge Examination',
          exam_type: 'foundational',
          score: score,
          max_score: 100,
          passed: score >= passingScore,
          duration: examQuestions.length * 5, // Estimated duration in minutes
          exam_date: new Date().toISOString(),
          remarks: `Score: ${score}%, Questions: ${examQuestions.length}`,
          module_id: 'foundational-program',
          status: score >= passingScore ? 'passed' : 'failed',
          attempts: 1,
          max_attempts: 3
        });

      if (error) {
        console.error('Error saving exam result:', error);
      } else {
        console.log('✅ Exam result saved to Supabase');
        setExamSaved(true);
      }
    } catch (error) {
      console.error('Error saving exam result:', error);
    }
  };

  useEffect(() => {
    if (showResults && !examSaved) {
      saveExamResult(score);
    }
  }, [showResults, examSaved]);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === examQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / examQuestions.length) * 100);
  };

  const calculateCurrentScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer !== -1 && answer === examQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const calculateCurrentPercentage = () => {
    const correct = calculateCurrentScore();
    const answered = selectedAnswers.filter(a => a !== -1).length;
    if (answered === 0) return 0;
    return Math.round((correct / answered) * 100);
  };

  const score = calculateScore();
  const passed = score >= passingScore;
  const currentScore = calculateCurrentScore();
  const currentPercentage = calculateCurrentPercentage();
  const answeredQuestions = selectedAnswers.filter(a => a !== -1).length;

  if (showResults) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Score Card - Fixed Position Top Right */}
        <div style={{
          position: 'fixed',
          top: '5rem',
          right: '1.5rem',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          zIndex: 1000,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Score:</span>
            <span style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 700 }}>{score}%</span>
          </div>
        </div>

        <div style={{ padding: '2rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              marginBottom: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: '#1e40af',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to Examination Portal
          </button>

          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: passed ? '#dcfce7' : '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              {passed ? (
                <Icons.CheckCircle style={{ width: 40, height: 40, color: '#22c55e' }} />
              ) : (
                <Icons.AlertCircle style={{ width: 40, height: 40, color: '#ef4444' }} />
              )}
            </div>

            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              {passed ? 'Congratulations!' : 'Examination Complete'}
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              You scored {score}% on the Foundational Knowledge Exam
            </p>

            <div
              style={{
                background: passed ? '#dcfce7' : '#fee2e2',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '3rem', fontWeight: 700, color: passed ? '#22c55e' : '#ef4444' }}>
                {score}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                {passed ? `You passed! (${passingScore}% required)` : `You did not pass (${passingScore}% required)`}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={onBack}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Return to Portal
              </button>
              {!passed && (
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers(new Array(examQuestions.length).fill(-1));
                  }}
                  style={{
                    background: '#2563eb',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = examQuestions[currentQuestion];
  const hasAnswer = selectedAnswers[currentQuestion] !== -1;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Score Card - Fixed Position Top Right */}
      <div style={{
        position: 'fixed',
        top: '5rem',
        right: '1.5rem',
        background: '#fff',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.1)',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Score:</span>
          <span style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 700 }}>{currentPercentage}%</span>
        </div>
      </div>

      <div style={{ padding: '2rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Examination Portal
        </button>

        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Foundational Knowledge Exam</h1>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Question {currentQuestion + 1} of {examQuestions.length}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${((currentQuestion + 1) / examQuestions.length) * 100}%`,
                  height: '100%',
                  background: '#2563eb',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {currentQ.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: selectedAnswers[currentQuestion] === index ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: selectedAnswers[currentQuestion] === index ? '#eff6ff' : '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontWeight: 600, marginRight: '0.75rem', color: '#2563eb' }}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: currentQuestion === 0 ? '#94a3b8' : '#64748b',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {Array.from({ length: Math.min(10, examQuestions.length) }, (_, i) => {
                let dotIndex;
                if (examQuestions.length <= 10) {
                  dotIndex = i;
                } else if (currentQuestion < 5) {
                  dotIndex = i;
                } else if (currentQuestion >= examQuestions.length - 5) {
                  dotIndex = examQuestions.length - 10 + i;
                } else {
                  dotIndex = currentQuestion - 4 + i;
                }
                return (
                  <div
                    key={dotIndex}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: selectedAnswers[dotIndex] !== -1 ? '#22c55e' : dotIndex === currentQuestion ? '#2563eb' : '#e2e8f0',
                    }}
                  />
                );
              })}
              <span style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: '0.5rem' }}>
                {currentQuestion + 1} / {examQuestions.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: hasAnswer ? '#2563eb' : '#94a3b8',
                color: '#fff',
                cursor: hasAnswer ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              {currentQuestion === examQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationalKnowledgeExamPage;
