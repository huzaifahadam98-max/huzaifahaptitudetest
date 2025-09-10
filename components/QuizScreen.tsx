import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { type AptitudeQuestion, QuestionCategory } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';

interface QuizScreenProps {
  question: AptitudeQuestion;
  category: QuestionCategory;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onGoToDashboard: () => void;
  score: { correct: number; total: number };
  isLoadingNext: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const ChartRenderer: React.FC<{ chartData: AptitudeQuestion['chartData'] }> = ({ chartData }) => {
  if (!chartData || !chartData.data) return null;

  const dataKey = chartData.dataKey || 'value';

  return (
    <div className="bg-slate-100 p-4 rounded-lg my-6 h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartData.type === 'bar' ? (
          <BarChart data={chartData.data}>
            <XAxis dataKey="name" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip wrapperClassName="!bg-white !border-slate-300 !rounded-md" />
            <Legend />
            <Bar dataKey={dataKey} fill="#3b82f6" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              // FIX: Explicitly type the label props to 'any' to resolve a TypeScript error with the recharts library where 'percent' is not found on the inferred type.
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip wrapperClassName="!bg-white !border-slate-300 !rounded-md" />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};


export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  category,
  onAnswerSubmit,
  onNextQuestion,
  onGoToDashboard,
  score,
  isLoadingNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const isNumerical = useMemo(() => category === QuestionCategory.NUMERICAL, [category]);
  const [timeLeft, setTimeLeft] = useState(isNumerical ? 90 : null);

  const isCorrect = useMemo(() => selectedOption === question.answer, [selectedOption, question.answer]);
  const isTimeUp = useMemo(() => timeLeft !== null && timeLeft <= 0, [timeLeft]);
  const optionsDisabled = isAnswered || isTimeUp;

  // Effect for timer countdown
  useEffect(() => {
    if (isNumerical && !isAnswered && timeLeft !== null && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(t => (t ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isNumerical, isAnswered, timeLeft]);

  // Effect to auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && !isAnswered) {
      setIsAnswered(true);
      onAnswerSubmit(selectedOption === question.answer);
    }
  }, [isTimeUp, isAnswered, onAnswerSubmit, selectedOption, question.answer]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    onAnswerSubmit(isCorrect);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getOptionClasses = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'bg-blue-500 border-blue-500 text-white'
        : 'bg-white hover:bg-slate-50 border-slate-300';
    }
    if (option === question.answer) {
      return 'bg-green-500 border-green-500 text-white';
    }
    if (option === selectedOption && option !== question.answer) {
      return 'bg-red-500 border-red-500 text-white';
    }
    return 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed';
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in-up">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{category}</span>
        </div>
        <div className="text-right">
            <p className="text-lg font-bold text-slate-700">Score: {score.correct} / {score.total}</p>
            {isNumerical && timeLeft !== null && (
                <p className={`text-lg font-bold transition-colors ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                    Time Left: {formatTime(timeLeft)}
                </p>
            )}
        </div>
      </div>

      <p className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed mb-4">{question.question}</p>
      
      {question.chartData && <ChartRenderer chartData={question.chartData} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !optionsDisabled && setSelectedOption(option)}
            disabled={optionsDisabled}
            className={`p-4 rounded-lg border-2 text-left transform transition-colors duration-200 active:scale-[0.98] ${getOptionClasses(option)}`}
          >
            <span className="font-semibold">{option}</span>
          </button>
        ))}
      </div>
      
      {!isAnswered ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isTimeUp}
          className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold text-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all transform active:bg-blue-800 active:scale-[0.99]"
        >
          Submit Answer
        </button>
      ) : (
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 opacity-0 animate-fade-in-up">
          <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isTimeUp && selectedOption === null ? "Time's Up!" : (isCorrect ? 'Correct!' : 'Incorrect')}
          </h3>
          {(!isCorrect || (isTimeUp && selectedOption === null)) && <p className="text-slate-700 mt-1">The correct answer is: <strong>{question.answer}</strong></p>}
          <p className="text-slate-600 mt-3 whitespace-pre-wrap">{question.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onGoToDashboard}
          className="px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-all transform active:bg-slate-400 active:scale-[0.98]"
        >
          &larr; Back to Dashboard
        </button>
        {isAnswered && (
          <button
            onClick={onNextQuestion}
            disabled={isLoadingNext}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all transform active:bg-green-800 active:scale-[0.98] flex items-center justify-center disabled:bg-green-400"
          >
            {isLoadingNext ? <><LoadingSpinner size="sm" /> <span className="ml-2">Generating...</span></> : 'Next Question &rarr;'}
          </button>
        )}
      </div>
    </div>
  );
};