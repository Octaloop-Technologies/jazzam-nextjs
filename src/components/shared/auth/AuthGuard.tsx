"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  fetchCurrentUser,
} from "@/redux/slices/authSlice";
import TokenStorage from "@/lib/utils/tokenStorage";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const hasCheckedOAuth = useRef(false);
  const fetchAttempts = useRef(0);
  const maxFetchAttempts = 3; // Prevent infinite loops

  useEffect(() => {
    // Only check for OAuth tokens once per component lifecycle

    console.log("AuthGuard: useEffect triggered");
    if (!hasCheckedOAuth.current) {
      console.log("AuthGuard: Checking for OAuth tokens in URL");
      hasCheckedOAuth.current = true;
      
      // Check for OAuth tokens in URL first
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      console.log("AuthGuard: OAuth tokens from URL - Access:", accessToken, "Refresh:", refreshToken);
      
      if (accessToken && refreshToken) {
        console.log("AuthGuard: Found OAuth tokens in URL, storing and fetching user...");
        console.log("AuthGuard: Access token length:", accessToken.length, "Refresh token length:", refreshToken.length);
        
        // Store tokens and fetch user - don't redirect yet
        TokenStorage.setTokens(accessToken, refreshToken);
        
        // Verify tokens are stored
        const storedTokens = TokenStorage?.getTokens();
        console.log("AuthGuard: Tokens stored successfully:", { 
          hasAccess: !!storedTokens.accessToken, 
          hasRefresh: !!storedTokens.refreshToken 
        });
        
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('accessToken');
        newUrl.searchParams.delete('refreshToken');
        window.history.replaceState({}, '', newUrl.toString());

        // Fetch user data with rate limiting
        if (fetchAttempts.current < maxFetchAttempts) {
          fetchAttempts.current++;
          dispatch(fetchCurrentUser()).then(() => {
            console.log("AuthGuard: User data fetched successfully");
            fetchAttempts.current = 0; // Reset on success
          }).catch((error) => {
            console.log("AuthGuard: Failed to fetch user data:", error);
            // Don't clear tokens or redirect - just log the error
            if (fetchAttempts.current >= maxFetchAttempts) {
              console.log("AuthGuard: Max fetch attempts reached, but not clearing tokens");
            }
          });
        }
        return;
      }
    }

    // Rest of the auth logic - only run if we didn't handle OAuth tokens above
    if (hasCheckedOAuth.current) {
      // Check if user has tokens in localStorage
      const hasTokens = TokenStorage.isAuthenticated();
      console.log("AuthGuard: Checking localStorage tokens:", hasTokens);

      if (requireAuth) {
        // If authentication is required
        if (!hasTokens) {
          // No tokens, but don't redirect automatically
          console.log("AuthGuard: No tokens found, but not redirecting automatically");
          return;
        }

        if (!user && !isLoading && hasTokens) {
          // Has tokens but no user data, fetch it
          console.log("AuthGuard: Has tokens but no user data, fetching...");
          if (fetchAttempts.current < maxFetchAttempts) {
            fetchAttempts.current++;
            dispatch(fetchCurrentUser()).catch((error) => {
              console.log("AuthGuard: Failed to fetch user data:", error);
              // Don't clear tokens or redirect - just log the error
              if (fetchAttempts.current >= maxFetchAttempts) {
                console.log("AuthGuard: Max attempts reached, but not clearing tokens");
              }
            });
          }
        }
      } else {
        // If authentication should NOT be required (login page)
        if (hasTokens && isAuthenticated) {
          // User is authenticated, redirect to dashboard
          router.push("/super-user");
          return;
        }
      }
    }
  }, [user, isAuthenticated, isLoading, requireAuth, redirectTo, router, dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log("AuthGuard: Showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If auth is required and user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    console.log("AuthGuard: Auth required but user not authenticated, not rendering");
    return null;
  }

  // If auth is not required but user is authenticated, don't render (will redirect)
  if (!requireAuth && isAuthenticated) {
    console.log("AuthGuard: Auth not required but user authenticated, not rendering");
    return null;
  }

  console.log("AuthGuard: Rendering children");
  return <>{children}</>
};

export default AuthGuard;