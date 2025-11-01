"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1";

// Helper function to get auth token
const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

// Helper function to make API requests
const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

// Get all forms for the company
export const getAllForms = async () => {
  try {
    const response = await makeApiRequest("/forms/platform");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching forms:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch forms",
    };
  }
};

// Create a platform-specific form
export const createPlatformForm = async (formType: string) => {
  try {
    const response = await makeApiRequest("/forms/platform/create", {
      method: "POST",
      body: JSON.stringify({ formType }),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating form:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create form",
    };
  }
};

// Get available platforms for form creation
export const getAvailablePlatforms = async (companyId: string | null | undefined) => {
  try {
    const response = await makeApiRequest(`/forms/platform/available?companyId=${companyId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching available platforms:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch available platforms",
    };
  }
};

// Get form by access token (for public access)
export const getFormByAccessToken = async (accessToken: string) => {
  try {
    const response = await makeApiRequest(`/forms/${accessToken}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching form:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch form",
    };
  }
};
