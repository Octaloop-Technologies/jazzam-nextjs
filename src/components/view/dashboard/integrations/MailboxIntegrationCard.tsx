"use client";

import React, { useState } from "react";
import Image from "next/image";
import { googleSvg } from "@/app/super-user/integrations/mailbox/page";

interface Mailbox {
  id: string;
  provider: string;
  email: string;
  displayName?: string;
  isDefault: boolean;
  isActive: boolean;
  dailyLimit: number;
  dailyUsage: number;
  resetAt: string;
  totalSent: number;
  lastUsedAt?: string;
  connectedAt: string;
}

interface MailboxIntegrationCardProps {
  mailbox: Mailbox;
  onDisconnect: () => void;
  onSetDefault: () => void;
  onToggleStatus: () => void;
}

export const MailboxIntegrationCard: React.FC<MailboxIntegrationCardProps> = ({
  mailbox,
  onDisconnect,
  onSetDefault,
  onToggleStatus,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await onDisconnect();
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async () => {
    setLoading(true);
    try {
      await onSetDefault();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await onToggleStatus();
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      gmail: "https://www.google.com/gmail/about/static/images/favicon.ico",
      outlook: "https://outlook.live.com/favicon.ico",
      yahoo: "https://www.yahoo.com/favicon.ico",
    };
    return icons[provider] || "";
  };

  const getProviderName = (provider: string) => {
    const names: Record<string, string> = {
      gmail: "Gmail",
      outlook: "Outlook",
      yahoo: "Yahoo Mail",
    };
    return names[provider] || provider;
  };

  const usagePercentage = (mailbox.dailyUsage / mailbox.dailyLimit) * 100;

  return (
    <div className="p-4 border border-gray-b rounded-2xl hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="size-12 rounded-lg relative flex items-center justify-center bg-gray-50">
            {mailbox.provider === "gmail" ? googleSvg() : <img
              src={getProviderIcon(mailbox.provider)}
              alt={getProviderName(mailbox.provider)}
              className="rounded w-8 h-8 object-contain"
            />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold">{mailbox.email}</h3>
              {mailbox.isDefault && (
                <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
                  Default
                </span>
              )}
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                  mailbox.isActive
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 bg-gray-50"
                }`}
              >
                {mailbox.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {getProviderName(mailbox.provider)}
              {mailbox.displayName && ` • ${mailbox.displayName}`}
            </p>

            {/* Usage Stats */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Daily usage</span>
                  <span>
                    {mailbox.dailyUsage} / {mailbox.dailyLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      usagePercentage >= 90
                        ? "bg-red-500"
                        : usagePercentage >= 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Total sent: {mailbox.totalSent}</span>
                {mailbox.lastUsedAt && (
                  <span>
                    Last used: {new Date(mailbox.lastUsedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {!mailbox.isDefault && mailbox.isActive && (
            <button
              onClick={handleSetDefault}
              disabled={loading}
              className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              Set as Default
            </button>
          )}
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className={`px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 cursor-pointer whitespace-nowrap ${
              mailbox.isActive
                ? "text-orange-600 border-orange-300 hover:bg-orange-50"
                : "text-green-600 border-green-300 hover:bg-green-50"
            }`}
          >
            {mailbox.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {loading ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      </div>
    </div>
  );
};