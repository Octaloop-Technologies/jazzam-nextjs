import { getCurrentLang } from "@/lib/api/main-page";
import Navbar from "./Navbar";
import { languages } from "@/lib/constants/languageConstants";
import OnboardingTour from "@/components/view/dashboard/leads/OnboardingTour";
import AuthGuard from "@/components/shared/auth/AuthGuard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const lang = getCurrentLang()

  return (
    <AuthGuard requireAuth={true}>
    <div className="min-h-dvh flex flex-col gap-6">
      <Navbar languages={languages} key={lang} />
      <main className="x-padding flex-1">{children}</main>
      <OnboardingTour />
    </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
