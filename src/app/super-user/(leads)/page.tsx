import { LeftArrowSvg, RightArrowSvg } from "@/components/svgs/ArrowSvgs";
import {
  ColdLeadsSvg,
  NewLeadsSvg,
  ExternalLinkSvg,
  HotLeadsSvg,
  PipelineValueSvg,
  WarmLeadsSvg,
} from "@/components/svgs/LeadsAnalysisSvgs";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import PercentageCircle from "@/components/ui/percentage-circle/PercentageCircle";
import SearchBarWithFilters from "@/components/view/dashboard/leads/SearchBarWithFilters";
import Table from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeader from "@/components/ui/table/TableHeader";
import TableRow from "@/components/ui/table/TableRow";
import Link from "next/link";
import React, { Suspense } from "react";
import LeadsMenu from "@/components/view/dashboard/leads/LeadsMenu";
import { Metadata } from "next";
import { getAllLeads, getLeadStats, searchLeads } from "./action";
import TabNavigation from "@/components/view/dashboard/leads/TabNavigation";
import TabContentLoader from "@/components/view/dashboard/leads/TabContentLoader";
import RefreshButton from "@/components/view/dashboard/leads/RefreshButton";
import { getCurrentUser } from "@/app/(auth)/action";

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
    companyIndustry?: string;
    companySize?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const statusFilter = params.status;

  // ======================================================
  // Search query and filters
  // ======================================================
  const searchQuery = params.search;
  const companyIndustryFilter = params.companyIndustry;
  const companySizeFilter = params.companySize;
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  // ======================================================
  // Fetch leads and stats (automatically filtered by logged-in company)
  // ======================================================
  const [leadsResponse, statsResponse, currentUserResponse] = await Promise.all([
    searchQuery
      ? searchLeads({
          query: searchQuery,
          page: currentPage,
          limit: 5,
          status: statusFilter,
          companyIndustry: companyIndustryFilter,
          sortBy,
          sortOrder,
        })
      : getAllLeads({
          page: currentPage,
          limit: 5,
          status: statusFilter,
          companyIndustry: companyIndustryFilter,
          companySize: companySizeFilter,
          sortBy,
          sortOrder,
        }),
    getLeadStats(),
    getCurrentUser(),
  ]);

  const leadsData = leadsResponse.success ? leadsResponse.data?.data : null;
  const statsData = statsResponse.success ? statsResponse.data?.data : null;
  const currentUser = currentUserResponse.success ? currentUserResponse.user : null;

  // ======================================================
  // Generate cards from stats data
  // ======================================================
  const cards = [
    {
      title: "New Leads",
      value: statsData?.overview?.newLeads || 0,
      icon: <NewLeadsSvg />,
      color: "text-pri",
      bgColor: "bg-pri-light",
    },
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
      case "new":
        icon = <NewLeadsSvg className="size-4" />;
        bgColorClass = "bg-pri-light";
        textColorClass = "text-text";
        break;
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
      {/* ---------------------------- header ---------------------------- */}
      <div className="flex-between gap-1.5">
        <div>
          <h1 className="text-[32px] font-[500] capitalize">Your lead analysis</h1>
          {currentUser && (
            <p className="text-sm text-gray-500 mt-1">
              Showing leads for {currentUser.companyName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {/* Advanced search bar with filters - supports text search, industry, source, company size filters */}
          <SearchBarWithFilters />

          {/* tabs */}
          <TabNavigation
            searchQuery={searchQuery}
            companyIndustryFilter={companyIndustryFilter}
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
                  if (companyIndustryFilter)
                    paginationParams.set("companyIndustry", companyIndustryFilter);
                  if (companySizeFilter) paginationParams.set("companySize", companySizeFilter);
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
                <TableCell>Profile Link</TableCell>
                <TableCell>Company Size</TableCell>
              </TableHeader>
              {leadsData?.leads?.length > 0 ? (
                <>
                  {leadsData.leads.map((lead: Lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-[40px] rounded-full overflow-hidden">
                            <OptimizedImage
                              src={lead.profilePic || "/assets/images/leads/dummy-profile.png"}
                              alt="avatar"
                              fill
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col leading-none">
                            <p className="text-[16px] font-[500]">
                              {lead.fullName && lead.fullName.trim()
                                ? lead.fullName
                                : (lead.firstName && lead.firstName.trim()) ||
                                  (lead.lastName && lead.lastName.trim())
                                ? `${lead.firstName ? lead.firstName : ""}${
                                    lead.lastName ? ` ${lead.lastName}` : ""
                                  }`.trim() || "No Name"
                                : "No Name"}
                            </p>
                            <p className="text-[12px] text-gray-200">{lead.company || "N/A"}</p>
                            <p className="text-[12px] text-gray-200">
                              {lead.email || lead.jobTitle || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusComponent(lead.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PercentageCircle
                            percentage={lead.leadScore || 0}
                            color={
                              lead.leadScore && lead.leadScore >= 80
                                ? "var(--sec)"
                                : lead.leadScore && lead.leadScore >= 60
                                ? "var(--pipeline)"
                                : "var(--cold)"
                            }
                            size={18}
                            strokeWidth={3}
                          />
                          <span className="text-sec font-medium">{lead.leadScore || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.profileUrl ? (
                          <Link
                            href={lead.profileUrl}
                            target="_blank"
                            prefetch={false}
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-cold text-sm underline-auto-from-front gray-hover"
                          >
                            {lead.fullName || `${lead.firstName} ${lead.lastName}`}{" "}
                            <ExternalLinkSvg />
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">No Profile</span>
                        )}
                      </TableCell>
                      <TableCell className="flex-between">
                        <h3 className="font-medium">{lead.companySize || "N/A"}</h3>
                        <LeadsMenu lead={lead} />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <div className="py-8 px-[30px] text-center text-gray-500">
                  {leadsResponse.success
                    ? searchQuery
                      ? `No leads found matching "${searchQuery}". Try adjusting your search or filters.`
                      : "No leads found"
                    : "Error loading leads"}
                </div>
              )}
            </Table>
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default DashboardPage;
