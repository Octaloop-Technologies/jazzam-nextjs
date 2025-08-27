import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import React from "react";

const FollowPage = async ({ params }: { params: Promise<{ id: string; followUp: string }> }) => {
  const { id, followUp } = await params;

  // ==========================================================
  // Backcrumb Links and names
  // ==========================================================
  const segments = [
    { label: "Leads", path: "/" },
    { label: "Wade warren", path: `/leads/${id}` },
    { label: "Follow up", path: `/leads/${id}/${followUp}` },
  ];

  return (
    <section>
      <Breadcrumb segments={segments} />

      <div className="mt-4 wrapper">
        <div className="flex items-start gap-2.5">
          <div className="w-full max-w-[35%] p-[30px] bg-white border border-gray-b rounded-3xl">
            <h1 className="text-[20px] font-[500]">Follow up settings</h1>
            <div className="mt-5">
              <div>
                <h3>Channel*</h3>
                <div></div>
              </div>

              <div>
                <h3>Channel*</h3>
                <div></div>
              </div>

              <div>
                <h3>language*</h3>
                <div></div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[65%] p-[30px] bg-white border border-gray-b rounded-3xl">
            <h1>Message</h1>
            <h2>Subject*</h2>
          </div>
        </div>

        <div className="flex gap-2.5">
          <PrimaryButton title="Cancel" className="w-fit" bordered iconRight={<CloseSvg />} />
          <PrimaryButton
            title="Schedule"
            className="!bg-[#EF8305] w-fit"
            iconRight={<CloseSvg />}
          />
          <PrimaryButton title="Send now" className="w-fit" iconRight={<CloseSvg />} />
        </div>
      </div>
    </section>
  );
};

export default FollowPage;

// ======================================================
// Svgs
// ======================================================
const CloseSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M0.998535 11L11.0014 1M0.998535 1L11.0014 11"
        stroke="#15803C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
