import React from 'react'
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import SafetyCertification from '@/components/sections/safety-certification/SafetyCertification';

const page = () => {
  return (
    <PageWrapper>
      <main>
        <SafetyCertification />
        <ThemeController />
      </main>
    </PageWrapper>
  )
}

export default page
