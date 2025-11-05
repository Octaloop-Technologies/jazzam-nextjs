"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ReactNode } from "react";

interface ProtectedRoutesProps {
    children: ReactNode;
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
    const { isAuthenticated, isLoading, setTokens, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 1) Capture tokens from URL first (after OAuth redirect)
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            const accessToken = url.searchParams.get("accessToken");
            const refreshToken = url.searchParams.get("refreshToken");

            if (accessToken && refreshToken) {
                try {
                    // Persist tokens so subsequent checks see them
                    setTokens(accessToken, refreshToken);

                    // Clean sensitive params from the address bar
                    url.searchParams.delete("accessToken");
                    url.searchParams.delete("refreshToken");
                    window.history.replaceState({}, document.title, url.toString());

                    // Re-evaluate auth with the stored tokens
                    checkAuth();
                    return; // skip redirect check this tick
                } catch (e) {
                    // If storing fails, allow normal flow below
                    console.error("ProtectedRoutes: failed to persist tokens", e);
                }
            }
        }

        // 2) Normal guard behavior once loading is done and no tokens in URL
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router, setTokens, checkAuth]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null
}