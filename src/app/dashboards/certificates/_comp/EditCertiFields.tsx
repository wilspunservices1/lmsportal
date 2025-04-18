"use client";
import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import "@/styles/fonts.css";
import { useCallback, useMemo } from "react";

// Icons, Hooks, and Components
import { SettingsIcon, RefreshIcon } from "@/components/icons";
import useSweetAlert from "@/hooks/useSweetAlert";
import useTab from "@/hooks/useTab";
import DesignTab from "./DesignTab"; // Your additional design functionality

// Local mock or shared placeholders
import { initialPlaceholders } from "@/assets/mock";
import DownloadIcon from "@/components/sections/create-course/_comp/Certificate/Icon/DownloadIcon";

interface APICertificate {
  id: string;
  owner_id: string;
  certificate_data_url: string;
  description: string;
  is_published: boolean;
  unique_identifier: string;
  title: string;
  expiration_date: string;
  is_revocable: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_enabled: boolean;
  orientation: string;
  max_download: number;
  is_deleted: boolean;
  course_id: string;
  file_name: string;
  metadata: {
    courseName?: string;
    instructor?: string;
    courseDuration?: string;
    file_name: string;
  };
  placeholders: APIPlaceholder[];
}

interface APIPlaceholder {
  id: string;
  certificate_id: string;
  key: string;
  discount: number;
  label: string;
  value: string;
  x: number;
  y: number;
  font_size?: number;
  is_visible?: boolean;
  color?: string;
  font_family?: string;
}

interface UIPlaceholder extends APIPlaceholder {
  font_size: number; // from font_size
  is_visible: boolean; // from is_visible
  color: string; // from color
  font_family: string; // from font_family
}

interface CertificateOption {
  value: string; // The certificate's id
  label: string; // title + unique_identifier
}

interface EditCertiFieldsProps {
  setDesignData: (data: any) => void;
}

const EditCertiFields: React.FC<EditCertiFieldsProps> = ({ setDesignData }) => {
  const { currentIdx } = useTab();
  const showAlert = useSweetAlert();

  const [allCertificates, setAllCertificates] = useState<APICertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<APICertificate | null>(null);
  const [selectedPlaceholders, setSelectedPlaceholders] = useState<
    UIPlaceholder[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [showCropper, setShowCropper] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [instructorName, setInstructorName] = useState("");
  const [selectedFont, setSelectedFont] = useState<string>("Arial"); // Default font
  const [isSaving, setIsSaving] = useState(false);

  const CERTIFICATE_WIDTH = 842;
  const CERTIFICATE_HEIGHT = 595;
  const PLACEHOLDER_MIN_WIDTH = 100;
  const PLACEHOLDER_MIN_HEIGHT = 30;

  const fetchUserCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/certificates/get-saved");
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();

      if (!data || !Array.isArray(data.certificates)) {
        throw new Error("Invalid data format from API.");
      }

      setAllCertificates(data.certificates);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates");
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserCertificates();
  }, [fetchUserCertificates]);

  const handleSelectCertificate = (
    newValue: SingleValue<CertificateOption>
  ) => {
    if (!newValue) {
      setSelectedCertificate(null);
      setSelectedPlaceholders([]);
      return;
    }

    const found = allCertificates.find((cert) => cert.id === newValue.value);
    if (!found) {
      console.warn("Selected certificate not found in state:", newValue.value);
      return;
    }

    setSelectedCertificate(found);

    const placeholdersForCert: UIPlaceholder[] = found.placeholders.map(
      (ph, index) => {
        // Check if position is valid (not null/undefined and within bounds)
        const hasValidPosition =
          ph.x !== undefined &&
          ph.x !== null &&
          ph.y !== undefined &&
          ph.y !== null &&
          ph.x >= 0 &&
          ph.y >= 0 &&
          ph.x <= 842 - 100 && // Account for placeholder width
          ph.y <= 595 - 30; // Account for placeholder height

        return {
          ...ph,
          font_size: ph.font_size ?? 16,
          font_family: ph.font_family || selectedFont,
          is_visible: ph.is_visible !== false,
          color: ph.color ?? "#000000",
          x: hasValidPosition ? ph.x : 30, // Use saved x or default
          y: hasValidPosition ? ph.y : index * 60 + 30, // Use saved y or default
        };
      }
    );
    setSelectedPlaceholders(placeholdersForCert);
  };

  const handleDownload = useCallback(async () => {
    const container = document.querySelector(".certificate-container");
    if (!container) return;

    try {
      const canvas = await html2canvas(container as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fff",
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `certificate-${Date.now()}.png`;
      link.click();

      showAlert("success", "Certificate downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      showAlert("error", "Failed to download certificate");
    }
  }, [showAlert]);

  const certificateIdx = selectedCertificate?.id;

  const updatePlaceholderCoordinates = useCallback(
    async (placeholderId: string, x: number, y: number) => {
      try {
        if (!certificateIdx) return;
        const response = await fetch(
          `/api/manageCertificates/${certificateIdx}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeholderId, x, y }),
          }
        );
        if (!response.ok) {
          console.error(
            "Failed to update placeholder in DB, status:",
            response.status
          );
        }
      } catch (err) {
        console.error("Error updating placeholder in DB:", err);
      }
    },
    [certificateIdx]
  );

  const debouncedUpdatePlaceholderCoordinates = useMemo(
    () => debounce(updatePlaceholderCoordinates, 500),
    [updatePlaceholderCoordinates]
  );

  const savePlaceholderPosition = async (
    placeholderId: string,
    x: number,
    y: number
  ) => {
    try {
      // First update local state for immediate UI response
      setSelectedPlaceholders((prev) =>
        prev.map((item) =>
          item.id === placeholderId ? { ...item, x, y } : item
        )
      );

      // Then update the backend
      await debouncedUpdatePlaceholderCoordinates(placeholderId, x, y);
    } catch (error) {
      console.error("Error updating placeholder position:", error);
      // Optionally revert local state if save fails
      setSelectedPlaceholders((prev) =>
        prev.map((item) =>
          item.id === placeholderId
            ? { ...item, x: item.x, y: item.y } // Revert to previous position
            : item
        )
      );
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (!selectedCertificate) {
        showAlert("error", "No certificate selected");
        return;
      }
  
      // Validate placeholders before sending
      const validPlaceholders = selectedPlaceholders.map(ph => {
        // Ensure x and y are valid numbers
        const x = Math.round(Number(ph.x));
        const y = Math.round(Number(ph.y));
  
        // Validate position is within bounds
        const validX = Math.max(0, Math.min(x, CERTIFICATE_WIDTH - PLACEHOLDER_MIN_WIDTH));
        const validY = Math.max(0, Math.min(y, CERTIFICATE_HEIGHT - PLACEHOLDER_MIN_HEIGHT));
  
        return {
          id: ph.id,
          x: validX,
          y: validY,
          value: ph.value || "",
          font_size: Math.round(Number(ph.font_size)) || 16,
          color: ph.color || "#000000",
          font_family: ph.font_family || "Arial",
          is_visible: ph.is_visible ?? true
        };
      });
  
      // Check if any placeholder is missing required data
      const invalidPlaceholders = validPlaceholders.filter(
        ph => !ph.id || typeof ph.x !== 'number' || typeof ph.y !== 'number'
      );
  
      if (invalidPlaceholders.length > 0) {
        showAlert("error", "Some placeholders have invalid data");
        return;
      }
  
      // Send the request to the backend
      const response = await fetch("/api/placeholders/bulk-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeholders: validPlaceholders }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `HTTP Error: ${response.status}`);
      }
  
      // Refresh the certificate data to ensure we have the latest from the backend
      await fetchUserCertificates();
      showAlert("success", "Certificate changes saved successfully");
    } catch (err) {
      console.error("Error saving changes:", err);
      showAlert("error", err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlaceholderVisibility = async (
    placeholderId: string,
    isVisible: boolean
  ) => {
    try {
      const response = await fetch(`/api/placeholders/${placeholderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_visible: isVisible }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      console.log(
        `Placeholder ${placeholderId} visibility updated to ${isVisible}`
      );
    } catch (error) {
      console.error("Error updating placeholder visibility:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Select
          options={allCertificates.map((cert) => ({
            value: cert.id,
            label: `${cert.title} - ${cert.unique_identifier}`,
          }))}
          onChange={handleSelectCertificate}
          isLoading={loading}
          placeholder="Select a certificate..."
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable
        />
      </div>

      {selectedCertificate && (
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center space-x-2 bg-blue text-white px-4 py-2 rounded-lg"
            >
              <SettingsIcon size={24} color="white" />
              <span>Options</span>
            </button>

            <button
              onClick={() =>
                setSelectedPlaceholders(
                  initialPlaceholders.map((ph: any) => ({
                    ...ph,
                    font_size: ph.font_size || 16,
                    is_visible: true,
                    id: ph.id || uuidv4(),
                  }))
                )
              }
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <RefreshIcon size={24} color="white" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-yellow text-white px-4 py-2 rounded-lg"
            >
              <DownloadIcon width={24} color="white" />
              <span>Download</span>
            </button>

            {/* Add the Save Changes button here */}
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`flex items-center space-x-2 ${
                isSaving ? "bg-gray-500" : "bg-green-500"
              } text-white px-4 py-2 rounded-lg`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {showOptions && (
            <div className="mb-4 p-4 border rounded bg-gray-100">
              <h3 className="text-lg font-bold mb-4">Placeholder Settings</h3>
              <Select
                isMulti
                options={selectedPlaceholders.map((p) => ({
                  value: p.id,
                  label: p.label,
                }))}
                value={selectedPlaceholders
                  .filter((p) => p.is_visible)
                  .map((p) => ({
                    value: p.id,
                    label: p.label,
                  }))}
                onChange={(selected) => {
                  const selectedIds = selected?.map((opt) => opt.value) || [];
                  setSelectedPlaceholders((prev) =>
                    prev.map((ph) => {
                      const newVisibility = selectedIds.includes(ph.id);
                      if (ph.is_visible !== newVisibility) {
                        togglePlaceholderVisibility(ph.id, newVisibility);
                      }
                      return {
                        ...ph,
                        is_visible: newVisibility,
                      };
                    })
                  );
                }}
                className="mb-4"
              />
              <button
                onClick={() => {
                  setSelectedPlaceholders((prev) =>
                    prev.map((ph) => {
                      if (!ph.is_visible) {
                        togglePlaceholderVisibility(ph.id, true);
                        return {
                          ...ph,
                          is_visible: true,
                        };
                      }
                      return ph;
                    })
                  );
                }}
                className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
              >
                Show Hidden Placeholders
              </button>

              {selectedPlaceholders.map((ph) => (
                <div
                  key={ph.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <span>{ph.label}</span>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Font Size:</label>
                    <input
                      type="number"
                      value={ph.font_size}
                      onChange={(e) => {
                        const size = Math.max(
                          8,
                          Math.min(72, parseInt(e.target.value) || 16)
                        );
                        setSelectedPlaceholders((prev) =>
                          prev.map((item) =>
                            item.id === ph.id
                              ? {
                                  ...item,
                                  font_size: size,
                                }
                              : item
                          )
                        );
                      }}
                      className="w-16 px-2 py-1 border rounded"
                      min={8}
                      max={72}
                    />
                    <label className="text-sm">Color:</label>
                    <input
                      type="color"
                      value={ph.color}
                      onChange={(e) => {
                        setSelectedPlaceholders((prev) =>
                          prev.map((item) =>
                            item.id === ph.id
                              ? {
                                  ...item,
                                  color: e.target.value,
                                }
                              : item
                          )
                        );
                      }}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <label className="text-sm">Font Family:</label>
                    <select
                      value={ph.font_family}
                      onChange={(e) => {
                        setSelectedPlaceholders((prev) =>
                          prev.map((item) =>
                            item.id === ph.id
                              ? {
                                  ...item,
                                  font_family: e.target.value,
                                }
                              : item
                          )
                        );
                      }}
                      className="w-32 px-2 py-1 border rounded"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Great Vibes">Great Vibes</option>
                      <option value="Pinyon Script">Pinyon Script</option>
                      <option value="Tangerine">Tangerine</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="certificate-container relative mx-auto bg-white"
            style={{
              width: `${CERTIFICATE_WIDTH}px`,
              height: `${CERTIFICATE_HEIGHT}px`,
              overflow: "hidden",
            }}
          >
            {/* Certificate background image */}
            <div className="absolute inset-0">
              <Image
                src={selectedCertificate.certificate_data_url}
                alt={`${selectedCertificate.title} - ${selectedCertificate.unique_identifier}`}
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
                width={CERTIFICATE_WIDTH} // Match container width
                height={CERTIFICATE_HEIGHT} // Match container height
                style={{
                  width: `${CERTIFICATE_WIDTH}px`,
                  height: `${CERTIFICATE_HEIGHT}px`,
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Placeholders container with matching dimensions */}
            <div className="absolute inset-0">
              {selectedPlaceholders
                .filter((ph) => ph.is_visible)
                .map((placeholder) => (
                  <Draggable
                    key={placeholder.id}
                    position={{
                      x: placeholder.x,
                      y: placeholder.y,
                    }}
                    bounds="parent" // This ensures the dragging is constrained to the parent container
                    onDrag={(e, data) => {

                      if (typeof data.x !== 'number' || typeof data.y !== 'number') return;   
                      // Validate position during drag
                      const x = Math.max(
                        0,
                        Math.min(
                          Math.round(data.x), // Round to prevent floating point issues
                          CERTIFICATE_WIDTH - PLACEHOLDER_MIN_WIDTH
                        )
                      );
                      const y = Math.max(
                        0,
                        Math.min(
                          Math.round(data.y), // Round to prevent floating point issues
                          CERTIFICATE_HEIGHT - PLACEHOLDER_MIN_HEIGHT
                        )
                      );

                      // Update position only if within bounds
                      if (Number.isFinite(x) && Number.isFinite(y)) {
                        setSelectedPlaceholders((prev) =>
                          prev.map((item) =>
                            item.id === placeholder.id
                              ? { ...item, x, y }
                              : item
                          )
                        );
                      }
                    }}
                    onStop={(e, data) => {
                      if (typeof data.x !== 'number' || typeof data.y !== 'number') return;
                      // Ensure final position is within bounds
                      const x = Math.max(
                        0,
                        Math.min(
                          Math.round(data.x),
                          CERTIFICATE_WIDTH - PLACEHOLDER_MIN_WIDTH
                        )
                      );
                      const y = Math.max(
                        0,
                        Math.min(
                          Math.round(data.y),
                          CERTIFICATE_HEIGHT - PLACEHOLDER_MIN_HEIGHT
                        )
                      );

                      if (Number.isFinite(x) && Number.isFinite(y)) {
                        setSelectedPlaceholders((prev) =>
                          prev.map((item) =>
                            item.id === placeholder.id ? { ...item, x, y } : item
                          )
                        );
                        savePlaceholderPosition(placeholder.id, x, y);
                      }
                    }}
                  >
                    <div
                      className="absolute cursor-move group"
                      style={{
                        left: `${placeholder.x}px`,
                        top: `${placeholder.y}px`,
                        zIndex: 10,
                        width: `${PLACEHOLDER_MIN_WIDTH}px`,
                        maxHeight: `${PLACEHOLDER_MIN_WIDTH}px`,
                      }}
                    >
                      <input
                        type="text"
                        value={placeholder.value}
                        onChange={(e) => {
                          const updatedVal = e.target.value;
                          setSelectedPlaceholders((prev) =>
                            prev.map((item) =>
                              item.id === placeholder.id
                                ? { ...item, value: updatedVal }
                                : item
                            )
                          );
                        }}
                        className={`bg-transparent hover:bg-white/50 focus:bg-white/50 
                       dark:hover:bg-blackColor-dark/50 dark:focus:bg-blackColor-dark/50 border border-transparent hover:border-gray-300 
                        focus:border-blue-500 rounded px-2 py-1 outline-none transition-all
                        ${placeholder.font_family === "Great Vibes" ? "font-great-vibes" : ""}
                        ${placeholder.font_family === "Pinyon Script"? "font-pinyon-script": ""}
                        ${placeholder.font_family === "Tangerine" ? "font-tangerine" : ""}`}
                        style={{
                          fontSize: `${placeholder.font_size}px`,
                          color: placeholder.color,
                          fontFamily: [
                            "Great Vibes",
                            "Pinyon Script",
                            "Tangerine",
                          ].includes(placeholder.font_family)
                            ? undefined
                            : placeholder.font_family,
                          minWidth: `${PLACEHOLDER_MIN_WIDTH}px`,
                        }}
                        placeholder={placeholder.label || ""}
                      />
                    </div>
                  </Draggable>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        {currentIdx === 0 && (
          <DesignTab
            certificateData={
              selectedCertificate
                ? {
                    id: selectedCertificate.id,
                    owner_id: selectedCertificate.owner_id,
                    certificate_data_url:
                      selectedCertificate.certificate_data_url,
                    description: selectedCertificate.description,
                    is_published: selectedCertificate.is_published,
                    unique_identifier: selectedCertificate.unique_identifier,
                    title: selectedCertificate.title,
                    is_revocable: selectedCertificate.is_revocable,
                    metadata: selectedCertificate.metadata,
                    created_at: selectedCertificate.created_at,
                    updated_at: selectedCertificate.updated_at,
                  }
                : {
                    id: "",
                    owner_id: "",
                    certificate_data_url: "",
                    description: "",
                    is_published: false,
                    unique_identifier: "",
                    title: "",
                    is_revocable: false,
                    metadata: {
                      courseName: "",
                      instructor: "",
                      courseDuration: "",
                      file_name: "",
                    },
                    created_at: "",
                    updated_at: "",
                  }
            }
            isEditing={isEditing}
            instructorName={instructorName}
            setDesignData={setDesignData}
            placeholders={selectedPlaceholders}
            setPlaceholders={setSelectedPlaceholders}
          />
        )}
      </div>
    </div>
  );
};

export default EditCertiFields;
