"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CRMProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  configured: boolean;
}

interface CRMIntegrationCardProps {
  provider: CRMProvider;
  isConnected: boolean;
  accountInfo?: {
    accountName?: string;
    accountEmail?: string;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  onTest?: () => void;
  disabled?: boolean;
}

export const CRMIntegrationCard: React.FC<CRMIntegrationCardProps> = ({
  provider,
  isConnected,
  accountInfo,
  onConnect,
  onDisconnect,
  onTest,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await onConnect();
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await onDisconnect();
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (onTest) {
      setLoading(true);
      try {
        await onTest();
      } finally {
        setLoading(false);
      }
    }
  };

  const getProviderIcon = (providerId: string) => {
    const icons: Record<string, string> = {
      zoho: "https://www.zoho.com/favicon.ico",
      salesforce: "https://www.salesforce.com/favicon.ico",
      hubspot: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      dynamics: "https://dynamics.microsoft.com/favicon.ico",
    };
    return icons[providerId] || provider.icon;
  };

  return (
    <div className="p-4 border border-gray-b rounded-2xl hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="size-10 rounded-lg relative flex items-center justify-center">
            <Image
              src={getProviderIcon(provider.id)}
              alt={provider.name}
              className="rounded"
              fill
            />
          </div>
          <div>
            <h3 className="text-base font-semibold">{provider.name}</h3>
            {provider.description && (
              <p className="text-sm text-gray-400 leading-1">{provider.description}</p>
            )}
            {isConnected &&
              accountInfo &&
              (accountInfo.accountName || accountInfo.accountEmail) && (
                <div className="mt-2 text-xs text-gray-500 leading-0.5">
                  <p>
                    <span className="font-medium">Account:</span>{" "}
                    {accountInfo.accountName || accountInfo.accountEmail}
                  </p>
                </div>
              )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-md">
                Connected
              </span>
              {onTest && (
                <button
                  onClick={handleTest}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Test
                </button>
              )}
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Disconnecting..." : "Disconnect"}
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading || !provider.configured || disabled}
              className="px-4 py-2 text-sm font-medium text-white bg-sec rounded-lg hover:bg-sec-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Connecting..." : disabled ? "Channel Limit Reached" : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
