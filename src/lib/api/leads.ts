"use client";
import TokenStorage from "@/lib/utils/tokenStorage";
// ======================================================
// Get all leads (automatically filtered by logged-in company via JWT)
// ======================================================
interface GetLeadsParams {
  page?: number;
  limit?: number;
  status?: string | null | undefined;
  companyIndustry?: string | null | undefined;
  companySize?: string | null | undefined;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: string;
  companyId?: string | null | undefined;
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
  companyId
}: GetLeadsParams) => {
  try {
    // Get token from localStorage
    const { accessToken } = TokenStorage?.getTokens();

    console.log("accessToken:****", accessToken)

    if (!accessToken) {
      console.warn("No access token available in getAllLeads");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    params.append("includeCrmLeads", "true");

    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);
    if (companySize) params.append("companySize", companySize);
    if (assignedTo) params.append("assignedTo", assignedTo);
    if (companyId) params.append("companyId", companyId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/all?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
export const getLeadStats = async (companyId: string | null | undefined) => {
  try {
    console.log("getLeadStats called with companyId:", companyId);
    
    const { accessToken } = TokenStorage.getTokens();
    console.log("getLeadStats - accessToken available:", !!accessToken);

    if (!accessToken) {
      console.warn("No access token available in getLeadStats");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const params = new URLSearchParams();

    if(companyId) params.append("companyId", companyId)


    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/stats?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
  status?: string | null | undefined;
  companyIndustry?: string | null | undefined;
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
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in searchLeads");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

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
          Authorization: `Bearer ${accessToken}`,
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
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in getLeadById");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data on every request
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
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in deleteLead");
      return {
        success: false,
        message: null,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in updateOnboardingStatus");
      return { success: false, error: "Authentication required" };
    }

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

// ======================================================
// Re-qualify lead using BANT
// ======================================================
export const requalifyLeadBANT = async ({ id }: { id: string }) => {
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in requalifyLeadBANT");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}/bant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return { success: true, data: responseData.data, message: responseData.message };
  } catch (error) {
    console.error("Error re-qualifying lead with BANT:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

interface UpdateLeadInterface{
  id?: string
  status?: string, 
  notes?: string, 
  tags?: string, 
  leadScore?: string, 
  qualificationScore?: string, 
  bant?: string
  companyId?: string
}

// 
// ======================================================
// Update lead status
// ======================================================
export const updateLead = async (settings: UpdateLeadInterface) => {
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${settings?.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return { success: true, data: responseData.data, message: responseData.message };
  } catch (error) {
    console.error("Error marking lead as qualified:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}