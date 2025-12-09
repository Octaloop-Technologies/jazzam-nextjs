"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  dict?: any;
};

export default function SignInForm({ dict }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Sign in failed");
        setLoading(false);
        return;
      }

      // Check if response contains redirect URL
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        // Fallback redirect
        router.push("/super-user");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Network error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <label className="text-left text-[12px] text-gray-500">
        {dict?.emailLabel ?? "Email"}
      </label>
      <input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder={dict?.emailPlaceholder ?? "you@example.com"}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri"
      />

      <label className="text-left text-[12px] text-gray-500">
        {dict?.passwordLabel ?? "Password"}
      </label>
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder={dict?.passwordPlaceholder ?? "••••••••"}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri"
      />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-pri text-white py-2 rounded-lg font-medium disabled:opacity-60 cursor-pointer"
      >
        {loading ? (dict?.signingIn ?? "Signing in...") : (dict?.signInButton ?? "Sign in")}
      </button>
    </form>
  );
}