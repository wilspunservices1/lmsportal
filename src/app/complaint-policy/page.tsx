import React from 'react'
import ComplaintPolicy from "@/components/sections/complaint-policy/ComplaintPolicy"
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const page = () => {
  return (
    <PageWrapper>
      <main>
        <ComplaintPolicy />
        <ThemeController />
      </main>
    </PageWrapper>
  )
}

export default page