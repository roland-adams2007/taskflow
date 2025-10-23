// NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-slate-400">
          If you believe this is an error, please contact support
        </p>
      </div>
    </div>
  );
};

export default NotFound;