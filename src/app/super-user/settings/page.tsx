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
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout, selectIsLoading, selectUser } from "@/redux/slices/authSlice";
import { useToast } from "@/lib/hooks/useToast";
import { ZohoIcon } from "@/components/svgs/loginButtonSvgs";
import { logoutUserAction } from "./action";

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

  // ==============================================================
  // Hooks
  // ==============================================================
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const { success, error: ToastError } = useToast();

  // ==============================================================
  // Logout User - Using backend logout API
  // ==============================================================
  const handleLogout = async () => {
    if (typeof window === "undefined") return;

    const result = await logoutUserAction();

    if (result.success) {
      dispatch(logout());
      success(result.message || "You have been successfully logged out.");
      window.location.href = "/login";
    } else {
      ToastError(result.error || "Something went wrong while logging out");
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
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className={`w-fit flex gap-1 text-sm transition-colors duration-200 ${
                      isLoading ? "text-gray-400 cursor-not-allowed" : "text-danger gray-hover"
                    }`}
                  >
                    <div>{logoutIcon()}</div>
                    <div>{isLoading ? "Logging out..." : "Logout"}</div>
                  </button>
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
