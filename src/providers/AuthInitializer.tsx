"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  fetchCurrentUser,
} from "@/redux/slices/authSlice";
import { usePathname } from "next/navigation";


interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const hasInitialized = useRef(false);
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/login") || 
  pathname?.startsWith("/auth") || 
  pathname?.startsWith("/register") ||
  pathname === "/";



  useEffect(() => {
    if (isAuthPage) {
      return;
    }
    if (!hasInitialized.current && !user && !isLoading && !isAuthenticated) {
      hasInitialized.current = true;

      // Attempt to fetch user
      dispatch(fetchCurrentUser()).catch(() => {
        // Silent failure - don't log auth failures in production for security
        if (process.env.NODE_ENV !== "production") {
          console.log("AuthInitializer: User not authenticated or session expired");
        }
      });
    }
  }, [dispatch, user, isLoading, isAuthenticated, isAuthPage, pathname]);

  return <>{children}</>;
};

export default AuthInitializer;
