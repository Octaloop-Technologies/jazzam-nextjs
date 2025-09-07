"use client";

import React, { useState } from "react";
import Input from "@/components/ui/input/Input";
import Textarea from "@/components/ui/textarea/Textarea";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import {
  EmailSvg,
  PhoneSvg,
  CompanySvg,
  LocationSvg,
  LinkedInSvg,
} from "@/components/svgs/leadsDetailSvgs";
import {
  industryOptionsWithLabels,
  companySizeOptions,
  sourceOptionsWithLabels,
  interestsOptions,
  statusOptions,
} from "@/lib/constants/leadConstants";
import { useForm } from "@/lib/hooks/useForm";
import { validators } from "@/lib/hooks/useValidation";
import { createLead } from "./action";
import { useToast } from "@/lib/hooks/useToast";

const FormPage = () => {
  const { success, error, warning } = useToast();

  // ==========================================================
  // Custom Input State Management
  // ==========================================================
  const [customInterest, setCustomInterest] = useState("");

  // ==========================================================
  // Form Submit Handler
  // ==========================================================
  const handleSubmit = async (values: LeadFormData, isValid: boolean) => {
    if (isValid) {
      try {
        // Prepare final values with custom entries
        const finalValues = {
          ...values,
          // Filter out "Other" from interests if there are custom values
          interests: values.interests.filter(
            (interest) => interest !== "Other" || values.interests.length === 1
          ),
        };

        // Submit to API
        const response = await createLead(finalValues);

        console.log("Response:", response);

        if (response.success) {
          success("Form submitted successfully!");
          resetForm();
          setCustomInterest("");
        } else {
          error(response.data.message);
        }
      } catch (err) {
        error("Error submitting form");
        throw new Error(err instanceof Error ? err.message : "Unknown error");
      }
    } else {
      warning("Form has validation errors. Please check the form and try again.");
    }
  };

  // ==========================================================
  // Validation Schema
  // ==========================================================
  const validationSchema = {
    name: [validators.required("Name is required")],
    email: [validators.required("Email is required"), validators.email()],
    phone: [validators.required("Phone is required"), validators.number()],
    linkedinProfile: [],
    company: [validators.required("Company is required")],
    location: [validators.required("Location is required")],
    website: [],
    industry: [validators.required("Industry is required")],
    companySize: [validators.required("Company size is required")],
    source: [validators.required("Source is required")],
    interests: [validators.required("Interests are required")],
    notes: [],
    status: [validators.required("Status is required")],
  };

  // ==========================================================
  // Use Form Hook
  // ==========================================================
  const {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: formHandleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useForm<LeadFormData>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      linkedinProfile: "",
      company: "",
      location: "",
      website: "",
      industry: "",
      companySize: "",
      source: "",
      interests: [],
      notes: "",
      status: "cold",
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
  });

  // ==========================================================
  // Handle Array Toggle (for interests)
  // ==========================================================
  const handleArrayToggle = (field: "interests", value: string) => {
    const currentArray = values[field] as string[];
    const customItems = currentArray.filter((item) => !interestsOptions.includes(item));

    if (value === "Other") {
      // If "Other" is clicked and there are custom items, remove all custom items and "Other"
      if (currentArray.includes("Other") || customItems.length > 0) {
        const newArray = currentArray.filter(
          (item) => interestsOptions.includes(item) && item !== "Other"
        );
        setFieldValue(field, newArray);

        // Clear the custom input
        setCustomInterest("");
      } else {
        // Add "Other" if not present
        setFieldValue(field, [...currentArray, "Other"]);
      }
    } else {
      // Handle regular options
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      setFieldValue(field, newArray);
    }
  };

  // ==========================================================
  // Handle Custom Interest Addition
  // ==========================================================
  const handleAddCustom = (field: "interests", customValue: string) => {
    if (!customValue.trim()) return;

    const currentArray = values[field] as string[];
    // Remove "Other" and add the custom value
    const newArray = currentArray.filter((item) => item !== "Other").concat(customValue.trim());
    setFieldValue(field, newArray);

    // Clear the input and reset state
    setCustomInterest("");
  };

  // ==========================================================
  // Handle Custom Input Key Press
  // ==========================================================
  const handleCustomKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "interests",
    customValue: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom(field, customValue);
    }
  };

  return (
    <section>
      <div className="my-5 wrapper">
        <div className="bg-white border border-gray-b rounded-3xl p-[30px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-n/30">
            <h1 className="text-[24px] font-[600] text-text">Lead Form</h1>

            {/* Form Status Indicators : Unsaved changes, Form valid, Error (Optionally added) */}
            <div className="flex items-center gap-3">
              {isDirty && (
                <span className="text-[12px] text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  Unsaved changes
                </span>
              )}
              {!isValid && isDirty && (
                <span className="text-[12px] text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  {Object.values(errors).filter(Boolean).length} error
                  {Object.values(errors).filter(Boolean).length !== 1 ? "s" : ""}
                </span>
              )}
              {isValid && isDirty && (
                <span className="text-[12px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Form valid
                </span>
              )}
            </div>
          </div>

          <form onSubmit={formHandleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-[18px] font-[500] text-text mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-pri rounded-full"></div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Enter full name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name ? errors.name : undefined}
                  required
                  leftIcon={<div className="w-5 h-5 bg-gray-300 rounded-full flex-shrink-0"></div>}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                  required
                  leftIcon={<EmailSvg />}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone ? errors.phone : undefined}
                  required
                  leftIcon={<PhoneSvg />}
                />
                <Input
                  label="LinkedIn Profile URL"
                  name="linkedinProfile"
                  placeholder="Enter LinkedIn profile URL"
                  value={values.linkedinProfile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  leftIcon={<LinkedInSvg />}
                />
              </div>
            </div>

            {/* Company Information Section */}
            <div>
              <h2 className="text-[18px] font-[500] text-text mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-sec rounded-full"></div>
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  name="company"
                  placeholder="Enter company name"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.company ? errors.company : undefined}
                  required
                  leftIcon={<CompanySvg />}
                />
                <Input
                  label="Location"
                  name="location"
                  placeholder="Enter company location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.location ? errors.location : undefined}
                  required
                  leftIcon={<LocationSvg />}
                />
                <Input
                  label="Company Website"
                  name="website"
                  type="url"
                  placeholder="Enter company website"
                  value={values.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.website ? errors.website : undefined}
                />
                <div>
                  <label className="block mb-2 text-[14px] font-[500] text-text">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="industry"
                    value={values.industry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full h-[48px] px-4 text-[16px] bg-white border rounded-lg outline-none 
                      transition-all duration-200 focus:ring-1 ${
                        touched.industry && errors.industry
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-b focus:ring-pri focus:border-pri"
                      }`}
                  >
                    <option value="">Select industry</option>
                    {industryOptionsWithLabels.map((industry) => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                  {touched.industry && errors.industry && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.industry}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[14px] font-[500] text-text">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="companySize"
                    value={values.companySize}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full h-[48px] px-4 text-[16px] bg-white border rounded-lg outline-none 
                      transition-all duration-200 focus:ring-1 ${
                        touched.companySize && errors.companySize
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-b focus:ring-pri focus:border-pri"
                      }`}
                  >
                    <option value="">Select company size</option>
                    {companySizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  {touched.companySize && errors.companySize && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.companySize}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[14px] font-[500] text-text">
                    Lead Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="source"
                    value={values.source}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full h-[48px] px-4 text-[16px] bg-white border rounded-lg outline-none 
                      transition-all duration-200 focus:ring-1 ${
                        touched.source && errors.source
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-b focus:ring-pri focus:border-pri"
                      }`}
                  >
                    <option value="">Select source</option>
                    {sourceOptionsWithLabels.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                  {touched.source && errors.source && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.source}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div>
              <h3 className="text-[16px] font-[500] text-text mb-3">
                Primary Interests <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestsOptions.map((interest) => {
                  // Check if "Other" should be selected (either directly selected or has custom values)
                  const hasCustomInterests =
                    values.interests.filter((i) => !interestsOptions.includes(i)).length > 0;
                  const isSelected =
                    interest === "Other"
                      ? values.interests.includes(interest) || hasCustomInterests
                      : values.interests.includes(interest);

                  const buttonClasses = `px-4 py-2 rounded-lg border transition-all duration-200 text-[14px] ${
                    isSelected
                      ? "bg-sec-light text-sec border-sec"
                      : "bg-white text-gray-250 border-gray-b hover:border-sec"
                  }`;

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        handleArrayToggle("interests", interest);
                        // Mark field as touched when user interacts with it
                        setFieldTouched("interests", true);
                      }}
                      className={buttonClasses}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              {touched.interests && errors.interests && (
                <p className="mt-2 text-[12px] text-red-500">{errors.interests}</p>
              )}

              {/* Custom Interest Input */}
              {(values.interests.includes("Other") ||
                values.interests.filter((i) => !interestsOptions.includes(i)).length > 0) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block mb-2 text-[14px] font-[500] text-text">
                    Specify your custom interest
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyPress={(e) => handleCustomKeyPress(e, "interests", customInterest)}
                      placeholder="Enter your custom interest..."
                      className="flex-1 h-[40px] px-3 text-[14px] bg-white border border-gray-b rounded-lg outline-none 
                        transition-all duration-200 focus:ring-1 focus:ring-sec focus:border-sec"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustom("interests", customInterest)}
                      disabled={!customInterest.trim()}
                      className="px-4 py-2 bg-sec text-white rounded-lg text-[14px] font-[500] 
                        transition-all duration-200 hover:bg-sec/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1">
                    Press Enter or click Add to include this custom interest
                  </p>
                </div>
              )}

              {/* Display selected custom interests */}
              {values.interests.filter((interest) => !interestsOptions.includes(interest)).length >
                0 && (
                <div className="mt-3">
                  <p className="text-[14px] font-[500] text-text mb-2">Custom interests added:</p>
                  <div className="flex flex-wrap gap-2">
                    {values.interests
                      .filter((interest) => !interestsOptions.includes(interest))
                      .map((customInterestItem, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-sec-light text-sec rounded-full text-[12px] font-[500]"
                        >
                          {customInterestItem}
                          <button
                            type="button"
                            onClick={() => {
                              const newInterests = values.interests.filter(
                                (item) => item !== customInterestItem
                              );
                              setFieldValue("interests", newInterests);
                            }}
                            className="ml-1 hover:text-sec/70"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information Section */}
            <div>
              <h2 className="text-[18px] font-[500] text-text mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-cold rounded-full"></div>
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 text-[14px] font-[500] text-text">
                    Lead Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((status) => {
                      const isSelected = values.status === status.value;
                      let buttonClasses =
                        "px-4 py-3 rounded-lg border transition-all duration-200 text-[14px] font-[500] ";

                      if (isSelected) {
                        switch (status.color) {
                          case "hot":
                            buttonClasses += "bg-hot-light text-hot border-hot";
                            break;
                          case "sec":
                            buttonClasses += "bg-sec-light text-sec border-sec";
                            break;
                          case "cold":
                            buttonClasses += "bg-cold-light text-cold border-cold";
                            break;
                          case "pipeline":
                            buttonClasses += "bg-pipeline-light text-pipeline border-pipeline";
                            break;
                          default:
                            buttonClasses += "bg-gray-100 text-gray-600 border-gray-300";
                        }
                      } else {
                        buttonClasses +=
                          "bg-white text-gray-250 border-gray-b hover:border-gray-200";
                      }

                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => {
                            setFieldValue("status", status.value);
                            // Mark field as touched when user interacts with it
                            setFieldTouched("status", true);
                          }}
                          className={buttonClasses}
                        >
                          {status.label}
                        </button>
                      );
                    })}
                  </div>
                  {touched.status && errors.status && (
                    <p className="mt-2 text-[12px] text-red-500">{errors.status}</p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Textarea
                  label="Additional Notes"
                  name="notes"
                  placeholder="Enter any additional notes about this lead..."
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-n/30">
              <PrimaryButton
                type="button"
                title="Cancel"
                bordered
                className="flex-1 h-[50px]"
                onClick={() => window.history.back()}
              />

              {/* Reset Button - only show if form is dirty */}
              {isDirty && (
                <PrimaryButton
                  type="button"
                  title="Reset"
                  bordered
                  className="h-[50px] px-6"
                  onClick={() => {
                    resetForm();
                    setCustomInterest("");
                  }}
                />
              )}

              <PrimaryButton
                type="submit"
                title={isSubmitting ? "Creating..." : "Create Lead"}
                className="flex-1 h-[50px]"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormPage;
