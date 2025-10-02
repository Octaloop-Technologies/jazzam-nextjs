"use server";

import { cookies } from "next/headers";

export const logoutUserAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/logout`, {
      method: "POST",
      credentials: "include",
      cache: "no-store", // Prevent caching of logout request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Logout response:", response);
    }

    const data = await response.json();

    if (response.ok) {
      // Clear cookies on server side as well
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return { success: true, message: data.message || "Logged out successfully" };
    } else {
      return { success: false, message: data.message || "Something went wrong while logging out" };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong while logging out",
    };
  }
};
