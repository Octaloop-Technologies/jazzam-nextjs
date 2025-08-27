"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { DeleteSvg, SendFollowUpSvg, ViewDetailsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import DeleteLeadModal from "@/components/ui/models/DeleteLeadModal";
import { useState } from "react";
import LeadDetailModal from "./LeadDetailModal";

const FollowUpMenu = ({
  lead,
  customTrigger,
  showSendNow = false,
}: {
  lead: Lead;
  customTrigger?: React.ReactNode;
  showSendNow?: boolean;
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(lead.id);
  const [isLeadDetailModalOpen, setIsLeadDetailModalOpen] = useState(false);

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

  // ======================================================
  // Lead detail modal
  // ======================================================
  const handleCloseLeadDetailModal = () => {
    setIsLeadDetailModalOpen(false);
    setSelectedLeadId(lead.id);
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
        <DropdownItem>
          <button
            className="flex-between w-full hover:text-gray-200"
            onClick={() => setIsLeadDetailModalOpen(true)}
          >
            <div className="flex gap-1">
              <ViewDetailsSvg />
              View details
            </div>
            <RightArrowSvg />
          </button>
        </DropdownItem>
        {showSendNow && (
          <DropdownItem>
            <button className="flex-between w-full hover:text-gray-200">
              <div className="flex gap-1">
                <SendFollowUpSvg />
                Send Now
              </div>
              <RightArrowSvg />
            </button>
          </DropdownItem>
        )}
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

      {/* ---------------------------- lead detail modal ---------------------------- */}
      <LeadDetailModal
        isOpen={isLeadDetailModalOpen}
        lead={lead}
        onClose={handleCloseLeadDetailModal}
        onConfirm={handleConfirmDelete}
        leadId={selectedLeadId}
      />
    </>
  );
};

export default FollowUpMenu;
