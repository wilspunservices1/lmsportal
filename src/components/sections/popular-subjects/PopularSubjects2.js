import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import Subject from "@/components/shared/popular-subjects/Subject";
import SectionName from "@/components/shared/section-names/SectionName";
import Link from "next/link";
import React from "react";

// Import the category images
import Category1 from "@/assets/images/categories/category1.png";
import Category2 from "@/assets/images/categories/category2.png";
import Category3 from "@/assets/images/categories/category3.png";
import Category4 from "@/assets/images/categories/category4.png";
import Category5 from "@/assets/images/categories/category5.png";
import Category6 from "@/assets/images/categories/category6.png";
import Category7 from "@/assets/images/categories/category7.png";

const PopularSubjects2 = () => {
  const subjects = [
    {
      id: 1,
      title: "Food Safety & HACCP",
      desc: "",
      navButton: false,
      category: "Food & Safety",
      svg: (
        <div className="relative w-20 h-[70px]">
          <img 
            src={Category1.src} 
            alt="Food Safety" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Environmental Management",
      desc: "",
      navButton: false,
      category: "Environmental System",
      svg: (
        <div className="relative w-20 h-[60px]">
          <img 
            src={Category2.src} 
            alt="Environmental Management" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Health & Safety",
      desc: "",
      navButton: false,
      category: "Fitness & Health",
      svg: (
        <div className="relative w-20 h-[90px]">
          <img 
            src={Category3.src} 
            alt="Health & Safety" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Six Sigma",
      desc: "",
      navButton: false,
      category: "Sigma Development",
      svg: (
        <div className="relative w-20 h-[90px]">
          <img 
            src={Category4.src} 
            alt="Six Sigma" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Quality Management",
      desc: "",
      navButton: false,
      category: "Business Quality",
      svg: (
        <div className="relative w-20 h-[90px]">
          <img 
            src={Category5.src} 
            alt="Quality Management" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              ></path>
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Project Management",
      desc: "",
      navButton: false,
      category: "Management",
      svg: (
        <div className="relative w-20 h-[90px]">
          <img 
            src={Category6.src} 
            alt="Project Management" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              ></path>
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Business Continuity",
      desc: "",
      navButton: false,
      category: "Business",
      svg: (
        <div className="relative w-20 h-[90px]">
          <img 
            src={Category7.src} 
            alt="Business Continuity" 
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px] object-contain"
          />
          <div className="service__bg__img w-20 h-[60px]">
            <svg
              className="w-20 h-[60px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              ></path>
            </svg>
          </div>
        </div>
      ),
    },
  ];
  return (
    <section className=" py-20">
      <div className="container">
        {/* Subject Header  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-30px mb-65px">
          <div className="lg:col-star-1 lg:col-span-4">
            <h3
              className="text-3xl md:text-size-35 2xl:text-size-38 3xl:text-size-42 leading-10 md:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor dark:text-blackColor-dark"
              data-aos="fade-up"
            >
              <span className="relative after:w-full after:h-[7px]   after:absolute after:left-0 after:bottom-3 md:after:bottom-4 after:z-[-1]">
                Course Categories
              </span>
            </h3>
          </div>

          <div className="lg:col-star-5 lg:col-span-5">
            {/* <p
              className="text-sm md:text-base text-contentColor dark:text-contentColor-dark mb-10px 2xl:mb-50px 2xl:pl-50px"
              data-aos="fade-up"
            >
              Forging relationships between multi to national governments and
              global NGOs begins.
            </p> */}
          </div>
          <div
            className="lg:col-star-10 lg:col-span-3 flex lg:justify-end"
            data-aos="fade-up"
          >
            <div>
              <Link href="/courses" passHref>
                <ButtonPrimary color="secondary" arrow={true}>
                  All Categories
                </ButtonPrimary>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-30px">
          {/* subject cards  */}
          {subjects.map((subject, idx) => (
            <Subject key={idx} subject={subject} type="primary" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSubjects2;