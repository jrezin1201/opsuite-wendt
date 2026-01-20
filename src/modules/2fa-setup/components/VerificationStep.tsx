"use client";

import React, { useState } from "react";
import type { TwoFactorMethod } from "./TwoFactorSetup";

interface VerificationStepProps {
  method: TwoFactorMethod;
  onVerify: (code: string) => void;
}

export function VerificationStep({ method, onVerify }: VerificationStepProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Code must be 6 digits");
      return;
    }
    onVerify(code);
  };

  const handleCodeChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 6);
    setCode(sanitized);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Verify Your Code
        </h2>
        <p className="text-white/60">
          {method === "authenticator" || method === "both"
            ? "Enter the 6-digit code from your authenticator app"
            : "Enter the code sent to your phone"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code Input */}
        <div>
          <label className="block text-sm text-white/60 mb-2 text-center">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="000000"
            className={`w-full px-4 py-3 bg-white/5 border ${
              error ? "border-red-500" : "border-white/10"
            } rounded text-center text-3xl tracking-widest font-mono text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Hint */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
          <p className="text-sm text-white/60">
            {method === "sms"
              ? "Didn't receive a code? Check your messages or try resending."
              : "The code changes every 30 seconds. Enter the current code from your app."}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={code.length !== 6}
          className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg font-medium transition-colors"
        >
          Verify Code
        </button>

        {method === "sms" && (
          <button
            type="button"
            className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/10 transition-colors"
          >
            Resend Code
          </button>
        )}
      </form>
    </div>
  );
}
