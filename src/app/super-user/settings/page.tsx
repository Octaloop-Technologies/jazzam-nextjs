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
import { logoutUserAction, updateCompanySettings } from "@/lib/api/settings";
import { useRouter } from "next/navigation";
import { restartOnboarding } from "@/lib/api/leads";
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
import {
  DeleteSvg,
  ExternalLinkSvg,
} from "@/components/svgs/LeadsAnalysisSvgs";
import tokenStorage from "@/lib/utils/tokenStorage";
import DeleteUserModal from "@/components/ui/models/DeleteUserModal";
import UpdateLeadsTypeModal from "@/components/ui/models/UpdateLeadsTypeModal";
import { BlobOptions } from "buffer";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";

interface TeamMembers {
  company?: {
    companyName?: string,
    email?: string,
    logo: {
      url?: string
    },
    _id: string,
    joinedCompanyStatus?: boolean
    assignedLeadsType?: string
  },
  joinedAt?: string,
  role?: string,
  _id?: string
}

type JoinedCompanyType = {
  _id?: string;
  companyName?: string;
  email?: string;
  logo?: string;
};

const SubscriptionSettings = dynamic(
  () => import("@/components/view/dashboard/settings/SubscriptionSettings"),
  { ssr: false }
);

const SettingsPage = () => {
  // ==============================================================
  // States
  // ==============================================================
  const [activeTab, setActiveTab] = useState<
    "profile" | "general" | "subscription"
  >("profile");
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
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [joinedCompany, setJoinedCompnay] = useState<JoinedCompanyType | null>(
    null
  );
  const [editName, setEditName] = useState<boolean>(false);
  const [editProfilePicture, setEditProfilePicture] = useState<boolean>(false);
  const [newCompanyName, setNewCompany] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [sendInviteLoad, setSendInviteLoad] = useState<boolean>(false);
  const [deleteUserIsOpen, setDeleteUserIsOpen] = useState<boolean>(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState<boolean>(false);
  const [openUpdateLeadsTypeModal, setOpenUpdateLeadsTypeModal] = useState<boolean>(false);
  const [assignLeadType, setAssignLeadsType] = useState<string>("")
  const [assignLeadTypeUserId, setAssignLeadTypeUserId] = useState<string | undefined>("")
  const [language, setLanguage] = useState<any>()

  // ==============================================================
  // Hooks
  // ==============================================================
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const { setLocale: i18nSetLocale } = useI18n();
  const { accessToken } = tokenStorage.getTokens();
  const lang = getCurrentLang();

  // ==============================================================
  // Load user settings on component mount
  // ==============================================================
  useEffect(() => {
    const fetchLanguage = async () => {
      const dict = (await getDictionary(lang))?.superUser?.navbar.settings;
      setLanguage(dict);
    }
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
    fetchLanguage()
  }, [user]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/team-members/${user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setTeamMembers(data?.data?.teamMembers);
      console.log("fetchTeamMembers***********888", data);
    };
    const fetchJoinedCompany = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/joined-company/${user?.joinedCompanies}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("data:", data);
        setJoinedCompnay(data?.data);
      }
    };
    fetchTeamMembers();
    if (user?.joinedCompanies !== undefined || null) fetchJoinedCompany();
  }, [user]);

  // ==============================================================
  // Update BANT Setting
  // ==============================================================
  const handleBANTSettingChange = async (checked: boolean) => {
    setLeadSettings((prev) => ({
      ...prev,
      autoBANTQualification: checked,
    }));

    const result = await updateCompanySettings({
      autoBANTQualification: checked,
    });

    if (result.success) {
      // Update Redux store
      // dispatch(updateUserSettings({ autoBANTQualification: checked }));

      ToastSuccess(
        checked
          ? language?.autoBantEnable
          : language?.autoBantDisable
      );
    } else {
      ToastError("Failed to update setting");
      // Revert on error
      setLeadSettings((prev) => ({
        ...prev,
        autoBANTQualification: !checked,
      }));
    }
  };

  // ==============================================================
  // Logout User - Backend handles cookie clearing (httpOnly cookies)
  // ==============================================================
  const handleLogout = async () => {
    if (typeof window === "undefined" || isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { success } = await logoutUserAction();

      if (success) {
        ToastSuccess(language?.logoutMessage);
        // Clear Redux state for immediate UI feedback
        dispatch(logout());
        router.push("/login");
      } else {
        setIsLoggingOut(false);
        ToastError(language?.somethingLogoutError);
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
        ToastSuccess(language?.onboardingSuccess);
        setTimeout(() => {
          window.location.href = "/super-user";
        }, 1000);
      } else {
        ToastError(language?.failedOnboarding);
        setIsRestartingTour(false);
      }
    } catch (error) {
      ToastError(language?.failedOnboarding);
      setIsRestartingTour(false);
      if (process.env.NODE_ENV === "development") {
        console.error("Restart tour error:", error);
      }
    }
  };

  // ==============================================================
  // Deactivte Member
  // ==============================================================
  const deactivateTeamMember = async (id: string | undefined) => {
    // router.push("/super-user?companyId=123")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/deactivate-member/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          ToastSuccess(language?.memberDeactivated);
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError("User not found");
    }
  };

  // ==============================================================
  // Activate Member
  // ==============================================================

  const activateTeamMember = async (id: string | undefined) => {
    // router.push("/super-user?companyId=123")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/activate-member/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          ToastSuccess(language?.memberActivated);
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError(language?.userNotfound);
    }
  };

  // ==============================================================
  // Change company name
  // ==============================================================

  const changeName = async () => {
    console.log("companyName*******", newCompanyName);
    // return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/change-name/${user?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // <-- this line is essential
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ companyName: newCompanyName }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("data****", data);
        if (data?.success === true) {
          ToastSuccess(language?.memberNameChanged);

          dispatch(updateUserSettings({ companyName: newCompanyName }));
          await dispatch(fetchCurrentUser());
          setEditName(false);
        }
      }
    } catch (error) {
      console.log("error****", error);
      ToastError("User not found");
    }
  };

  // ==============================================================
  // Change user assign leads type
  // ==============================================================

  const changeUserAssignType = async () => {
    if(assignLeadType !== "" && assignLeadTypeUserId !== ""){
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/change-assigned-leads-type/${assignLeadTypeUserId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json", // <-- this line is essential
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ assignedLeadsType: assignLeadType }),
          }
        );
  
        if (res.ok) {
          const data = await res.json();
          console.log("data****", data);
          if (data?.success === true) {
            ToastSuccess("User assign lead type updated successfully");
            await dispatch(fetchCurrentUser());
            setOpenUpdateLeadsTypeModal(false)
          }
        }
      } catch (error) {
        console.log("error****", error);
        ToastError("User not found");
      }
    }
    // return;
  };

  // ==============================================================
  // Send Invite handler
  // ==============================================================

  const checkEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendInvite = async () => {
    const senderCompanyId = user?._id;

    if (!checkEmail(email)) {
      ToastError("Email is not valid!");
      return;
    }

    try {
      setSendInviteLoad(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/invite/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            senderCompanyId,
            receiverEmail: email,
          }),
        }
      );

      const data = await response.json();

      console.log("data:****", data);

      if (!response.ok) {
        ToastError(data?.message === "User not found" ? language?.errorSendingInvitation : data.message);
      }

      if (data?.success === true) {
        ToastSuccess(language?.invitationLinkSent);
      }

      return data;
    } catch (error) {
      setSendInviteLoad(false);

      console.error(language?.errorSendingInvitation, error);
      throw error;
    } finally {
      setSendInviteLoad(false);
    }
  };

  // ==============================================================
  // Change profile picture
  // ==============================================================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // files can be null, so check first
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    // ensure a file is selected before trying to append it to FormData
    if (!profilePicture) {
      ToastError(language?.noFileSelected);
      throw new Error("No file selected");
    }

    try {
      const formData = new FormData();
      formData.append("logo", profilePicture); // must match 'upload.single("logo")'

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/logo`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`, // or however you store JWT
          // ❌ Do NOT set "Content-Type" here — fetch will set it automatically for FormData
        },
        body: formData,
      });

      const data = await response.json();
      console.log("data******", data);
      if (!response.ok) throw new Error(data.message || "Upload failed");
      if (data?.success === true) {
        dispatch(updateUserSettings({
          logo: {
            url: data?.data?.logo?.url,
            public_id: data?.data?.logo?.public_id
          }
        }))
        ToastSuccess(language?.profileUpdated)
        setEditProfilePicture(false)
        console.log("user******", user?.logo)
      }
      return data;
    } catch (error) {
      console.log("error******", error)
      ToastError(language?.errorUploadFile);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteUserLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success === true) {
          ToastSuccess(`${user?.userType === "user" ? "user" : "company"} ${language?.userDeleted}`)
          dispatch(logout());
          router.push("/login");
        }
      }
    } catch (error) {
      ToastError(language?.errorDeleted)
    }
    finally {
      setDeleteUserLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mt-3.5 text-[32px] font-[500] capitalize">{language?.settingsHeading}</h1>
      <div className="mt-8 wrapper flex items-start gap-2.5">
        {/* ---------------------------- left ---------------------------- */}
        <div className="w-full max-w-[25%] p-[30px] border border-gray-b rounded-3xl bg-white">
          <div className="flex flex-col gap-2">
            <button
              className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] cursor-pointer
                  ${activeTab === "profile"
                  ? "bg-pri text-white"
                  : "bg-transparent text-gray-200 hover:bg-gray"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="flex-center gap-2">
                <ProfileSettingsIcon />
                <h3 className="text-[14px] capitalize">{language?.profileSettings}</h3>
              </div>
            </button>
            {user?.userType === "company" ?
              <>
                <button
                  className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] cursor-pointer
                  ${activeTab === "general"
                      ? "bg-pri text-white"
                      : "bg-transparent text-gray-200 hover:bg-gray"
                    }`}
                  onClick={() => setActiveTab("general")}
                >
                  <div className="flex-center gap-2">
                    <GeneralSettingsIcon />
                    <h3 className="text-[14px] capitalize">{language?.generalSettings}</h3>
                  </div>
                </button>
                <button
                  className={`px-2.5 h-[44px] flex-between gap-2 rounded-[110px] cursor-pointer
                  ${activeTab === "subscription"
                      ? "bg-pri text-white"
                      : "bg-transparent text-gray-200 hover:bg-gray"
                    }`}
                  onClick={() => setActiveTab("subscription")}
                >
                  <div className="flex-center gap-2">
                    <SubscriptionIcon />
                    <h3 className="text-[14px] capitalize">
                      {language?.subscriptionBilling}
                    </h3>
                  </div>
                </button>
              </>
              : ''}
          </div>
        </div>

        {/* ---------------------------- right ---------------------------- */}
        <div className="w-full max-w-[75%] p-[30px] border border-gray-b rounded-3xl bg-white flex flex-col gap-[18px]">
          <h1 className="text-[16px] font-[500] capitalize border-b border-gray-n/30 pb-1">
            {activeTab === "profile"
              ? language?.profileSettings
              : activeTab === "general"
                ? language?.generalSettings
                : language?.subscriptionBilling}
          </h1>
          {/* -- profile -- */}
          {activeTab === "profile" ? (
            <>
              <div className="p-[17px] border border-gray-b rounded-3xl">
                <h2 className="text-[16px] leading-none text-[#15803c] font-[500]">
                  {language?.profilePicture}
                </h2>
                <div className="flex gap-3">
                  {!editProfilePicture && (
                    <>
                      <Image
                        src={
                          typeof user?.logo === "string"
                            ? user?.logo
                            : user?.logo?.url ?? "/assets/icons/favicon.ico"
                        }
                        width={100}
                        height={100}
                        alt="company logo"
                        className="my-5 rounded-5xl"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = "/assets/icons/favicon.ico";
                        }}
                      />
                      <button
                        className="hover:text-green-700 text-green-600 cursor-pointer"
                        onClick={() => setEditProfilePicture(true)}
                      >
                        <ExternalLinkSvg />
                      </button>
                    </>
                  )}
                  {editProfilePicture && (
                    <div className="flex my-5 gap-4">
                      <input
                        type="file"
                        className="border-2 border-gray-200 p-2 rounded-2xl"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                      />
                      <button
                        className="bg-yellow-400 text-white w-20 rounded text-md cursor-pointer"
                        onClick={() => setEditProfilePicture(false)}
                      >
                        {language?.cancel}
                      </button>
                      <button
                        className="bg-[#15803c] text-white w-20 rounded text-md cursor-pointer"
                        onClick={uploadFile}
                      >
                        {language?.save}
                      </button>
                    </div>
                  )}
                </div>
                {editName === false && (
                  <div className="flex gap-2 text-2xl font-medium text-[#15803c]">
                    {user?.companyName}
                    <button
                      className="hover:text-green-600 cursor-pointer"
                      onClick={() => setEditName(true)}
                    >
                      <ExternalLinkSvg />
                    </button>
                  </div>
                )}
                {editName === true && (
                  <div className="flex gap-5">
                    <input
                      value={newCompanyName}
                      type="text"
                      placeholder="Enter name to edit"
                      className="outline-none border border-gray-200 rounded p-1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCompany(e.target.value)
                      }
                    />
                    <button
                      className="bg-yellow-400 text-white w-20 rounded text-md cursor-pointer"
                      onClick={() => setEditName(false)}
                    >
                      {language?.cancel}
                    </button>
                    <button
                      className="bg-[#15803c] text-white w-20 rounded text-md cursor-pointer"
                      onClick={changeName}
                    >
                      {language?.save}
                    </button>
                  </div>
                )}
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
                      className={`w-fit flex gap-1 text-sm transition-colors duration-200 cursor-pointer ${isLoggingOut
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-danger gray-hover"
                        }`}
                    >
                      <div>{logoutIcon()}</div>
                      <div>{isLoggingOut ? language?.loggingOut : language?.logout}</div>
                    </button>
                  </form>
                </div>
                {user?.joinedCompanyStatus === true && (
                  <div className="mt-[14px] flex-between">
                    {/* <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <h2 className="text-2xl font-medium text-[#15803c]">
                          Member Company
                        </h2>
                        <h3 className="text-[14px] leading-none text-gray-200">
                          {joinedCompany?.companyName || "user@example.com"}
                        </h3>
                      </div>
                    </div> */}

                    {/* <button
                      onClick={() =>
                        router.push(
                          `/super-user/?companyId=${joinedCompany?._id}`
                        )
                      }
                      className="bg-yellow-400 text-white w-20 rounded text-lg"
                    >
                      Visit
                    </button> */}
                  </div>
                )}
              </div>

              {/* delete account */}
              <div className="flex flex-col gap-2">
                <button className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200 cursor-pointer" onClick={() => setDeleteUserIsOpen(true)}>
                  <div>{trashIcon()}</div>
                  <div>{language?.deleteAccount}</div>
                </button>
              </div>
              {user?.userType !== "user" && <div className="min-w-full">
                <div className={`overflow-y-auto h-[190px]`}>
                  <table className="min-w-full rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          {language?.sr}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          {language?.userName}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          {language?.email}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          {language?.status}
                        </th>
                        <th className="px-10 py-2 text-left text-sm font-semibold text-gray-700">
                          {language?.actions}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Assigned Leads type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Update Leads Type
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {teamMembers?.length <= 0 ?
                        <div className="flex justify-center text-lg font-semibold">
                          {language?.noUserFound}
                        </div>
                        :

                        teamMembers?.map((teams, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              {i + 1}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              {teams?.company?.companyName}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              {teams?.company?.email}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              {teams?.company?.joinedCompanyStatus === true ? "Active" : "In-Active"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              <button
                                className="w-40 p-2 mb-2 text-sm text-green-600 bg-green-200 gray-hover transition-colors duration-200 cursor-pointer rounded-md"
                                onClick={() =>
                                  activateTeamMember(teams?.company?._id)
                                }
                              >
                                {/* <div>{trashIcon()}</div> */}
                                <div>{language?.activateMember}</div>
                              </button>
                              <button
                                className="w-40 p-2 mb-2 text-sm text-danger bg-red-200 gray-hover transition-colors duration-200 cursor-pointer rounded-md"
                                onClick={() =>
                                  deactivateTeamMember(teams?.company?._id)
                                }
                              >
                                {/* <div>{trashIcon()}</div> */}
                                <div>{language?.deactivateMember}</div>
                              </button>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              <button
                                className={`${teams?.company?.assignedLeadsType === "hot" ?
                                  "text-hot bg-hot-light"
                                  : teams?.company?.assignedLeadsType === "cold" ? "text-cold bg-cold-light"
                                    : teams?.company?.assignedLeadsType === "qualified" ? "text-pipeline bg-pipeline-light"
                                      : "text-green-600 bg-green-200"} w-40 p-2 mb-2 text-sm gray-hover transition-colors duration-200 cursor-pointer rounded-md`}
                                onClick={() =>
                                  activateTeamMember(teams?.company?._id)
                                }
                              >
                                {/* <div>{trashIcon()}</div> */}
                                <div>{
                                  teams?.company?.assignedLeadsType
                                  ? teams.company.assignedLeadsType.charAt(0).toUpperCase() +
                                    teams.company.assignedLeadsType.slice(1)
                                  : ""
                                  }</div>
                              </button>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 m-52">
                              <button
                                className="w-40 p-2 mb-2 text-sm text-yellow-600 bg-yellow-200 gray-hover transition-colors duration-200 cursor-pointer rounded-md"
                                onClick={() => {
                                  setOpenUpdateLeadsTypeModal(true)
                                  setAssignLeadTypeUserId(teams?.company?._id)
                                }
                                }
                              >
                                {/* <div>{trashIcon()}</div> */}
                                <div>Update type</div>
                              </button>
                            </td>

                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                {/* <Table>
                  <TableHeader>
                    <TableCell>{language?.sr}</TableCell>
                    <TableCell>{language?.userName}</TableCell>
                    <TableCell>{language?.email}</TableCell>
                    <TableCell>{language?.status}</TableCell>
                    <TableCell>{language?.actions}</TableCell>
                  </TableHeader>
                  {teamMembers?.length <= 0 ?
                    <div className="flex justify-center text-lg font-semibold">
                      {language?.noUserFound}
                    </div> : teamMembers?.map((teams, i) => (
                      <TableRow className="gap-4" key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{teams?.company?.companyName}</TableCell>
                        <TableCell className="mr-10">
                          {teams?.company?.email}
                        </TableCell>
                        <TableCell className="ml-20">
                          {teams?.company?.joinedCompanyStatus === true ? "true" : "false"}
                        </TableCell>
                        <TableCell className="flex">
                          <button
                            className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200 cursor-pointer"
                            onClick={() =>
                              activateTeamMember(teams?.company?._id)
                            }
                          >
                            <div>{trashIcon()}</div>
                            <div>{language?.activateMember}</div>
                          </button>
                          <button
                            className="w-fit flex gap-1 text-sm text-danger gray-hover transition-colors duration-200 cursor-pointer"
                            onClick={() =>
                              deactivateTeamMember(teams?.company?._id)
                            }
                          >
                            <div>{trashIcon()}</div>
                            <div>{language?.deactivateMember}</div>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </Table> */}
              </div>}
            </>
          ) : activeTab === "general" ? (
            // -- general --
            <div className="flex flex-col gap-[14px]">
              {/* <h1 className="text-[14px] text-gray-200">{language?.language}</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl flex-between">
                <h2 className="text-[14px] leading-[16px]">
                  {leadSettings?.language === "ar" ? "Arabic" : "English (UK)"}
                </h2>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-sec flex items-center gap-2.5 gray-hover"
                >
                  {language?.changeLangauge}<RightArrowSvg />
                </button>
              </div> */}
              <h1 className="text-[14px] text-gray-200">
                {language?.notificationPreference}
              </h1>
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
                      checked={
                        notificationSettings[
                        item.key as keyof typeof notificationSettings
                        ]
                      }
                      onChange={async (checked) => {
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }));
                        // Persist to backend
                        try {
                          const res = await updateCompanySettings({
                            leadNotifications: checked,
                          });

                          if (res.success) {
                            // Update Redux store
                            // dispatch(
                            //   updateUserSettings({ leadNotifications: checked })
                            // );

                            ToastSuccess(
                              checked
                                ? language?.newLeadEnable
                                : language?.newLeadDisable
                            );
                          } else {
                            ToastError(
                              language?.failedSettings
                            );
                            // Revert on error
                            setNotificationSettings((prev) => ({
                              ...prev,
                              [item.key]: !checked,
                            }));
                          }
                        } catch (e) {
                          ToastError(language?.failedSettings);
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

              <h1 className="text-[14px] text-gray-200 mt-4">
                {language?.leadManagement}
              </h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <div>
                    <h2 className="text-[14px] leading-[16px] font-medium">
                      {language?.autoBantQualification}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {language?.bantDescription1} ({language?.bantDescription2})
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

              <h1 className="text-[14px] text-gray-200 mt-4">
                {language?.crmIntegration}
              </h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <p className="text-xs text-gray-400">
                    {language?.crmDescription}
                  </p>

                  <Link
                    href="/super-user/integrations"
                    prefetch={false}
                    className="flex-center gap-2 text-sec gray-hover"
                  >
                    <p>{language?.manageCrm}</p>
                    <RightArrowSvg />
                  </Link>
                </div>
              </div>

              <h1 className="text-[14px] text-gray-200 mt-4">{language?.inviteUsers}</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <input
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    type="text"
                    placeholder="Enter name to edit"
                    className="outline-none border-2 w-60 border-gray-100 rounded p-1"
                  />
                  <button
                    onClick={handleSendInvite}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-pri text-white hover:bg-pri/80 cursor-pointer`}
                  >
                    {sendInviteLoad ? "Sending" : `Send Invite`}
                  </button>
                </div>
              </div>

              {/* Onboarding Tour */}
              <h1 className="text-[14px] text-gray-200 mt-4">{language?.helpsupport}</h1>
              <div className="p-[15px] border border-gray-b rounded-2xl">
                <div className="flex-between">
                  <div>
                    <h2 className="text-[14px] leading-[16px] font-medium">
                      {language?.dashboardTour}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {language?.dashboardTourDescription}
                    </p>
                  </div>
                  <button
                    onClick={handleRestartTour}
                    disabled={isRestartingTour}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${isRestartingTour
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
        lang={language}
        onConfirm={async (languageCode) => {
          // Update backend settings
          const res = await updateCompanySettings({ language: languageCode });
          if (res.success) {
            // Update local state
            setLeadSettings((prev) => ({ ...prev, language: languageCode }));

            // Save to storage and update i18n context
            const { changeLangNoReload } = await import("@/lib/api/main-page");
            await changeLangNoReload(languageCode);
            await i18nSetLocale(languageCode);

            ToastSuccess(language?.languageUpdate);
          } else {
            ToastError(language?.failedLangUpdate);
          }
        }}
      />

      <DeleteUserModal
        isOpen={deleteUserIsOpen}
        onConfirm={handleDeleteAccount}
        onClose={() => setDeleteUserIsOpen(false)}
        isLoading={deleteUserLoading}
      />
      <UpdateLeadsTypeModal
        isOpen={openUpdateLeadsTypeModal}
        onClose={() => setOpenUpdateLeadsTypeModal(false)}
        onConfirm={changeUserAssignType}
        isLoading={false}
        language={language}
        setAssignLeadsType={setAssignLeadsType}
      />
    </div>
  );
};

export default SettingsPage;
