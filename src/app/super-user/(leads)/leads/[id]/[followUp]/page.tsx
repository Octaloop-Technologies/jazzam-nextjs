"use client";
import React, { useState, use } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import FollowUpButtons from "@/components/view/dashboard/follow-up/FollowUpButtons";
import ChannelToggle from "@/components/view/dashboard/leads/ChannelToggle";
import LanguageToggle from "@/components/view/dashboard/leads/LanguageToggle";
import Input from "@/components/ui/input/Input";
import RichTextEditor from "@/components/ui/textarea/RichTextEditor";
import emailjs from "@emailjs/browser";
import { useToast } from "@/lib/hooks/useToast";

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

  const decodedFollowUpEmail = decodeURIComponent(followUp);

  const { success, error: ErrorToast } = useToast()


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

  const handleSendFollowup = async () => {
    // console.log("subject********", email.subject);
    // console.log("message********", email.message);

    // return;

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
          email: decodedFollowUpEmail,
          name: "Lead Generation Team",
        },
      );

      if (result.status === 200) {
        success("Email sent successfully!");
      }
    } catch (error) {
      console.error("Email send failed:", error);
      ErrorToast("Failed to send email");
    } finally {
      setLoading(false);
    }
  }

  const handleScheduleConfirm = async (date: Date) => {
    // alert("jejeje");
    // return;
    const { subject, message } = email
    try {
      const cookieString = document.cookie;
      const cookies = Object.fromEntries(
        cookieString.split("; ").map(c => c.split("="))
      );
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/schedule-follow-up/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authotization: `Bearer ${cookies?.accessToken}`
        },
        body: JSON.stringify({
          date,
          subject,
          message,
        }),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(dataResponse.message || "Failed to schedule follow-up");
      }

      console.log("✅ Lead scheduled successfully:", dataResponse);
      return dataResponse;
    } catch (error) {
      console.error("❌ Error scheduling follow-up:", error);
      throw error;
    }
  }

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

                {/* <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-[500]">Language*</h3>
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
          <FollowUpButtons handleSendNow={handleSendFollowup} handleScheduleConfirm={handleScheduleConfirm} />
        </div>
      </div>
    </section>
  );
};

export default FollowPage;
