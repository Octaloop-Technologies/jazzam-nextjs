"use client";

export const clearAuthCookies = () => {
  // Helper to delete a specific cookie by name
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jazzam.ai;`;
  };

  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};