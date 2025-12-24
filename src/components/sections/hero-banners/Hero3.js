"use client";
const {
  default: TiltWrapper,
} = require("@/components/shared/wrappers/TiltWrapper");
const { default: Image } = require("next/image");
import homebanner1 from "@/assets/images/herobanner/homebanner1.jpeg";
import homebanner2 from "@/assets/images/herobanner/homebanner2.jpeg";
import { useState, useEffect } from "react";
import AppleImage from "@/components/shared/animaited-images/AppleImage";
import BalbImage from "@/components/shared/animaited-images/BalbImage";
import BookImage from "@/components/shared/animaited-images/BookImage";
import GlobImage from "@/components/shared/animaited-images/GlobImage";
import TriangleImage from "@/components/shared/animaited-images/TriangleImage";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import HeadingXl from "@/components/shared/headings/HeadingXl";
import HreoName from "@/components/shared/section-names/HreoName";
import Link from "next/link";
const Hero3 = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [homebanner1, homebanner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section data-aos="fade-up">
      {/* banner section */}
      <div className="bg-lightGrey11 dark:bg-lightGrey11-dark relative z-0 overflow-hidden py-30px md:py-60px lg:pt-40px lg:pb-50px 2xl:pt-60px 2xl:pb-80px">
        {/* animated icons */}
        <div>
          {/* <BookImage /> */}
          <GlobImage />
          {/* <BalbImage /> */}
          {/* <AppleImage /> */}
          <TriangleImage />
        </div>
        <div className="container 2xl:container-secondary-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* banner Left */}
                  <div data-aos="fade-up">
                    <HreoName>EDUCATION SOLUTION</HreoName>
                    <HeadingXl>
                    Cloud-Based LMS <br className="hidden md:block" />
                    Trusted by Many Organizations
                    </HeadingXl>
                    <p className="text-size-15 md:text-lg text-blackColor dark:text-blackColor-dark font-medium mb-45px">
                    For <strong>educators</strong>, it's a powerful platform to create, manage, and
                    deliver engaging courses with ease. <br></br>
                    For <strong>learners</strong>, it's a seamless way to gain new skills anytime,
                    anywhere. Scalable, intuitive, and built for success—experience
                    learning without limits.
                    </p>

                    <div className="space-x-5 md:space-x-30px">
                    <Link href="/courses">
                      <ButtonPrimary>View Courses</ButtonPrimary>
                    </Link>
                    </div>
                  </div>
                  {/* banner right */}
            <div data-aos="fade-up">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3;
