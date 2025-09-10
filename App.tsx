import React, { useState, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { QuizScreen } from './components/QuizScreen';
import { generateAptitudeQuestion } from './services/geminiService';
import { type QuestionCategory, type AptitudeQuestion } from './types';
import { SkeletonLoader } from './components/common/SkeletonLoader';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'quiz'>('dashboard');
  const [currentCategory, setCurrentCategory] = useState<QuestionCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AptitudeQuestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const fetchQuestion = useCallback(async (category: QuestionCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      const question = await generateAptitudeQuestion(category);
      setCurrentQuestion(question);
    } catch (err) {
      setError('Failed to generate a question. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartQuiz = (category: QuestionCategory) => {
    setCurrentCategory(category);
    setCurrentScreen('quiz');
    setScore({ correct: 0, total: 0 });
    fetchQuestion(category);
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentCategory(null);
    setCurrentQuestion(null);
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    setScore(prevScore => ({
      correct: prevScore.correct + (isCorrect ? 1 : 0),
      total: prevScore.total + 1,
    }));
  };

  const handleNextQuestion = () => {
    if (currentCategory) {
      fetchQuestion(currentCategory);
    }
  };

  const renderContent = () => {
    if (currentScreen === 'dashboard') {
      return <Dashboard onStartQuiz={handleStartQuiz} />;
    }

    if (currentScreen === 'quiz' && currentCategory) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          {isLoading && !currentQuestion ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-red-500 text-xl">{error}</p>
              <button
                onClick={handleGoToDashboard}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : currentQuestion ? (
            <QuizScreen
              key={currentQuestion.question}
              question={currentQuestion}
              category={currentCategory}
              onAnswerSubmit={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
              onGoToDashboard={handleGoToDashboard}
              score={score}
              isLoadingNext={isLoading}
            />
          ) : null}
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Consultant Aptitude Trainer</h1>
          <p className="text-slate-600 mt-2 text-lg">Sharpen your skills with AI-powered practice tests.</p>
        </header>
        {renderContent()}
      </div>
    </main>
  );
};

export default App;