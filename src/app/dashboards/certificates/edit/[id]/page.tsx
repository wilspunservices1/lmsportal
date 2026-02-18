'use client';
import InstructorDashbordMain from "@/components/layout/main/dashboards/InstructorDashbordMain";

import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import EditCertificate from "../../_comp/EditCertificate";


function page() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <EditCertificate />
          </DashboardContainer>
        </DsahboardWrapper>
        
      </main>
    </PageWrapper>
  )
}

export default page;
