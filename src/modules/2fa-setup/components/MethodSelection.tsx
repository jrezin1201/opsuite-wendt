"use client";

import React from "react";
import type { TwoFactorMethod } from "./TwoFactorSetup";

interface MethodSelectionProps {
  onSelect: (method: TwoFactorMethod) => void;
}

export function MethodSelection({ onSelect }: MethodSelectionProps) {
  const methods = [
    {
      id: "authenticator" as const,
      name: "Authenticator App",
      description: "Use an app like Google Authenticator or Authy",
      icon: "📱",
      recommended: true,
    },
    {
      id: "sms" as const,
      name: "SMS Verification",
      description: "Receive codes via text message",
      icon: "💬",
      recommended: false,
    },
    {
      id: "both" as const,
      name: "Both Methods",
      description: "Maximum security with backup option",
      icon: "🔐",
      recommended: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your 2FA Method
        </h2>
        <p className="text-white/60">
          Select how you would like to secure your account
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{method.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {method.name}
                  </h3>
                  {method.recommended && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60">{method.description}</p>
              </div>
              <span className="text-white/40 group-hover:text-white transition-colors">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
