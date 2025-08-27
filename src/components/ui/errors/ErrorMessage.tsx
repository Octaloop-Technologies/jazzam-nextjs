import React from "react";
import Link from "next/link";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  link?: string;
  linkText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "We're experiencing technical difficulties loading the content. Our team has been notified and we're working to resolve this issue. Please refresh the page or try again in a few moments.",
  onRetry,
  retryButtonText,
  link,
  linkText,
}) => {
  return (
    <div className="py-4 overflow-y-auto x-padding outline-none">
      <div className="bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-400 text-sm font-medium text-center mb-2">{message}</p>
        {onRetry && (
          // <button
          //   onClick={onRetry}
          //   className="mt-2 bg-red-900/30 text-red-200 px-4 py-2 rounded hover:bg-red-900/50 transition-colors"
          // >
          //   {retryButtonText || "Retry"}
          // </button>
          <button
            onClick={onRetry}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
          >
            {retryButtonText || "Retry"}
          </button>
        )}
        {link && (
          <Link
            href={link}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            prefetch={false}
          >
            {linkText || "Return to Home"}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
