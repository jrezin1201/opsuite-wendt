"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  category: "bug" | "feature" | "question" | "other";
  priority: "low" | "medium" | "high";
  description: string;
}

interface SupportTicketFormProps {
  onSubmit?: (ticket: SupportTicket) => void;
}

export function SupportTicketForm({ onSubmit }: SupportTicketFormProps) {
  const [formData, setFormData] = useState<SupportTicket>({
    name: "",
    email: "",
    subject: "",
    category: "question",
    priority: "medium",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SupportTicket, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SupportTicket, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "question",
        priority: "medium",
        description: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (
    field: keyof SupportTicket,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    return (
      <Card>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Ticket Submitted!
          </h3>
          <p className="text-white/60">
            We&apos;ve received your support request and will respond within 24 hours.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">
            Submit Support Ticket
          </h3>
          <p className="text-sm text-white/60">
            We typically respond within 24 hours
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? "border-red-500" : "border-white/10"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? "border-red-500" : "border-white/10"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleChange("category", e.target.value as SupportTicket["category"])
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="bug" className="bg-gray-900">
                  🐛 Bug Report
                </option>
                <option value="feature" className="bg-gray-900">
                  ✨ Feature Request
                </option>
                <option value="question" className="bg-gray-900">
                  ❓ Question
                </option>
                <option value="other" className="bg-gray-900">
                  💬 Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  handleChange("priority", e.target.value as SupportTicket["priority"])
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low" className="bg-gray-900">
                  🟢 Low
                </option>
                <option value="medium" className="bg-gray-900">
                  🟡 Medium
                </option>
                <option value="high" className="bg-gray-900">
                  🔴 High
                </option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.subject ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Brief description of the issue"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                errors.description ? "border-red-500" : "border-white/10"
              }`}
              rows={6}
              placeholder="Please provide as much detail as possible..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-400">{errors.description}</p>
              ) : (
                <p className="text-xs text-white/40">
                  Minimum 20 characters
                </p>
              )}
              <p className="text-xs text-white/40">
                {formData.description.length} characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-white/40">
              <span className="text-red-400">*</span> Required fields
            </p>
            <Button type="submit" size="lg">
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
