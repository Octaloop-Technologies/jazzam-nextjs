"use client";

import Logo from "@/components/shared/logo/Logo";
import {
  NotificationSvg,
  SettingsSvg,
  MarkAllAsReadSvg,
  NotificationDropdownSvg,
  TimeSvg,
} from "@/components/svgs/NavbarSvgs";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import { navItems } from "@/lib/constants/navbarConstants";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Language from "@/components/shared/language/Language";
import { changeLang } from "../action";
import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);

interface NavbarProps {
  currentLang: string;
  languages: LanguageProp[];
}

// ======================================================
// Register Gsap Plugins
// ======================================================
gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ currentLang, languages }: NavbarProps) => {
  // ======================================================
  // Hooks
  // ======================================================
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = useState([]);

  const companyId = searchParams?.get("companyId");

  // Fetch existing notifications on mount
  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map((c) => c.split("="))
    );
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/get-notifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.accessToken}`,
          },
        }
      );
      const data = await res.json();
      setNotifications(data);
    };
    fetchData();
  }, []);

  // listen real time updates
  useEffect(() => {
    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("new_notification");
  }, []);

  console.log("data********", notifications);

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

  return (
    <div className="flex-between gap-2 pt-[15px] pb-2.5 x-padding navbar sticky top-0 z-50 bg-bg">
      <Logo />

      {/* ------------- nav items ------------- */}
      <nav className="flex-center gap-2.5 text-[14px]">
        {navItems.map((item) => (
          <Link
            href={
              companyId !== null || undefined
                ? item.href + `?companyId=${companyId}`
                : item.href
            }
            prefetch={false}
            key={item.title}
          >
            <div
              className={`flex-center gap-1 px-5 py-2.5 rounded-4xl ${
                pathname === item.href ? "text-white bg-pri" : "text-gray-200"
              }`}
            >
              <span>{item.icon}</span>
              <h2>{item.title}</h2>
            </div>
          </Link>
        ))}
      </nav>

      <div className="flex-center gap-4">
        {/* ------------- localization ------------- */}
        <Language
          languages={languages}
          changeLang={changeLang}
          currentLang={currentLang}
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
            <button className="bg-white p-2.5 rounded-full border border-gray-b relative gray-hover">
              <div className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></div>
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
                Notifications
              </h2>
              <div className="flex-between gap-2.5 text-[14px] font-[500]">
                <button className="flex-center gap-1 gray-hover">
                  Mark all as read
                  <MarkAllAsReadSvg />
                </button>
                <button className="text-danger gap-1 hover:text-gray-200 transition-all duration-200 ease-in-out underline-auto-from-front">
                  Clear all
                </button>
              </div>
            </div>
          </DropdownItem>
          <div className="bg-gray rounded-2xl py-4 px-3 flex flex-col gap-2.5">
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
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
