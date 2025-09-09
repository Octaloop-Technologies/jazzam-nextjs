const TabContentLoader = () => {
  return (
    <div className="mt-2.5 bg-white py-8 rounded-3xl border border-gray-b">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4 px-[30px]">
        <div className="leading-none">
          <div className="h-5 bg-gray-150 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded w-80 animate-pulse"></div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center gap-2">
          <div className="size-[30px] bg-gray-150 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded w-20 animate-pulse"></div>
          <div className="size-[30px] bg-gray-150 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Table header skeleton */}
      <div className="px-[30px] pb-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="h-4 bg-gray-150 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-150 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table rows skeleton */}
      <div className="px-[30px] py-8">
        {/* Loading rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0 animate-pulse"
          >
            {/* Content skeleton */}
            <div className="flex-1 grid grid-cols-5 items-center gap-4 px-1">
              {/* Lead info */}
              <div className="flex items-center gap-3">
                <div className="size-[40px] rounded-full bg-gray-150"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-150 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-150 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-150 rounded w-2/3"></div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <div className="h-8 bg-gray-150 rounded-lg w-28"></div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2">
                <div className="size-4 bg-gray-150 rounded-full"></div>
                <div className="h-4 bg-gray-150 rounded w-1/6"></div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-150 rounded w-1/2"></div>
              </div>

              {/* LinkedIn/Company Size */}
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-150 rounded w-1/2"></div>
                <div className="size-[40px] bg-gray-150 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContentLoader;
