"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  bio?: string;
  joinedDate: Date;
  tags?: string[];
  location?: string;
  isOnline?: boolean;
}

interface MemberDirectoryProps {
  members: Member[];
  onMemberSelect?: (member: Member) => void;
}

export function MemberDirectory({
  members,
  onMemberSelect,
}: MemberDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique roles and tags
  const roles = ["all", ...new Set(members.map((m) => m.role))];
  const allTags = new Set(members.flatMap((m) => m.tags || []));

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "all" || member.role === selectedRole;

    const matchesTag =
      !selectedTag || member.tags?.includes(selectedTag);

    return matchesSearch && matchesRole && matchesTag;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-gray-900">
                  {role === "all" ? "All Roles" : role}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === "grid"
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
                aria-label="Grid view"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === "list"
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
                aria-label="List view"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tag Pills */}
          {allTags.size > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTag === null
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                All Tags
              </button>
              {Array.from(allTags).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-white/60">
          {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Members */}
      <div
        className={
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredMembers.map((member) => (
          <Card key={member.id} hover={true}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-purple-400 mb-2">{member.role}</p>

                  {member.bio && (
                    <p className="text-sm text-white/60 mb-3 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {/* Tags */}
                  {member.tags && member.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {member.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs text-white/40">
                          +{member.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                    {member.location && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {member.location}
                      </span>
                    )}
                    <span>Joined {formatDate(member.joinedDate)}</span>
                  </div>

                  {/* Actions */}
                  <Button
                    size="sm"
                    onClick={() => onMemberSelect && onMemberSelect(member)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <p className="text-white/40">No members found matching your criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
}
