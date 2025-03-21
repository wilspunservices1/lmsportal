'use client';
import dynamic from 'next/dynamic';
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const ManageQuestionnaire = dynamic(() => import('@/components/sections/questionnaire/ManageQuestionnaire'), {
});

// export const metadata = {
//   title: "Manage Questionnaires | Meridian LMS",
//   description: "Manage your course questionnaires",
// };

function ManageQuestionnairePage() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <ManageQuestionnaire 
              questionnaireId="default"
              mode="manage"
              onClose={() => {}}
            />
          </DashboardContainer>
        </DsahboardWrapper>
        
      </main>
    </PageWrapper>
  );
}

export default ManageQuestionnairePage; 