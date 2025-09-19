import { useWishlistContext } from "@/contexts/WshlistContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import getItemsFromLocalstorage from "@/libs/getItemsFromLocalstorage";
import PriceDisplay from "@/components/shared/PriceDisplay";

const assignColorsToCategories = (categories, depBgs) => {
  return categories?.map((category, index) => {
    const assignedColor = depBgs[index % depBgs.length];
    return { category, color: assignedColor };
  });
};

const CourseCard = ({ course, type, enrolledCourses }) => {
  const { addProductToWishlist, deleteProductFromWishlist, wishlistProducts } =
    useWishlistContext();
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showInactiveOverlay, setShowInactiveOverlay] = useState(false);

  const {
    id,
    title,
    lesson,
    duration,
    thumbnail,
    price,
    estimatedPrice,
    isFree,
    categories,
    chapters,
    status = 'published' // Default to published if not specified
  } = course;

  const isActive = status === 'published';
  const isDraft = status === 'draft';

  // Check if chapters and lectures are available to extract the lessonId
  const lessonId = chapters?.length
    ? chapters
        .sort((a, b) => parseInt(a.order) - parseInt(b.order))
        .flatMap(
          (chapter) =>
            chapter.lectures?.sort((a, b) => parseInt(a.order) - parseInt(b.order)) ||
            []
        )
        ?.find((lecture) => lecture.id)?.id
    : null;

  // Check if the user is enrolled in the course using courseId
  const isEnrolled = enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId === id);

  // Find progress for the current course from enrolledCourses
  const progress =
    enrolledCourses?.find((enrolledCourse) => enrolledCourse.courseId === id)?.progress || 0;

  useEffect(() => {
    const wishlistFromLocalStorage = getItemsFromLocalstorage("wishlist") || [];
    const isInLocalWishlist = wishlistFromLocalStorage.includes(id);
    const isInDatabaseWishlist = wishlistProducts.includes(id);

    setIsInWishlist(isInLocalWishlist || isInDatabaseWishlist);
  }, [wishlistProducts, id]);

  const handleWishlistToggle = async () => {
    if (!isActive) return; // Disable wishlist toggle for inactive/draft courses
    
    if (isInWishlist) {
      await deleteProductFromWishlist(id);
    } else {
      await addProductToWishlist(id);
    }
    setIsInWishlist(!isInWishlist);
  };

  const depBgs = [
    "bg-secondaryColor",
    "bg-blue",
    "bg-secondaryColor2",
    "bg-greencolor2",
    "bg-orange",
    "bg-yellow",
  ];

  const categoryWithColors = assignColorsToCategories(categories, depBgs);

  // Function to calculate total duration from chapters and lectures
  const calculateTotalDuration = () => {
    if (!chapters) return "0m";

    const totalMinutes = chapters.reduce((total, chapter) => {
      const chapterMinutes = chapter.lectures?.reduce((chapTotal, lecture) => {
        return chapTotal + (parseInt(lecture.duration) || 0)
      }, 0) || 0;
      return total + chapterMinutes;
    }, 0);

    return `${totalMinutes}m`;
  };

  return (
    <div
      className={`group h-full relative ${
        type === "primary" || type === "primaryMd"
          ? ""
          : `w-full sm:w-1/2 lg:w-1/3 grid-item ${type === "lg" ? "xl:w-1/4" : ""}`
      }`}
      onMouseEnter={() => !isActive && setShowInactiveOverlay(true)}
      onMouseLeave={() => setShowInactiveOverlay(false)}
    >
      {/* Inactive/Draft Course Overlay */}
      {!isActive && showInactiveOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center rounded-lg">
          <div className="text-white text-center p-4">
            <p className="text-lg font-bold mb-2">
              {isDraft ? "Draft Course" : "Inactive Course"}
            </p>
            <p className="text-sm">
              {isDraft 
                ? "This course is not accessible yet."
                : "This course is not currently available for enrollment"}
            </p>
          </div>
        </div>
      )}

      <div className={`${type === "primaryMd" ? "" : "sm:px-15px mb-30px"} ${!isActive ? "opacity-80" : ""}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
          {/* Card image */}
          <div className="relative mb-2">
            <Link
              href={isActive ? `/courses/${id}` : '#'}
              className="w-full h-[150px] overflow-hidden rounded"
              onClick={e => !isActive && e.preventDefault()}
            >
              <CldImage
                width="400"
                height="300"
                src={thumbnail}
                sizes={"20w"}
                alt={title}
                className={`object-cover w-full h-full ${!isActive ? "grayscale-20" : ""}`}
              />
            </Link>

            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div className="flex gap-2 flex-wrap">
                {categoryWithColors.map((item, index) => (
                  <div key={index} className="">
                    <p
                      className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold capitalize ${item.color}`}
                    >
                      {item.category}
                    </p>
                  </div>
                ))}
              </div>
              {/* Hide wishlist button if user is enrolled or course is inactive/draft */}
              {!isEnrolled && isActive && (
                <button
                  onClick={handleWishlistToggle}
                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                >
                  <i
                    className={`icofont-heart-alt text-base py-1 px-2 ${
                      isInWishlist ? "text-red-500" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Card content */}
          <div>
            <div className="grid grid-cols-2 mb-3">
              <div className="flex items-center">
                <div>
                  <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {lesson}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {calculateTotalDuration()}
                  </span>
                </div>
              </div>
            </div>
            <h5 className={`${type === "primaryMd" ? "text-lg " : "text-xl "}`}>
              <Link
                href={isActive ? `/courses/${id}` : '#'}
                className={`font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor ${
                  type === "primaryMd" ? "leading-25px" : "leading-27px "
                }`}
                onClick={e => !isActive && e.preventDefault()}
              >
                {title}
              </Link>
            </h5>

            {/* Show price or "Go to Course" button based on enrollment status */}
            {!isEnrolled ? (
              <div className="text-lg font-semibold text-primaryColor mb-4">
                <PriceDisplay usdPrice={parseFloat(price)} />
                <del className="text-sm text-lightGrey4 font-semibold ml-1">
                  / <PriceDisplay usdPrice={parseFloat(estimatedPrice)} />
                </del>
                <span
                  className={`ml-6 text-base font-semibold ${
                    isFree ? "text-greencolor" : "text-secondaryColor3"
                  }`}
                >
                  {isFree ? "Free" : <span></span>}
                </span>
              </div>
            ) : (
              <div className="mb-4">
                {lessonId ? (
                  <Link
                    href={`/lessons/${lessonId}`}
                    className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-2 md:px-10 bg-primaryColor dark:bg-primaryColor-dark hover:bg-primaryColor-dark dark:hover:bg-primaryColor rounded"
                  >
                    Go to Course
                  </Link>
                ) : (
                  <p className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-2 md:px-10 bg-primaryColor dark:bg-primaryColor-dark hover:bg-primaryColor-dark dark:hover:bg-primaryColor rounded">
                    No Lesson
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Course Progress */}
          {isEnrolled && (
            <div>
              {progress > 0 && (
                <div className="lg:h-25px md:h-20px sm:h-15px h-10px w-full bg-blue-x-light rounded-md relative mt-5 mb-15px">
                  <div
                    className="text-center bg-primaryColor absolute top-0 left-0 rounded-md leading-25px"
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                    }}
                  >
                    <span className="text-size-10 text-whiteColor block leading-25px">
                      {progress}% Complete
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;