const CustomTextarea = ({
  label,
  placeholder,
  className,
  error,
  value,
  setValue
}: {
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  value?: string,
  setValue?: (value: string) => void;
}) => {
  return (
    <div>
      <label className="block font-[500] mb-2">{label}</label>
      <textarea
        rows={4}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-b border-gray-b outline-none placeholder:text-placeholder resize-none 
            transition-all duration-200
            ${className} 
            ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-pri focus:border-pri"}`}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue && setValue(e.target.value)}
      ></textarea>
    </div>
  );
};

export default CustomTextarea;
