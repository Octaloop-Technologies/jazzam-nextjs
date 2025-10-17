"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==============================================================
// Login With Google
// ==============================================================
export const loginWithGoogle = async () => {
  // Redirect to backend Google OAuth endpoint
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/google`;
  console.log("google auth url:", )
  redirect(googleAuthUrl);
};

// ==============================================================
// Login With Zoho CRM
// ==============================================================
export const loginWithZoho = async () => {
  // Redirect to backend Zoho CRM OAuth endpoint
  const zohoAuthUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/zoho`;
  redirect(zohoAuthUrl);
};

// ==============================================================
// Get Current User - Server Function
// ==============================================================
export const getCurrentUser = async () => {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    console.log("accessToken", accessToken)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/current-company`,
      {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", // Ensure fresh data
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.data };
    } else {
      // Don't log 401 errors as they're expected when not authenticated
      if (response.status !== 401) {
        console.error("Get current user error:", response.status, response.statusText);
      }
      return { success: false, user: null };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    // Only log unexpected errors, not timeout or network errors from unauthenticated state
    if (error instanceof Error && !error.name.includes("Abort")) {
      console.error("Get current user error:", error);
    }
    return { success: false, user: null };
  }
};
