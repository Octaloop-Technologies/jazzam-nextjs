"use client";

import { apiClient } from "@/lib/utils/apiClient";


export const updateCompanySettings = async (settings: {
  autoBANTQualification?: boolean;
  leadNotifications?: boolean;
  language?: string;
}) => {
  try {
    const { data } = await apiClient.patch?.(
      `${process.env.NEXT_PUBLIC_BASE_URL}/companies/settings`,
      { settings } as any
    );
    return { success: true, data: (data as any)?.data, message: "Settings updated successfully" };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to update settings" };
  }
};


export const logoutUserAction = async () => {
  try {
    // Optional: notify backend
    await apiClient.post(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/logout`, {});
  } catch {}
  // Always clear local tokens client-side
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  return { success: true, message: "Logged out successfully" };
};
