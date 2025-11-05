"use client";
import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import ReduxToastContainer from "@/components/ui/toast/ReduxToastContainer";
import AuthInitializer from "./AuthInitializer";

// Initialize global API interceptor
import "@/providers/apiInterceptor";
import LocaleInitializer from "./LocaleIntializer";
import TokenInitializer from "./TokenIntializer";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <TokenInitializer />
      <AuthInitializer>
        <LocaleInitializer />
        {children}
        <ReduxToastContainer />
      </AuthInitializer>
    </ReduxProvider>
  );
}

export default Providers;
