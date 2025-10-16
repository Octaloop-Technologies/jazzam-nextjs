interface Values{
  name: string,
  email: string,
  companyName: string,
  message: string
}

type MissingFields = {
  name: boolean;
  email: boolean;
  companyName: boolean;
  message: boolean;
};

const CustomTextarea = ({
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
  name?: string,
  setValue?: React.Dispatch<React.SetStateAction<Values>>;
  missingField: boolean,
  setMissingField?:React.Dispatch<React.SetStateAction<MissingFields>>
}) => {
  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    const { name, value } = e.target
    setValue && setValue((prev: Values) => ({ ...prev, [name]: value }))
    setMissingField && setMissingField((prev: MissingFields) => ({...prev, [name]: false}))
  }
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
        name={name}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e)}
      ></textarea>
      {missingField && <label className="text-red-500">Message is missing</label>}
    </div>
  );
};

export default CustomTextarea;
