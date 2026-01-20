"use client";

import React from "react";
import type { TwoFactorMethod } from "./TwoFactorSetup";

interface SetupCompleteProps {
  method: TwoFactorMethod;
  onRestart: () => void;
}

export function SetupComplete({ method, onRestart }: SetupCompleteProps) {
  return (
    <div className="space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          2FA Setup Complete!
        </h2>
        <p className="text-white/60">
          Your account is now protected with {
            method === "both"
              ? "authenticator app and SMS verification"
              : method === "authenticator"
              ? "authenticator app"
              : "SMS verification"
          }
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-white mb-3">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-green-400">✓</span>
            <p className="text-sm text-white/80">
              You&apos;ll be asked for a verification code each time you sign in
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-400">✓</span>
            <p className="text-sm text-white/80">
              Keep your backup codes in a safe place
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-400">✓</span>
            <p className="text-sm text-white/80">
              You can manage your 2FA settings in your account security page
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-400">✓</span>
            <p className="text-sm text-white/80">
              If you lose access, use your backup codes to sign in
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
          Go to Dashboard
        </button>
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/10 transition-colors"
        >
          Set Up Again
        </button>
      </div>
    </div>
  );
}
