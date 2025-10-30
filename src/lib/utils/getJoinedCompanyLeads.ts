// ======================================================
// Get company ID from localStorage
// ======================================================
const getCompanyId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    const joinedCompany = localStorage.getItem('joinedCompany');
    if (joinedCompany) {
      const companyData = JSON.parse(joinedCompany);
      console.log('Company Data from localStorage:', companyData);
      return companyData._id || '';
    }
  } catch (error) {
    console.error('Error getting company ID from localStorage:', error);
  }
  
  return '';
};

export const getCompany = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  const joinedCompany = localStorage.getItem('joinedCompany');  
  return joinedCompany ? JSON.parse(joinedCompany) : null;
}

// ======================================================
// Get all leads (automatically filtered by logged-in company via company ID)
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
  accessToken?: string
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
  accessToken
}: GetLeadsParams) => {
  try {
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    params.append("companyId", companyId); // Add company ID to params

    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);
    if (companySize) params.append("companySize", companySize);
    if (assignedTo) params.append("assignedTo", assignedTo);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/all?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
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
export const getLeadStats = async (accessToken: string) => {
  try {
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/stats?companyId=${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
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
// Search leads (automatically filtered by logged-in company via company ID)
// ======================================================
interface SearchLeadsParams {
  query: string;
  page?: number;
  limit?: number;
  status?: string;
  companyIndustry?: string;
  sortBy?: string;
  sortOrder?: string;
  accessToken?: string;
}

export const searchLeads = async ({
  query,
  page = 1,
  limit = 10,
  status,
  companyIndustry,
  sortBy = "createdAt",
  sortOrder = "desc",
  accessToken
}: SearchLeadsParams) => {
  try {
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
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
    params.append("companyId", companyId);

    // Add filters if provided
    if (status) params.append("status", status);
    if (companyIndustry) params.append("companyIndustry", companyIndustry);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/leads/search?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
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
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}?companyId=${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
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
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}?companyId=${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
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
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/onboarding`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
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
  const { revalidatePath } = await import("next/cache");
  try {
    const companyId = getCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found in localStorage");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}/bant?companyId=${companyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    // Revalidate the lead detail page and leads list to show updated data
    revalidatePath(`/super-user/leads/${id}`);
    revalidatePath("/super-user");

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