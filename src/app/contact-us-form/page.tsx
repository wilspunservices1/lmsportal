import React from 'react'
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ContactUs from '@/components/sections/contact-us/contactus';

const page = () => {
    return (
        <PageWrapper>
          <main>
            <ContactUs />
            <ThemeController />
          </main>
        </PageWrapper>
      )
}

export default page
