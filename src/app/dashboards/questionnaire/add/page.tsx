"use client";
import dynamic from 'next/dynamic';
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const AddQuestionnaire = dynamic(() => import('@/components/sections/questionnaire/AddQuestionnaire'), {
});

// export const metadata = {
//   title: "Create Questionnaire | Meridian LMS",
//   description: "Create a new course questionnaire",
// };

function CreateQuestionnairePage() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AddQuestionnaire />
          </DashboardContainer>
        </DsahboardWrapper>
        
      </main>
    </PageWrapper>
  );
}

export default CreateQuestionnairePage; 