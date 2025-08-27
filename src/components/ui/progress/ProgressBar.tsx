import React from "react";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = "bg-green-500" }) => {
  return (
    <div>
      <h1 className="text-[28px] leading-[20px] font-[600] mt-5 text-se text-sec text-center">
        {progress}%
      </h1>
      <div className="mt-2.5 w-full bg-[#F7F7F7] rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
