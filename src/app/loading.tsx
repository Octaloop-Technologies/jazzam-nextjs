"use client";

import React from "react";

const Loading = () => {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .loading-container {
          animation: fadeIn 0.4s ease-out;
        }

        .logo-circle {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: var(--pri);
          border-radius: 50%;
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.25);
        }

        .loading-spinner {
          position: absolute;
          width: 90px;
          height: 90px;
          border: 3px solid rgba(34, 197, 94, 0.1);
          border-top: 3px solid var(--pri);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          top: -5px;
          left: -5px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          position: relative;
          z-index: 2;
        }

      `}</style>

      <section className="flex flex-col items-center justify-center w-full h-dvh bg-bg">
        <div className="loading-container">
          <div className="relative">
            <div className="loading-spinner"></div>
            <div className="logo-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="logo-icon"
                viewBox="0 0 40 40"
                fill="none"
              >
                <g clipPath="url(#clip0_172_10341)">
                  <path
                    d="M17.6719 9.3371L18.1403 14.3846L20.8982 13.0317V25.2081L16.8914 27.3937V23.1787H12V36.5L27.871 28.1222L27.1425 4.60181L17.6719 9.3371Z"
                    fill="white"
                  />
                  <path
                    d="M24.8009 3.82127L19.3891 6.47511L19.5452 3.50905L22.4072 2L24.8009 3.82127Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_172_10341">
                    <rect width="40" height="40" rx="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
