"use client";

import React, { useState } from "react";

interface BackupCodesProps {
  codes: string[];
  onAcknowledge: () => void;
}

export function BackupCodes({ codes, onAcknowledge }: BackupCodesProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const content = `Two-Factor Authentication Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nThese codes can be used to access your account if you lose access to your 2FA device.\nEach code can only be used once.\n\n${codes.join("\n")}\n\nKeep these codes in a safe place!`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Save Your Backup Codes
        </h2>
        <p className="text-white/60">
          Store these codes safely - you&apos;ll need them if you lose your device
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-yellow-200/80 space-y-1">
            <p className="font-semibold">Important:</p>
            <p>Each code can only be used once</p>
            <p>Keep these codes secure and private</p>
            <p>You won&apos;t be able to see these codes again</p>
          </div>
        </div>
      </div>

      {/* Codes Grid */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {codes.map((code, i) => (
            <div
              key={i}
              className="px-3 py-2 bg-black/40 rounded text-center"
            >
              <code className="text-white font-mono text-sm">{code}</code>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
          >
            {copied ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
          >
            {downloaded ? "Downloaded!" : "Download"}
          </button>
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={downloaded || copied}
            onChange={(e) => setDownloaded(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-white/80">
            I have saved these backup codes in a secure location and understand that I won&apos;t be able to see them again
          </span>
        </label>
      </div>

      {/* Continue */}
      <button
        onClick={onAcknowledge}
        disabled={!downloaded && !copied}
        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg font-medium transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
