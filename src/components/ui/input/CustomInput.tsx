const CustomInput = ({
  label,
  placeholder,
  className,
  error,
  value,
  name,
  setValue,
  missingField,
  setMissingField
}: {
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  value?: string,
  name: string,
  setValue?: React.Dispatch<React.SetStateAction<any>>,
  missingField?: boolean,
  setMissingField: React.Dispatch<React.SetStateAction<any>>
}) => {
  function onChange(e:React.ChangeEvent<HTMLInputElement>){

    const { name, value } = e.target;

    setValue && setValue((prev: any) => ({ ...prev, [name]: value }))
    setMissingField((prev: any) => ({ ...prev, [name]: false }))
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
        name={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e) }
        />
        {missingField && <label className="text-red-500">{label} is missing</label>}
    </div>
  );
};

export default CustomInput;
