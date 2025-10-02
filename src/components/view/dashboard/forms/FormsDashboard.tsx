"use client";

import { useState, useEffect } from "react";
import { ExternalLinkSvg } from "@/components/svgs/LeadsAnalysisSvgs";
import { CopySvg } from "@/components/svgs/NavbarSvgs";
import { useToast } from "@/lib/hooks/useToast";
import { getAvailablePlatforms } from "@/app/super-user/forms/action";

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

  // Fetch forms and available platforms
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [platformsResponse] = await Promise.all([getAvailablePlatforms()]);

      if (platformsResponse.success) {
        setAvailablePlatforms(platformsResponse.data?.platforms || []);
      } else {
        console.error("Platforms fetch failed:", platformsResponse.message);
        error(`Failed to load platforms: ${platformsResponse.message}`);
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
        return "🔗";
      case "meta":
        return "📘";
      case "twitter":
        return "🐦";
      case "instagram":
        return "📷";
      default:
        return "📝";
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
                    value={platform.formUrl || ""}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs border border-gray-b rounded bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(platform.formUrl || "", "Form URL")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy Form URL"
                  >
                    <CopySvg />
                  </button>
                  <a
                    href={platform.formUrl || ""}
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
