const CustomInput = ({
  label,
  placeholder,
  className,
  error,
}: {
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
}) => {
  return (
    <div>
      <label className="block font-[500] mb-2">{label} *</label>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full h-[48px] px-4 outline-none placeholder:text-placeholder border-b border-gray-b 
                transition-all duration-200
                ${className} 
                ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-pri focus:border-pri"}`}
      />
    </div>
  );
};

export default CustomInput;
