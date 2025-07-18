import React from 'react';

const AboutMeridian = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Meridian</h2>
          <p className="text-gray-600 mb-8">
            We are redefining learning with a futuristic LMS that empowers educators, businesses, and learners. Designed for maximum efficiency and engagement, our intuitive platform ensures seamless knowledge transfer and an unparalleled digital learning experience.
          </p>
        </div>

        {/* Mission and Vision side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Our Mission */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              We aim to transform online learning by offering a seamless platform that simplifies course management, enhances learner engagement, and enables effortless collaboration.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To revolutionize digital learning through continuous innovation, setting new standards in engagement, accessibility, and technology-driven education worldwide.
            </p>
          </div>
        </div>

        {/* Why Choose Meridian? below */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose Meridian?</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Seamless Experience</strong> – Our intuitive, user-friendly interface ensures smooth navigation, minimizing learning curves and maximizing efficiency.</li>
            <li><strong>Built to Scale</strong> – Whether for schools, universities, or corporate training, our platform adapts to your needs, growing with you effortlessly.</li>
            <li><strong>Uncompromising Security</strong> – Enterprise-grade protection ensures your data stays safe, meeting the highest compliance standards with zero compromises.</li>
          </ul>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-blue-600">
            Join Meridian and experience the future of learning today!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMeridian;