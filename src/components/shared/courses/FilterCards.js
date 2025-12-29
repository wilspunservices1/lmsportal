"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseCard from "./CourseCard";
import ComingSoon from "@/components/sections/coming-soon/ComingSoon";
import AOS from "aos";
import "aos/dist/aos.css";

const FilterCards = ({ type }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filterOptions = [
    "filter1 filter3",
    "filter2 filter3",
    "filter4 filter5",
    "filter4",
    "filter1 filter3",
    "filter2 filter5",
    "filter4 filter5",
    "filter4",
  ];

  // Filter courses by category if provided
  const filteredCourses = courses;

  const displayedCourses =
    type === "lg" ? filteredCourses.slice(0, 8) : filteredCourses.slice(0, 6);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(`${window.location.origin}/api/courses`);
        url.searchParams.append("status", "published");
        if (category) {
          url.searchParams.append("category", category);
        }
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.data || []);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  // Refresh AOS when courses are updated
  useEffect(() => {
    if (!loading && !error) {
      AOS.refresh();
    }
  }, [courses, loading, error]);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show ComingSoon if category is selected but has no courses
  if (category && displayedCourses.length === 0) {
    return <ComingSoon />;
  }

  if (displayedCourses.length === 0) {
    return <div>No published courses available</div>;
  }

  return (
    <div className="filter-contents flex flex-wrap sm:-mx-15px box-content mt-7 lg:mt-25px">
      {displayedCourses.map((course, idx) => (
        <CourseCard
          key={course.id} // Better to use course.id instead of idx
          idx={idx}
          type={type}
          course={{
            ...course,
            filterOption: filterOptions[idx] || "default-filter",
          }}
        />
      ))}
    </div>
  );
};

export default FilterCards;

// "use client";

// import { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";

// const FilterCards = ({ type }) => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const filterOptions = [
//     "filter1 filter3",
//     "filter2 filter3",
//     "filter4 filter5",
//     "filter4",
//     "filter1 filter3",
//     "filter2 filter5",
//     "filter4 filter5",
//     "filter4",
//   ];

//   // Filters the courses based on the type and limits the number
//   const displayedCourses = type === "lg" ? courses.slice(0, 8) : courses.slice(0, 6);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`/api/courses`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }
//         const data = await response.json();
//         console.log("Fetched courses:", data.data); // Log fetched data
//         setCourses(data.data || []); // Ensure data is an array
//       } catch (err) {
//         setError(err.message || "An unknown error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) {
//     return <div>Loading courses...</div>; // Simple loading state
//   }

//   if (error) {
//     return <div>Error: {error}</div>; // Error handling
//   }

//   if (displayedCourses.length === 0) {
//     return <div>No courses available</div>; // Handle no courses scenario
//   }

//   return (
//     <div
//       className="filter-contents flex flex-wrap sm:-mx-15px box-content mt-7 lg:mt-25px"
//       data-aos="fade-up"
//     >
// {displayedCourses.map((course, idx) => (
//   <CourseCard
//     key={idx}
//     idx={idx}
//     type={type}
//     course={{
//       ...course,
//       filterOption: filterOptions[idx] || "default-filter", // Ensure filterOption exists
//     }}
//   />
// ))}
//     </div>
//   );
// };

// export default FilterCards;
