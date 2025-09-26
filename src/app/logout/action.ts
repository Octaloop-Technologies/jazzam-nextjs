"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutAndRedirect = async () => {
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
    // Call backend logout API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: cookieString,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear cookies on the frontend side as well
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    if (response.ok) {
      // Server-side redirect to login page
      redirect("/login");
    } else {
      // Even if logout fails, redirect to login
      redirect("/login");
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Even if logout fails, redirect to login
    redirect("/login");
  }
};
