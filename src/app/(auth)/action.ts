"use server";

import { redirect } from "next/navigation";
import { API_URLS } from "@/lib/constants/apiEndpoints";

// ==============================================================
// Login With Google
// ==============================================================
export const loginWithGoogle = async () => {
  // Redirect to backend Google OAuth endpoint
  const googleAuthUrl = `${API_URLS.BASE_URL}/users/auth/google`;
  redirect(googleAuthUrl);
};

// ==============================================================
// Login With Zoho CRM
// ==============================================================
export const loginWithZoho = async () => {
  // Redirect to backend Zoho CRM OAuth endpoint
  const zohoAuthUrl = `${API_URLS.BASE_URL}/users/auth/zohocrm`;
  redirect(zohoAuthUrl);
};

// ==============================================================
// Logout - Server Action (Returns result for Redux handling)
// ==============================================================
export const logoutUser = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_URLS.BASE_URL}/users/auth/logout`, {
      method: "POST",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { success: true, message: "Successfully logged out" };
    } else {
      return { success: false, message: "Logout failed. Please try again." };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Logout failed. Please try again." };
  }
};

// ==============================================================
// Get Current User - Server Function
// ==============================================================
export const getCurrentUser = async () => {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${API_URLS.BASE_URL}/users/auth/current-user`, {
      method: "GET",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
      signal: controller.signal,
    });

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
