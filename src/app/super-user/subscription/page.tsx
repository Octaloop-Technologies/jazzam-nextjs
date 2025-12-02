"use client";

import React, { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectUser, updateUserSubscription, fetchCurrentUser } from "@/redux/slices/authSlice";
import { useToast } from "@/lib/hooks/useToast";
import {
  SUBSCRIPTION_PLANS,
  PlanKey,
  getTrialEndDate,
  isPaidPlan,
} from "@/lib/constants/subscriptionPlans";
import tokenStorage from "@/lib/utils/tokenStorage";

export default function SubscriptionSelectionPage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const trialEnds = useMemo(() => {
    if (!user?.trialEndDate) return null;
    return new Date(user.trialEndDate);
  }, [user?.trialEndDate]);

  const { accessToken } = tokenStorage?.getTokens();

  const startTrial = async (plan: Exclude<PlanKey, "free">) => {
    try {
      setLoading(plan);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          subscriptionStatus: "trial",
          subscriptionPlan: plan,
          trialEndDate: getTrialEndDate().toISOString(),
          subscriptionStartDate: new Date().toISOString(), // Mark plan as selected
        }),
      });
      if (!res.ok) throw new Error("Failed to start trial");

      const data = await res.json();

      // Update Redux store with new subscription data
      dispatch(
        updateUserSubscription({
          subscriptionStatus: "trial",
          subscriptionPlan: plan,
          trialEndDate: getTrialEndDate().toISOString(),
          subscriptionStartDate: new Date().toISOString(),
        })
      );

      toast.success("Trial started. Enjoy 14 days free!");

      // Refresh user data to ensure we have the latest information
      dispatch(fetchCurrentUser());

      // Redirect to dashboard - onboarding will start automatically
      window.location.href = "/super-user";
    } catch (e) {
      toast.error((e as Error).message || "Could not start trial");
    } finally {
      setLoading(null);
    }
  };

  const skipToFree = async () => {
    try {
      setLoading("free");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        credentials: "include",
        body: JSON.stringify({
          subscriptionStatus: "active",
          subscriptionPlan: "free",
          subscriptionEndDate: null,
          subscriptionStartDate: new Date().toISOString(), // Mark plan as selected
        }),
      });
      if (!res.ok) throw new Error("Failed to set free plan");

      const data = await res.json();

      // Update Redux store with new subscription data
      dispatch(
        updateUserSubscription({
          subscriptionStatus: "active",
          subscriptionPlan: "free",
          subscriptionEndDate: null,
          subscriptionStartDate: new Date().toISOString(),
        })
      );

      toast.info("Using free plan. You can upgrade anytime.");

      // Refresh user data to ensure we have the latest information
      dispatch(fetchCurrentUser());

      // Redirect to dashboard - onboarding will start automatically
      window.location.href = "/super-user";
    } catch (e) {
      toast.error((e as Error).message || "Could not switch to free plan");
    } finally {
      setLoading(null);
    }
  };

  const checkoutPaid = async (
    plan: Exclude<PlanKey, "free">,
    provider: "stripe" | "payfort" = "stripe"
  ) => {
    try {
      setLoading(plan);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        credentials: "include",
        body: JSON.stringify({ plan, provider }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to start checkout");
      }

      const response = await res.json();
      const data = response.data;

      if (data.provider === "stripe") {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else if (data.provider === "payfort") {
        // Create and submit PayFort form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        Object.entries(data.params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (e) {
      toast.error((e as Error).message || "Could not start checkout");
      setLoading(null);
    }
  };

  return (
    <div className="x-padding max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-pri">Choose your plan</h1>
      <p className="text-gray-400 mt-1">
        14‑day free trial on paid plans. You can skip now and use Free.
      </p>

      {trialEnds && (
        <div className="mt-3 text-sm text-emerald-600">
          Trial ends on {trialEnds.toLocaleDateString()}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {(["free", "starter", "growth", "pro"] as PlanKey[]).map((key) => {
          const plan = SUBSCRIPTION_PLANS[key];
          const isLoading = loading === key;
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-b p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-pri">{plan.name}</h3>
                <div className="mt-2 text-2xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-400">/mo</span>
                </div>
                <ul className="mt-3 text-sm text-gray-500 space-y-1">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {isPaidPlan(key) ? (
                  <>
                    <button
                      disabled={isLoading}
                      onClick={() => startTrial(key as Exclude<PlanKey, "free">)}
                      className={`py-2 rounded-lg border border-gray-b cursor-pointer ${
                        isLoading ? "opacity-50" : "hover:bg-gray-b"
                      }`}
                    >
                      {isLoading ? "Starting trial..." : "Start 14‑day trial"}
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => checkoutPaid(key as Exclude<PlanKey, "free">, "stripe")}
                      className={`py-2 rounded-lg bg-pri cursor-pointer text-white ${
                        isLoading ? "opacity-50" : "hover:opacity-90"
                      }`}
                    >
                      {isLoading ? "Redirecting..." : "Subscribe with Stripe"}
                    </button>
                    {/* <button
                      disabled={isLoading}
                      onClick={() => checkoutPaid(key as Exclude<PlanKey, "free">, "payfort")}
                      className={`py-2 rounded-lg bg-purple-600 text-white ${
                        isLoading ? "opacity-50" : "hover:opacity-90"
                      }`}
                    >
                      {isLoading ? "Redirecting..." : "Subscribe with PayFort"}
                    </button> */}
                  </>
                ) : (
                  <button
                    disabled={isLoading}
                    onClick={skipToFree}
                    className={`py-2 rounded-lg border border-gray-b ${
                      isLoading ? "opacity-50" : "hover:bg-gray-b"
                    }`}
                  >
                    {isLoading ? "Activating..." : "Use Free"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button onClick={skipToFree} className="text-sm text-gray-500 underline cursor-pointer">
          Skip for now and use Free plan
        </button>
      </div>
    </div>
  );
}
