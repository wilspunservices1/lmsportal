"use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import CertificateHead from "./certificateHead";
import CertificateForm from "./CertificateForm";

const EditCertiFields = dynamic(() => import("./EditCertiFields"), { ssr: false });

const EditCertificate = () => {
   const params = useParams();
   const certificateId = params?.id as string;

   // State to hold design data
   const [designData, setDesignData] = useState<any>(null);

   // Callback function to handle button click
   const handleSave = () => {
     console.log("Saving design data:", designData);
   };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <CertificateHead 
        certificateTitle="Edit Certificate"
        onButtonClick={handleSave}
      />
      <EditCertiFields setDesignData={setDesignData} certificateId={certificateId} />
    </div>
  );
};

export default EditCertificate;
