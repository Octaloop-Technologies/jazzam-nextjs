import { Metadata } from "next";
import PublicForm from "@/components/view/(main-page)/forms/PublicForm";

interface PublicFormPageProps {
  params: Promise<{
    accessToken: string;
  }>;
    searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

// ======================================================
// Meta Data
// ======================================================
export const metadata: Metadata = {
  title: "Lead Generation Form",
  description: "Submit your information to generate leads",
};

const PublicFormPage = async ({ params, searchParams }: PublicFormPageProps) => {
  const { accessToken } = await params;
  const { tenantId } = await searchParams

  return <PublicForm accessToken={accessToken} tenantId={tenantId} />;
};

export default PublicFormPage;
