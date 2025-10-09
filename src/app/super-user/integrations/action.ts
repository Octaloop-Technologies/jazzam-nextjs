"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || "";
}

export async function getCRMProviders() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/crm-integration/providers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getCRMIntegration() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/crm-integration`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function initCRMOAuth(provider: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/crm-integration/oauth/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider }),
  });
  return response.json();
}

export async function disconnectCRM(integrationId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/crm-integration/${integrationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function testCRMConnection(integrationId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/crm-integration/${integrationId}/test-connection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
