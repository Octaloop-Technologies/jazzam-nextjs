import type { Metadata, Viewport } from "next";
import "@/styles/css/globals.css";
import { Providers } from "@/providers/index";
import { I18nProvider } from "@/providers/I18nProvider";
import { ICONS, VIEWPORT } from "@/lib/constants/website";
import { BASE_METADATA } from "@/lib/constants/website";
import { Suspense } from "react";
import NavigationIndicator from "@/components/ui/navigation/NavigationIndicator";
import { Roboto, Tajawal } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  manifest: ICONS.MANIFEST,
  title: {
    default: BASE_METADATA.TITLE,
    template: `%s | ${BASE_METADATA.TITLE}`,
  },
  description: BASE_METADATA.DESCRIPTION,
  icons: {
    icon: ICONS.FAVICON,
    shortcut: ICONS.FAVICON_32X32,
    apple: ICONS.APPLE_TOUCH_ICON,
    other: { rel: "icon", url: ICONS.FAVICON },
  },
};

export const viewport: Viewport = {
  themeColor: VIEWPORT.THEME_COLOR,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Default server render; LocaleInitializer will hydrate from localStorage
  const defaultLang = "en";
  const defaultDict = (await import("../../dictionaries/en.json")).default;

  return (
    <html lang={defaultLang} dir={defaultLang === "en" ? "ltr" : "rtl"}>
      <head>
        <link rel="icon" href={ICONS.FAVICON} sizes="any" />
        <link rel="icon" href={ICONS.FAVICON_32X32} type="image/png" sizes="32x32" />
        <link rel="icon" href={ICONS.FAVICON_16X16} type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href={ICONS.APPLE_TOUCH_ICON} type="image/png" sizes="180x180" />
        <link rel="manifest" href={ICONS.MANIFEST} />
      </head>
      <body className={`${roboto.variable} ${tajawal.variable} antialiased`}>
        <NavigationIndicator />
        <Suspense fallback={null}>
          <I18nProvider lang={defaultLang} dict={defaultDict}>
            <Providers>{children}</Providers>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}