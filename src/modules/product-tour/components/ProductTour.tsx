"use client";

import React, { useState } from "react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "right" | "bottom" | "left";
}

const tourSteps: TourStep[] = [
  {
    id: "1",
    title: "Welcome to Your Dashboard",
    description: "This is your central hub where you can access all features and see key metrics at a glance.",
    target: "dashboard",
    position: "bottom",
  },
  {
    id: "2",
    title: "Navigation Menu",
    description: "Use this menu to quickly navigate between different sections of the application.",
    target: "nav",
    position: "right",
  },
  {
    id: "3",
    title: "Quick Actions",
    description: "Access frequently used actions and create new items with one click.",
    target: "actions",
    position: "left",
  },
  {
    id: "4",
    title: "Notifications",
    description: "Stay updated with real-time notifications about important events and updates.",
    target: "notifications",
    position: "bottom",
  },
  {
    id: "5",
    title: "User Profile",
    description: "Manage your account settings, preferences, and profile information here.",
    target: "profile",
    position: "left",
  },
];

export function ProductTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const completeTour = () => {
    setCompletedTours((prev) => {
      const tourId = `tour-${Date.now()}`;
      return [...prev, tourId];
    });
    setIsActive(false);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tour Controls */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Interactive Product Tours</h2>
        <p className="text-white/60 mb-6">
          Guide users through your application with step-by-step interactive tours
        </p>
        <div className="flex gap-3">
          <button
            onClick={startTour}
            disabled={isActive}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg font-medium transition-colors"
          >
            {isActive ? "Tour in Progress..." : "Start Tour"}
          </button>
          {isActive && (
            <button
              onClick={skipTour}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Skip Tour
            </button>
          )}
        </div>
      </div>

      {/* Tour Preview/Active State */}
      {isActive && (
        <div className="bg-white/5 border border-purple-500/50 rounded-lg p-6 shadow-lg shadow-purple-500/20">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 font-bold">
                  {currentStep + 1}
                </div>
                <h3 className="text-xl font-semibold text-white">{currentTourStep.title}</h3>
              </div>
              <p className="text-white/80 ml-13">{currentTourStep.description}</p>
            </div>

            {/* Target Indicator */}
            <div className="bg-white/5 border border-white/10 rounded p-3">
              <div className="text-xs text-white/60 mb-1">Target Element</div>
              <code className="text-sm text-purple-300">#{currentTourStep.target}</code>
              <div className="text-xs text-white/60 mt-1">Position: {currentTourStep.position}</div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? "bg-purple-500"
                        : index < currentStep
                        ? "bg-purple-500/50"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Library */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Tours</h3>
        <div className="space-y-3">
          {[
            { id: "onboarding", name: "New User Onboarding", steps: 5, duration: "2 min" },
            { id: "features", name: "Feature Showcase", steps: 8, duration: "4 min" },
            { id: "settings", name: "Settings Guide", steps: 4, duration: "2 min" },
          ].map((tour) => (
            <div
              key={tour.id}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div>
                <h4 className="font-medium text-white mb-1">{tour.name}</h4>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span>{tour.steps} steps</span>
                  <span>•</span>
                  <span>{tour.duration}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded transition-colors">
                Preview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Tours */}
      {completedTours.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Completed Tours</h3>
          <div className="text-white/60">
            You&apos;ve completed {completedTours.length} tour{completedTours.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
