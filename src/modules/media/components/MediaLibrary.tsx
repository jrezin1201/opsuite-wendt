"use client";

import React, { useState } from "react";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  size: string;
  uploadedAt: Date;
  url: string;
}

export function MediaLibrary() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | MediaFile["type"]>("all");

  const mockFiles: MediaFile[] = [
    { id: "1", name: "hero-image.jpg", type: "image", size: "2.3 MB", uploadedAt: new Date(2024, 11, 1), url: "#" },
    { id: "2", name: "product-demo.mp4", type: "video", size: "45.2 MB", uploadedAt: new Date(2024, 11, 2), url: "#" },
    { id: "3", name: "presentation.pdf", type: "document", size: "1.1 MB", uploadedAt: new Date(2024, 11, 3), url: "#" },
    { id: "4", name: "logo.png", type: "image", size: "156 KB", uploadedAt: new Date(2024, 11, 4), url: "#" },
    { id: "5", name: "podcast.mp3", type: "audio", size: "12.4 MB", uploadedAt: new Date(2024, 11, 5), url: "#" },
  ];

  const filteredFiles = filter === "all" ? mockFiles : mockFiles.filter((f) => f.type === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Media Library</h2>
          <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
            {filteredFiles.length} files
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="audio">Audio</option>
          </select>
          <div className="flex gap-1 bg-white/5 rounded p-1">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1 rounded text-sm ${view === "grid" ? "bg-purple-500 text-white" : "text-white/60"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded text-sm ${view === "list" ? "bg-purple-500 text-white" : "text-white/60"}`}
            >
              List
            </button>
          </div>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition-colors">
            Upload
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group cursor-pointer">
              <div className="aspect-square bg-white/5 rounded mb-3 flex items-center justify-center text-4xl">
                {file.type === "image" ? "🖼️" : file.type === "video" ? "🎥" : file.type === "document" ? "📄" : "🎵"}
              </div>
              <p className="text-sm font-medium text-white truncate mb-1">{file.name}</p>
              <p className="text-xs text-white/60">{file.size}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Name</th>
                <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Type</th>
                <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Size</th>
                <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm text-white">{file.name}</td>
                  <td className="px-4 py-3 text-sm text-white/60 capitalize">{file.type}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{file.size}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{file.uploadedAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
