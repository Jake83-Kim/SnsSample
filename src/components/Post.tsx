"use client";

import React from 'react';
import type { Post } from '../types';

interface PostProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  onComment: (id: string, comment: string) => void;
}

const PostCard: React.FC<PostProps> = ({ post, onLike, onSave, onShare, onDelete, onComment }) => {
  const [comment, setComment] = React.useState('');
  const comments = Array.isArray(post.comments) ? post.comments : [];

  const handleComment = () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment('');
  };

  return (
    <article className="reddit-post rounded-[20px] p-3">
      <div className="flex gap-3">
        <div className="hidden w-14 shrink-0 flex-col items-center rounded-[16px] bg-[var(--surface-muted)] px-2 py-3 sm:flex">
          <button
            onClick={() => onLike(post.id)}
            className={`rounded-full px-2 py-1 text-lg font-bold leading-none ${
              post.isLiked ? 'text-[var(--brand-orange)]' : 'text-[var(--muted)]'
            }`}
            aria-label="업보트"
          >
            ▲
          </button>
          <span className="mt-2 text-sm font-bold text-[var(--ink)]">{post.likes}</span>
          <button
            onClick={() => onSave(post.id)}
            className={`mt-2 rounded-full px-2 py-1 text-lg leading-none ${
              post.isSaved ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
            }`}
            aria-label="저장"
          >
            ★
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--muted)]">
                {post.communitySlug || 'Home'} · @{post.handle} · {post.timeAgo}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-7 text-[var(--ink)]">
                {post.communityName ? `${post.communityName} 스레드` : post.location}
              </h3>
            </div>

            {post.isMine ? (
              <button
                onClick={() => onDelete(post.id)}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
              >
                삭제
              </button>
            ) : (
              <button className="rounded-full px-2 py-1 text-lg text-[var(--muted)]">⋯</button>
            )}
          </div>

          <div className="mt-3 flex gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-7 text-[var(--ink)]">{post.content}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {post.image ? (
              <div
                className="hidden h-24 w-24 shrink-0 rounded-[16px] bg-cover bg-center md:block"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <button
              onClick={() => onLike(post.id)}
              className="rounded-full bg-[var(--surface-muted)] px-3 py-2 font-semibold hover:text-[var(--ink)] sm:hidden"
            >
              업보트 {post.likes}
            </button>
            <button
              onClick={() => onSave(post.id)}
              className="rounded-full bg-[var(--surface-muted)] px-3 py-2 font-semibold hover:text-[var(--ink)]"
            >
              저장 {post.saves}
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="rounded-full bg-[var(--surface-muted)] px-3 py-2 font-semibold hover:text-[var(--ink)]"
            >
              공유 {post.shares}
            </button>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2 font-semibold">댓글 {comments.length}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="댓글을 남겨보세요"
              className="w-full rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={handleComment}
              className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-bold text-white"
            >
              댓글
            </button>
          </div>

          {comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {comments.slice(-2).map((commentItem) => (
                <div key={commentItem.id} className="rounded-[16px] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    {commentItem.author} · @{commentItem.handle} · {commentItem.timeAgo}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--ink)]">{commentItem.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
