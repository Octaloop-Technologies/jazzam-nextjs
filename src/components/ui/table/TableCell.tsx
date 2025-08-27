import React from "react";

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <div className={`flex items-center ${className}`}>{children}</div>;
};

export default React.memo(TableCell);
