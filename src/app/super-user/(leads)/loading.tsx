import TabContentLoader from "@/components/view/dashboard/leads/TabContentLoader";
import React from "react";

const Loading = () => {
  return (
    <section>
      {/* Header skeleton */}
      <div className="flex-between gap-1.5">
        <div className="h-[32px] w-[300px] bg-gray-150 rounded animate-pulse"></div>
        <div className="flex items-center gap-2.5">
          {/* Search bar skeleton */}
          <div className="h-[51.5px] w-[300px] bg-gray-150 rounded-4xl animate-pulse"></div>

          {/* Tabs skeleton */}
          <div className="flex gap-2">
            <div className="h-[51.5px] w-[80px] bg-gray-150 rounded-lg animate-pulse"></div>
            <div className="h-[51.5px] w-[80px] bg-gray-150 rounded-lg animate-pulse"></div>
            <div className="h-[51.5px] w-[80px] bg-gray-150 rounded-lg animate-pulse"></div>
            <div className="h-[51.5px] w-[80px] bg-gray-150 rounded-lg animate-pulse"></div>
            <div className="h-[51.5px] w-[80px] bg-gray-150 rounded-lg animate-pulse"></div>
          </div>

          {/* Split line */}
          <div className="h-[51.5px] w-[1px] bg-gray-b" />

          {/* Refresh button skeleton */}
          <div className="h-[51.5px] w-[100.5px] bg-gray-150 rounded-4xl animate-pulse"></div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="mt-[18px] flex gap-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-full py-[30px] pl-[40px] bg-white border border-gray-b rounded-3xl flex items-center gap-2.5"
          >
            <div className="size-[40px] bg-gray-150 rounded-xl animate-pulse"></div>
            <div className="flex flex-col gap-0.5 leading-none">
              <div className="h-[16px] w-[100px] bg-gray-150 rounded animate-pulse"></div>
              <div className="h-[28px] w-[60px] bg-gray-150 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <TabContentLoader />
    </section>
  );
};

export default Loading;
