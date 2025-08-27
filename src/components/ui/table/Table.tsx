import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return <div className={`w-full ${className}`}>{children}</div>;
};

export default React.memo(Table);
