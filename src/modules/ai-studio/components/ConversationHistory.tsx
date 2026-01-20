"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string;
  timestamp: Date;
  model: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onNewConversation?: () => void;
}

export function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ConversationHistoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onSelectConversation) {
      onSelectConversation(id);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteConversation) {
      onDeleteConversation(id);
    }
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Conversation History
            </h3>
            <p className="text-sm text-white/60">{conversations.length} chats</p>
          </div>
          {onNewConversation && (
            <Button onClick={onNewConversation} size="sm">
              New Chat
            </Button>
          )}
        </div>

        {/* Conversations List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {conversations.map((conversation) => {
            const isSelected = selectedId === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => handleSelect(conversation.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-purple-500/20 border-purple-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1 truncate">
                      {conversation.title}
                    </h4>
                    <p className="text-sm text-white/60 mb-2 truncate">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{conversation.messageCount} messages</span>
                      <span>•</span>
                      <span>{conversation.model}</span>
                      <span>•</span>
                      <span>{formatDate(conversation.timestamp)}</span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {onDeleteConversation && (
                    <button
                      onClick={(e) => handleDelete(conversation.id, e)}
                      className="flex-shrink-0 p-2 text-white/40 hover:text-red-400 transition-colors"
                      aria-label="Delete conversation"
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
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-white/20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-white/40 mb-4">No conversations yet</p>
            {onNewConversation && (
              <Button onClick={onNewConversation}>Start Your First Chat</Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
