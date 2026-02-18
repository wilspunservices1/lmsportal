"use client";

import InstructorDashbordMain from "@/components/layout/main/dashboards/InstructorDashbordMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import AddCertificate from "../_comp/AddCertificate";

function page() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AddCertificate />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  )
}

export default page
