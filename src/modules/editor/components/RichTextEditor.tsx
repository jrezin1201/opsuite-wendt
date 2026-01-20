"use client";

import React, { useState } from "react";

export function RichTextEditor() {
  const [content, setContent] = useState("<h1>Welcome to the Rich Text Editor</h1><p>Start typing to create your content...</p>");
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const formatButtons = [
    { id: "bold", icon: "B", label: "Bold" },
    { id: "italic", icon: "I", label: "Italic" },
    { id: "underline", icon: "U", label: "Underline" },
    { id: "strike", icon: "S", label: "Strikethrough" },
  ];

  const insertButtons = [
    { id: "link", icon: "🔗", label: "Link" },
    { id: "image", icon: "🖼️", label: "Image" },
    { id: "code", icon: "</>", label: "Code" },
    { id: "quote", icon: "\"\"", label: "Quote" },
  ];

  const toggleFormat = (formatId: string) => {
    setActiveFormats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(formatId)) {
        newSet.delete(formatId);
      } else {
        newSet.add(formatId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5 flex-wrap">
          <select className="px-3 py-1.5 bg-white/10 border border-white/10 rounded text-white text-sm">
            <option>Paragraph</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <div className="w-px h-6 bg-white/10" />
          {formatButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => toggleFormat(btn.id)}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-colors ${
                activeFormats.has(btn.id)
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10" />
          {insertButtons.map((btn) => (
            <button
              key={btn.id}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div
          contentEditable
          className="min-h-[400px] p-6 text-white focus:outline-none prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-white/60 px-4">
        <span>{content.replace(/<[^>]*>/g, "").length} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}
