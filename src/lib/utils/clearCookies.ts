"use client";

export const clearAuthCookies = () => {
  // Helper to delete a specific cookie by name
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  };

  deleteCookie("accessToken");
  deleteCookie("refereshToken");
};