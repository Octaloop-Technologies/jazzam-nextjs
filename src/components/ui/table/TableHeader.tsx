import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={`grid grid-cols-5 gap-4 py-3 px-[30px] bg-gray/60 text-sm font-[500] ${className}`}
    >
      {children}
    </div>
  );
};

export default React.memo(TableHeader);
