import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Dashboard | Meridian LMS - Education LMS Template",
  description: "Admin Dashboard | Meridian LMS - Education LMS Template",
};
const Admin_Dashboard = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminDashboardMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Admin_Dashboard;
