import InstructorQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Quiz Attempts | Meridian LMS - Education LMS Template",
  description:
    "Instructor Quiz Attempts | Meridian LMS - Education LMS Template",
};
const Instructor_Quiz_Attempts = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorQuizAttemptsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Quiz_Attempts;
