"use client";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import FollowUpButtons from "@/components/view/dashboard/follow-up/FollowUpButtons";
import ChannelToggle from "@/components/view/dashboard/leads/ChannelToggle";
import LanguageToggle from "@/components/view/dashboard/leads/LanguageToggle";
import Input from "@/components/ui/input/Input";
import RichTextEditor from "@/components/ui/textarea/RichTextEditor";
import React, { useState, use } from "react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/lib/hooks/useToast";
import tokenStorage from "@/lib/utils/tokenStorage";
import { useSearchParams } from "next/navigation";

const emailJsKey: string = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ''
emailjs.init(emailJsKey);

interface EmailData {
  subject: string;
  message: string;
}


interface FollowPageProps {
  params: Promise<{ id: string; followUp: string }>;
}

const FollowPage = ({ params }: FollowPageProps) => {
  const { id, followUp } = use(params);
    const userEmail = useSearchParams()?.get("userEmail");

  const leadName = followUp?.split("%20")

  const decodedFollowUpEmail = decodeURIComponent(followUp);

  const { success, error: ErrorToast } = useToast();

  const { accessToken } = tokenStorage?.getTokens()


  const [email, setEmail] = useState<EmailData>({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const emailServiceId: string = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? '';
  const emailTemplateId: string = process.env.NEXT_PUBLIC_FOLLOWUP_EMAIL_TEMPLATE_ID ?? '';

  const handleEmailData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmail((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================================================
  // Backcrumb Links and names
  // ==========================================================
  const segments = [
    { label: "Leads", path: "/super-user" },
    { label: `${leadName[0]}  ${leadName[1]}`, path: `/super-user/leads/${id}` },
    { label: "Follow up", path: `/super-user/leads/${id}/${followUp}` },
  ];

  const handleScheduleFollowup = async(scheduledDate: Date) => {
    if (!email.subject || !email.message) {
      ErrorToast("Message or subject cannot be empty");
      return;
    }

    try {
      setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/create-followup/${id}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            subject: email.subject, 
            message: email.message,
            status: "scheduled",
            scheduled: true, 
            scheduledDate 
          })
        });

        if(res.ok){
          const data = await res.json();
          if(data?.success === true){
            console.log("data****", data?.data)
            success("Scheduled follow up created successfully");
          }

        }
    } catch (error) {
      console.error("Email send failed:", error);
      ErrorToast("Failed to send email");
    } finally {
      setLoading(false);
    }
  }

  const handleSendFollowupNow = async() => {
    //     console.log("subject********", email.subject);
    // console.log("message********", email.message);

    if (!email.subject || !email.message) {
      ErrorToast("Message or subject cannot be empty");
      return;
    }

    try {
      setLoading(true);

      // now send the email using EmailJS
      const result = await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          subject: email.subject,
          message: email.message,
          email: userEmail,
          name: "Lead Generation Team",
        },
      );

      if (result.status === 200) {
        success("Email sent successfully!");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/create-followup/${id}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            subject: email.subject, 
            message: email.message,
            status: "submitted",
            scheduled: false, 
          })
        });

        if(res.ok){
          const data = await res.json();
          if(data?.success === true){
            console.log("data****", data?.data)
          }

        }
      }
    } catch (error) {
      console.error("Email send failed:", error);
      ErrorToast("Failed to send email");
    } finally {
      setLoading(false);
    }
  }

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

                {/* <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-[500]">language*</h3>
                  <LanguageToggle />
                </div> */}
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
                name="subject"
                value={email.subject}
                onChange={handleEmailData}
              />

              <RichTextEditor
                placeholder="Write a message"
                required
                labelClass="text-[14px] font-[500]"
                minHeight="350px"
                value={email.message}
                onChange={(value) =>
                  handleEmailData({
                    target: { name: "message", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />

            </div>
          </div>
        </div>

        <div className="mt-[35px] flex justify-center gap-2.5">
          <FollowUpButtons handleScheduleFollowup={handleScheduleFollowup} handleSendFollowupNow={handleSendFollowupNow} />
        </div>
      </div>
    </section>
  );
};

export default FollowPage;
