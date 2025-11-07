'use client';

import TokenStorage from "@/lib/utils/tokenStorage";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getAuthToken() {
  const tokens = TokenStorage.getTokens();
  return tokens?.accessToken || "";
}

export const getCRMProviders = async () => {
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/crm-integration/providers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch CRM providers");
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Error fetching CRM providers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching CRM providers",
    };
  }
};

export const getCRMIntegration = async () => {
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/crm-integration`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch CRM integration");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching CRM integration:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching CRM integration",
    };
  }
};

export const initCRMOAuth = async (provider: string) => {
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/crm-integration/oauth/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to initialize CRM OAuth");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error initializing CRM OAuth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error initializing CRM OAuth",
    };
  }
};

export const disconnectCRM = async (integrationId: string) => {
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/crm-integration/${integrationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to disconnect CRM");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error disconnecting CRM:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error disconnecting CRM",
    };
  }
};

export const testCRMConnection = async (integrationId: string) => {
  const token = await getAuthToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/crm-integration/${integrationId}/test-connection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to test CRM connection");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error testing CRM connection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error testing CRM connection",
    };
  }
};
