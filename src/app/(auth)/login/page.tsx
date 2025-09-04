import Logo from "@/components/shared/logo/Logo";
import LoginButtons from "@/components/view/(auth)/login/LoginButtons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = async () => {
  return (
    <div className="flex-col-center text-center w-full">
      <Logo />
      <div className="mt-8 p-5 bg-white rounded-3xl max-w-[400px] w-full">
        <div className="capitalize leading-none tracking-wide">
          <h1 className="text-[26px] text-pri font-[600]">Welcome!</h1>
          <p className="mt-1 text-[14px] text-gray-300">Let&apos;s connect your account</p>
        </div>
        <LoginButtons />
      </div>
    </div>
  );
};

export default LoginPage;
