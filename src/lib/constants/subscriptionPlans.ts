// Shared subscription plan definitions
export type PlanKey = "free" | "starter" | "growth" | "pro";

export interface PlanDetails {
  name: string;
  price: string;
  priceValue: number;
  features: string[];
  color: string;
  limits: {
    leadsPerMonth: number | "unlimited";
    forms: number | "unlimited";
    channels: number | "unlimited";
  };
}

export const SUBSCRIPTION_PLANS: Record<PlanKey, PlanDetails> = {
  free: {
    name: "Free",
    price: "0 SAR",
    priceValue: 0,
    features: ["Basic features", "Community support"],
    color: "bg-gray-100",
    limits: {
      leadsPerMonth: 100,
      forms: 1,
      channels: 0,
    },
  },
  starter: {
    name: "Starter",
    price: "499 SAR",
    priceValue: 499,
    features: ["One channel", "One user", "Basic reports"],
    color: "bg-blue-50",
    limits: {
      leadsPerMonth: 2000,
      forms: 5,
      channels: 1,
    },
  },
  growth: {
    name: "Growth",
    price: "1499 SAR",
    priceValue: 1499,
    features: ["Multi-channel", "Smart recommendations", "Fast support"],
    color: "bg-purple-50",
    limits: {
      leadsPerMonth: 10000,
      forms: 25,
      channels: "unlimited",
    },
  },
  pro: {
    name: "Pro",
    price: "999 SAR",
    priceValue: 999,
    features: ["Two channels", "Three users", "Insights dashboard", "Basic support"],
    color: "bg-emerald-50",
    limits: {
      leadsPerMonth: 10000,
      forms: 25,
      channels: 2,
    },
  },
};

// Helper function to get plan by key
export const getPlanDetails = (planKey: PlanKey): PlanDetails => {
  return SUBSCRIPTION_PLANS[planKey];
};

// Helper to calculate trial end date (14 days from now)
export const getTrialEndDate = (): Date => {
  return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
};

// Helper to check if plan is paid
export const isPaidPlan = (planKey: PlanKey): boolean => {
  return planKey !== "free";
};

// Helper to format trial days remaining
export const getTrialDaysRemaining = (trialEndDate: Date): number => {
  const diff = trialEndDate.getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Helper to check if plan allows channels
export const canUseChannels = (planKey: PlanKey): boolean => {
  const plan = SUBSCRIPTION_PLANS[planKey];
  return (
    plan.limits.channels === "unlimited" ||
    (typeof plan.limits.channels === "number" && plan.limits.channels > 0)
  );
};

// Helper to get channel limit for a plan
export const getChannelLimit = (planKey: PlanKey): number | "unlimited" => {
  return SUBSCRIPTION_PLANS[planKey].limits.channels;
};

// Helper to check if company can add more channels
export const canAddChannel = (planKey: PlanKey, currentChannels: number): boolean => {
  const limit = getChannelLimit(planKey);
  if (limit === "unlimited") return true;
  return currentChannels < limit;
};
