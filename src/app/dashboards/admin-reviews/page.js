import AdminReviewsMain from "@/components/layout/main/dashboards/AdminReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Reviews | Meridian LMS - Education LMS Template",
  description: "Admin Reviews | Meridian LMS - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminReviewsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Admin_Reviews;
