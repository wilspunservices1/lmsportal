import StudentAssignmentsMain from "@/components/layout/main/dashboards/StudentAssignmentsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Assignments | Meridian LMS - Education LMS Template",
  description: "Student Assignments| Meridian LMS - Education LMS Template",
};
const Student_Assignments = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentAssignmentsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Assignments;
