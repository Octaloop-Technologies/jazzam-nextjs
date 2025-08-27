"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "../contexts/ToastContext";
import ToastContainer from "@/components/ui/toast/ToastContainer";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </ReduxProvider>
  );
}

export default Providers;
