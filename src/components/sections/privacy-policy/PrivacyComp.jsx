"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const PrivacyComp = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl font-extrabold text-center mb-12 text-gray-900"
          variants={fadeIn}
        >
          Privacy Policy
        </motion.h1>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          variants={fadeIn}
        >
          {/* Introduction Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Introduction
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                The Learning Management System of Meridian Quality Management
                Professionals,{" "}
                <a
                  href="https://meridian-lms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-700 underline"
                >
                  meridian-lms.com
                </a>
                , collectively referred to as “the Site”, is managed and
                operated by Meridian Quality Management Professionals (MEQMP).
                We are committed to respecting user privacy and ensuring data
                protection. In this Privacy Policy (“Policy”), “we,” “us,” and
                “our” refer to MEQMP, while “you” and “your” refer to users,
                customers, or prospective customers. This Policy outlines how we
                collect, use, and protect information through the Site.
              </p>
              <p>
                At MEQMP, we prioritize safeguarding customer data while
                enhancing their online and mobile experience. Your information
                is collected, used, and disclosed strictly in accordance with
                this Privacy Policy and applicable legal regulations.
              </p>
              <p>
                We handle personal information with the utmost responsibility,
                professionalism, and respect. If we fall short of these
                standards, MEQMP will take swift action to address concerns in a
                fair and timely manner.
              </p>
            </div>
          </motion.section>

          {/* User Policy Regarding Age Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              User Policy Regarding Age
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Our services are intended for individuals who have reached the
                age of majority in their province or country of residence. We do
                not knowingly collect or request personal information from
                children under 13. If we discover that personal data has been
                unintentionally collected from a child under 13, we will
                promptly delete it.
              </p>
              <p>
                For users aged 13 to 18, we strongly advise obtaining parental
                consent before accessing the Site or providing any personal
                information online.
              </p>
            </div>
          </motion.section>

          {/* Information Collection and Confidentiality Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Information Collection and Confidentiality
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP collects both “personal information” and “pseudonymized
                information” from users. Pseudonymized information refers to
                data that cannot be directly linked to an individual without
                additional details—examples include gender, age, or nationality.
                In contrast, personal information is any data that can directly
                identify a specific person or entity, such as a name, email
                address, government-issued ID, biometric data, or
                webcam-captured images of the user and their surroundings.
              </p>
              <p>
                Users may browse the Site without providing personal
                information. However, certain features—such as account login,
                service subscriptions, or product purchases—require users to
                submit personal details. This may include, but is not limited
                to, name, email address, phone number, postal address, company
                affiliation, job title, or industry. Additionally, our online
                contact form contains a “message” field where users may
                voluntarily provide further personal information.
              </p>
              <p>
                MEQMP may combine personal information collected through the
                Site with other data obtained from third-party sources or
                previous interactions, such as emails, phone calls, or customer
                service records. Any combined data will be classified as
                personal information and protected in accordance with this
                Policy.
              </p>
              <p>
                When using the Site, we automatically collect technical data,
                including IP addresses, browser type, pages visited, download
                activity, general geographic location, and cookies. Web logs or
                third-party tools may be used for tracking and online
                advertising.
              </p>
              <p>
                We may share personal or pseudonymized information with third
                parties to fulfill service requests, process transactions, or
                comply with legal requirements. This may include responding to
                investigations of unlawful activities or safeguarding our
                rights. In the event of a business transfer, your information
                will remain subject to this Privacy Policy or a revised version,
                with prior notification.
              </p>
              <p>
                MEQMP collects and discloses personal information only when
                necessary. Credit card details are used solely for transactions
                and are never stored. We do not sell or trade your personal
                information outside MEQMP and its affiliates.
              </p>
              <p>
                We adhere to strict data protection standards, ensuring
                compliance with all relevant legal regulations.
              </p>
            </div>
          </motion.section>

          {/* Accuracy Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Accuracy
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP ensures that all personal information used or disclosed is
                accurate, complete, and up to date. We maintain accuracy based
                on the information you provide and will update any changes
                received from you within 10 working days.
              </p>
              <p>
                If you believe your personal information is incorrect, you may
                submit a written request for correction to the Chief Privacy
                Officer.
              </p>
            </div>
          </motion.section>

          {/* Cookies and Non-Identifying Information Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Cookies and Non-Identifying Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Cookies are small data files stored on your device by your web
                browser, helping the Site recognize returning users and remember
                preferences.
              </p>
              <p>MEQMP uses:</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Session cookies</strong> – deleted when you close your
                  browser.
                </li>
                <li>
                  <strong>Persistent cookies</strong> – stored between sessions
                  to improve your experience.
                </li>
              </ul>
              <p>
                By using the Site with cookies enabled, you consent to their
                use. You may manage cookie settings in your browser to refuse or
                delete cookies. However, disabling cookies may affect certain
                features of the Site.
              </p>
            </div>
          </motion.section>

          {/* Email Correspondence Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Email Correspondence
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                If you opt-in for marketing communications, MEQMP may use your
                personal or pseudonymized information to send updates on
                products, services, and promotions.
              </p>
              <p>
                You may unsubscribe at any time via the link in our emails, and
                your details will be removed from our mailing list.
              </p>
            </div>
          </motion.section>

          {/* Transmission and Storage Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Transmission and Storage
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                The security of your personal information is our top priority.
                All data transmitted to MEQMP is encrypted using{" "}
                <strong>Secure Sockets Layer (SSL)</strong> and only decrypted
                once it reaches our secure servers.
              </p>
            </div>
          </motion.section>

          {/* Security Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Security
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP implements strict security policies to safeguard your
                personal information. We utilize{" "}
                <strong>physical, electronic, and procedural safeguards</strong>{" "}
                to protect against loss, theft, unauthorized access, or
                modification of data. While we take extensive precautions,{" "}
                <strong>no system is entirely immune to security risks.</strong>
              </p>
            </div>
          </motion.section>

          {/* Retention and Destruction Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Retention and Destruction
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP follows a structured approach to data retention and
                disposal:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Retention:</strong> Personal data is retained only as
                  long as necessary to fulfill legal, regulatory, or audit
                  requirements.
                </li>
                <li>
                  <strong>Destruction:</strong> Once data is no longer needed,
                  it is permanently removed from our systems in compliance with
                  applicable legal and industry standards.
                </li>
              </ul>
            </div>
          </motion.section>
          {/* Retention and Destruction Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Control Over Your Personal Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>You may contact us at any time to:</p>
              <ul className="list-disc pl-6">
                <li>Request access to your personal information.</li>
                <li>Verify or update your data.</li>
                <li>
                  Modify or withdraw your consent regarding data collection,
                  usage, and disclosure.
                </li>
              </ul>
            </div>
            <br />
            <div>
              <p>
                <strong>
                  Important: Withdrawing consent may affect our ability to
                  provide services, including the validity of certifications or
                  other offerings.
                </strong>
              </p>
            </div>
          </motion.section>
          {/* Policy Revisions Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Policy Revisions
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP reserves the right to modify this Privacy Policy at any
                time. Updates will be posted on our website, and we recommend
                reviewing the policy periodically to stay informed of any
                changes.
              </p>
              <p></p>
            </div>
          </motion.section>

          {/* Contact Information Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Contact Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                For any questions or concerns regarding this Privacy Policy or
                the handling of your personal information, you may contact us
                at:
              </p>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Canada
                  </h3>
                  <p>
                    306-3100 Kirwin Ave, Mississauga, Ontario, L5A 3S6
                  </p>
                  <p>Phone: +1 (647) 705 7675</p>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Saudi Arabia
                  </h3>
                  <p>
                    Office 11, 3rd Floor Building 4236 King Saud Street, Nawras,
                    Dammam
                  </p>
                  <p>Phone: +966 50 939 4640</p>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Bahrain
                  </h3>
                  <p>
                    Office #1195, Sitra Mall Building 574, Block 611 Area
                    Al-Hamriyah
                  </p>
                  <p>Phone: +973 3808 7754</p>
                </motion.div>
              </motion.div>
              <p className="mt-6">Attention: Training and IT Manager</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:training@meqmp.com"
                  className="text-yellow-600 hover:text-yellow-700 underline"
                >
                  training@meqmp.com
                </a>
              </p>
              <p className="mt-4">
                To request access to or corrections of your personal
                information, please submit a written request to:
              </p>
              <p className="font-bold mt-2">Director, Client Services</p>
              <p className="mt-4">Your request should include:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  A clear description of the information you wish to access or
                  amend.
                </li>
                <li>
                  Any relevant details to help us process your request
                  efficiently.
                </li>
              </ul>
              <p className="mt-4">
                For security purposes, we may require proof of identity before
                granting access or making changes.
              </p>
              <p className="mt-4">
                <strong>Processing Time:</strong> We will respond to all access
                or correction requests within 30 calendar days.
              </p>
              <p className="mt-4">
                If access is denied, we will provide a written explanation,
                including instructions on how you may request a review of the
                decision.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyComp;
