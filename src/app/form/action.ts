"use server";

// =============================================================
// Create Lead
// =============================================================
export const createLead = async (lead: LeadFormData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lead/create`, {
      method: "POST",
      body: JSON.stringify(lead),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return {
        success: false,
        data: {
          message: result.message || "Failed to Submit Form",
        },
      };
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      data: {
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
};
