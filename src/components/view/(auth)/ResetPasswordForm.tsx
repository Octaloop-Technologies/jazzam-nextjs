"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeSvg } from "@/components/svgs/NavbarSvgs";
import { useToast } from "@/lib/hooks/useToast";

type Props = {
    dict?: any;
};

export default function ResetPasswordForm({ dict }: Props) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    const { success, error } = useToast()

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get token from URL query parameter
        const tokenFromUrl = searchParams?.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            error(dict?.invalidToken)
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            error(dict?.tokenMissing)
            return;
        }

        if (newPassword !== confirmPassword) {
            error(dict?.passwordsNotMatch)
            return;
        }

        if (newPassword.length < 8) {
            error(dict?.passwordLengthMsg)
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                success(dict?.passwordResetSuccess)
                setNewPassword("");
                setConfirmPassword("");
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                error(dict?.passwrdResetFailMsg)
            }
        } catch (error) {
            error(dict?.passwordResetErrMsg)
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            {/* New Password Field */}
            <label className="text-left text-[12px] text-gray-500">
                {dict?.newPasswordLabel}
            </label>
            <div className="relative">
                <input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder={dict?.passwordPlaceholder}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pri pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <EyeSvg />
                </button>
            </div>

            {/* Confirm Password Field */}
            <label className="text-left text-[12px] text-gray-500">
                {dict?.confirmPasswordLabel}
            </label>
            <div className="relative">
                <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder={dict?.confirmPasswordPlaceholder}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pri pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <EyeSvg />
                </button>
            </div>

            {/* Password Requirements */}
            <p className="text-xs text-gray-500">
                {dict?.passwordRequirements}
            </p>
            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || !token}
                className="mt-2 w-full bg-pri text-white py-2 rounded-lg font-medium disabled:opacity-60 cursor-pointer hover:opacity-90 transition-opacity"
            >
                {loading ? dict?.resetting : dict?.resetPasswordButton}
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm">
                <a href="/login" className="text-pri font-semibold hover:underline">
                    {dict?.backToLogin}
                </a>
            </p>
        </form>
    );
}