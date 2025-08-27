import { HotLeadsSvg } from "@/components/svgs/LeadsAnalysisSvgs";
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

const LeadsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // ==========================================================
  // Backcrumb Links and names
  // ==========================================================
  const segments = [
    { label: "Leads", path: "/" },
    { label: "Wade warren", path: `/leads/${id}` },
  ];

  // ==========================================================
  // Lead Details
  // ==========================================================
  const lead: Lead = {
    id: "1",
    name: "Wade Warren",
    company: "TechCorp Inc",
    email: "wadewarren@gmail.com",
    followUp: "follow-up-1",
  };

  const leadScore: LeadScore = {
    score: 95,
    color: "bg-sec",
  };

  const contactInfo = [
    {
      icon: <EmailSvg />,
      title: "Email",
      value: "wade.12@gmail.com",
      copy: true,
    },
    {
      icon: <PhoneSvg />,
      title: "Phone no.",
      value: "+1 (555) 123-4567",
      copy: true,
    },
    {
      icon: <CompanySvg />,
      title: "Company",
      value: "TechCorp Inc",
      copy: false,
    },
    {
      icon: <LocationSvg />,
      title: "Location",
      value: "San Francisco, CA",
      copy: false,
    },
    {
      icon: <LinkedInSvg />,
      title: "LinkedIn profile",
      value: "Wade Warren",
      link: "https://www.linkedin.com/in/wade-warren-1234567890",
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
                  <div className="size-[60px] rounded-full overflow-hidden">
                    <OptimizedImage
                      src="/assets/images/leads/dummy-profile.png"
                      alt="avatar"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <p className="text-[18px] font-[500]">{lead.name}</p>
                    <p className="text-[12px] text-gray-200">{lead.company}</p>
                    <p className="text-[12px] text-gray-200">{lead.email}</p>
                  </div>
                </div>
                <div className="mt-2.5 w-[107px] h-[30px] text-sm text-hot bg-hot-light rounded-lg flex-center gap-1">
                  <HotLeadsSvg className="size-4" />
                  Hot lead
                </div>
              </div>

              <div className="flex-col gap-1 leading-none">
                <h1 className="text-[22px] font-[600]">$89,500</h1>
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
                      {item.link ? (
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
                <h2 className="text-[14px] leading-none font-[500]">Technology</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Company Size</h3>
                <h2 className="text-[14px] leading-none font-[500]">50-100 employees</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Website</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  <Link
                    href="https://techcorp.com"
                    target="_blank"
                    prefetch={false}
                    className="underline-auto-from-front text-cold gray-hover underline-offset-2"
                  >
                    https://techcorp.com
                  </Link>
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
                <h2 className="text-[14px] leading-none font-[500]">$50K - $100K</h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-sec bg-sec-light rounded-lg">
                Qualified
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Authority</h3>
                <h2 className="text-[14px] leading-none font-[500]">Decision maker: Yes</h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-hot bg-hot-light rounded-lg">
                High
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] text-gray-250 leading-none font-[500]">Need</h3>
                <h2 className="text-[14px] leading-none font-[500]">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Scaling challenges</li>
                    <li>Team coordination</li>
                    <li>Cost optimization</li>
                  </ul>
                </h2>
              </div>
              <div className="flex-center px-5 h-[25px] text-[12px] text-cold bg-cold-light rounded-lg">
                Urgent
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
