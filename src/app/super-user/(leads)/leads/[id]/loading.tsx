import React from "react";

const loading = () => {
  return (
    <section>
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4 py-2 border-t border-b border-gray-b">
        <div className="h-4 bg-gray-150 rounded w-16 animate-pulse"></div>
        <div className="h-4 bg-gray-150 rounded w-2 animate-pulse"></div>
        <div className="h-4 bg-gray-150 rounded w-24 animate-pulse"></div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 wrapper">
        <div className="flex-between gap-2.5 w-full items-stretch">
          {/* Lead Details Skeleton */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="flex-between gap-2.5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="size-[60px] rounded-full bg-gray-150 animate-pulse"></div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <div className="h-5 bg-gray-150 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-150 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-150 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2.5 w-[107px] h-[30px] bg-gray-150 rounded-lg animate-pulse"></div>
              </div>

              <div className="flex-col gap-1 leading-none">
                <div className="h-6 bg-gray-150 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-150 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Lead Score Skeleton */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <div className="h-4 bg-gray-150 rounded w-20 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-150 rounded-full animate-pulse"></div>
          </div>

          {/* Menu Skeleton */}
          <div className="pl-3 w-full max-w-[5%]">
            <div className="size-[40px] bg-gray-150 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 w-full">
          {/* Contact Information Skeleton */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="h-4 bg-gray-150 rounded w-32 animate-pulse mb-2"></div>
            <div className="mt-4 flex flex-col gap-[26px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="flex-between gap-2.5" key={index}>
                  <div className="flex gap-2">
                    <div className="mt-0.5 size-4 bg-gray-150 rounded animate-pulse"></div>
                    <div className="flex flex-col gap-1">
                      <div className="h-3 bg-gray-150 rounded w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-150 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="size-4 bg-gray-150 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Information Skeleton */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <div className="h-4 bg-gray-150 rounded w-32 animate-pulse mb-2"></div>
            <div className="mt-4 flex flex-col gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <div className="h-3 bg-gray-150 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-150 rounded w-28 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>

        {/* Lead Qualification Skeleton */}
        <div className="flex-between gap-2.5 w-full items-stretch">
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="h-4 bg-gray-150 rounded w-32 animate-pulse mb-2"></div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-150 rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-gray-150 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-150 rounded w-16 animate-pulse"></div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-150 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-150 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-150 rounded w-12 animate-pulse"></div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-150 rounded w-12 animate-pulse"></div>
                <div className="h-3 bg-gray-150 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-150 rounded w-16 animate-pulse"></div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-150 rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-gray-150 rounded w-28 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-150 rounded w-16 animate-pulse"></div>
            </div>
          </div>
          <div className="p-[30px] w-full max-w-[40%]" aria-hidden="true" />
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>

        {/* Skills & Interests Skeleton */}
        <div className="flex-between gap-2.5 w-full items-stretch pb-5">
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="h-4 bg-gray-150 rounded w-32 animate-pulse mb-2"></div>
            <div className="mt-4 flex flex-col gap-4">
              {/* Skills Section */}
              <div className="flex flex-col gap-2.5">
                <div className="h-3 bg-gray-150 rounded w-24 animate-pulse"></div>
                <div className="flex flex-wrap gap-2.5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-gray-150 rounded-4xl w-20 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Interests Section */}
              <div className="flex flex-col gap-2.5">
                <div className="h-3 bg-gray-150 rounded w-28 animate-pulse"></div>
                <div className="flex flex-wrap gap-2.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-gray-150 rounded-4xl w-24 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-[30px] w-full max-w-[40%]" aria-hidden="true" />
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default loading;
