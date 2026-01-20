"use client";

import React, { useState } from "react";
import { FeatureSelector } from "./FeatureSelector";
import { EstimateSummary } from "./EstimateSummary";
import { LeadCapture } from "./LeadCapture";

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  hours: { min: number; max: number };
  complexity: "low" | "medium" | "high";
  techStack: string[];
}

export interface SelectedFeatures {
  [key: string]: boolean;
}

const features: Feature[] = [
  // Authentication
  { id: "auth-basic", name: "Basic Authentication", description: "Email/password login", category: "Authentication", hours: { min: 8, max: 16 }, complexity: "low", techStack: ["NextAuth", "Bcrypt"] },
  { id: "auth-oauth", name: "OAuth Providers", description: "Google, GitHub, etc.", category: "Authentication", hours: { min: 12, max: 24 }, complexity: "medium", techStack: ["NextAuth", "OAuth2"] },
  { id: "auth-2fa", name: "Two-Factor Auth", description: "TOTP or SMS verification", category: "Authentication", hours: { min: 16, max: 32 }, complexity: "high", techStack: ["Speakeasy", "Twilio"] },

  // Payments
  { id: "payments-one-time", name: "One-time Payments", description: "Single purchase checkout", category: "Payments", hours: { min: 16, max: 24 }, complexity: "medium", techStack: ["Stripe", "Webhooks"] },
  { id: "payments-subscription", name: "Subscriptions", description: "Recurring billing", category: "Payments", hours: { min: 24, max: 40 }, complexity: "high", techStack: ["Stripe", "Webhooks", "Billing Portal"] },
  { id: "payments-invoicing", name: "Invoicing", description: "Generate and send invoices", category: "Payments", hours: { min: 16, max: 32 }, complexity: "medium", techStack: ["PDF Generation", "Email"] },

  // AI Features
  { id: "ai-chat", name: "AI Chat Interface", description: "ChatGPT-style conversations", category: "AI", hours: { min: 24, max: 40 }, complexity: "high", techStack: ["OpenAI", "Streaming"] },
  { id: "ai-generation", name: "Content Generation", description: "AI-generated text/images", category: "AI", hours: { min: 20, max: 36 }, complexity: "high", techStack: ["OpenAI", "DALL-E"] },
  { id: "ai-embeddings", name: "Vector Search", description: "Semantic search with embeddings", category: "AI", hours: { min: 32, max: 48 }, complexity: "high", techStack: ["OpenAI", "Pinecone", "Vector DB"] },

  // Admin
  { id: "admin-dashboard", name: "Admin Dashboard", description: "Analytics and user management", category: "Admin", hours: { min: 24, max: 40 }, complexity: "medium", techStack: ["Charts", "Tables"] },
  { id: "admin-roles", name: "Role-based Access", description: "Permissions system", category: "Admin", hours: { min: 16, max: 32 }, complexity: "medium", techStack: ["RBAC", "Middleware"] },
  { id: "admin-logs", name: "Audit Logging", description: "Track all user actions", category: "Admin", hours: { min: 12, max: 24 }, complexity: "low", techStack: ["Database", "Indexing"] },

  // Database
  { id: "db-basic", name: "Basic Database", description: "PostgreSQL with Prisma", category: "Database", hours: { min: 8, max: 16 }, complexity: "low", techStack: ["Prisma", "PostgreSQL"] },
  { id: "db-realtime", name: "Realtime Features", description: "Live updates with WebSockets", category: "Database", hours: { min: 24, max: 40 }, complexity: "high", techStack: ["WebSockets", "Redis"] },
  { id: "db-search", name: "Full-text Search", description: "Advanced search capabilities", category: "Database", hours: { min: 16, max: 32 }, complexity: "medium", techStack: ["Elasticsearch", "Algolia"] },
];

export function AppEstimator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>({});
  const [hourlyRate, setHourlyRate] = useState(150);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const categories = [...new Set(features.map((f) => f.category))];
  const selectedFeaturesArray = features.filter((f) => selectedFeatures[f.id]);

  const totalHours = {
    min: selectedFeaturesArray.reduce((sum, f) => sum + f.hours.min, 0),
    max: selectedFeaturesArray.reduce((sum, f) => sum + f.hours.max, 0),
  };

  const totalCost = {
    min: totalHours.min * hourlyRate,
    max: totalHours.max * hourlyRate,
  };

  const techStack = [...new Set(selectedFeaturesArray.flatMap((f) => f.techStack))];

  const progress = ((selectedFeaturesArray.length / 3) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">
            Step {currentStep} of 3: {currentStep === 1 ? "Select Features" : currentStep === 2 ? "Review Estimate" : "Get Quote"}
          </h3>
          <span className="text-sm text-white/60">{Math.min(100, Math.round(progress))}% Complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <FeatureSelector
          features={features}
          selectedFeatures={selectedFeatures}
          onToggleFeature={toggleFeature}
          categories={categories}
        />
      )}

      {currentStep === 2 && (
        <EstimateSummary
          selectedFeatures={selectedFeaturesArray}
          totalHours={totalHours}
          totalCost={totalCost}
          hourlyRate={hourlyRate}
          techStack={techStack}
          onHourlyRateChange={setHourlyRate}
        />
      )}

      {currentStep === 3 && (
        <LeadCapture
          estimate={totalCost}
          features={selectedFeaturesArray.map((f) => f.name)}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          ← Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={selectedFeaturesArray.length === 0}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {currentStep === 2 ? "Request Quote →" : "Continue →"}
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentStep(1);
              setSelectedFeatures({});
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Start New Estimate
          </button>
        )}
      </div>
    </div>
  );
}
