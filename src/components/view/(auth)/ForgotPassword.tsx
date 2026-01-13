"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    dict?: any;
};

export default function ForgetPasswordForm({ dict }: Props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: dict?.forgotPasswordSuccessMsg,
                });
                setEmail("");
                
                // Optional: Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setMessage({
                    type: "error",
                    text: dict?.forgotPasswordFailMsg,
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "An error occurred. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <label className="text-left text-[12px] text-gray-500">
                {dict?.emailLabel ?? dict?.signUpEmail ?? "Email"}
            </label>
            <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={dict?.emailPlaceholder ?? "you@example.com"}
                className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pri"
            />

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm ${
                        message.type === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-pri text-white py-2 rounded-lg font-medium disabled:opacity-60 cursor-pointer hover:opacity-90 transition-opacity"
            >
                {loading ? dict?.sending : dict?.sendResetLink}
            </button>
            
            <p className="text-center text-sm">
                <a href="/login" className="text-pri font-semibold hover:underline">
                    {dict?.backToLogin}
                </a>
            </p>
        </form>
    );
}