import CourseGridMain from "@/components/layout/main/CourseGridMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course Grid | Meridian LMS - Education LMS Template",
  description: "Course Grid | Meridian LMS - Education LMS Template",
};

const Course_Grid = async () => {
  return (
    <PageWrapper>
      <main>
        <CourseGridMain />
      </main>
    </PageWrapper>
  );
};

export default Course_Grid;
