"use server";

import { cookies } from "next/headers";

export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Build cookie string from available cookies
  const cookieString = [
    token ? `accessToken=${token}` : "",
    refreshToken ? `refreshToken=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: cookieString,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      // Clear cookies on the client side
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong while logging out",
    };
  }
};
