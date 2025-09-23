import { HotLeadsSvg, ColdLeadsSvg, NewLeadsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
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
import { getLeadById } from "../../action";
import { notFound } from "next/navigation";

const LeadsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch lead data from API
  const leadResponse = await getLeadById({ id });

  if (!leadResponse.success || !leadResponse.data) {
    notFound();
  }

  const lead = leadResponse.data;

  // ==========================================================
  // Backcrumb Links and names
  // ==========================================================
  const segments = [
    { label: "Leads", path: "/super-user" },
    {
      label: lead.fullName || `${lead.firstName} ${lead.lastName}` || "Lead",
      path: `/super-user/leads/${id}`,
    },
  ];

  // ==========================================================
  // Lead Score Calculation (based on LinkedIn data)
  // ==========================================================
  const calculateLeadScore = (lead: Lead) => {
    let score = 0;

    // Base score for having LinkedIn profile
    if (lead.linkedinProfileUrl) score += 20;

    // Email availability
    if (lead.email) score += 15;

    // Phone availability
    if (lead.phone) score += 10;

    // Company information
    if (lead.company) score += 10;
    if (lead.companyIndustry) score += 5;
    if (lead.companySize) score += 5;

    // Profile completeness
    if (lead.headline) score += 10;
    if (lead.about) score += 10;
    if (lead.experiences && lead.experiences.length > 0) score += 10;
    if (lead.educations && lead.educations.length > 0) score += 5;

    // Connections and followers
    if (lead.connections && lead.connections > 500) score += 5;
    if (lead.followers && lead.followers > 100) score += 5;

    return Math.min(score, 100);
  };

  const leadScoreValue = calculateLeadScore(lead);
  const leadScore: LeadScore = {
    score: leadScoreValue,
    color: leadScoreValue >= 80 ? "bg-sec" : leadScoreValue >= 60 ? "bg-pipeline" : "bg-cold",
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
      title: "LinkedIn profile",
      value: lead.fullName || `${lead.firstName} ${lead.lastName}` || "LinkedIn Profile",
      link: lead.linkedinProfileUrl || "#",
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
                <div
                  className={`mt-2.5 w-[107px] h-[30px] text-sm rounded-lg flex-center gap-1 ${
                    lead.status === "hot"
                      ? "text-hot bg-hot-light"
                      : lead.status === "cold"
                      ? "text-cold bg-cold-light"
                      : lead.status === "new"
                      ? "text-pri bg-pri-light"
                      : "text-pipeline bg-pipeline-light"
                  }`}
                >
                  {lead.status === "hot" && <HotLeadsSvg className="size-4" />}
                  {lead.status === "cold" && <ColdLeadsSvg className="size-4" />}
                  {lead.status === "new" && <NewLeadsSvg className="size-4" />}
                  {lead.status === "warm" && <HotLeadsSvg className="size-4" />}
                  {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || "Lead"}
                </div>
              </div>

              <div className="flex-col gap-1 leading-none">
                <h1 className="text-[22px] font-[600]">{lead.potentialValue || "Not available"}</h1>
                <h3 className="text-[12px] text-gray-200">Potential Value</h3>
              </div>
            </div>
          </div>

          {/* ------------------------- Lead Score ------------------------- */}
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[40%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              Lead score
            </h2>
            <ProgressBar progress={leadScore.score} color={leadScore.color} />
          </div>

          {/* ------------------------- Lead Menu ------------------------- */}
          <div className="pl-3 w-full max-w-[5%]">
            <LeadsMenu
              showViewDetails={false}
              lead={lead}
              customTrigger={
                <button
                  className="size-[40px] flex-center rounded-full border border-gray-150 bg-white
                      transition-all duration-200 ease-in-out hover:rotate-90 hover:border-gray-200"
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
              Contact information
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
              Company Information
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
                <h2 className="text-[14px] leading-none font-[500]">LinkedIn</h2>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>

        {/* ------------------------- Lead Qualification (BANT) ------------------------- */}
        <div className="flex-between gap-2.5 w-full items-stretch">
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              Lead Qualification (BANT)
            </h2>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Budget</h3>
                <h2 className="text-[12px] leading-none font-[500]">
                  {lead.bant?.budget?.value || "Not available"}
                </h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-sec bg-sec-light rounded-lg">
                Qualified
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Authority</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  Decision maker: {lead.bant?.authority?.isDecisionMaker ? "Yes" : "No"}
                  {lead.bant?.authority?.value && (
                    <div className="mt-1 text-[12px]">
                      {lead.bant.authority.value}
                    </div>
                  )}
                </h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-hot bg-hot-light rounded-lg">
                High
              </div>
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
                    <div className="text-[12px]">{lead.bant.need.value}</div>
                  ) : (
                    "Not available"
                  )}
                </h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-cold bg-cold-light rounded-lg">
                Urgent
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Timeline</h3>
                <h2 className="text-[12px] leading-none font-[500]">
                  {lead.bant?.timeline?.value || "Expected decision timeframe not available"}
                </h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-pipeline bg-pipeline-light rounded-lg">
                Q1 2025
              </div>
            </div>
          </div>
          {/* ----------------------- Not Needed : Design Only ----------------------- */}
          <div className="p-[30px] w-full max-w-[40%]" aria-hidden="true" />
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>

        <div className="flex-between gap-2.5 w-full items-stretch pb-5">
          <div className="p-[30px] w-full border border-gray-b rounded-3xl bg-white max-w-[55%]">
            <h2 className="text-[16px] leading-none font-[500] capitalize pb-2 border-b border-gray-n/30">
              Skills & Interests
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
          {/* ----------------------- Not Needed : Design Only ----------------------- */}
          <div className="p-[30px] w-full max-w-[40%]" aria-hidden="true" />
          <div className="w-full max-w-[5%]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default LeadsPage;
