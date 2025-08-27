"use client";

import React, { useEffect, useState } from "react";

const Loading = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    const burstTimer = setTimeout(() => setShowBurst(true), 100);
    const burstEndTimer = setTimeout(() => setShowBurst(false), 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(burstTimer);
      clearTimeout(burstEndTimer);
    };
  }, []);

  const logoContainerStyles: React.CSSProperties = {
    position: "relative",
    zIndex: 10,
    transform: isAnimated
      ? `scale(${isHovered ? 1.3 : 1}) rotateY(${isHovered ? 15 : 0}deg) rotateX(${
          isHovered ? 5 : 0
        }deg)`
      : "scale(0.8)",
    opacity: isAnimated ? 1 : 0,
    background: "var(--pri)",
    borderRadius: "50%",
    transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  const pathStyles = {
    strokeDasharray: 2000,
    strokeDashoffset: isAnimated ? 0 : 2000,
    stroke: "url(#paint0_linear_172_10341)",
    strokeWidth: 1,
    fill: isAnimated ? "url(#paint0_linear_172_10341)" : "var(--pri)",
    transition: "stroke-dashoffset 1.5s ease-out, fill 1s ease-out 0.8s",
  };

  return (
    <>
      <style>{`
        :root {
          --shadow-dy: 2;
          --shadow-stdDeviation: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); } /* Subtle float with slight rotation */
        }

        @keyframes burstFade {
          0% { opacity: 0.5; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }

        .logo-float {
          animation: ${isAnimated ? "float 4s ease-in-out infinite" : "none"};
        }

        .logo-glow {
          box-shadow:
            0 0 10px var(--pri) 0.2,
            0 0 20px var(--pri) 0.1;
          border-radius: 50%; // Fixed to match container for a circular glow
          padding: 10px;
          animation: glowPulse 3s ease-in-out infinite alternate;
          transition: box-shadow 0.3s ease-in-out, --shadow-dy 0.3s ease-in-out, --shadow-stdDeviation 0.3s ease-in-out; /* Smooth transition for hover glow and shadow */
        }

        .logo-glow.hovered {
          box-shadow:
            0 0 25px var(--pri) 0.5,
            0 0 50px var(--pri) 0.3,
            0 0 75px var(--pri) 0.2;
          --shadow-dy: 4;
          --shadow-stdDeviation: 2;
        }

        @keyframes glowPulse {
          0% {
            box-shadow:
              0 0 10px var(--pri) 0.2,
              0 0 20px var(--pri) 0.1;
          }
          100% {
            box-shadow:
              0 0 15px var(--pri) 0.3,
              0 0 30px var(--pri) 0.2;
          }
        }

        .burst-effect {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, var(--pri) 0%, transparent 70%);
          border-radius: 50%;
          animation: burstFade 0.7s ease-out forwards;
          pointer-events: none;
        }

        .path-breathe {
          animation: breathe 3s ease-in-out infinite alternate;
        }

      `}</style>

      <section className="flex items-center justify-center w-full h-screen relative overflow-hidden bg-bg">
        {showBurst && <div className="burst-effect"></div>}
        <div
          style={logoContainerStyles}
          className={`logo-float ${isAnimated ? "logo-glow" : ""} ${isHovered ? "hovered" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`size-[60px]`}
            viewBox="0 0 40 40"
            fill="none"
          >
            <g clipPath="url(#clip0_172_10341)">
              <g filter="url(#filter0_d_172_10341)">
                <path
                  d="M17.6719 9.3371L18.1403 14.3846L20.8982 13.0317V25.2081L16.8914 27.3937V23.1787H12V36.5L27.871 28.1222L27.1425 4.60181L17.6719 9.3371Z"
                  fill="url(#paint0_linear_172_10341)"
                  style={{
                    ...pathStyles,
                    transitionDelay: "0.1s",
                  }}
                  className="path-breathe"
                />
                <path
                  d="M24.8009 3.82127L19.3891 6.47511L19.5452 3.50905L22.4072 2L24.8009 3.82127Z"
                  fill="url(#paint1_linear_172_10341)"
                  style={{
                    ...pathStyles,
                    transitionDelay: "0.5s",
                  }}
                  className="path-breathe"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_d_172_10341"
                x="7.47541"
                y="2"
                width="24.9203"
                height="43.5492"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="var(--shadow-dy, 2)" />
                <feGaussianBlur stdDeviation="var(--shadow-stdDeviation, 1)" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_172_10341"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_172_10341"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_172_10341"
                x1="15.1766"
                y1="2.1165"
                x2="13.887"
                y2="34.5228"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#E0E0E0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_172_10341"
                x1="15.1766"
                y1="2.1165"
                x2="13.887"
                y2="34.5228"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#E0E0E0" />
              </linearGradient>
              <clipPath id="clip0_172_10341">
                <rect width="40" height="40" rx="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Loading;
