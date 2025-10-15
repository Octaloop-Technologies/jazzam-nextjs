const CustomInput = ({
  label,
  placeholder,
  className,
  error,
  value,
  setValue,
  missingField,
  setMissingField
}: {
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  value?: string,
  setValue?: (value:string) => void,
  missingField?: boolean,
  setMissingField: (value: boolean) => void
}) => {
  function onChange(e:React.ChangeEvent<HTMLInputElement>){
    setValue && setValue(e.target.value)
    setMissingField(false);
  }
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
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e) }
        />
        {missingField && <label className="text-red-500">{label} is missing</label>}
    </div>
  );
};

export default CustomInput;
