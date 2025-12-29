import React from "react";

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Refund Policy
        </h1>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Meridian Quality Management Professionals (MEQMP) strives to provide
            high-quality training programs through its self-paced Learning
            Management System (LMS). This Refund Policy outlines the conditions
            under which refunds may be granted for course enrolments.
          </p>
        </section>

        {/* Eligibility */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Eligibility for Refunds
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              Refunds must be requested before the student begins the course.
              Once a student has accessed the course materials or if the course
              access period has expired, refund requests will not be accepted
              under any circumstances.
            </p>
          </div>
        </section>

        {/* Request Process */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Refund Request Process
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              To initiate a refund request, students must submit a written
              request along with their electronic receipt as proof of purchase.
              The request should be sent to the designated email address provided
              below. Requests without valid proof of purchase may not be
              processed.
            </p>
          </div>
        </section>

        {/* Processing Timeline */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Refund Processing Timeline
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              Once a refund request is received, it will be reviewed within 7
              working days. If the request meets the eligibility criteria, the
              refund will be processed within 10 working days. The refund will
              be issued using the original method of payment. Depending on the
              payment provider, it may take additional time for the refunded
              amount to reflect in the student's account.
            </p>
          </div>
        </section>

        {/* Non-Refundable Situations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Non-Refundable Situations
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                If the student has already started the course or accessed the
                training materials.
              </li>
              <li>If the course access period has expired.</li>
              <li>
                If the student has completed the course and received a
                certificate.
              </li>
              <li>
                If the refund request is made due to a change of mind after
                course access has been granted.
              </li>
              <li>
                If the request is made due to failure to complete the course
                within the allotted timeframe.
              </li>
            </ul>
          </div>
        </section>

        {/* Exceptional Circumstances */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Exceptional Circumstances
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              In exceptional cases such as medical emergencies or other
              unforeseen circumstances, students may submit a request for
              special consideration. Such requests must include supporting
              documentation, and approval will be at the sole discretion of
              MEQMP.
            </p>
          </div>
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
              <h3 className="font-semibold mb-4 text-xl">
                Saudi Arabia Office
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Ground Floor, Building 9</p>
                <p>Iskan District, Dammam, Saudi Arabia</p>
                <p className="font-medium">Phone: +966 50 939 4640</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-xl">Bahrain Office</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Office #1195, Sitra Mall Building 574</p>
                <p>Block 611 Area Al-Hamriyah</p>
                <p className="font-medium">Phone: +973 3808 7754</p>
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

export default RefundPolicy;