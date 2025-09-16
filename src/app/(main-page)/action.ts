"use server";

import { cookies } from "next/headers";

// =============================================================
// Join Waitlist
// =============================================================
export const joinWaitlist = async (
  email: string,
  name: string,
  source: string,
  metadata: Record<string, string>
) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/waitlist/join`, {
      method: "POST",
      body: JSON.stringify({ email, name, source, metadata }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    // Handle specific error for email already in waitlist (status 409)
    if (!response.ok) {
      return { success: false, error: responseData.message || "Failed to join waitlist" };
    }

    return { success: true, data: responseData.message || "Successfully joined waitlist" };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error joining waitlist",
    };
  }
};
