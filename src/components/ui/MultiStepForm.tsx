"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FormStep {
  title: string;
  description?: string;
  content: React.ReactNode;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onSubmit: () => void;
  onStepChange?: (step: number) => void;
  submitLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
  showStepIndicator?: boolean;
}

export function MultiStepForm({
  steps,
  onSubmit,
  onStepChange,
  submitLabel = "Submit",
  nextLabel = "Next",
  prevLabel = "Back",
  showStepIndicator = true,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLastStep) {
      onSubmit();
    } else {
      handleNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      {showStepIndicator && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                {/* Step Circle */}
                <motion.button
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`
                    relative z-10 w-10 h-10 rounded-full
                    flex items-center justify-center
                    transition-all font-semibold text-sm
                    ${
                      index < currentStep
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                        : index === currentStep
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-4 ring-purple-500/30"
                        : "bg-white/10 text-white/40 border-2 border-white/20"
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </motion.button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: index < currentStep ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex items-start justify-between mt-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex-1 text-center"
                style={{ maxWidth: `${100 / steps.length}%` }}
              >
                <p
                  className={`text-xs font-medium transition-colors ${
                    index === currentStep
                      ? "text-white"
                      : index < currentStep
                      ? "text-purple-400"
                      : "text-white/40"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8 mb-6 overflow-hidden">
          {/* Step Title and Description */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {steps[currentStep].title}
                </h2>
                {steps[currentStep].description && (
                  <p className="text-white/60">
                    {steps[currentStep].description}
                  </p>
                )}
              </div>

              {/* Step Content */}
              <div className="space-y-4">{steps[currentStep].content}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <motion.button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`
              px-6 py-2.5 rounded-lg border transition-all
              ${
                isFirstStep
                  ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              }
            `}
            whileHover={!isFirstStep ? { scale: 1.02 } : {}}
            whileTap={!isFirstStep ? { scale: 0.98 } : {}}
          >
            {prevLabel}
          </motion.button>

          <div className="flex items-center gap-2">
            {/* Step Counter */}
            <span className="text-sm text-white/60">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <motion.button
            type="submit"
            className="
              px-6 py-2.5 rounded-lg
              bg-gradient-to-r from-purple-500 to-pink-500
              text-white font-semibold
              hover:shadow-lg hover:shadow-purple-500/50
              transition-all
            "
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLastStep ? submitLabel : nextLabel}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
