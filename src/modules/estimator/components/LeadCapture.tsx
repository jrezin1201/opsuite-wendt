"use client";

import React, { useState } from "react";

interface LeadCaptureProps {
  estimate: { min: number; max: number };
  features: string[];
}

export function LeadCapture({ estimate, features }: LeadCaptureProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request submitted:", { ...formData, estimate, features });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Quote Request Submitted!</h2>
        <p className="text-white/60 mb-2">
          Thank you for your interest. We&apos;ll review your requirements and get back to you within 24 hours.
        </p>
        <p className="text-sm text-white/40 mb-6">
          A confirmation email has been sent to {formData.email}
        </p>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-white/80 mb-1">Your Estimate</p>
          <p className="text-3xl font-bold text-purple-400">
            ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Request Detailed Quote</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Additional Details</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Tell us more about your project timeline, budget, or specific requirements..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Submit Quote Request
          </button>
        </form>
      </div>

      {/* Summary */}
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Your Estimate</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-white/60">Features Selected</span>
              <span className="font-semibold text-white">{features.length}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-white/60">Estimated Range</span>
              <span className="font-semibold text-white">
                ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
              </span>
            </div>
            <div className="pt-3">
              <p className="text-2xl font-bold text-purple-400">
                ${Math.round((estimate.min + estimate.max) / 2).toLocaleString()}
              </p>
              <p className="text-xs text-white/40">average estimate</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-white mb-3">What happens next?</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex gap-2">
              <span className="text-purple-400">1.</span>
              We&apos;ll review your selected features and requirements
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">2.</span>
              Our team will reach out within 24 hours
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">3.</span>
              We&apos;ll schedule a call to discuss your project in detail
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">4.</span>
              You&apos;ll receive a customized proposal and timeline
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
