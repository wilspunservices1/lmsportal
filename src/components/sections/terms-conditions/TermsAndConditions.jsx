'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const TermsAndConditions = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Component to highlight important words
  const HighlightText = ({ children }) => {
    const importantWords = ['non-refundable', 'confidentiality', 'unauthorized', 'prohibited', 
                          'termination', 'liability', 'governed by', 'must', 'required', 'responsible'];
    
    const regex = new RegExp(`\\b(${importantWords.join('|')})\\b`, 'gi');
    
    const parts = children.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          importantWords.includes(part.toLowerCase()) ? (
            <span key={i} className="bg-yellow-200 px-1 rounded font-medium">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto px-4 py-8 md:px-6 lg:px-8 font-sans text-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-yellow">Terms and Conditions for Meridian Learning Management System (LMS)</h1>
        <p className="text-gray-500 text-sm sm:text-base">Last Updated: [09-04-2025]</p>
      </motion.div>

      {/* Introduction */}
      <motion.div 
        variants={itemVariants}
        className="mb-10 p-4 bg-gray-50 rounded-lg"
      >
        <p className="text-gray-700 leading-relaxed">
          <HighlightText>
            By signing up and using this Meridian Learning Management System (LMS), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before registering.
          </HighlightText>
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              By creating an account on this LMS, you acknowledge that you have read, understood, and agreed to these Terms and Conditions, as well as our Privacy Policy and Refund Policy (if applicable). If you do not agree, you must not proceed with registration.
            </HighlightText>
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">2. User Registration</h2>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              You must provide accurate and complete information during registration.
            </HighlightText>
          </p>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              You are responsible for maintaining the confidentiality of your login credentials.
            </HighlightText>
          </p>
          <p className="text-gray-700">
            <HighlightText>
              You must notify us immediately of any unauthorized use of your account.
            </HighlightText>
          </p>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">3. Course Access & Payments</h2>
          <p className="text-gray-700 mb-2">
            The Meridian LMS offers paid courses related to food safety, health safety, and other professional training programs.
          </p>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              Payment must be made in full before accessing any paid course.
            </HighlightText>
          </p>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              All fees are non-refundable unless stated otherwise in our Refund Policy.
            </HighlightText>
          </p>
          <p className="text-gray-700">
            The Meridian LMS reserves the right to modify course fees at any time.
          </p>
        </motion.div>

        {/* Section 4 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">4. Course Content & Usage</h2>
          <p className="text-gray-700 mb-2">
            All course materials (videos, documents, quizzes, etc.) are for personal and professional learning only.
          </p>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              You may not redistribute, resell, or share course content without explicit permission.
            </HighlightText>
          </p>
          <p className="text-gray-700">
            The Meridian LMS reserves the right to update or remove course content without prior notice.
          </p>
        </motion.div>

        {/* Section 5 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">5. Quizzes, Exams, & Certificates</h2>
          <p className="text-gray-700 mb-2">
            Each course module includes quizzes that must be completed to progress.
          </p>
          <p className="text-gray-700 mb-2">
            <HighlightText>
              A final exam must be passed to receive a Certificate of Completion.
            </HighlightText>
          </p>
          <p className="text-gray-700 mb-2">
            Passing scores are determined by the Meridian LMS and may vary per course.
          </p>
          <p className="text-gray-700 mb-2">
            Certificates are issued digitally and may include the user's name, course title, and completion date.
          </p>
          <p className="text-gray-700">
            <HighlightText>
              Certificates are non-transferable and may be verified by employers or institutions.
            </HighlightText>
          </p>
        </motion.div>

        {/* Section 6 */}
        <motion.div 
          variants={itemVariants}
          className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          whileHover={{ scale: isMobile ? 1 : 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-yellow">6. User Conduct & Prohibited Actions</h2>
          <p className="text-gray-700 mb-2">
            <HighlightText>You agree not to:</HighlightText>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><HighlightText>Share login details or allow unauthorized access.</HighlightText></li>
            <li><HighlightText>Use automated systems (bots, scrapers) to interact with the Meridian LMS.</HighlightText></li>
            <li><HighlightText>Attempt to bypass security measures or disrupt the platform.</HighlightText></li>
            <li><HighlightText>Post harmful, offensive, or illegal content.</HighlightText></li>
            <li><HighlightText>Violate copyright laws by duplicating or distributing course materials.</HighlightText></li>
          </ul>
        </motion.div>

      </div>

      {/* Conclusion */}
      <motion.div 
        variants={itemVariants}
        className="mt-10 p-5 rounded-lg border border-yellow-100"
      >
        <p className="text-gray-800 font-medium mb-2">
          <HighlightText>
            By registering, you confirm that you have read, understood, and agreed to these Terms and Conditions.
          </HighlightText>
        </p>
        <p className="text-gray-700">
          For any questions, contact: <span className="text-yellow font-medium">[training@meqmp.com]</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TermsAndConditions;