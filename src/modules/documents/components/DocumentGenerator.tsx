"use client";

import React, { useState } from "react";

export type DocumentTemplate = "invoice" | "contract" | "proposal" | "report" | "agreement";

export interface TemplateVariable {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "currency";
  required: boolean;
  defaultValue?: string;
}

export interface DocumentData {
  template: DocumentTemplate;
  variables: Record<string, string>;
}

export function DocumentGenerator() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const templates = [
    { id: "invoice" as const, name: "Invoice", description: "Professional billing invoice", icon: "💵" },
    { id: "contract" as const, name: "Service Contract", description: "Client service agreement", icon: "📜" },
    { id: "proposal" as const, name: "Project Proposal", description: "Business proposal document", icon: "📋" },
    { id: "report" as const, name: "Business Report", description: "Formatted business report", icon: "📊" },
    { id: "agreement" as const, name: "NDA Agreement", description: "Non-disclosure agreement", icon: "🔒" },
  ];

  const templateVariables: Record<DocumentTemplate, TemplateVariable[]> = {
    invoice: [
      { key: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
      { key: "clientName", label: "Client Name", type: "text", required: true },
      { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
      { key: "dueDate", label: "Due Date", type: "date", required: true },
      { key: "amount", label: "Total Amount", type: "currency", required: true },
      { key: "description", label: "Service Description", type: "text", required: true },
    ],
    contract: [
      { key: "partyA", label: "Service Provider", type: "text", required: true },
      { key: "partyB", label: "Client Name", type: "text", required: true },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
      { key: "fee", label: "Service Fee", type: "currency", required: true },
      { key: "scope", label: "Scope of Work", type: "text", required: true },
    ],
    proposal: [
      { key: "projectName", label: "Project Name", type: "text", required: true },
      { key: "clientCompany", label: "Client Company", type: "text", required: true },
      { key: "budget", label: "Estimated Budget", type: "currency", required: true },
      { key: "timeline", label: "Timeline", type: "text", required: true },
      { key: "objectives", label: "Project Objectives", type: "text", required: true },
    ],
    report: [
      { key: "reportTitle", label: "Report Title", type: "text", required: true },
      { key: "period", label: "Reporting Period", type: "text", required: true },
      { key: "author", label: "Author", type: "text", required: true },
      { key: "summary", label: "Executive Summary", type: "text", required: true },
    ],
    agreement: [
      { key: "disclosingParty", label: "Disclosing Party", type: "text", required: true },
      { key: "receivingParty", label: "Receiving Party", type: "text", required: true },
      { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { key: "purpose", label: "Purpose", type: "text", required: true },
    ],
  };

  const currentVariables = selectedTemplate ? templateVariables[selectedTemplate] : [];

  const handleVariableChange = (key: string, value: string) => {
    setVariables({ ...variables, [key]: value });
  };

  const isFormValid = currentVariables.every((v) => !v.required || variables[v.key]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Progress */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Document Generation</h3>
          <span className="text-sm text-white/60">Step {step} of 3</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Select Template</h3>
                  <p className="text-white/60">Choose a document template to get started</p>
                </div>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setStep(2);
                      }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-sm text-white/60">{template.description}</p>
                        </div>
                        <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && selectedTemplate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Fill Template Variables</h3>
                    <p className="text-white/60">Enter the information for your document</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    ← Change Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentVariables.map((variable) => (
                    <div key={variable.key}>
                      <label className="block text-sm text-white/60 mb-2">
                        {variable.label}
                        {variable.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <input
                        type={variable.type === "date" ? "date" : variable.type === "number" || variable.type === "currency" ? "number" : "text"}
                        value={variables[variable.key] || ""}
                        onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={`Enter ${variable.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && selectedTemplate && (
              <DocumentPreview template={selectedTemplate} variables={variables} />
            )}
          </div>

          {/* Navigation */}
          {step > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
              >
                ← Previous
              </button>
              {step === 2 ? (
                <button
                  onClick={() => setStep(3)}
                  disabled={!isFormValid}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  Preview Document →
                </button>
              ) : (
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all">
                  Download PDF
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 sticky top-6">
            <h3 className="font-semibold text-white mb-4">Document Info</h3>
            {selectedTemplate ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 mb-1">Template</p>
                  <p className="text-sm text-white capitalize">{selectedTemplate.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Variables</p>
                  <p className="text-sm text-white">
                    {Object.keys(variables).length} / {currentVariables.length} filled
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Format</p>
                  <p className="text-sm text-white">PDF Document</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/40">Select a template to begin</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentPreview({ template, variables }: { template: DocumentTemplate; variables: Record<string, string> }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Document Preview</h3>
        <p className="text-white/60">Review your document before downloading</p>
      </div>

      <div className="bg-white rounded-lg p-8 text-gray-900 shadow-xl min-h-[600px]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-bold capitalize">{template.replace("-", " ")}</h1>
            <p className="text-sm text-gray-600 mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <dt className="font-semibold text-gray-700 min-w-[140px] capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </dt>
                <dd className="text-gray-900">{value || "(Not provided)"}</dd>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <p className="text-xs text-gray-500 text-center">
              This is a preview. Download the PDF for the complete formatted document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
