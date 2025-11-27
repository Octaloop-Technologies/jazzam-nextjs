"use client";

interface PrimaryButtonProps {
  onClick?: () => void;
  onSubmit?: () => void;
  className?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  iconRightClass?: string;
  titleClass?: string;
  gradientClass?: string;
  wrapperClass?: string;
  bordered?: boolean;
  disabledIcon?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  onSubmit,
  className = "w-full h-[60px]",
  title,
  type = "button",
  children,
  iconLeft,
  iconRight,
  disabled = false,
  iconRightClass,
  bordered = false,
  titleClass = "text-[14px] leading-normal",
  disabledIcon = true,
  isLoading
}) => {
  return (
    <button
      onClick={onClick}
      onSubmit={onSubmit}
      type={type}
      disabled={disabled}
      className={`flex-center gap-[6px] leading-normal rounded-4xl transition-all duration-200 relative cursor-pointer
          ${disabled ? "cursor-not-allowed" : "hover:brightness-110"}
          ${className}
          ${bordered ? "border border-pri text-pri bg-white" : "bg-pri text-white"}
          relative z-10`}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {isLoading && (
        <div className="inset-0 flex-center">
          <div className="w-4 h-4 border-t-2 border-b-2 border-sec rounded-full animate-spin"></div>
        </div>
      )}
      {title && <span className={titleClass}>{title}</span>}
      {iconRight && <span className={`${iconRightClass}`}>{iconRight}</span>}
      {children}
    </button>
  );
};

export default PrimaryButton;
