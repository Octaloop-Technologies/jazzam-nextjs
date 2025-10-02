"use client";

import { useState, useEffect } from "react";
import { getFormByAccessToken } from "@/app/super-user/forms/action";
import { useToast } from "@/lib/hooks/useToast";
import { submitFormData } from "@/app/(main-page)/form/[accessToken]/action";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { LinkedInSvg } from "@/components/svgs/leadsDetailSvgs";
import Input from "@/components/ui/input";

interface FormField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern: string;
    message: string;
  };
}

interface Form {
  _id: string;
  name: string;
  description: string;
  formType: string;
  config: {
    fields: FormField[];
    settings: {
      theme: string;
      submitButtonText: string;
      successMessage: string;
    };
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: number;
  };
}

interface PublicFormProps {
  accessToken: string;
}

const PublicForm = ({ accessToken }: PublicFormProps) => {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFormData();
  }, [accessToken]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getFormByAccessToken(accessToken);

      if (response.success) {
        setForm(response.data);
        // Initialize form data with empty values
        const initialData: Record<string, string> = {};
        response.data.config.fields.forEach((field: FormField) => {
          initialData[field.name] = "";
        });
        setFormData(initialData);
      } else {
        error(response.message || "Form not found");
      }
    } catch (err) {
      console.error("Error fetching form:", err);
      error("Error loading form");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic field validation
  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation && value.trim()) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.config.fields.forEach((field) => {
      const error = validateField(field, formData[field.name] || "");
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitFormData(formData, accessToken);
      if (response.success) {
        success(form?.config.settings.successMessage || "Form submitted successfully!");
        // Clear form data
        const clearedData: Record<string, string> = {};
        form?.config.fields.forEach((field) => {
          clearedData[field.name] = "";
        });
        setFormData(clearedData);
      } else {
        error(response.error || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case "url":
        return <LinkedInSvg />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Form Not Found</h1>
        <p className="text-gray-600">
          The form you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="gradient-bg pb-14 pt-20">
        <div className="home-wrapper">
          <div className="text-white text-center">
            <h1 className="text-[60px] uppercase font-[700] max-lg:text-[40px] max-xs:text-[32px] leading-tight">
              Join Our Network
            </h1>
            <p className="mt-4 text-[20px] capitalize font-[500] max-sm:text-[16px] max-w-2xl mx-auto">
              Connect with us and be part of our professional community
            </p>
          </div>
        </div>
      </section>
      {/* Form Section */}
      <section className="home-padding">
        <div className="home-wrapper">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-b rounded-4xl-0 p-[60px] max-lg:p-[40px] max-sm:p-[30px]">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-pri-light rounded-full flex-center">
                  <LinkedInSvg />
                </div>
                <h2 className="text-[32px] font-[600] text-text mb-4 max-sm:text-[24px]">
                  {form.name}
                </h2>
                <p className="text-[16px] text-gray-250 max-sm:text-[14px]">{form.description}</p>
              </div>

              {/* Dynamic Form */}
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {form.config.fields.map((field) => (
                  <div key={field.id}>
                    <Input
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      error={errors[field.name]}
                      required={field.required}
                      leftIcon={getFieldIcon(field.type)}
                      inputSize="lg"
                      className="text-center"
                    />
                  </div>
                ))}

                {/* Submit Button */}
                <div className="pt-6">
                  <PrimaryButton
                    type="submit"
                    title={
                      isSubmitting
                        ? "Submitting..."
                        : form.config.settings.submitButtonText || "Submit"
                    }
                    className="w-full h-[60px] text-[16px] font-[600]"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  />
                </div>
              </form>

              {/* Additional Info */}
              <div className="mt-10 pt-8 border-t border-gray-b">
                <div className="text-center">
                  <h3 className="text-[18px] font-[600] text-text mb-4">Why We Need This</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-pri-light rounded-full flex-center">
                        <svg
                          className="w-6 h-6 text-pri"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-[14px] font-[600] text-text">Professional Network</h4>
                      <p className="text-[12px] text-gray-250">
                        Connect with like-minded professionals
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-sec-light rounded-full flex-center">
                        <svg
                          className="w-6 h-6 text-sec"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-[14px] font-[600] text-text">Quick Access</h4>
                      <p className="text-[12px] text-gray-250">Faster communication and updates</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-cold-light rounded-full flex-center">
                        <svg
                          className="w-6 h-6 text-cold"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-[14px] font-[600] text-text">Verified Profile</h4>
                      <p className="text-[12px] text-gray-250">
                        Ensure authentic professional connections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicForm;
