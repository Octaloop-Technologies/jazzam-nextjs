"use server";

import { cookies } from "next/headers";

export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("Logout response:", data);

    if (response.ok) {
      // Clear cookies on the server side as well
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
