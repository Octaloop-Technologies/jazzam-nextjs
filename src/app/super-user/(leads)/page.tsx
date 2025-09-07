import { LeftArrowSvg, RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import {
  ColdLeadsSvg,
  ExternalLinkSvg,
  HotLeadsSvg,
  PercentageCircleSvg,
  PipelineValueSvg,
  WarmLeadsSvg,
} from "@/components/svgs/LeadsAnalysisSvgs";
import { RefreshSvg } from "@/components/svgs/refreshSvg";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import SearchBar from "@/components/ui/search/SearchBar";
import Table from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeader from "@/components/ui/table/TableHeader";
import TableRow from "@/components/ui/table/TableRow";
import Link from "next/link";
import React from "react";
import LeadsMenu from "@/components/view/dashboard/leads/LeadsMenu";
import AuthStatusHandler from "@/components/view/dashboard/leads/AuthStatusHandler";
import { Metadata } from "next";

// ======================================================
// Meta Data
// ======================================================
export const metadata: Metadata = {
  title: "Leads",
  description: "Leads page",
};

// ======================================================
// Cards
// ======================================================
const cards = [
  {
    title: "Hot Leads",
    value: 120,
    icon: <HotLeadsSvg />,
    color: "text-hot",
    bgColor: "bg-hot-light",
  },
  {
    title: "Warm leads",
    value: 120,
    icon: <WarmLeadsSvg />,
    color: "text-warm",
    bgColor: "bg-warm-light",
  },
  {
    title: "Cold leads   ",
    value: 120,
    icon: <ColdLeadsSvg />,
    color: "text-cold",
    bgColor: "bg-cold-light",
  },
  {
    title: "Pipeline value",
    value: "$1,020",
    icon: <PipelineValueSvg />,
    color: "text-pipeline",
    bgColor: "bg-pipeline-light",
  },
];

// ======================================================
// Leads data
// ======================================================
const leadsData = [
  {
    id: "1",
    name: "Wade Warren",
    company: "TechCorp Inc",
    email: "wade.12@gmail.com",
    status: "Hot",
    score: 95,
    linkedIn: "https://www.linkedin.com/in/wadewarren",
    value: "$89,500",
    followUp: "follow-up-1",
  },
  {
    id: "2",
    name: "Wade Warren",
    company: "TechCorp Inc",
    email: "wade.12@gmail.com",
    status: "Warm",
    score: 95,
    linkedIn: "https://www.linkedin.com/in/wadewarren",
    value: "$89,500",
    followUp: "follow-up-2",
  },
  {
    id: "3",
    name: "Wade Warren",
    company: "TechCorp Inc",
    email: "wade.12@gmail.com",
    status: "Cold",
    score: 95,
    linkedIn: "https://www.linkedin.com/in/wadewarren",
    value: "$89,500",
    followUp: "follow-up-3",
  },
  {
    id: "4",
    name: "Wade Warren",
    company: "TechCorp Inc",
    email: "wade.12@gmail.com",
    status: "Warm",
    score: 95,
    linkedIn: "https://www.linkedin.com/in/wadewarren",
    value: "$89,500",
    followUp: "follow-up-4",
  },
];

interface DashboardPageProps {
  searchParams: Promise<{
    error?: string;
    logout?: string;
    login?: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const params = await searchParams;
  // ======================================================
  // Status of the lead
  // ======================================================
  const getStatusComponent = (status: string) => {
    let icon;
    let bgColorClass;
    let textColorClass;

    switch (status) {
      case "Hot":
        icon = <HotLeadsSvg className="size-4" />;
        bgColorClass = "bg-hot-light";
        textColorClass = "text-hot";
        break;
      case "Warm":
        icon = <WarmLeadsSvg className="size-4" />;
        bgColorClass = "bg-warm-light";
        textColorClass = "text-warm";
        break;
      case "Cold":
        icon = <ColdLeadsSvg className="size-4" />;
        bgColorClass = "bg-cold-light";
        textColorClass = "text-cold";
        break;
      default:
        icon = null;
        bgColorClass = "bg-gray-200";
        textColorClass = "text-gray-800";
    }

    return (
      <div
        className={`flex-center gap-1.5 w-[107px] px-3 h-[30px] rounded-lg ${bgColorClass} ${textColorClass} text-sm`}
      >
        {icon}
        {status}
      </div>
    );
  };

  return (
    <section>
      {/* Handle auth status messages (like login success) */}
      <AuthStatusHandler searchParams={params} />

      {/* ---------------------------- header ---------------------------- */}
      <div className="flex-between gap-1.5">
        <h1 className="text-[32px] font-[500] capitalize">Your lead analysis</h1>
        <div className="flex items-center gap-2.5">
          {/* search bar */}
          <SearchBar />

          {/* tabs */}
          <div className="flex gap-[15px] h-[61px] text-[14px] border border-gray-b p-2.5 rounded-4xl">
            <button className="h-full px-5 bg-[#0fb98121] text-pri rounded-4xl">All</button>
            <button className="h-full px-5 bg-white rounded-4xl">Hot</button>
            <button className="h-full px-5 bg-white rounded-4xl">Warm</button>
            <button className="h-full px-5 bg-white rounded-4xl">Cold</button>
          </div>

          {/* split line */}
          <div className="h-[51.5px] w-[1px] bg-gray-b" />

          {/* refresh button */}
          <PrimaryButton
            title="Refresh"
            iconRight={<RefreshSvg />}
            className="w-[116px] h-[60px]"
          />
        </div>
      </div>

      {/* ---------------------------- cards ---------------------------- */}
      <div className="mt-[18px] flex gap-2.5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="w-full py-[30px] pl-[40px] bg-white border border-gray-b rounded-3xl flex items-center gap-2.5"
          >
            <div className={`rounded-xl-2 size-[40px] ${card.bgColor} flex-center`}>
              {card.icon}
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <h3 className="text-[16px] font-[500]">{card.title}</h3>
              <h2 className={`text-[28px] ${card.color} font-[600]`}>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------- lead Table ---------------------------- */}
      <div className="mt-2.5 bg-white py-8 rounded-3xl border border-gray-b overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-[30px]">
          <div className="leading-none">
            <h1 className="text-[18px] font-[600] capitalize">All Leads</h1>
            <p className="text-gray-200 text-sm">
              Complete list of your sales prospects and their current status
            </p>
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
            <TableHeader>
              <TableCell>Lead</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>LinkedIn Profile</TableCell>
              <TableCell>Value</TableCell>
            </TableHeader>
            <div className="px-[30px]">
              {leadsData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-[40px] rounded-full overflow-hidden">
                        <OptimizedImage
                          src="/assets/images/leads/dummy-profile.png"
                          alt="avatar"
                          fill
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col leading-none">
                        <p className="text-[16px] font-[500]">{lead.name}</p>
                        <p className="text-[12px] text-gray-200">{lead.company}</p>
                        <p className="text-[12px] text-gray-200">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusComponent(lead.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PercentageCircleSvg />
                      <span className="text-sec font-medium">{lead.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={lead.linkedIn}
                      target="_blank"
                      prefetch={false}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-cold text-sm underline-auto-from-front gray-hover"
                    >
                      Wade Warren <ExternalLinkSvg />
                    </Link>
                  </TableCell>
                  <TableCell className="flex-between">
                    <h3 className="font-medium">{lead.value}</h3>
                    <LeadsMenu lead={lead} />
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

export default DashboardPage;
