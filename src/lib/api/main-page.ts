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

export const getCurrentLang = () => {
  // Read from localStorage first, fallback to cookie, then default to 'en'
  if (typeof window !== "undefined") {
    try {
      const localLang = localStorage.getItem("lang");
      if (localLang && ["ar", "en"].includes(localLang)) {
        return localLang;
      }
    } catch {}
  }
  
  // Fallback to cookie (for SSR)
  if (typeof document !== "undefined") {
    const cookieMatch = document.cookie.match(/lang=([^;]+)/);
    if (cookieMatch && ["ar", "en"].includes(cookieMatch[0])) {
      return cookieMatch[0];
    }
  }
  
  // return "en";
  // Default to Arabic and persist to both localStorage and cookie for consistency
  const defaultLang = "ar";
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("lang", defaultLang);
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `lang=${defaultLang}; Path=/; SameSite=Lax; Expires=${expires.toUTCString()}`;
    } catch (e) {
      console.error("Failed to persist default language:", e);
    }
  }
  return defaultLang;
};

export const changeLangNoReload = async (lang: string) => {
  if (typeof window !== "undefined") {
    try {
      // Save to localStorage
      localStorage.setItem("lang", lang);
      
      // Also save to cookie for SSR consistency
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `lang=${lang}; Path=/; SameSite=Lax; Expires=${expires.toUTCString()}`;
      
      // Note: I18n context update is handled by the component using useI18n hook
    } catch (error) {
      console.error("Error changing language:", error);
    }
  }
};