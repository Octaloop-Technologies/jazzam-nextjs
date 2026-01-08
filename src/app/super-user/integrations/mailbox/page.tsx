"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MailboxIntegrationCard } from "@/components/view/dashboard/integrations/MailboxIntegrationCard";
import { useToast } from "@/lib/hooks/useToast";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import {
  getMailboxProviders,
  getMailboxIntegrations,
  initMailboxOAuth,
  connectYahooMailbox,
  disconnectMailbox,
  setDefaultMailbox,
  toggleMailboxStatus,
} from "@/lib/api/mailbox";
import { getCurrentLang } from "@/lib/api/main-page";
import { getDictionary } from "@/lib/i18n/getDictionary";

interface MailboxProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresOAuth: boolean;
}

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

export default function MailboxIntegrationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const lang = getCurrentLang();

  // Mailbox State
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [language, setLanguage] = useState<any>();

  // Yahoo connection form state
  const [showYahooForm, setShowYahooForm] = useState(false);
  const [yahooEmail, setYahooEmail] = useState("");
  const [yahooPassword, setYahooPassword] = useState("");
  const [connectingYahoo, setConnectingYahoo] = useState(false);

  const providers: MailboxProvider[] = [
    {
      id: "gmail",
      name: "Gmail",
      description: "Connect your Gmail account for sending emails",
      icon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=64",
      requiresOAuth: true,
    },
    {
      id: "outlook",
      name: "Outlook",
      description: "Connect your Microsoft Outlook account",
      icon: "https://outlook.live.com/favicon.ico",
      requiresOAuth: true,
    },
    {
      id: "yahoo",
      name: "Yahoo Mail",
      description: "Connect your Yahoo Mail with app password",
      icon: "https://www.yahoo.com/favicon.ico",
      requiresOAuth: false,
    },
  ];

  useEffect(() => {
    const fetchLang = async () => {
      const dict = (await getDictionary(lang))?.superUser?.navbar?.settings;
      setLanguage(dict);
    };
    fetchLang();
  }, [lang]);

  useEffect(() => {
    // Check for OAuth callback - UPDATED to match backend redirects
    const status = searchParams?.get("status");
    const provider = searchParams?.get("provider");
    const email = searchParams?.get("email");
    const message = searchParams?.get("message");

    if (status === "connected" && provider) {
      toast.success(`Successfully connected ${provider}${email ? ` (${email})` : ''}!`);
      // Clean URL
      // router.replace("/super-user/integrations/mailbox");
    } else if (status === "error") {
      console.log("connection error msg***********", message)
      toast.error(`Failed to connect mailbox: ${message || "Unknown error"}`);
      // Clean URL
      // router.replace("/super-user/integrations/mailbox");
    }
    fetchMailboxData();

  }, []);


  const fetchMailboxData = async () => {
    try {
      setLoading(true);
      const response = await getMailboxIntegrations();

      console.log("Mailbox Data:", response?.data?.mailboxes);
      setMailboxes(response?.data?.mailboxes || []);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
      toast.error("Failed to load mailbox integrations");
    } finally {
      setLoading(false);
    }
  };

  const handleMailboxConnect = async (providerId: string) => {
    try {
      if (providerId === "yahoo") {
        setShowYahooForm(true);
        return;
      }

      // OAuth providers (Gmail, Outlook)
      const data = await initMailboxOAuth(providerId);

      if (!data.success) {
        throw new Error("Failed to initiate OAuth");
      }

      console.log("OAuth URL:", data.data?.authUrl);
      
      // Open OAuth in same window so callback can redirect properly
      window.location.href = data.data?.authUrl;
    } catch (error: any) {
      toast.error(error?.message || "Failed to connect mailbox");
    }
  };

  const handleYahooConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingYahoo(true);

    try {
      const response = await connectYahooMailbox({
        email: yahooEmail,
        appPassword: yahooPassword,
      });

      if (!response.success) {
        throw new Error("Failed to connect Yahoo mailbox");
      }

      toast.success("Yahoo mailbox connected successfully!");
      setShowYahooForm(false);
      setYahooEmail("");
      setYahooPassword("");
      fetchMailboxData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to connect Yahoo mailbox");
    } finally {
      setConnectingYahoo(false);
    }
  };

  const handleMailboxDisconnect = async (mailboxId: string) => {
    if (!confirm("Are you sure you want to disconnect this mailbox?")) {
      return;
    }

    try {
      const data = await disconnectMailbox(mailboxId);

      if (!data.success) {
        throw new Error("Failed to disconnect");
      }

      toast.success("Mailbox disconnected successfully");
      fetchMailboxData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to disconnect mailbox");
    }
  };

  const handleSetDefault = async (mailboxId: string) => {
    try {
      const data = await setDefaultMailbox(mailboxId);

      if (!data.success) {
        throw new Error("Failed to set default mailbox");
      }

      toast.success("Default mailbox updated successfully");
      fetchMailboxData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to set default mailbox");
    }
  };

  const handleToggleStatus = async (mailboxId: string) => {
    try {
      const data = await toggleMailboxStatus(mailboxId);

      if (!data.success) {
        throw new Error("Failed to toggle mailbox status");
      }

      toast.success("Mailbox status updated successfully");
      fetchMailboxData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to toggle mailbox status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Mailbox Integrations</h1>
        <p className="text-gray-600 mt-2">
          Connect your email accounts to send follow-up emails and track responses from your leads.
        </p>

        {/* Mailbox Stats */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900">Connected Mailboxes</h3>
            <p className="text-2xl font-bold text-blue-700">{mailboxes.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900">Active Mailboxes</h3>
            <p className="text-2xl font-bold text-green-700">
              {mailboxes.filter((m) => m.isActive).length}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900">Emails Sent Today</h3>
            <p className="text-2xl font-bold text-purple-700">
              {mailboxes.reduce((sum, m) => sum + m.dailyUsage, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Yahoo Connection Form Modal */}
      {showYahooForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Connect Yahoo Mail</h2>
            <p className="text-sm text-gray-600 mb-4">
              You need to generate an app-specific password from your Yahoo account settings.
              <a
                href="https://help.yahoo.com/kb/generate-manage-third-party-passwords-sln15241.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                Learn how
              </a>
            </p>
            <form onSubmit={handleYahooConnect}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Yahoo Email</label>
                <input
                  type="email"
                  value={yahooEmail}
                  onChange={(e) => setYahooEmail(e.target.value)}
                  placeholder="your-email@yahoo.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">App Password</label>
                <input
                  type="password"
                  value={yahooPassword}
                  onChange={(e) => setYahooPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowYahooForm(false);
                    setYahooEmail("");
                    setYahooPassword("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connectingYahoo}
                  className="flex-1 px-4 py-2 bg-sec text-white rounded-lg hover:bg-sec-hover disabled:opacity-50"
                >
                  {connectingYahoo ? "Connecting..." : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sec"></div>
        </div>
      ) : (
        <div>
          {/* Connected Mailboxes */}
          {mailboxes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Connected Mailboxes</h2>
              <div className="grid gap-4">
                {mailboxes.map((mailbox) => (
                  <MailboxIntegrationCard
                    key={mailbox.id}
                    mailbox={mailbox}
                    onDisconnect={() => handleMailboxDisconnect(mailbox.id)}
                    onSetDefault={() => handleSetDefault(mailbox.id)}
                    onToggleStatus={() => handleToggleStatus(mailbox.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Providers */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Connect New Mailbox</h2>
            <p className="text-gray-600">
              Add email accounts to send personalized follow-ups to your leads.
            </p>
          </div>

          <div className="grid gap-4">
            {providers.map((provider) => {
              const connectedMailbox = mailboxes.find((m) => m.provider === provider.id);
              const isConnected = !!connectedMailbox;

              if(isConnected) return;

              return (
                <div
                  key={provider.id}
                  className="p-4 border border-gray-b rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="size-10 rounded-lg relative flex items-center justify-center">
                        {provider.name === "Gmail" ? googleSvg() : <img
                          src={provider.icon}
                          alt={provider.name}
                          className="rounded w-full h-full object-contain"
                        />}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{provider.name}</h3>
                        <p className="text-sm text-gray-400 leading-1">{provider.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMailboxConnect(provider.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-sec rounded-lg hover:bg-sec-hover cursor-pointer"
                        >
                          Connect
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const googleSvg = () => {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="600"
    height="600"
    fill="none"
    stroke="#E53935"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Mail icon"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
}