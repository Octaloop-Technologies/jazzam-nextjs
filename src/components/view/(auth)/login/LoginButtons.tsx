"use client";

import { GoogleIcon, ZohoIcon } from "@/components/svgs/loginButtonSvgs";
import React, { useState } from "react";
import { loginWithGoogle, loginWithZoho } from "@/app/(auth)/action";
import { useToast } from "@/lib/hooks/useToast";

const LoginButtons = () => {
  const [isLoading, setIsLoading] = useState({ google: false, zoho: false });
  const toast = useToast();
  console.log("Rendering LoginButtons component", process.env.NEXT_PUBLIC_BASE_URL);
  const handleGoogleLogin = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
    toast.info("Redirecting to Google...");
    await loginWithGoogle();
  };

  const handleZohoLogin = async () => {
    setIsLoading((prev) => ({ ...prev, zoho: true }));
    toast.info("Redirecting to Zoho...");
    await loginWithZoho();
  };

  return (
    <div className="mt-5 flex flex-col gap-2.5 text-[14px] font-[500]">
      <LoginButton
        title="Continue with Google"
        icon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        disabled={isLoading.google}
        loading={isLoading.google}
      />
      <LoginButton
        title="Continue with Zoho"
        icon={<ZohoIcon />}
        onClick={handleZohoLogin}
        disabled={isLoading.zoho}
        loading={isLoading.zoho}
      />
    </div>
  );
};

export default LoginButtons;

// ==============================================================================
// ============================| Login Button |==================================
// ==============================================================================
const LoginButton = ({
  title,
  icon,
  onClick,
  disabled = false,
  loading = false,
}: {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-center gap-1 py-[13px] px-1.5 w-full bg-gray border border-gray-b rounded-xl 
                transition-all duration-200 ease-in-out
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-b"}`}
    >
      <div className="flex-center size-6">
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
      </div>
      <span>{loading ? "Redirecting..." : title}</span>
    </button>
  );
};
