import StudentWishlistMain from "@/components/layout/main/dashboards/StudentWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Wishlist | Meridian LMS - Education LMS Template",
  description: "Student Wishlist | Meridian LMS - Education LMS Template",
};
const Student_Wishlist = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentWishlistMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Wishlist;
