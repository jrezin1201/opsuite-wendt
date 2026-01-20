"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { type Lead, type LeadStage } from "../lib/types";

const STAGES: { id: LeadStage; name: string; color: string }[] = [
  { id: "lead", name: "New Leads", color: "bg-gray-500" },
  { id: "qualified", name: "Qualified", color: "bg-blue-500" },
  { id: "proposal", name: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
  { id: "closed", name: "Closed Won", color: "bg-green-500" },
];

// Mock data
const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    company: "Acme Corp",
    email: "john@acme.com",
    value: 50000,
    stage: "lead",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    company: "TechStart Inc",
    email: "jane@techstart.com",
    value: 75000,
    stage: "qualified",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Bob Wilson",
    company: "Global Solutions",
    email: "bob@global.com",
    value: 120000,
    stage: "proposal",
    createdAt: new Date(),
  },
];

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: LeadStage) => {
    if (!draggedLead) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggedLead.id ? { ...lead, stage } : lead
      )
    );
    setDraggedLead(null);
  };

  const getLeadsByStage = (stage: LeadStage) =>
    leads.filter((lead) => lead.stage === stage);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 p-6 min-w-max">
        {STAGES.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageValue = stageLeads.reduce(
            (sum, lead) => sum + lead.value,
            0
          );

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-semibold text-white">{stage.name}</h3>
                  </div>
                  <span className="text-sm text-white/60">
                    {stageLeads.length}
                  </span>
                </div>
                <p className="text-xs text-white/40">
                  {formatCurrency(stageValue)} pipeline
                </p>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    className="cursor-move"
                  >
                    <Card hover={true}>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white text-sm">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-white/60">
                              {lead.company}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-green-400">
                            {formatCurrency(lead.value)}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">{lead.email}</p>
                      </div>
                    </Card>
                  </div>
                ))}

                {/* Drop Zone */}
                {stageLeads.length === 0 && (
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                    <p className="text-sm text-white/40">Drop leads here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
