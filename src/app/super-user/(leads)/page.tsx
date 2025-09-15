import { LeftArrowSvg, RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import {
  ColdLeadsSvg,
  ExternalLinkSvg,
  HotLeadsSvg,
  PercentageCircleSvg,
  PipelineValueSvg,
  WarmLeadsSvg,
} from "@/components/svgs/LeadsAnalysisSvgs";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import SearchBarWithFilters from "@/components/view/dashboard/leads/SearchBarWithFilters";
import Table from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeader from "@/components/ui/table/TableHeader";
import TableRow from "@/components/ui/table/TableRow";
import Link from "next/link";
import React, { Suspense } from "react";
import LeadsMenu from "@/components/view/dashboard/leads/LeadsMenu";
import AuthStatusHandler from "@/components/view/dashboard/leads/AuthStatusHandler";
import { Metadata } from "next";
import { getAllLeads, getLeadStats, searchLeads } from "./action";
import { cookies } from "next/headers";
import TabNavigation from "@/components/view/dashboard/leads/TabNavigation";
import TabContentLoader from "@/components/view/dashboard/leads/TabContentLoader";
import RefreshButton from "@/components/view/dashboard/leads/RefreshButton";

// ======================================================
// Meta Data
// ======================================================
export const metadata: Metadata = {
  title: "Leads",
  description: "Leads page",
};

interface DashboardPageProps {
  searchParams: Promise<{
    error?: string;
    logout?: string;
    login?: string;
    page?: string;
    status?: string;
    search?: string;
    industry?: string;
    source?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

interface Lead {
  id: string;
  _id: string;
  assignedUser: {
    avatar: string;
  };
  leadScore: number;
  linkedinProfile: string;
  companySize: string;
  name: string;
  company: string;
  email: string;
  status: string;
  followUp: string;
  date: string;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const statusFilter = params.status;

  // ======================================================
  // Search query and filters
  // ======================================================
  const searchQuery = params.search;
  const industryFilter = params.industry;
  const sourceFilter = params.source;
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  // ======================================================
  // Fetch leads and stats
  // ======================================================
  const [leadsResponse, statsResponse] = await Promise.all([
    searchQuery
      ? searchLeads({
          token,
          query: searchQuery,
          page: currentPage,
          limit: 5,
          status: statusFilter,
          industry: industryFilter,
          source: sourceFilter,
          sortBy,
          sortOrder,
        })
      : getAllLeads({
          token,
          page: currentPage,
          limit: 5,
          status: statusFilter,
          industry: industryFilter,
          source: sourceFilter,
          sortBy,
          sortOrder,
        }),
    getLeadStats({ token }),
  ]);

  const leadsData = leadsResponse.success ? leadsResponse.data?.data : null;
  const statsData = statsResponse.success ? statsResponse.data?.data : null;

  // ======================================================
  // Generate cards from stats data
  // ======================================================
  const cards = [
    {
      title: "Hot Leads",
      value: statsData?.overview?.hotLeads || 0,
      icon: <HotLeadsSvg />,
      color: "text-hot",
      bgColor: "bg-hot-light",
    },
    {
      title: "Warm leads",
      value: statsData?.overview?.warmLeads || 0,
      icon: <WarmLeadsSvg />,
      color: "text-warm",
      bgColor: "bg-warm-light",
    },
    {
      title: "Cold leads",
      value: statsData?.overview?.coldLeads || 0,
      icon: <ColdLeadsSvg />,
      color: "text-cold",
      bgColor: "bg-cold-light",
    },
    {
      title: "Qualified Leads",
      value: statsData?.overview?.qualifiedLeads || 0,
      icon: <PipelineValueSvg />,
      color: "text-pipeline",
      bgColor: "bg-pipeline-light",
    },
  ];

  // ======================================================
  // Status of the lead
  // ======================================================
  const getStatusComponent = (status: string) => {
    let icon;
    let bgColorClass;
    let textColorClass;

    switch (status.toLowerCase()) {
      case "hot":
        icon = <HotLeadsSvg className="size-4" />;
        bgColorClass = "bg-hot-light";
        textColorClass = "text-hot";
        break;
      case "warm":
        icon = <WarmLeadsSvg className="size-4" />;
        bgColorClass = "bg-warm-light";
        textColorClass = "text-warm";
        break;
      case "cold":
        icon = <ColdLeadsSvg className="size-4" />;
        bgColorClass = "bg-cold-light";
        textColorClass = "text-cold";
        break;
      case "qualified":
        icon = <PipelineValueSvg />;
        bgColorClass = "bg-pipeline-light";
        textColorClass = "text-pipeline";
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
          {/* Advanced search bar with filters - supports text search, industry, source, company size filters */}
          <SearchBarWithFilters />

          {/* tabs */}
          <TabNavigation
            searchQuery={searchQuery}
            industryFilter={industryFilter}
            sourceFilter={sourceFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            statusFilter={statusFilter}
          />

          {/* split line */}
          <div className="h-[51.5px] w-[1px] bg-gray-b" />

          {/* refresh button */}
          <RefreshButton />
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
      <Suspense fallback={<TabContentLoader />}>
        <div className="mt-2.5 bg-white py-8 rounded-3xl border border-gray-b overflow-y-auto">
          <div className="flex items-center justify-between mb-4 px-[30px]">
            <div className="leading-none">
              <h1 className="text-[18px] font-[600] capitalize">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Leads"}
              </h1>
              <p className="text-gray-200 text-sm">
                {searchQuery
                  ? `Found ${leadsData?.totalResults || 0} leads matching your search criteria`
                  : "Complete list of your sales prospects and their current status"}
              </p>
            </div>

            {/* pagination */}
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              {(() => {
                const createPaginationUrl = (page: number) => {
                  const paginationParams = new URLSearchParams();
                  paginationParams.set("page", page.toString());
                  if (searchQuery) paginationParams.set("search", searchQuery);
                  if (statusFilter) paginationParams.set("status", statusFilter);
                  if (industryFilter) paginationParams.set("industry", industryFilter);
                  if (sourceFilter) paginationParams.set("source", sourceFilter);
                  if (sortBy !== "createdAt") paginationParams.set("sortBy", sortBy);
                  if (sortOrder !== "desc") paginationParams.set("sortOrder", sortOrder);

                  return `?${paginationParams.toString()}`;
                };

                return (
                  <>
                    <Link
                      href={createPaginationUrl(Math.max(1, currentPage - 1))}
                      prefetch={false}
                      className={`size-[30px] rounded-full border border-gray-b flex-center transition-all duration-200 ${
                        currentPage === 1
                          ? "cursor-not-allowed opacity-50"
                          : "bg-pri text-white hover:bg-pri/90"
                      }`}
                    >
                      <LeftArrowSvg />
                    </Link>
                    <span className="text-gray-300">
                      Page {leadsData?.page || 1}/{leadsData?.totalPages || 1}
                    </span>
                    <Link
                      href={createPaginationUrl(currentPage + 1)}
                      prefetch={false}
                      className={`size-[30px] rounded-full border border-gray-b flex-center transition-all duration-200 ${
                        !leadsData?.hasNextPage
                          ? "cursor-not-allowed opacity-50"
                          : "bg-pri text-white hover:bg-pri/90"
                      }`}
                    >
                      <RightArrowSvg />
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>

          {/* table */}
          <div className="min-w-full relative">
            <Table>
              <TableHeader>
                <TableCell>Lead</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>LinkedIn Profile</TableCell>
                <TableCell>Company Size</TableCell>
              </TableHeader>
              <div className="px-[30px]">
                {leadsData?.leads?.length > 0 ? (
                  leadsData.leads.map((lead: Lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-[40px] rounded-full overflow-hidden">
                            <OptimizedImage
                              src={
                                lead.assignedUser?.avatar ||
                                "/assets/images/leads/dummy-profile.png"
                              }
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
                          <span className="text-sec font-medium">{lead.leadScore || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.linkedinProfile ? (
                          <Link
                            href={lead.linkedinProfile}
                            target="_blank"
                            prefetch={false}
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-cold text-sm underline-auto-from-front gray-hover"
                          >
                            {lead.name} <ExternalLinkSvg />
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">No LinkedIn</span>
                        )}
                      </TableCell>
                      <TableCell className="flex-between">
                        <h3 className="font-medium">{lead.companySize || "N/A"}</h3>
                        <LeadsMenu lead={lead} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    {leadsResponse.success
                      ? searchQuery
                        ? `No leads found matching "${searchQuery}". Try adjusting your search or filters.`
                        : "No leads found"
                      : "Error loading leads"}
                  </div>
                )}
              </div>
            </Table>
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default DashboardPage;
