import AuthGuard from "@/components/shared/auth/AuthGuard";
import Logo from "@/components/shared/logo/Logo";
import SignupForm from "@/components/view/(auth)/SignupForm";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your account for authentication",
};

const SignUpPage = async () => {

  const lang = getCurrentLang();

  return (
    <AuthGuard requireAuth={false}>
    <div className="flex-col-center text-center w-full">
        <SignupForm/>
    </div>
    </AuthGuard>
  );
};

export default SignUpPage;
