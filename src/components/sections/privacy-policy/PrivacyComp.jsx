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
                Learning Management System of Meridian Quality Management
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
                operated by Meridian Quality Management Professionals (MEQMP). At
                MEQMP, we are committed to respecting the privacy of our users.
                In this Privacy Policy, the terms “we,” “us,” and “our” refer to
                Meridian Quality Management Professionals (MEQMP), while “you”
                and “your” refer to the user, customer, or prospective customer
                of the Site. This Privacy Policy (“Policy”) outlines our approach
                to handling and protecting the information collected through the
                Site.
              </p>
              <p>
                MEQMP values its customers and understands the importance of
                safeguarding their personal information. Our objective is to
                enhance your online and mobile experience while ensuring that
                your information remains secure. We collect, use, and disclose
                your information strictly in accordance with this Privacy Policy
                and relevant government regulations and policies.
              </p>
              <p>
                We are dedicated to handling all personal information with the
                highest level of responsibility, professionalism, and respect.
                In the unlikely event that we do not meet these standards, MEQMP
                will take prompt and appropriate action to address your concerns
                in a fair and timely manner.
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
                Our services are intended only for individuals who have reached
                the age of majority in their respective province of residence.
                We do not knowingly collect or request personal information from
                individuals under the age of 13 through the Site. If we become
                aware that we have unintentionally gathered personal data from a
                child under 13, we will take immediate steps to delete that
                information.
              </p>
              <p>
                For individuals between the ages of 13 and 18, we strongly
                recommend obtaining parental consent before using the Site or
                sharing any personal details online.
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
                information” from users. Pseudonymized information refers to data
                that cannot be directly linked to an individual without
                additional details—examples include gender, age, or nationality.
                In contrast, personal information is any data that can be directly
                associated with a specific person or entity, such as a name,
                email address, government-issued photo ID, biometric data, or
                webcam-captured images of the user and their surroundings.
              </p>
              <p>
                Visitors can browse the Site without providing personal
                information. However, certain features, such as account login or
                product purchases, require users to submit personal details. This
                may include, but is not limited to, name, email address, phone
                number, postal address, company affiliation, job title, or
                industry. Additionally, our online contact form contains a
                “message” field where users may voluntarily provide further
                personal information.
              </p>
              <p>
                MEQMP may combine the personal information collected through the
                Site with other data obtained from third-party sources or
                previous interactions, such as email communications, phone
                conversations, or customer service records. Any such combined
                data will be treated as personal information and safeguarded in
                accordance with this Policy.
              </p>
              <p>
                When you use the Site, we automatically collect information such
                as your IP address, browser details, pages visited, download
                activity, general geographic location, and certain cookies. We
                may use web logs or third-party tools for this purpose,
                including for online advertising.
              </p>
              <p>
                We may share your personal or pseudonymized information with
                third parties to fulfill requests, complete transactions, or
                comply with legal obligations. This includes investigating
                illegal activities or protecting our rights. In the event of a
                business transfer, your information will be subject to this
                Privacy Policy or a new one, with your consent.
              </p>
              <p>
                We collect and disclose personal information only as necessary.
                Credit card details are used only for transactions and not
                stored. We do not sell or trade your personal information
                outside MEQMP and its affiliates.
              </p>
              <p>
                We aim to collect and use your information responsibly, as
                required by law.
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
                MEQMP ensures that personal information it uses or discloses is
                accurate, complete, and up to date. We will maintain the
                accuracy of your information based on what you provide and will
                record any changes received from you within 10 working days.
              </p>
              <p>
                If you disagree with the accuracy of your personal information,
                you can request a correction in writing, addressed to the Chief
                Privacy Officer.
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
                Cookies are small files placed on your computer by your web
                browser to help the Site recognize your previous visits and
                store user preferences.
              </p>
              <p>
                MEQMP uses both session cookies (deleted when your browser is
                closed) and persistent cookies (remaining between sessions) to
                enhance your experience on the Site. By using the Site with
                cookies enabled, you consent to their use.
              </p>
              <p>
                You can manage cookie settings in your browser to refuse all
                cookies or receive alerts before accepting them. Please note that
                blocking or deleting cookies may limit certain features on the
                Site.
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
                If you opt-in for marketing communications, we may use your
                personal or pseudonymized information to send you updates about
                products, services, and promotions. You can unsubscribe at any
                time using the link in the emails, and you will be removed from
                our mailing list.
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
                The security of your personal information is a priority. Any
                personal data transmitted to us is encrypted through Secure
                Sockets Layer (SSL) and only decoded when it reaches our servers.
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
                We have policies in place to protect your personal information,
                both electronically and physically. MEQMP employs reasonable
                safeguards—physical, electronic, and procedural—to protect your
                data against loss, theft, unauthorized access, or modifications.
                While we take every measure to protect your information, no
                system is completely secure.
              </p>
            </div>
          </motion.section>

          {/* Retention Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Retention
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                MEQMP follows systematic practices for retaining and destroying
                personal information that is no longer needed, in line with
                audit requirements and other obligations.
              </p>
            </div>
          </motion.section>

          {/* Destruction Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Destruction
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Personal information is purged from our systems after a
                reasonable period, following the completion of relevant audit or
                legal requirements.
              </p>
            </div>
          </motion.section>

          {/* Control of Your Personal Information Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Control of Your Personal Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                You can contact us at any time to access, verify, or update your
                personal information, or to amend or withdraw your consent to our
                collection, use, and disclosure of your data as outlined in this
                Privacy Policy.
              </p>
              <p>
                Please be aware that withholding or withdrawing consent may
                affect our ability to serve you, potentially invalidating
                certifications or other services.
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
                MEQMP reserves the right to update this Privacy Policy at any
                time, with revisions posted on our website. We recommend checking
                this policy periodically to stay informed of any changes.
              </p>
            </div>
          </motion.section>

          {/* Contact Information Section */}
          <motion.section className="mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
              Contact Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                For questions or concerns about this Privacy Policy or your
                personal information, please contact us at:
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
                  <p>Unit 400, 111 2nd Avenue South Saskatoon, SK, S7K 1K6</p>
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
                To request access or corrections to your personal information,
                please submit a written request to the Director, Client Services,
                including a description of the information you seek. We may ask
                for proof of identity to ensure proper access and security.
              </p>
              <p className="mt-4">
                We will respond to access or correction requests within 30
                calendar days, providing reasons if disclosure is not granted
                and instructions for requesting a review of the decision.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyComp;