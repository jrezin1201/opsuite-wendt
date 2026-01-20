"use client";

import { useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getSamplePricebook } from "@/lib/paintbid/sample-data";
import { formatCurrency } from "@/lib/paintbid/pricing";
import type { PricebookItem, Complexity } from "@/lib/paintbid/types";

export function PricebookScreen() {
  const pricebook = usePaintBidStore((state) => state.pricebook);
  const addPricebookItem = usePaintBidStore((state) => state.addPricebookItem);
  const updatePricebookItem = usePaintBidStore((state) => state.updatePricebookItem);
  const deletePricebookItem = usePaintBidStore((state) => state.deletePricebookItem);
  const setPricebook = usePaintBidStore((state) => state.setPricebook);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PricebookItem | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    unit: "",
    baseUnitPrice: 0,
    defaultComplexity: 2 as Complexity,
    defaultScopeText: "",
  });

  const handleLoadSample = () => {
    if (confirm("Load sample pricebook? This will replace existing items.")) {
      setPricebook(getSamplePricebook());
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      code: "",
      name: "",
      unit: "sqft",
      baseUnitPrice: 0,
      defaultComplexity: 2,
      defaultScopeText: "",
    });
    setShowModal(true);
  };

  const handleEdit = (item: PricebookItem) => {
    setEditingItem(item);
    setFormData({
      code: item.code || "",
      name: item.name,
      unit: item.unit,
      baseUnitPrice: item.baseUnitPrice,
      defaultComplexity: item.defaultComplexity || 2,
      defaultScopeText: item.defaultScopeText || "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.unit || formData.baseUnitPrice <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      updatePricebookItem(editingItem.id, formData);
    } else {
      addPricebookItem(formData);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this pricebook item?")) {
      deletePricebookItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleAdd}>
          + Add Item
        </Button>
        <Button variant="secondary" onClick={handleLoadSample}>
          Load Sample Pricebook
        </Button>
      </div>

      {/* Pricebook Table */}
      {pricebook.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <div className="text-4xl mb-4">📚</div>
          <p>No pricebook items yet. Add items or load the sample pricebook.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-sm font-semibold text-white/80">Code</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-white/80">Name</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-white/80">Unit</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-white/80">Price</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-white/80">Complexity</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricebook.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 text-sm text-white/70">{item.code || "-"}</td>
                  <td className="py-3 px-2 text-sm text-white">{item.name}</td>
                  <td className="py-3 px-2 text-sm text-white/70">{item.unit}</td>
                  <td className="py-3 px-2 text-sm text-right text-white">
                    {formatCurrency(item.baseUnitPrice)}
                  </td>
                  <td className="py-3 px-2 text-sm text-center text-white/70">
                    {item.defaultComplexity || "-"}
                  </td>
                  <td className="py-3 px-2 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? "Edit Pricebook Item" : "Add Pricebook Item"}
      >
        <div className="space-y-4">
          <Input
            label="Code (optional)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="WALL-INT"
          />
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Interior Walls"
            required
          />
          <Input
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="sqft, lf, each"
            required
          />
          <Input
            label="Base Unit Price"
            type="number"
            step="0.01"
            value={formData.baseUnitPrice}
            onChange={(e) =>
              setFormData({ ...formData, baseUnitPrice: parseFloat(e.target.value) || 0 })
            }
            required
          />
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Default Complexity (1-5)
            </label>
            <select
              value={formData.defaultComplexity}
              onChange={(e) =>
                setFormData({ ...formData, defaultComplexity: parseInt(e.target.value) as Complexity })
              }
              className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
            >
              <option value="1">1 - Very Easy</option>
              <option value="2">2 - Easy</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - Hard</option>
              <option value="5">5 - Very Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Default Scope Text
            </label>
            <textarea
              value={formData.defaultScopeText}
              onChange={(e) =>
                setFormData({ ...formData, defaultScopeText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 min-h-[80px]"
              placeholder="Description for proposal"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingItem ? "Update" : "Add"}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
