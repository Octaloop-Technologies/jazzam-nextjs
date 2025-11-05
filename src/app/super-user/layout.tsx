"use client";
import Navbar from "./Navbar";
import { languages } from "@/lib/constants/languageConstants";
import OnboardingTour from "@/components/view/dashboard/leads/OnboardingTour";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import { useLocale } from "@/lib/hooks/useLocale";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useLocale();

  return (
    <div className="min-h-dvh flex flex-col gap-6">
      <ProtectedRoutes>
        <Navbar currentLang={locale} languages={languages} />
        <main className="x-padding flex-1">{children}</main>
        <OnboardingTour />
      </ProtectedRoutes>
    </div>
  );
};

export default DashboardLayout;
