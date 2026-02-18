"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import CertificateHead from "./certificateHead";
import CertificateForm from "./CertificateForm";

const AddCertificate = () => {
  const searchParams = useSearchParams();
  const certificateId = searchParams.get("id");

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <CertificateHead certificateTitle={certificateId ? "Edit Certificate" : "Create New Certificate"} showButton={false} />
      <CertificateForm certificateId={certificateId} />
    </div>
  );
};

export default AddCertificate;
