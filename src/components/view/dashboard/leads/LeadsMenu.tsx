"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { DeleteSvg, SendFollowUpSvg, ViewDetailsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import DeleteLeadModal from "@/components/ui/models/DeleteLeadModal";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";
import { deleteLead } from "@/app/super-user/(leads)/action";

const LeadsMenu = ({
  lead,
  showViewDetails = true,
  customTrigger,
  navigate = "/super-user",
}: {
  lead: Lead;
  showViewDetails?: boolean;
  customTrigger?: React.ReactNode;
  navigate?: string;
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ======================================================
  // Hooks
  // ======================================================
  const router = useRouter();
  const { success: ToastSuccess, error: ToastError } = useToast();

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
        ToastSuccess(result.message);
        // Refresh the page to update the leads list
        if (navigate) {
          router.push(navigate);
        } else {
          router.refresh();
        }
        handleCloseDeleteModal();
      } else {
        ToastError(result.error || "Failed to delete lead");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting lead:", error);
      }
      ToastError("An unexpected error occurred while deleting the lead");
    } finally {
      setIsDeleting(false);
    }
  };

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
                      transition-all duration-200 ease-in-out hover:rotate-90 hover:bg-gray-100 hover:border-gray-200"
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
                View details
              </div>
              <RightArrowSvg />
            </Link>
          </DropdownItem>
        )}
        <DropdownItem>
          <Link
            href={`/super-user/leads/${lead._id}/${lead.notes}`}
            className="flex-between w-full hover:text-gray-200"
            prefetch={false}
          >
            <div className="flex gap-1">
              <SendFollowUpSvg />
              Send follow-up
            </div>
            <RightArrowSvg />
          </Link>
        </DropdownItem>
        <DropdownItem>
          <button
            className="w-full text-danger flex gap-1 hover:text-gray-200"
            onClick={handleDeleteClick}
          >
            <DeleteSvg />
            Delete lead
          </button>
        </DropdownItem>
      </Dropdown>

      {/* ---------------------------- delete lead modal ---------------------------- */}
      <DeleteLeadModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

export default LeadsMenu;
