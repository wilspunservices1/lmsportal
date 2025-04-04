import InstructorOrderHistoryMain from "@/components/layout/main/dashboards/InstructorOrderHistoryMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Order History | Meridian LMS - Education LMS Template",
  description:
    "Instructor Order History | Meridian LMS - Education LMS Template",
};
const Instructor_Order_History = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorOrderHistoryMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Order_History;
