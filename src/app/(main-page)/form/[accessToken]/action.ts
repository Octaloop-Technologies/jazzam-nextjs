"use server";

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
