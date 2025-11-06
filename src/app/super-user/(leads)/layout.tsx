// ======================================================
// Meta Data

import { Metadata } from "next";

// ======================================================
export const metadata: Metadata = {
  title: "Leads",
  description: "Leads page",
};


const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
