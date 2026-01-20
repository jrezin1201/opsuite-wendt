import { z } from "zod";

export const DiscountModeSchema = z.enum(["PERCENT", "DOLLARS"]);
export type DiscountMode = z.infer<typeof DiscountModeSchema>;

export const BillingCadenceSchema = z.enum(["MONTHLY", "ANNUAL_PREPAY"]);
export type BillingCadence = z.infer<typeof BillingCadenceSchema>;

export const ContractLengthTypeSchema = z.enum(["MONTH_TO_MONTH", "MONTHS", "YEARS"]);
export type ContractLengthType = z.infer<typeof ContractLengthTypeSchema>;

export const ProfitModeSchema = z.enum(["MARGIN_PCT", "PROFIT_PER_UNIT"]);
export type ProfitMode = z.infer<typeof ProfitModeSchema>;

export const ProductTypeSchema = z.enum(["RECURRING", "ONE_TIME"]);
export type ProductType = z.infer<typeof ProductTypeSchema>;

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  type: ProductTypeSchema,

  includeInTotals: z.boolean().default(true),

  // Professional Services flag
  isService: z.boolean().default(false), // true = professional services, false = software

  // Recurring fields
  licenses: z.number().nonnegative().default(1),
  listPricePerUnitMonthly: z.number().nonnegative().default(0),

  // One-time fields
  oneTimeListPrice: z.number().nonnegative().default(0),

  // Profit modeling
  profitMode: ProfitModeSchema.default("MARGIN_PCT"),
  marginPct: z.number().min(0).max(1).default(0.8),
  profitPerUnitMonthly: z.number().nonnegative().default(0),
  oneTimeProfit: z.number().nonnegative().default(0),

  // Customer Discount (renamed for clarity)
  customerDiscountMode: DiscountModeSchema.default("PERCENT"),
  customerDiscountValue: z.number().nonnegative().default(0),

  // Partner/Channel Commission
  partnerCommissionPct: z.number().min(0).max(100).default(0) // % commission to partner
});

export type Product = z.infer<typeof ProductSchema>;

export const DealTogglesSchema = z.object({
  includeFreeMonths: z.boolean().default(true),
  includeCAC: z.boolean().default(true),
  includeRamp: z.boolean().default(false),
  includeEscalation: z.boolean().default(false)
});
export type DealToggles = z.infer<typeof DealTogglesSchema>;

export const DealSchema = z.object({
  id: z.string().min(1),
  name: z.string(),

  billingCadence: BillingCadenceSchema.default("MONTHLY"),

  contractLengthType: ContractLengthTypeSchema.default("YEARS"),
  contractMonths: z.number().int().positive().default(12),
  contractYears: z.number().int().positive().default(1),

  freeMonthsUpFront: z.number().int().nonnegative().default(0),

  cac: z.number().nonnegative().default(0),

  // Multi-year escalation (YoY price increase)
  annualEscalatorPct: z.number().min(0).max(100).default(0), // % annual increase

  // Ramp period (implementation/onboarding)
  rampMonths: z.number().int().nonnegative().default(0), // number of ramp months
  rampDiscountPct: z.number().min(0).max(100).default(100), // % discount during ramp (100 = free)

  // Discount guardrails
  discountFloorPct: z.number().min(0).max(100).default(25), // warn if discount exceeds this

  toggles: DealTogglesSchema.default({
    includeFreeMonths: true,
    includeCAC: true,
    includeRamp: false,
    includeEscalation: false
  }),

  products: z.array(ProductSchema).default([])
});

export type Deal = z.infer<typeof DealSchema>;

export const WorkspaceSchema = z.object({
  version: z.number().int().default(1),
  selectedDealId: z.string().nullable().default(null),
  comparedDealIds: z.array(z.string()).default([]), // IDs of deals to compare
  deals: z.array(DealSchema).default([])
});
export type Workspace = z.infer<typeof WorkspaceSchema>;
