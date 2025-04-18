import InstructorSettingsMain from "@/components/layout/main/dashboards/InstructorSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Setting | Meridian LMS - Education LMS Template",
  description: "Instructor Setting | Meridian LMS - Education LMS Template",
};
const Instructor_Setting = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorSettingsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Setting;
