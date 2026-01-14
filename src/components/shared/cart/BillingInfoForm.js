"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const BillingInfoForm = ({ countryInfo, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    billingAddress: "",
    billingCity: "",
    billingPhone: countryInfo.phoneCode,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    if (!formData.billingCity.trim()) {
      newErrors.billingCity = "City is required";
    }

    if (!formData.billingPhone.trim()) {
      newErrors.billingPhone = "Phone number is required";
    } else if (!formData.billingPhone.startsWith("+")) {
      newErrors.billingPhone = "Phone number must start with +";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-blackColor dark:text-whiteColor">
          Billing Information
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your billing details for <strong>{countryInfo.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Billing Address */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blackColor dark:text-whiteColor">
              Billing Address *
            </label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="e.g., 123 King Fahd Road"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-whiteColor"
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.billingAddress}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blackColor dark:text-whiteColor">
              City *
            </label>
            <input
              type="text"
              name="billingCity"
              value={formData.billingCity}
              onChange={handleChange}
              placeholder={`e.g., ${
                countryInfo.name === "Pakistan" ? "Karachi" : "Riyadh"
              }`}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-whiteColor"
            />
            {errors.billingCity && (
              <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blackColor dark:text-whiteColor">
              Phone Number *
            </label>
            <input
              type="tel"
              name="billingPhone"
              value={formData.billingPhone}
              onChange={handleChange}
              placeholder={countryInfo.defaultPhoneFormat}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-whiteColor"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: {countryInfo.defaultPhoneFormat}
            </p>
            {errors.billingPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.billingPhone}</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              ⚠️ Make sure this information matches your card's registered
              billing address.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-blackColor dark:text-whiteColor hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition font-medium"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingInfoForm;
