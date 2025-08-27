"use client";

import React from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { ClockSvg, DoubleCheckSvg, EmailSvg } from "@/components/svgs/followUpSvgs";
import OptimizedImage from "@/components/ui/image/OptimizedImage";

interface LeadDetailModalProps {
  isOpen: boolean;
  lead: Lead;
  onClose: () => void;
  onConfirm: (leadId: string) => void;
  leadId: string;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
  leadId,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(leadId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white pt-[30px] p-5 rounded-3xl max-w-[601px] w-full text-center shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]">
        <div className="flex-between">
          <h1 className="text-[20px] font-[500] capitalize">Follow-up for [Wade Warren]</h1>
          <button onClick={onClose} className="mt-5 gray-hover">
            <CloseSvg />
          </button>
        </div>

        <div className="flex items-center gap-1 pb-2 border-b border-gray-b">
          <h3
            className={`text-[14px] capitalize
                        ${lead.status.toLowerCase() === "submitted" ? "text-cold" : "text-warm"}`}
          >
            {lead.status}
          </h3>
          {lead.status.toLowerCase() === "submitted" ? <DoubleCheckSvg /> : <ClockSvg />}
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <h3 className="text-sm text-gray-200">Channel:</h3>
          <div className="flex items-center gap-1 px-2.5 h-[30px] rounded-[50px] bg-gray-100">
            <EmailSvg />
            <h2 className="text-sm leading-0">Email</h2>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <h3 className="text-sm text-gray-200">Tone:</h3>
          <h2 className="text-sm text-pri h-[30px] flex-center p-2.5 rounded-[50px] bg-pri-light">
            Formal
          </h2>
        </div>

        <div className="mt-5 p-5 bg-gray rounded-xl-2">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-n/30">
            <div className="size-[34px] rounded-full overflow-hidden">
              <OptimizedImage
                src="/assets/images/leads/dummy-profile.png"
                alt="avatar"
                fill
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-start flex-col leading-none">
              <p className="text-[16px] font-[500]">{lead.name}</p>
              <p className="text-[12px] text-gray-200">To: {lead.email}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5 text-sm text-right">
            <h2 className="font-[600]"> ﻦﻋ لﺄﺳأ نأ دوأ ،ةﺮﻴﺧﻷا ﺎﻨﺘﺛدﺎﺤﻣ ﻰﻠﻋ ًءﺎﻨﺑ </h2>
            <h2>
              مﻼﺳ [Lead Name], ﻦﻋ لﺄﺳأ نأ دوأ ،ةﺮﻴﺧﻷا ﺎﻨﺘﺛدﺎﺤﻣ ﻰﻠﻋ ًءﺎﻨﺑ : [Product/Service] ﺪﻋﺎﺴﻳ
              نأ ﻦﻜﻤﻳ [Company Name] ﻲﻓ : ﻲﻌﻣ ﻞﺻاﻮﺘﻟا ﻲﻓ ددﺮﺘﺗ ﻼﻓ ،ﺔﻠﺌﺳأ يأ ﻚﻳﺪﻟ نﺎﻛ اذإ . ﺔﻴﺤﺘﻟا{" "}
            </h2>
            <h2>
              مﻼﺳ [Lead Name], ﻦﻋ لﺄﺳأ نأ دوأ ،ةﺮﻴﺧﻷا ﺎﻨﺘﺛدﺎﺤﻣ ﻰﻠﻋ ًءﺎﻨﺑ : [Product/Service] ﺪﻋﺎﺴﻳ
              نأ ﻦﻜﻤﻳ [Company Name] ﻲﻓ : ﻲﻌﻣ ﻞﺻاﻮﺘﻟا ﻲﻓ ددﺮﺘﺗ ﻼﻓ ،ﺔﻠﺌﺳأ يأ ﻚﻳﺪﻟ نﺎﻛ اذإ . ﺔﻴﺤﺘﻟا
              ﺺﻟﺎﺧ ﻊﻣ، [Your Name
            </h2>
          </div>
        </div>

        <div
          className={`mt-[31px] flex space-x-5 
            ${lead.status.toLowerCase() === "scheduled" ? "justify-center" : "justify-end"}`}
        >
          <PrimaryButton
            onClick={onClose}
            bordered
            className="w-full max-w-[176px] h-[50px] !gap-2.5 rounded-xl-2"
            title="Delete"
            titleClass="font-[500]"
            iconRight={<TrashSvg />}
          />

          {lead.status.toLowerCase() === "scheduled" && (
            <PrimaryButton
              onClick={handleConfirm}
              className="w-full h-[50px] !gap-2.5 rounded-xl-2"
              title="Send now"
              titleClass="font-[500]"
              iconRight={<SendNowSvg />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;

// ======================================================
// Svgs
// ======================================================
const SendNowSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
      <path
        d="M9.3678 7.50003H3.20257C3.20257 7.28618 3.15824 7.07232 3.07037 6.87169L1.22189 2.68947C0.63087 1.35191 2.04464 0.0127891 3.34799 0.674572L14.0648 6.11348C15.2002 6.68894 15.2002 8.31112 14.0648 8.88659L3.34877 14.3255C2.04464 14.9873 0.63087 13.6474 1.22189 12.3106L3.06881 8.12837C3.1561 7.9304 3.20113 7.7164 3.20101 7.50003"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TrashSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.66321 4.4508C1.80259 4.44134 1.93994 4.48881 2.04508 4.58277C2.15023 4.67673 2.21456 4.8095 2.22393 4.9519L2.54716 9.90542C2.6104 10.8724 2.65537 11.5458 2.75374 12.052C2.85001 12.5437 2.98351 12.8036 3.17534 12.9874C3.36787 13.1712 3.63067 13.2903 4.11691 13.3549C4.61862 13.4217 5.27912 13.4231 6.22772 13.4231H6.77158C7.72018 13.4231 8.38068 13.4217 8.88238 13.3549C9.36863 13.2903 9.63143 13.1712 9.82396 12.9874C10.0158 12.8036 10.1493 12.5437 10.2456 12.0527C10.3439 11.5458 10.3889 10.8724 10.4521 9.90471L10.7754 4.9519C10.78 4.88133 10.7982 4.81238 10.8288 4.74899C10.8595 4.6856 10.9022 4.62901 10.9543 4.58245C11.0064 4.53588 11.0669 4.50026 11.1325 4.47761C11.1981 4.45496 11.2674 4.44573 11.3364 4.45044C11.4055 4.45515 11.473 4.47372 11.535 4.50508C11.5971 4.53644 11.6525 4.57998 11.6981 4.63321C11.7436 4.68644 11.7785 4.74832 11.8007 4.81532C11.8228 4.88232 11.8319 4.95312 11.8273 5.02369L11.5012 10.0145C11.4415 10.9349 11.393 11.6794 11.2792 12.263C11.1604 12.8696 10.9595 13.3765 10.5435 13.7735C10.1275 14.1705 9.61948 14.3428 9.0187 14.4225C8.44111 14.5 7.71175 14.5 6.80882 14.5H6.19048C5.28755 14.5 4.55819 14.5 3.9806 14.4225C3.37982 14.3428 2.87109 14.1712 2.45581 13.7735C2.03984 13.3765 1.83887 12.8689 1.72012 12.263C1.60629 11.6786 1.55851 10.9349 1.49808 10.0145L1.17204 5.02369C1.16746 4.95312 1.17654 4.88232 1.19874 4.81533C1.22095 4.74835 1.25586 4.68649 1.30147 4.63329C1.34708 4.58009 1.4025 4.53659 1.46457 4.50528C1.52664 4.47397 1.59414 4.45545 1.66321 4.4508ZM5.34376 0.5009H5.31144C5.15967 0.5009 5.02686 0.5009 4.90179 0.521001C4.65817 0.560876 4.42706 0.658452 4.22696 0.805923C4.02686 0.953395 3.86332 1.14667 3.74942 1.37028C3.6904 1.48514 3.64894 1.61365 3.60116 1.76082L3.59062 1.79241L3.52246 2.0006L3.50208 2.06234C3.43846 2.24276 3.31994 2.39762 3.1639 2.50421C3.00786 2.61079 2.8225 2.6635 2.63499 2.65461H0.526999C0.38723 2.65461 0.253186 2.71133 0.154354 2.81231C0.0555228 2.91328 0 3.05023 0 3.19303C0 3.33583 0.0555228 3.47279 0.154354 3.57376C0.253186 3.67473 0.38723 3.73146 0.526999 3.73146H12.473C12.6128 3.73146 12.7468 3.67473 12.8456 3.57376C12.9445 3.47279 13 3.33583 13 3.19303C13 3.05023 12.9445 2.91328 12.8456 2.81231C12.7468 2.71133 12.6128 2.65461 12.473 2.65461H10.3011C10.1134 2.65001 9.93208 2.58409 9.78374 2.46652C9.63541 2.34895 9.52785 2.18591 9.47684 2.00132L9.40868 1.79241L9.39884 1.76082C9.35036 1.61365 9.3089 1.48514 9.25058 1.37028C9.13661 1.14658 8.97296 0.953252 8.77273 0.805775C8.5725 0.658298 8.34126 0.560771 8.09751 0.521001C7.96162 0.504117 7.8247 0.497399 7.68785 0.5009H5.34376ZM4.49354 2.42847C4.46543 2.50696 4.43335 2.58234 4.39728 2.65461H8.60202C8.566 2.58139 8.53409 2.50612 8.50646 2.42919L8.47835 2.34735L8.40879 2.13197C8.3833 2.04193 8.35208 1.95368 8.31533 1.86779C8.2774 1.79313 8.22288 1.72859 8.15613 1.67935C8.08938 1.6301 8.01227 1.59752 7.93098 1.58421C7.8394 1.57593 7.74739 1.57377 7.65553 1.57775H5.34376C5.1414 1.57775 5.09924 1.57919 5.06832 1.58493C4.98709 1.59816 4.91003 1.63064 4.84328 1.67975C4.77654 1.72887 4.72198 1.79326 4.68396 1.86779C4.66991 1.8965 4.65445 1.93599 4.59051 2.13269L4.52024 2.34806L4.49354 2.42847Z"
        fill="#15803C"
      />
    </svg>
  );
};

const CloseSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.99805 19L19.002 5M4.99805 5L19.002 19"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
};
