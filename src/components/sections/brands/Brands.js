import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/** Example brand images. Replace with your actual imports */
import brand1 from "@/assets/images/brand/brand_1.png";
import brand2 from "@/assets/images/brand/brand_2.png";
import brand3 from "@/assets/images/brand/brand_3.png";
import brand4 from "@/assets/images/brand/brand_4.png";
import brand5 from "@/assets/images/brand/brand_5.png";
import brand6 from "@/assets/images/brand/brand_6.png";

const Brands = () => {
  const brands = [brand1, brand2, brand3, brand4, brand5, brand6];

  // Duplicate the array so it can seamlessly loop
  const allBrands = [...brands, ...brands];

  console.log("Brands:", brands); // Debug: Check if images are loaded

  return (
    <section className="bg-lightGrey10 dark:bg-lightGrey10-dark">
      <div className="container pb-10">
        {/* Brands Heading */}
        <div className="mb-5 md:mb-10" data-aos="fade-up">
          <HeadingPrimary text="center">
            Trusted by Engineers and <br />
            Beloved by Executives
          </HeadingPrimary>
        </div>

        {/* Marquee Container */}
        <div className="overflow-hidden relative cursor-grab w-full border-2 border-red-500">
          {/* The row that moves (motion.div) */}
          <motion.div
            className="flex whitespace-nowrap border-2 border-blue-500"
            initial={{ x: 0 }} // Start from the left
            animate={{ x: "-100%" }} // Move to the left by 100% of the container width
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity,
            }}
          >
            {/* Render each brand twice for seamless looping */}
            {allBrands.map((brand, idx) => (
              <div key={idx} className="flex-shrink-0 mx-6">
                <Link href="#" className="flex justify-center">
                  <Image
                    src={brand}
                    alt={`Brand ${idx}`}
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
