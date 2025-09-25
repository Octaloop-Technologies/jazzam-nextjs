"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  fetchCurrentUser,
  logout,
} from "@/redux/slices/authSlice";
import { useToast } from "@/lib/hooks/useToast";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const hasInitialized = useRef(false);
  const toast = useToast();

  useEffect(() => {
    // Set up global logout callback for the interceptor
    if (typeof window !== "undefined") {
      (window as unknown as { dispatchAuthLogout: () => void }).dispatchAuthLogout = () => {
        dispatch(logout());
        toast.error("Your session has expired. Please login again.");
      };
    }

    // Initialize auth state only once per app session
    if (!hasInitialized.current && !user && !isLoading && !isAuthenticated) {
      hasInitialized.current = true;

      // Attempt to fetch user
      dispatch(fetchCurrentUser()).catch((error) => {
        // Silent failure - don't log auth failures in production for security
        if (process.env.NODE_ENV !== "production") {
          console.log("AuthInitializer: User not authenticated or session expired");
        }
      });
    }
  }, [dispatch, toast]);

  return <>{children}</>;
};

export default AuthInitializer;
