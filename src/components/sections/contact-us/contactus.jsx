"use client";

import React, { useState } from 'react';

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
    setSubmitStatus("");
  
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }
  
      setSubmitStatus("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("Error sending message. Please try again.");
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
          <div className="bg-[#0A616F] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-yellow mb-4">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-yellow"
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
                  className="block text-sm font-medium text-yellow"
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
                  className="block text-sm font-medium text-yellow"
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
                  className="block text-sm font-medium text-yellow"
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
                  className="w-full bg-[#EB911E] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  306-3100 Kirwin Ave,
                  <br />
                  Mississauga, Ontario, L5A 3S6
                  <br />
                  Phone: <a href="tel:+16477057675" className="text-blue-600 hover:underline">+1 (647) 705 7675</a>
                </p>
              </div>

              {/* Saudi Arabia Office */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Saudi Arabia
                </h3>
                <p className="text-gray-600">
                  Ground Floor, Building 9
                  <br />
                  Askan District, Dammam, Saudi Arabia
                  <br />
                  Phone: <a href="tel:+966509394640" className="text-blue-600 hover:underline">+966 50 939 4640</a>
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
                  Phone: <a href="tel:+97338087754" className="text-blue-600 hover:underline">+973 3808 7754</a>
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