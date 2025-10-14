import React from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { cookies } from "next/headers"; 
import Waitlist from "./Waitlist";

const Hero = async ({ dict }: { dict: Dictionary }) => {
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  return (
    <Waitlist dict={dict} lang={lang} />
  );
};

export default Hero;
