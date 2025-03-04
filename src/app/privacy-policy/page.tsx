import React from 'react'
import PrivacyComp from "@/components/sections/privacy-policy/PrivacyComp"
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const page = () => {
  return (
    <PageWrapper>
      <main>
        <PrivacyComp />
        <ThemeController />
      </main>
    </PageWrapper>
  )
}

export default page
