"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaTrash, FaEdit, FaEye, FaFileDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useSweetAlert from "@/hooks/useSweetAlert";
import Image from "next/image";
import Swal from "sweetalert2";

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Certificate {
  id: string;
  owner_id: string;
  course_id: string;
  title: string;
  name?: string;
  description: string | null;
  courseTitle?: string | null;
  filePath?: string;
  previewUrl?: string;
  created_at: string;
  updatedAt?: string;
  isPublished: boolean;
  unique_identifier: string;
  certificate_data_url?: string;
  placeholders?: Array<{
    id: string;
    label: string;
    value: string;
    is_visible: boolean;
    font_size: number;
    x: number;
    y: number;
    font_family?: string;
    color?: string;
    font_weight?: string;
    font_style?: string;
    key?: string;
  }>;
}

const CERTIFICATE_WIDTH = 842;
const CERTIFICATE_HEIGHT = 595;

const ManageCertificateTable = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewCertificate, setPreviewCertificate] =
    useState<Certificate | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { data: session } = useSession();
  const showAlert = useSweetAlert();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const certificatesPerPage = 9;

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/manageCertificates", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }

        const data = await response.json();
        const userId = (session?.user as CustomUser)?.id;

        if (!userId) {
          setCertificates([]);
          return;
        }

        const certificatesWithData = await Promise.all(
          data
            .filter((cert: Certificate) => cert.owner_id === userId)
            .map(async (cert: Certificate) => {
              try {
                if (cert.id) {
                  const certResponse = await fetch(
                    `/api/manageCertificates/${cert.id}`
                  );
                  if (certResponse.ok) {
                    const certData = await certResponse.json();
                    return {
                      ...cert,
                      certificate_data_url: certData.certificate_data_url,
                      placeholders: certData.placeholders?.map((ph: any) => ({
                        ...ph,
                        is_visible: ph.is_visible !== false,
                        font_size: ph.font_size || 16,
                        x: ph.x || 0,
                        y: ph.y || 0,
                        color: ph.color || "#000000",
                        font_family: ph.font_family || "Arial",
                      })),
                    };
                  }
                }
                return cert;
              } catch (error) {
                console.error(
                  `Error fetching certificate ${cert.id} details:`,
                  error
                );
                return cert;
              }
            })
        );

        setCertificates(certificatesWithData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load certificates"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [session?.user]);

  const handleEdit = (certificate: Certificate) => {
    if (!certificate?.id) {
      showAlert("error", "Invalid certificate data! Cannot edit.");
      return;
    }
    router.push(`/dashboards/certificates/add?id=${certificate.id}`);
  };

  const handleDelete = async (certificateId: string) => {
    const result = await Swal.fire({
      title: "Delete Certificate",
      text: "Are you sure you want to delete this certificate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `/api/manageCertificates/${certificateId}/permanent`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete certificate");
      }

      setCertificates((prev) => prev.filter((c) => c.id !== certificateId));
      showAlert("success", "Certificate deleted successfully!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      showAlert(
        "error",
        error instanceof Error ? error.message : "Failed to delete certificate"
      );
    }
  };

  const handlePreview = async (certificate: Certificate) => {
    if (!certificate.certificate_data_url) {
      showAlert("error", "No certificate image available");
      return;
    }

    setImageLoading((prev) => ({ ...prev, [certificate.id]: true }));

    try {
      const response = await fetch(`/api/manageCertificates/${certificate.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch certificate data");
      }

      const certData = await response.json();

      setPreviewCertificate({
        ...certificate,
        placeholders: certData.placeholders?.map((ph: any) => ({
          id: ph.id,
          label: ph.label || "",
          value: ph.value || "",
          is_visible: ph.is_visible !== false,
          font_size: ph.font_size || 16,
          x: ph.x || 0,
          y: ph.y || 0,
          font_family: ph.font_family || "Arial",
          color: ph.color || "#000000",
          font_weight: ph.font_weight || "normal",
          font_style: ph.font_style || "normal",
          key: ph.key || "",
        })),
      });
    } catch (error) {
      console.error("Error fetching certificate data:", error);
      showAlert("error", "Failed to load certificate data");
    } finally {
      setImageLoading((prev) => ({ ...prev, [certificate.id]: false }));
    }
  };

  const handleDownload = async (certificate: Certificate) => {
    if (!certificate.certificate_data_url) {
      showAlert("error", "No certificate file available for download");
      return;
    }

    try {
      setImageLoading((prev) => ({ ...prev, [certificate.id]: true }));

      const response = await fetch(certificate.certificate_data_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificate.title}_${certificate.unique_identifier}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      showAlert("error", "Failed to download certificate");
    } finally {
      setImageLoading((prev) => ({ ...prev, [certificate.id]: false }));
    }
  };

  const closePreview = () => {
    setPreviewCertificate(null);
  };

  const indexOfLastCertificate = currentPage * certificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - certificatesPerPage;
  const currentCertificates = certificates.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );
  const totalPages = Math.ceil(certificates.length / certificatesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFontClassName = (fontFamily?: string) => {
    switch (fontFamily) {
      case "Great Vibes":
        return "font-great-vibes";
      case "Pinyon Script":
        return "font-pinyon-script";
      case "Tangerine":
        return "font-tangerine";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700">
          No certificates found
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first certificate to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Certificates</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div
              className="relative h-64 cursor-pointer"
              onClick={() => handlePreview(cert)}
            >
              {cert.certificate_data_url ? (
                <div className="relative w-full h-full">
                  {imageLoading[cert.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={cert.certificate_data_url}
                        alt={cert.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">No preview available</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">
                {cert.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                ID: {cert.unique_identifier}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handlePreview(cert)}
                  disabled={imageLoading[cert.id]}
                  className={`flex items-center justify-center px-3 py-2 rounded-md ${
                    imageLoading[cert.id]
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaEye className="mr-1" />
                  <span className="text-sm">View</span>
                </button>

                <button
                  onClick={() => handleDownload(cert)}
                  disabled={imageLoading[cert.id]}
                  className={`flex items-center justify-center px-3 py-2 rounded-md ${
                    imageLoading[cert.id]
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-50 hover:bg-green-100 text-green-600"
                  }`}
                >
                  <FaFileDownload className="mr-1" />
                  <span className="text-sm">Download</span>
                </button>

                <button
                  onClick={() => handleEdit(cert)}
                  className="flex items-center justify-center px-3 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-md text-yellow-600"
                >
                  <FaEdit className="mr-1" />
                  <span className="text-sm">Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(cert.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 rounded-md text-red-600"
                >
                  <FaTrash className="mr-1" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-gray-600">
        Showing {indexOfFirstCertificate + 1} to{" "}
        {Math.min(indexOfLastCertificate, certificates.length)} of{" "}
        {certificates.length} certificates
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {previewCertificate.title}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex justify-center">
              <div
                className="relative"
                style={{
                  width: `${CERTIFICATE_WIDTH}px`,
                  height: `${CERTIFICATE_HEIGHT}px`,
                  maxWidth: "100%",
                }}
              >
                <Image
                  src={previewCertificate.certificate_data_url || ""}
                  alt={previewCertificate.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />

                {/* Render placeholders with exact positions */}
                {previewCertificate.placeholders
                  ?.filter((ph) => ph.is_visible)
                  .map((placeholder) => (
                    <div
                      key={placeholder.id}
                      className={`absolute ${getFontClassName(
                        placeholder.font_family
                      )}`}
                      style={{
                        left: `${placeholder.x}px`,
                        top: `${placeholder.y}px`,
                        fontSize: `${placeholder.font_size}px`,
                        color: placeholder.color,
                        fontFamily: [
                          "Great Vibes",
                          "Pinyon Script",
                          "Tangerine",
                        ].includes(placeholder.font_family || "")
                          ? undefined
                          : placeholder.font_family,
                        fontWeight: placeholder.font_weight,
                        fontStyle: placeholder.font_style,
                        transform: "translate(0, 0)",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      {placeholder.value || placeholder.label}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertificateTable;
