"use client";

import { useEffect, useState } from "react";
import { ModernBarChart } from "@/components/shared/charts";
import {
  ColdLeadsSvg,
  ContactInfoSvg,
  ExportDataSvg,
  HotLeadsSvg,
  WarmLeadsSvg,
} from "@/components/svgs/LeadsAnalysisSvgs";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import { useAppSelector } from "@/redux/store";
import { useSearchParams } from "next/navigation";

// =====================================================================
// =============================== Cards ===============================
// =====================================================================
const cards = [
  {
    title: "Total leads",
    value: "2,847",
    icon: "/assets/images/summary/total-leads.svg",
  },
  {
    title: "Qualified Leads",
    value: "2,847",
    icon: "/assets/images/summary/qualified-leads.svg",
  },
  {
    title: "Follow-ups Sent",
    value: "247",
    icon: "/assets/images/summary/follow-ups.svg",
  },
  {
    title: "Est. Close Rate",
    value: "23%",
    icon: "/assets/images/summary/close-rate.svg",
  },
];

// =====================================================================
// =========================== Quick Actions ===========================
// =====================================================================
const quickActions = [
  {
    title: "Hot leads download",
    description: "Download today's hot leads data",
    icon: <HotLeadsSvg className="size-[24px]" />,
    bgColor: "bg-hot-light",
  },
  {
    title: "Warm leads download",
    description: "Download today’s Warm leads data",
    icon: <WarmLeadsSvg className="size-[24px]" />,
    bgColor: "bg-warm-light",
  },
  {
    title: "Cold leads download",
    description: "Download today’s cold leads data",
    icon: <ColdLeadsSvg className="size-[24px]" />,
    bgColor: "bg-cold-light",
  },
  {
    title: "Contact info",
    description: "Download today’s top leads contact data",
    icon: <ContactInfoSvg className="size-[24px]" />,
    bgColor: "bg-pipeline-light",
  },
  {
    title: "Export data",
    description: "Download over all data",
    icon: <ExportDataSvg className="size-[24px]" />,
    bgColor: "bg-[#DEFFF4]",
  },
];

// =====================================================================
// =========================== Team Performance ===========================
// =====================================================================
const teamPerformance = [
  {
    id: 1,
    name: "John Doe",
    value: "$89,500",
    icon: "/assets/images/summary/team-performance.svg",
    leads: "156 leads",
  },
  {
    id: 2,
    name: "John Doe",
    value: "$89,500",
    icon: "/assets/images/summary/team-performance.svg",
    leads: "156 leads",
  },
  {
    id: 3,
    name: "Sarah Mitchell",
    value: "$89,500",
    icon: "/assets/images/summary/team-performance.svg",
    leads: "156 leads",
  },
  {
    id: 4,
    name: "John Doe",
    value: "$89,500",
    icon: "/assets/images/summary/team-performance.svg",
    leads: "156 leads",
  },
  {
    id: 5,
    name: "Sarah Mitchell",
    value: "$89,500",
    icon: "/assets/images/summary/team-performance.svg",
    leads: "156 leads",
  },
];

const SummaryPage = () => {
  // =====================================================================
  // =============================== States =============================
  // =====================================================================
  const [chartData] = useState([
    { category: "New", value: 940 },
    { category: "Qualified", value: 677 },
  ]);

  const searchParams = useSearchParams();


  const { user } = useAppSelector(state => state.auth);
  const companyId = searchParams?.get("companyId")

  const [customization, setCustomization] = useState({
    barColor: "#15803c",
    textColor: "#ffffff",
    backgroundColor: "#ffffff",
    showGrid: false,
    animate: true,
    height: 400,
  });

  useEffect(() => {
    if(user?.joinedCompanyStatus === true && user?.userType === "user" && !companyId ){
      window.location.href = `/super-user/summary?companyId=${user?.joinedCompanies}`
    }
  }, [])

  return (
    <section>
      {/* ---------------------------- header ---------------------------- */}
      <div className="flex-between gap-1.5">
        <h1 className="text-[32px] font-[500] capitalize">Executive Weekly Summary</h1>
      </div>

      {/* ---------------------------- Cards ---------------------------- */}
      <div className="mt-4.5 flex gap-2.5">
        {cards.map((card) => (
          <div
            className="w-full flex-between gap-2 bg-white rounded-3xl p-[30px] border border-gray-b"
            key={card.title}
          >
            <div className="flex-between gap-2 w-full">
              <div>
                <div className="text-[16px] text-gray-200 capitalize leading-normal">
                  {card.title}
                </div>
                <div className="text-[28px] font-[600] leading-none">{card.value}</div>
              </div>
              <div className="size-[40px] flex-center overflow-hidden rounded-xl-2 bg-pri">
                <OptimizedImage src={card.icon} alt={card.title} width={24} height={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex gap-2.5">
        {/* ---------------------------- Lead Pipeline ---------------------------- */}
        <div className="w-full max-w-[57%] bg-white p-[30px] border border-gray-b rounded-3xl">
          <h2 className="text-[18px] font-[600] leading-none">Lead Pipeline</h2>
          <h3 className="text-[14px] text-gray-200 leading-none mt-1">
            Track leads through your sales funnel with AI-powered insights
          </h3>

          <div className="mt-5 bg-bg flex gap-[15px] p-2.5 rounded-4xl w-fit">
            <button className="bg-pri-light-2 rounded-4xl flex-center h-[40px] px-5 gap-2">
              <span className="bg-pri size-2.5 rounded-full" />
              <h4 className="text-sm text-pri">All</h4>
            </button>
            <button className="bg-white rounded-4xl flex-center h-[40px] px-5 gap-2">
              <span className="bg-hot size-2.5 rounded-full" />
              <h4 className="text-sm">Hot</h4>
            </button>
            <button className="bg-white rounded-4xl flex-center h-[40px] px-5 gap-2">
              <span className="bg-warm size-2.5 rounded-full" />
              <h4 className="text-sm">Warm</h4>
            </button>
            <button className="bg-white rounded-4xl flex-center h-[40px] px-5 gap-2">
              <span className="bg-cold size-2.5 rounded-full" />
              <h4 className="text-sm">Cold</h4>
            </button>
          </div>

          <ModernBarChart
            data={chartData}
            height={customization.height}
            barColor={customization.barColor}
            textColor={customization.textColor}
            backgroundColor={customization.backgroundColor}
            showGrid={customization.showGrid}
            animate={customization.animate}
          />
        </div>

        {/* ---------------------------- Quick Actions ---------------------------- */}
        <div className="w-full max-w-[43%] bg-white p-[30px] border border-gray-b rounded-3xl">
          <h2 className="text-[18px] font-[600] leading-none">Quick Actions</h2>
          <h3 className="text-[14px] text-gray-200 leading-none mt-1">
            Track leads through your sales funnel with AI-powered insights
          </h3>
          <div className="mt-5 flex flex-col gap-2.5">
            {quickActions.map((action) => (
              <div
                className="p-[17px] border border-gray-b rounded-3xl flex-between gap-2"
                key={action.title}
              >
                <div className="flex items-center gap-2">
                  <div className={`size-[40px] flex-center rounded-xl-2 ${action.bgColor}`}>
                    {action.icon}
                  </div>
                  <div className="text-sm flex flex-col gap-1.5">
                    <h3 className="text-gray-200 font-[500] leading-none capitalize">
                      {action.title}
                    </h3>
                    <h3 className="leading-none">{action.description}</h3>
                  </div>
                </div>
                <button className="size-[40px] bg-bg flex-center border border-gray-b rounded-full">
                  <DownloadIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------- Team Performance ---------------------------- */}
      <div className="mt-2.5 p-[30px] pr-[50px] bg-white border border-gray-b rounded-3xl">
        <h2 className="text-[18px] font-[600] leading-none capitalize">
          Team Performance <span className="text-[16px] font-[500]">(leads qualified)</span>
        </h2>
        <h3 className="text-[14px] text-gray-200 leading-none mt-1">
          Track team performance and individual achievements
        </h3>

        <div className="mt-5 flex flex-col gap-2.5">
          {teamPerformance.map((performance) => (
            <div
              className="p-[17px] rounded-3xl border border-gray-b flex-between gap-2"
              key={performance.id}
            >
              <div className="flex items-center gap-3">
                <div className="size-[44px] rounded-full bg-pri-light-2 overflow-hidden">
                  <OptimizedImage
                    src={performance.icon || ""}
                    alt={performance.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-[500] leading-none capitalize">
                    {performance.name}
                  </h3>
                  <h4 className="text-xs text-gray-200 leading-none">{performance.leads}</h4>
                </div>
              </div>

              <h2 className="text-sm font-[500] leading-none">{performance.value}</h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SummaryPage;

// =====================================================================
// =============================== Icons ===============================
// =====================================================================
const DownloadIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83341 18.3333C4.72835 18.3333 3.66854 17.8943 2.88714 17.1129C2.10573 16.3315 1.66675 15.2717 1.66675 14.1666V11.6666C1.66675 11.4456 1.75455 11.2337 1.91083 11.0774C2.06711 10.9211 2.27907 10.8333 2.50008 10.8333C2.7211 10.8333 2.93306 10.9211 3.08934 11.0774C3.24562 11.2337 3.33341 11.4456 3.33341 11.6666V14.1666C3.33341 14.8297 3.59681 15.4656 4.06565 15.9344C4.53449 16.4033 5.17037 16.6666 5.83341 16.6666H14.1667C14.8298 16.6666 15.4657 16.4033 15.9345 15.9344C16.4034 15.4656 16.6667 14.8297 16.6667 14.1666V11.6666C16.6667 11.4456 16.7545 11.2337 16.9108 11.0774C17.0671 10.9211 17.2791 10.8333 17.5001 10.8333C17.7211 10.8333 17.9331 10.9211 18.0893 11.0774C18.2456 11.2337 18.3334 11.4456 18.3334 11.6666V14.1666C18.3334 15.2717 17.8944 16.3315 17.113 17.1129C16.3316 17.8943 15.2718 18.3333 14.1667 18.3333H5.83341Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7625 9.08331C14.8391 9.16158 14.8995 9.25418 14.9403 9.35582C14.9811 9.45746 15.0015 9.56615 15.0002 9.67566C14.999 9.78518 14.9762 9.89337 14.9331 9.99406C14.89 10.0948 14.8275 10.186 14.7491 10.2625L10.9991 13.9291C10.8434 14.0813 10.6344 14.1665 10.4166 14.1665C10.1989 14.1665 9.98983 14.0813 9.83413 13.9291L6.08413 10.2625C6.00421 10.1864 5.94019 10.0952 5.89581 9.99412C5.85142 9.89308 5.82755 9.78423 5.82557 9.67389C5.8236 9.56354 5.84356 9.45391 5.8843 9.35134C5.92503 9.24878 5.98574 9.15533 6.06289 9.07641C6.14004 8.9975 6.23209 8.93469 6.33371 8.89164C6.43533 8.8486 6.54448 8.82616 6.65484 8.82564C6.7652 8.82512 6.87456 8.84652 6.97658 8.88861C7.0786 8.9307 7.17124 8.99263 7.24913 9.07081L9.5833 11.3533V4.16665C9.5833 3.94563 9.6711 3.73367 9.82738 3.57739C9.98366 3.42111 10.1956 3.33331 10.4166 3.33331C10.6376 3.33331 10.8496 3.42111 11.0059 3.57739C11.1622 3.73367 11.25 3.94563 11.25 4.16665V11.3533L13.5833 9.07081C13.6616 8.9942 13.7542 8.93377 13.8558 8.89297C13.9574 8.85218 14.0661 8.83181 14.1756 8.83305C14.2852 8.83429 14.3934 8.8571 14.4941 8.90019C14.5947 8.94327 14.686 9.00578 14.7625 9.08415V9.08331Z"
        fill="black"
      />
    </svg>
  );
};
