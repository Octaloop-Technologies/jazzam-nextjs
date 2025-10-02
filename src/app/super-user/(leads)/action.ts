"use server";

import { cookies } from "next/headers";

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
}: GetLeadsParams) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || "";
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);
    if (companySize) params.append("companySize", companySize);
    if (assignedTo) params.append("assignedTo", assignedTo);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/all?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// ======================================================
// Get lead stats
// ======================================================
export const getLeadStats = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error("Error fetching lead stats:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  try {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query is required");
    }

    const params = new URLSearchParams();

    params.append("query", query.trim());
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    // Add filters if provided
    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data for searches
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error("Error searching leads:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// ======================================================
// Get lead by id
// ======================================================
export const getLeadById = async ({ id }: { id: string }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error("Error fetching lead by id:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// ======================================================
// Delete lead
// ======================================================
export const deleteLead = async ({ id }: { id: string }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return { success: true, message: responseData.message };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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
    const accessToken = (await cookies()).get("accessToken")?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/onboarding`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to update onboarding status");
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update onboarding error:", error);
    return { success: false, error: "Failed to update onboarding status" };
  }
};

export const restartOnboarding = async () => {
  return updateOnboardingStatus({
    completed: false,
    currentStep: 0,
    completedSteps: [],
    skipped: false,
  });
};
