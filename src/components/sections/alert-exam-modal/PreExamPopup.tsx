"use client";
import React from 'react';

interface PreExamPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  examInfo: {
    duration: number; // in minutes
    questionsCount: number;
    passingScore?: number;
    attempts?: number;
  };
}

const PreExamPopup: React.FC<PreExamPopupProps> = ({ 
  onConfirm, 
  onCancel, 
  examInfo 
}) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl relative max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-primaryColor">
          Final Exam Instructions
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Important Notice
            </h3>
            <p className="text-yellow-700">
              This is a one-time attempt exam. Once started, you cannot pause or restart the exam.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-gray-700">
                Duration: <span className="font-semibold">{examInfo.duration} minutes</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              <p className="text-gray-700">
                Questions: <span className="font-semibold">{examInfo.questionsCount} questions</span>
              </p>
            </div>

            {examInfo.passingScore && (
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-gray-700">
                  Passing Score: <span className="font-semibold">{examInfo.passingScore}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-primaryColor text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200"
            onClick={onConfirm}
          >
            Start Exam
          </button>
          <button
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreExamPopup;