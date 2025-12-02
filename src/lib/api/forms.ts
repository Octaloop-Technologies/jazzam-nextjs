'use client';

import TokenStorage from "@/lib/utils/tokenStorage";

export const getFormByAccessToken = async (accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/forms/${accessToken}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error fetching form by access token:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getAvailablePlatforms = async (companyId: string | null | undefined) => {
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in getAvailablePlatforms");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/forms/platform/available?companyId=${companyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("djddj")
    return { 
      success: true, 
      data: data?.data
    };
  } catch (error) {
    console.error("Error fetching available platforms:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};