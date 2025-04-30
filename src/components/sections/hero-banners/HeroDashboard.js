"use client";

import dashboardImage2 from "@/assets/images/dashbord/dashbord__2.jpg";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomFileUpload from "./_comp/camera";
import CoverUpload from "./_comp/coverUpload"; // New component for cover image upload
import {
  fetchUserDetailsFromApi,
  changeProfileImage,
  changeCoverImage,
} from "@/actions/getUser";
import { CldImage } from "next-cloudinary";
import DropdownSwitcher from "./_comp/DropdownSwitcher";
import { redirect } from "next/navigation";
import SkeletonText from "@/components/Loaders/SkeletonText";
import SkeletonResultsText from "@/components/Loaders/LineSkeleton";

const HeroDashboard = () => {
  const pathname = usePathname();
  const partOfPathName = pathname.split("/")[2].split("-")[0];
  const isAdmin = partOfPathName === "admin";
  const isInstructor = partOfPathName === "instructor";
  const { data: session } = useSession();

  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!session) {
    redirect("/login");
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
        if (session?.user?.id) {
            setIsLoading(true);
            try {
                const userData = await fetchUserDetailsFromApi(session.user.id);
                setUserDetails(userData);
                setProfileImage(userData.image || (isAdmin || isInstructor ? dashboardImage2 : teacherImage2));
                
                // Force a re-render by creating a new URL object
                if (userData.coverImage) {
                    const coverImageUrl = new URL(userData.coverImage).toString();
                    setCoverImage(coverImageUrl);
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                setError("Failed to fetch user details.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    fetchUserDetails();
}, [session?.user?.id, isAdmin, isInstructor]);



// Add useEffect to log cover image changes
useEffect(() => {
    console.log('Cover image state changed to:', coverImage);
}, [coverImage]);

  
  
  const getDefaultCoverBackground = () => {
    if (isAdmin) return "bg-primaryColor";
    if (isInstructor) return "bg-naveBlue";
    return "bg-skycolor";
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (imagePath) => {
    setIsUploading(true);
    try {
      await changeProfileImage(session.user.id, imagePath);
      setProfileImage(imagePath);
      setError(null);
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError("Failed to update profile image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (imagePath) => {
    setIsUploading(true);
    try {
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }
  
      // First update the database
      await changeCoverImage(session.user.id, imagePath);
      
      // Then update local state
      setCoverImage(imagePath);
      
      // Update the full user details
      const updatedUserData = await fetchUserDetailsFromApi(session.user.id);
      setUserDetails(updatedUserData);
  
      setError(null);
    } catch (error) {
      console.error("Error updating cover image:", error);
      setError("Failed to update cover image.");
      // Revert to previous cover image if update fails
      const userData = await fetchUserDetailsFromApi(session.user.id);
      setCoverImage(userData.coverImage);
    } finally {
      setIsUploading(false);
    }
  };
  

  if (isLoading) {
    return (
      <div className="container-fluid-2">
        <div className="p-5 md:p-10 rounded-5 bg-gray-200 animate-pulse">
          <div className="h-64"></div>
        </div>
      </div>
    );
  }
  return (
    <section>
      {isUploading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/70 text-white px-4 py-2 rounded">
            Uploading...
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-500/90 text-white px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="container-fluid-2">
        <div
          key={coverImage} // This will force a re-render when coverImage changes
          className={`p-5 md:p-10 rounded-5 flex justify-center md:justify-between items-center flex-wrap gap-2 relative`}
          style={{
              backgroundImage: coverImage ? `url(${coverImage}?t=${Date.now()})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: !coverImage ? getDefaultCoverBackground() : "transparent",
              minHeight: "250px",
          }}
        >
          {/* Cover image upload button (positioned absolutely) */}
          <div className="absolute top-4 right-4 z-10">
            <CoverUpload
              userId={session?.user?.id}
              setCoverImage={handleCoverImageUpload}
            />
          </div>

          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-5"></div>

          <div className="flex items-center flex-wrap justify-center sm:justify-start relative group z-10">
            <div className="mr-10px lg:mr-5 relative">
              {userDetails && userDetails?.image ? (
                <CldImage
                  width="200"
                  height="200"
                  src={
                    profileImage ||
                    (isAdmin || isInstructor ? dashboardImage2 : teacherImage2)
                  }
                  alt="User profile"
                  className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content"
                />
              ) : (
                <Image
                  src={
                    isInstructor ||
                    (isAdmin || isInstructor ? dashboardImage2 : teacherImage2)
                  }
                  alt="User profile"
                  className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content"
                />
              )}
              <CustomFileUpload setImageUrl={handleProfileImageUpload} />
            </div>

            {isAdmin || isInstructor ? (
              <div className="text-whiteColor font-bold text-center sm:text-start">
                <h5 className="text-xl leading-1.2 mb-5px">Hello</h5>
                <h2 className="text-2xl leading-1.24">
                  {userDetails ? userDetails.name : <SkeletonResultsText />}
                </h2>
              </div>
            ) : (
              <div className="text-whiteColor font-bold text-center sm:text-start">
                <h5 className="text-2xl leading-1.24 mb-5px">
                  {userDetails ? userDetails.username : <SkeletonResultsText />}
                </h5>
                <ul className="flex items-center gap-15px">
                  <li className="text-sm font-normal flex items-center gap-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-book-open mr-0.5"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>{" "}
                    {userDetails?.enrolledCourses?.length || 0} Courses Enrolled
                  </li>
                  <li className="text-sm font-normal flex items-center gap-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-award"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                    {userDetails ? userDetails.certificates : 0} Certificates
                  </li>
                </ul>
              </div>
            )}
          </div>

          {isUploading && <p className="text-yellow z-10">Uploading...</p>}
          {error && <p className="text-red-500 z-10">{error}</p>}

          <div className="z-10">
            {session?.user.roles[0] === "user" ? (
              <Link
                href={`/courses`}
                className={`text-size-15 border text-whiteColor   ${
                  isAdmin
                    ? "bg-primaryColor border-whiteColor hover:text-primaryColor"
                    : isInstructor
                    ? "bg-primaryColor  border-primaryColor hover:text-primaryColor"
                    : "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
                }  px-25px py-10px hover:bg-whiteColor rounded group text-nowrap flex gap-1 items-center`}
              >
                {isAdmin || isInstructor
                  ? "Create a New Course"
                  : "Enroll A New Course "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            ) : (
              <Link
                href={`/dashboards/create-course`}
                className={`text-size-15 border text-whiteColor   ${
                  isAdmin
                    ? "bg-primaryColor border-whiteColor hover:text-primaryColor"
                    : isInstructor
                    ? "bg-primaryColor  border-primaryColor hover:text-primaryColor"
                    : "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
                }  px-25px py-10px hover:bg-whiteColor rounded group text-nowrap flex gap-1 items-center`}
              >
                {isAdmin || isInstructor
                  ? "Create a New Course"
                  : "Enroll A New Course "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
