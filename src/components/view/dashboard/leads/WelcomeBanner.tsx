"use client";

import { useAppSelector } from "@/redux/store";
import { useState, useEffect } from "react";

export default function WelcomeBanner() {
  const user = useAppSelector((state) => state.auth.user);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only show if onboarding is not completed and not skipped
  const shouldShow =
    isMounted &&
    user &&
    !user.onboarding?.completed &&
    !user.onboarding?.skipped &&
    user.onboarding?.currentStep === 0;

  const handleDismiss = async () => {
    setIsVisible(false);
  };

  // Don't render until mounted or if conditions aren't met
  if (!shouldShow || !isVisible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full opacity-20 -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">👋</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome to {user?.companyName || "Your Dashboard"}!
                </h2>
                <p className="text-sm text-gray-600">We&apos;re excited to have you here</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 max-w-2xl">
              Ready to get started? We&apos;ve prepared a quick tour to help you discover all the
              powerful features available to manage your leads effectively. It only takes a minute!
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-500">✓</span>
                <span>Track leads from multiple sources</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-500">✓</span>
                <span>Create custom forms</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-500">✓</span>
                <span>Manage follow-ups</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-500">✓</span>
                <span>View analytics</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            aria-label="Dismiss"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-lg border border-blue-200 flex items-center gap-2 text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>The tour will start automatically in a moment</span>
          </div>

          <button
            onClick={handleDismiss}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            or dismiss this banner
          </button>
        </div>
      </div>
    </div>
  );
}
