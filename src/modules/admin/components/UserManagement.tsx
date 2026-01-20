"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "suspended" | "pending";
  lastActive: Date;
  createdAt: Date;
}

interface UserManagementProps {
  users: User[];
  onUpdateUser?: (userId: string, updates: Partial<User>) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UserManagement({
  users,
  onUpdateUser,
  onDeleteUser,
}: UserManagementProps) {
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "moderator":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "user":
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getStatusBadgeColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    if (onUpdateUser) {
      onUpdateUser(userId, { role: newRole });
    }
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    if (onUpdateUser) {
      onUpdateUser(userId, { status: newStatus });
    }
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              User Management
            </h3>
            <p className="text-sm text-white/60">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <Button>Add User</Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-900">
              All Roles
            </option>
            <option value="admin" className="bg-gray-900">
              Admin
            </option>
            <option value="moderator" className="bg-gray-900">
              Moderator
            </option>
            <option value="user" className="bg-gray-900">
              User
            </option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-900">
              All Status
            </option>
            <option value="active" className="bg-gray-900">
              Active
            </option>
            <option value="suspended" className="bg-gray-900">
              Suspended
            </option>
            <option value="pending" className="bg-gray-900">
              Pending
            </option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">
                  Last Active
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">
                  Joined
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-white/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-white/60">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as User["role"])
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user.role
                      )} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="user" className="bg-gray-900">
                        User
                      </option>
                      <option value="moderator" className="bg-gray-900">
                        Moderator
                      </option>
                      <option value="admin" className="bg-gray-900">
                        Admin
                      </option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(
                          user.id,
                          e.target.value as User["status"]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        user.status
                      )} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="active" className="bg-gray-900">
                        Active
                      </option>
                      <option value="pending" className="bg-gray-900">
                        Pending
                      </option>
                      <option value="suspended" className="bg-gray-900">
                        Suspended
                      </option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-white/80">
                      {formatDate(user.lastActive)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-white/60">
                      {formatDate(user.createdAt)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                        aria-label="Edit user"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteUser && onDeleteUser(user.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                        aria-label="Delete user"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No users found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
