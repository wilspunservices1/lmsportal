import CreateCourseMain from "@/components/layout/main/CreateCourseMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Course | Meridian LMS - Education LMS Template",
  description: "Create Course | Meridian LMS - Education LMS Template",
};
const Create_Course = () => {
  return (
    <PageWrapper>
      <main>
        <CreateCourseMain />
      </main>
    </PageWrapper>
  );
};

export default Create_Course;
