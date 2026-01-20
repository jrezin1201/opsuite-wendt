"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";

interface TokenCounterProps {
  text: string;
  model?: "gpt-4" | "gpt-3.5" | "claude-3" | "claude-2";
  onChange?: (count: number) => void;
}

export function TokenCounter({
  text,
  model = "gpt-4",
  onChange,
}: TokenCounterProps) {
  // Simple token estimation (rough approximation)
  // In production, use tiktoken or Claude's token counter
  const estimateTokens = (input: string): number => {
    if (!input) return 0;

    // Very rough estimation: ~1 token per 4 characters for English text
    // This varies by model and actual content
    const avgCharsPerToken = 4;
    const charCount = input.length;
    const wordCount = input.split(/\s+/).filter((w) => w.length > 0).length;

    // Use character-based estimation with word adjustment
    const estimate = Math.ceil(
      charCount / avgCharsPerToken + wordCount * 0.2
    );

    return estimate;
  };

  // Calculate directly instead of using useState + useEffect
  const tokenCount = estimateTokens(text);

  useEffect(() => {
    if (onChange) {
      onChange(tokenCount);
    }
  }, [tokenCount, onChange]);

  const getModelLimits = () => {
    switch (model) {
      case "gpt-4":
        return { max: 8192, name: "GPT-4" };
      case "gpt-3.5":
        return { max: 4096, name: "GPT-3.5 Turbo" };
      case "claude-3":
        return { max: 100000, name: "Claude 3" };
      case "claude-2":
        return { max: 100000, name: "Claude 2" };
      default:
        return { max: 8192, name: model };
    }
  };

  const { max, name } = getModelLimits();
  const percentage = (tokenCount / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  const getColorClass = () => {
    if (isOverLimit) return "text-red-400";
    if (isNearLimit) return "text-yellow-400";
    return "text-green-400";
  };

  const getBarColorClass = () => {
    if (isOverLimit) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white text-sm">Token Counter</h4>
            <p className="text-xs text-white/60">Estimated for {name}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${getColorClass()}`}>
              {tokenCount.toLocaleString()}
            </p>
            <p className="text-xs text-white/60">
              / {max.toLocaleString()} max
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getBarColorClass()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60 mb-1">Characters</p>
            <p className="text-sm font-semibold text-white">
              {text.length.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60 mb-1">Words</p>
            <p className="text-sm font-semibold text-white">
              {text.split(/\s+/).filter((w) => w.length > 0).length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60 mb-1">Remaining</p>
            <p className={`text-sm font-semibold ${getColorClass()}`}>
              {Math.max(0, max - tokenCount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Warnings */}
        {isOverLimit && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
            <p className="text-xs text-red-400">
              ⚠️ Token count exceeds model limit. Content may be truncated.
            </p>
          </div>
        )}
        {isNearLimit && !isOverLimit && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
            <p className="text-xs text-yellow-400">
              ⚠️ Approaching token limit ({percentage.toFixed(0)}% used)
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40">
            💡 This is a rough estimate. Actual token count may vary by model
            and content type.
          </p>
        </div>
      </div>
    </Card>
  );
}
