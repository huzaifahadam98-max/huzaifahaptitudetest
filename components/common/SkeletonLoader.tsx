import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto animate-pulse" aria-label="Loading question...">
      {/* Header: Category and Score */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
        <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
      </div>

      {/* Question */}
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="h-16 bg-slate-200 rounded-lg"></div>
        <div className="h-16 bg-slate-200 rounded-lg"></div>
        <div className="h-16 bg-slate-200 rounded-lg"></div>
        <div className="h-16 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 h-12 bg-slate-200 rounded-md w-full"></div>
      
      {/* Bottom Buttons */}
       <div className="mt-6 flex justify-between">
        <div className="h-10 w-40 bg-slate-200 rounded-md"></div>
      </div>
    </div>
  );
};