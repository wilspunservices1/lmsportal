import CoursesPrimary from "@/components/sections/courses/CoursesPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CoursesMain = () => {
  return (
    <>
      <HeroPrimary path={"Courses"} title={"Featured Courses"} />
      <CoursesPrimary card={true} />
    </>
  );
};

export default CoursesMain;
