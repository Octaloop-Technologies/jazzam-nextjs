"use client";
import React from "react";

const Animation = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {/* Outer gray line */}
      <div className="relative w-[600px] h-[10px] bg-gray-300 overflow-hidden rounded-full">
        {/* Moving green line */}
        <div className="absolute left-0 top-0 h-[10px] w-[23px] bg-green-500 animate-moveLine"></div>

        <style jsx>{`
          @keyframes moveLine {
            0% {
              left: 0;
            }
            100% {
              left: calc(100% - 5px);
            }
          }

          .animate-moveLine {
            animation: moveLine 5.5s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Animation;
