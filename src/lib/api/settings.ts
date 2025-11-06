import TokenStorage from "@/lib/utils/tokenStorage";

export const logoutUserAction = async () => {
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in logoutUserAction");
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    // Clear localStorage tokens
    TokenStorage.clearTokens();

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error logging out:", error);
    // Clear tokens anyway on logout attempt
    TokenStorage.clearTokens();
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateCompanySettings = async (settings: any) => {
  try {
    const { accessToken } = TokenStorage.getTokens();

    if (!accessToken) {
      console.warn("No access token available in updateCompanySettings");
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/settings`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating company settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};