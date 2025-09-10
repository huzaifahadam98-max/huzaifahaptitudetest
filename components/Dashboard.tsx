import React from 'react';
import { CATEGORIES } from '../constants';
import { type QuestionCategory } from '../types';

interface DashboardProps {
  onStartQuiz: (category: QuestionCategory) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-center text-slate-700 mb-8">Choose a category to begin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map(({ id, title, description, Icon, color }, index) => (
          <button
            key={id}
            onClick={() => onStartQuiz(id)}
            style={{ animationDelay: `${index * 100}ms` }}
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.97] active:shadow-lg opacity-0 animate-fade-in-up"
          >
            <div className={`p-3 rounded-full inline-block ${color}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mt-4 text-slate-800">{title}</h3>
            <p className="text-slate-500 mt-2">{description}</p>
            <span className="mt-4 inline-block text-blue-600 font-semibold group-hover:underline">
              Start Test &rarr;
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
