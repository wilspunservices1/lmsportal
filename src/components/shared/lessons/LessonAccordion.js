"use client";

import React, { useEffect, useState } from "react";
import LessonList from "./_comp/LessonList";
import Extras from "./_comp/Extras";
import AccordionSkeleton from "@/components/Loaders/AccordianSkel";
import { BASE_URL } from "@/actions/constant";
import Swal from "sweetalert2";
import QuizModal from "@/components/sections/quiz-modal/QuizModal";
import PreQuizPopup from "@/components/sections/alert-quiz-modal/PreQuizPopup";

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

const LessonAccordion = ({
  chapterId,
  extra = null,
  isEnrolled = false,
  courseOwnerId = "",
  userRoles = [],
}) => {
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
  const [finalExams, setFinalExams] = useState({});
  const [finalExamScores, setFinalExamScores] = useState({});
  const [finalExamAttempts, setFinalExamAttempts] = useState({});
  const [isFinalExamModalOpen, setIsFinalExamModalOpen] = useState(false);
  const [currentFinalExamData, setCurrentFinalExamData] = useState(null);
  const [isPreFinalExamOpen, setIsPreFinalExamOpen] = useState(false);
  const [isExamBooked, setIsExamBooked] = useState(false);
  const [bookedExams, setBookedExams] = useState({});

  const isSuperAdmin = userRoles.includes("superAdmin");
  const isInstructor = userRoles.includes("instructor");
  const isCourseOwner = courseOwnerId !== "" && isInstructor;
  const canAccessAll = isSuperAdmin || isEnrolled || isCourseOwner;

  // Add this with other useEffect hooks
  useEffect(() => {
    // Check if exam was previously booked
    const examBookingStatus = localStorage.getItem("examBooked");
    if (examBookingStatus === "true") {
      setIsExamBooked(true);
    }
  }, []);

  useEffect(() => {
    // Check if exam was previously booked for this specific course
    const examBookingStatus = localStorage.getItem(`examBooked_${chapterId}`);
    if (examBookingStatus === "true") {
      setBookedExams((prev) => ({
        ...prev,
        [chapterId]: true,
      }));
    }
  }, [chapterId]);

  useEffect(() => {
    console.log("Updated attempts:", quizAttempts);
  }, [quizAttempts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, [progressRefresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchFinalExamAttempts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/get-final-exam-attempts`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.ok && data.attempts) {
          setFinalExamAttempts(data.attempts);
        }
      } catch (error) {
        console.error("Error fetching final exam attempts:", error);
      }
    };

    fetchFinalExamAttempts();
  }, [progressRefresh]);

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

  useEffect(() => {
    const loadChaptersAndQuestionnaires = async () => {
      setLoading(true);
      console.log("Fetching chapters for chapterId:", chapterId);

      const fetchedChapters = await fetchChaptersByChapterId(chapterId);
      if (fetchedChapters?.chapters) {
        setChapters(fetchedChapters.chapters);

        const chapterQuestionnaires = fetchedChapters.chapters
          .filter((chapter) => chapter.questionnaireId != null)
          .map((chapter) => ({
            chapterId: chapter.id,
            questionnaireId: chapter.questionnaireId,
          }));

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

        const chapterFinalExams = fetchedChapters.chapters
          .filter((chapter) => chapter.finalExamId || chapter.finalExam)
          .map((chapter) => ({
            chapterId: chapter.id,
            finalExamId: chapter.finalExamId || chapter.finalExam,
          }));

        console.log("Found final exams:", chapterFinalExams);

        if (chapterFinalExams.length > 0) {
          try {
            const finalExamPromises = chapterFinalExams.map(
              ({ chapterId, finalExamId }) =>
                fetch(
                  `${BASE_URL}/api/courses/chapters/lectures/questionnaires/${finalExamId}`
                )
                  .then((res) =>
                    res.ok
                      ? res.json()
                      : Promise.reject(
                          `Failed to fetch final exam for chapter ${chapterId}`
                        )
                  )
                  .then((examData) => ({
                    chapterId,
                    examData,
                  }))
                  .catch((error) => {
                    console.error("Final exam fetch error:", error);
                    return null;
                  })
            );

            const examResults = await Promise.allSettled(finalExamPromises);
            const exams = {};
            examResults.forEach((result) => {
              if (result.status === "fulfilled" && result.value) {
                const { chapterId, examData } = result.value;
                exams[chapterId] = {
                  id: examData.id,
                  title: examData.title,
                  questions: examData.questions,
                  finalExamId: examData.id,
                };
              }
            });

            setFinalExams(exams);
          } catch (error) {
            console.error("Error fetching final exams:", error);
          }
        }
      }
      setLoading(false);
    };

    loadChaptersAndQuestionnaires();
  }, [chapterId, progressRefresh]);

  const handleQuizStart = (quiz) => {
    setCurrentQuizData(quiz);
    setIsPreQuizOpen(true);
  };

  const handleFinalExamStart = (exam) => {
    setCurrentFinalExamData(exam);
    setIsPreFinalExamOpen(true);
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
                  <span>{chapter.title}</span>
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

                  {(() => {
                    try {
                      return (
                        (finalExams[chapter.id] || chapter.finalExamId) && (
                          <div
                            className="mt-6 border-t pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg dark:from-blue-900 dark:to-indigo-900"
                            data-final-exam-id={
                              finalExams[chapter.id]?.id || chapter.finalExamId
                            }
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                Final Examination:{" "}
                                {finalExams[chapter.id]?.title || "Loading..."}
                              </h3>

                              <div className="flex items-center">
                                {(() => {
                                  const examId =
                                    finalExams[chapter.id]?.id ||
                                    chapter.finalExamId;
                                  console.log(
                                    "Final Exam ID for chapter:",
                                    examId
                                  );

                                  if (!attemptsLoaded) return null;

                                  const attempts =
                                    examId &&
                                    typeof finalExamAttempts[examId] ===
                                      "number"
                                      ? finalExamAttempts[examId]
                                      : 0;

                                  const validAttempts = Number.isFinite(
                                    attempts
                                  )
                                    ? attempts
                                    : 0;
                                  const attemptsLeft = Math.max(
                                    0,
                                    100 - validAttempts
                                  );

                                  console.log(
                                    "Final Exam attempts left:",
                                    attemptsLeft
                                  );

                                  if (
                                    Number.isNaN(attemptsLeft) ||
                                    attemptsLeft < 0
                                  ) {
                                    console.error(
                                      "Invalid final exam attempt count:",
                                      finalExamAttempts[examId]
                                    );
                                    return null;
                                  }

                                  return attemptsLeft > 0 ? (
                                    <button
                                      onClick={() =>
                                        handleFinalExamStart({
                                          ...finalExams[chapter.id],
                                          questions:
                                            finalExams[
                                              chapter.id
                                            ]?.questions?.map((q) => ({
                                              ...q,
                                              correct_answer:
                                                q.correct_answer ||
                                                q.correctAnswer,
                                            })) || [],
                                        })
                                      }
                                      className="ml-2 flex items-center bg-blue-600 text-white text-sm rounded py-2 px-4 hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                      Start Final Exam
                                    </button>
                                  ) : (
                                    <p className="text-red-600 dark:text-red-400 font-bold">
                                      No more attempts left
                                    </p>
                                  );
                                })()}
                              </div>
                            </div>

                            {finalExams[chapter.id]?.questions && (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                  {finalExams[chapter.id].questions.length}{" "}
                                  Questions
                                </p>

                                <div className="quiz-score-box bg-blue-600 text-white text-sm px-3 py-1 rounded mt-2">
                                  Score:{" "}
                                  {Number(
                                    finalExamScores[finalExams[chapter.id]?.id]
                                  ) || 0}
                                  %
                                </div>
                              </>
                            )}
                          </div>
                        )
                      );
                    } catch (error) {
                      console.error(
                        "Error rendering Final Exam section:",
                        error
                      );
                      return (
                        <div className="mt-4 p-2 bg-red-100 dark:bg-red-900 rounded">
                          <p className="text-red-600 dark:text-red-400">
                            Error loading Final Exam section
                          </p>
                        </div>
                      );
                    }
                  })()}
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

            {/* Book Final Exam Button */}
            <li className="mb-25px">
              <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md p-4">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold mb-3">
                    Schedule Your Final Exam
                  </h3>
                  <button
                    onClick={() => {
                      window.open(
                        "https://meridianqualitymanagementprofessionals.zohobookings.sa/#/meridianqualitymanagementprofessionals",
                        "_blank"
                      );
                      // Set exam as booked for this specific course
                      setBookedExams((prev) => ({
                        ...prev,
                        [chapterId]: true,
                      }));
                      // Save booking status to localStorage with course identifier
                      localStorage.setItem(`examBooked_${chapterId}`, "true");
                    }}
                    disabled={bookedExams[chapterId]}
                    className={`${
                      bookedExams[chapterId]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow hover:bg-blue-700"
                    } text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2`}
                  >
                    <span>
                      {bookedExams[chapterId]
                        ? "Exam Booked"
                        : "Book Final Exam"}
                    </span>
                    {!bookedExams[chapterId] && (
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
                </div>
              </div>
            </li>
          </>
        )}
      </ul>

      {isPreQuizOpen && (
        <PreQuizPopup
          onConfirm={() => {
            // Close the small popup
            setIsPreQuizOpen(false);
            // Open the main quiz
            setIsQuizModalOpen(true);
          }}
          onCancel={() => {
            // Close the small popup entirely
            setIsPreQuizOpen(false);
            // (Optionally do nothing else, or reset quiz data, etc.)
          }}
        />
      )}

      {/* NEW: Conditionally render the QuizModal */}
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

      {/* Final Exam Popups */}
      {isPreFinalExamOpen && (
        <PreQuizPopup
          title="Final Examination"
          message="Are you ready to start your final exam? Make sure you have enough time to complete it."
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
        <QuizModal
          quizData={currentFinalExamData}
          onClose={() => setIsFinalExamModalOpen(false)}
          quizScores={finalExamScores}
          setQuizScores={setFinalExamScores}
          quizAttempts={finalExamAttempts}
          setQuizAttempts={setFinalExamAttempts}
          setProgressRefresh={setProgressRefresh}
          BASE_URL={BASE_URL}
          isFinalExam={true}
        />
      )}
    </div>
  );
};

export default LessonAccordion;
