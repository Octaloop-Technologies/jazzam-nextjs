"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CRMIntegrationCard } from "@/components/view/dashboard/integrations/CRMIntegrationCard";
import { useToast } from "@/lib/hooks/useToast";
import {
  getCRMProviders,
  getCRMIntegration,
  initCRMOAuth,
  disconnectCRM,
  testCRMConnection,
} from "./action";

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
  const [loading, setLoading] = useState(true);

  // CRM State
  const [providers, setProviders] = useState<CRMProvider[]>([]);
  const [crmIntegration, setCrmIntegration] = useState<CRMIntegration | null>(null);

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

      setProviders(providersData.data || []);
      setCrmIntegration(integrationData.data);
    } catch (error) {
      console.error("Error fetching CRM data:", error);
      toast.error("Failed to load CRM integration data");
    } finally {
      setLoading(false);
    }
  };

  const handleCRMConnect = async (providerId: string) => {
    try {
      const data = await initCRMOAuth(providerId);

      if (!data.success) {
        throw new Error(data.message || "Failed to initiate connection");
      }

      // Redirect to OAuth URL
      window.location.href = data.data.authUrl;
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to initiate connection");
    }
  };

  const handleCRMDisconnect = async (providerId: string) => {
    if (!confirm("Are you sure you want to disconnect this integration?")) {
      return;
    }

    try {
      const data = await disconnectCRM();

      if (!data.success) {
        throw new Error(data.message || "Failed to disconnect");
      }

      toast.success("Integration disconnected successfully");
      fetchCRMData();
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to disconnect");
    }
  };

  const handleCRMTest = async (providerId: string) => {
    try {
      const data = await testCRMConnection();

      if (!data.success) {
        throw new Error(data.message || "Connection test failed");
      }

      toast.success("Connection test successful!");
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Connection test failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CRM Integration</h1>
        <p className="text-gray-600 mt-2">Connect your CRM to automatically sync leads</p>
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
            {providers.map((provider) => (
              <CRMIntegrationCard
                key={provider.id}
                provider={provider}
                isConnected={crmIntegration?.provider === provider.id}
                accountInfo={crmIntegration?.accountInfo}
                onConnect={handleCRMConnect}
                onDisconnect={handleCRMDisconnect}
                onTest={handleCRMTest}
              />
            ))}
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
