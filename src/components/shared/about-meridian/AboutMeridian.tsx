
import React from 'react';

const AboutMeridian = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Meridian</h2>
          <p className="text-gray-600 mb-8">
            At Meridian, we are revolutionizing the way learning happens. Our cutting-edge Learning Management System (LMS) is designed to empower educators, businesses, and learners by providing an intuitive, efficient, and engaging digital learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Our Mission */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              We aim to bridge the gap between knowledge and accessibility by offering a robust platform that simplifies course management, enhances learner engagement, and ensures seamless collaboration.
            </p>
          </div>

          {/* Why Choose Meridian? */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose Meridian?</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>User-Centric Design – An intuitive interface for effortless navigation.</li>
              <li>Scalable Solutions – Adaptable for schools, universities, and corporate training.</li>
              <li>Secure & Reliable – Cutting-edge security for data protection and compliance.</li>
            </ul>
          </div>
        </div>

        {/* Our Vision */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To be a global leader in digital learning by continually innovating and redefining the e-learning landscape.
          </p>
          <p className="mt-6 text-lg font-semibold text-blue-600">
            Join Meridian and experience the future of learning today!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMeridian;