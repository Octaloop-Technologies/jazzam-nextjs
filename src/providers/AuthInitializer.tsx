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
    // Simply attempt to fetch current user
    if (!hasInitialized.current && !user && !isLoading && !isAuthenticated) {
      hasInitialized.current = true;

      // Silently attempt to fetch user - if tokens are valid, user will be fetched
      // If not, the request will fail silently without exposing token information
      dispatch(fetchCurrentUser()).catch(() => {
        // Silent failure - don't log auth failures in production for security
        if (process.env.NODE_ENV !== "production") {
          console.log("AuthInitializer: User not authenticated or session expired");
        }
      });
    }
  }, [dispatch, user, isLoading, isAuthenticated]);

  return <>{children}</>;
};

export default AuthInitializer;
