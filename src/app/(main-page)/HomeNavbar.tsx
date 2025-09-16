"use client";

import Logo from "@/components/shared/logo/Logo";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Language from "@/components/shared/language/Language";
import { changeLang } from "../action";
import { languages } from "@/lib/constants/languageConstants";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface HomeNavbarProps {
  dict: Dictionary;
  currentLang: string;
}

const HomeNavbar = ({ dict, currentLang }: HomeNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for menu elements
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Refs for menu items
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLDivElement)[]>([]);
  const addToMenuItemsRef = useCallback((el: HTMLAnchorElement | HTMLDivElement | null) => {
    if (el) menuItemsRef.current.push(el);
  }, []);

  const closeMenu = useCallback(() => {
    if (isMenuOpen && !isAnimating) {
      setIsAnimating(true);

      // Create timeline for smooth coordinated animations
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMenuOpen(false);
          setIsAnimating(false);
          if (backdropRef.current) {
            backdropRef.current.style.display = "none";
          }
        },
      });

      // Lightning-fast close animation
      tl.to(menuItemsRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.5,
        duration: 0.08,
        stagger: 0.005,
        ease: "power2.in",
      })

        // Slide menu out
        .to(
          menuRef.current,
          {
            x: "100%",
            duration: 0.15,
            ease: "power2.out",
          },
          "-=0.01"
        )
        // Fade backdrop
        .to(
          backdropRef.current,
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            duration: 0.1,
            ease: "power2.out",
          },
          "-=0.1"
        );
    }
  }, [isMenuOpen, isAnimating]);

  const toggleMenu = useCallback(() => {
    if (isAnimating) return;

    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      setIsAnimating(true);

      // Show backdrop immediately
      if (backdropRef.current) {
        backdropRef.current.style.display = "block";
      }

      // Create timeline for opening animation
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      // Lightning-fast hamburger to X animation
      // Slide menu in
      tl.to(
        menuRef.current,
        {
          x: "0%",
          duration: 0.15,
          ease: "power2.out",
        },
        "-=0.01"
      )
        // Fade in backdrop with blur
        .to(
          backdropRef.current,
          {
            opacity: 1,
            backdropFilter: "blur(6px)",
            duration: 0.1,
            ease: "power2.out",
          },
          "-=0.1"
        )
        // Smooth bubble-up animation
        .fromTo(
          menuItemsRef.current,
          {
            y: 80,
            opacity: 0,
            scale: 0.3,
            rotation: 8,
            transformOrigin: "center bottom",
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.25,
            stagger: {
              amount: 0.1,
              from: "end",
            },
            ease: "power2.out",
          },
          "-=0.02"
        );
    }
  }, [isMenuOpen, isAnimating, closeMenu]);

  // Enhanced event handlers with better performance
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        backdropRef.current &&
        target === backdropRef.current &&
        !menuRef.current?.contains(target) &&
        !hamburgerRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape, { passive: true });
      document.addEventListener("mousedown", handleClickOutside, { passive: true });
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, closeMenu]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Reset menu items refs on unmount
      menuItemsRef.current = [];
      // Ensure body scroll is restored
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="home-wrapper py-[14px]">
      <nav className="flex-between">
        <Logo />
        <div className="hidden md:flex flex-center gap-5">
          <div className="rounded-xl-2 border border-gray-b h-[52px] w-[138px] flex-center">
            <Language languages={languages} changeLang={changeLang} currentLang={currentLang} />
          </div>
          <PrimaryButton
            title={dict?.home?.hero?.getStarted}
            className="h-[52px] w-[138px] rounded-xl-2"
          />
        </div>
        <div className="md:hidden">
          <button
            ref={hamburgerRef}
            onClick={toggleMenu}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-pri to-sec text-white shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            disabled={isAnimating}
          >
            <div className="relative w-5 h-5">
              <svg
                className="absolute inset-0 w-full h-full"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16"></path>
                <path d="M4 12h16"></path>
                <path d="M4 18h16"></path>
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Enhanced backdrop with gradient */}
      {isMenuOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeMenu}
          style={{ backdropFilter: "blur(0px)", display: "none" }}
        ></div>
      )}

      {/* Unique sliding menu with glassmorphism effect */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        className="fixed top-0 right-0 w-full h-full z-[999] transform translate-x-full md:hidden overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.9) 100%)",
          backdropFilter: "blur(12px)",
          borderLeft: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "-8px 0 25px rgba(59,130,246,0.15)",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {/* Close button with enhanced styling */}
        <div className="absolute top-3.5 right-5 z-10">
          <button
            onClick={toggleMenu}
            className="relative p-2.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            disabled={isAnimating}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Menu content with enhanced layout */}
        <div
          ref={menuContentRef}
          className="flex flex-col items-center justify-center h-full px-8 py-20"
        >
          {/* Enhanced language selector */}
          <div
            ref={addToMenuItemsRef}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/80 border border-blue-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-150 transform hover:scale-105"
          >
            <Language languages={languages} changeLang={changeLang} currentLang={currentLang} />
          </div>

          {/* Enhanced CTA button */}
          <div ref={addToMenuItemsRef}>
            <PrimaryButton
              title={dict?.home?.hero?.getStarted}
              className="h-[50px] w-[160px] rounded-2xl bg-gradient-to-r from-pri to-sec hover:from-pri hover:to-sec text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105 hover:-translate-y-1"
              onClick={closeMenu}
            />
          </div>
        </div>

        {/* Floating bubble elements for unique visual effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full bubble-float"></div>
          <div
            className="absolute top-1/3 right-1/3 w-12 h-12 bg-purple-400/20 rounded-full bubble-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-pink-400/20 rounded-full bubble-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-cyan-400/20 rounded-full bubble-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
