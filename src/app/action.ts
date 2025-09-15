"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function changeLang(formData: FormData) {
  const newLang = formData.get("lang");

  // Set the language cookie
  (await cookies()).set("lang", newLang as string, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false, // Allow client-side access if needed
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Redirect to refresh the page with new language
  redirect("/");
}

export async function getCurrentLang() {
  const cookieStore = await cookies();
  return cookieStore.get("lang")?.value || "en";
}
