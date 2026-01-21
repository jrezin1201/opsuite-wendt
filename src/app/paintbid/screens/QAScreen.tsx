"use client";

import { useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";

type ResolutionAction = "map" | "ignore" | "create_line";

export function QAScreen() {
  const importReport = usePaintBidStore((state) => state.importReport);
  const qa = usePaintBidStore((state) => state.qa);
  const store = usePaintBidStore();

  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Check if QA has been acknowledged
  const isAcknowledged = qa.acknowledgedAt !== undefined;

  // Count resolved vs unresolved
  const unmappedItems = importReport?.unmapped || [];
  const resolvedCount = Object.keys(qa.resolved).length;
  const unresolvedCount = unmappedItems.length - resolvedCount;

  // Get list of unresolved items
  const unresolvedItems = unmappedItems.filter((item) => {
    const itemKey = `${item.sectionGuess || "unknown"}-${item.key}-${item.rowIndex}`;
    return qa.resolved[itemKey] === undefined;
  });

  const handleAcknowledge = () => {
    store.updateQAResolution({
      acknowledgedAt: Date.now(),
    });
  };

  const handleResolve = (key: string, action: ResolutionAction, mappedTo?: string, note?: string) => {
    store.resolveUnmappedItem(key, {
      action,
      mappedTo,
      note,
    });
  };

  const handleToggleItem = (key: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedItems.size === unresolvedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(unresolvedItems.map(item =>
        `${item.sectionGuess || "unknown"}-${item.key}-${item.rowIndex}`
      )));
    }
  };

  const handleBatchResolve = (action: ResolutionAction) => {
    selectedItems.forEach((itemKey) => {
      const item = unmappedItems.find(
        (i) => `${i.sectionGuess || "unknown"}-${i.key}-${i.rowIndex}` === itemKey
      );
      if (!item) return;

      let mappedTo: string | undefined;
      let note: string | undefined;

      if (action === "map") {
        mappedTo = item.suggestions?.[0]?.target || "unknown";
        note = `Bulk mapped to ${mappedTo}`;
      } else if (action === "ignore") {
        note = "Bulk ignored - not needed";
      } else if (action === "create_line") {
        mappedTo = item.key;
        note = "Bulk created as custom line item";
      }

      handleResolve(itemKey, action, mappedTo, note);
    });

    setSelectedItems(new Set());
    setExpandedKey(null);
  };

  // No import report yet
  if (!importReport) {
    return (
      <div className="text-center py-16">
        <div className="text-7xl mb-6">📋</div>
        <h2 className="text-3xl font-bold text-brand-navy mb-3">QA / Reconcile</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Import an Excel file first to see quality assurance checks here.
        </p>
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 max-w-lg mx-auto">
          <p className="text-brand-navy font-semibold text-base">
            📍 Next Step: Go to the <strong className="text-brand-gold">Import</strong> tab to upload your takeoff Excel file.
          </p>
        </div>
      </div>
    );
  }

  // Show summary and unmapped items
  return (
    <div className="space-y-6">
      {/* QA Summary Card */}
      <div className={`border-2 rounded-lg p-6 ${
        unresolvedCount === 0
          ? "bg-green-50 border-green-300"
          : isAcknowledged
          ? "bg-blue-50 border-blue-300"
          : "bg-yellow-50 border-yellow-300"
      }`}>
        <div className="flex items-start gap-3">
          <div className="text-4xl">
            {unresolvedCount === 0 ? "✅" : isAcknowledged ? "🔍" : "⚠️"}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {unresolvedCount === 0
                ? "All Items Resolved"
                : isAcknowledged
                ? "QA Acknowledged - In Progress"
                : "QA Review Required"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-600">Total Unmapped</div>
                <div className="text-2xl font-bold">{unmappedItems.length}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600">Resolved</div>
                <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600">Unresolved</div>
                <div className="text-2xl font-bold text-red-600">{unresolvedCount}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600">Confidence</div>
                <div className="text-2xl font-bold uppercase">{importReport.summary.confidence}</div>
              </div>
            </div>

            {!isAcknowledged && unresolvedCount > 0 && (
              <div className="bg-white p-4 rounded border-2 border-current">
                <p className="text-sm font-semibold mb-3">
                  ⚠️ You have {unresolvedCount} unmapped item(s) that need attention.
                  Review each item below and choose an action:
                </p>
                <ul className="text-sm space-y-1 ml-6 list-disc">
                  <li><strong>Map:</strong> Match to an existing normalized field</li>
                  <li><strong>Ignore:</strong> Skip this item (will not create a bid line)</li>
                  <li><strong>Create Line:</strong> Add as a new custom bid line item</li>
                </ul>
                <div className="mt-4">
                  <Button onClick={handleAcknowledge} variant="secondary" className="w-full">
                    ✓ Acknowledge & Proceed with Review
                  </Button>
                </div>
              </div>
            )}

            {isAcknowledged && unresolvedCount > 0 && (
              <div className="bg-white p-4 rounded border-2 border-current">
                <p className="text-sm font-semibold">
                  📌 Review in progress. Resolve remaining {unresolvedCount} item(s) below.
                </p>
              </div>
            )}

            {unresolvedCount === 0 && unmappedItems.length > 0 && (
              <div className="bg-white p-4 rounded border-2 border-current">
                <p className="text-sm font-semibold">
                  ✅ All unmapped items have been resolved! You can now proceed to the Bid Form.
                </p>
              </div>
            )}

            {unresolvedCount === 0 && unmappedItems.length === 0 && (
              <div className="bg-white p-4 rounded border-2 border-current">
                <p className="text-sm font-semibold">
                  ✅ Perfect import! All items were automatically mapped. No QA action needed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Report Summary */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
        <h4 className="font-bold text-lg mb-3">Import Summary (Live)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Parsed Rows</div>
            <div className="text-xl font-bold">{importReport.summary.parsedRows}</div>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Mapped Rows</div>
            <div className="text-xl font-bold text-green-600">
              {importReport.summary.mappedRows + resolvedCount}
              {resolvedCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">(+{resolvedCount})</span>
              )}
            </div>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Unmapped Rows</div>
            <div className="text-xl font-bold text-red-600">{unresolvedCount}</div>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Ignored Rows</div>
            <div className="text-xl font-bold text-gray-400">
              {importReport.summary.ignoredRows + Object.values(qa.resolved).filter(r => r.action === 'ignore').length}
            </div>
          </div>
        </div>
      </div>

      {/* Unmapped Items List */}
      {unmappedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              Unmapped Items ({unresolvedCount} of {unmappedItems.length})
            </h4>
            {unresolvedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">
                  {selectedItems.size} selected
                </span>
              </div>
            )}
          </div>

          {/* Batch Actions Bar */}
          {unresolvedCount > 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === unresolvedItems.length && unresolvedItems.length > 0}
                    onChange={handleToggleAll}
                    className="w-5 h-5 rounded border-2 border-blue-400 text-brand-navy focus:ring-2 focus:ring-brand-gold"
                  />
                  <span className="font-semibold text-blue-900">
                    Select All ({unresolvedItems.length} items)
                  </span>
                </div>
                {selectedItems.size > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBatchResolve("map")}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                    >
                      📌 Map Selected ({selectedItems.size})
                    </Button>
                    <Button
                      onClick={() => handleBatchResolve("ignore")}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                    >
                      🚫 Ignore Selected ({selectedItems.size})
                    </Button>
                    <Button
                      onClick={() => handleBatchResolve("create_line")}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                    >
                      ➕ Create Lines ({selectedItems.size})
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {unmappedItems.map((item) => {
            const itemKey = `${item.sectionGuess || "unknown"}-${item.key}-${item.rowIndex}`;
            const resolution = qa.resolved[itemKey];
            const isResolved = resolution !== undefined;
            const isExpanded = expandedKey === itemKey;

            return (
              <div
                key={itemKey}
                className={`border-2 rounded-lg p-4 ${
                  isResolved
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-yellow-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      {!isResolved && (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(itemKey)}
                          onChange={() => handleToggleItem(itemKey)}
                          className="w-5 h-5 mt-1 rounded border-2 border-yellow-400 text-brand-navy focus:ring-2 focus:ring-brand-gold"
                        />
                      )}
                      <div className="text-2xl">
                        {isResolved ? "✅" : "❓"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base">
                          {item.sectionGuess && (
                            <span className="text-blue-600">[{item.sectionGuess}]</span>
                          )}{" "}
                          {item.key}
                          {item.valueNum !== null && item.valueNum !== undefined && (
                            <span className="text-gray-600 ml-2">= {item.valueNum}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Row {item.rowIndex !== undefined ? item.rowIndex + 1 : "?"}
                        </div>
                        {item.suggestions && item.suggestions.length > 0 && (
                          <div className="mt-2 text-xs">
                            <span className="font-semibold text-gray-700">Suggestions:</span>{" "}
                            {item.suggestions.map((s, i) => (
                              <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1 mb-1">
                                {s.label} ({Math.round(s.score * 100)}%)
                              </span>
                            ))}
                          </div>
                        )}
                        {isResolved && (
                          <div className="mt-2 p-2 bg-white rounded border border-green-200">
                            <div className="text-xs font-semibold text-green-800">
                              Resolved: {resolution.action === "map" ? "Mapped" : resolution.action === "ignore" ? "Ignored" : "Create Line"}
                              {resolution.mappedTo && ` → ${resolution.mappedTo}`}
                            </div>
                            {resolution.note && (
                              <div className="text-xs text-gray-600 mt-1">Note: {resolution.note}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isResolved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedKey(isExpanded ? null : itemKey)}
                        className="px-3 py-1.5 bg-brand-navy text-white rounded font-semibold text-sm hover:bg-brand-navy2 transition-colors"
                      >
                        {isExpanded ? "Cancel" : "Resolve"}
                      </button>
                    </div>
                  )}

                  {isResolved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Remove resolution to allow re-resolution
                          const newResolved = { ...qa.resolved };
                          delete newResolved[itemKey];
                          store.updateQAResolution({ resolved: newResolved });
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold text-sm hover:bg-gray-300 transition-colors"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>

                {/* Resolution Options */}
                {isExpanded && !isResolved && (
                  <div className="mt-4 pt-4 border-t-2 border-yellow-200 space-y-3">
                    <div className="font-semibold text-sm">Choose an action:</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Map to existing field */}
                      <button
                        onClick={() => {
                          // For now, just use first suggestion if available
                          const target = item.suggestions?.[0]?.target || "unknown";
                          handleResolve(itemKey, "map", target, `Mapped to ${target}`);
                          setExpandedKey(null);
                        }}
                        className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg text-left hover:bg-blue-100 transition-colors"
                      >
                        <div className="font-bold text-blue-900 text-sm mb-1">📌 Map</div>
                        <div className="text-xs text-blue-700">
                          Map to existing field
                          {item.suggestions?.[0] && (
                            <div className="mt-1 font-semibold">→ {item.suggestions[0].label}</div>
                          )}
                        </div>
                      </button>

                      {/* Ignore */}
                      <button
                        onClick={() => {
                          handleResolve(itemKey, "ignore", undefined, "Ignored - not needed");
                          setExpandedKey(null);
                        }}
                        className="p-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-left hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-bold text-gray-900 text-sm mb-1">🚫 Ignore</div>
                        <div className="text-xs text-gray-700">
                          Skip this item (will not appear in bid)
                        </div>
                      </button>

                      {/* Create Line */}
                      <button
                        onClick={() => {
                          handleResolve(itemKey, "create_line", item.key, "Created as custom line item");
                          setExpandedKey(null);
                        }}
                        className="p-3 bg-green-50 border-2 border-green-300 rounded-lg text-left hover:bg-green-100 transition-colors"
                      >
                        <div className="font-bold text-green-900 text-sm mb-1">➕ Create Line</div>
                        <div className="text-xs text-green-700">
                          Add as new bid line item
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Successfully Mapped Items (collapsible) */}
      {importReport.mapped.length > 0 && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <details>
            <summary className="font-bold text-green-900 cursor-pointer flex items-center gap-2 text-lg">
              <span className="text-2xl">✅</span>
              Successfully Mapped Items ({importReport.mapped.length})
            </summary>
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {importReport.mapped.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-blue-600 font-semibold">[{item.section}]</span>{" "}
                      {item.key} = {item.valueNum}
                    </div>
                    <div className="text-xs text-gray-500">
                      → <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{item.mappedTo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
