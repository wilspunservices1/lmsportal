import CoursesMain from "@/components/layout/main/CoursesMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "Courses - Dark | Meridian LMS - Education LMS Template",
  description: "Courses - Dark | Meridian LMS - Education LMS Template",
};
const Courses_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CoursesMain />
      </main>
    </PageWrapper>
  );
};

export default Courses_Dark;
