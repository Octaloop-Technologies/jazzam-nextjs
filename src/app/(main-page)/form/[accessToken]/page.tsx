import { Metadata } from "next";
import PublicForm from "@/components/view/(main-page)/forms/PublicForm";

interface PublicFormPageProps {
  params: Promise<{
    accessToken: string;
  }>;
}

// ======================================================
// Meta Data
// ======================================================
export const metadata: Metadata = {
  title: "Lead Generation Form",
  description: "Submit your information to generate leads",
};

const PublicFormPage = async ({ params }: PublicFormPageProps) => {
  const { accessToken } = await params;

  return <PublicForm accessToken={accessToken} />;
};

export default PublicFormPage;
