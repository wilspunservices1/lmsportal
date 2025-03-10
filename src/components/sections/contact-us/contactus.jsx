"use client";

import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3000/send-email', formData);
      setSubmitStatus('Email sent successfully!');
      console.log(response.data);
    } catch (error) {
      setSubmitStatus('Error sending email. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-[#EB911E] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subject"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0A616F] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              {submitStatus && (
                <p className="text-center text-sm text-gray-600">
                  {submitStatus}
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Offices
            </h2>
            <div className="space-y-6">
              {/* Canada Office */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Canada</h3>
                <p className="text-gray-600">
                  Unit 400, 111 2nd Avenue South
                  <br />
                  Saskatoon, SK, S7K 1K6
                  <br />
                  Phone: +1 (647) 705 7675
                </p>
              </div>

              {/* Saudi Arabia Office */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Saudi Arabia
                </h3>
                <p className="text-gray-600">
                  Office 11, 3rd Floor Building 4236
                  <br />
                  King Saud Street, Nawras, Dammam
                  <br />
                  Phone: +966 50 939 4640
                </p>
              </div>

              {/* Bahrain Office */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Bahrain</h3>
                <p className="text-gray-600">
                  Office #1195, Sitra Mall Building 574
                  <br />
                  Block 611 Area Al-Hamriyah
                  <br />
                  Phone: +973 3808 7754
                </p>
              </div>

              {/* General Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  General Inquiries
                </h3>
                <p className="text-gray-600">
                  Attention: Training and IT Manager
                  <br />
                  Email:{' '}
                  <a
                    href="mailto:training@meqmp.com"
                    className="text-blue-600 hover:underline"
                  >
                    training@meqmp.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;