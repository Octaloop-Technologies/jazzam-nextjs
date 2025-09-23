"use server";

import { cookies } from "next/headers";

// ======================================================
// Get all leads
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/lead/all?${params.toString()}`,
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lead/stats`, {
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
// Search leads
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/lead/search?${params.toString()}`,
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lead/${id}`, {
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
    console.log(responseData)
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
