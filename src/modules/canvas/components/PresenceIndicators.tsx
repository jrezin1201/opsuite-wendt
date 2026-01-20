"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
  cursor: { x: number; y: number };
}

export function PresenceIndicators() {
  const [users] = useState<User[]>([
    { id: "1", name: "Alice", color: "#FF6B6B", avatar: "A", cursor: { x: 200, y: 300 } },
    { id: "2", name: "Bob", color: "#4ECDC4", avatar: "B", cursor: { x: 500, y: 200 } },
    { id: "3", name: "Charlie", color: "#FFE66D", avatar: "C", cursor: { x: 300, y: 450 } },
  ]);

  const [cursors, setCursors] = useState(users.map((u) => u.cursor));

  // Simulate cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => ({
          x: cursor.x + (Math.random() - 0.5) * 100,
          y: cursor.y + (Math.random() - 0.5) * 100,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* User avatars in corner */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.avatar}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white/60 text-xs">
          +You
        </div>
      </div>

      {/* Simulated cursors */}
      {users.map((user, index) => (
        <div
          key={user.id}
          className="absolute pointer-events-none z-20 transition-all duration-2000 ease-linear"
          style={{
            left: cursors[index].x,
            top: cursors[index].y,
            transform: "translate(-2px, -2px)",
          }}
        >
          {/* Cursor */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill={user.color}>
            <path d="M5 3l3.057 14.736L11 13l5.736 2.943L5 3z" />
          </svg>
          {/* Name label */}
          <div
            className="absolute left-6 top-0 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap shadow-lg"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </>
  );
}
