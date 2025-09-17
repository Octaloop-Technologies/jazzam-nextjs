"use client";

import { RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { DeleteSvg, SendFollowUpSvg, ViewDetailsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import DeleteLeadModal from "@/components/ui/models/DeleteLeadModal";
import { useState } from "react";
import LeadDetailModal from "./LeadDetailModal";
import ScadualeModal from "./ScadualeModal";

const FollowUpMenu = ({
  lead,
  customTrigger,
  showSendNow = false,
}: {
  lead: Lead & { name: string };
  customTrigger?: React.ReactNode;
  showSendNow?: boolean;
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(lead._id);
  const [isLeadDetailModalOpen, setIsLeadDetailModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // ======================================================
  // Delete lead
  // ======================================================
  const handleDeleteClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedLeadId(lead._id);
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
    setSelectedLeadId(lead._id);
  };

  // ======================================================
  // Schedule follow-up modal
  // ======================================================
  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const handleConfirmSchedule = (date: Date) => {
    // Here you would implement the actual scheduling logic
    console.log(`Scheduling follow-up for lead ${lead._id} on ${date.toLocaleDateString()}`);
    // After scheduling, you might want to update the lead status or refresh the data
    handleCloseScheduleModal();
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
        <DropdownItem>
          <button
            className="flex-between w-full hover:text-gray-200"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <div className="flex gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Schedule Follow-up
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
            onClick={() => handleDeleteClick(lead._id)}
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

      {/* ---------------------------- schedule follow-up modal ---------------------------- */}
      <ScadualeModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onConfirm={handleConfirmSchedule}
        title={`Schedule Follow-up for ${lead.fullName || `${lead.firstName} ${lead.lastName}`}`}
      />
    </>
  );
};

export default FollowUpMenu;
