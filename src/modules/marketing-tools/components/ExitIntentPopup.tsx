"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ExitIntentPopupProps {
  title?: string;
  message?: string;
  onSubmit?: (email: string) => void;
  storageKey?: string;
  sensitivity?: number; // pixels from top to trigger
}

export function ExitIntentPopup({
  title = "Wait! Before you go...",
  message = "Get exclusive access to our latest features and updates",
  onSubmit,
  storageKey = "exit-intent-shown",
  sensitivity = 50,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(true); // Start true to avoid hydration issues
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasInitialized = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const shown = localStorage.getItem(storageKey) === "true";
      // Batch updates in a single microtask
      queueMicrotask(() => {
        setIsMounted(true);
        setHasShown(shown);
      });
    }
  }, [storageKey]);

  // Exit intent detection
  useEffect(() => {
    if (!isMounted || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse goes near top of viewport
      if (e.clientY < sensitivity && !hasShown) {
        setIsVisible(true);
        localStorage.setItem(storageKey, "true");
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown, sensitivity, storageKey, isMounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    if (onSubmit) {
      onSubmit(email);
    }

    setIsSubmitted(true);

    // Close after showing success
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto max-w-md w-full"
            >
              <Card glow="purple">
                <div className="p-8">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                    aria-label="Close popup"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {!isSubmitted ? (
                    <>
                      {/* Icon */}
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-8 h-8 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      {/* Content */}
                      <h2 className="text-2xl font-bold text-white text-center mb-3">
                        {title}
                      </h2>
                      <p className="text-white/60 text-center mb-6">{message}</p>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />

                        <Button type="submit" className="w-full">
                          Get Access
                        </Button>
                      </form>

                      <p className="text-xs text-white/40 text-center mt-4">
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </>
                  ) : (
                    // Success State
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Thank you!
                      </h3>
                      <p className="text-white/60">
                        Check your email for exclusive access.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
