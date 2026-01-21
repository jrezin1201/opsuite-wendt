/**
 * Intent Routing Types
 * Deterministic mapping from Excel keys to BidForm lines
 */

export type UnitKind = "SF" | "LF" | "EA" | "LVL" | "COUNT" | "UNKNOWN";

export type IntentTarget =
  | { type: "bidLine"; section: string; lineLabel: string }     // route into an existing line
  | { type: "alternateLine"; section: string; lineLabel: string }
  | { type: "createLine"; suggestedSection: string; suggestedLabel: string }; // if you want auto-create later (keep off by default)

export type IntentRule = {
  id: string;
  label: string;                       // human-friendly explanation
  mustInclude?: string[];              // tokens that must be present
  anyInclude?: string[];               // at least one token must be present
  mustExclude?: string[];              // tokens that must NOT be present
  unitKind?: UnitKind;                 // expected unit type
  priority: number;                    // higher wins
  target: IntentTarget;
  examples?: string[];                 // for documentation/debug
};

export type IntentResolution = {
  status: "mapped" | "ambiguous" | "unmapped";
  normalizedKey: string;
  unitKind: UnitKind;
  valueNum?: number | null;
  matchedRuleIds?: string[];
  chosenRuleId?: string;
  target?: IntentTarget;
  explanation?: string;               // show in UI
  candidates?: Array<{
    ruleId: string;
    label: string;
    priority: number;
    score: number;
    target: IntentTarget;
  }>;
};