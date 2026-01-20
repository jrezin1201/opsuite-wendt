"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
}

interface CommentSystemProps {
  comments: Comment[];
  onCommentAdd?: (content: string, parentId?: string) => void;
  onCommentLike?: (commentId: string) => void;
  maxDepth?: number;
}

function CommentItem({
  comment,
  depth = 0,
  maxDepth = 3,
  onReply,
  onLike,
}: {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
  onReply?: (parentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.avatar ? (
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {getInitials(comment.author)}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 rounded-lg p-3 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm">
                {comment.author}
              </span>
              <span className="text-xs text-white/40">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="text-white/80 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => onLike && onLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.isLiked
                  ? "text-purple-400"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={comment.isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                Reply
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {showReplies ? "Hide" : "Show"} {comment.replies?.length}{" "}
                {comment.replies?.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mb-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleReplySubmit}>
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {hasReplies && showReplies && (
            <div className="space-y-4 mt-4">
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSystem({
  comments,
  onCommentAdd,
  onCommentLike,
  maxDepth = 3,
}: CommentSystemProps) {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");

  const handleSubmitComment = () => {
    if (newComment.trim() && onCommentAdd) {
      onCommentAdd(newComment);
      setNewComment("");
    }
  };

  const handleReply = (parentId: string, content: string) => {
    if (onCommentAdd) {
      onCommentAdd(content, parentId);
    }
  };

  const sortComments = (comments: Comment[]): Comment[] => {
    const sorted = [...comments];

    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case "popular":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
    }

    return sorted;
  };

  const sortedComments = sortComments(comments);

  return (
    <div className="space-y-6">
      {/* New Comment */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Leave a Comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-white/40">
              Be respectful and constructive
            </p>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
          className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="newest" className="bg-gray-900">
            Newest First
          </option>
          <option value="oldest" className="bg-gray-900">
            Oldest First
          </option>
          <option value="popular" className="bg-gray-900">
            Most Popular
          </option>
        </select>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            maxDepth={maxDepth}
            onReply={handleReply}
            onLike={onCommentLike}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <p className="text-white/40">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
