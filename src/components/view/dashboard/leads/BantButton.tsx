"use client";

import { QualifySvg } from "@/components/svgs/LeadsAnalysisSvgs";
import { useToast } from "@/lib/hooks/useToast";
import { requalifyLeadBANT } from "@/lib/api/leads";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BantButtonProps {
  leadId: string;
}

const BantButton = ({ leadId }: BantButtonProps) => {
  const { success, error } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Reset loading state when transition completes
  useEffect(() => {
    if (!isPending && isLoading) {
      setIsLoading(false);
    }
  }, [isPending, isLoading]);

  const handleRequalify = async () => {
    if (isLoading || isPending || isOnCooldown) return;

    try {
      setIsLoading(true);
      setIsOnCooldown(true);

      // Set 2-second cooldown
      setTimeout(() => {
        setIsOnCooldown(false);
      }, 5000);

      // Call the BANT re-qualification API
      const result = await requalifyLeadBANT({ id: leadId });

      if (result.success) {
        // Show success message with BANT score
        const bantScore = result.data?.lead?.bant?.totalScore || result.data?.lead?.leadScore;
        const category = result.data?.lead?.bant?.category || result.data?.lead?.status;

        if (bantScore && category) {
          success(`Lead re-qualified! Score: ${bantScore}/100 (${category.toUpperCase()})`);
        } else {
          success("Lead re-qualified successfully!");
        }

        // Refresh the page to show updated BANT data
        // The revalidatePath in the server action ensures fresh data
        startTransition(() => {
          router.refresh();
        });
      } else {
        error(result.error || "Failed to re-qualify lead");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error re-qualifying lead:", err);
      error("An error occurred while re-qualifying the lead");
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isPending || isOnCooldown;

  return (
    <button
      onClick={handleRequalify}
      disabled={isDisabled}
      className={`text-[12px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative group flex-center gap-1 border border-gray-b rounded-lg px-2 py-1 
        ${isDisabled ? "" : "text-cold gray-hover"}`}
      title={isOnCooldown ? "Please wait 5 seconds..." : "Re-qualify lead using BANT"}
    >
      Re-qualify
      {isDisabled ? (
        <div className="flex items-center gap-2 size-5">
          <svg
            className="animate-spin h-5 w-5 text-cold"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-20"
            />
            <path
              d="M12 2
                 a10 10 0 0 1 10 10"
              stroke="#0FB981"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-[dash_1.5s_ease-in-out_infinite]"
            />
            <style>
              {`
                @keyframes dash {
                  0% {
                    stroke-dasharray: 1, 150;
                    stroke-dashoffset: 0;
                  }
                  50% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -35;
                  }
                  100% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -124;
                  }
                }
              `}
            </style>
          </svg>
        </div>
      ) : (
        <QualifySvg />
      )}
      {/* Tooltip - only show when not disabled */}
      {!isDisabled && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          Re-qualify with AI
        </span>
      )}
    </button>
  );
};

export default BantButton;
