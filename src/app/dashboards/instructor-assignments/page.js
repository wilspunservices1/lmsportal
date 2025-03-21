import InstructorAssignmentsMain from "@/components/layout/main/dashboards/InstructorAssignmentsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Assignments | Meridian LMS - Education LMS Template",
  description: "Instructor Assignments | Meridian LMS - Education LMS Template",
};
const Instructor_Assignments = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorAssignmentsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Assignments;
