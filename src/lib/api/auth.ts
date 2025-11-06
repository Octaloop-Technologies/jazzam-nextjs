"use client";
import TokenStorage from "@/lib/utils/tokenStorage";
import { Company } from "@/redux/slices/authSlice";
// ==============================================================
// Login With Google
// ==============================================================
export const loginWithGoogle = async () => {
  // Redirect to backend Google OAuth endpoint
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/google`;
  console.log("google auth url:", googleAuthUrl);
  
  // Use client-side redirect since this is now a client-side function
  window.location.href = googleAuthUrl;
};

// ==============================================================
// Login With Zoho CRM
// ==============================================================
export const loginWithZoho = async () => {
  // Redirect to backend Zoho CRM OAuth endpoint
  const zohoAuthUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/zoho?type=login`;
  
  // Use client-side redirect since this is now a client-side function
  window.location.href = zohoAuthUrl;
};

// Cache to prevent duplicate concurrent requests
let currentUserPromise: Promise<{ success: boolean; user: Company | null; authError?: boolean }> | null = null;

export const getCurrentUser = async (): Promise<{ success: boolean; user: Company | null; authError?: boolean }> => {
  // If there's already a request in progress, return it
  if (currentUserPromise) {
    console.log("getCurrentUser: Returning cached promise");
    return currentUserPromise;
  }

  // Create new promise
  currentUserPromise = (async () => {
    try {
      // Get token from localStorage
      const { accessToken } = TokenStorage.getTokens();

      console.log("Getting current user with token:", !!accessToken, "Token length:", accessToken?.length);

      if (!accessToken) {
        console.log("No access token found in localStorage");
        return { success: false, user: null };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/current-company`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store", // Ensure fresh data
        }
      );

      console.log("Current user API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Current user API response data:", data);
        return { success: true, user: data.data };
      } else {
        const errorData = await response.json().catch(() => null);
        console.log("Current user API error:", response.status, errorData);
        
        // If it's an auth error, return authError flag
        if (response.status === 401 || response.status === 403) {
          console.log("Auth error - tokens might be invalid");
          return { success: false, user: null, authError: true };
        }
        
        return { success: false, user: null };
      }
    } catch (error) {
      console.error("Get current user error:", error);
      return { success: false, user: null };
    } finally {
      // Clear the promise cache after completion
      currentUserPromise = null;
    }
  })();

  return currentUserPromise;
};