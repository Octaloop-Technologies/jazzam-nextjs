"use client";

import Logo from "@/components/shared/logo/Logo";
import {
  NotificationSvg,
  SettingsSvg,
  MarkAllAsReadSvg,
  NotificationDropdownSvg,
  TimeSvg,
  LeadsIcon,
  FormsIcon,
  SummaryIcon,
  FollowUpsIcon,
} from "@/components/svgs/NavbarSvgs";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
// import { navItems } from "@/lib/constants/navbarConstants";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Language from "@/components/shared/language/Language";
import { changeLangNoReload, getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { useAppSelector } from "@/redux/store";
import tokenStorage from "@/lib/utils/tokenStorage";
import { useSocket } from "@/providers/socketProvider";


interface NavbarProps {
  // currentLang: string;
  languages: LanguageProp[];
}

// ======================================================
// Register Gsap Plugins
// ======================================================
gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ languages }: NavbarProps) => {
  // ======================================================
  // Hooks
  // ======================================================
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<any>();
  const { user } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<any>([]);
  const { accessToken } = tokenStorage?.getTokens();
  const { socket, isConnected } = useSocket()

  const companyId = user?.joinedCompanyStatus === true ? searchParams?.get("companyId") || user?.joinedCompanies : '';
  const lang = getCurrentLang();

  // show only unread notifications count
  const unreadCount = useMemo(() => {
    return (notifications || []).filter((n: any) => !n?.isRead).length;
  }, [notifications]);

  useEffect(() => {
    const handleLanguage = async () => {
      const dict: any = (await getDictionary(lang)).superUser;
      setLanguage(dict);
    }
    handleLanguage()
  }, []);

  const navItems = [
    {
      href: "/super-user",
      icon: <LeadsIcon />,
      title: language?.navbar?.navlinks?.leads,
    },
    {
      href: "/super-user/forms",
      icon: <FormsIcon />,
      title: language?.navbar?.navlinks?.forms,
    },
    {
      href: "/super-user/summary",
      icon: <SummaryIcon />,
      title: language?.navbar?.navlinks?.summary,
    },

    {
      href: "/super-user/follow-ups",
      icon: <FollowUpsIcon />,
      title: language?.navbar?.navlinks?.followUps,
    },
  ];



  // Fetch existing notifications on mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/get-notifications/${user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setNotifications(data?.data);
      }
    };
    fetchData();
  }, []);

  // listen real time updates
  useEffect(() => {
    if (socket && isConnected) {

      const handleNewNotification = (data: any) => {
        if (data?.action === "newNotification") {
          setNotifications((prev: any) => [data?.notification, ...prev]);
        }
        if (data?.action === "markAllRead" || data?.action === "clearAll") setNotifications(data?.notifications);
      };

      socket.on(`notifications`, handleNewNotification);

      return () => {
        socket.off('notifications', handleNewNotification);
      }
    }
  }, [socket, user?._id]);

  // ======================================================
  // Make the Navbar sticky with smooth animation when scrolling
  // ======================================================
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const showAnim = gsap
      .from(".navbar", {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
      onEnter: () => {
        gsap.to(".navbar", {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          duration: 0.2,
        });
      },
      onLeaveBack: () => {
        gsap.to(".navbar", { boxShadow: "none", duration: 0.2 });
      },
    });
  }, []);


  // function to mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark-all-read/${user?._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          console.log("All notifications marked as read.");
        }
      }
    } catch (error) {
      console.log("Unable to mark all as read. Please try again later")
    }
  }

  // function to mark all notifications as read
  const handleClearAll = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/clear-all/${user?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success === true) {
          console.log("cleared all notifications.");
        }
      }
    } catch (error) {
      console.log("Unable to mark all as read. Please try again later")
    }
  }


  return (
    <div className="flex-between gap-2 pt-[15px] pb-2.5 x-padding navbar sticky top-0 z-50 bg-bg">
      <Logo />

      {/* ------------- nav items ------------- */}
      {user?.userType === "user" && user?.joinedCompanyStatus === false ? "" :
        <nav className="flex-center gap-2.5 text-[14px]">
          {navItems.map((item) => (
            <Link
              href={
                (companyId !== null || undefined) && user?.userType === "user" ? item?.href + `?companyId=${companyId}` : item?.href
              }
              prefetch={false}
              key={item?.title}
            >
              <div
                className={`flex-center gap-1 px-5 py-2.5 rounded-4xl ${pathname === item?.href ? "text-white bg-pri" : "text-gray-200"
                  }`}
              >
                <span>{item?.icon}</span>
                <h2>{item?.title}</h2>
              </div>
            </Link>
          ))}
        </nav>
      }

      <div className="flex-center gap-4">
        {/* ------------- localization ------------- */}
        <Language
          languages={languages}
          changeLang={changeLangNoReload as any}
        />

        {/* ------------- settings ------------- */}
        <Link
          href="/super-user/settings"
          prefetch={false}
          className="bg-white p-2.5 rounded-full border border-gray-b gray-hover"
        >
          <SettingsSvg />
        </Link>

        {/* ------------- notifications ------------- */}
        <Dropdown
          trigger={
            <button className="bg-white p-2.5 rounded-full border border-gray-b relative gray-hover cursor-pointer">
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex-center text-white text-xs font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              <NotificationSvg />
            </button>
          }
          dropDownClass="w-[458px] p-5 pt-7"
          gap={10}
          position="bottom-left"
        >
          <DropdownItem>
            <div className="w-full flex flex-col gap-[10px]">
              <h2 className="text-[20px] font-[500] leading-none pb-2.5 border-b border-gray-b">
                {language?.navbar?.notifications?.notification}
              </h2>
              {notifications.length > 0  && 
              <div className="flex-between gap-2.5 text-[14px] font-[500]">
                <button className="flex-center gap-1 gray-hover" onClick={handleMarkAllRead}>
                  {language?.navbar?.notifications?.markAllRead}
                  <MarkAllAsReadSvg />
                </button>
                <button className="text-danger gap-1 hover:text-gray-200 transition-all duration-200 ease-in-out underline-auto-from-front" onClick={handleClearAll}>
                  {language?.navbar?.notifications?.clearAll}
                </button>
              </div>}
            </div>
          </DropdownItem>
          {/* <div className="bg-gray rounded-2xl py-4 px-3 flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <DropdownItem
                key={index}
                className="flex flex-col items-end-safe gap-2 bg-white border-l-[3px] border-l-pri rounded-2xl p-4 pb-2 gray-hover cursor-pointer"
              >
                <div className="flex-between-start gap-2.5">
                  <div className="bg-pri rounded-full size-[30px] flex-center">
                    <NotificationDropdownSvg />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-[18px]">
                    <h2 className="text-[16px] font-[500]">
                      AI Insight Available
                    </h2>
                    <h3 className="text-[14px] text-gray-400">
                      New proposal recommendation ready for Acme Corp deal
                    </h3>
                  </div>
                </div>
                <h4 className="text-[12px] text-gray-n flex-center gap-1">
                  <TimeSvg />2 hours ago
                </h4>
              </DropdownItem>
            ))}
          </div> */}
          <div className="bg-gray rounded-2xl py-4 px-3 flex flex-col gap-2.5 max-h-96 overflow-y-auto cursor-pointer">
            {notifications.length > 0 ? (
              notifications.map((notification: any, index: number) => (
                <DropdownItem
                  key={notification?._id || index}
                  className={`${notification?.isRead ? "bg-gray-100" : "bg-white"} gap-2 border-l-[3px] border-l-pri rounded-2xl p-4 gray-hover cursor-pointer`}
                >
                  <div className="flex gap-2.5">
                    <div className={`${notification?.message?.length > 50 && 'w-12'} bg-pri rounded-full size-[30px] flex-center`}>
                      <NotificationDropdownSvg />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-[18px]">
                      <h2 className="text-[16px] font-[500]">
                        {notification?.title}
                      </h2>
                      <h3 className="text-[14px] text-gray-400">
                        {notification?.message}
                      </h3>
                      <span className="text-[12px] text-gray-500">
                        {new Date(notification?.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </DropdownItem>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notifications yet
              </div>
            )}
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
