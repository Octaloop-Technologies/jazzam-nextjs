"use client";
import React from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";
import Waitlist from "./Waitlist";
import { useLocale } from "@/lib/hooks/useLocale";

const Hero = ({ dict }: { dict: Dictionary }) => {
  const { locale } = useLocale();
  return <Waitlist dict={dict} lang={locale} />;
};

export default Hero;
