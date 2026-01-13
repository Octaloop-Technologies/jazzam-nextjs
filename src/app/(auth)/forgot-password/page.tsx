import AuthGuard from "@/components/shared/auth/AuthGuard";
import Logo from "@/components/shared/logo/Logo";
import ForgetPasswordForm from "@/components/view/(auth)/ForgotPassword";
import LoginButtons from "@/components/view/(auth)/login/LoginButtons";
import SignInForm from "@/components/view/(auth)/SignInform";
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
        <div className="capitalize leading-none tracking-wide">
          <h1 className="text-[26px] text-pri font-[600]">{dict?.forgotPassword}</h1>
        </div>

        <ForgetPasswordForm dict={dict} />
      </div>
    </div>
    </AuthGuard>
  );
};

export default ForgetPassword;
