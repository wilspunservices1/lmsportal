import CourseListMain from "@/components/layout/main/CourseListMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Course List - Dark | Meridian LMS - Education LMS Template",
  description: "Course List - Dark | Meridian LMS - Education LMS Template",
};
const Course_List_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CourseListMain />
      </main>
    </PageWrapper>
  );
};

export default Course_List_Dark;
