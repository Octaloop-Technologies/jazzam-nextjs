"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  fetchCurrentUser,
} from "@/redux/slices/authSlice";
import TokenStorage from "@/lib/utils/tokenStorage";

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
    // Only initialize once when app loads
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      // Only check for existing tokens, don't handle OAuth tokens (AuthGuard does that)
      const hasTokens = TokenStorage.isAuthenticated();
      console.log("AuthInitializer: Has existing tokens:", hasTokens);
      
      if (hasTokens && !isAuthenticated && !isLoading) {
        console.log("AuthInitializer: Fetching user with existing tokens");
        dispatch(fetchCurrentUser()).catch((error) => {
          console.log("AuthInitializer: Failed to fetch user with existing tokens:", error);
        });
      }
    }
  }, []);

  return <>{children}</>
};


export default AuthInitializer;