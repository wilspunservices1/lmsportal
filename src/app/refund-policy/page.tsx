import React from 'react'
import RefundPolicy from "@/components/sections/refund-policy/RefundPolicy"
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const page = () => {
  return (
    <PageWrapper>
      <main>
        <RefundPolicy />
        <ThemeController />
      </main>
    </PageWrapper>
  )
}

export default page
