"use server";

export const getLinkedinProfile = async (linkedinUrl: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lead/create`, {
      method: "POST",
      body: JSON.stringify({ linkedinProfileUrl: linkedinUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    // Handle specific error for linkedin profile (status 409)
    if (!response.ok) {
      return { success: false, error: responseData.message || "Failed to get linkedin profile" };
    }

    return { success: true, message: responseData.message || "Successfully got linkedin profile" };
  } catch (error) {
    console.error("Error getting linkedin profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error getting linkedin profile",
    };
  }
};
