"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { DeleteSvg, SendFollowUpSvg, ViewDetailsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import DeleteLeadModal from "@/components/ui/models/DeleteLeadModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";
import { deleteLead, updateLead } from "@/lib/api/leads";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { useAppSelector } from "@/redux/store";

const LeadsMenu = ({
  lead,
  showViewDetails = true,
  customTrigger,
  navigate = "/super-user",
  isDeleted,
  setIsDeleted,
  showQualifiedButton
}: {
  lead: Lead;
  showViewDetails?: boolean;
  customTrigger?: React.ReactNode;
  navigate?: string;
  isDeleted?: boolean
  setIsDeleted?: (value: boolean) => void,
  showQualifiedButton: boolean
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [language, setLanguage] = useState<any>()
  const lang = getCurrentLang();
  const { user } = useAppSelector(state => state.auth);

  // ======================================================
  // Hooks
  // ======================================================
  const router = useRouter();
  const { success: ToastSuccess, error: ToastError } = useToast();

  useEffect(() => {
    const fetchLanguage = async () => {
      const dict = (await getDictionary(lang))?.superUser?.navbar?.leads;
      setLanguage(dict);
    }
    fetchLanguage()
  }, [])

  // ======================================================
  // Delete lead
  // ======================================================
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await deleteLead({ id: lead._id });
      if (result.success) {
        ToastSuccess(language?.deleteSuccessMsg);
        setIsDeleted?.(!isDeleted);
        // Refresh the page to update the leads list
        if (navigate) {
          router.push(navigate);
        } else {
          router.refresh();
        }
        handleCloseDeleteModal();
      } else {
        ToastError(language?.failedDeleteLead);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting lead:", error);
      }
      ToastError(language?.failedDeleteLead);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeadQualified = async () => {
    if (!lead?._id) return;
    try {
      const settings = {
        id: lead._id,
        status: "qualified",
        companyId: user?._id
      };
      const result = await updateLead(settings);
      if (result?.success) {
        ToastSuccess(language?.qualifiedLeadMessage);
      } else {
        ToastError(language?.failedLeadUpdate);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating lead:", error);
      }
      ToastError(language?.failedLeadUpdate);
    }
  }

  return (
    <>
      {/* ---------------------------- dropdown ---------------------------- */}
      <Dropdown
        trigger={
          customTrigger ? (
            customTrigger
          ) : (
            <button
              className="size-[40px] flex-center rounded-full border border-gray-150 
                      transition-all duration-200 ease-in-out hover:rotate-90 hover:bg-gray-100 hover:border-gray-200 cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="size-1 bg-black rounded-full" />
                <span className="size-1 bg-black rounded-full" />
                <span className="size-1 bg-black rounded-full" />
              </div>
            </button>
          )
        }
        dropDownClass="w-[212px] p-[15px]"
        position="bottom-left"
        gap={20}
      >
        {showViewDetails && (
          <DropdownItem>
            <Link
              href={`/super-user/leads/${lead._id}`}
              className="flex-between w-full hover:text-gray-200"
              prefetch={false}
            >
              <div className="flex gap-1">
                <ViewDetailsSvg />
                {language?.viewDetails}
              </div>
              <RightArrowSvg />
            </Link>
          </DropdownItem>
        )}
        <DropdownItem>
          <Link
            href={`/super-user/leads/${lead._id}/${lead?.fullName}?userEmail=${lead?.email}`}
            className="flex-between w-full hover:text-gray-200"
            prefetch={false}
          >
            <div className="flex gap-1">
              <SendFollowUpSvg />
              {language?.sendFollowUp}
            </div>
            <RightArrowSvg />
          </Link>
        </DropdownItem>

        {showQualifiedButton && <DropdownItem>
          <button
            className="w-full text-purple-400 flex gap-1 hover:text-gray-200 cursor-pointer"
            onClick={handleLeadQualified}
          >
            <QualifiedSvg className="hover:text-gray-200" />
            {language?.markAsQualified}
          </button>
        </DropdownItem>}

        <DropdownItem>
          <button
            className="w-full text-danger flex gap-1 hover:text-gray-200 cursor-pointer"
            onClick={handleDeleteClick}
          >
            <DeleteSvg />
            {language?.deleteLead}
          </button>
        </DropdownItem>
      </Dropdown>

      {/* ---------------------------- delete lead modal ---------------------------- */}
      <DeleteLeadModal
        language={language}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

export default LeadsMenu;

const QualifiedSvg = ({ className = "size-5" }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" className={className}>
      <path d="M256 64
           c26 0 47 -16 70 -8
           s38 30 60 42
           s50 10 66 30
           s14 46 26 68
           s34 38 34 64
           s-22 47 -34 70
           s-10 52 -26 72
           s-44 22 -66 34
           s-36 36 -60 44
           s-44 -8 -70 -8
           s-47 16 -70 8
           s-38 -30 -60 -44
           s-50 -12 -66 -34
           s-14 -48 -26 -72
           s-34 -38 -34 -70
           s22 -48 34 -64
           s10 -48 26 -68
           s44 -18 66 -30
           s36 -34 60 -42
           s44 8 70 8z"
        fill="currentColor" stroke="#000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />

      <circle cx="256" cy="256" r="96"
        fill="none" stroke="#000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />

      <path d="M220 260 L250 292 L300 224"
        fill="none" stroke="#000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
}


