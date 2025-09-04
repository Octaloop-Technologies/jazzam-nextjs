import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import FollowUpButtons from "@/components/view/dashboard/follow-up/FollowUpButtons";
import ChannelToggle from "@/components/view/dashboard/leads/ChannelToggle";
import LanguageToggle from "@/components/view/dashboard/leads/LanguageToggle";
import Input from "@/components/ui/input/Input";
import RichTextEditor from "@/components/ui/textarea/RichTextEditor";

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
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-[500] mb-2">Channel*</h3>
                  <ChannelToggle />
                </div>

                {/* <div className="flex flex-col-2">
                  <h3 className="text-sm font-[500]">Tone*</h3>
                  <div></div>
                </div> */}

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-[500]">language*</h3>
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[65%] p-[30px] bg-white border border-gray-b rounded-3xl">
            <h1 className="text-[16px] font-[500] pb-1 border-b border-gray-n/30">Message</h1>
            <div className="mt-[20px] space-y-4">
              <Input
                label="Subject"
                placeholder="Subject"
                required
                variant="background"
                inputSize="md"
                labelClass="text-[14px] font-[500]"
              />

              <RichTextEditor
                placeholder="Write a message to Sarah...."
                required
                labelClass="text-[14px] font-[500]"
                minHeight="350px"
              />
            </div>
          </div>
        </div>

        <div className="mt-[35px] flex justify-center gap-2.5">
          <FollowUpButtons />
        </div>
      </div>
    </section>
  );
};

export default FollowPage;
