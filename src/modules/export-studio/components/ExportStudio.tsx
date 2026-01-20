"use client";

import React, { useState } from "react";

export type ExportFormat = "csv" | "json" | "excel" | "pdf";
export type DataSource = "users" | "deals" | "analytics" | "reports";

export interface ExportConfig {
  source: DataSource;
  format: ExportFormat;
  fields: string[];
  filters: Record<string, unknown>;
  dateRange?: { start: Date | null; end: Date | null };
}

export interface ExportHistory {
  id: string;
  name: string;
  source: DataSource;
  format: ExportFormat;
  recordCount: number;
  fileSize: string;
  status: "completed" | "processing" | "failed";
  createdAt: Date;
  downloadUrl?: string;
}

export function ExportStudio() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ExportConfig>({
    source: "users",
    format: "csv",
    fields: [],
    filters: {},
  });
  const [history] = useState<ExportHistory[]>(generateMockHistory());

  const totalSteps = 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Config Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Export Configuration</h3>
            <span className="text-sm text-white/60">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          {step === 1 && <SourceSelection config={config} onChange={setConfig} />}
          {step === 2 && <FormatSelection config={config} onChange={setConfig} />}
          {step === 3 && <FieldSelection config={config} onChange={setConfig} />}
          {step === 4 && <PreviewAndExport config={config} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded-lg border border-white/10 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setStep(Math.min(totalSteps, step + 1))}
            disabled={step === totalSteps}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {step === totalSteps ? "Export" : "Next →"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <ExportHistorySidebar history={history} />
      </div>
    </div>
  );
}

function SourceSelection({ config, onChange }: { config: ExportConfig; onChange: (config: ExportConfig) => void }) {
  const sources: Array<{ id: DataSource; name: string; description: string; icon: string; recordCount: number }> = [
    { id: "users", name: "Users", description: "User accounts and profiles", icon: "👥", recordCount: 1234 },
    { id: "deals", name: "Deals", description: "Sales deals and opportunities", icon: "💼", recordCount: 567 },
    { id: "analytics", name: "Analytics", description: "Usage and performance metrics", icon: "📊", recordCount: 89012 },
    { id: "reports", name: "Reports", description: "Generated reports and summaries", icon: "📄", recordCount: 345 },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Select Data Source</h3>
        <p className="text-white/60">Choose what data you want to export</p>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => onChange({ ...config, source: source.id })}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              config.source === source.id
                ? "bg-purple-500/20 border-purple-500"
                : "bg-white/5 border-white/10 hover:border-white/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{source.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{source.name}</h4>
                <p className="text-sm text-white/60 mb-2">{source.description}</p>
                <p className="text-xs text-white/40">{source.recordCount.toLocaleString()} records available</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FormatSelection({ config, onChange }: { config: ExportConfig; onChange: (config: ExportConfig) => void }) {
  const formats: Array<{ id: ExportFormat; name: string; description: string; icon: string }> = [
    { id: "csv", name: "CSV", description: "Comma-separated values, works with Excel", icon: "📊" },
    { id: "json", name: "JSON", description: "Structured data for APIs and apps", icon: "{ }" },
    { id: "excel", name: "Excel", description: "Native Excel format with formatting", icon: "📗" },
    { id: "pdf", name: "PDF", description: "Print-ready formatted document", icon: "📄" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Select Export Format</h3>
        <p className="text-white/60">Choose the file format for your export</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onChange({ ...config, format: format.id })}
            className={`p-4 rounded-lg border-2 transition-all ${
              config.format === format.id
                ? "bg-purple-500/20 border-purple-500"
                : "bg-white/5 border-white/10 hover:border-white/30"
            }`}
          >
            <div className="text-3xl mb-2 text-center">{format.icon}</div>
            <h4 className="font-semibold text-white text-center mb-1">{format.name}</h4>
            <p className="text-xs text-white/60 text-center">{format.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function FieldSelection({ config, onChange }: { config: ExportConfig; onChange: (config: ExportConfig) => void }) {
  const availableFields = {
    users: ["ID", "Name", "Email", "Role", "Created At", "Last Login", "Status", "Department"],
    deals: ["Deal ID", "Name", "Amount", "Stage", "Owner", "Created", "Close Date", "Probability"],
    analytics: ["Metric", "Value", "Change", "Period", "Category", "Source", "Timestamp"],
    reports: ["Report ID", "Title", "Type", "Generated", "Status", "Author", "Recipients"],
  };

  const fields = availableFields[config.source];

  const handleToggleField = (field: string) => {
    const newFields = config.fields.includes(field)
      ? config.fields.filter((f) => f !== field)
      : [...config.fields, field];
    onChange({ ...config, fields: newFields });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Select Fields</h3>
        <p className="text-white/60">Choose which fields to include in your export</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onChange({ ...config, fields: fields })}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
        >
          Select All
        </button>
        <button
          onClick={() => onChange({ ...config, fields: [] })}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
        >
          Deselect All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <label
            key={field}
            className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={config.fields.includes(field)}
              onChange={() => handleToggleField(field)}
              className="rounded"
            />
            <span className="text-sm text-white">{field}</span>
          </label>
        ))}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
        <p className="text-sm text-white/80">
          {config.fields.length} field{config.fields.length !== 1 ? "s" : ""} selected
        </p>
      </div>
    </div>
  );
}

function PreviewAndExport({ config }: { config: ExportConfig }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Preview & Export</h3>
        <p className="text-white/60">Review your configuration and start the export</p>
      </div>

      {/* Config Summary */}
      <div className="bg-white/5 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-white/60">Data Source:</span>
          <span className="text-white font-medium capitalize">{config.source}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Format:</span>
          <span className="text-white font-medium uppercase">{config.format}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Fields:</span>
          <span className="text-white font-medium">{config.fields.length} selected</span>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3">Data Preview</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {config.fields.slice(0, 4).map((field) => (
                  <th key={field} className="text-left text-white/60 pb-2 px-2">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-white/5">
                  {config.fields.slice(0, 4).map((field) => (
                    <td key={field} className="text-white/80 py-2 px-2">
                      Sample {i}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/40 mt-3">Showing 3 of ~1,000 records</p>
      </div>

      {/* Export Button */}
      <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all">
        Export {config.format.toUpperCase()} File
      </button>
    </div>
  );
}

function ExportHistorySidebar({ history }: { history: ExportHistory[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 sticky top-6">
      <h3 className="font-semibold text-white mb-4">Export History</h3>
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white/5 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{item.name}</h4>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  item.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : item.status === "processing"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="text-xs text-white/60 space-y-1">
              <p>{item.recordCount.toLocaleString()} records • {item.fileSize}</p>
              <p>{item.createdAt.toLocaleString()}</p>
            </div>
            {item.downloadUrl && (
              <button className="mt-2 w-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors">
                Download
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateMockHistory(): ExportHistory[] {
  return [
    {
      id: "1",
      name: "Users Export",
      source: "users",
      format: "csv",
      recordCount: 1234,
      fileSize: "234 KB",
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      downloadUrl: "#",
    },
    {
      id: "2",
      name: "Analytics Q4",
      source: "analytics",
      format: "excel",
      recordCount: 45678,
      fileSize: "12.3 MB",
      status: "completed",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      downloadUrl: "#",
    },
    {
      id: "3",
      name: "Deals Report",
      source: "deals",
      format: "pdf",
      recordCount: 567,
      fileSize: "1.2 MB",
      status: "processing",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  ];
}
