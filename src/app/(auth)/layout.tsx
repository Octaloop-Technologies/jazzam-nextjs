import { LoginBg } from "@/components/svgs/bgSvgs";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-dvh flex-center overflow-hidden">
      <div className="relative z-10 w-full">{children}</div>
      <LoginBg />
      <LayoutDecor />
    </div>
  );
};

export default layout;

// ==============================================================================
// ============================| Layout Design |=================================
// ==============================================================================
const LayoutDecor = () => {
  return (
    <div className="absolute -bottom-[20%] left-0 right-0 w-full h-[281px]">
      <div className="w-full h-full bg-gradient-to-b from-login-from to-login-to opacity-[.66] blur-[100px]" />
    </div>
  );
};
