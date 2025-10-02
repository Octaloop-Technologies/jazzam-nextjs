import { Metadata } from "next";
import FormsDashboard from "@/components/view/dashboard/forms/FormsDashboard";

// ======================================================
// Meta Data
// ======================================================
export const metadata: Metadata = {
  title: "Forms",
  description: "Manage your lead generation forms",
};

const FormsPage = () => {
  return (
    <section>
      <FormsDashboard />
    </section>
  );
};

export default FormsPage;
