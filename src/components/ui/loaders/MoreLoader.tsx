import React from "react";

const MoreLoader = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-2 text-white/60 text-sm">
      <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
      {message}
    </div>
  );
};

export default MoreLoader;
