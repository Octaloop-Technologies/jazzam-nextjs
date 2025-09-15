"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { DeleteSvg, SendFollowUpSvg, ViewDetailsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import DeleteLeadModal from "@/components/ui/models/DeleteLeadModal";
import Link from "next/link";
import { useState } from "react";

const LeadsMenu = ({
  lead,
  showViewDetails = true,
  customTrigger,
}: {
  lead: Lead;
  showViewDetails?: boolean;
  customTrigger?: React.ReactNode;
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(lead.id);

  // ======================================================
  // Delete lead
  // ======================================================
  const handleDeleteClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedLeadId(lead.id);
  };

  const handleConfirmDelete = () => {
    // Here you would implement the actual lead deletion logic
    console.log(`Deleting lead with ID: ${selectedLeadId}`);
    // After deletion, you might want to refresh the leads data or remove the lead from the state
    handleCloseDeleteModal();
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
              href={`/super-user/leads/${lead.id}`}
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
            href={`/super-user/leads/${lead.id}/${lead.followUp}`}
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
            onClick={() => handleDeleteClick(lead.id)}
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
        leadId={selectedLeadId}
      />
    </>
  );
};

export default LeadsMenu;
