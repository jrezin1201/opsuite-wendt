"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type Client } from "../lib/types";

// Mock data - in production, filter by session.user.clientId
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    company: "Acme Corp",
    email: "contact@acme.com",
    status: "active",
    totalValue: 250000,
    deals: 5,
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "TechStart Inc",
    company: "TechStart",
    email: "hello@techstart.com",
    status: "active",
    totalValue: 180000,
    deals: 3,
    joinedAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    name: "Global Solutions",
    company: "Global Sol",
    email: "info@global.com",
    status: "inactive",
    totalValue: 95000,
    deals: 2,
    joinedAt: new Date("2023-11-10"),
  },
];

export function ClientPortal() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) => {
    const matchesFilter =
      filter === "all" || client.status === filter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Portal</h1>
          <p className="text-white/60 mt-1">
            Manage and view your client relationships
          </p>
        </div>
        <Button>Add Client</Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Status Filter */}
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-white/60 mb-1">Total Clients</p>
            <p className="text-3xl font-bold text-white">{clients.length}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-white/60 mb-1">Active Clients</p>
            <p className="text-3xl font-bold text-green-400">
              {clients.filter((c) => c.status === "active").length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-white/60 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(
                clients.reduce((sum, c) => sum + c.totalValue, 0)
              )}
            </p>
          </div>
        </Card>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} hover={true}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {client.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3">{client.email}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-white/40">Lifetime Value:</span>{" "}
                      <span className="text-white font-semibold">
                        {formatCurrency(client.totalValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40">Deals:</span>{" "}
                      <span className="text-white font-semibold">
                        {client.deals}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40">Joined:</span>{" "}
                      <span className="text-white font-semibold">
                        {formatDate(client.joinedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Contact</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredClients.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <p className="text-white/40">No clients found</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
