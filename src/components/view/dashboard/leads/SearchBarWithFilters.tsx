"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  companyIndustryOptionsWithLabels,
  companySizeOptions,
  sortOptions,
  sortOrderOptions,
} from "@/lib/constants/leadConstants";

interface SearchFields{
  searchFields: {
    searchFilterTitle?: string,
    advanceFilters: string,
    clearAll: string,
    companyIndustry: string,
    companySize: string,
    allIndustries: string,
    allSizes: string,
    employees: string,
    sortBy: string,
    close: string,
    applyFilters: string,
    noFiltersApplied: string
  }
}

interface SearchFilters {
  query: string;
  companyIndustry: string;
  companySize: string;
  sortBy: string;
  sortOrder: string;
}

const SearchBarWithFilters = ({ searchFields }: SearchFields) => {
  // ======================================================
  // Hooks
  // ======================================================
  const router = useRouter();
  const searchParams = useSearchParams();

  // ======================================================
  // States
  // ======================================================
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    companyIndustry: "",
    companySize: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { searchFilterTitle, 
    advanceFilters, applyFilters, 
    clearAll, close, companyIndustry, 
    companySize, employees, sortBy, 
    allIndustries, allSizes, noFiltersApplied } = searchFields

  // ======================================================
  // Refs
  // ======================================================
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ======================================================
  // Initialize filters from URL params
  // ======================================================
  useEffect(() => {
    if (!searchParams) return;

    const initialFilters: SearchFilters = {
      query: searchParams.get("search") || "",
      companyIndustry: searchParams.get("companyIndustry") || "",
      companySize: searchParams.get("companySize") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };

    setFilters(initialFilters);
    setSearchValue(initialFilters.query);
  }, [searchParams]);

  // ======================================================
  // Close filters when clicking outside
  // ======================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Safety check for event target
      if (!event.target || !(event.target instanceof Node)) return;

      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  // ======================================================
  // Update URL
  // ======================================================
  const updateURL = (newFilters: SearchFilters) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams || undefined);

    // Update search params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        if (key === "query") {
          params.set("search", value);
        } else {
          params.set(key, value);
        }
      } else {
        if (key === "query") {
          params.delete("search");
        } else {
          params.delete(key);
        }
      }
    });

    // Reset to page 1 when searching/filtering
    params.delete("page");

    // Update URL
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl);

    // Reset searching state after a brief delay
    setTimeout(() => setIsSearching(false), 500);
  };

  // ======================================================
  // Handle search
  // ======================================================
  const handleSearch = () => {
    const newFilters = { ...filters, query: searchValue };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ======================================================
  // Handle filter
  // ======================================================
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      companyIndustry: "",
      companySize: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setSearchValue("");
    updateURL(clearedFilters);
    setIsFiltersOpen(false);
  };

  const hasActiveFilters = filters.query || filters.companyIndustry || filters.companySize;
  const activeFilterCount = [filters.query, filters.companyIndustry, filters.companySize].filter(
    Boolean
  ).length;

  return (
    <div className="relative" ref={filtersRef}>
      {/* Main Search Bar */}
      <div className="w-[370px] p-2.5 border border-gray-b rounded-4xl bg-white flex items-center gap-[6px]">
        {/* ---------------------------- Search Icon ---------------------------- */}
        <div className="bg-gray border-gray-b border rounded-full size-[40px] min-w-[40px] flex-center">
          {isSearching ? (
            <div className="animate-spin size-[20px] border-2 border-gray-150 border-t-pri rounded-full"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.0774 14.0999L16.6441 16.6666M15.8333 9.58325C15.8333 11.2409 15.1748 12.8306 14.0027 14.0027C12.8306 15.1748 11.2409 15.8333 9.58325 15.8333C7.92565 15.8333 6.33594 15.1748 5.16383 14.0027C3.99173 12.8306 3.33325 11.2409 3.33325 9.58325C3.33325 7.92565 3.99173 6.33594 5.16383 5.16383C6.33594 3.99173 7.92565 3.33325 9.58325 3.33325C11.2409 3.33325 12.8306 3.99173 14.0027 5.16383C15.1748 6.33594 15.8333 7.92565 15.8333 9.58325Z"
                stroke="black"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* ---------------------------- Search Input ---------------------------- */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder={searchFilterTitle || ""}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 h-full min-h-[40px] text-[17px] outline-none leading-normal 
                     placeholder:text-gray-200 placeholder:text-[14px]"
        />

        {/* ---------------------------- Filter Toggle Button ---------------------------- */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`cursor-pointer relative gap-1 bg-gray border-gray-b border rounded-full size-[40px] min-w-[40px] flex-center transition-all
            ${
              isFiltersOpen
                ? "bg-pri text-white border-pri"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 3h16a1 1 0 0 1 1 1v1.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707v6.305a1 1 0 0 1-1.243.97l-2-.5a1 1 0 0 1-.757-.97v-5.805a1 1 0 0 0-.293-.707L3.293 6.293A1 1 0 0 1 3 5.586V4a1 1 0 0 1 1-1"
            ></path>
          </svg>

          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ---------------------------- Advanced Filters Panel ---------------------------- */}
      {isFiltersOpen && (
        <div className="absolute top-full left-0 mt-2 w-full max-w-[600px] bg-white border border-gray-b rounded-2xl shadow-lg z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{advanceFilters}</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-danger gray-hover font-medium cursor-pointer"
              >
                {clearAll}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* ---------------------------- Company Industry Filter ---------------------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {companyIndustry}
              </label>
              <select
                value={filters.companyIndustry}
                onChange={(e) => handleFilterChange("companyIndustry", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pri focus:border-pri outline-none cursor-pointer"
              >
                <option value="">{allIndustries}</option>
                {companyIndustryOptionsWithLabels.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ---------------------------- Company Size Filter ---------------------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{companySize}</label>
              <select
                value={filters.companySize}
                onChange={(e) => handleFilterChange("companySize", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pri focus:border-pri outline-none cursor-pointer"
              >
                <option value="">{allSizes}</option>
                {companySizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} {employees}
                  </option>
                ))}
              </select>
            </div>

            {/* ---------------------------- Sort Options ---------------------------- */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{sortBy}</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pri focus:border-pri outline-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pri focus:border-pri outline-none cursor-pointer"
                >
                  {sortOrderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ---------------------------- Quick Actions ---------------------------- */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-n/30">
            <div className="text-sm text-gray-500">
              {hasActiveFilters ? `${activeFilterCount} filter(s) active` : noFiltersApplied}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-150 transition-colors cursor-pointer"
              >
                {close}
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-sm font-medium text-white bg-pri rounded-lg hover:bg-pri/90 transition-colors cursor-pointer"
              >
                {applyFilters}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarWithFilters;
