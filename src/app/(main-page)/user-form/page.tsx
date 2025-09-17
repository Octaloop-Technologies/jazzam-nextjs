"use client";

import React, { useState } from "react";
import Input from "@/components/ui/input/Input";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { LinkedInSvg } from "@/components/svgs/leadsDetailSvgs";
import { useToast } from "@/lib/hooks/useToast";
import { getLinkedinProfile } from "./action";

const UserFormPage = () => {
  const { success, error } = useToast();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ linkedinUrl?: string }>({});

  // LinkedIn URL validation
  const validateLinkedInUrl = (url: string): string | null => {
    if (!url.trim()) {
      return "LinkedIn URL is required";
    }

    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(url)) {
      return "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateLinkedInUrl(linkedinUrl);
    if (validationError) {
      setErrors({ linkedinUrl: validationError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await getLinkedinProfile(linkedinUrl);
      console.log(response);
      if (response.success) {
        success(
          response.data.message || "LinkedIn URL submitted successfully! We'll be in touch soon."
        );
      } else {
        error(response.error || "Failed to submit LinkedIn URL. Please try again.");
      }

      setLinkedinUrl("");
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to submit LinkedIn URL. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkedinUrl(value);

    // Clear error when user starts typing
    if (errors.linkedinUrl) {
      setErrors({});
    }
  };

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
              Connect with us on LinkedIn and be part of our professional community
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
                  Share Your LinkedIn Profile
                </h2>
                <p className="text-[16px] text-gray-250 max-sm:text-[14px]">
                  Help us connect with you professionally by sharing your LinkedIn profile URL
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Input
                    label="LinkedIn Profile URL"
                    name="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={linkedinUrl}
                    onChange={handleInputChange}
                    error={errors.linkedinUrl}
                    required
                    leftIcon={<LinkedInSvg />}
                    inputSize="lg"
                    className="text-center"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <PrimaryButton
                    type="submit"
                    title={isSubmitting ? "Submitting..." : "Submit LinkedIn URL"}
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

export default UserFormPage;
