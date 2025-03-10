"use client";
import React from "react";

interface PreQuizPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const PreQuizPopup: React.FC<PreQuizPopupProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg relative max-w-sm w-full mx-4 text-center">
        {/* If you need a close button, add it here. Otherwise omit. */}
        
        <h2 className="text-xl font-bold mb-2">Start Quiz</h2>
        <p className="mb-4 text-gray-700">
          Ready to start the quiz.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Start
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreQuizPopup;
