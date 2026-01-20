/**
 * CRM Types
 */

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  stage: LeadStage;
  createdAt: Date;
  notes?: string;
}

export type LeadStage = "lead" | "qualified" | "proposal" | "negotiation" | "closed";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "active" | "inactive";
  totalValue: number;
  deals: number;
  joinedAt: Date;
}
