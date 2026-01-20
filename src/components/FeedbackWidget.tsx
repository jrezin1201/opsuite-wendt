"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site-config";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const pathname = usePathname();

  const handleSubmit = async () => {
    // Client-side validation
    if (message.trim().length < 10) {
      setError("Please write at least 10 characters");
      return;
    }

    if (message.trim().length > 2000) {
      setError("Message is too long (max 2000 characters)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          pathname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      // Success!
      setMessage("");
      setShowSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError(err instanceof Error ? err.message : "Couldn't send feedback. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
    setError(null);
    setShowSuccess(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium shadow-lg backdrop-blur-sm transition-all hover:scale-105"
        aria-label="Send feedback"
      >
        💬 Feedback
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Help improve {siteConfig.name}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    Tell us what&apos;s confusing, missing, or annoying.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {showSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400/30">
                    <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-white">
                    Thanks — this goes straight to the builder 👍
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setError(null);
                    }}
                    placeholder="Type your feedback…"
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none"
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>
                      Please don&apos;t include passwords or sensitive customer data.
                    </span>
                    <span>
                      {message.length}/2000
                    </span>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      className="flex-1"
                      disabled={isSubmitting || message.trim().length < 10}
                    >
                      {isSubmitting ? "Sending..." : "Send feedback"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
