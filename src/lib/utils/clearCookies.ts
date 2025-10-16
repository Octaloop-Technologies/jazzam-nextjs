"use client";

export const clearAuthCookies = () => {
  // Helper to delete a specific cookie by name
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; domain=.jazzam.ai; Max-Age=0; path=/;`;
  };

  deleteCookie("accessToken");
  deleteCookie("refereshToken");
};