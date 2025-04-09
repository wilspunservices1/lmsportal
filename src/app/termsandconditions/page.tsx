import PageWrapper from '@/components/shared/wrappers/PageWrapper'
import TermsAndConditions from '@/components/sections/terms-conditions/TermsAndConditions'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageWrapper>
      <main>
        <TermsAndConditions />
        
      </main>
    </PageWrapper>
    </div>
  )
}

export default page

