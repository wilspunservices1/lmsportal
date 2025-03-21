import CourseDetails3Main from "@/components/layout/main/CourseDetails3Main";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course Details 3 | Meridian LMS - Education LMS Template",
  description: "Course Details 3 | Meridian LMS - Education LMS Template",
};

const Course_Details_3 = async () => {
  return (
    <PageWrapper>
      <main>
        <CourseDetails3Main />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_3;
