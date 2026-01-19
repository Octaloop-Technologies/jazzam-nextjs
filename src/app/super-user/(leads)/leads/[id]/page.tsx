"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HotLeadsSvg, ColdLeadsSvg, NewLeadsSvg, WinLeadSvg, LostLeadSvg, ExternalLinkSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import {
  CompanySvg,
  CopySvg,
  EmailSvg,
  LinkedInSvg,
  LocationSvg,
  PhoneSvg,
  ShareSvg,
} from "@/components/svgs/leadsDetailSvgs";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import ProgressBar from "@/components/ui/progress/ProgressBar";
import LeadsMenu from "@/components/view/dashboard/leads/LeadsMenu";
import Link from "next/link";
import { getLeadById, updateLead } from "@/lib/api/leads";
import BantButton from "@/components/view/dashboard/leads/BantButton";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCurrentLang } from "@/lib/api/main-page";
import { useAppSelector } from "@/redux/store";
import { RootState } from "@reduxjs/toolkit/query";
import { useToast } from "@/lib/hooks/useToast";

// Loading component
const LoadingSkeleton = () => (
  <section>
    <div className="mt-4 flex flex-col gap-2.5 wrapper">
      <div className="animate-pulse">
        <div className="flex-between gap-2.5 w-full items-stretch">
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="flex-between gap-2.5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="size-[60px] min-w-[60px] rounded-full bg-gray-200"></div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const LeadsPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const lang = getCurrentLang();

  const [lead, setLead] = useState<any>(null);
  const [dealHealth, setDealHealth] = useState<any>(null);
  const [nba, setNBA] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<any>();
  const companyId = searchParams?.get("companyId");
  const [leadStatus, setLeadStatus] = useState<string>("");
  const [showChangeLead, setShowChangeLead] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const { success: ToastSuccess, error: ToastError } = useToast();
  const [refetchLead, setRefetchLead] = useState<boolean>(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const leadResponse = await getLeadById({ id, companyId });

        if (!leadResponse.success || !leadResponse.data) {
          setError("Lead not found");
          return;
        }

        setLead(leadResponse.data.leadData);
        setDealHealth(leadResponse.data.dealHealth)
        setNBA(leadResponse.data.nextBestAction)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch lead");
      } finally {
        setLoading(false);
      }
    };
    const fetchLanguage = async () => {
      const dict = (await getDictionary(lang))?.superUser?.navbar?.leads;
      setLanguage(dict);
    }
    fetchLead();
    fetchLanguage();
  }, [id, refetchLead]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !lead) {
    return (
      <section>
        <div className="mt-4 flex flex-col gap-2.5 wrapper">
          <div className="p-[30px] border border-red-200 rounded-3xl bg-red-50">
            <h2 className="text-red-600 font-medium">Error</h2>
            <p className="text-red-500 mt-2">{error || "Lead not found"}</p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // Backcrumb Links and names
  // ==========================================================
  const segments = [
    { label: "Leads", path: "/super-user" },
    {
      label:
        lead.fullName && lead.fullName.trim()
          ? lead.fullName
          : (lead.firstName && lead.firstName.trim()) || (lead.lastName && lead.lastName.trim())
            ? `${lead.firstName ? lead.firstName : ""}${lead.lastName ? ` ${lead.lastName}` : ""
              }`.trim() || "No Name"
            : "No Name",
      path: `/super-user/leads/${id}`,
    },
  ];

  // ==========================================================
  // Lead Score Calculation
  // ==========================================================
  const leadScore: LeadScore = {
    score: lead.leadScore,
    color: lead.leadScore >= 80 ? "bg-sec" : lead.leadScore >= 60 ? "bg-pipeline" : "bg-cold",
  };

  // ==========================================================
  // Contact Information
  // ==========================================================
  const contactInfo = [
    {
      icon: <EmailSvg />,
      title: "Email",
      value: lead.email || "Not available",
      copy: !!lead.email,
    },
    {
      icon: <PhoneSvg />,
      title: "Phone no.",
      value: lead.phone || "Not available",
      copy: !!lead.phone,
    },
    {
      icon: <CompanySvg />,
      title: "Company",
      value: lead.company || "Not available",
      copy: false,
    },
    {
      icon: <LocationSvg />,
      title: "Location",
      value: lead.location || lead.addressWithCountry || lead.addressCountryOnly || "Not available",
      copy: false,
    },
    {
      icon: <LinkedInSvg />,
      title: lead.platform === "linkedin" ? "LinkedIn profile" : "Profile",
      value: lead.fullName || `${lead.firstName} ${lead.lastName}` || "Profile",
      link: lead.profileUrl || lead.linkedinProfileUrl || "#",
      copy: false,
    },
    {
      icon: <LinkedInSvg />,
      title: "Websites",
      value: lead.creatorWebsite?.link || "Not available",
      website: lead.creatorWebsite?.link,
      copy: false,
    },
  ];

  const handleUpdateLeadStatus = async() => {
    try {
      const settings = {
        id: lead._id,
        status: leadStatus,
        companyId: companyId || user?._id
      };
      const result = await updateLead(settings);
      if (result?.success) {
        ToastSuccess(language?.updatedLeadStatus);
        setRefetchLead(!refetchLead);
        setShowChangeLead(false)
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

  return (
    <section>
      <Breadcrumb segments={segments} />

      <div className="mt-4 flex flex-col gap-2.5 wrapper">
        <div className="flex-between gap-2.5 w-full items-stretch">
          {/* ------------------------- Lead Details ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <div className="flex-between gap-2.5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="size-[60px] min-w-[60px] rounded-full overflow-hidden">
                    <OptimizedImage
                      src={lead.profilePic || "/assets/images/leads/dummy-profile.png"}
                      alt="avatar"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <p className="text-[18px] font-[500]">
                      {lead.fullName || `${lead.firstName} ${lead.lastName}` || "Unknown"}
                    </p>
                    <p className="text-[12px] text-gray-200">{lead.company || "No company"}</p>
                    <p className="text-[12px] text-gray-200 line-clamp-1">
                      {lead.email || lead.headline || "No headline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className={`mt-2.5 w-[107px] h-[30px] text-sm rounded-lg flex-center gap-1 ${lead.status === "hot"
                      ? "text-hot bg-hot-light"
                      : lead.status === "cold" 
                        ? "text-cold bg-cold-light"
                        : lead.status === "new" 
                          ? "text-pri bg-pri-light"
                          : lead.status === "win"  ?
                            "text-green-600 bg-green-200"
                            : lead.status === "lost" ?
                              "text-red-600 bg-red-200"
                              : "text-pipeline bg-pipeline-light"
                      }`}
                  >
                    {lead.status === "hot" && <HotLeadsSvg className="size-4" />}
                    {lead.status === "cold" && <ColdLeadsSvg className="size-4" />}
                    {lead.status === "new" && <NewLeadsSvg className="size-4" />}
                    {lead.status === "warm" && <HotLeadsSvg className="size-4" />}
                    {lead.status === "win" && <WinLeadSvg className="size-4" />}
                    {lead.status === "lost" && <LostLeadSvg className="size-4" />}
                    {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || "Lead"}
                  </div>
                  <button
                    className={`${lead?.status === "hot" ? "text-hot" 
                      : lead.status === "cold" ? "text-cold" 
                      : lead.status === "new" ? "text-pri"
                      : lead.status === "win" ? "text-green-600" 
                      : lead?.status === "lost" ? "text-red-600" :  "text-pipeline" } cursor-pointer`}
                    onClick={() => setShowChangeLead(true)}
                  >
                    <ExternalLinkSvg />
                  </button>
                </div>

                {
                  showChangeLead &&
                  <div className="flex gap-4">
                    <select name="" id="" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setLeadStatus(e.target.value);
                    }}>
                      <option value="">-- Choose a skill type --</option>
                      <option value="new">New</option>
                      <option value="hot">Hot</option>
                      <option value="warm">Warm</option>
                      <option value="cold">Cold</option>
                      <option value="win">Win</option>
                      <option value="lost">Lost</option>
                    </select>
                    <button className="bg-yellow-400 text-white w-26 rounded text-md cursor-pointer" onClick={() => setShowChangeLead(false)}>
                      Cancel
                    </button>
                    <button className="bg-[#15803c] text-white w-26 rounded text-md cursor-pointer" onClick={handleUpdateLeadStatus}>
                      Save
                    </button>
                  </div>
                }
              </div>

              {/* <div className="flex-col gap-1 leading-none">
                <h1 className="text-[22px] font-[600]">
                  {lead.bant?.budget?.value.trim() || "Not available"}
                </h1>
                <h3 className="text-[12px] text-gray-200">Potential Value</h3>
              </div> */}
            </div>
          </div>

          {/* ------------------------- Lead Score ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.leadScore}
            </h2>
            <ProgressBar progress={leadScore.score} color={leadScore.color} />
          </div>

          {/* ------------------------- Lead Menu ------------------------- */}
          <div className="pl-3 w-full max-w-[5%]">
            <LeadsMenu
              showViewDetails={false}
              showQualifiedButton={true}
              showProposalButtton={true}
              lead={lead}
              navigate={`/super-user`}
              customTrigger={
                <button
                  className="size-[40px] flex-center rounded-full border border-gray-150 bg-white
                      transition-all duration-200 ease-in-out hover:rotate-90 hover:border-gray-200 cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="size-1 bg-black rounded-full" />
                    <span className="size-1 bg-black rounded-full" />
                    <span className="size-1 bg-black rounded-full" />
                  </div>
                </button>
              }
            />
          </div>
        </div>

        <div className="flex items-start gap-2.5 w-full">
          {/* ------------------------- Contact Information ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.contactInformation}
            </h2>
            <div className="mt-4 flex flex-col gap-[26px]">
              {contactInfo.map((item, index) => (
                <div className="flex-between gap-2.5" key={index}>
                  <div className="flex gap-2">
                    <div className="mt-0.5">{item.icon}</div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[14px] text-gray-250 leading-none font-[500]">
                        {item.title}
                      </h3>
                      {item.website ? (
                        <h2 className="text-[14px] leading-none text-cold gray-hover">
                          {item.website ? (
                            <Link
                              prefetch={false}
                              href={item.website}
                              target="_blank"
                              className="underline-auto-from-front flex gap-2.5"
                            >
                              {item.value}
                              <ShareSvg />
                            </Link>
                          ) : (
                            <h2 className="text-[14px] leading-none font-[500]">{item.value}</h2>
                          )}
                        </h2>
                      ) : item.link ? (
                        <h2 className="text-[14px] leading-none text-cold gray-hover">
                          <Link
                            prefetch={false}
                            href={item.link}
                            target="_blank"
                            className="underline-auto-from-front flex gap-2.5"
                          >
                            {item.value}
                            <ShareSvg />
                          </Link>
                        </h2>
                      ) : (
                        <h2 className="text-[14px] leading-none font-[500]">{item.value}</h2>
                      )}
                    </div>
                  </div>
                  {item.copy && (
                    <button className="gray-hover">
                      <CopySvg />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------- Company Information ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.companyInformation}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Industry</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.companyIndustry || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Company Size</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.companySize || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">
                  Company Founded
                </h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.companyFoundedIn || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">
                  Current Job Duration
                </h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.currentJobDuration || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Website</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.companyWebsite ? (
                    <Link
                      href={
                        lead.companyWebsite.startsWith("http")
                          ? lead.companyWebsite
                          : `https://${lead.companyWebsite}`
                      }
                      target="_blank"
                      prefetch={false}
                      className="underline-auto-from-front text-cold gray-hover underline-offset-2"
                    >
                      {lead.companyWebsite}
                    </Link>
                  ) : (
                    "Not available"
                  )}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Job Title</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.jobTitle || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Source</h3>
                <h2 className="text-[14px] leading-none font-[500] capitalize">
                  {lead.platform || "Unknown"}
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>

        <div className="flex items-start gap-2.5 w-full">
          {/* ------------------------- Lead Bant Information ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[53.7%]">
            <div className="flex-between-start gap-2.5">
              <h2 className="text-[16px] font-[500] capitalize pb-2 border-b border-gray-n/30">
                {language?.leadQualificationBant}
              </h2>
              <BantButton leadId={id} language={language} />
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Budget</h3>
                <h2 className="text-[12px] leading-none font-[500]">
                  {lead.bant?.budget?.value || "Not available"}
                </h2>
              </div>
              {/* <div className="flex-center px-5 h-[25px] text-[12px] text-sec bg-sec-light rounded-lg">
                Qualified
              </div> */}
            </div>

            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Authority</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  Decision maker: &nbsp;
                  <span
                    className={`text-[12px] ${lead.bant?.authority?.isDecisionMaker ? "text-pri" : "text-hot"
                      }`}
                  >
                    {lead.bant?.authority?.isDecisionMaker ? "Yes" : "No"}
                  </span>
                  {lead.bant?.authority?.value && (
                    <div className="mt-1 text-[12px]">{lead.bant.authority.value}</div>
                  )}
                </h2>
              </div>
              {/* <div className="flex-center px-5 h-[25px] text-[12px] text-hot bg-hot-light rounded-lg">
                High
              </div> */}
            </div>

            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Need</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {lead.bant?.need?.needsList && lead.bant.need.needsList.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {lead.bant.need.needsList.map((needItem: string, index: number) => (
                        <li key={index}>{needItem}</li>
                      ))}
                    </ul>
                  ) : lead.bant?.need?.value ? (
                    <ul className="list-disc list-inside space-y-1">
                      {lead.bant.need.value.map((needItem: string, index: number) => (
                        <li key={index}>{needItem}</li>
                      ))}
                    </ul>
                    // <div className="text-[12px]">{lead.bant.need.value}</div>
                  ) : (
                    "Not available"
                  )}
                </h2>
              </div>
              {/* <div className="flex-center px-5 h-[25px] text-[12px] text-cold bg-cold-light rounded-lg">
                Urgent
              </div> */}
            </div>

            <div className="mt-4 flex justify-between gap-2.5 mb-20">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Timeline</h3>
                <h2 className="text-[12px] leading-none font-[500]">
                  {lead.bant?.timeline?.value || "Expected decision timeframe not available"}
                </h2>
              </div>
              {/* <div className="flex-center min-w-[90px] px-5 h-[25px] text-[12px] text-pipeline bg-pipeline-light rounded-lg">
                Q1 2025
              </div> */}
            </div>
          </div>

          {/* ------------------------- Deal Health Information ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.dealHealthInformation}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Health Score</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {dealHealth?.healthScore || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Health Status</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {dealHealth?.healthStatus || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Ai Analysis</h3>
                <ul className="mt-1">
                  <li className="text-[14px] leading-none font-[500] py-1">Churn Risk Score: {dealHealth?.aiAnalysis?.churnRiskScore}</li>
                  <li className="text-[14px] leading-none font-[500] py-1">Predicted Outcome: {dealHealth?.aiAnalysis?.predictedOutcome}</li>
                  <li className="text-[14px] leading-none font-[500] py-1">Reasoning: {dealHealth?.aiAnalysis?.reasoning}</li>
                  <li className="text-[14px] leading-none font-[500] py-1">Success Probility: {dealHealth?.aiAnalysis?.successProbility}</li>
                </ul>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Velocity Metrics</h3>
                <ul className="mt-1">
                  <li className="text-[14px] leading-none font-[500] py-1">Contact Frequency Trend: {dealHealth?.velocityMetrics?.contactFrequencyTrend}</li>
                  <li className="text-[14px] leading-none font-[500] py-1">Stage Progress Speed: {dealHealth?.velocityMetrics?.stageProgressSpeed}</li>
                  {/* <li className="text-[14px] leading-none font-[500] py-1">Engagement Decay Days: {dealHealth?.velocityMetrics?.engagementDecayDays}</li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="flex-between w-full items-stretch pb-5">
          {/* --------------- Skills & Interest */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[53.5%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.skillsInterest}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {/* Skills Section */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">
                  LinkedIn Skills
                </h3>
                <div className="flex flex-wrap gap-2.5 text-pri">
                  {lead.skills && lead.skills.length > 0 ? (
                    lead.skills.map((skill: { title: string }, index: number) => (
                      <div key={index} className="bg-pri-light rounded-4xl py-2.5 px-5">
                        {skill.title || "Skill"}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-200 text-sm">No skills available</div>
                  )}
                </div>
              </div>

              {/* Interests Section */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">
                  LinkedIn Interests
                </h3>
                <div className="flex flex-wrap gap-2.5 text-pri">
                  {lead.interests && lead.interests.length > 0 ? (
                    lead.interests.map(
                      (
                        interest: { section_name: string; titleV2: string; title: string },
                        index: number
                      ) => (
                        <div key={index} className="bg-pri-light rounded-4xl py-2.5 px-5">
                          {interest.section_name ||
                            interest.titleV2 ||
                            interest.title ||
                            "Interest"}
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-gray-200 text-sm">No interests available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ------------------------- Next Best Action ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[45.5%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              {language?.nextBestAction}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Action Type</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {nba?.actionType || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Channel</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {nba?.channel || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Title</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {nba?.title || "Not available"}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Description</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  {nba?.description || "Not available"}
                </h2>

              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Confidence Score</h3>
                <h2 className="text-[14px] leading-none font-[500]">

                  {nba?.confidenceScore || "Not available"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadsPage;