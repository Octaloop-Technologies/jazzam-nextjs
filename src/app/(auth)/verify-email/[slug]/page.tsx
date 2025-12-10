"use client";
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

type Props = {
  onVerify?: (code: string) => void;
  onResend?: () => void;
};

const VerificationCodeForm = ({ onVerify, onResend }: Props) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const params = useParams();
  const email = params?.slug as string;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: decodeURIComponent(email),
          verificationCode: fullCode 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed");
        setLoading(false);
        return;
      }

      // alert(data.redirectUrl)
      console.log("data***", data.redirect)

      // Check if response contains redirect URL
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (err) {
      console.log("verify error*****", err)
      console.error(err);
      setError(err instanceof Error ? err.message : "Network error");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(60);
    setCode(["", "", "", "", "", ""]);
    setError(null);

    try {
      if (onResend) {
        onResend();
      } else {
        const response = await fetch("/api/v1/companies/auth/resend-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: decodeURIComponent(email) }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Failed to resend code");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to resend code");
    }
  };

  return (
    <div className="flex-col-center min-h-screen w-full">
      <div className="mt-8 p-5 bg-white rounded-3xl max-w-[400px] w-full">
        <div className="capitalize leading-none tracking-wide mb-6 text-center">
          <h1 className="text-[26px] text-pri font-[600]">Verify Email</h1>
          <p className="mt-1 text-[14px] text-gray-300">
            We sent a code to {decodeURIComponent(email)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-left text-[12px] text-gray-500">
            Verification Code
          </label>

          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pri focus:border-transparent"
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-pri text-white py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[14px] text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-pri font-semibold disabled:text-gray-400"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeForm;