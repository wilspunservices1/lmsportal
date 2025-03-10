// import Image from "next/image";
// import React from "react";
// import brand1 from "@/assets/images/brand/brand_1.png";
// import brand2 from "@/assets/images/brand/brand_2.png";
// import brand3 from "@/assets/images/brand/brand_3.png";
// import brand4 from "@/assets/images/brand/brand_4.png";
// import brand5 from "@/assets/images/brand/brand_5.png";
// import brand6 from "@/assets/images/brand/brand_6.png";
// const BrandHero = () => {
//   return (
//     <div>
//       <div data-aos="fade-up">
//         <div className="container2-md flex flex-wrap items-center justify-center bg-white dark:bg-whiteColor-dark rounded-md mx-auto md:-translate-y-1/2 w-full shadow-brand">
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand1} alt="" />
//             </a>
//           </div>
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand2} alt="" />
//             </a>
//           </div>
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand3} alt="" />
//             </a>
//           </div>
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand4} alt="" />
//             </a>
//           </div>
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand5} alt="" />
//             </a>
//           </div>
//           <div className="basis-1/2 md:basis-1/4 lg:basis-1/5 flex justify-center py-4 lg:py-35px 2xl:py-45px">
//             <a href="#">
//               <Image src={brand6} alt="" />
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrandHero;

"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import brand1 from "@/assets/images/brand/brand_1.png";
import brand2 from "@/assets/images/brand/brand_2.png";
import brand3 from "@/assets/images/brand/brand_3.png";
import brand4 from "@/assets/images/brand/brand_4.png";
import brand5 from "@/assets/images/brand/brand_5.png";
import brand6 from "@/assets/images/brand/brand_6.png";

const BrandHero = () => {
  const brands = [brand1, brand2, brand3, brand4, brand5, brand6];

  // Duplicate the array for seamless looping
  const allBrands = [...brands, ...brands];

  return (
    <div>
      <div data-aos="fade-up">
        <div className="container2-md flex items-center justify-center bg-white dark:bg-whiteColor-dark rounded-md mx-auto md:-translate-y-1/2 w-full shadow-brand overflow-hidden">
          {/* Marquee Container */}
          <motion.div
            className="flex"
            initial={{ x: 0 }} // Start from the left
            animate={{ x: "-50%" }} // Move to the left by 50% of the container width
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity, // Loop infinitely
            }}
          >
            {/* Render each brand twice for seamless looping */}
            {allBrands.map((brand, idx) => (
              <div key={idx} className="flex-shrink-0 px-4 py-5">
                <a href="#">
                  <Image src={brand} alt={`brand${idx + 1}`} width={100} height={50} />
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandHero;
