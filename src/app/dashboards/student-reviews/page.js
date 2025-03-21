import StudentReviewsMain from "@/components/layout/main/dashboards/StudentReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Reviews | Meridian LMS - Education LMS Template",
  description: "Student Reviews | Meridian LMS - Education LMS Template",
};
const Student_Reviews = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentReviewsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Reviews;
