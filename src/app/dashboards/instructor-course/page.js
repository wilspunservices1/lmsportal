import InstructorCourseMain from "@/components/layout/main/dashboards/InstructorCourseMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Course | Meridian LMS - Education LMS Template",
  description: "Instructor Course | Meridian LMS - Education LMS Template",
};
const Instructor_Course = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorCourseMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Course;
