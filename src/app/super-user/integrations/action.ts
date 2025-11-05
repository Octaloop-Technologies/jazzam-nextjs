"use client";

import { apiClient } from "@/lib/utils/apiClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


// async function getAuthToken() {
//   const cookieStore = await cookies();
//   return cookieStore.get("accessToken")?.value || "";
// }

export async function getCRMProviders() {
  const { data } = await apiClient.get(`${API_BASE_URL}/crm-integration/providers`);
  return data;
}


export async function getCRMIntegration() {
  const { data } = await apiClient.get(`${API_BASE_URL}/crm-integration`);
  return data;
}

export async function initCRMOAuth(provider: string) {
  const { data } = await apiClient.post(`${API_BASE_URL}/crm-integration/oauth/init`, { provider });
  return data;
}

export async function disconnectCRM(integrationId: string) {
  const { data } = await apiClient.delete(`${API_BASE_URL}/crm-integration/${integrationId}`);
  return data;
}

export async function testCRMConnection(integrationId: string) {
  const { data } = await apiClient.post(
    `${API_BASE_URL}/crm-integration/${integrationId}/test-connection`,
    {}
  );
  return data;
}
