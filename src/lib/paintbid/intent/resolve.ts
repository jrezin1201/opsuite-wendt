/**
 * Intent Resolver
 * Scores and matches intent rules to determine mapping
 */

import type { IntentResolution, IntentRule } from "./types";
import { normalizeKey, detectUnitKind, extractTokens } from "./normalize";
import { INTENT_RULES } from "./registry";
import { loadCustomMappings } from "./custom";

interface ScoredRule {
  rule: IntentRule;
  score: number;
}

/**
 * Score a rule against normalized key and unit
 */
function scoreRule(rule: IntentRule, tokens: string[], unitKind: string): number {
  // Check disqualifiers

  // Must include all required tokens
  if (rule.mustInclude) {
    for (const required of rule.mustInclude) {
      if (!tokens.includes(required)) {
        return 0; // Disqualified
      }
    }
  }

  // Must include at least one of anyInclude
  if (rule.anyInclude && rule.anyInclude.length > 0) {
    const hasAny = rule.anyInclude.some(token => tokens.includes(token));
    if (!hasAny) {
      return 0; // Disqualified
    }
  }

  // Must not include excluded tokens
  if (rule.mustExclude) {
    for (const excluded of rule.mustExclude) {
      if (tokens.includes(excluded)) {
        return 0; // Disqualified
      }
    }
  }

  // Unit kind must match if specified
  if (rule.unitKind && rule.unitKind !== unitKind) {
    return 0; // Disqualified
  }

  // Calculate score
  let score = rule.priority;

  // Bonus for matched must-include tokens
  if (rule.mustInclude) {
    score += 5 * rule.mustInclude.length;
  }

  // Bonus for matched any-include tokens
  if (rule.anyInclude) {
    const matchedAny = rule.anyInclude.filter(token => tokens.includes(token));
    score += 2 * matchedAny.length;
  }

  return score;
}

/**
 * Resolve intent from raw Excel key
 */
export function resolveIntent(args: {
  rawKey: string;
  valueNum: number | null;
}): IntentResolution {
  const { rawKey, valueNum } = args;

  // Normalize key and detect unit
  const normalizedKey = normalizeKey(rawKey);
  const unitKind = detectUnitKind(normalizedKey, valueNum);
  const tokens = extractTokens(normalizedKey);

  // Check custom mappings first
  const customMappings = loadCustomMappings();
  const customTarget = customMappings[normalizedKey];
  if (customTarget) {
    return {
      status: "mapped",
      normalizedKey,
      unitKind,
      valueNum,
      target: customTarget.target,
      explanation: customTarget.target.type === "bidLine" || customTarget.target.type === "alternateLine"
        ? `Custom mapping: ${customTarget.target.section} → ${customTarget.target.lineLabel}`
        : `Custom mapping: Create ${customTarget.target.suggestedSection} → ${customTarget.target.suggestedLabel}`
    };
  }

  // Score all rules
  const scoredRules: ScoredRule[] = [];
  for (const rule of INTENT_RULES) {
    const score = scoreRule(rule, tokens, unitKind);
    if (score > 0) {
      scoredRules.push({ rule, score });
    }
  }

  // Sort by score descending, then priority
  scoredRules.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.rule.priority - a.rule.priority;
  });

  // No candidates
  if (scoredRules.length === 0) {
    return {
      status: "unmapped",
      normalizedKey,
      unitKind,
      valueNum,
      explanation: "No matching rules found"
    };
  }

  const top = scoredRules[0];
  const second = scoredRules[1];

  // Decision logic
  const confidenceThreshold = 80;
  const separationThreshold = 8;

  const isHighConfidence = top.score >= confidenceThreshold;
  const hasClearSeparation = !second || (top.score - second.score >= separationThreshold);

  if (isHighConfidence && hasClearSeparation) {
    // High confidence mapping
    return {
      status: "mapped",
      normalizedKey,
      unitKind,
      valueNum,
      chosenRuleId: top.rule.id,
      target: top.rule.target,
      explanation: `Matched rule: ${top.rule.label}`
    };
  }

  // Ambiguous - return top candidates
  const candidates = scoredRules.slice(0, 3).map(sr => ({
    ruleId: sr.rule.id,
    label: sr.rule.label,
    priority: sr.rule.priority,
    score: sr.score,
    target: sr.rule.target
  }));

  return {
    status: "ambiguous",
    normalizedKey,
    unitKind,
    valueNum,
    matchedRuleIds: candidates.map(c => c.ruleId),
    candidates,
    explanation: `Multiple possible matches found (top: ${candidates[0].label})`
  };
}