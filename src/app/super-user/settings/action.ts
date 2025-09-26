"use server";

import { cookies } from "next/headers";

export const logoutUserAction = async () => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (process.env.NODE_ENV === "development") {
      console.log("Logout token found:", token ? "Yes" : "No");
      console.log("Token length:", token?.length || 0);
    }

    if (!token) {
      console.warn("No access token found for logout");
      return { success: false, error: "No authentication token found" };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
      method: "POST",
      credentials: "include",
      cache: "no-store", // Prevent caching of logout request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Logout response:", response);
    }

    const data = await response.json();

    if (response.ok) {
      // Clear cookies on server side with proper options
      const cookieStore = await cookies();

      // Clear cookies with explicit options to match backend clearing
      cookieStore.set("accessToken", "", {
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      cookieStore.set("refreshToken", "", {
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return { success: true, message: data.message || "Logged out successfully" };
    } else {
      return { success: false, error: data.message || "Something went wrong while logging out" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong while logging out",
    };
  }
};
