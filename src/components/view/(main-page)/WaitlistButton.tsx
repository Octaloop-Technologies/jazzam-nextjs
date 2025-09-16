"use client";

import React, { useState, useRef, useEffect, SVGProps } from "react";
import { gsap } from "gsap";
import { joinWaitlist } from "../../../app/(main-page)/action";
import { useToast } from "@/lib/hooks/useToast";

const WaitlistButton = () => {
  const { success, error: ErrorToast } = useToast();

  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonTextRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    if (buttonRef.current) {
      // Initial button animation
      gsap.set(buttonRef.current, { width: "200px" });

      // Floating animation for button text - start after a delay and only when not showing input
      if (buttonTextRef.current) {
        const floatingTl = gsap.timeline({ delay: 1.5 });

        floatingTl.to(buttonTextRef.current, {
          y: -1,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    }
  }, []);

  // Handle hover animations
  useEffect(() => {
    if (!buttonRef.current || !inputFieldRef.current || !submitButtonRef.current) return;

    // Kill floating animation when showing input
    if (buttonTextRef.current) {
      gsap.killTweensOf(buttonTextRef.current);
    }

    if (showInput) {
      // Expand button
      gsap.to(buttonRef.current, {
        width: "320px",
        duration: 0.4,
        ease: "power2.out",
      });

      // Show input field
      gsap.fromTo(
        inputFieldRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, delay: 0.1 }
      );

      // Show submit button
      gsap.fromTo(
        submitButtonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.2, delay: 0.2 }
      );

      // Hide button text
      if (buttonTextRef.current) {
        gsap.to(buttonTextRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
        });
      }

      // Shimmer effect
      if (shimmerRef.current) {
        gsap.to(shimmerRef.current, {
          x: "100%",
          duration: 1.5,
          repeat: -1,
          ease: "none",
        });
      }

      // Glow effect
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          boxShadow: "0 0 20px rgba(21, 128, 60, 0.4), 0 0 40px rgba(15, 185, 129, 0.2)",
          duration: 0.3,
        });
      }

      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      // Collapse button
      gsap.to(buttonRef.current, {
        width: "200px",
        duration: 0.4,
        ease: "power2.out",
      });

      // Hide input field
      gsap.to(inputFieldRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.2,
      });

      // Hide submit button
      gsap.to(submitButtonRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
      });

      // Show button text
      if (buttonTextRef.current) {
        gsap.to(buttonTextRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          delay: 0.2,
        });

        // Restart floating animation after a delay
        setTimeout(() => {
          if (buttonTextRef.current && !showInput) {
            gsap.to(buttonTextRef.current, {
              y: -1,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          }
        }, 1000);
      }

      // Stop shimmer
      if (shimmerRef.current) {
        gsap.killTweensOf(shimmerRef.current);
        gsap.set(shimmerRef.current, { x: "0%" });
      }

      // Reset glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          boxShadow: "0 0 10px rgba(21, 128, 60, 0.2)",
          duration: 0.3,
        });
      }
    }
  }, [showInput]);

  // Handle success animation
  useEffect(() => {
    if (isSubmitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3 }
      );

      // Animate checkmark
      const checkmark = successRef.current.querySelector(".checkmark");
      if (checkmark) {
        gsap.fromTo(
          checkmark,
          { scale: 0, rotation: 0 },
          { scale: 1, rotation: 360, duration: 0.5, delay: 0.1 }
        );
      }
    }
  }, [isSubmitted]);

  // Handle loading animation
  useEffect(() => {
    if (isLoading && submitButtonRef.current) {
      const spinner = submitButtonRef.current.querySelector(".spinner");
      if (spinner) {
        gsap.to(spinner, {
          rotation: 360,
          duration: 1,
          repeat: -1,
          ease: "none",
        });
      }
    }
  }, [isLoading]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email.trim() || isLoading || !showInput) return;
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await joinWaitlist(email.trim(), "", "website", {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "direct",
      });
      if (response.success) {
        success("Successfully joined waitlist!");
      } else {
        ErrorToast(response.error || "Error submitting email");
      }
      setIsSubmitted(true);
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setShowInput(false);
        setIsFocused(false);
      }, 3000);
    } catch (err) {
      ErrorToast(err instanceof Error ? err.message : "Unknown error submitting email");
      throw new Error(err instanceof Error ? err.message : "Unknown error submitting email");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle input key down to prevent form submission on every keystroke
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow Enter key to submit, prevent other keys from triggering form submission
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    setShowInput(true);
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setShowInput(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowInput(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!email.trim()) {
      setShowInput(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-fit mx-auto`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={buttonRef}
        className="relative overflow-hidden h-[60px] rounded-full bg-gradient-to-r from-white/20 to-white/10"
        style={{ width: "200px" }}
      >
        {/* Shimmer effect */}
        <div
          ref={shimmerRef}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
          style={{ transform: "translateX(0%)" }}
        />

        {/* Glow effect */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-full shadow-lg"
          style={{ boxShadow: "0 0 10px rgba(21, 128, 60, 0.2)" }}
        />

        <form onSubmit={handleSubmit} className="relative h-full autofill:">
          <div className="relative h-full flex items-center">
            {/* Button Text */}
            {!showInput && !isSubmitted && (
              <div
                ref={buttonTextRef}
                className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px] tracking-wide"
              >
                Join Waitlist
              </div>
            )}

            {/* Success Text */}
            {isSubmitted && (
              <div
                ref={successRef}
                className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px]"
                style={{ opacity: 0, transform: "scale(0.8) translateY(10px)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="checkmark w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  Welcome to the waitlist!
                </div>
              </div>
            )}

            {/* Input Field */}
            {showInput && !isSubmitted && (
              <div
                ref={inputFieldRef}
                className="flex-1 px-6"
                style={{ opacity: 0, transform: "translateX(-20px)" }}
              >
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  autoComplete="off"
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  className="w-full h-full bg-transparent text-white placeholder:text-white/70 text-[16px] font-medium outline-none border-none"
                  style={{
                    WebkitTextFillColor: "white",
                    WebkitBoxShadow: "inset 0 0 0px 1000px transparent",
                    boxShadow: "inset 0 0 0px 1000px transparent",
                  }}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Submit Button/Icon */}
            {showInput && !isSubmitted && (
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={!email.trim() || isLoading}
                className="absolute right-2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ opacity: 0, scale: 0.8 }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                }}
                onMouseDown={(e) => {
                  gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1 });
                }}
                onMouseUp={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.1, duration: 0.1 });
                }}
              >
                {isLoading ? (
                  <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ArrowSvg className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WaitlistButton;

// ------------------- Arrow SVG -------------------
function ArrowSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m4.031 8.917l15.477-4.334a.5.5 0 0 1 .616.617l-4.333 15.476a.5.5 0 0 1-.94.067l-3.248-7.382a.5.5 0 0 0-.256-.257L3.965 9.856a.5.5 0 0 1 .066-.94"
      ></path>
    </svg>
  );
}
