import TokenStorage from "@/lib/utils/tokenStorage";

export const joinWaitlist = async (
  email: string,
  name: string,
  source: string,
  metadata: Record<string, string>
) => {
  const { accessToken } = TokenStorage.getTokens();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/waitlist/join`, {
      method: "POST",
      body: JSON.stringify({ email, name, source, metadata }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    });

    const responseData = await response.json();

    // Handle specific error for email already in waitlist (status 409)
    if (!response.ok) {
      return { success: false, error: responseData.message || "Failed to join waitlist" };
    }

    return { success: true, data: responseData.message || "Successfully joined waitlist" };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error joining waitlist",
    };
  }
};

export const submitFormData = async (formData: Record<string, string>, accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forms/${accessToken}/submit`,
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return { success: false, error: responseData.message || "Failed to submit form data" };
    }

    return {
      success: true,
      message: responseData.message || "Successfully submitted form data",
    };
  } catch (error) {
    console.error("Error submitting form data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error submitting form data",
    };
  }
};

export const getCurrentLang = async () => {
  // This is a client-side function that could return from localStorage or a simple value
  // Since it's just getting language, it doesn't need server call
  return "en"; // or get from localStorage
};

export const changeLang = async (lang: string) => {
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
  return { success: true };
};