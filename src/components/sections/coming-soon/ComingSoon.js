"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ComingSoon = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const decodedCategory = category ? decodeURIComponent(category) : "This Category";

  return (
    <div className="container py-100px">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-30px">
          <svg
            className="w-100px h-100px mx-auto text-primaryColor"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
            <path
              d="M50 30v20m0 10v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="text-size-35 font-bold text-blackColor dark:text-blackColor-dark mb-15px">
          Coming Soon
        </h2>

        <p className="text-lg text-contentColor dark:text-contentColor-dark mb-30px max-w-500px">
          Exciting courses in <span className="font-semibold">{decodedCategory}</span> are on their way! 
          Check back soon for amazing learning opportunities.
        </p>

        <div className="flex gap-15px">
          <Link
            href="/"
            className="px-30px py-12px bg-primaryColor text-whiteColor rounded-md hover:bg-secondaryColor transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/courses"
            className="px-30px py-12px bg-secondaryColor text-whiteColor rounded-md hover:bg-primaryColor transition-all duration-300"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
