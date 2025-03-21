import InstructorAnnoucementsMain from "@/components/layout/main/dashboards/InstructorAnnoucementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Announcements | Meridian LMS - Education LMS Template",
  description:
    "Instructor Announcements | Meridian LMS - Education LMS Template",
};
const Instructor_Announcements = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorAnnoucementsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Announcements;
