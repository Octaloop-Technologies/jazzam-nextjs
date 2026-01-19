"use client";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import FollowUpButtons from "@/components/view/dashboard/follow-up/FollowUpButtons";
import ChannelToggle from "@/components/view/dashboard/leads/ChannelToggle";
import LanguageToggle from "@/components/view/dashboard/leads/LanguageToggle";
import Input from "@/components/ui/input/Input";
import RichTextEditor from "@/components/ui/textarea/RichTextEditor";
import React, { useState, use, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/lib/hooks/useToast";
import tokenStorage from "@/lib/utils/tokenStorage";
import { useSearchParams } from "next/navigation";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";

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
  const companyId = useSearchParams()?.get("companyId");
  const lang = getCurrentLang();
  const [language, setLanguage] = useState<any>();

  useEffect(() => {
    const fetchLanguage = async() => {
      const dict = (await getDictionary(lang))?.superUser?.navbar?.leads;
      setLanguage(dict)
    }
    fetchLanguage()
  }, [])


  const leadName = followUp?.split("%20")

  const { success, error: ErrorToast } = useToast();

  const { accessToken } = tokenStorage?.getTokens()


  const [email, setEmail] = useState<EmailData>({
    subject: "",
    message: "",
  });
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [followupLoading, setFollowupLoading] = useState<boolean>(false);


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
    { label: "Leads", path: companyId !== null ? "/super-user" : "/super-user" },
    { label: `${leadName[0]}  ${leadName[1]}`, path: companyId !== null ? `/super-user/leads/${id}?companyId=${companyId}` : `/super-user/leads/${id}` },
    { label: "Follow up", path: companyId !== null ? `/super-user/leads/${id}/${followUp}?companyId=${companyId}` : `/super-user/leads/${id}/${followUp}` },
  ];

  const handleScheduleFollowup = async(scheduledDate: Date) => {
    if (!email.subject || !email.message) {
      ErrorToast(language?.msgOrSubjectEmptyMsg);
      return;
    }

    try {
      setScheduleLoading(true);
        const params = new URLSearchParams();

        if(companyId) params.append("companyId", companyId);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/create-followup/${id}?${params.toString()}`, {
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
            success(language?.scheduleFollowUp);
          }

        }
    } catch (error) {
      console.error("Email send failed");
      ErrorToast(language?.emailFailSend);
    } finally {
      setScheduleLoading(false);
    }
  }

  const handleSendFollowupNow = async() => {
    //     console.log("subject********", email.subject);
    // console.log("message********", email.message);

    if (!email.subject || !email.message) {
      ErrorToast(language?.msgOrSubjectEmptyMsg);
      return;
    }

    try {
      setFollowupLoading(true);

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

      const params = new URLSearchParams();

      if(companyId) params.append("companyId", companyId)

      if (result.status === 200) {
        success(language?.emailSuccess);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/create-followup/${id}?${params.toString()}`, {
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
      console.error("Email send failed");
      ErrorToast(language?.emailFailSend);
    } finally {
      setFollowupLoading(false);
    }
  }

  return (
    <section>
      <Breadcrumb segments={segments} />

      <div className="mt-4 wrapper">
        <div className="flex items-start gap-2.5">
          <div className="w-full max-w-[35%] p-[30px] bg-white border border-gray-b rounded-3xl">
            <h1 className="text-[20px] font-[500]">{language?.followUpSettings}</h1>
            <div className="mt-5">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-[500] mb-2">{language?.Channel}*</h3>
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
          <FollowUpButtons handleScheduleFollowup={handleScheduleFollowup} handleSendFollowupNow={handleSendFollowupNow} followupLoading={followupLoading} scheduleLoading={scheduleLoading} />
        </div>
      </div>
    </section>
  );
};

export default FollowPage;
