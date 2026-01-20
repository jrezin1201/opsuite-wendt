"use client";

import React, { useState } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  required?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar?: string;
  };
  points: number;
  level: number;
  badges: number;
}

export function GamificationDashboard() {
  const [view, setView] = useState<"overview" | "badges" | "achievements" | "leaderboard">("overview");
  const userPoints = 2450;
  const userLevel = 12;
  const pointsToNextLevel = 550;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* User Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon="⭐" label="Total Points" value={userPoints.toLocaleString()} change="+125 this week" />
        <StatCard icon="🏆" label="Current Level" value={userLevel.toString()} change={`${pointsToNextLevel} to next`} />
        <StatCard icon="🎖️" label="Badges Earned" value="8/24" change="3 available" />
        <StatCard icon="🎯" label="Achievements" value="15/30" change="50% complete" />
      </div>

      {/* Level Progress */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white">Level {userLevel} Progress</h3>
            <p className="text-sm text-white/60">{userPoints - (userLevel - 1) * 1000} / {userLevel * 1000} XP</p>
          </div>
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300 text-sm font-medium">
            Level {userLevel + 1} Soon!
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all"
            style={{ width: `${((userPoints - (userLevel - 1) * 1000) / (userLevel * 1000)) * 100}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["overview", "badges", "achievements", "leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab as typeof view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              view === tab
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === "overview" && <OverviewTab />}
      {view === "badges" && <BadgesTab />}
      {view === "achievements" && <AchievementsTab />}
      {view === "leaderboard" && <LeaderboardTab />}
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: string; label: string; value: string; change: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40">{change}</p>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
        {generateMockAchievements().slice(0, 3).map((achievement) => (
          <div key={achievement.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-3xl">{achievement.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-sm text-white/60">{achievement.description}</p>
                <p className="text-xs text-purple-400 mt-2">+{achievement.points} points</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Newest Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {generateMockBadges().slice(0, 6).map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 text-center ${
                badge.earned
                  ? "bg-white/10 border-purple-500/50"
                  : "bg-white/5 border-white/10 opacity-50"
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-xs font-medium text-white">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BadgesTab() {
  const badges = generateMockBadges();
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">All Badges ({earned}/{badges.length})</h3>
        <div className="flex gap-2">
          {["all", "earned", "locked"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-sm capitalize transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              badge.earned
                ? getRarityStyle(badge.rarity)
                : "bg-white/5 border-white/10 opacity-40 grayscale"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-sm font-medium text-white mb-1">{badge.name}</p>
              <p className="text-xs text-white/60">{badge.description}</p>
              {badge.progress !== undefined && badge.required && (
                <div className="mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(badge.progress / badge.required) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">{badge.progress}/{badge.required}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab() {
  const achievements = generateMockAchievements();
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Achievements ({unlocked}/{achievements.length})
      </h3>

      <div className="space-y-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all ${
              achievement.unlocked
                ? "bg-white/10 border-purple-500/50"
                : "bg-white/5 border-white/10 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${achievement.unlocked ? "bg-purple-500/20" : "bg-white/5"} flex items-center justify-center text-2xl`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-sm text-white/60">{achievement.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-400">+{achievement.points}</p>
                <p className="text-xs text-white/40">points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardTab() {
  const leaderboard = generateMockLeaderboard();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Top Players</h3>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`p-4 rounded-lg border ${
              entry.rank <= 3
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${
                entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                entry.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                entry.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                "bg-white/10 text-white/60"
              } flex items-center justify-center font-bold text-lg`}>
                #{entry.rank}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{entry.user.name}</h4>
                <p className="text-sm text-white/60">Level {entry.level} • {entry.badges} badges</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-white/40">points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRarityStyle(rarity: Badge["rarity"]): string {
  const styles = {
    common: "bg-gray-500/10 border-gray-500/50",
    rare: "bg-blue-500/10 border-blue-500/50",
    epic: "bg-purple-500/10 border-purple-500/50",
    legendary: "bg-yellow-500/10 border-yellow-500/50",
  };
  return styles[rarity];
}

function generateMockBadges(): Badge[] {
  return [
    { id: "1", name: "First Steps", description: "Complete onboarding", icon: "🎯", rarity: "common", earned: true, earnedDate: new Date() },
    { id: "2", name: "Deal Maker", description: "Close 10 deals", icon: "💼", rarity: "rare", earned: true, progress: 10, required: 10 },
    { id: "3", name: "Team Player", description: "Invite 5 teammates", icon: "👥", rarity: "common", earned: true },
    { id: "4", name: "Speed Demon", description: "Complete task in under 5min", icon: "⚡", rarity: "epic", earned: false, progress: 3, required: 5 },
    { id: "5", name: "Perfect Week", description: "7 day streak", icon: "🔥", rarity: "rare", earned: false, progress: 4, required: 7 },
    { id: "6", name: "Legend", description: "Reach level 50", icon: "👑", rarity: "legendary", earned: false, progress: 12, required: 50 },
  ];
}

function generateMockAchievements(): Achievement[] {
  return [
    { id: "1", title: "First Deal", description: "Close your first deal", points: 100, icon: "🎉", unlocked: true, unlockedDate: new Date() },
    { id: "2", title: "Team Builder", description: "Invite 5 team members", points: 150, icon: "🤝", unlocked: true },
    { id: "3", title: "Revenue Milestone", description: "Generate $100K in deals", points: 500, icon: "💰", unlocked: false },
    { id: "4", title: "Consistent Performer", description: "30 day activity streak", points: 300, icon: "📅", unlocked: false },
    { id: "5", title: "Master Closer", description: "Close 100 deals", points: 1000, icon: "🏆", unlocked: false },
  ];
}

function generateMockLeaderboard(): LeaderboardEntry[] {
  const names = ["Sarah Chen", "Mike Rodriguez", "Emily Johnson", "David Kim", "Alex Turner", "Jessica Brown", "Chris Lee", "Amanda White"];
  return names.map((name, i) => ({
    rank: i + 1,
    user: { name },
    points: 5000 - i * 500,
    level: 15 - i,
    badges: 12 - i,
  }));
}
