"use client";

import React, { useState } from "react";

interface SMSSetupProps {
  onSubmit: (phone: string) => void;
}

export function SMSSetup({ onSubmit }: SMSSetupProps) {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("+1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(`${country}${phone}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Set Up SMS Verification
        </h2>
        <p className="text-white/60">
          Enter your phone number to receive verification codes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Code + Phone */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Phone Number</label>
          <div className="flex gap-2">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="+1">+1 (US/CA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+65">+65 (SG)</option>
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>
            <div className="text-sm text-white/80 space-y-1">
              <p>Standard messaging rates may apply</p>
              <p>Make sure you have access to this phone number</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
        >
          Send Verification Code
        </button>
      </form>
    </div>
  );
}
