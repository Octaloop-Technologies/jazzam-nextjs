// ======================================================
// Meta Data

import OnboardingTour from "@/components/view/dashboard/leads/OnboardingTour";
import { Metadata } from "next";

// ======================================================
export const metadata: Metadata = {
  title: "Leads",
  description: "Leads page",
};


const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
  {children}
  <OnboardingTour />
  </>;
};

export default Layout;
