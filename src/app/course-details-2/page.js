import CourseDetails2Main from "@/components/layout/main/CourseDetails2Main";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Courses Details 2 | Meridian LMS - Education LMS Template",
  description: "Courses Details 2 | Meridian LMS - Education LMS Template",
};

const Course_Details_2 = async () => {
  return (
    <PageWrapper>
      <main>
        <CourseDetails2Main />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_2;
