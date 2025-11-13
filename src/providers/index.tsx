"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import ReduxToastContainer from "@/components/ui/toast/ReduxToastContainer";
import AuthInitializer from "./AuthInitializer";
import { SocketProvider } from "./socketProvider";

// Initialize global API interceptor
// import "@/providers/apiInterceptor";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <AuthInitializer>
        <SocketProvider>
          {children}
        </SocketProvider>
        <ReduxToastContainer />
      </AuthInitializer>
    </ReduxProvider>
  );
}

export default Providers;
