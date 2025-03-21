import InstructorMain from "@/components/layout/main/InstructorMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Instructor - Dark | Meridian LMS - Education LMS Template",
  description: "Instructor - Dark | Meridian LMS - Education LMS Template",
};
const Instructors_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <InstructorMain />
      </main>
    </PageWrapper>
  );
};

export default Instructors_Dark;
