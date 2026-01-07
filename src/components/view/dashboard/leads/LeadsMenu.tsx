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
import tokenStorage from "@/lib/utils/tokenStorage";
import AssignLeadModal from "@/components/ui/models/AssignLeadsModal";
import { useSearchParams } from "next/navigation";

const LeadsMenu = ({
  lead,
  showViewDetails = true,
  customTrigger,
  navigate = "/super-user",
  isDeleted,
  setIsDeleted,
  showQualifiedButton,
  showProposalButtton
}: {
  lead: Lead;
  showViewDetails?: boolean;
  customTrigger?: React.ReactNode;
  navigate?: string;
  isDeleted?: boolean
  setIsDeleted?: (value: boolean) => void,
  showQualifiedButton: boolean
  showProposalButtton: boolean
}) => {
  // ======================================================
  // State
  // ======================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignLeadModalOpen, setIsAssignLeadModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [language, setLanguage] = useState<any>()
  const lang = getCurrentLang();
  const { user } = useAppSelector(state => state.auth);
  const [proposalLoading, setProposalLoading] = useState<boolean>(false)
  const searchParams = useSearchParams();
  

  const { getTokens } = tokenStorage;
  const accessToken = getTokens().accessToken;
  const companyId = searchParams?.get("companyId")

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

  // =======================================================
  // Assign Leads
  // =======================================================
  const handleOpenAssignLead = () => {
    setIsAssignLeadModalOpen(true)
  }

  const handleCloseAssignLead = () => {
    setIsAssignLeadModalOpen(false);
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await deleteLead({ id: lead._id, companyId });
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

  const generateProposal = async () => {
    try {
      setProposalLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/proposals/leads/${lead?._id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // JWT token for auth
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Proposal generated:', data);

      // Automatically download the Word document
      if (data.data && data.data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.data.downloadUrl;
        link.download = data.data.title ? `${data.data.title}.docx` : 'proposal.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Word document download initiated');
      }

      return data;
    } catch (error) {
      console.error('Failed to generate proposal:', error);
      setProposalLoading(false);
    } finally {
      setProposalLoading(false);
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
              href={companyId !== null ? `/super-user/leads/${lead._id}?companyId=${companyId}` : `/super-user/leads/${lead._id}`}
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
        {lead?.email && <DropdownItem>
          <Link
            href={companyId !== null ? `/super-user/leads/${lead._id}/${lead?.fullName}?companyId=${companyId}&userEmail=${lead?.email}` :  `/super-user/leads/${lead._id}/${lead?.fullName}?userEmail=${lead?.email}`}
            className="flex-between w-full hover:text-gray-200"
            prefetch={false}
          >
            <div className="flex gap-1">
              <SendFollowUpSvg />
              {language?.sendFollowUp}
            </div>
            <RightArrowSvg />
          </Link>
        </DropdownItem>}

        {showQualifiedButton && <DropdownItem>
          <button
            className="w-full text-purple-400 flex gap-1 hover:text-gray-200 cursor-pointer"
            onClick={handleLeadQualified}
          >
            <QualifiedSvg className="hover:text-gray-200" />
            {language?.markAsQualified}
          </button>
        </DropdownItem>}
        {showProposalButtton && <DropdownItem>
          <button
            className="w-full flex items-center gap-2 text-blue-700 hover:text-gray-200 cursor-pointer"
            onClick={generateProposal}
          >
            {proposalLoading ?
              <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-700 rounded-full animate-spin"></div>
              : <WordDocSvg />}
            {language?.generateLeadProposal}
          </button>

        </DropdownItem>}

        {user?.userType !== "user" && <DropdownItem>
          <button onClick={handleOpenAssignLead} className={`${lead?.assignedTo ? "" : "hover:text-gray-200"} w-full flex items-center text-yellow-700 cursor-pointer`}>
          <AssignLeadsSvg />
          {language?.assignLeads}
          </button>
        </DropdownItem>}


        {(lead?.assignedTo === user?._id || user?.userType === "company") && <DropdownItem>
          <button
            className="w-full text-danger flex gap-1 hover:text-gray-200 cursor-pointer"
            onClick={handleDeleteClick}
          >
            <DeleteSvg />
            {language?.deleteLead}
          </button>
        </DropdownItem>
        }
      </Dropdown>

      {/* ---------------------------- delete lead modal ---------------------------- */}
      <DeleteLeadModal
        language={language}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
      {/* ------------------------- Assign leads ------------------------------------ */}
      <AssignLeadModal 
        language={language} 
        isOpen={isAssignLeadModalOpen} 
        onClose={handleCloseAssignLead} 
        onConfirm={() => console.log("confirm")} 
        leadId={lead?._id as string}
        assignedToId={lead?.assignedTo}
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

const WordDocSvg = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 200 260"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="20" y="10" width="160" height="240" rx="12" ry="12" fill="#ffffff" stroke="#2B579A" stroke-width="6" />
      <polygon points="140,10 180,50 140,50" fill="#D0E2FF" />
      <line x1="140" y1="10" x2="180" y2="50" stroke="#2B579A" stroke-width="6" />
      <rect x="20" y="70" width="160" height="50" fill="#2B579A" />
      <text x="100" y="105" textAnchor="middle" fontSize="40" fill="white" fontFamily="Arial" fontWeight="bold">
        DOC
      </text>
      <line x1="40" y1="145" x2="160" y2="145" stroke="#999" stroke-width="6" />
      <line x1="40" y1="170" x2="160" y2="170" stroke="#999" stroke-width="6" />
      <line x1="40" y1="195" x2="130" y2="195" stroke="#999" stroke-width="6" />
    </svg>
  )
}

export const AssignLeadsSvg = () => {
  return <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 text-yellow-500"
  >
    <rect x="4" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="8" y="1" width="6" height="4" rx="1" fill="currentColor" />
    <line x1="7" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" />
    <line x1="7" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" />
    <path d="M7 17l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
}


