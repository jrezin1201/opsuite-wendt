"use client";

import React, { useState } from "react";
import { MethodSelection } from "./MethodSelection";
import { AuthenticatorSetup } from "./AuthenticatorSetup";
import { SMSSetup } from "./SMSSetup";
import { VerificationStep } from "./VerificationStep";
import { BackupCodes } from "./BackupCodes";
import { SetupComplete } from "./SetupComplete";

export type TwoFactorMethod = "authenticator" | "sms" | "both";

export interface SetupState {
  method: TwoFactorMethod | null;
  secretKey?: string;
  qrCode?: string;
  phoneNumber?: string;
  verificationCode?: string;
  backupCodes?: string[];
  isVerified: boolean;
}

export function TwoFactorSetup() {
  const [step, setStep] = useState(1);
  const [setupState, setSetupState] = useState<SetupState>({
    method: null,
    isVerified: false,
  });

  const totalSteps = setupState.method === "both" ? 6 : 5;

  const handleMethodSelect = (method: TwoFactorMethod) => {
    setSetupState({
      ...setupState,
      method,
      secretKey: generateSecretKey(),
      qrCode: generateQRCode(),
      backupCodes: generateBackupCodes(),
    });
    setStep(2);
  };

  const handlePhoneSubmit = (phone: string) => {
    setSetupState({ ...setupState, phoneNumber: phone });
    setStep(setupState.method === "both" ? 3 : 4);
  };

  const handleAuthenticatorComplete = () => {
    setStep(setupState.method === "both" ? 4 : 3);
  };

  const handleVerify = (code: string) => {
    setSetupState({ ...setupState, verificationCode: code, isVerified: true });
    setStep(step + 1);
  };

  const handleBackupCodesAcknowledged = () => {
    setStep(step + 1);
  };

  const handleRestart = () => {
    setStep(1);
    setSetupState({
      method: null,
      isVerified: false,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">
            Step {step} of {totalSteps}
          </span>
          <span className="text-sm text-white/60">
            {Math.round((step / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        {step === 1 && <MethodSelection onSelect={handleMethodSelect} />}

        {step === 2 && setupState.method === "sms" && (
          <SMSSetup onSubmit={handlePhoneSubmit} />
        )}

        {step === 2 && (setupState.method === "authenticator" || setupState.method === "both") && (
          <AuthenticatorSetup
            secretKey={setupState.secretKey || ""}
            qrCode={setupState.qrCode || ""}
            onComplete={handleAuthenticatorComplete}
          />
        )}

        {step === 3 && setupState.method === "both" && (
          <SMSSetup onSubmit={handlePhoneSubmit} />
        )}

        {((step === 3 && setupState.method !== "both") || (step === 4 && setupState.method === "both")) && (
          <VerificationStep
            method={setupState.method || "authenticator"}
            onVerify={handleVerify}
          />
        )}

        {((step === 4 && setupState.method !== "both") || (step === 5 && setupState.method === "both")) && (
          <BackupCodes
            codes={setupState.backupCodes || []}
            onAcknowledge={handleBackupCodesAcknowledged}
          />
        )}

        {((step === 5 && setupState.method !== "both") || (step === 6 && setupState.method === "both")) && (
          <SetupComplete
            method={setupState.method || "authenticator"}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

function generateSecretKey(): string {
  return "JBSWY3DPEHPK3PXP"; // Mock secret key
}

function generateQRCode(): string {
  // Mock QR code - in production this would be generated server-side
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23fff' width='200' height='200'/%3E%3Cpath fill='%23000' d='M0 0h40v40H0zM160 0h40v40h-40zM0 160h40v40H0zM40 40h20v20H40zM140 40h20v20h-40zM40 140h20v20H40z'/%3E%3C/svg%3E";
}

function generateBackupCodes(): string[] {
  return Array.from({ length: 8 }, () => {
    return Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 3).toUpperCase()
    ).join("");
  });
}
