"use client";

import React, { useState } from "react";

interface CoursePDFUploadProps {
  courseId: string;
}

const CoursePDFUpload: React.FC<CoursePDFUploadProps> = ({ courseId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPDF, setUploadedPDF] = useState<{url: string, name: string} | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      console.log("Invalid file:", file?.type);
      return;
    }

    if (!courseId) {
      console.error("No courseId available");
      return;
    }

    console.log("Uploading file:", file.name, "CourseId:", courseId);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);

      const response = await fetch("/api/courses/pdf-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("PDF uploaded:", data.pdfUrl);
        setUploadedPDF({ url: data.pdfUrl, name: file.name });
      } else {
        console.error("Upload error:", data.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!courseId) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Please save course first</p>
      </div>
    );
  }

  return (
    <div>
      {uploadedPDF ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{uploadedPDF.name}</p>
              <p className="text-xs text-gray-500">PDF uploaded successfully</p>
            </div>
            <button
              onClick={() => setUploadedPDF(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {isUploading ? (
            <p className="text-sm text-gray-600">Uploading...</p>
          ) : (
            <>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <p className="text-sm text-gray-600 mb-2">Upload PDF</p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePDFUpload;