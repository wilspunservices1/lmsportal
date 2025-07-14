import React from 'react';

const ComplaintPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Complaint Policy
        </h1>

        {/* Purpose Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Purpose
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Meridian Quality Management Professionals (MEQMP) is committed to providing 
            a fair and transparent complaint resolution process for learners enrolled 
            in our self-paced training programs and exams conducted on our Learning 
            Management System (LMS).
          </p>
        </section>

        {/* Scope Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Scope
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This policy applies to all learners who have enrolled in training courses 
            or taken exams on the LMS and wish to raise a formal complaint regarding:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Training materials</li>
            <li>System functionality</li>
            <li>Instructor feedback</li>
            <li>Assessment process</li>
            <li>Overall learning experience</li>
          </ul>
        </section>

        {/* Timeline Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Complaint Submission and Timeline
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Training Complaints</h3>
              <p className="text-gray-700 dark:text-gray-300">
              Training-related complaints must be submitted within 15 calendar days from the date of the incident or the completion of the training course.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Exam Complaints</h3>
              <p className="text-gray-700 dark:text-gray-300">
              Complaints related to exams, including grading, system errors, or exam procedures, must be submitted within 7 calendar days after the exam results are released. Late complaints may not be considered unless exceptional circumstances are demonstrated.
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Review and Resolution Process
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-4 text-gray-700 dark:text-gray-300">
                <li>Submit complaint in writing via email</li>
                <li>Receive acknowledgment within 3 working days</li>
                <li>Review by LMS Support Team (10 working days)</li>
                <li>Resolution communication</li>
                <li>Optional appeal within 5 working days</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Confidentiality and Fairness
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          All complaints will be handled confidentially and impartially, ensuring there is no retaliation against complainants. MEQMP is committed to resolving complaints in a manner that is fair and consistent with our training and assessment standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          
Record-Keeping

          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          All complaints and resolutions will be documented for quality assurance and continuous improvement purposes.
          </p>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-xl">Canada Office</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>306-3100 Kirwin Ave,</p>
                <p>Ontario , SK, S7K 1K6</p>
                <p className="font-medium">Phone: +1 (647) 705 7675</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-xl">Saudi Arabia Office</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Office 11, 3rd Floor Building 4236</p>
                <p>King Saud Street, Nawras, Dammam</p>
                <p className="font-medium">Phone: +966 50 939 4640</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="font-medium">Email: training@meqmp.com</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Attention: Training and IT Manager
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComplaintPolicy;
