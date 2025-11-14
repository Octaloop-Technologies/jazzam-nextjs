"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CRMIntegrationCard } from "@/components/view/dashboard/integrations/CRMIntegrationCard";
import { useToast } from "@/lib/hooks/useToast";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import { getChannelLimit, canAddChannel, PlanKey } from "@/lib/constants/subscriptionPlans";
import {
  getCRMProviders,
  getCRMIntegration,
  initCRMOAuth,
  disconnectCRM,
  testCRMConnection,
} from "@/lib/api/integrations";

interface CRMProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  configured: boolean;
}

interface CRMIntegration {
  _id: string;
  provider: string;
  status: string;
  accountInfo?: {
    accountName?: string;
    accountEmail?: string;
  };
}

interface Error {
  message: string;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(true);

  // CRM State
  const [providers, setProviders] = useState<CRMProvider[]>([]);
  const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([]);

  // Get channel limits
  const channelLimit = getChannelLimit((user?.subscriptionPlan as PlanKey) || "free");
  const canAddMoreChannels = canAddChannel(
    (user?.subscriptionPlan as PlanKey) || "free",
    crmIntegrations.length
  );

  useEffect(() => {
    // Check for OAuth callback
    const integration = searchParams?.get("integration");
    const provider = searchParams?.get("provider");
    const error = searchParams?.get("error");

    if (integration === "success" && provider) {
      toast.success(`Successfully connected to ${provider}!`);
      // Clear URL params
      router.replace("/super-user/integrations");
    } else if (integration === "failed") {
      toast.error(`Integration failed: ${error || "Unknown error"}`);
      router.replace("/super-user/integrations");
    }

    fetchCRMData();
  }, [searchParams, router]);

  const fetchCRMData = async () => {
    try {
      setLoading(true);

      const [providersData, integrationData] = await Promise.all([
        getCRMProviders(),
        getCRMIntegration(),
      ]);

      console.log("Providers Data:", providersData?.data?.data);
      console.log("Integration Data:", integrationData?.data?.data);

      setProviders(providersData?.data?.data || []);
      setCrmIntegrations(integrationData?.data?.data || []);
    } catch (error) {
      console.error("Error fetching CRM data:", error);
      toast.error("Failed to load CRM integration data");
    } finally {
      setLoading(false);
    }
  };

  const handleCRMConnect = async (providerId: string) => {
    console.log("providerId********", providerId)

    try {
      // Check if user can add more channels
      if (!canAddMoreChannels) {
        toast.error(
          `You've reached your channel limit. Your ${user?.subscriptionPlan} plan allows ${
            channelLimit === "unlimited" ? "unlimited" : channelLimit
          } channel${channelLimit === 1 ? "" : "s"}. Please upgrade your plan to add more channels.`
        );
        return;
      }

      const data = await initCRMOAuth(providerId);

      if (!data.success) {
        throw new Error("Failed to initiate connection");
      }

      console.log("data*****connect****", data.data.data?.authUrl);

      // Redirect to OAuth URL
      window.location.href = data?.data?.data?.authUrl;
    } catch (error: Error | unknown) {
      toast.error("Failed to initiate connection");
    }
  };

  const handleCRMDisconnect = async (integrationId: string) => {
    if (!confirm("Are you sure you want to disconnect this integration?")) {
      return;
    }

    try {
      const data = await disconnectCRM(integrationId);

      if (!data.success) {
        throw new Error( "Failed to disconnect");
      }

      toast.success("Integration disconnected successfully");
      fetchCRMData();
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to disconnect");
    }
  };

  const handleCRMTest = async (integrationId: string) => {
    try {
      const data = await testCRMConnection(integrationId);

      if (!data.success) {
        throw new Error("Connection test failed");
      }

      toast.success("Connection test successful!");
    } catch (error: Error | unknown) {
      toast.error("Connection test failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CRM Integration</h1>
        <p className="text-gray-600 mt-2">Connect your CRM to automatically sync leads</p>

        {/* Channel Limits Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Channel Usage</h3>
              <p className="text-sm text-blue-700">
                {crmIntegrations.length} of {channelLimit === "unlimited" ? "∞" : channelLimit}{" "}
                channels used
              </p>
            </div>
            {!canAddMoreChannels && (
              <div className="text-right">
                <p className="text-sm text-red-600 font-medium">Channel limit reached</p>
                <button
                  onClick={() => router.push("/super-user/subscription")}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Upgrade plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sec"></div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Available CRM Providers</h2>
            <p className="text-gray-600">
              Connect your CRM to automatically sync leads and contacts
            </p>
          </div>

          <div className="grid gap-4">
            {providers?.map((provider) => {
              const connectedIntegration = crmIntegrations.find(
                (integration) => integration.provider === provider.id
              );
              const isConnected = !!connectedIntegration;

              return (
                <CRMIntegrationCard
                  key={provider.id}
                  provider={provider}
                  isConnected={isConnected}
                  accountInfo={connectedIntegration?.accountInfo}
                  onConnect={() => handleCRMConnect(provider.id)}
                  onDisconnect={() => handleCRMDisconnect(connectedIntegration?._id || "")}
                  onTest={() => handleCRMTest(connectedIntegration?._id || "")}
                  disabled={!canAddMoreChannels && !isConnected}
                />
              );
            })}
          </div>

          {!providers.length && (
            <div className="text-center py-12 text-gray-500">
              <p>No CRM providers configured</p>
              <p className="text-sm mt-2">Contact your administrator to configure CRM providers</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
