"use client";

import React, { useState } from "react";

interface ConfigOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ConfigStep {
  id: string;
  title: string;
  description: string;
  options: ConfigOption[];
  required: boolean;
}

export function ProductConfigurator() {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const steps: ConfigStep[] = [
    {
      id: "model",
      title: "Choose Model",
      description: "Select your base model",
      required: true,
      options: [
        { id: "basic", name: "Basic", description: "Entry-level features", price: 999 },
        { id: "pro", name: "Pro", description: "Advanced features", price: 1999 },
        { id: "enterprise", name: "Enterprise", description: "Full featured", price: 3999 },
      ],
    },
    {
      id: "storage",
      title: "Storage",
      description: "Choose storage capacity",
      required: true,
      options: [
        { id: "128gb", name: "128 GB", description: "Standard storage", price: 0 },
        { id: "256gb", name: "256 GB", description: "Extra storage", price: 200 },
        { id: "512gb", name: "512 GB", description: "Maximum storage", price: 400 },
      ],
    },
    {
      id: "support",
      title: "Support Plan",
      description: "Select support level",
      required: false,
      options: [
        { id: "none", name: "No Support", description: "Self-service only", price: 0 },
        { id: "basic", name: "Basic Support", description: "Email support", price: 99 },
        { id: "premium", name: "Premium Support", description: "24/7 phone support", price: 299 },
      ],
    },
  ];

  const totalPrice = steps.reduce((sum, step) => {
    const selected = selections[step.id];
    const option = step.options.find((o) => o.id === selected);
    return sum + (option?.price || 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-white/60 mb-4">{step.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {step.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelections({ ...selections, [step.id]: option.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selections[step.id] === option.id
                        ? "bg-purple-500/20 border-purple-500"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <h4 className="font-semibold text-white mb-1">{option.name}</h4>
                    <p className="text-xs text-white/60 mb-2">{option.description}</p>
                    <p className="text-sm font-bold text-purple-400">
                      {option.price > 0 ? `+$${option.price}` : "Included"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold text-white mb-4">Your Configuration</h3>
            <div className="space-y-3 mb-6">
              {steps.map((step) => {
                const selected = step.options.find((o) => o.id === selections[step.id]);
                return (
                  <div key={step.id} className="pb-3 border-b border-white/10">
                    <p className="text-xs text-white/60">{step.title}</p>
                    <p className="text-sm text-white font-medium">
                      {selected ? selected.name : "Not selected"}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/60 mb-2">Total Price</p>
              <p className="text-3xl font-bold text-white mb-4">${totalPrice.toLocaleString()}</p>
              <button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
