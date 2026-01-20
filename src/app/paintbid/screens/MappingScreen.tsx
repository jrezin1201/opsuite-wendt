"use client";

import { useMemo } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { normalizeName, findBestMatch } from "@/lib/paintbid/normalize";

export function MappingScreen() {
  const lineItems = usePaintBidStore((state) => state.lineItems);
  const pricebook = usePaintBidStore((state) => state.pricebook);
  const updateLineItem = usePaintBidStore((state) => state.updateLineItem);
  const setMapping = usePaintBidStore((state) => state.setMapping);

  // Find unmapped items
  const unmappedItems = useMemo(() => {
    return lineItems.filter((item) => !item.pricebookItemId || item.baseUnitPrice === 0);
  }, [lineItems]);

  const handleMap = (lineItemId: string, rawName: string, pricebookItemId: string) => {
    const pricebookItem = pricebook.find((p) => p.id === pricebookItemId);
    if (!pricebookItem) return;

    // Update line item with pricebook data
    updateLineItem(lineItemId, {
      pricebookItemId,
      baseUnitPrice: pricebookItem.baseUnitPrice,
      unit: pricebookItem.unit,
      complexity: pricebookItem.defaultComplexity || 2,
    });

    // Save mapping for future imports
    const normalized = normalizeName(rawName);
    setMapping(normalized, pricebookItemId);
  };

  const handleAutoSuggest = () => {
    let mappedCount = 0;

    unmappedItems.forEach((item) => {
      const suggestedId = findBestMatch(
        item.nameOverride || "",
        pricebook.map((p) => ({ id: p.id, name: p.name }))
      );

      if (suggestedId) {
        handleMap(item.id, item.nameOverride || "", suggestedId);
        mappedCount++;
      }
    });

    if (mappedCount > 0) {
      alert(`Auto-mapped ${mappedCount} items`);
    } else {
      alert("No automatic matches found");
    }
  };

  if (lineItems.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <div className="text-4xl mb-4">🔗</div>
        <p>No takeoff items to map. Import a takeoff first.</p>
      </div>
    );
  }

  if (unmappedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-white mb-2">All items are mapped!</p>
        <p className="text-white/60 text-sm">
          Go to the &quot;Bid&quot; tab to adjust pricing and complexity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Map Takeoff Items to Pricebook
          </h2>
          <p className="text-sm text-white/60 mt-1">
            {unmappedItems.length} unmapped item{unmappedItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleAutoSuggest} variant="secondary">
          Auto-Suggest Mappings
        </Button>
      </div>

      {/* Mapping List */}
      <div className="space-y-4">
        {unmappedItems.map((item) => {
          const suggested = findBestMatch(
            item.nameOverride || "",
            pricebook.map((p) => ({ id: p.id, name: p.name }))
          );
          const suggestedItem = pricebook.find((p) => p.id === suggested);

          return (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Takeoff Item */}
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">Takeoff Item</div>
                  <div className="text-white font-semibold">
                    {item.nameOverride}
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    {item.qty} {item.unit || "units"}
                    {item.group && (
                      <span className="ml-2 text-purple-300">({item.group})</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-white/30">
                  →
                </div>

                {/* Pricebook Selection */}
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">Map to Pricebook</div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMap(item.id, item.nameOverride || "", e.target.value);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="">Select pricebook item...</option>
                    {suggestedItem && (
                      <option
                        value={suggestedItem.id}
                        className="bg-purple-500/20 font-semibold"
                      >
                        ⭐ {suggestedItem.name} (${suggestedItem.baseUnitPrice}/{suggestedItem.unit})
                      </option>
                    )}
                    {pricebook
                      .filter((p) => p.id !== suggested)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.baseUnitPrice}/{p.unit})
                        </option>
                      ))}
                  </select>
                  {suggestedItem && (
                    <div className="text-xs text-purple-300 mt-1">
                      ⭐ Suggested match based on name similarity
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
