import Link from "next/link";
import React from "react";

interface EmptyResultsProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  refreshButtonText?: string;
  icon?: React.ReactNode;
  link?: string;
  linkText?: string;
}

const EmptyResults: React.FC<EmptyResultsProps> = ({
  title = "No Items Found",
  message = "There are currently no items to display. Please check back later for updates.",
  onRefresh,
  refreshButtonText = "Refresh",
  link,
  linkText = "Go Back",
  icon,
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mx-auto text-gray-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  return (
    <div className="py-4 overflow-y-auto x-padding outline-none">
      <div className="bg-gray-800/50 p-6 rounded-lg text-center">
        {icon || defaultIcon}
        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{message}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-pri text-white rounded-md hover:bg-pri/80 transition-colors"
          >
            {refreshButtonText}
          </button>
        )}
        {link && (
          <Link
            href={link}
            prefetch={false}
            className="px-4 py-2 bg-pri text-white rounded-md hover:bg-pri/80 transition-colors"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyResults;
