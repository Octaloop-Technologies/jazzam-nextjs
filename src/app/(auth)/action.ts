"use server";

import { API_URLS } from "@/lib/constants/apiEndpoints";

// ==============================================================
// Login With Google
// ==============================================================
export const loginWithGoogle = async () => {
  try {
    const url = `${API_URLS.BASE_URL}/users/auth/google`;
    console.log("Login With Google", url);

    const response = await fetch(url, {
      method: "GET",
    });
    console.log("Response", response);

    const data = await response.json();
    console.log(data);
    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to login with Google" };
  }
};
