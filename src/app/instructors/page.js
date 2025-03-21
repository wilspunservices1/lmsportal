import InstructorMain from "@/components/layout/main/InstructorMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Instructor | Meridian LMS - Education LMS Template",
  description: "Instructor | Meridian LMS - Education LMS Template",
};
const Instructors = () => {
  return (
    <PageWrapper>
      <main>
        <InstructorMain />
      </main>
    </PageWrapper>
  );
};

export default Instructors;
