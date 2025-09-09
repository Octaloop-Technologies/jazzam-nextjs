"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  fetchCurrentUser,
} from "@/redux/slices/authSlice";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initialize auth state only once per app session
    if (!hasInitialized.current && !user && !isLoading && !isAuthenticated) {
      hasInitialized.current = true;

      // Silently attempt to fetch user - if tokens are valid, user will be fetched
      // If not, the request will fail silently without exposing token information
      dispatch(fetchCurrentUser()).catch((error) => {
        // Silent failure - don't log auth failures in production for security
        if (process.env.NODE_ENV !== "production") {
          console.log("AuthInitializer: User not authenticated or session expired");
        }

        // If it's an auth error, clear any invalid tokens to prevent retry loops
        if (error?.message?.includes("401") || error?.message?.includes("Unauthorized")) {
          // Clear any potentially invalid tokens from cookies
          document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
      });
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
