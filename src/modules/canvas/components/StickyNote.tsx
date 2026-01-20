"use client";

import React, { useState, useRef, useEffect } from "react";

export interface StickyNoteData {
  content: string;
  color: "yellow" | "pink" | "blue" | "green" | "purple";
}

interface StickyNoteProps {
  id: string;
  x: number;
  y: number;
  content: string;
  color: string;
  onUpdate: (id: string, content: string, color: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dx: number, dy: number) => void;
  disabled?: boolean;
}

const colorStyles = {
  yellow: "bg-yellow-200 border-yellow-300",
  pink: "bg-pink-200 border-pink-300",
  blue: "bg-blue-200 border-blue-300",
  green: "bg-green-200 border-green-300",
  purple: "bg-purple-200 border-purple-300",
};

export function StickyNote({
  id,
  x,
  y,
  content,
  color,
  onUpdate,
  onDelete,
  onMove,
  disabled = false,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editContent, setEditContent] = useState(content);
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isEditing) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !disabled) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      onMove(id, dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart]);

  const handleDoubleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editContent !== content) {
      onUpdate(id, editContent, color);
    }
  };

  const handleColorChange = (newColor: string) => {
    onUpdate(id, content, newColor);
  };

  return (
    <div
      ref={noteRef}
      className={`absolute w-48 h-48 rounded-lg shadow-lg border-2 ${colorStyles[color as keyof typeof colorStyles] || colorStyles.yellow} ${isDragging ? "cursor-grabbing scale-105" : "cursor-grab"} transition-transform`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Color picker */}
      {!disabled && (
        <div className="absolute -top-8 left-0 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
          {Object.keys(colorStyles).map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 ${colorStyles[c as keyof typeof colorStyles]} ${color === c ? "ring-2 ring-white" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(c);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete button */}
      {!disabled && (
        <button
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          ×
        </button>
      )}

      {/* Content */}
      <div className="p-4 h-full flex items-center justify-center">
        {isEditing ? (
          <textarea
            className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-900 text-sm"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <p className="text-sm text-gray-900 text-center break-words">{content}</p>
        )}
      </div>
    </div>
  );
}
