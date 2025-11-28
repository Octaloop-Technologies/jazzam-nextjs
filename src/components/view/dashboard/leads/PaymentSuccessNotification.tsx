"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";
import { useAppDispatch } from "@/redux/store";
import { fetchCurrentUser } from "@/redux/slices/authSlice";

/**
 * Component to show payment success/failure notifications
 * Checks for payment query params and displays appropriate toast
 */
export default function PaymentSuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const calledRef = useRef(false);
  const [visible, setVisible] = useState(false);

    useEffect(() => {
    const payment = searchParams?.get("payment");
    const sessionId = searchParams?.get("session_id");
    if (payment !== "success" || !sessionId) return;
    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        setVisible(true);
      } catch (err) {
        console.error("Payment confirm error:", err);
      } finally {
        // remove query params so the effect cannot run again
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("payment");
          url.searchParams.delete("session_id");
          // replace state without adding history entry
          router.replace(url.pathname + url.search, { scroll: false });
        } catch (e) {
          // fallback: do nothing
        }
      }
    })();
  }, [searchParams?.toString(), router]);

  if (!visible) return null;

    return (
    <div className="mx-4 my-3 bg-green-600 text-white p-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>🎉</span>
        <div>
          <div className="font-medium">Payment successful!</div>
          <div className="text-sm">Your subscription is now active.</div>
        </div>
      </div>
      <button
        className="opacity-80 hover:opacity-100"
        onClick={() => setVisible(false)}
        aria-label="close"
      >
        ✕
      </button>
    </div>
  );
}
