import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import InstructorProfileMain from "@/components/layout/main/dashboards/InstructorProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Profile | Meridian LMS - Education LMS Template",
  description: "Instructor Profile | Meridian LMS - Education LMS Template",
};
const Instructor_Profile = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorProfileMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Profile;
