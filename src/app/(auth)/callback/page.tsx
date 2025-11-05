"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = searchParams?.get("accessToken");
  const refreshToken = searchParams?.get("refreshToken");
  const error = searchParams?.get("error");

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.error("OAuth error:", error);
        router.push("/login?error=auth_failed");
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // ✅ Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // ✅ Remove query params for security
          const cleanPath = window.location.pathname;
          window.history.replaceState({}, document.title, cleanPath);

          // ✅ Redirect user to saved path or dashboard
          const redirectPath =
            localStorage.getItem("postLoginRedirect") || "/super-user";
          localStorage.removeItem("postLoginRedirect");

          router.push(redirectPath);
        } catch (err) {
          console.error("Error storing tokens:", err);
          router.push("/login?error=storage_failed");
        }
      }
    };

    handleCallback();
  }, [accessToken, refreshToken, error, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
