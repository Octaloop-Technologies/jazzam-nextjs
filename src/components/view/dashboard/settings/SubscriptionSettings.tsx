"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectUser, updateUserSubscription, fetchCurrentUser } from "@/redux/slices/authSlice";
import { useToast } from "@/lib/hooks/useToast";
import { useRouter } from "next/navigation";
import {
  SUBSCRIPTION_PLANS,
  PlanKey,
  getTrialDaysRemaining,
} from "@/lib/constants/subscriptionPlans";

interface Bill {
  month: string;
  status: string;
  amount: number;
}

const SubscriptionSettings = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [billingData, setBilingData] = useState<Bill[]>([]);

  const currentPlan = (user?.subscriptionPlan || "free") as PlanKey;
  const subscriptionStatus = user?.subscriptionStatus || "active";
  const trialEndDate = user?.trialEndDate ? new Date(user.trialEndDate) : null;

  const isOnTrial = useMemo(() => {
    return subscriptionStatus === "trial" && trialEndDate && trialEndDate > new Date();
  }, [subscriptionStatus, trialEndDate]);

  const daysRemaining = useMemo(() => {
    if (!isOnTrial || !trialEndDate) return null;
    return getTrialDaysRemaining(trialEndDate);
  }, [isOnTrial, trialEndDate]);

  const handleChangePlan = () => {
    setIsChanging(true);
    router.push("/super-user/subscription");
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subscriptionStatus: "cancelled",
          subscriptionPlan: "free",
        }),
      });

      if (!res.ok) throw new Error("Failed to cancel subscription");

      const data = await res.json();

      // Update Redux store with new subscription data
      dispatch(
        updateUserSubscription({
          subscriptionStatus: "cancelled",
          subscriptionPlan: "free",
          subscriptionEndDate: null,
        })
      );

      toast.success("Subscription cancelled. Switched to Free plan.");

      // Refresh user data to ensure we have the latest information
      dispatch(fetchCurrentUser());
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const plan = SUBSCRIPTION_PLANS[currentPlan];

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map(c => c.split("="))
    );
    console.log("cookies:*******", cookies.accessToken)
    const fetchBillingHistory = async() => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/billing/${user?._id}/billing-history`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.accessToken}`,
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log("data***********", data.data)
          setBilingData(data?.data)
        }
      } catch (error) {
        console.log("error******", error)
        console.error("unable to get billing history")
      }
    }
    fetchBillingHistory()
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {/* Current Plan Card */}
      <div className="p-5 border border-gray-b rounded-2xl">
        <h2 className="text-[16px] font-[500] text-sec mb-3">Current Plan</h2>
        <div className={`p-4 rounded-xl ${plan.color}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {plan.price}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
            </div>
            {isOnTrial && (
              <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                Trial: {daysRemaining} days left
              </div>
            )}
          </div>
          <ul className="space-y-1.5 text-sm text-gray-700">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage Stats */}
      {user?.usageStats && (
        <div className="p-5 border border-gray-b rounded-2xl">
          <h2 className="text-[16px] font-[500] text-sec mb-3">Usage This Month</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pri">{user.usageStats.leadsThisMonth}</div>
              <div className="text-xs text-gray-400 mt-1">Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pri">{user.usageStats.formsCreated}</div>
              <div className="text-xs text-gray-400 mt-1">Forms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pri">{user.usageStats.emailsSent}</div>
              <div className="text-xs text-gray-400 mt-1">Emails</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info */}
      {user?.paymentMethod && user.paymentMethod !== "none" && (
        <div className="p-5 border border-gray-b rounded-2xl">
          <h2 className="text-[16px] font-[500] text-sec mb-3">Payment Method</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{user.paymentMethod}</p>
                {user.paymentDetails?.lastPaymentDate && (
                  <p className="text-xs text-gray-400">
                    Last payment:{" "}
                    {new Date(user.paymentDetails.lastPaymentDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {user.paymentDetails?.nextPaymentDate && (
              <div className="text-right">
                <p className="text-xs text-gray-400">Next billing</p>
                <p className="text-sm font-medium">
                  {new Date(user.paymentDetails.nextPaymentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-5 border border-gray-b rounded-2xl">
        <h2 className="text-[16px] font-[500] text-sec mb-3">Manage Subscription</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleChangePlan}
            disabled={isChanging}
            className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${
              isChanging
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pri text-white hover:opacity-90"
            }`}
          >
            {isChanging ? "Redirecting..." : "Change Plan"}
          </button>

          {currentPlan !== "free" && (
            <button
              onClick={handleCancelSubscription}
              className="w-full px-4 py-3 text-danger border border-danger rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Subscription
            </button>
          )}

          {isOnTrial && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Trial Period:</strong> Your trial ends on{" "}
                {trialEndDate?.toLocaleDateString()}. After that, you&apos;ll be switched to the
                Free plan unless you subscribe.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Billing History (Placeholder) */}
      <div className="p-5 border border-gray-b rounded-2xl">
        <h2 className="text-[16px] font-[500] text-sec mb-3">Billing History</h2>
        <div className="text-center py-8 text-gray-400 text-sm">
          {currentPlan === "free"
            ? "No billing history on free plan"
            : <>
              <table className="w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
              {billingData?.map((bill, i) => (
                <tr className="" key={i}>
                    <th className="mx-4" key={i}>{i+1}</th>
                    <td key={bill?.month}>{new Date(bill.month).toDateString()}</td>
                    <td key={bill?.amount}>{bill?.amount}</td>
                    <td key={bill?.status}>{bill?.status}</td>
                  </tr>
              ))}
                </tbody>
              </table>

            </>}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
