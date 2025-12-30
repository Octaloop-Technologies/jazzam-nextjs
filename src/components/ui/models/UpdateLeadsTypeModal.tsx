
interface UpdateLeadsTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    language: any,
    leadId?: string,
    setAssignLeadsType: any
}


const UpdateLeadsTypeModal: React.FC<UpdateLeadsTypeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    language,
    setAssignLeadsType
}) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]" onClick={handleOutsideClick}>
            <div className="bg-white pt-[30px] p-5 rounded-3xl max-w-[550px] w-full text-center shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]">
                <div className="flex justify-center mb-4">
                </div>
                {/* <h2 className="text-[18px] font-[500] leading-none mb-1">{language?.deleteLeadHeading}</h2> */}
                {/* <p className="text-gray-200 mb-8 leading-none">
          {language?.deleteLeadDesc}
        </p> */}
                <div className={`overflow-y-auto h-[190px]`}>
                    <select name="" id="" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignLeadsType(e.target.value)}>
                        <option value="">-- Choose a skill type --</option>
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                        <option value="new">New</option>
                        <option value="qualified">Qualified</option>
                    </select>
                    <div className="flex justify-right mt-5 gap-5">
                    <button className="bg-[#15803c] text-white w-26 p-2 rounded text-md cursor-pointer" onClick={onConfirm}>
                        Save
                    </button>
                    <button className="bg-yellow-400 text-white w-26 p-2 rounded text-md cursor-pointer" onClick={onClose}>
                        Cancel
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateLeadsTypeModal