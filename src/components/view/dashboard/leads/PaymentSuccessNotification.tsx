"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";

/**
 * Component to show payment success/failure notifications
 * Checks for payment query params and displays appropriate toast
 */
export default function PaymentSuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!searchParams) return;

    const payment = searchParams.get("payment");

    if (payment === "success") {
      // Show success message
      toast.success("🎉 Payment successful! Your subscription is now active.");

      // Clean up URL by removing query params
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      router.replace(url.pathname + url.search, { scroll: false });
    } else if (payment === "cancelled") {
      // Show cancelled message
      toast.info("Payment was cancelled. You can try again anytime.");

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      router.replace(url.pathname + url.search, { scroll: false });
    } else if (payment === "failed") {
      // Show failed message
      toast.error("Payment failed. Please try again or contact support if the issue persists.");

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router, toast]);

  return null; // This component doesn't render anything
}
