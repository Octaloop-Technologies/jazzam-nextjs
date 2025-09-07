"use server";

interface GetLeadsParams {
  token: string;
  page?: number;
  limit?: number;
  status?: string;
  industry?: string;
  source?: string;
  companySize?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: string;
  isActive?: boolean;
}

export const getAllLeads = async ({
  token,
  page = 1,
  limit = 10,
  status,
  industry,
  source,
  companySize,
  assignedTo,
  sortBy = "createdAt",
  sortOrder = "desc",
  isActive = true,
}: GetLeadsParams) => {
  try {
    const params = new URLSearchParams();

    params.append("page", (page - 1).toString()); // Convert to 0-based for backend
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    params.append("isActive", isActive.toString());

    if (status) params.append("status", status);
    if (industry) params.append("industry", industry);
    if (source) params.append("source", source);
    if (companySize) params.append("companySize", companySize);
    if (assignedTo) params.append("assignedTo", assignedTo);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/lead/all?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

export const getLeadStats = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lead/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const searchLeads = async ({
  token,
  query,
  page = 1,
  limit = 10,
  status,
  industry,
  source,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  token: string;
  query: string;
  page?: number;
  limit?: number;
  status?: string;
  industry?: string;
  source?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const params = new URLSearchParams();

    params.append("query", query);
    params.append("page", (page - 1).toString()); // Convert to 0-based for backend
    params.append("limit", limit.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    if (status) params.append("status", status);
    if (industry) params.append("industry", industry);
    if (source) params.append("source", source);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/lead/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
