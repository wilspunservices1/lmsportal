import CourseDetails2Main from "@/components/layout/main/CourseDetails2Main";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "Courses Details 2 - Dark | Meridian LMS - Education LMS Template",
  description:
    "Courses Details 2 - Dark | Meridian LMS - Education LMS Template",
};
const Course_Details_2_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CourseDetails2Main />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_2_Dark;
