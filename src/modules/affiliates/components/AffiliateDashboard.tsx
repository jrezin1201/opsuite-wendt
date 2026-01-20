"use client";

import React, { useState } from "react";

export interface AffiliateStats {
  totalEarnings: number;
  pendingCommission: number;
  paidOut: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  clicksThisMonth: number;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  plan: string;
  status: "active" | "churned" | "trial";
  commission: number;
  lifetime: number;
}

export interface PayoutHistory {
  id: string;
  date: Date;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: string;
}

export function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const [stats] = useState<AffiliateStats>({
    totalEarnings: 12450,
    pendingCommission: 850,
    paidOut: 11600,
    totalReferrals: 47,
    activeReferrals: 38,
    conversionRate: 23.5,
    clicksThisMonth: 324,
  });

  const affiliateLink = "https://yourapp.com/ref/ABC123XYZ";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="💰"
          label="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          change="+$850 this month"
          trend="up"
        />
        <StatCard
          icon="⏳"
          label="Pending Commission"
          value={`$${stats.pendingCommission}`}
          change="Pays out in 7 days"
          trend="neutral"
        />
        <StatCard
          icon="👥"
          label="Active Referrals"
          value={`${stats.activeReferrals}/${stats.totalReferrals}`}
          change="+3 this week"
          trend="up"
        />
        <StatCard
          icon="📊"
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+2.5% vs last month"
          trend="up"
        />
      </div>

      {/* Affiliate Link */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-4">Your Affiliate Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded text-white font-mono text-sm"
          />
          <button
            onClick={handleCopyLink}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition-colors"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <p className="text-sm text-white/60 mt-3">
          Share this link to earn 30% commission on all referred subscriptions
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ReferralsTable />
          <PerformanceChart />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <PayoutCard stats={stats} />
          <PayoutHistoryCard />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, trend }: {
  icon: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {trend !== "neutral" && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40">{change}</p>
    </div>
  );
}

function ReferralsTable() {
  const referrals: Referral[] = [
    { id: "1", name: "John Doe", email: "john@example.com", signupDate: new Date(2024, 10, 15), plan: "Pro", status: "active", commission: 29, lifetime: 174 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", signupDate: new Date(2024, 11, 1), plan: "Enterprise", status: "active", commission: 99, lifetime: 99 },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", signupDate: new Date(2024, 10, 20), plan: "Starter", status: "trial", commission: 0, lifetime: 0 },
    { id: "4", name: "Alice Brown", email: "alice@example.com", signupDate: new Date(2024, 9, 10), plan: "Pro", status: "churned", commission: 0, lifetime: 87 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white">Recent Referrals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">User</th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Plan</th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Status</th>
              <th className="text-right text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">Commission</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{referral.name}</p>
                    <p className="text-xs text-white/60">{referral.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-white">{referral.plan}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    referral.status === "active" ? "bg-green-500/20 text-green-400" :
                    referral.status === "trial" ? "bg-blue-500/20 text-blue-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {referral.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-sm font-semibold text-white">${referral.commission}/mo</p>
                  <p className="text-xs text-white/60">${referral.lifetime} lifetime</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformanceChart() {
  const monthlyData = [
    { month: "Jul", clicks: 156, signups: 8, earnings: 232 },
    { month: "Aug", clicks: 234, signups: 12, earnings: 348 },
    { month: "Sep", clicks: 289, signups: 15, earnings: 435 },
    { month: "Oct", clicks: 312, signups: 18, earnings: 522 },
    { month: "Nov", clicks: 356, signups: 21, earnings: 609 },
    { month: "Dec", clicks: 324, signups: 19, earnings: 551 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <h3 className="font-semibold text-white mb-4">Performance Over Time</h3>
      <div className="space-y-4">
        {monthlyData.map((data) => (
          <div key={data.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">{data.month}</span>
              <div className="flex gap-4 text-xs">
                <span className="text-blue-400">{data.clicks} clicks</span>
                <span className="text-green-400">{data.signups} signups</span>
                <span className="text-purple-400">${data.earnings}</span>
              </div>
            </div>
            <div className="h-8 bg-white/10 rounded overflow-hidden flex">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${(data.signups / 25) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutCard({ stats }: { stats: AffiliateStats }) {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6">
      <h3 className="font-semibold text-white mb-4">Next Payout</h3>
      <p className="text-4xl font-bold text-white mb-2">${stats.pendingCommission}</p>
      <p className="text-sm text-white/60 mb-4">Scheduled for Jan 1, 2025</p>
      <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition-colors">
        Request Early Payout
      </button>
    </div>
  );
}

function PayoutHistoryCard() {
  const payouts: PayoutHistory[] = [
    { id: "1", date: new Date(2024, 11, 1), amount: 850, status: "completed", method: "PayPal" },
    { id: "2", date: new Date(2024, 10, 1), amount: 920, status: "completed", method: "Bank Transfer" },
    { id: "3", date: new Date(2024, 9, 1), amount: 780, status: "completed", method: "PayPal" },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h3 className="font-semibold text-white mb-4">Payout History</h3>
      <div className="space-y-3">
        {payouts.map((payout) => (
          <div key={payout.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">${payout.amount}</p>
              <p className="text-xs text-white/60">{payout.date.toLocaleDateString()}</p>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
              {payout.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
