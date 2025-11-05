"use client";

import { apiClient } from "@/lib/utils/apiClient";

// ======================================================
// Get all leads (automatically filtered by logged-in company via JWT)
// ======================================================
interface GetLeadsParams {
  page?: number;
  limit?: number;
  status?: string;
  companyIndustry?: string;
  companySize?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: string;
  companyId?: string;
}

export const getAllLeads = async ({
  page = 1,
  limit = 10,
  status,
  companyIndustry,
  companySize,
  assignedTo,
  sortBy = "createdAt",
  sortOrder = "desc",
  companyId,
}: GetLeadsParams) => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);
    if (companySize) params.append("companySize", companySize);
    if (assignedTo) params.append("assignedTo", assignedTo);
    if (companyId) params.append("companyId", companyId);

    const { data } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/all?${params.toString()}`
    );
    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message ?? "Unknown error" };
  }
};

// ======================================================
// Get lead stats
// ======================================================
export const getLeadStats = async (companyId: string | undefined) => {
  try {
    const { data } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/stats?companyId=${companyId ?? ""}`
    );
    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message ?? "Unknown error" };
  }
};

// ======================================================
// Search leads (automatically filtered by logged-in company via JWT)
// ======================================================
interface SearchLeadsParams {
  query: string;
  page?: number;
  limit?: number;
  status?: string;
  companyIndustry?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const searchLeads = async ({
  query,
  page = 1,
  limit = 10,
  status,
  companyIndustry,
  sortBy = "createdAt",
  sortOrder = "desc",
}: SearchLeadsParams) => {
  try {
    if (!query?.trim()) throw new Error("Search query is required");
    const params = new URLSearchParams();
    params.append("query", query.trim());
    params.append("page", String(page));
    params.append("limit", String(limit));
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);

    const { data } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/search?${params.toString()}`
    );
    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message ?? "Unknown error" };
  }
};


// ======================================================
// Get lead by id
// ======================================================
export const getLeadById = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`
    );
    return { success: true, data: (data as any)?.data };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message ?? "Unknown error" };
  }
};

// ======================================================
// Delete lead
// ======================================================
export const deleteLead = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiClient.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`
    );
    return { success: true, message: (data as any)?.message };
  } catch (error: any) {
    return { success: false, message: null, error: error?.message ?? "Unknown error" };
  }
};


// ======================================================
// Update onboarding status
// ======================================================
export const updateOnboardingStatus = async (data: {
  completed?: boolean;
  currentStep?: number;
  completedSteps?: number[];
  skipped?: boolean;
}) => {
  try {
    const res = await apiClient.patch?.(
      `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/onboarding`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }
    ).then(res => res.data);
    return { success: true, data: (res as any)?.data?.data };
  } catch {
    return { success: false, error: "Failed to update onboarding status" };
  }
};


export const restartOnboarding = () =>
  updateOnboardingStatus({
    completed: false,
    currentStep: 0,
    completedSteps: [],
    skipped: false,
  });


// ======================================================
// Re-qualify lead using BANT
// ======================================================
export const requalifyLeadBANT = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiClient.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}/bant`,
      {}
    );
    return {
      success: true,
      data: (data as any)?.data,
      message: (data as any)?.message,
    };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message ?? "Unknown error" };
  }
};
