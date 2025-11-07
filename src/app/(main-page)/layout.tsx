import { getDictionary } from "@/lib/i18n/getDictionary";
import HomeNavbar from "./HomeNavbar";
import HomeFooter from "./HomeFooter";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  // Get language from cookies on server side
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const dict = await getDictionary(lang);

  return (
    <div className="w-full bg-white min-h-dvh flex flex-col">
      <HomeNavbar dict={dict} />
      <main className="flex-1">{children}</main>
      <HomeFooter dict={dict} />
    </div>
  );
};

export default HomeLayout;
