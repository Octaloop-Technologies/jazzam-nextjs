const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const MAILBOX_API = `${BASE_URL}/mailbox`;
import TokenStorage from "@/lib/utils/tokenStorage";


// Helper function to get auth token from localStorage or cookies
const getAuthToken = () =>  { return TokenStorage.getTokens().accessToken; };

// Helper function for fetch requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getMailboxProviders = async () => {
  return {
    success: true,
    data: {
      data: [
        {
          id: "gmail",
          name: "Gmail",
          description: "Connect your Gmail account",
          icon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=64",
          requiresOAuth: true,
        },
        {
          id: "outlook",
          name: "Outlook",
          description: "Connect your Microsoft Outlook account",
          icon: "https://outlook.live.com/favicon.ico",
          requiresOAuth: true,
        },
        {
          id: "yahoo",
          name: "Yahoo Mail",
          description: "Connect your Yahoo Mail with app password",
          icon: "https://www.yahoo.com/favicon.ico",
          requiresOAuth: false,
        },
      ],
    },
  };
};

export const getMailboxIntegrations = async () => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/list`, {
      method: 'GET',
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch mailbox integrations");
  }
};

export const initMailboxOAuth = async (provider: string) => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/connect/${provider}`, {
      method: 'GET',
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to initiate OAuth");
  }
};

export const connectYahooMailbox = async (payload: { email: string; appPassword: string }) => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/connect/yahoo`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect Yahoo mailbox");
  }
};

export const disconnectMailbox = async (mailboxId: string) => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/${mailboxId}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to disconnect mailbox");
  }
};

export const setDefaultMailbox = async (mailboxId: string) => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/set-default/${mailboxId}`, {
      method: 'POST',
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to set default mailbox");
  }
};

export const toggleMailboxStatus = async (mailboxId: string) => {
  try {
    const data = await fetchWithAuth(`${MAILBOX_API}/${mailboxId}/toggle`, {
      method: 'POST',
    });
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to toggle mailbox status");
  }
};