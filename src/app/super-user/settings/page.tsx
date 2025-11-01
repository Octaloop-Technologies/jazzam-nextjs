"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { ToggleSwitch } from "@/components/ui/toggle";
import React, { useState, useEffect } from "react";
import LanguageModal from "@/components/view/dashboard/settings/LanguageModal";
import {
  ProfileSettingsIcon,
  GeneralSettingsIcon,
  logoutIcon,
  trashIcon,
  GoogleIcon,
  SubscriptionIcon,
} from "@/components/view/dashboard/settings/settingPageIcons";
import { useAppSelector } from "@/redux/store";
import { fetchCurrentUser, selectUser } from "@/redux/slices/authSlice";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/store";
import { ZohoIcon } from "@/components/svgs/loginButtonSvgs";
import { useToast } from "@/lib/hooks/useToast";
import { logoutUserAction, updateCompanySettings } from "./action";
import { useRouter } from "next/navigation";
import { restartOnboarding } from "../(leads)/action";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useI18n } from "@/providers/I18nProvider";
import { updateUserSettings } from "@/redux/slices/authSlice";
import { clearAuthCookies } from "@/lib/utils/clearCookies";
import Image from "next/image";
import Table from "@/components/ui/table/Table";
import TableHeader from "@/components/ui/table/TableHeader";
import TableCell from "@/components/ui/table/TableCell";
import TableRow from "@/components/ui/table/TableRow";
import { DeleteSvg, ExternalLinkSvg } from "@/components/svgs/LeadsAnalysisSvgs";

const SubscriptionSettings = dynamic(
  () => import("@/components/view/dashboard/settings/SubscriptionSettings"),
  { ssr: false }
);

const SettingsPage = () => {
  // ==============================================================
  // States
  // ==============================================================
  const [activeTab, setActiveTab] = useState<"profile" | "general" | "subscription">("profile");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    leadNotifications: true,
  });
  const [leadSettings, setLeadSettings] = useState({
    autoBANTQualification: false,
    language: "en",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRestartingTour, setIsRestartingTour] = useState(false);
  const { success: ToastSuccess, error: ToastError } = useToast();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  type JoinedCompanyType = {
    _id?: string;
    companyName?: string;
    email?: string;
    logo?: string;
  };
  const [joinedCompany, setJoinedCompnay] = useState<JoinedCompanyType | null>(null);
  const [editName, setEditName] = useState<Boolean>(false);
  const [newCompanyName, setNewCompany] = useState<string>("");

  // ==============================================================
  // Hooks
  // ==============================================================
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const { setLocale: i18nSetLocale } = useI18n();

  // ==============================================================
  // Load user settings on component mount
  // ==============================================================
  useEffect(() => {
    if (user?.settings) {
      const newLeadSettings = {
        autoBANTQualification: user.settings.autoBANTQualification ?? false,
        language: user.settings.language || "en",
      };
      const newNotificationSettings = {
        emailNotifications: user.settings.emailNotifications ?? false,
        leadNotifications: user.settings.leadNotifications ?? true,
      };

      setLeadSettings(newLeadSettings);
      setNotificationSettings(newNotificationSettings);
    }
  }, [user]);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map(c => c.split("="))
    );
    const fetchTeamMembers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/team-members/${user?._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`
        }
      });
      const data = await res.json();
      setTeamMembers(data?.data?.teamMembers);
      console.log("fetchTeamMembers***********888", data);
    }
    const fetchJoinedCompany = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/joined-company/${user?.joinedCompanies}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("data:", data)
        setJoinedCompnay(data?.data);
      }
    }
    fetchTeamMembers();
    fetchJoinedCompany();
  }, [user]);

  console.log("usususu:****", user?.joinedCompanyStatus)



  // ==============================================================
  // Update BANT Setting
  // ==============================================================
  const handleBANTSettingChange = async (checked: boolean) => {
    setLeadSettings((prev) => ({
      ...prev,
      autoBANTQualification: checked,
    }));

    const result = await updateCompanySettings({ autoBANTQualification: checked });

    if (result.success) {
      // Update Redux store
      dispatch(updateUserSettings({ autoBANTQualification: checked }));

      ToastSuccess(
        checked ? "Auto BANT qualification enabled" : "Auto BANT qualification disabled"
      );
    } else {
      ToastError(result.message || "Failed to update setting");
      // Revert on error
      setLeadSettings((prev) => ({
        ...prev,
        autoBANTQualification: !checked,
      }));
    }
  };

  // Persist language choice into lang cookie for middleware to pick up on future requests
  const persistLangCookie = (code: string) => {
    if (typeof document !== "undefined") {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `lang=${code}; path=/; SameSite=Lax; Expires=${expires.toUTCString()}`;
    }
  };

  // ==============================================================
  // Logout User - Backend handles cookie clearing (httpOnly cookies)
  // ==============================================================
  const handleLogout = async () => {
    if (typeof window === "undefined" || isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { success, message } = await logoutUserAction();

      if (success) {
        ToastSuccess("Logged out successfully");
        // Clear Redux state for immediate UI feedback
        // dispatch(logout());
        router.push("/login");
      } else {
        setIsLoggingOut(false);
        ToastError(message || "Something went wrong while logging out");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Logout error:", error);
      }
    }
  };

  // ==============================================================
  // Restart Onboarding Tour
  // ==============================================================
  const handleRestartTour = async () => {
    if (isRestartingTour) return;
    setIsRestartingTour(true);
    try {
      const result = await restartOnboarding();
      if (result.success) {
        ToastSuccess("Onboarding tour restarted! Redirecting...");
        setTimeout(() => {
          window.location.href = "/super-user";
        }, 1000);
      } else {
        ToastError("Failed to restart tour. Please try again.");
        setIsRestartingTour(false);
      }
    } catch (error) {
      ToastError("Failed to restart tour. Please try again.");
      setIsRestartingTour(false);
      if (process.env.NODE_ENV === "development") {
        console.error("Restart tour error:", error);
      }
    }
  };

  const deactivateTeamMember = async (id: string) => {
    // router.push("/super-user?companyId=123")
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map(c => c.split("="))
    );
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/deactivate-member/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          ToastSuccess("Member deactivated successfully");
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError("User not found")
    }
  }

  const activateTeamMember = async (id: string) => {
    // router.push("/super-user?companyId=123")
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map(c => c.split("="))
    );
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/activate-member/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          ToastSuccess("Member activated successfully");
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError("User not found")
    }
  }


  const changeName = async () => {
    console.log("companyName*******", newCompanyName);
    // return;
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map(c => c.split("="))
    );
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/change-name/${user?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",  // <-- this line is essential
          Authorization: `Bearer ${cookies?.accessToken}`,
        },
        body: JSON.stringify({ companyName: newCompanyName }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("data****", data)
        if (data?.success === true) {
          ToastSuccess("Member name successfully changed");

          dispatch(updateUserSettings({ companyName: newCompanyName }));
          await dispatch(fetchCurrentUser());
          setEditName(false);
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError("User not found")
    }
  }

  return (
    <div>
      <h1 className="mt-3.5 text-[32px] font-[500] capitalize">Settings</h1>
      <div className="mt-8 wrapper flex items-start gap-2.5">
        {/* ---------------------------- left ---------------------------- */}
        <div className="w-full max-w-[25%] p-[30px] border border-gray-b rounded-3xl bg-white">
          <div className="flex flex-col gap-2">
            <button
              className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] 
                  ${activeTab === "profile"
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
                  ${activeTab === "general"
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
            <button
              className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] 
                  ${activeTab === "subscription"
                  ? "bg-pri text-white"
                  : "bg-transparent text-gray-200 hover:bg-gray"
                }`}
              onClick={() => setActiveTab("subscription")}
            >
              <div className="flex-center gap-2">
                <SubscriptionIcon />
                <h3 className="text-[14px] capitalize">Subscription & Billing</h3>
              </div>
            </button>
          </div>
        </div>

        {/* ---------------------------- right ---------------------------- */}
        <div className="w-full max-w-[75%] p-[30px] border border-gray-b rounded-3xl bg-white flex flex-col gap-[18px]">
          <h1 className="text-[16px] font-[500] capitalize border-b border-gray-n/30 pb-1">
            {activeTab === "profile"
              ? "Profile settings"
              : activeTab === "general"
                ? "General settings"
                : "Subscription & Billing"}
          </h1>
          {/* -- profile -- */}
          {activeTab === "profile" ? (
            <>
              <div className="p-[17px] border border-gray-b rounded-3xl">

                <h2 className="text-[16px] leading-none text-[#15803c] font-[500]">Profile picture</h2>
                <Image
                  src={typeof user?.logo === "string" ? user.logo : user?.logo?.url ?? "/assets/icons/favicon.ico"}
                  width={100}
                  height={100}
                  alt="company logo"
                  className="my-5 rounded-5xl"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/assets/icons/favicon.ico";
                  }}
                />
                {editName === false && <div className="flex gap-2 text-2xl font-medium text-[#15803c]">
                  {user?.companyName}
                  <button className="hover:text-green-600" onClick={() => setEditName(true)}>
                    <ExternalLinkSvg />
                  </button>
                </div>}
                {editName === true && <div className="flex gap-5">
                  <input value={newCompanyName} type="text" placeholder="Enter name to edit" className="outline-none border border-gray-200 rounded p-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany(e.target.value)} />
                  <button className="bg-yellow-400 text-white w-20 rounded text-md" onClick={() => setEditName(false)}>cancel</button>
                  <button className="bg-[#15803c] text-white w-20 rounded text-md" onClick={changeName}>save</button>
                </div>}
                <div className="mt-[14px] flex-between">
                  <div className="flex items-center gap-2.5">
                    {/* {user?.provider === "google" ? (
                      <GoogleIcon />
                    ) : user?.provider === "zohocrm" ? (
                      <ZohoIcon size={32} />
                    ) : null} */}
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
                      className={`w-fit flex gap-1 text-sm transition-colors duration-200 ${isLoggingOut ? "text-gray-400 cursor-not-allowed" : "text-danger gray-hover"
                        }`}
                    >
                      <div>{logoutIcon()}</div>
                      <div>{isLoggingOut ? "Logging out..." : "Logout"}</div>
                    </button>
                  </form>
                </div>
                {user?.joinedCompanyStatus === true &&
                  <div className="mt-[14px] flex-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <h2 className="text-2xl font-medium text-[#15803c]">Member Company</h2>
                        <h3 className="text-[14px] leading-none text-gray-200">
                          {joinedCompany?.companyName || "user@example.com"}
                        </h3>
                      </div>
                    </div>

                      <button
                      onClick={() => router.push(`/super-user/?companyId=${joinedCompany?._id}`)}
                        className="bg-yellow-400 text-white w-20 rounded text-lg"
                      >
                        Visit
                      </button>
                  </div>}
              </div>

              {/* delete account */}
              <div className="flex flex-col gap-2">
                <button className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200">
                  <div>{trashIcon()}</div>
                  <div>Delete Account</div>
                </button>
              </div>
              {teamMembers?.length > 0 && <div className="min-w-full">
                <Table>
                  <TableHeader>
                    <TableCell>Sr#</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    {/* <TableCell>logo</TableCell> */}
                    <TableCell>Actions</TableCell>
                  </TableHeader>
                  {teamMembers?.map((teams, i) => (
                    <TableRow className="gap-4" key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{teams?.company?.companyName}</TableCell>
                      <TableCell className="mr-10">{teams?.company?.email}</TableCell>
                      {/* <TableCell className="ml-5">
                        <Image
                          src={typeof teams?.company?.logo.url === "string" ? teams?.company?.logo.url : teams?.company?.logo.url ?? "/assets/icons/favicon.ico"}
                          width={30}
                          height={30}
                          alt="company logo"
                          className="my-5 rounded-5xl"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/assets/icons/favicon.ico";
                          }}
                        />
                      </TableCell> */}
                      <TableCell className="ml-28 flex">
                        <button className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200" onClick={() => activateTeamMember(teams?.company?._id)}>
                          {/* <div>{trashIcon()}</div> */}
                          <div>Activate Member</div>
                        </button>
                        <button className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200" onClick={() => deactivateTeamMember(teams?.company?._id)}>
                          {/* <div>{trashIcon()}</div> */}
                          <div>Deactivate Member</div>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </div>}
            </>
          ) : activeTab === "general" ? (
            // -- general --
            <div className="flex flex-col gap-[14px]">
              <h1 className="text-[14px] text-gray-200">Language</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl flex-between">
                <h2 className="text-[14px] leading-[16px]">
                  {leadSettings?.language === "ar" ? "Arabic" : "English (UK)"}
                </h2>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-sec flex items-center gap-2.5 gray-hover"
                >
                  Change language <RightArrowSvg />
                </button>
              </div>
              <h1 className="text-[14px] text-gray-200">Notification preferences</h1>
              <div className="flex flex-col gap-[15px] p-[15px] border border-gray-b rounded-2xl">
                {[
                  {
                    title: "New Lead Notifications",
                    id: "lead-notifications",
                    key: "leadNotifications",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex-between">
                    <h2 className="text-[14px] leading-[16px]">{item.title}</h2>
                    <ToggleSwitch
                      id={item.id}
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={async (checked) => {
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }));
                        // Persist to backend
                        try {
                          const res = await updateCompanySettings({ leadNotifications: checked });

                          if (res.success) {
                            // Update Redux store
                            dispatch(updateUserSettings({ leadNotifications: checked }));

                            ToastSuccess(
                              checked
                                ? "New lead notifications enabled"
                                : "New lead notifications disabled"
                            );
                          } else {
                            ToastError(res.message || "Failed to update setting");
                            // Revert on error
                            setNotificationSettings((prev) => ({
                              ...prev,
                              [item.key]: !checked,
                            }));
                          }
                        } catch (e) {
                          ToastError("Failed to update setting");
                          // Revert on error
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [item.key]: !checked,
                          }));
                        }
                      }}
                      size="md"
                    />
                  </div>
                ))}
              </div>

              <h1 className="text-[14px] text-gray-200 mt-4">Lead Management</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <div>
                    <h2 className="text-[14px] leading-[16px] font-medium">
                      Auto BANT Qualification
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Automatically qualify leads using AI (Budget, Authority, Need, Timeline)
                    </p>
                  </div>
                  <ToggleSwitch
                    id="auto-bant-qualification"
                    checked={leadSettings.autoBANTQualification}
                    onChange={handleBANTSettingChange}
                    size="md"
                  />
                </div>
              </div>

              <h1 className="text-[14px] text-gray-200 mt-4">CRM Integration</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <p className="text-xs text-gray-400">
                    Connect your CRM to sync leads automatically
                  </p>

                  <Link
                    href="/super-user/integrations"
                    prefetch={false}
                    className="flex-center gap-2 text-sec gray-hover"
                  >
                    <p>Manage CRM</p>
                    <RightArrowSvg />
                  </Link>
                </div>
              </div>

              {/* Onboarding Tour */}
              <h1 className="text-[14px] text-gray-200 mt-4">Help & Support</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <div>
                    <h2 className="text-[14px] leading-[16px] font-medium">Dashboard Tour</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Take a guided tour through the dashboard features
                    </p>
                  </div>
                  <button
                    onClick={handleRestartTour}
                    disabled={isRestartingTour}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isRestartingTour
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-pri text-white hover:bg-pri/80"
                      }`}
                  >
                    {isRestartingTour ? "Restarting..." : "Restart Tour"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // -- subscription --
            <SubscriptionSettings />
          )}
        </div>
      </div>

      <LanguageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentLanguage={leadSettings.language}
        onConfirm={async (languageCode) => {
          // persist
          const res = await updateCompanySettings({ language: languageCode });
          if (res.success) {
            setLeadSettings((prev) => ({ ...prev, language: languageCode }));
            ToastSuccess("Language updated successfully");
            persistLangCookie(languageCode);
            // Update client-side i18n without full refresh
            try {
              await i18nSetLocale(languageCode);
            } catch (e) {
              // no-op
            }
          } else {
            ToastError(res.message || "Failed to update language");
          }
        }}
      />
    </div>
  );
};

export default SettingsPage;
