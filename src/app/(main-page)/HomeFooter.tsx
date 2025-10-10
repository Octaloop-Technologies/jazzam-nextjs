import Logo from "@/components/shared/logo/Logo";
import { Dictionary } from "@/lib/i18n/getDictionary";
import React from "react";

const HomeFooter = ({ dict }: { dict: Dictionary }) => {
  return (
    <div className="bg-[#181818] py-10">
      <div className="home-wrapper">
        <footer className="flex-col-center gap-[30px] text-center  ">
          <Logo titleClassName="text-white" />

          <p className="text-[14px] font-[300] leading-[2] max-w-[60%] text-white/80 max-sm:max-w-[80%] max-xs:text-[12px] max-xs:max-w-full">
            {dict?.home?.footer?.title}
          </p>
          {/* 
          <p className="w-full py-[15px] text-[14px] opacity-[0.75] font-[500] text-white border-t border-gray-b/20">
            © {new Date().getFullYear()} | octaloop.io {dict?.home?.footer?.copyright}
          </p> */}
        </footer>
      </div>
    </div>
  );
};

export default HomeFooter;
