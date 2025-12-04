import AuthGuard from "@/components/shared/auth/AuthGuard";
import Logo from "@/components/shared/logo/Logo";
import LoginButtons from "@/components/view/(auth)/login/LoginButtons";
import SignInForm from "@/components/view/(auth)/SignInform";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = async () => {

  const lang = getCurrentLang();
  const dict = (await getDictionary(lang))?.login;

  return (
    <AuthGuard requireAuth={false}>
    <div className="flex-col-center text-center w-full">
      <Logo />
      <div className="mt-8 p-5 bg-white rounded-3xl max-w-[400px] w-full">
        <div className="capitalize leading-none tracking-wide">
          <h1 className="text-[26px] text-pri font-[600]">{dict?.welcome}</h1>
          <p className="mt-1 text-[14px] text-gray-300">{dict?.letsConnect}</p>
        </div>

        <SignInForm dict={dict} />

        <p className="mt-3 text-[14px] text-gray-600">
          {/* {dict?.noAccount ?? "Don't have an account?"} */}
          {"Don't have an account?"}
          <a href="/signup" className="text-pri font-semibold">
            {/* {dict?.signUp ?? "Sign up"} */}
            {"Sign up"}
          </a>
        </p>

        <label htmlFor="" className="font-semibold">Or</label>

        <LoginButtons dict={dict} />
        <p className="mt-3 text-[12px] text-gray-400">
          {dict?.continueLoginMsg}
        </p>
      </div>
    </div>
    </AuthGuard>
  );
};

export default LoginPage;
