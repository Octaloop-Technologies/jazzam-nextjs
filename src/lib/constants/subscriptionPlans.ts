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
  };
}

export const SUBSCRIPTION_PLANS: Record<PlanKey, PlanDetails> = {
  free: {
    name: "Free",
    price: "$0",
    priceValue: 0,
    features: ["100 leads/month", "1 form", "Community support"],
    color: "bg-gray-100",
    limits: {
      leadsPerMonth: 100,
      forms: 1,
    },
  },
  starter: {
    name: "Starter",
    price: "$29",
    priceValue: 29,
    features: ["2,000 leads/month", "5 forms", "Email support"],
    color: "bg-blue-50",
    limits: {
      leadsPerMonth: 2000,
      forms: 5,
    },
  },
  growth: {
    name: "Growth",
    price: "$79",
    priceValue: 79,
    features: ["10,000 leads/month", "25 forms", "Priority support"],
    color: "bg-purple-50",
    limits: {
      leadsPerMonth: 10000,
      forms: 25,
    },
  },
  pro: {
    name: "Pro",
    price: "$199",
    priceValue: 199,
    features: ["Unlimited leads", "Unlimited forms", "SLA & premium support"],
    color: "bg-emerald-50",
    limits: {
      leadsPerMonth: "unlimited",
      forms: "unlimited",
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
