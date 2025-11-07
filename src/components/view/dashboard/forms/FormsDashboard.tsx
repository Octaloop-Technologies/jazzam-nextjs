"use client";

import { useState, useEffect, SVGProps } from "react";
import { ExternalLinkSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import { CopySvg } from "@/components/svgs/NavbarSvgs";
import { useToast } from "@/lib/hooks/useToast";
import { getAvailablePlatforms } from "@/lib/api/forms";
import { useSearchParams } from "next/navigation";

interface AvailablePlatform {
  platform: string;
  name: string;
  description: string;
  icon: string;
  formUrl: string;
  accessToken: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }>;
}

const FormsDashboard = () => {
  const [availablePlatforms, setAvailablePlatforms] = useState<AvailablePlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const searchParams = useSearchParams();

  const companyId = searchParams?.get("companyId");

  // Fetch forms and available platforms
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [platformsResponse] = await Promise.all([getAvailablePlatforms(companyId)]);

      if (platformsResponse.success) {
        console.log("platforms*****", platformsResponse?.data)
        setAvailablePlatforms(platformsResponse.data?.platforms || []);
      } else {
        console.error("Platforms fetch failed");
        error(`Failed to load platforms`);
      }
    } catch (err) {
      console.error("Error fetching forms data:", err);
      error("Error loading forms");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success(`${type} copied to clipboard!`);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      error("Failed to copy to clipboard");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedInicon />;
      case "meta":
        return <Metaicon />;
      case "twitter":
        return <Twittericon />;
      case "instagram":
        return <Instagramicon />;
      default:
        return <></>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between gap-1.5">
        <div>
          <h1 className="text-[32px] font-[500] capitalize">Lead Generation Forms</h1>
          <p className="text-gray-200 text-sm mt-1">
            Your unique form endpoints for automatic lead generation
          </p>
        </div>
      </div>

      {/* Platform Form Endpoints */}
      <div className="bg-white border border-gray-b rounded-3xl p-6">
        <h2 className="text-[18px] font-[600] mb-4">Your Lead Generation Form Endpoints</h2>
        <p className="text-gray-200 text-sm mb-6">
          Your unique form endpoints for collecting leads from different platforms. Share these URLs
          with prospects to automatically generate leads.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availablePlatforms.map((platform) => (
            <div
              key={platform.platform}
              className="border border-gray-b rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getPlatformIcon(platform.platform)}</span>
                <h3 className="font-medium">{platform.name}</h3>
              </div>

              <p className="text-sm text-gray-200 mb-4">{platform.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ready to Use
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`https://jazzam.ai/form/${platform.formUrl.split("/")[4]}` || ""}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs border border-gray-b rounded bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://jazzam.ai/form/${platform.formUrl.split("/")[4]}` || "", "Form URL")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy Form URL"
                  >
                    <CopySvg />
                  </button>
                  <a
                    href={`https://jazzam.ai/form/${platform.formUrl.split("/")[4]}` || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Open Form"
                  >
                    <ExternalLinkSvg />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormsDashboard;

// Icons
const Metaicon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="size-6" {...props}>
      <rect
        width="118.35"
        height="118.35"
        x="4.83"
        y="4.83"
        fill="#3d5a98"
        rx="6.53"
        ry="6.53"
      ></rect>
      <path
        fill="#fff"
        d="M86.48 123.17V77.34h15.38l2.3-17.86H86.48v-11.4c0-5.17 1.44-8.7 8.85-8.7h9.46v-16A126.56 126.56 0 0 0 91 22.7c-13.62 0-23 8.3-23 23.61v13.17H52.62v17.86H68v45.83z"
      ></path>
    </svg>
  );
};

const LinkedInicon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="size-6" {...props}>
      <path
        fill="#0076b2"
        d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3z"
      ></path>
      <path
        fill="#fff"
        d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"
      ></path>
    </svg>
  );
};

const Twittericon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-6" {...props}>
      <path
        fill="currentColor"
        d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z"
      ></path>
    </svg>
  );
};

const Instagramicon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-6" {...props}>
      <g fill="none">
        <rect width="256" height="256" fill="url(#skillIconsInstagram0)" rx="60"></rect>
        <rect width="256" height="256" fill="url(#skillIconsInstagram1)" rx="60"></rect>
        <path
          fill="#fff"
          d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396s-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413s.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5s6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355s22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334s-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334"
        ></path>
        <defs>
          <radialGradient
            id="skillIconsInstagram0"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FD5"></stop>
            <stop offset=".1" stopColor="#FD5"></stop>
            <stop offset=".5" stopColor="#FF543E"></stop>
            <stop offset="1" stopColor="#C837AB"></stop>
          </radialGradient>
          <radialGradient
            id="skillIconsInstagram1"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3771C8"></stop>
            <stop offset=".128" stopColor="#3771C8"></stop>
            <stop offset="1" stopColor="#60F" stopOpacity="0"></stop>
          </radialGradient>
        </defs>
      </g>
    </svg>
  );
};
