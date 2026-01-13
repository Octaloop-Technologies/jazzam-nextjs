import AuthGuard from "@/components/shared/auth/AuthGuard";
import Logo from "@/components/shared/logo/Logo";
import ResetPasswordForm from "@/components/view/(auth)/ResetPasswordForm";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const ForgetPassword = async () => {

  const lang = getCurrentLang();
  const dict = (await getDictionary(lang))?.login;

  return (
    <AuthGuard requireAuth={false}>
    <div className="flex-col-center text-center w-full">
      <Logo />
      <div className="mt-8 p-5 bg-white rounded-3xl max-w-[400px] w-full">

        <ResetPasswordForm dict={dict} />
      </div>
    </div>
    </AuthGuard>
  );
};

export default ForgetPassword;
