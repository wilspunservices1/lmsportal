"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import homebanner1 from "@/assets/images/herobanner/homebanner1.jpeg";
import homebanner2 from "@/assets/images/herobanner/homebanner2.jpeg";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import SectionNameSecondary from "@/components/shared/section-names/SectionNameSecondary";
import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";
const About3 = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [homebanner1, homebanner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section>
      <div className="container">
        {/* about section   */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30px pb-30px">
          {/* about left  */}
          <div
            className="mb-20 lg:mb-0 pb-0 md:pb-30px xl:pb-0 overflow-visible"
            data-aos="fade-up"
          >
            <TiltWrapper>
              <div className="tilt relative">
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    className={`w-full rounded-lg transition-opacity duration-1000 ${idx === currentImage ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                    src={img}
                    alt={`Banner ${idx + 1}`}
                    placeholder="blur"
                  />
                ))}
              </div>
            </TiltWrapper>
          </div>
          {/* about right  */}
          <div data-aos="fade-up">
            <SectionNameSecondary>EDUCATION SOLUTION</SectionNameSecondary>
            <HeadingPrimaryXl>
              Welcome to Meridian LMS
            </HeadingPrimaryXl>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-6 pl-3 border-l-2 border-primaryColor">
            Unlock limitless learning opportunities with Meridian LMS, designed to empower educators and learners worldwide.
            </p>
            <ul className="space-y-5">
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                Explore a diverse range of high-quality educational content
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                Access fresh and engaging learning materials curated by experts
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                Upgrade your skills with the latest industry-relevant resources
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About3;
