"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useEffect } from "react";

interface TabNavigationProps {
  searchQuery?: string | null | undefined;
  companyIndustryFilter?: string | null | undefined;
  sortBy: string;
  sortOrder: string;
  statusFilter?: string | null | undefined;
  tabNavigationText?: {
    all?: string | undefined,
    new?: string | undefined,
    hot?: string | undefined,
    warm?: string | undefined,
    cold?: string | undefined
  }
}

const TabNavigation = ({
  searchQuery,
  companyIndustryFilter,
  sortBy,
  sortOrder,
  statusFilter,
  tabNavigationText
}: TabNavigationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingTab, setLoadingTab] = useState<string | null>(null);

  // =======================================================
  // Create tab URL
  // =======================================================
  const createTabUrl = (status?: string) => {
    const currentParams = new URLSearchParams();
    if (searchQuery) currentParams.set("search", searchQuery);
    if (companyIndustryFilter) currentParams.set("companyIndustry", companyIndustryFilter);
    if (sortBy !== "createdAt") currentParams.set("sortBy", sortBy);
    if (sortOrder !== "desc") currentParams.set("sortOrder", sortOrder);
    if (status) currentParams.set("status", status);

    return currentParams.toString() ? `?${currentParams.toString()}` : "?";
  };

  // =======================================================
  // Handle tab click
  // =======================================================
  const handleTabClick = (tabStatus?: string) => {
    const tabName = tabStatus || "all";
    setLoadingTab(tabName);

    startTransition(() => {
      router.push(createTabUrl(tabStatus));
    });
  };

  // =======================================================
  // Reset loading state when navigation completes
  // =======================================================
  useEffect(() => {
    if (!isPending) {
      setLoadingTab(null);
    }
  }, [isPending]);

  // =======================================================
  // Tab Button
  // =======================================================
  const TabButton = ({
    status,
    label,
    isActive,
  }: {
    status?: string;
    label: string | undefined;
    isActive: boolean;
  }) => {
    const tabName = status || "all";
    const isLoading = loadingTab === tabName;

    return (
      <button
        onClick={() => handleTabClick(status)}
        disabled={isLoading}
        className={`h-full px-5 rounded-4xl overflow-hidden flex-center relative transition-all duration-200 
          ${
            isActive
              ? "bg-[#0fb98121] text-pri"
              : "bg-white hover:outline outline-gray-b gray-hover"
          } ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className={`flex items-center gap-2`}>{label}</div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute w-full h-full bg-[#0fb98121] top-0 animate-right blur-sm"></div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex gap-[15px] h-[61px] text-[14px] border border-gray-b p-2.5 rounded-4xl">
      <TabButton label={tabNavigationText?.all} isActive={!statusFilter} />
      <TabButton status="new" label={tabNavigationText?.new} isActive={statusFilter === "new"} />
      <TabButton status="hot" label={tabNavigationText?.hot} isActive={statusFilter === "hot"} />
      <TabButton status="warm" label={tabNavigationText?.warm} isActive={statusFilter === "warm"} />
      <TabButton status="cold" label={tabNavigationText?.cold} isActive={statusFilter === "cold"} />
    </div>
  );
};

export default TabNavigation;
