import CourseDetails3Main from "@/components/layout/main/CourseDetails3Main";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Courses Details 3 - Dark | Meridian LMS - Education LMS Template",
  description:
    "Courses Details 3 - Dark | Meridian LMS - Education LMS Template",
};
const Course_Details_3_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CourseDetails3Main />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_3_Dark;
