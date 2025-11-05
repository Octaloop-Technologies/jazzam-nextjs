"use client";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const isAuthPage = (): boolean => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path.startsWith("/login") || 
         path.startsWith("/auth") || 
         path.startsWith("/register") ||
         path === "/";
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    // Do NOT redirect on 401 here; allow the global interceptor to decide.
    // This prevents unintended navigation loops (e.g., on current-company).
    if (response.status === 401) {
      // Optional: don't clear tokens here; the interceptor/logout flow manages it.
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json().catch(() => ({}));
  return { data, status: response.status };
};

export const apiClient = {
  get: async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T = unknown, B = unknown>(
    url: string,
    body: B
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T = unknown, B = unknown>(
    url: string,
    body: B
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  patch: async <T = unknown, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  delete: async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },
};
