"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { ToggleSwitch } from "@/components/ui/toggle";
import { useState } from "react";
import LanguageModal from "@/components/view/dashboard/settings/LanguageModal";
import {
  ProfileSettingsIcon,
  GeneralSettingsIcon,
  logoutIcon,
  trashIcon,
  GoogleIcon,
} from "@/components/view/dashboard/settings/settingPageIcons";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/store";
import { ZohoIcon } from "@/components/svgs/loginButtonSvgs";
import { useToast } from "@/lib/hooks/useToast";

const SettingsPage = () => {
  // ==============================================================
  // States
  // ==============================================================
  const [activeTab, setActiveTab] = useState<"profile" | "general">("profile");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    leadUpdates: false,
    systemMaintenance: false,
    fundraisingUpdates: false,
    weeklySummary: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { success } = useToast();

  // ==============================================================
  // Hooks
  // ==============================================================
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // ==============================================================
  // Logout User - Backend handles cookie clearing (httpOnly cookies)
  // ==============================================================
  const handleLogout = async () => {
    if (typeof window === "undefined" || isLoggingOut) return;

    setIsLoggingOut(true);
    success("Logging out...");

    try {
      // Clear Redux state for immediate UI feedback
      dispatch(logout());

      // Call backend logout API - this will clear httpOnly cookies
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        console.log("Current cookies before logout:", document.cookie);
        console.log("Token found:", token ? "Yes" : "No");

        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
            method: "POST",
            credentials: "include", // Important: include cookies for backend to clear them
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Backend logout response:", response.status, response.ok);

          if (response.ok) {
            // Backend successfully cleared cookies, redirect to login
            console.log("Cookies after backend logout:", document.cookie);
            window.location.href = "/login";
            return;
          }
        }
      } catch (error) {
        console.error("Backend logout error:", error);
      }

      // Fallback: if backend logout fails, try client-side clearing for non-httpOnly cookies
      const clearCookie = (name: string) => {
        const isProduction = process.env.NODE_ENV === "production";
        const domain = isProduction ? "jazzam.ai" : "localhost";
        const secure = isProduction ? "; secure" : "";
        const sameSite = isProduction ? "; samesite=strict" : "; samesite=lax";
        const domainAttr = domain ? `; domain=${domain}` : "";

        // Try clearing with exact domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}${sameSite}${domainAttr}`;

        // Try clearing with subdomain domain
        if (isProduction) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}${sameSite}; domain=.jazzam.ai`;
        }
      };

      clearCookie("accessToken");
      clearCookie("refreshToken");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <h1 className="mt-3.5 text-[32px] font-[500] capitalize">Settings</h1>
      <div className="mt-8 wrapper flex items-start gap-2.5">
        {/* ---------------------------- left ---------------------------- */}
        <div className="w-full max-w-[25%] p-[30px] border border-gray-b rounded-3xl bg-white">
          <div className="flex flex-col gap-2">
            <button
              className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] 
                  ${
                    activeTab === "profile"
                      ? "bg-pri text-white"
                      : "bg-transparent text-gray-200 hover:bg-gray"
                  }`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="flex-center gap-2">
                <ProfileSettingsIcon />
                <h3 className="text-[14px] capitalize">Profile settings</h3>
              </div>
            </button>
            <button
              className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] 
                  ${
                    activeTab === "general"
                      ? "bg-pri text-white"
                      : "bg-transparent text-gray-200 hover:bg-gray"
                  }`}
              onClick={() => setActiveTab("general")}
            >
              <div className="flex-center gap-2">
                <GeneralSettingsIcon />
                <h3 className="text-[14px] capitalize">General settings</h3>
              </div>
            </button>
          </div>
        </div>

        {/* ---------------------------- right ---------------------------- */}
        <div className="w-full max-w-[75%] p-[30px] border border-gray-b rounded-3xl bg-white flex flex-col gap-[18px]">
          <h1 className="text-[16px] font-[500] capitalize border-b border-gray-n/30 pb-1">
            {activeTab === "profile" ? "Profile settings" : "General settings"}
          </h1>
          {/* -- profile -- */}
          {activeTab === "profile" ? (
            <>
              <div className="p-[17px] border border-gray-b rounded-3xl">
                <h2 className="text-[16px] leading-none text-sec font-[500]">Log In</h2>
                <div className="mt-[14px] flex-between">
                  <div className="flex items-center gap-2.5">
                    {user?.provider === "google" ? (
                      <GoogleIcon />
                    ) : user?.provider === "zohocrm" ? (
                      <ZohoIcon size={32} />
                    ) : null}
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[14px] font-[500]">
                        {user?.provider === "google"
                          ? "Google"
                          : user?.provider === "zohocrm"
                          ? "Zoho CRM"
                          : "Account"}
                      </h3>
                      <h3 className="text-[14px] leading-none text-gray-200">
                        {user?.email || "user@example.com"}
                      </h3>
                    </div>
                  </div>
                  <form action={handleLogout}>
                    <button
                      type="submit"
                      disabled={isLoggingOut}
                      className={`w-fit flex gap-1 text-sm transition-colors duration-200 ${
                        isLoggingOut ? "text-gray-400 cursor-not-allowed" : "text-danger gray-hover"
                      }`}
                    >
                      <div>{logoutIcon()}</div>
                      <div>{isLoggingOut ? "Logging out..." : "Logout"}</div>
                    </button>
                  </form>
                </div>
              </div>

              {/* delete account */}
              <div className="flex flex-col gap-2">
                <button className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200">
                  <div>{trashIcon()}</div>
                  <div>Delete Account</div>
                </button>
              </div>
            </>
          ) : (
            // -- general --
            <div className="flex flex-col gap-[14px]">
              <h1 className="text-[14px] text-gray-200">Language</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl flex-between">
                <h2 className="text-[14px] leading-[16px]">English (UK)</h2>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-sec flex items-center gap-2.5"
                >
                  Change language <RightArrowSvg />
                </button>
              </div>
              <h1 className="text-[14px] text-gray-200">Notification preferences</h1>
              <div className="flex flex-col gap-[15px] p-[15px] border border-gray-b rounded-2xl">
                {[
                  {
                    title: "Email Notifications",
                    id: "email-notifications",
                    key: "emailNotifications",
                  },
                  {
                    title: "Lead Updates",
                    id: "lead-updates",
                    key: "leadUpdates",
                  },
                  {
                    title: "System Maintenance",
                    id: "system-maintenance",
                    key: "systemMaintenance",
                  },
                  {
                    title: "Fundraising Challenge Updates",
                    id: "fundraising-updates",
                    key: "fundraisingUpdates",
                  },
                  {
                    title: "Weekly Activity Summary",
                    id: "weekly-summary",
                    key: "weeklySummary",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex-between">
                    <h2 className="text-[14px] leading-[16px]">{item.title}</h2>
                    <ToggleSwitch
                      id={item.id}
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }))
                      }
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <LanguageModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {}} />
    </div>
  );
};

export default SettingsPage;
