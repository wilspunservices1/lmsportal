import CoursesMain from "@/components/layout/main/CoursesMain";
import Instructors2 from "@/components/sections/instructors/Instructors2";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Courses | Meridian LMS - Education LMS Template",
  description: "Courses | Meridian LMS - Education LMS Template",
};

const Courses = async () => {
  return (
    <PageWrapper>
      <main>
        <CoursesMain />
        <Instructors2 />
      </main>
    </PageWrapper>
  );
};

export default Courses;
