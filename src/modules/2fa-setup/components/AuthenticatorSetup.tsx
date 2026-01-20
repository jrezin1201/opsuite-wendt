"use client";

import React, { useState } from "react";

interface AuthenticatorSetupProps {
  secretKey: string;
  qrCode: string;
  onComplete: () => void;
}

export function AuthenticatorSetup({ secretKey, qrCode, onComplete }: AuthenticatorSetupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Set Up Authenticator App
        </h2>
        <p className="text-white/60">
          Scan the QR code with your authenticator app
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-48 h-48"
          />
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <p className="text-sm text-white/60 mb-3">
          Can&apos;t scan? Enter this code manually:
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-black/40 rounded text-white font-mono text-sm">
            {secretKey}
          </code>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-3">Instructions</h3>
        <ol className="space-y-2 text-sm text-white/80">
          <li className="flex gap-2">
            <span className="text-purple-400 font-semibold">1.</span>
            Download an authenticator app (Google Authenticator, Authy, 1Password, etc.)
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-semibold">2.</span>
            Open the app and scan the QR code above
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-semibold">3.</span>
            Your app will generate a 6-digit code that changes every 30 seconds
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-semibold">4.</span>
            Click continue when ready to verify
          </li>
        </ol>
      </div>

      {/* Continue Button */}
      <button
        onClick={onComplete}
        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
      >
        Continue to Verification
      </button>
    </div>
  );
}
