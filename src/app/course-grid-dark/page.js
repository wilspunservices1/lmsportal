import CourseGridMain from "@/components/layout/main/CourseGridMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Course Grid - Dark | Meridian LMS - Education LMS Template",
  description: "Course Grid - Dark | Meridian LMS - Education LMS Template",
};
const Course_Grid_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CourseGridMain />
      </main>
    </PageWrapper>
  );
};

export default Course_Grid_Dark;
