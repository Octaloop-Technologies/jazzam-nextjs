"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { updateOnboardingStatus as updateOnboardingAction } from "@/lib/api/leads";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  targetPath?: string;
  action?: string;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 0,
    title: "Welcome to Your Dashboard! 🎉",
    description:
      "Let's take a quick tour to help you get started with managing your leads effectively. This will only take a minute!",
    icon: "👋",
  },
  {
    id: 1,
    title: "View Your Leads",
    description:
      "This is your leads dashboard where you can track all incoming leads from various platforms like LinkedIn, Meta, and more. Monitor lead status and engagement in real-time.",
    targetPath: "/super-user",
    icon: "📊",
  },
  {
    id: 2,
    title: "Create Forms",
    description:
      "Build custom forms to capture leads from different sources. You can create multiple forms for different campaigns and track their performance.",
    targetPath: "/super-user/forms",
    action: "Go to Forms",
    icon: "📝",
  },
  {
    id: 3,
    title: "Track Follow-ups",
    description:
      "Never miss a follow-up! Keep track of all your lead interactions and schedule follow-up reminders to ensure no opportunity slips through.",
    targetPath: "/super-user/follow-ups",
    action: "View Follow-ups",
    icon: "📅",
  },
  {
    id: 4,
    title: "View Analytics",
    description:
      "Get insights into your lead generation performance. Track conversion rates, lead sources, and other important metrics to optimize your strategy.",
    targetPath: "/super-user/summary",
    action: "See Analytics",
    icon: "📈",
  },
  {
    id: 5,
    title: "Customize Settings",
    description:
      "Configure your company profile, notification preferences, and integrate with your favorite CRM tools to streamline your workflow.",
    targetPath: "/super-user/settings",
    action: "Open Settings",
    icon: "⚙️",
  },
  {
    id: 6,
    title: "You're All Set! 🚀",
    description:
      "You're now ready to start managing your leads like a pro! Explore the dashboard and don't hesitate to reach out if you need any help.",
    icon: "✨",
  },
];

export default function OnboardingTour() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if user has interacted

  // Wait for component to mount on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check on mount only - don't re-check on route changes
  useEffect(() => {
    if (isMounted && user && !hasInteracted) {
      const isOnSubscriptionPage = pathname?.includes("/subscription");
      const shouldShow =
        user.onboarding?.completed === false && user.onboarding?.skipped === false && user?.userType === "company";

      if (shouldShow) {
        setIsVisible(true);
        setCurrentStep(user.onboarding?.currentStep || 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMounted]); // Only run when user or mounted state changes, NOT pathname

  // Handle subscription page - hide onboarding there
  useEffect(() => {
    if (!hasInteracted) return; // Don't affect initial mount logic

    const isOnSubscriptionPage = pathname?.includes("/subscription");
    if (isOnSubscriptionPage) {
      setIsVisible(false);
    }
  }, [pathname, hasInteracted]);

  const updateOnboardingStatus = async (data: {
    completed?: boolean;
    currentStep?: number;
    completedSteps?: number[];
    skipped?: boolean;
  }) => {
    try {
      setIsLoading(true);
      await updateOnboardingAction(data);
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setHasInteracted(true);
    const nextStep = currentStep + 1;
    const completedSteps = [...(user?.onboarding?.completedSteps || []), currentStep];

    if (nextStep >= onboardingSteps.length) {
      // Complete onboarding
      await updateOnboardingStatus({
        completed: true,
        currentStep: nextStep,
        completedSteps,
      });
      setIsVisible(false);
      return;
    }

    // Navigate if the step has a target path
    const step = onboardingSteps[nextStep];
    if (step.targetPath) {
      router.push(step.targetPath);
    }

    setCurrentStep(nextStep);
    await updateOnboardingStatus({
      currentStep: nextStep,
      completedSteps,
    });
  };

  const handlePrevious = async () => {
    const prevStep = Math.max(0, currentStep - 1);
    setCurrentStep(prevStep);

    const step = onboardingSteps[prevStep];
    if (step.targetPath) {
      router.push(step.targetPath);
    }

    await updateOnboardingStatus({
      currentStep: prevStep,
    });
  };

  const handleSkip = async () => {
    setHasInteracted(true);
    setIsVisible(false);
    setIsLoading(true);
    await updateOnboardingStatus({
      skipped: true,
    });
    setIsLoading(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    router.push("/super-user");
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted || !isVisible || !user) return null;

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <>
      {/* Backdrop */}
      {/* <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" /> */}

      {/* Onboarding Modal */}
      <div className="fixed inset-0 z-[9999] bottom-0 left-0 flex justify-end items-end p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-pri to-sec transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Step Counter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{step.icon}</div>
                <div className="text-sm font-medium text-gray-500">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </div>
              </div>
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  Skip Tour
                </button>
              )}
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-8 bg-gradient-to-l from-pri to-pri/0"
                      : index < currentStep
                      ? "w-2 bg-pri/20"
                      : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              {!isFirstStep ? (
                <button
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="px-6 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  disabled={isLoading}
                  className="px-6 py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  Restart Tour
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-pri to-sec text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : isLastStep ? (
                  "Get Started 🎉"
                ) : (
                  step.action || "Next"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
