"use client";

import React, { useState } from "react";
import CourseDetailsSidebar from "@/components/shared/courses/CourseDetailsSidebar";
import BlogTagsAndSocila from "@/components/shared/blog-details/BlogTagsAndSocila";
import CourseDetailsTab from "@/components/shared/course-details/CourseDetailsTab";
import InstrutorOtherCourses from "@/components/shared/course-details/InstrutorOtherCourses";
import getAllCourses from "@/libs/getAllCourses";
import { formatDate } from "@/actions/formatDate";
import { CldImage } from "next-cloudinary";
import CourseDescription from "./CourseDescription";
import Commits from "./_comp/Commits";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import useSweetAlert from "@/hooks/useSweetAlert";
import ManageQuestionnaire from "../questionnaire/ManageQuestionnaire";
import CourseReviewsDisplay from "./_comp/CourseReviewsDisplay";
import { useEffect } from "react";
import PriceDisplay from "@/components/shared/PriceDisplay";

const CourseDetailsPrimary = ({
  id: currentId,
  type,
  courseDetails: initialCourseDetails,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showQuiz, setShowQuiz] = useState(false);
  const showAlert = useSweetAlert();

  const [isBrowser, setIsBrowser] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [hasPassedFinalExam, setHasPassedFinalExam] = useState(false);
  const [error, setError] = useState(null); // Track errors
  const [courseDetails, setCourseDetails] = useState(initialCourseDetails); // State to manage course details
  const [randomEnrolledCount, setRandomEnrolledCount] = useState(null); // State for client-side random count
  const [reviewsCount, setReviewsCount] = useState(0); // State to track combined reviews count

  // Generate and persist random enrolled count per course to avoid hydration mismatch
  useEffect(() => {
    const storageKey = `courseEnrolledCount_${currentId}`;
    let storedCount = localStorage.getItem(storageKey);

    if (storedCount) {
      // Use existing stored value for this course
      setRandomEnrolledCount(parseInt(storedCount));
    } else {
      // Generate new random value and store it
      const newRandomCount = Math.floor(Math.random() * 61) + 50; // 50-110
      localStorage.setItem(storageKey, newRandomCount.toString());
      setRandomEnrolledCount(newRandomCount);
    }
  }, [currentId]);

  // Fetch combined reviews count (instructor + student)
  useEffect(() => {
    const fetchReviewsCount = async () => {
      try {
        // Fetch instructor reviews
        const instructorResponse = await fetch(
          `/api/courses/${currentId}/reviews?type=instructor`
        );
        const instructorData = instructorResponse.ok
          ? await instructorResponse.json()
          : { reviews: [] };
        const instructorReviews = instructorData.reviews || [];

        // Fetch student reviews
        const studentResponse = await fetch(
          `/api/courses/${currentId}/reviews`
        );
        const studentReviews = studentResponse.ok
          ? await studentResponse.json()
          : [];

        // Set combined count
        const totalReviews =
          (instructorReviews.length || 0) + (studentReviews.length || 0);
        setReviewsCount(totalReviews);
      } catch (error) {
        // Error fetching reviews count
        setReviewsCount(0);
      }
    };

    if (currentId) {
      fetchReviewsCount();
    }
  }, [currentId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/courses/${currentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await response.json();
        const courseData = data.data || data;
        const totalDuration = calculateTotalDuration(courseData.chapters);

        setCourseDetails({
          ...courseData,
          duration: totalDuration,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCourseDetails();
  }, [currentId]);

  const calculateTotalDuration = (chapters) => {
    if (!chapters) return "0 minutes";

    let totalMinutes = 0;
    chapters.forEach((chapter) => {
      if (chapter.lectures) {
        chapter.lectures.forEach((lecture) => {
          totalMinutes += parseInt(lecture.duration) || 0;
        });
      }
    });

    return `${totalMinutes} minutes`;
  };

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left py-4 flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center">
            <i
              className={`icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 mr-15px dark:bg-whitegrey1-dark ${
                isOpen ? "bg-primaryColor text-white" : ""
              }`}
            ></i>
            <span className="text-sm lg:text-xs 2xl:text-sm font-medium leading-25px lg:leading-21px 2xl:leading-25px text-contentColor dark:text-contentColor-dark">
              {question}
            </span>
          </div>
          <i
            className={`icofont-simple-down text-lg transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          ></i>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <p className="pl-10 pr-4 pb-4 text-sm lg:text-xs 2xl:text-sm text-contentColor dark:text-contentColor-dark">
            {answer}
          </p>
        </div>
      </div>
    );
  };

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`/api/courses/${currentId}/faqs`);
        if (response.ok) {
          const data = await response.json();
          setFaqs(data.faqs || []);
        }
      } catch (error) {
        // Error fetching FAQs
      }
    };

    fetchFAQs();
  }, [currentId]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!session?.user) return;

      try {
        // STEP 1: Get user info including roles and enrolledCourses
        const userResponse = await fetch(`/api/user/${session.user.id}`);
        const userData = await userResponse.json();

        const userRoles = userData?.roles || [];

        // STEP 2: Check if user is admin/instructor/superAdmin
        const isPrivileged = userRoles.some((role) =>
          ["admin", "instructor", "superAdmin"].includes(role)
        );

        if (isPrivileged) {
          // 🔓 Auto-grant access
          setIsPurchased(true);
          setHasPassedFinalExam(true);
          return;
        }

        // STEP 3: Otherwise check regular purchase
        const purchaseResponse = await fetch(
          `/api/courses/${currentId}/check-purchase`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!purchaseResponse.ok) {
          throw new Error("Failed to check course enrollment");
        }

        const purchaseData = await purchaseResponse.json();

        if (typeof purchaseData.hasPurchased !== "boolean") {
          throw new Error("Invalid response format");
        }

        setIsPurchased(purchaseData.hasPurchased);
        setError(null);

        // STEP 4: Check finalExamStatus if purchased
        if (purchaseData.hasPurchased && userData?.enrolledCourses) {
          const matchedCourse = userData.enrolledCourses.find(
            (course) => course.courseId === currentId
          );

          setHasPassedFinalExam(matchedCourse?.finalExamStatus === true);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    checkPurchaseStatus();
  }, [session, currentId]);

  // A helper to build the HTML for the certificate + placeholders
  function buildCertificateHTML(
    certificate_data_url,
    placeholders = [],
    originalWidth = 1024,
    originalHeight = 728
  ) {
    const displayedWidth = 450;
    const scaleFactor = displayedWidth / originalWidth;
    const displayedHeight = originalHeight * scaleFactor;

    let html = `
			<style>
				@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
				@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
				@import url('https://fonts.googleapis.com/css2?family=Tangerine&display=swap');
				
				.font-great-vibes { font-family: 'Great Vibes', cursive !important; }
				.font-pinyon-script { font-family: 'Pinyon Script', cursive !important; }
				.font-tangerine { font-family: 'Tangerine', cursive !important; }
			</style>
			<div style="position: relative; display: inline-block; width: ${displayedWidth}px; height: ${displayedHeight}px; overflow: hidden; border: 1px solid #ccc;">
				<img 
					src="${certificate_data_url}" 
					alt="Certificate" 
					style="display: block; width: 100%; height: 100%; object-fit: contain;"
				/>
		`;

    const visiblePlaceholders = placeholders.filter((ph) => ph.is_visible);
    visiblePlaceholders.forEach((ph) => {
      // Calculate scaled positions
      const posX = (ph.x / originalWidth) * 1100;
      const posY = (ph.y / originalHeight) * 830;
      const scaledFontSize = Math.max((ph.font_size ?? 16) * scaleFactor, 12);

      const fontClass = ph.font_family
        ? `font-${ph.font_family.toLowerCase().replace(/\s+/g, "-")}`
        : "";
      const fontFamily = ["Great Vibes", "Pinyon Script", "Tangerine"].includes(
        ph.font_family
      )
        ? `'${ph.font_family}', cursive`
        : ph.font_family || "Arial";

      html += `
				<div 
					class="${fontClass}"
					style="
						position: absolute;
                    top: ${posY}px;
                    left: ${posX}px;
                    font-size: ${scaledFontSize}px;
                    color: ${ph.color || "#000"};
                    font-family: ${fontFamily};
                    transform: translate(30%, -55%);
                    text-align: center;
                    white-space: nowrap;
                    background: rgba(255, 255, 255, 0.7);
                    padding: 2px 5px;
                    max-width: 90%;
                    z-index: 10;
                    border-radius: 3px;
					"
				>
					${ph.value ?? ph.label ?? ""}
				</div>
			`;
    });

    html += `</div>`;
    return html;
  }

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Inside CourseDetailsPrimary.jsx

  function openFullScreenCertificate(certificateUrl, placeholders) {
    if (typeof window === "undefined") return;

    const originalWidth = 1024;
    const originalHeight = 728;

    const newWindow = window.open("", "_blank");

    if (!newWindow) return;

    const html = `
		  <html>
		  <head>
			<title>Certificate</title>
			<!-- Add Font Imports -->
			<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Tangerine&display=swap" rel="stylesheet">
			<style>
			  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
			  @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
			  @import url('https://fonts.googleapis.com/css2?family=Tangerine&display=swap');
	
			  body { 
				text-align: center; 
				background-color: #f0f0f0; 
				margin: 0; 
				padding: 20px; 
			  }
			  .certificate-container { 
				position: relative; 
				display: inline-block; 
				width: ${originalWidth}px; 
				height: ${originalHeight}px; 
			  }
			  .placeholder { 
				position: absolute; 
				white-space: nowrap; 
				z-index: 10;
			  }
			  .font-great-vibes { font-family: 'Great Vibes', cursive !important; }
			  .font-pinyon-script { font-family: 'Pinyon Script', cursive !important; }
			  .font-tangerine { font-family: 'Tangerine', cursive !important; }
			  button { 
          margin-top: 20px; 
          padding: 10px 20px; 
          font-size: 16px; 
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
        }
        button:hover {
          background-color: #45a049;
        }
      </style>
		  </head>
		  <body>
			<div class="certificate-container">
			  <img src="${certificateUrl}" alt="Certificate" style="width: 100%; height: 100%;" object-fit: contain; position: absolute; top: 0; left: 0; id="certificate-image" />
			  ${placeholders
          .filter((ph) => ph.is_visible)
          .map(
            (ph) => `
				  <div class="placeholder ${
            ph.font_family
              ? `font-${ph.font_family.toLowerCase().replace(/\s+/g, "-")}`
              : ""
          }" 
					style="
					  top: ${(ph.y / originalHeight) * 251}%;
					  left: ${(ph.x / originalWidth) * 260}%;
					  font-size: ${ph.font_size}px;
					  color: ${ph.color || "#000000"};
					  font-family: ${
              ["Great Vibes", "Pinyon Script", "Tangerine"].includes(
                ph.font_family
              )
                ? `'${ph.font_family}', cursive`
                : ph.font_family || "Arial"
            };
					">
					${ph.value ?? ph.label ?? ""}
				  </div>
				`
          )
          .join("")}
			</div>
			<br>
			<button onclick="downloadCertificate()">Download</button>
			<script>
			  function downloadCertificate() {
				// Wait for fonts to load before capturing
				document.fonts.ready.then(function() {
				  html2canvas(document.querySelector('.certificate-container'), {
					useCORS: true,
					scale: 2,
					onclone: function(clonedDoc) {
					  // Additional font loading check
					  const fonts = ['Great Vibes', 'Pinyon Script', 'Tangerine'];
					  fonts.forEach(font => {
						document.fonts.load(\`16px "\${font}"\`);
					  });
					}
				  }).then(canvas => {
					const link = document.createElement("a");
					link.href = canvas.toDataURL("image/png");
					link.download = "certificate.png";
					link.click();
				  });
				});
			  }
			</script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
		  </body>
		  </html>
		`;

    newWindow.document.write(html);
    newWindow.document.close();
  }
  const handleCertificateSelect = async () => {
    if (!isBrowser) return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      // Check course purchase first
      const purchaseResponse = await fetch(
        `/api/courses/${currentId}/check-purchase`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!purchaseResponse.ok) {
        throw new Error("Failed to check course enrollment");
      }

      const purchaseData = await purchaseResponse.json();

      if (!purchaseData.hasPurchased) {
        showAlert(
          "warning",
          "Please purchase this course to access the certificate."
        );
        return;
      }

      // 2️⃣ Fetch the user details (for student name)
      const userResponse = await fetch(`/api/user/${session.user.id}`);
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      const studentName = userData?.name || "Student Name"; // Fallback

      // 2️⃣ Fetch the course details to get the certificateId
      const courseResponse = await fetch(`/api/courses/${currentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!courseResponse.ok) {
        throw new Error(
          `Failed to fetch course data: ${courseResponse.statusText}`
        );
      }

      const courseData = await courseResponse.json();
      // Assuming the response is shaped like { message: "...", data: { ...courseFields } }
      const { data: fetchedCourse } = courseData;

      const sessionName = fetchedCourse?.title || "Session Name"; // Fallback
      const sessionStartDate = fetchedCourse?.startDate || "Start Date"; // Fallback
      const sessionEndDate = fetchedCourse?.endDate || "End Date"; // Fallback

      // 3️⃣ Check if the course has a certificateId
      const storedCertificateId = fetchedCourse?.certificateId;
      if (!storedCertificateId) {
        showAlert(
          "error",
          "No certificate is set for this course. Please select a certificate in the admin panel."
        );
        return;
      }

      // 4️⃣ Fetch that single certificate
      const certificateResponse = await fetch(
        `/api/manageCertificates/${storedCertificateId}`
      );
      if (!certificateResponse.ok) {
        throw new Error(
          `Failed to fetch certificate: ${certificateResponse.statusText}`
        );
      }

      const certificateData = await certificateResponse.json();

      const {
        certificate_data_url,
        placeholders,
        id: certificateId,
        unique_identifier,
      } = certificateData;

      // 6️⃣ Construct the Certificate Number
      const certificateNumber = `${unique_identifier}-${certificateId}`;

      // 7️⃣ Replace Placeholders with Actual Data
      const filledPlaceholders = placeholders
        .filter((ph) => ph.is_visible) // ✅ Only process visible placeholders
        .map((ph) => {
          switch (ph.key) {
            case "studentName":
              return { ...ph, value: studentName };
            case "sessionName":
              return { ...ph, value: sessionName };
            case "sessionStartDate":
              return { ...ph, value: new Date().toLocaleDateString() };
            case "sessionEndDate":
              return {
                ...ph,
                value: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 2)
                ).toLocaleDateString(),
              };
            case "dateGenerated":
              return { ...ph, value: new Date().toLocaleDateString() };
            case "companyName":
              return { ...ph, value: "Meridian LMS Pvt. Ltd." };
            case "certificateNumber":
              return { ...ph, value: unique_identifier };
            default:
              return ph; // If no match, return the original placeholder
          }
        });

      const htmlContent = buildCertificateHTML(
        certificate_data_url,
        filledPlaceholders
      );

      // Display the selected certificate (modify as per your actual implementation)
      if (isBrowser) {
        Swal.fire({
          title: "Certificate of Completion",
          html: htmlContent,
          showCancelButton: true,
          confirmButtonText: "Download",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            openFullScreenCertificate(certificate_data_url, filledPlaceholders);
          }
        });
      }
    } catch (error) {
      showAlert(
        "error",
        `Error: ${error.message}. Please try again or contact support.`
      );
    }
  };

  const allCourses = getAllCourses();
  const course = allCourses?.find(({ id }) => parseInt(currentId) === id);
  const { id } = course || {};
  const cid = id ? (id % 6 ? id % 6 : 6) : 0;

  return (
    <section>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
            {/* course 1  */}
            <div data-aos="fade-up">
              {/* course thumbnail  */}
              {type === 2 || type === 3 ? (
                ""
              ) : (
                <div className="overflow-hidden relative mb-5">
                  <CldImage
                    width="600"
                    height="600"
                    alt=""
                    src={courseDetails.thumbnail}
                    sizes={"60w"}
                  />
                </div>
              )}
              {/* course content  */}
              <div>
                {type === 2 || type === 3 ? (
                  ""
                ) : (
                  <>
                    <div
                      className="flex items-center justify-between flex-wrap gap-6 mb-30px"
                      data-aos="fade-up"
                    >
                      <div className="flex items-center gap-6">
                        {courseDetails.descriptionPdfUrl && (
                          <a
                            href={courseDetails.descriptionPdfUrl}
                            download={`${
                              courseDetails.title || "Course"
                            }_Description.pdf`}
                            className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-26px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                          >
                            Course Description
                          </a>
                        )}
                        <button className="text-sm text-whiteColor bg-indigo border border-indigo px-22px py-0.5 leading-23px font-semibold hover:text-indigo hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-indigo">
                          {courseDetails.categories}
                        </button>
                        {isPurchased && hasPassedFinalExam && (
                          <button
                            onClick={handleCertificateSelect}
                            className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-26px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                          >
                            Get Certificate
                          </button>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-contentColor dark:text-contentColor-dark font-medium">
                          Last Update:{" "}
                          <span className="text-blackColor dark:text-blackColor-dark">
                            {formatDate(courseDetails.updatedAt)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* title  */}
                    <h4
                      className="text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                      data-aos="fade-up"
                    >
                      {courseDetails.title ||
                        "Making inspiration with Other People"}
                    </h4>
                    {/* price and rating  */}
                    <div
                      className="flex gap-5 flex-wrap items-center mb-30px"
                      data-aos="fade-up"
                    >
                      <div className="text-size-21 font-medium text-primaryColor font-inter leading-25px">
                        <PriceDisplay
                          usdPrice={parseFloat(courseDetails.price) || 0}
                          size="lg"
                        />{" "}
                        <del className="text-sm text-lightGrey4 font-semibold">
                          /{" "}
                          <PriceDisplay
                            usdPrice={
                              parseFloat(courseDetails.estimatedPrice) || 0
                            }
                            showCurrencyCode={false}
                          />
                        </del>
                      </div>
                      <div className="flex items-center">
                        <div>
                          <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                        </div>
                        <div>
                          <span className=" text-black dark:text-blackColor-dark">
                            {courseDetails.chapters?.length ||
                              courseDetails.lesson ||
                              "23"}{" "}
                            Modules
                          </span>
                        </div>
                      </div>
                      <div className="text-start md:text-end">
                        <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                        <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                        <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                        <i className="icofont-star text-size-15 text-yellow"></i>
                        <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                        <span className=" text-blackColor dark:text-blackColor-dark">
                          ({reviewsCount})
                        </span>
                      </div>
                    </div>
                    <CourseDescription />
                    {/* details  */}
                    <div>
                      <h4
                        className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px"
                        data-aos="fade-up"
                      >
                        Course Details
                      </h4>

                      <div
                        className="bg-darkdeep3 dark:bg-darkdeep3-dark mb-30px grid grid-cols-1 md:grid-cols-2"
                        data-aos="fade-up"
                      >
                        <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Developed By:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                Meridian
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Modules:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {(() => {
                                  const modulesCount =
                                    courseDetails.chapters?.length ||
                                    courseDetails.lesson ||
                                    0;
                                  return `${modulesCount} Modules`;
                                })()}
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Duration:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {courseDetails.duration || "0 minutes"}
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Final Exam:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                60 Minutes
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Enrolled:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {(() => {
                                  const actualCount =
                                    courseDetails.enrolledCount ||
                                    courseDetails.purchasedUsers?.length ||
                                    0;

                                  // If actual count reaches 50, clear the stored random value
                                  if (actualCount >= 50) {
                                    const storageKey = `courseEnrolledCount_${courseDetails.id}`;
                                    localStorage.removeItem(storageKey);
                                  }

                                  // Use state-based random count to avoid hydration mismatch
                                  const defaultCount =
                                    randomEnrolledCount || 50; // Fallback to 50 during SSR
                                  const count =
                                    courseDetails.id ===
                                    "d22308b2-9975-4b27-b3b5-1eb1641d9b8e"
                                      ? 1
                                      : actualCount >= 50
                                      ? actualCount
                                      : defaultCount;
                                  return `${count} ${
                                    count === 1 ? "student" : "students"
                                  }`;
                                })()}
                              </span>
                            </p>
                          </li>
                        </ul>
                        <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Course level:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {courseDetails.skillLevel
                                  ? courseDetails.skillLevel
                                  : "Intermediate"}
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Languages:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {courseDetails.extras?.languages &&
                                courseDetails.extras.languages.length > 0
                                  ? courseDetails.extras.languages
                                      .map(
                                        (lang, index) =>
                                          lang.charAt(0).toUpperCase() +
                                          lang.slice(1)
                                      )
                                      .join(", ")
                                  : "English"}
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Price Discount:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {(() => {
                                  const regularPrice =
                                    parseFloat(courseDetails.price) || 0;
                                  const estimatedPrice =
                                    parseFloat(courseDetails.estimatedPrice) ||
                                    0;
                                  const discountPercent =
                                    estimatedPrice > 0
                                      ? ((estimatedPrice - regularPrice) /
                                          estimatedPrice) *
                                        100
                                      : 0;
                                  return `${discountPercent.toFixed(2)}%`;
                                })()}
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Regular Price:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                <PriceDisplay
                                  usdPrice={
                                    parseFloat(courseDetails.price) || 0
                                  }
                                />
                              </span>
                            </p>
                          </li>
                          <li>
                            <p className="text-contentColor2 dark:text-contentColor2-dark flex items-center">
                              <span className="w-1/2">Course Status:</span>
                              <span className="w-1/2 text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                                {courseDetails.id ===
                                "d22308b2-9975-4b27-b3b5-1eb1641d9b8e"
                                  ? "Under Approval"
                                  : "Available"}
                              </span>
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                {/* course tab  */}
                <CourseDetailsTab id={cid} type={type} course={courseDetails} />
                {/* Reviews Section */}
                <CourseReviewsDisplay courseId={currentId} />

                {/* FAQs Section */}
                {faqs.length > 0 && (
                  <div className="md:col-start-5 md:col-span-8 mb-5">
                    <h4
                      className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-38px"
                      data-aos="fade-up"
                    >
                      FAQs
                    </h4>
                    <div className="space-y-[15px] max-w-127">
                      {faqs.map((faq, index) => (
                        <FAQItem
                          key={faq.id || index}
                          question={faq.question}
                          answer={faq.answer}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* tag and share   */}

                <BlogTagsAndSocila />
                {/* other courses  */}
                <InstrutorOtherCourses courseId={courseDetails?.id} />
                {/* All Commits and replies */}
                <Commits
                  commits={courseDetails?.comments}
                  courseId={courseDetails?.id}
                />
              </div>
            </div>
          </div>
          {/* course sidebar  */}
          <div
            className={`lg:col-start-9 lg:col-span-4 ${
              type === 2 || type === 3 ? "relative lg:top-[-340px]" : ""
            }`}
          >
            <CourseDetailsSidebar type={type} course={courseDetails} />
          </div>
        </div>
      </div>
      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 max-w-2xl w-full mx-4">
            <ManageQuestionnaire
              courseId={currentId}
              onQuizComplete={(passed) => {
                if (passed) {
                  showAlert("success", "Quiz completed successfully!");
                }
                setShowQuiz(false);
              }}
            />
            <button
              onClick={() => setShowQuiz(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseDetailsPrimary;
