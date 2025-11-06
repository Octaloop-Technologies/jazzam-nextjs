"use client";
import { LeftArrowSvg, RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import { ClockSvg, DoubleCheckSvg, EmailSvg, WhatsappSvg } from "@/components/svgs/followUpSvgs";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import SearchBar from "@/components/ui/search/SearchBar";
import Table from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeader from "@/components/ui/table/TableHeader";
import TableRow from "@/components/ui/table/TableRow";
import FollowUpMenu from "@/components/view/dashboard/follow-up/FollowUpMenu";
import tokenStorage from "@/lib/utils/tokenStorage";
import { useAppSelector } from "@/redux/store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FollowUpsPage = () => {
  const [followupLeads, setFollowupLeads] = useState<Lead[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();

  const companyId = searchParams?.get("companyId"); 

  const { accessToken } = tokenStorage?.getTokens();




  useEffect(() => {
    const fetchToken = async () => {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/follow-up-leads?companyId=${companyId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if(res.ok){
          const data = await res.json();
          setFollowupLeads(data?.data)
        }
    }
    fetchToken();
  }, []);

  return (
    <section>
      {/* ---------------------------- header ---------------------------- */}
      <div className="flex-between gap-1.5">
        <h1 className="text-[32px] font-[500] capitalize">Follow-ups</h1>
        <div className="flex items-center gap-2.5">
          {/* search bar */}
          <SearchBar />

          {/* tabs */}
          <div className="flex gap-[15px] h-[61px] text-[14px] border border-gray-b p-2.5 rounded-4xl">
            <button className="h-full px-5 bg-[#0fb98121] text-pri rounded-4xl">All</button>
            <button className="h-full px-5 bg-white rounded-4xl">Submitted</button>
            <button className="h-full px-5 bg-white rounded-4xl">Scheduled</button>
          </div>
        </div>
      </div>

      {/* ---------------------------- lead Table ---------------------------- */}
      <div className="mt-4 bg-white py-8 rounded-3xl border border-gray-b">
        <div className="flex items-center justify-between mb-4 px-[30px]">
          <div className="leading-none">
            <h1 className="text-[18px] font-[600] capitalize">All Follow-ups</h1>
            <p className="text-gray-200 text-sm">Complete list follow-up messages</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <button className="size-[30px] rounded-full border border-gray-b flex-center">
              <LeftArrowSvg />
            </button>
            <span className="text-gray-300">Page 1/200</span>
            <button className="size-[30px] rounded-full border border-gray-b flex-center bg-pri text-white">
              <RightArrowSvg />
            </button>
          </div>
        </div>

        <div className="min-w-full">
          <Table>
            <TableHeader className="!grid-cols-4">
              <TableCell>Lead</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date of submission</TableCell>
            </TableHeader>
            <div className="px-[30px]">
              {followupLeads?.map((lead: Lead) => (
                <TableRow key={lead._id} className="!grid-cols-4">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-[40px] rounded-full overflow-hidden">
                        <OptimizedImage
                          src={lead?.leadId?.profilePic ? lead?.leadId?.profilePic : "/assets/images/leads/dummy-profile.png"}
                          alt="avatar"
                          fill
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col leading-none">
                        <p className="text-[16px] font-[500]">{lead?.leadId?.fullName}</p>
                        <p className="text-[12px] text-gray-200">{lead.leadId?.company}</p>
                        <p className="text-[12px] text-gray-200">{lead.leadId?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {lead?.channel && lead?.channel.toLowerCase() === "email" ? <EmailSvg /> : <WhatsappSvg />}
                      <h4 className="text-[14px] capitalize">{lead.channel}</h4>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <h3
                        className={`text-[14px] capitalize
                          ${lead.status.toLowerCase() === "submitted" ? "text-cold" : "text-warm"}`}
                      >
                        {lead.status}
                      </h3>
                      {lead.status.toLowerCase() === "submitted" ? (
                        <DoubleCheckSvg />
                      ) : (
                        <ClockSvg />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex-between">
                    <h3 className="text-[14px] text-gray-200">{lead.dateOfSubmission ? new Date(lead.dateOfSubmission).toLocaleString() : "----"}</h3>
                    {/* <FollowUpMenu
                      lead={lead as unknown as Lead & { name: string }}
                      showSendNow={lead.status.toLowerCase() === "pending"}
                    /> */}
                  </TableCell>
                </TableRow>
              ))}
            </div>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default FollowUpsPage;