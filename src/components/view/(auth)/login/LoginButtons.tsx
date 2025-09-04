"use client";

import { GoogleIcon, ZohoIcon } from "@/components/svgs/loginButtonSvgs";
import React from "react";

const LoginButtons = () => {
  return (
    <div className="mt-5 flex flex-col gap-2.5 text-[14px] font-[500]">
      <LoginButton title="Continue with Google" icon={<GoogleIcon />} />
      <LoginButton title="Continue with Zoho" icon={<ZohoIcon />} />
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
}: {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex-center gap-1 py-[13px] px-1.5 w-full bg-gray border border-gray-b rounded-xl 
                hover:bg-gray-b transition-all duration-200 ease-in-out"
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};
