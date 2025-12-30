"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import { DeleteSvg } from "../../svgs/LeadsAnalysisSvgs";
import tokenStorage from "@/lib/utils/tokenStorage";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import { useToast } from "@/lib/hooks/useToast";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  language: any,
  leadId?: string
}

interface TeamMembers {
  company?: {
    companyName?: string,
    email?: string,
    logo: {
      url?: string
    },
    _id: string,
    joinedCompanyStatus?: boolean
  },
  joinedAt?: string,
  role?: string,
  _id?: string
}


const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  language,
  leadId
}) => {
  if (!isOpen) return null;

  const { accessToken } = tokenStorage.getTokens();
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<string>("");
  const user = useAppSelector(selectUser);


  const { success, error }  = useToast()




  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/team-members/${user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setTeamMembers(data?.data?.teamMembers);
    };
    fetchTeamMembers()
  }, [])

  const handleAssignLead = async(id: string) => {
    try {
      setLoading(true)
      setLoadingId(id as string)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({assignedTo: id})
      });

      if(!res.ok){
        throw new Error(language?.leadAssignedErrMsg)
      }

      const data = await res.json();

      if(data?.success === true){
        success(language?.leadAssignedMsg)
      }

    } catch (error) {
      setLoading(false)
      error(language?.leadAssignedErrMsg)
      console.log(error)
    }finally{
      setLoading(false);
    }
  }




  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white pt-[30px] p-5 rounded-3xl max-w-[550px] w-full text-center shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]">
        <div className="flex justify-center mb-4">
        </div>
        {/* <h2 className="text-[18px] font-[500] leading-none mb-1">{language?.deleteLeadHeading}</h2> */}
        {/* <p className="text-gray-200 mb-8 leading-none">
          {language?.deleteLeadDesc}
        </p> */}
        <div className={`overflow-y-auto h-[190px]`}>
          <table className="min-w-full rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Sr
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  User Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {teamMembers.map((team, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-sm text-gray-600 m-52">
                  {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 m-52">
                  {team?.company?.companyName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 m-52">
                    {team?.company?.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    <button className="px-4 py-2 text-sm bg-yellow-500 rounded-sm cursor-pointer" onClick={() => handleAssignLead(team?.company?._id as string)}>
                      {loading && loadingId === team?.company?._id ?  "loading" : "assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;

// ======================================================
// Svgs
// ======================================================
const CloseSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
      <path
        d="M0.998535 11.5L11.0014 1.5M0.998535 1.5L11.0014 11.5"
        stroke="#15803C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

