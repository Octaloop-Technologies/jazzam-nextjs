import { ChangeEvent, TextareaHTMLAttributes } from "react";

interface TextareaCompProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  labelClass?: string;
}

const TextareaComp = ({
  label,
  error,
  value,
  onChange,
  className = "",
  placeholder,
  disabled,
  rows = 4,
  labelClass = "block mb-1 font-[500] w-fit",
  ...props
}: TextareaCompProps) => {
  return (
    <div className="w-full">
      {label && <label className={labelClass}>{label}</label>}
      <textarea
        className={`
          w-full
          px-3
          py-2
          text-[20.19px]
          rounded-lg
          outline-none
          focus:ring-1
          resize-none
          disabled:cursor-not-allowed
          placeholder:text-placeholder
          placeholder:capitalize
          ${error ? "focus:ring-red-500" : "focus:ring-pri"}
          ${className}
        `}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaComp;
