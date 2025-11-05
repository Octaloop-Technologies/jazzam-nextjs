"use client";

import { apiClient } from "@/lib/utils/apiClient";

// =============================================================
// Join Waitlist
// =============================================================
export const joinWaitlist = async (
  email: string,
  name: string,
  source: string,
  metadata: Record<string, string>
) => {
  try {
    const { data } = await apiClient.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/waitlist/join`,
      { email, name, source, metadata }
    );
    return { success: true, data: (data as any)?.message || "Successfully joined waitlist" };
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Failed to join waitlist" };
  }
};
