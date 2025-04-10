"use client";

import React, { useEffect, useState } from "react";
import LessonList from "./_comp/LessonList";
import Extras from "./_comp/Extras";
import AccordionSkeleton from "@/components/Loaders/AccordianSkel";
import { BASE_URL } from "@/actions/constant";
import Swal from "sweetalert2";
import QuizModal from "@/components/sections/quiz-modal/QuizModal";
import PreQuizPopup from "@/components/sections/alert-quiz-modal/PreQuizPopup";
import ExamModal from "@/components/sections/exam-modal/ExamModal";
import PreExamPopup from "@/components/sections/alert-exam-modal/PreExamPopup";
import { useSession } from "next-auth/react";

const fetchChaptersByChapterId = async (chapterId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/courses/chapters/${chapterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch chapters");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return null;
  }
};

const fetchFinalExamId = async (courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/courses/final-exam/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch final exam ID");
    }
    const data = await res.json();
    return data.finalExamId;
  } catch (error) {
    console.error("Error fetching final exam ID:", error);
    return null;
  }
};

const LessonAccordion = ({
  chapterId,
  extra = null,
  isEnrolled = false,
  courseOwnerId = "",
  userRoles = [],
  courseId,
}) => {
  const { data: session } = useSession();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [questionnaires, setQuestionnaires] = useState({});

  const [progressRefresh, setProgressRefresh] = useState(0);
  const [quizScores, setQuizScores] = useState({});
  const [quizAttempts, setQuizAttempts] = useState({});
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);

  const [isPreQuizOpen, setIsPreQuizOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [finalExamId, setFinalExamId] = useState(null);
  const [isFinalExamModalOpen, setIsFinalExamModalOpen] = useState(false);

  const [isPreFinalExamOpen, setIsPreFinalExamOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedExams, setBookedExams] = useState({});
  const [finalExamAttempted, setFinalExamAttempted] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [examBooked, setExamBooked] = useState(false);
  const isSuperAdmin = userRoles.includes("superAdmin");
  const isInstructor = userRoles.includes("instructor");
  const isCourseOwner = courseOwnerId !== "" && isInstructor;

  const [chapterCompletion, setChapterCompletion] = useState({});

  const [completedChapters, setCompletedChapters] = useState(0); // Track completed chapters
  const [totalChapters, setTotalChapters] = useState(0); // Track total chapters

  const canAccessAll = isSuperAdmin || isEnrolled || isCourseOwner;

  const handleExamBooking = async () => {
    setIsBooking(true);
    try {
      const result = await Swal.fire({
        title: "Confirm Exam Booking",
        text: "Are you sure you want to book your final exam?Once You Click Bookit, You won't be able to cancel it.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, book it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `${BASE_URL}/api/user/${session?.user?.id}/exambooked`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ courseId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to book exam");
        }

        const data = await response.json();

        // Open booking page in new tab
        window.open(
          "https://meridianqualitymanagementprofessionals.zohobookings.sa/#/meridianqualitymanagementprofessionals",
          "_blank"
        );

        // Update state
        setBookedExams((prev) => ({ ...prev, [chapterId]: true }));
        setBookingMessage(data.message);
        setExamBooked(true);
        localStorage.setItem(`examBooked_${chapterId}`, "true");
        localStorage.setItem(`examBookingMessage_${chapterId}`, data.message);

        Swal.fire({
          icon: "success",
          title: "Exam Booked!",
          text: data.message,
        });
      }
    } catch (error) {
      console.error("Error booking exam:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "There was an error booking your exam. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getFormattedExamDate = async (chapterId) => {
    try {
      if (!session?.user?.id) return "Date not available";

      const response = await fetch(
        `${BASE_URL}/api/user/${session.user.id}/exambooked?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exam booking");
      }

      const data = await response.json();

      if (!data.examDateTime) return "Date not available";

      // Parse the DDMMYYYY HHMMSS format
      const [datePart, timePart] = data.examDateTime.split(" ");
      const day = datePart.substring(0, 2);
      const month = datePart.substring(2, 4);
      const year = datePart.substring(4, 8);
      const hours = timePart.substring(0, 2);
      const minutes = timePart.substring(2, 4);

      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting exam date:", error);
      return "Date not available";
    }
  };

  const [examBookingDate, setExamBookingDate] = useState("");

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/user/${session?.user?.id}/exambooked?courseId=${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.booked) {
            setBookedExams((prev) => ({ ...prev, [chapterId]: true }));
            setBookingMessage(
              data.message ||
                `You booked the exam on ${new Date(
                  data.examBookingDateTime
                ).toLocaleString()}`
            );
            setExamBooked(true);
          }
        }
      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    fetchBookingStatus();
  }, [chapterId, courseId, session?.user?.id]);

  // Fetch final exam ID using the courseId prop
  useEffect(() => {
    const loadFinalExamId = async () => {
      const examId = await fetchFinalExamId(courseId);
      setFinalExamId(examId);
    };

    if (courseId) {
      loadFinalExamId();
    }
  }, [courseId]);

  // Fetch quiz attempts and check if the final exam has been attempted
  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-quiz-attempts`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok && data.attempts) {
          setQuizAttempts(data.attempts);
          // Check if the final exam has been attempted
          if (finalExamId && data.attempts[finalExamId] >= 1) {
            setFinalExamAttempted(true); // Final exam has been attempted
          }
        } else {
          console.error("Failed to fetch quiz attempts");
        }
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
      } finally {
        setAttemptsLoaded(true);
      }
    };

    fetchQuizAttempts();
  }, [progressRefresh, finalExamId]);

  // Fetch user progress (scores)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/progress`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setQuizScores(data.scores);
        } else {
          console.error("Failed to fetch progress");
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [chapterId, progressRefresh]);

  // Fetch chapters and questionnaires
  useEffect(() => {
    const loadChaptersAndQuestionnaires = async () => {
      setLoading(true);
      setCompletedChapters(0); // Reset completed chapters count before loading new chapters

      const fetchedChapters = await fetchChaptersByChapterId(chapterId);
      if (fetchedChapters?.chapters) {
        // Sort chapters by their `order` property
        const sortedChapters = fetchedChapters.chapters.sort(
          (a, b) => parseInt(a.order) - parseInt(b.order)
        );
        setChapters(sortedChapters);
        setTotalChapters(fetchedChapters.chapters.length); // Set total chapters count

        const completionStatuses = {}; // ✅ Stores chapter completion status

        const chapterQuestionnaires = sortedChapters
          .filter((chapter) => chapter.questionnaireId != null)
          .map((chapter) => ({
            chapterId: chapter.id,
            questionnaireId: chapter.questionnaireId,
          }));

        // ✅ Fetch lesson progress for each lesson in the chapter
        await Promise.all(
          fetchedChapters.chapters.map(async (chapter) => {
            const allLessonsCompleted = await Promise.all(
              chapter.lessons.map(async (lesson) => {
                try {
                  const response = await fetch(
                    `/api/lessons/${lesson.id}/progress-markasdone`
                  );
                  const progressData = await response.json();
                  return progressData.isChapterDone === true;
                } catch (error) {
                  console.error(
                    `Error fetching progress for lesson ${lesson.id}:`,
                    error
                  );
                  return false;
                }
              })
            );

            const quizAttempted = chapter.questionnaireId
              ? quizAttempts[chapter.questionnaireId] > 0
              : true; // Automatically true for chapters without questionnaires

            // ✅ Mark chapter as completed only if ALL lessons are done AND quiz is attempted
            completionStatuses[chapter.id] =
              allLessonsCompleted.every((status) => status) && quizAttempted;
            // Update completed chapters count
            const completedCount = Object.values(completionStatuses).filter(
              (status) => status
            ).length;
            setCompletedChapters(completedCount);
          })
        );

        setChapterCompletion(completionStatuses); // ✅ Update chapter completion state

        if (chapterQuestionnaires.length > 0) {
          try {
            const quizPromises = chapterQuestionnaires.map(
              ({ chapterId, questionnaireId }) =>
                fetch(
                  `${BASE_URL}/api/courses/chapters/lectures/questionnaires/${questionnaireId}`
                )
                  .then((res) =>
                    res.ok
                      ? res.json()
                      : Promise.reject(
                          `Failed to fetch quiz for chapter ${chapterId}`
                        )
                  )
                  .then((quizData) => ({
                    chapterId,
                    quizData,
                  }))
                  .catch((error) => {
                    console.error("Quiz fetch error:", error);
                    return null;
                  })
            );

            const quizResults = await Promise.allSettled(quizPromises);
            const quizzes = {};
            quizResults.forEach((result) => {
              if (result.status === "fulfilled" && result.value) {
                const { chapterId, quizData } = result.value;
                quizzes[chapterId] = {
                  id: quizData.id,
                  title: quizData.title,
                  questions: quizData.questions,
                  questionnaireId: quizData.id,
                };
              } else {
                console.error("Quiz fetch error:", result.reason);
              }
            });

            setQuestionnaires(quizzes);
          } catch (error) {
            console.error("Error fetching questionnaires:", error);
          }
        }
      }
      setLoading(false);
    };

    loadChaptersAndQuestionnaires();
  }, [chapterId, progressRefresh, quizAttempts]);

  const handleQuizStart = async (quiz) => {
    try {
      console.log(
        "Fetching quiz data for questionnaireId:",
        quiz.questionnaireId
      );
      const response = await fetch(
        `${BASE_URL}/api/courses/chapters/lectures/questionnaires/${quiz.questionnaireId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quiz data");
      }
      const quizData = await response.json();
      if (!quizData || !quizData.questions) {
        throw new Error("Quiz data not found");
      }
      setCurrentQuizData({
        ...quiz,
        questions: quizData.questions,
      });
      setIsPreQuizOpen(true);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load quiz. Please try again.",
      });
    }
  };

  const handleFinalExamStart = async () => {
    if (!finalExamId || finalExamAttempted) return;

    try {
      console.log("Fetching final exam data for finalExamId:", finalExamId);
      const response = await fetch(
        `${BASE_URL}/api/courses/chapters/lectures/questionnaires/${finalExamId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch final exam data");
      }
      const examData = await response.json();
      if (!examData || !examData.questions) {
        throw new Error("Final exam data not found");
      }
      setCurrentQuizData({
        id: examData.id,
        title: examData.title,
        questions: examData.questions,
        questionnaireId: finalExamId,
      });
      setIsPreFinalExamOpen(true);
    } catch (error) {
      console.error("Error fetching final exam data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load final exam. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
        <AccordionSkeleton />
      </div>
    );
  }

  if (!chapters || chapters.length === 0) {
    return <p>No chapters available.</p>;
  }

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const canAccessExtras = canAccessAll && extra;
  const courseMaterialsIndex = chapters.length;

  return (
    <div>
      <ul className="accordion-container curriculum">
        {chapters.map((chapter, index) => (
          <li
            key={chapter.id}
            className={`accordion mb-25px overflow-hidden ${
              activeIndex === index ? "active" : ""
            }`}
          >
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
              <div>
                <button
                  className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`chapter-content-${index}`}
                >
                  <div className="checkbox-wrapper-33">
                    <label className="checkbox">
                      <input
                        className="checkbox__trigger visuallyhidden"
                        type="checkbox"
                        checked={Boolean(chapterCompletion[chapter.id])}
                        disabled
                      />
                      <span className="checkbox__symbol">
                        <svg
                          aria-hidden="true"
                          className="icon-checkbox"
                          width="28px"
                          height="28px"
                          viewBox="0 0 28 28"
                          version="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4 14l8 7L24 7"></path>
                        </svg>
                      </span>
                      <p className="checkbox__textwrapper">{chapter.title}</p>
                    </label>
                  </div>

                  <svg
                    className={`transition-all duration-500 ${
                      activeIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="#212529"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </button>
              </div>

              <div
                id={`chapter-content-${index}`}
                className={`accordion-content transition-all duration-500 ${
                  activeIndex === index ? "max-h-screen" : "max-h-0"
                }`}
                style={{ overflow: "hidden" }}
              >
                <div className="content-wrapper p-10px md:px-30px">
                  <LessonList lessons={chapter.lessons} />

                  {questionnaires[chapter.id] && (
                    <div
                      className="mt-4 border-t pt-4"
                      data-questionnaire-id={questionnaires[chapter.id].id}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Chapter Quiz: {questionnaires[chapter.id].title}
                        </h3>

                        <div className="flex items-center">
                          {(() => {
                            const quizId = questionnaires[chapter.id]?.id;

                            if (!attemptsLoaded) return null;

                            const attempts =
                              quizId && typeof quizAttempts[quizId] === "number"
                                ? quizAttempts[quizId]
                                : 0;

                            const validAttempts = Number.isFinite(attempts)
                              ? attempts
                              : 0;

                            const attemptsLeft = Math.max(
                              0,
                              100 - validAttempts
                            );

                            if (
                              Number.isNaN(attemptsLeft) ||
                              attemptsLeft < 0
                            ) {
                              console.error(
                                "Invalid attempt count detected:",
                                quizAttempts[quizId]
                              );
                              return null;
                            }

                            return attemptsLeft > 0 ? (
                              <button
                                onClick={() =>
                                  handleQuizStart({
                                    ...questionnaires[chapter.id],
                                    questions: questionnaires[
                                      chapter.id
                                    ].questions.map((q) => ({
                                      ...q,
                                      correct_answer:
                                        q.correct_answer || q.correctAnswer,
                                    })),
                                  })
                                }
                                className="ml-2 flex items-center bg-primaryColor text-whiteColor text-sm rounded py-1 px-3 hover:bg-primaryColor-dark transition-colors start-quiz-btn"
                              >
                                Start Quiz
                              </button>
                            ) : (
                              <p
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                No more attempts left
                              </p>
                            );
                          })()}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        {questionnaires[chapter.id].questions.length} Questions
                      </p>

                      <div className="quiz-score-box bg-pink-500 text-white text-sm px-3 py-1 rounded mt-2">
                        Score:{" "}
                        {Number(quizScores[questionnaires[chapter.id]?.id]) ||
                          0}
                        %
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}

        {isEnrolled && (
          <>
            <li
              className={`accordion mb-25px overflow-hidden ${
                activeIndex === courseMaterialsIndex ? "active" : ""
              }`}
            >
              <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
                <button
                  className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]"
                  onClick={() => toggleAccordion(courseMaterialsIndex)}
                >
                  <span>Course Materials</span>
                  <svg
                    className={`transition-all duration-500 ${
                      activeIndex === courseMaterialsIndex ? "rotate-180" : ""
                    }`}
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="#212529"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </button>
                <div
                  id={`course-materials-content-${courseMaterialsIndex}`}
                  className={`accordion-content transition-all duration-500 ${
                    activeIndex === courseMaterialsIndex
                      ? "max-h-screen"
                      : "max-h-0"
                  }`}
                  style={{ overflow: "hidden" }}
                >
                  <div className="content-wrapper p-10px md:px-30px">
                    <Extras lessonId={chapters[0]?.id} />
                  </div>
                </div>
              </div>
            </li>

            {isEnrolled &&
              totalChapters > 0 &&
              completedChapters === totalChapters && (
                <>
                  {/* Book Final Exam Button */}
                  <li className="mb-25px">
                    <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md p-4">
                      <div className="flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-3">
                          Schedule Your Final Exam
                        </h3>
                        <button
                          onClick={handleExamBooking}
                          disabled={bookedExams[chapterId] || isBooking}
                          className={`${
                            bookedExams[chapterId] || isBooking
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-yellow hover:bg-blue-700"
                          } text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2`}
                        >
                          {isBooking ? (
                            <span>Booking...</span>
                          ) : (
                            <span>
                              {bookedExams[chapterId]
                                ? "Exam Booked"
                                : "Book Final Exam"}
                            </span>
                          )}
                          {!bookedExams[chapterId] && !isBooking && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        {bookedExams[chapterId] && (
                          <p className="mt-2 text-sm text-gray-600">
                            {bookingMessage || "Exam booking confirmed"}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>

                  {/* Start Final Exam Button */}
                  <li className="mb-25px">
                    <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md p-4">
                      <div className="flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-3">
                          Final Exam
                        </h3>
                        {finalExamAttempted ? (
                          <p
                            style={{
                              color: "red",
                              fontWeight: "bold",
                            }}
                          >
                            You have already attempted the final exam.
                          </p>
                        ) : (
                          <button
                            onClick={handleFinalExamStart}
                            className="bg-blue-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 hover:bg-blue-700"
                          >
                            <span>Start Final Exam</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                </>
              )}
          </>
        )}
      </ul>

      {isPreQuizOpen && (
        <PreQuizPopup
          onConfirm={() => {
            setIsPreQuizOpen(false);
            setIsQuizModalOpen(true);
          }}
          onCancel={() => {
            setIsPreQuizOpen(false);
          }}
        />
      )}

      {isQuizModalOpen && (
        <QuizModal
          quizData={currentQuizData}
          onClose={() => setIsQuizModalOpen(false)}
          quizScores={quizScores}
          setQuizScores={setQuizScores}
          quizAttempts={quizAttempts}
          setQuizAttempts={setQuizAttempts}
          setProgressRefresh={setProgressRefresh}
          BASE_URL={BASE_URL}
        />
      )}

      {isPreFinalExamOpen && (
        <PreExamPopup
          examInfo={{
            duration: 60, // Example: 60 minutes
            questionsCount: currentQuizData?.questions?.length || 0,
            passingScore: 70, // Example: 70% passing score
            attempts: 1, // Only 1 attempt allowed
          }}
          onConfirm={() => {
            setIsPreFinalExamOpen(false);
            setIsFinalExamModalOpen(true);
          }}
          onCancel={() => {
            setIsPreFinalExamOpen(false);
          }}
        />
      )}

      {isFinalExamModalOpen && (
        <ExamModal
          examData={currentQuizData}
          onClose={() => {
            setIsFinalExamModalOpen(false);
            setFinalExamAttempted(true); // Mark final exam as attempted
          }}
          quizScores={quizScores}
          setQuizScores={setQuizScores}
          quizAttempts={quizAttempts}
          setQuizAttempts={setQuizAttempts}
          setProgressRefresh={setProgressRefresh}
          BASE_URL={BASE_URL}
        />
      )}
    </div>
  );
};

export default LessonAccordion;
