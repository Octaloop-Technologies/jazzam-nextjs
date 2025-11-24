"use client";

import { useEffect, useRef, useState } from "react";
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
  const maxFetchAttempts = 3;
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  useEffect(() => {
    console.log("AuthGuard: useEffect triggered", {
      user: !!user,
      isAuthenticated,
      isLoading,
      requireAuth,
      hasCheckedOAuth: hasCheckedOAuth.current,
      isProcessingOAuth
    });

    const processOAuthTokens = async () => {
      // Check for OAuth tokens in URL
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      console.log("AuthGuard: OAuth tokens from URL - Access:", !!accessToken, "Refresh:", !!refreshToken);

      if (accessToken && refreshToken && !hasCheckedOAuth.current) {
        console.log("AuthGuard: Found OAuth tokens, processing...");
        hasCheckedOAuth.current = true;
        setIsProcessingOAuth(true);

        try {
          // Store tokens
          TokenStorage.setTokens(accessToken, refreshToken);
          
          // Verify tokens are stored
          const storedTokens = TokenStorage.getTokens();
          console.log("AuthGuard: Tokens stored successfully:", { 
            hasAccess: !!storedTokens?.accessToken, 
            hasRefresh: !!storedTokens?.refreshToken 
          });

          // Clean up URL - use a more reliable method
          if (window.history && window.history.replaceState) {
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            console.log("AuthGuard: URL cleaned to:", newUrl);
          }

          // Fetch user data
          if (fetchAttempts.current < maxFetchAttempts) {
            fetchAttempts.current++;
            await dispatch(fetchCurrentUser());
            console.log("AuthGuard: User data fetched successfully after OAuth");
            fetchAttempts.current = 0;
          }
        } catch (error) {
          console.error("AuthGuard: Error during OAuth processing:", error);
          if (fetchAttempts.current >= maxFetchAttempts) {
            console.error("AuthGuard: Max fetch attempts reached during OAuth");
          }
        } finally {
          setIsProcessingOAuth(false);
        }
        
        return true; // OAuth was processed
      }
      
      return false; // No OAuth tokens found
    };

    const checkRegularAuth = () => {
      // Only run regular auth check if we're not processing OAuth
      if (isProcessingOAuth) {
        console.log("AuthGuard: Skipping regular auth check - processing OAuth");
        return;
      }

      const hasTokens = TokenStorage.isAuthenticated();
      console.log("AuthGuard: Regular auth check - hasTokens:", hasTokens);

      if (requireAuth) {
        // If authentication is required
        if (!hasTokens) {
          window.location.href = redirectTo;
          console.log("AuthGuard: No tokens found, user needs to authenticate");
          return;
        }

        // Has tokens but no user data, fetch it
        if (!user && !isLoading && hasTokens) {
          console.log("AuthGuard: Has tokens but no user data, fetching...");
          if (fetchAttempts.current < maxFetchAttempts) {
            fetchAttempts.current++;
            dispatch(fetchCurrentUser()).catch((error) => {
              console.error("AuthGuard: Failed to fetch user data:", error);
              if (fetchAttempts.current >= maxFetchAttempts) {
                console.error("AuthGuard: Max attempts reached in regular auth");
              }
            });
          }
        }
      } else {
        // If authentication should NOT be required (login page)
        if (hasTokens && isAuthenticated) {
          console.log("AuthGuard: User authenticated on non-auth page, redirecting...");
          router.push("/super-user");
          return;
        }
      }
    };

    const initializeAuth = async () => {
      const oauthProcessed = await processOAuthTokens();
      
      // If OAuth was processed, wait for it to complete before regular auth check
      if (!oauthProcessed) {
        checkRegularAuth();
      }
    };

    initializeAuth();
  }, [user, isAuthenticated, isLoading, requireAuth, router, dispatch, isProcessingOAuth]);

  // Show loading spinner while processing OAuth or initial loading
  if (isLoading || isProcessingOAuth) {
    console.log("AuthGuard: Showing loading spinner", { isLoading, isProcessingOAuth });
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
  return <>{children}</>;
};

export default AuthGuard;