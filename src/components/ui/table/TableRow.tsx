import React from "react";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`grid grid-cols-5 items-center gap-4 py-5 px-[30px] border-b border-gray-n/30 last:border-b-0 hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default React.memo(TableRow);
