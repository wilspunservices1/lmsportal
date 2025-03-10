"use client";

import React, { useEffect, useState } from "react";
import LessonList from "./_comp/LessonList";
import Extras from "./_comp/Extras";
import AccordionSkeleton from "@/components/Loaders/AccordianSkel";
import { BASE_URL } from "@/actions/constant";
import Swal from "sweetalert2";

/** Import the new QuizModal component */
import QuizModal from "@/components/sections/quiz-modal/QuizModal";
import PreQuizPopup from "@/components/sections/alert-quiz-modal/PreQuizPopup";

// Function to fetch chapters by chapterId
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

  // NEW: Control the Quiz Modal
  const [isPreQuizOpen, setIsPreQuizOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizData, setCurrentQuizData] = useState(null);

  // Determine user roles
  const isSuperAdmin = userRoles.includes("superAdmin");
  const isInstructor = userRoles.includes("instructor");
  const isCourseOwner = courseOwnerId !== "" && isInstructor;

  // Determine if the user can access all lessons
  const canAccessAll = isSuperAdmin || isEnrolled || isCourseOwner;

  useEffect(() => {
    console.log("Updated attempts:", quizAttempts);
  }, [quizAttempts]);

  // Fetch quiz attempts
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

  // Fetch chapters & questionnaires
  useEffect(() => {
    const loadChaptersAndQuestionnaires = async () => {
      setLoading(true);
      console.log("Fetching chapters for chapterId:", chapterId);

      const fetchedChapters = await fetchChaptersByChapterId(chapterId);
      if (fetchedChapters?.chapters) {
        setChapters(fetchedChapters.chapters);

        // Collect questionnaire IDs
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
      }
      setLoading(false);
    };

    loadChaptersAndQuestionnaires();
  }, [chapterId, progressRefresh]);

  // NEW: Updated handleQuizStart to simply set state for the modal
  const handleQuizStart = (quiz) => {
    setCurrentQuizData(quiz);
    setIsPreQuizOpen(true);
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

  // Toggle the active state of the accordion
  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  // Determine if Extras should be displayed
  const canAccessExtras = canAccessAll && extra;

  // Index for "Course Materials"
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
              {/* Controller */}
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

              {/* Content */}
              <div
                id={`chapter-content-${index}`}
                className={`accordion-content transition-all duration-500 ${
                  activeIndex === index ? "max-h-screen" : "max-h-0"
                }`}
                style={{ overflow: "hidden" }}
              >
                <div className="content-wrapper p-10px md:px-30px">
                  <LessonList lessons={chapter.lessons} />

                  {/* If there's a questionnaire for this chapter, show quiz UI */}
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
                          {/* Start Quiz Button */}
                          {(() => {
                            const quizId = questionnaires[chapter.id]?.id;

                            // Ensure quiz attempts are loaded
                            if (!attemptsLoaded) return null;

                            // Get attempts from state, default to 0 if not found
                            const attempts =
                              quizId && typeof quizAttempts[quizId] === "number"
                                ? quizAttempts[quizId]
                                : 0;

                            // Valid attempts (default to 0 if not found)
                            const validAttempts = Number.isFinite(attempts)
                              ? attempts
                              : 0;

                            // Calculate remaining attempts (now allowing up to 100 attempts)
                            const attemptsLeft = Math.max(
                              0,
                              100 - validAttempts
                            );

                            // Prevent rendering errors
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

                      {/* Show the latest score from the API */}
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

        {/* Course Materials */}
        {isEnrolled && (
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
    </div>
  );
};

export default LessonAccordion;
