import React from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";
import Waitlist from "./Waitlist";

const Hero = ({ dict }: { dict: Dictionary }) => {
  
  return (
    <Waitlist dict={dict} />
  );
};

export default Hero;
