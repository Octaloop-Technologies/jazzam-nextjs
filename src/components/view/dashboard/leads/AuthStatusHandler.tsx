"use client";

import { useEffect } from "react";
import { useToast } from "@/lib/hooks/useToast";

interface AuthStatusHandlerProps {
  searchParams: {
    error?: string;
    logout?: string;
    login?: string;
  };
}

const AuthStatusHandler: React.FC<AuthStatusHandlerProps> = ({ searchParams }) => {
  const toast = useToast();

  useEffect(() => {
    const { error, logout, login } = searchParams;

    if (error) {
      let errorMessage = "An authentication error occurred. Please try again.";

      switch (error) {
        case "auth_failed":
          errorMessage = "Authentication failed. Please try again.";
          break;
        case "google_auth_failed":
          errorMessage = "Google authentication failed. Please try again.";
          break;
        case "zoho_auth_failed":
          errorMessage = "Zoho authentication failed. Please try again.";
          break;
        case "logout_failed":
          errorMessage = "Logout failed. Please try again.";
          break;
      }

      toast.error(errorMessage);
    } else if (logout === "success") {
      toast.success("You have been successfully logged out.");
    } else if (login === "success") {
      toast.success("Login successful!");
    }

    // Clear URL parameters after showing the toast
    if (error || logout || login) {
      const timer = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        url.searchParams.delete("logout");
        url.searchParams.delete("login");
        window.history.replaceState({}, "", url.toString());
      }, 1000); // Shorter delay since we're using toasts

      return () => clearTimeout(timer);
    }
  }, [searchParams, toast]);

  // This component doesn't render anything - it just handles the side effects
  return null;
};

export default AuthStatusHandler;
