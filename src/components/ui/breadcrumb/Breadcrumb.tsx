"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import Link from "next/link";
import { Fragment } from "react";

interface BreadcrumbProps {
  segments: {
    label: string;
    path?: string;
  }[];
}

const Breadcrumb = ({ segments }: BreadcrumbProps) => {
  return (
    <nav className="flex py-[7px] border-t border-b border-gray-b" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {segments.map((segment, index) => (
          <Fragment key={segment.label}>
            <li className="inline-flex items-center">
              {segment.path ? (
                <Link
                  href={segment.path}
                  prefetch={false}
                  className={`inline-flex items-center text-sm font-medium 
                    ${
                      index === segments.length - 1
                        ? "text-pri"
                        : "text-gray-200 hover:text-gray-300"
                    }`}
                >
                  {segment.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-500">{segment.label}</span>
              )}
            </li>
            {index < segments.length - 1 && (
              <li>
                <div
                  className={`flex items-center 
                    ${index === segments.length - 2 ? "text-pri" : "text-gray-200"}`}
                >
                  <RightArrowSvg />
                </div>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
